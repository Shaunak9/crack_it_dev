import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "dummy_key_to_bypass_build";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

const chatSession = model;

// Small helper to retry transient errors (5xx / 503) with exponential backoff.
export async function generateWithRetry(prompt, options = {}) {
  const maxRetries = options.maxRetries ?? 4;
  let delay = options.initialDelay ?? 500; // ms

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Keep existing usage: callers expect the same result object
      return await chatSession.generateContent(prompt);
    } catch (err) {
      const msg = String(err?.message || err);
      const isTransient = /5\d{2}|503|429|high demand|temporar|quota/i.test(msg) || (err?.status === 503 || err?.statusCode >= 500 && err?.statusCode < 600);

      if (!isTransient || attempt === maxRetries) {
        throw err;
      }

      // Wait and retry
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2;
    }
  }

  // Shouldn't reach here, but throw defensively
  throw new Error('Failed to generate content after retries');
}

export async function analyzeAttireWithGemini(base64Image) {
  try {
    const prompt = `Analyze this image of a person. Are they wearing STRICT business or business-casual attire? To pass, they MUST be wearing a clearly visible collar (like a button-up shirt, polo, or blouse) or a suit jacket/blazer. Look exceedingly closely at the neckline. Round-neck t-shirts, graphic tees, hoodies, and bare shoulders are STRICT FAILURES. If there is no collar visible, or it is clearly a simple t-shirt, set isFormal to false. Respond ONLY with a valid JSON format EXACTLY like this (no markdown): {"isFormal": boolean, "reason": "Short 1-sentence explanation focusing on whether a collar/suit was detected or if a t-shirt was detected."}`;
    
    // Strip the HTML data URL prefix
    const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg"
      }
    };
    
    // Vision capabilities are native to gemini-1.5-flash
    const result = await chatSession.generateContent([prompt, imagePart]);
    const text = result.response.text();
    
    // Extract JSON safely
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return { isFormal: true, reason: "Bypassed: Could not parse AI response." }; 
    const json = JSON.parse(match[0]);
    return json;
  } catch (err) {
    console.error("AI Vision Error:", err);
    // Fail safely so we never permanently block a user due to rate limits
    return { isFormal: true, reason: "AI service timeout, bypassing check." }; 
  }
}