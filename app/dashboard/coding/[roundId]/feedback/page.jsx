"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GetCodingRoundDetails } from '@/app/_actions/coding';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronLeft, TerminalSquare, AlertTriangle, Lightbulb } from 'lucide-react';

function CodingFeedback() {
    const params = useParams();
    const router = useRouter();
    const roundId = params.roundId;

    const [roundDetails, setRoundDetails] = useState(null);
    const [aiFeedback, setAiFeedback] = useState(null);

    useEffect(() => {
        if(roundId) {
            GetFeedbackDetails();
        }
    }, [roundId]);

    const GetFeedbackDetails = async () => {
        const result = await GetCodingRoundDetails(roundId);
        setRoundDetails(result);

        if (result?.aiFeedback) {
            try {
                setAiFeedback(JSON.parse(result.aiFeedback));
            } catch (e) {
                console.error("Could not parse AI Feedback");
            }
        }
    }

    if (!roundDetails) {
        return <div className="p-10 text-center animate-pulse">Loading Feedback...</div>;
    }

    return (
        <div className='p-6 md:p-10 max-w-4xl mx-auto'>
            {aiFeedback?.score >= 7 ? 
                <h2 className='text-3xl font-bold text-green-500 flex items-center gap-3'><CheckCircle2 className="w-8 h-8"/> Incredible Algorithm!</h2> :
                <h2 className='text-3xl font-bold text-yellow-500 flex items-center gap-3'><AlertTriangle className="w-8 h-8"/> Room for Optimization</h2>
            }
            
            <h2 className='font-bold text-2xl mt-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500'>
                Code Quality Score: {aiFeedback?.score}/10
            </h2>

            <div className="mt-8 bg-card border rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TerminalSquare className="text-primary"/> Senior AI Code Review
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-secondary p-4 rounded-xl border border-secondary">
                        <span className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Time Complexity</span>
                        <p className="font-mono text-xl mt-1 text-blue-400 font-bold">{aiFeedback?.timeComplexity || "O(N)"}</p>
                    </div>
                    
                    <div className="bg-secondary p-4 rounded-xl border border-secondary">
                        <span className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Space Complexity</span>
                        <p className="font-mono text-xl mt-1 text-purple-400 font-bold">{aiFeedback?.spaceComplexity || "O(1)"}</p>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-5 rounded-r-xl">
                    <h4 className="flex gap-2 items-center font-bold text-blue-600 dark:text-blue-400 mb-2">
                        <Lightbulb className="w-5 h-5"/> Detailed Analysis
                    </h4>
                    <p className="text-sm sm:text-base leading-relaxed text-blue-900 dark:text-blue-100">
                        {aiFeedback?.detailedFeedback || "Great attempt. Remember to check edge cases and handle null pointers appropriately."}
                    </p>
                </div>
                
                <div className="mt-6 border-t pt-6">
                   <h4 className="font-bold mb-3">Your Submitted Snapshot</h4>
                   <pre className="p-4 bg-black text-green-400 font-mono text-sm rounded-lg overflow-x-auto whitespace-pre-wrap">
                       {roundDetails.userCode}
                   </pre>
                </div>
            </div>

            <Button onClick={()=>router.replace('/dashboard')} className="mt-10 gap-2">
                <ChevronLeft className="w-4 h-4" /> Back to Dashboard
            </Button>
        </div>
    )
}

export default CodingFeedback;
