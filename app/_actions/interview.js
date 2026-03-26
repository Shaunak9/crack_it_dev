"use server";

import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq, desc, and, count } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';
import { currentUser } from '@clerk/nextjs/server';
import { generateWithRetry, analyzeAttireWithGemini } from '@/utils/GEMINI_AI';

// 1. Create a new Interview
export async function CreateMockInterview(data) {
  const { jsonMockResp, jobPosition, jobDesc, jobExperience, createdBy } = data;
  
  try {
    const mockID = uuidv4();
    
    // Parse questions
    let parsedQuestions = typeof jsonMockResp === 'string' ? JSON.parse(jsonMockResp) : jsonMockResp;
    
    const result = await db.insert(MockInterview).values({
      mockID: mockID,
      jsonMockResp: jsonMockResp,
      jobPosition: jobPosition,
      jobDescription: jobDesc,
      jobExperience: jobExperience,
      createdBy: createdBy,
      createdAt: new Date().toLocaleDateString('en-GB'),
    }).returning({ mockID: MockInterview.mockID });

    return result;
  } catch (error) {
    console.error("Error creating interview:", error);
    throw new Error("Failed to create interview");
  }
}

// 2. Fetch all interviews for a user
export async function GetInterviews(userEmail, limit = 10, offset = 0) {
  try {
    const user = await currentUser();
    const primaryEmail = user?.primaryEmailAddress?.emailAddress;
    if (!primaryEmail || primaryEmail !== userEmail) throw new Error("Unauthorized");

    const result = await db.select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, userEmail))
      .orderBy(desc(MockInterview.id))
      .limit(limit)
      .offset(offset);
    return result;
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return [];
  }
}

// 3. Fetch specific interview details
export async function GetInterviewDetails(interviewID) {
  try {
    const user = await currentUser();
    const primaryEmail = user?.primaryEmailAddress?.emailAddress;
    if (!primaryEmail) throw new Error("Unauthorized");

    const result = await db.select()
      .from(MockInterview)
      .where(and(
        eq(MockInterview.mockID, interviewID),
        eq(MockInterview.createdBy, primaryEmail)
      ));
    return result[0]; // Return the first match
  } catch (error) {
    console.error("Error fetching interview details:", error);
    return null;
  }
}

// 4. Save User Answer
export async function SaveUserAnswer(data) {
  try {
    const user = await currentUser();
    const primaryEmail = user?.primaryEmailAddress?.emailAddress;
    if (!primaryEmail || primaryEmail !== data.userEmail) throw new Error("Unauthorized");

    await db.insert(UserAnswer).values({
        mockID: data.mockIDRef,
        question: data.question,
        correctAnswer: data.correctAnswer,
        userAnswer: data.userAnswer,
        feedback: data.feedback,
        rating: data.rating,
        userEmail: data.userEmail,
        createdAt: new Date().toLocaleDateString('en-GB')
    });
    return true;
  } catch (error) {
    console.error("Error saving answer:", error);
    throw error;
  }
}

// 5. Delete Interview
export async function DeleteInterview(mockID) {
    try {
        const user = await currentUser();
        const primaryEmail = user?.primaryEmailAddress?.emailAddress;
        if (!primaryEmail) throw new Error("Unauthorized");

        const result = await db.delete(MockInterview).where(and(
          eq(MockInterview.mockID, mockID),
          eq(MockInterview.createdBy, primaryEmail)
        ));
        return true;
    } catch (error) {
        console.error("Error deleting interview:", error);
        return false;
    }
}

// 6. Get Feedback/Answers
export async function GetFeedbackList(interviewID) {
    try {
        const user = await currentUser();
        const primaryEmail = user?.primaryEmailAddress?.emailAddress;
        if (!primaryEmail) throw new Error("Unauthorized");

        // First verify ownership of the interview
        const interview = await db.select().from(MockInterview)
            .where(and(eq(MockInterview.mockID, interviewID), eq(MockInterview.createdBy, primaryEmail)));
        if(interview.length === 0) throw new Error("Unauthorized");

        const result = await db.select()
            .from(UserAnswer)
            .where(and(
              eq(UserAnswer.mockID, interviewID)
            ))
            .orderBy(UserAnswer.id);
        return result;
    } catch (error) {
        console.error("Error fetching feedback:", error);
        return [];
    }
}

// 7. Get Interviews Count (Optimized)
export async function GetInterviewCount(userEmail) {
  try {
    const user = await currentUser();
    const primaryEmail = user?.primaryEmailAddress?.emailAddress;
    if (!primaryEmail || primaryEmail !== userEmail) return 0;

    const result = await db.select({ value: count() })
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, userEmail));
    
    return result[0].value;
  } catch (error) {
    console.error("Error fetching interview count:", error);
    return 0;
  }
}

export async function AnalyzeAttireAction(base64Image) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");
    return await analyzeAttireWithGemini(base64Image);
  } catch (err) {
    console.error("AnalyzeAttireAction error", err);
    return { isFormal: true, reason: "Bypassed via fallback" };
  }
}

export async function EvaluateAndSaveUserAnswer(data) {
  try {
    const user = await currentUser();
    const primaryEmail = user?.primaryEmailAddress?.emailAddress;
    if (!primaryEmail || primaryEmail !== data.userEmail) throw new Error("Unauthorized");

    const feedbackPrompt = `Question: ${data.question}, User Answer: ${data.userAnswer}. Depends on question and user answer for given interview question please give us rating for answer and feedback as area of improvement if any in just 3 to 5 lines to improve it in JSON format with field rating and feedback`;

    const result = await generateWithRetry(feedbackPrompt, { maxRetries: 3 });
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No valid JSON found in response');
    const JsonFeedbackResp = JSON.parse(jsonMatch[0]);

    await db.insert(UserAnswer).values({
        mockID: data.mockIDRef,
        question: data.question,
        correctAnswer: data.correctAnswer,
        userAnswer: data.userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: data.userEmail,
        createdAt: new Date().toLocaleDateString('en-GB')
    });
    return true;
  } catch (error) {
    console.error("Error evaluating/saving answer:", error);
    throw error;
  }
}