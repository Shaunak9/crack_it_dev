import { currentUser } from '@clerk/nextjs/server';
import { generateWithRetry } from '@/utils/GEMINI_AI';
import { CreateMockInterview } from '@/app/_actions/interview';
import { CreateMockMcq } from '@/app/_actions/mcq';
import { CreateMockCodingRound } from '@/app/_actions/coding';

export const maxDuration = 60; // 60 seconds to prevent Vercel 504 Timeouts

export async function POST(req) {
  try {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, jobPosition, jobDescription, jobExperience, codingLanguage } = body;

    let InputPrompt = "";
    if (type === "interview") {
      const questionCount = process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5;
      InputPrompt = `Create ${questionCount} interview questions for a ${jobPosition} role with ${jobExperience} years of experience. Tech stack: ${jobDescription}. 
Return ONLY this JSON format:
{"questions": [{"question": "question text", "answer": "answer text"}]}`;
    } else if (type === "mcq") {
      InputPrompt = `Create 5 multiple choice questions for a ${jobPosition} role with ${jobExperience} years of experience. Tech stack: ${jobDescription}. 
Return ONLY this JSON format:
{"questions": [{"question": "question text", "options": ["option 1", "option 2", "option 3", "option 4"], "correctAnswer": "correct option text"}]}`;
    } else if (type === "coding") {
      InputPrompt = `Create a challenging technical algorithmic coding problem for a ${jobPosition} role with ${jobExperience} years of experience. The expected programming language is ${codingLanguage}. Tech stack: ${jobDescription}. 
Return ONLY this JSON format:
{"problemStatement": "Detailed description of the algorithmic coding puzzle", "examples": [{"input": "example input format", "output": "example output format"}], "constraints": ["constraint 1", "constraint 2"], "startingCode": "starter syntax function template in ${codingLanguage} matching the problem"}`;
    } else {
      return Response.json({ error: 'Invalid generation type' }, { status: 400 });
    }

    // Call Gemini API centrally on the server
    const result = await generateWithRetry(InputPrompt, { maxRetries: 3 });
    const rawResponse = result.response.text();
    
    // Safely extract the JSON (even if responseMimeType is set, it might still have markdown wrapping sometimes)
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }
    
    const MockJSONResponse = jsonMatch[0];
    
    // Verify it parses correctly before saving
    JSON.parse(MockJSONResponse);

    // Save to database based on type
    let returnId = null;
    if (type === "interview") {
      const resp = await CreateMockInterview({
        jsonMockResp: MockJSONResponse,
        jobPosition,
        jobDesc: jobDescription,
        jobExperience,
        createdBy: email,
      });
      returnId = resp[0]?.mockID;
    } else if (type === "mcq") {
      const resp = await CreateMockMcq({
        jsonMockResp: MockJSONResponse,
        jobPosition,
        jobDesc: jobDescription,
        jobExperience,
        createdBy: email,
      });
      returnId = resp[0]?.mcqId;
    } else if (type === "coding") {
      const resp = await CreateMockCodingRound({
        jsonMockResp: MockJSONResponse,
        jobPosition,
        jobDesc: jobDescription,
        jobExperience,
        codingLanguage,
        createdBy: email,
      });
      returnId = resp[0]?.roundId;
    }

    if (!returnId) {
      throw new Error("Failed to insert record into database");
    }

    return Response.json({ id: returnId });

  } catch (error) {
    console.error("API /generate Error:", error);
    return Response.json(
      { error: error?.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
}
