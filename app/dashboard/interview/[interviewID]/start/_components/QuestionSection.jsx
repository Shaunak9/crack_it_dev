"use client"
import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionSection({ mockInterviewQuestions, activeQuestionIndex, onQuestionSelect }) {

    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Cancel any previous speech
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        } else {
            alert("Sorry, your browser does not support text to speech.");
        }
    }

    return mockInterviewQuestions && Array.isArray(mockInterviewQuestions) && mockInterviewQuestions.length > 0 && (
        <div className='p-5 border rounded-lg md:h-96 my-4 md:my-10 overflow-y-auto w-full'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {mockInterviewQuestions && mockInterviewQuestions.map((question, index) => (
                    <h2 
                        key={`q-${index}`}
                        onClick={() => onQuestionSelect?.(index)}
                        className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer transition-colors ${
                            activeQuestionIndex === index 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                        }`}
                    >
                        Question #{index + 1}
                    </h2>
                ))}
            </div>
            
            <h2 className='my-5 text-md md:text-lg'>
                {mockInterviewQuestions[activeQuestionIndex]?.question}
            </h2>
            
            <Volume2 
                className='cursor-pointer' 
                onClick={() => textToSpeech(mockInterviewQuestions[activeQuestionIndex]?.question)} 
            />

        </div>
    )
}

export default React.memo(QuestionSection);