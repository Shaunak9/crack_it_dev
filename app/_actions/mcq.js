"use server";

import { db } from "@/utils/db";
import { MockMcq } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { eq, desc, and } from "drizzle-orm";
import { currentUser } from '@clerk/nextjs/server';

export async function CreateMockMcq(data) {
  const { jsonMockResp, jobPosition, jobDesc, jobExperience, createdBy } = data;
  
  try {
    const mcqId = uuidv4();
    
    // Test if parsing works
    typeof jsonMockResp === 'string' ? JSON.parse(jsonMockResp) : jsonMockResp;
    
    const result = await db.insert(MockMcq).values({
      mcqId: mcqId,
      jsonMockResp: jsonMockResp,
      jobPosition: jobPosition,
      jobDescription: jobDesc,
      jobExperience: jobExperience,
      createdBy: createdBy,
      createdAt: new Date().toLocaleDateString('en-GB'),
    }).returning({ mcqId: MockMcq.mcqId });

    return result;
  } catch (error) {
    console.error("Error creating MCQ:", error);
    throw new Error("Failed to create MCQ prep");
  }
}

export async function GetMcqDetails(mcqId) {
  try {
    const user = await currentUser();
    const primaryEmail = user?.primaryEmailAddress?.emailAddress;
    if (!primaryEmail) throw new Error("Unauthorized");

    const result = await db.select()
      .from(MockMcq)
      .where(and(
        eq(MockMcq.mcqId, mcqId),
        eq(MockMcq.createdBy, primaryEmail)
      ));
    return result[0];
  } catch (error) {
    console.error("Error fetching MCQ details:", error);
    return null;
  }
}

export async function UpdateMcqScore(data) {
  try {
    const user = await currentUser();
    const primaryEmail = user?.primaryEmailAddress?.emailAddress;
    if (!primaryEmail) throw new Error("Unauthorized");

    const { mcqId, score, userAnswers } = data;
    await db.update(MockMcq)
      .set({ score: String(score), userAnswers: userAnswers })
      .where(and(
        eq(MockMcq.mcqId, mcqId),
        eq(MockMcq.createdBy, primaryEmail)
      ));
    return true;
  } catch (error) {
    console.error("Error updating MCQ score:", error);
    return false;
  }
}

export async function GetMcqsByUser(email, limit = 10, offset = 0) {
  try {
    const user = await currentUser();
    const primaryEmail = user?.primaryEmailAddress?.emailAddress;
    if (!primaryEmail || primaryEmail !== email) throw new Error("Unauthorized");

    const result = await db.select()
      .from(MockMcq)
      .where(eq(MockMcq.createdBy, email))
      .orderBy(desc(MockMcq.id))
      .limit(limit)
      .offset(offset);
    return result;
  } catch (error) {
    console.error("Error fetching user MCQs:", error);
    return [];
  }
}

export async function DeleteMockMcq(mcqId) {
  try {
    const user = await currentUser();
    const primaryEmail = user?.primaryEmailAddress?.emailAddress;
    if (!primaryEmail) throw new Error("Unauthorized");

    await db.delete(MockMcq).where(and(
      eq(MockMcq.mcqId, mcqId),
      eq(MockMcq.createdBy, primaryEmail)
    ));
    return true;
  } catch (error) {
    console.error("Error deleting MCQ:", error);
    return false;
  }
}

export async function GetMcqStats(email) {
  try {
    const user = await currentUser();
    const primaryEmail = user?.primaryEmailAddress?.emailAddress;
    if (!primaryEmail || primaryEmail !== email) return [];

    // Only fetch the score column, omitting the heavy JSON mock response
    const result = await db.select({ score: MockMcq.score })
      .from(MockMcq)
      .where(eq(MockMcq.createdBy, email));
      
    return result;
  } catch (error) {
    console.error("Error fetching MCQ stats:", error);
    return [];
  }
}
