import { GetMcqDetails } from '@/app/_actions/mcq';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

async function McqInterviewPage({ params }) {
  const resolvedParams = await params;
  const mcqId = resolvedParams.mcqId;
  const mcqData = await GetMcqDetails(mcqId);

  if (!mcqData) {
    return <div className="p-10 text-center">MCQ Practice not found.</div>;
  }

  let questions = [];
  try {
    const parsed = typeof mcqData.jsonMockResp === 'string' ? JSON.parse(mcqData.jsonMockResp) : mcqData.jsonMockResp;
    questions = parsed.questions || [];
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-4">MCQ Interview Ready!</h1>
      <div className="bg-card border rounded-xl p-8 max-w-xl w-full text-center shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Role: {mcqData.jobPosition}</h2>
        <p className="text-muted-foreground mb-4">Tech Stack: {mcqData.jobDescription}</p>
        <p className="text-muted-foreground mb-8">Experience: {mcqData.jobExperience} Years</p>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg mb-8">
          <strong>Instructions:</strong> You will be presented with {questions.length} multiple-choice questions generated specifically for your role by AI. Answer all questions to see your final score and feedback!
        </div>

        <Link href={`/dashboard/mcq/${mcqId}/start`}>
          <Button className="w-full text-lg p-6 bg-blue-600 hover:bg-blue-700">Start Practice</Button>
        </Link>
      </div>
    </div>
  )
}

export default McqInterviewPage;
