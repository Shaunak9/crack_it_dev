import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

function HowItWorks() {

    return(
        <div className='min-h-screen bg-background p-10 flex flex-col items-center'>
            <div className='my-5 text-center max-w-3xl'>
                <h2 className='font-bold text-4xl mb-4 text-primary'>How It Works?</h2>
                <h2 className='text-muted-foreground text-lg'>Here is a simple guide on how to use this AI Mock Interviewer</h2>
            </div>
            
            <div className='bg-card text-card-foreground border rounded-2xl p-8 max-w-3xl w-full mt-10 shadow-sm'>
                <ul className='list-none flex flex-col gap-6 text-foreground leading-relaxed'>
                    <li className="flex gap-4 items-start">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">1</span>
                        <div><strong>Create Interview:</strong> Click on "Add New Interview", enter the Job Role, Description, and Experience level.</div>
                    </li>
                    <li className="flex gap-4 items-start">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">2</span>
                        <div><strong>AI Generation:</strong> Our AI (Gemini) will generate 5 relevant interview questions based on your input.</div>
                    </li>
                    <li className="flex gap-4 items-start">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">3</span>
                        <div><strong>Interaction:</strong> Allow camera and microphone access. You will see the questions one by one.</div>
                    </li>
                    <li className="flex gap-4 items-start">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">4</span>
                        <div><strong>Recording:</strong> Click "Record Answer", speak your response, and click "Stop Recording" to save it.</div>
                    </li>
                    <li className="flex gap-4 items-start">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">5</span>
                        <div><strong>Feedback:</strong> Once you finish all questions, you will get an instant detailed report with your rating, correct answers, and feedback for improvement.</div>
                    </li>
                </ul>
            </div>

            <div className='mt-12'>
                <Link href="/dashboard">
                    <Button 
                        size="lg"
                        className="rounded-full px-8"
                    >
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default HowItWorks;