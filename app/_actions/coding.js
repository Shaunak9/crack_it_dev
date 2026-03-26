"use server"

import { db } from "@/utils/db";
import { MockCodingRound } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';

import { eq, desc, and } from "drizzle-orm";
import { currentUser } from '@clerk/nextjs/server';
import { generateWithRetry } from '@/utils/GEMINI_AI';

export async function CreateMockCodingRound(formData) {
    try {
        const insertId = uuidv4();
        
        const resp = await db.insert(MockCodingRound)
        .values({
            roundId: insertId,
            jsonMockResp: formData.jsonMockResp,
            jobPosition: formData.jobPosition,
            jobDescription: formData.jobDesc,
            jobExperience: formData.jobExperience,
            codingLanguage: formData.codingLanguage,
            createdBy: formData.createdBy,
            createdAt: new Date().toLocaleDateString('en-GB')
        }).returning({roundId: MockCodingRound.roundId});

        return JSON.parse(JSON.stringify(resp));

    } catch (error) {
        console.error("Error creating Mock Coding Round:", error);
        return null;
    }
}

export async function GetCodingRoundDetails(roundId) {
    try {
        const user = await currentUser();
        const primaryEmail = user?.primaryEmailAddress?.emailAddress;
        if (!primaryEmail) throw new Error("Unauthorized");

        const result = await db.select()
            .from(MockCodingRound)
            .where(and(
                eq(MockCodingRound.roundId, roundId),
                eq(MockCodingRound.createdBy, primaryEmail)
            ));
        return JSON.parse(JSON.stringify(result[0]));
    } catch (error) {
        console.error("Error fetching Mock Coding Round:", error);
        return null;
    }
}

export async function SaveCodingFeedback(roundId, userCode, feedbackJson) {
    try {
        const user = await currentUser();
        const primaryEmail = user?.primaryEmailAddress?.emailAddress;
        if (!primaryEmail) throw new Error("Unauthorized");

        await db.update(MockCodingRound)
        .set({
            userCode: userCode,
            aiFeedback: JSON.stringify(feedbackJson),
            score: feedbackJson?.score?.toString()
        }).where(and(
            eq(MockCodingRound.roundId, roundId),
            eq(MockCodingRound.createdBy, primaryEmail)
        ));

        return true;
    } catch (error) {
        console.error("Error saving Feedback:", error);
        return false;
    }
}

export async function GetCodingRoundsByUser(email, limit = 10, offset = 0) {
  try {
    const user = await currentUser();
    const primaryEmail = user?.primaryEmailAddress?.emailAddress;
    if (!primaryEmail || primaryEmail !== email) throw new Error("Unauthorized");

    const result = await db.select()
      .from(MockCodingRound)
      .where(eq(MockCodingRound.createdBy, email))
      .orderBy(desc(MockCodingRound.id))
      .limit(limit)
      .offset(offset);
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error("Error fetching user Coding Rounds:", error);
    return [];
  }
}

export async function DeleteMockCodingRound(roundId) {
  try {
    const user = await currentUser();
    const primaryEmail = user?.primaryEmailAddress?.emailAddress;
    if (!primaryEmail) throw new Error("Unauthorized");

    await db.delete(MockCodingRound).where(and(
        eq(MockCodingRound.roundId, roundId),
        eq(MockCodingRound.createdBy, primaryEmail)
    ));
    return true;
  } catch (error) {
    console.error("Error deleting Coding Round:", error);
    return false;
  }
}

export async function EvaluateAndSaveCodingFeedback(roundId, userCode, problemDetails, codingLanguage) {
    try {
        const user = await currentUser();
        const primaryEmail = user?.primaryEmailAddress?.emailAddress;
        if (!primaryEmail) throw new Error("Unauthorized");

        const prompt = `You are a Senior Technical Interviewer. 
        The candidate was given this problem:
        "${problemDetails?.problemStatement}"
        Constraints: ${problemDetails?.constraints?.join(', ')}

        The candidate wrote this code in ${codingLanguage}:
        \`\`\`
        ${userCode}
        \`\`\`

        Evaluate the code carefully. 
        Return ONLY valid JSON format:
        {
          "isWorking": boolean,
          "timeComplexity": "Big-O notation",
          "spaceComplexity": "Big-O notation",
          "score": number out of 10,
          "detailedFeedback": "string highlighting bugs, optimizations, and syntax corrections in 3-5 sentences"
        }`;

        const result = await generateWithRetry(prompt, { maxRetries: 3 });
        const rawResponse = result.response.text();
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Failed to extract JSON from AI Output");
        const feedbackJson = JSON.parse(jsonMatch[0]);
        
        await db.update(MockCodingRound)
        .set({
            userCode: userCode,
            aiFeedback: JSON.stringify(feedbackJson),
            score: feedbackJson?.score?.toString()
        }).where(and(
            eq(MockCodingRound.roundId, roundId),
            eq(MockCodingRound.createdBy, primaryEmail)
        ));

        return true;
    } catch (error) {
        console.error("Error evaluating/saving coding feedback:", error);
        throw error;
    }
}
