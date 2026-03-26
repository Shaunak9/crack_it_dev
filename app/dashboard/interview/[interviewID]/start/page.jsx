"use client";
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GetInterviewDetails } from '@/app/_actions/interview'; // Server Action
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';

function StartInterview() {
    const params = useParams();
    const router = useRouter();
    const interviewID = params.interviewID;

    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        if (interviewID) GetDetails();
    }, [interviewID]);

    const GetDetails = async () => {
        const result = await GetInterviewDetails(interviewID);
        setInterviewData(result);

        try {
            let jsonMockResp;

            // Parse JSON if it's a string
            if (typeof result.jsonMockResp === 'string') {
                jsonMockResp = JSON.parse(result.jsonMockResp);
            } else {
                jsonMockResp = result.jsonMockResp;
            }

            console.log("Full JSON Response:", jsonMockResp);

            // FIX: Extract the array if it's wrapped in an object
            let questions = null;
            if (Array.isArray(jsonMockResp)) {
                questions = jsonMockResp;
            } else if (jsonMockResp?.interviewQuestions && Array.isArray(jsonMockResp.interviewQuestions)) {
                questions = jsonMockResp.interviewQuestions;
            } else if (jsonMockResp?.questions && Array.isArray(jsonMockResp.questions)) {
                questions = jsonMockResp.questions;
            }

            if (questions && questions.length > 0) {
                setMockInterviewQuestions(questions);
            } else {
                console.error("No valid questions found in response:", jsonMockResp);
                setMockInterviewQuestions([]);
            }
        } catch (error) {
            console.error("Error parsing interview data:", error);
            setMockInterviewQuestions([]);
        }
    }

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10'>
                {/* Questions */}
                <QuestionSection
                    mockInterviewQuestions={mockInterviewQuestions}
                    activeQuestionIndex={activeQuestionIndex}
                    onQuestionSelect={setActiveQuestionIndex}
                />

                {/* Recording Area */}
                <RecordAnswerSection
                    mockInterviewQuestions={mockInterviewQuestions}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                    onRecordStateChange={(state) => setIsRecording(state)}
                />
            </div>

            <div className='flex justify-center md:justify-end gap-6 mt-0 md:mt-5'>
                {activeQuestionIndex > 0 &&
                    <Button disabled={isRecording} onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>}

                {mockInterviewQuestions && activeQuestionIndex != mockInterviewQuestions.length - 1 &&
                    <Button disabled={isRecording} onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>}

                {mockInterviewQuestions && activeQuestionIndex == mockInterviewQuestions.length - 1 &&
                    <Button disabled={isRecording} onClick={() => router.push('/dashboard/interview/' + interviewData?.mockID + "/Feedback")}>
                        End Interview
                    </Button>}
            </div>
        </div>
    )
}

export default StartInterview