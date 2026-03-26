"use client"
import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GetFeedbackList } from '@/app/_actions/interview'; // Server Action
import { ChevronsUpDown } from 'lucide-react';

function Feedback() {
    const params = useParams();
    const router = useRouter();
    const [feedbackList, setFeedbackList] = useState([]);

    useEffect(() => {
        if(params.interviewID) {
            GetFeedback();
        }
    }, [params.interviewID]);

    const GetFeedback = async () => {
        const result = await GetFeedbackList(params.interviewID);
        setFeedbackList(result);
    }

    return (
        <div className='p-10'>
            {feedbackList?.length == 0 ?
                <h2 className='font-bold text-xl text-gray-500'>No Feedback Record Found</h2>
            :
                <>
                    <h2 className='text-3xl font-bold text-green-500'>Congratulations!</h2>
                    <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
                    
                    {/* Calculate average rating if you want, or just show list */}
                    {/* <h2 className='text-primary text-lg my-3'>Your overall interview rating: <strong>7/10</strong></h2> */}

                    <h2 className='text-sm text-gray-500'>Find below your interview question with correct answer, your answer and feedback for improvement</h2>
                    
                    {feedbackList.map((item, index) => (
                        <Collapsible key={index} className='mt-7'>
                            <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full'>
                                {item.question} <ChevronsUpDown className='h-5 w-5'/>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className='flex flex-col gap-2 p-5 border rounded-lg'>
                                    <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong> {item.rating}</h2>
                                    <h2 className='p-2 border rounded-lg bg-red-50 dark:bg-red-900/20 text-sm text-red-900 dark:text-red-100'><strong>Your Answer: </strong>{item.userAnswer}</h2>
                                    <h2 className='p-2 border rounded-lg bg-green-50 dark:bg-green-900/20 text-sm text-green-900 dark:text-green-100'><strong>Correct Answer: </strong>{item.correctAnswer}</h2>
                                    <h2 className='p-2 border rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-900 dark:text-blue-100'><strong>Feedback: </strong>{item.feedback}</h2>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </>
            }

            <Button onClick={() => router.replace('/dashboard')} className="mt-10">
                Go Home
            </Button>
        </div>
    )
}

export default Feedback