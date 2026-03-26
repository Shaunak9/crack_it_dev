"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { GetMcqDetails, UpdateMcqScore } from '@/app/_actions/mcq';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartMcqInterview() {
    const params = useParams();
    const mcqId = params.mcqId;

    const [mcqData, setMcqData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // { index: selectedOptionText }
    const [isFinished, setIsFinished] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (mcqId) GetDetails();
    }, [mcqId]);

    const GetDetails = async () => {
        const result = await GetMcqDetails(mcqId);
        setMcqData(result);
        if (result && result.jsonMockResp) {
            const parsed = typeof result.jsonMockResp === 'string' ? JSON.parse(result.jsonMockResp) : result.jsonMockResp;
            setQuestions(parsed.questions || []);

            if (result.userAnswers) {
                setUserAnswers(JSON.parse(result.userAnswers));
                setIsFinished(true); // Automatically show feedback if already taken!
            }
        }
    }

    const handleOptionSelect = (option) => {
        if (!isFinished) {
            setUserAnswers({ ...userAnswers, [activeQuestionIndex]: option });
        }
    }

    const calculateScore = () => {
        let score = 0;
        questions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correctAnswer) score++;
        });
        return score;
    }

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const finalScore = calculateScore();
        await UpdateMcqScore({
            mcqId: mcqId,
            score: finalScore,
            userAnswers: JSON.stringify(userAnswers)
        });
        setIsFinished(true);
        setIsSubmitting(false);
    }

    if (!questions.length) return <div className="p-10 text-center">Loading Questions...</div>;

    if (isFinished) {
        const score = calculateScore();
        return (
            <div className="p-10 flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-6">Quiz Finished!</h1>
                <div className="bg-card p-8 rounded-xl border shadow-sm w-full max-w-3xl text-center">
                    <h2 className="text-2xl mb-2">Your Score: <span className="text-blue-600 font-bold">{score} / {questions.length}</span></h2>

                    <div className="mt-8 text-left space-y-6">
                        {questions.map((q, idx) => {
                            const selected = userAnswers[idx];
                            const isCorrect = selected === q.correctAnswer;
                            return (
                                <div key={idx} className={`p-4 rounded-lg border text-left ${isCorrect
                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100'
                                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100'
                                    }`}>
                                    <p className="font-semibold mb-2">Q{idx + 1}: {q.question}</p>
                                    <p className="text-sm"><strong>Your Answer:</strong> {selected || "Skipped"}</p>
                                    {!isCorrect && <p className="text-sm text-green-700 dark:text-green-400 mt-2 font-medium">Correct Answer: {q.correctAnswer}</p>}
                                </div>
                            )
                        })}
                    </div>

                    <Link href="/dashboard">
                        <Button className="mt-8 px-8">Return to Dashboard</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[activeQuestionIndex];

    return (
        <div className="p-10 flex flex-col items-center min-h-[70vh]">
            <div className="w-full max-w-3xl flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold text-muted-foreground">Question {activeQuestionIndex + 1} of {questions.length}</h2>
            </div>

            <div className="bg-card w-full max-w-3xl rounded-xl border shadow-sm p-8">
                <h1 className="text-2xl font-bold mb-8">{currentQuestion.question}</h1>

                <div className="flex flex-col gap-4">
                    {currentQuestion.options.map((opt, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleOptionSelect(opt)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${userAnswers[activeQuestionIndex] === opt ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'hover:bg-accent'}`}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-3xl flex justify-between mt-8">
                <Button
                    variant="outline"
                    disabled={activeQuestionIndex === 0}
                    onClick={() => setActiveQuestionIndex(prev => prev - 1)}
                >
                    Previous
                </Button>

                {activeQuestionIndex < questions.length - 1 ? (
                    <Button onClick={() => setActiveQuestionIndex(prev => prev + 1)}>
                        Next Question
                    </Button>
                ) : (
                    <Button disabled={isSubmitting} onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                        {isSubmitting ? "Saving..." : "Submit Practice"}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default StartMcqInterview;
