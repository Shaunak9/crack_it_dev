"use client"
import useSpeechToText from 'react-hook-speech-to-text';
import { Button } from '@/components/ui/button'
import { Mic, StopCircle } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'sonner';
import { EvaluateAndSaveUserAnswer } from '@/app/_actions/interview';
import Webcam from 'react-webcam';

function RecordAnswerSection({ mockInterviewQuestions, activeQuestionIndex, interviewData, onRecordStateChange }) {
    const [userAnswer, setUserAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120);
    const webcamRef = useRef(null);
    const [isCameraCovered, setIsCameraCovered] = useState(false);

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    // 1. Accumulate speech results into a string
    useEffect(() => {
        setUserAnswer(results.map(result => result.transcript).join(' '));
    }, [results]);

    // Lift recording state up to parent to block navigation
    useEffect(() => {
        if (onRecordStateChange) {
            onRecordStateChange(isRecording);
        }
    }, [isRecording, onRecordStateChange]);

    const checkCameraQuality = () => {
        try {
            const video = webcamRef.current?.video;
            if (!video) return false; // If video stream is dropped, deny immediately

            const canvas = document.createElement("canvas");
            canvas.width = 64; // Heavy downsampling for rapid performance
            canvas.height = 48;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            let totalBrightness = 0;
            
            // Increment by 4 to loop through rgba pixels
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                totalBrightness += (r + g + b) / 3;
            }
            
            const avgBrightness = totalBrightness / (data.length / 4);
            
            // Screen is virtually black/covered. Increased to 25 to account for static/ISO noise in covered webcams
            if (avgBrightness < 25) return false; 
            return true;
        } catch (e) {
            // Hard deny if the canvas frame throws an exception
            return false; 
        }
    }

    // Monitor camera lighting constantly
    useEffect(() => {
        const interval = setInterval(() => {
            const isValid = checkCameraQuality();
            setIsCameraCovered(!isValid);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    // Also stop explicitly if it goes dark while recording
    useEffect(() => {
        if (isRecording && isCameraCovered) {
            stopSpeechToText();
            toast.error("Recording stopped: Camera blocked or too dark.");
            setLoading(false);
        }
    }, [isCameraCovered, isRecording, stopSpeechToText]);

    // 2. Button Handler: Decide whether to Start or Stop & Save
    const SaveUserAnswerToDB = async () => {
        if (isRecording) {
            // STOP RECORDING
            stopSpeechToText();
            
            if(userAnswer.length < 2) {
                setLoading(false);
                toast('Error: Answer is too short. Please speak more.');
                return;
            }

            setLoading(true);
                try {
                const resp = await EvaluateAndSaveUserAnswer({
                    mockIDRef: interviewData?.mockID,
                    question: mockInterviewQuestions[activeQuestionIndex]?.question,
                    correctAnswer: mockInterviewQuestions[activeQuestionIndex]?.answer,
                    userAnswer: userAnswer,
                    userEmail: interviewData?.createdBy
                });

                if(resp) {
                    toast('User Answer recorded successfully');
                    setUserAnswer('');
                    setResults([]);
                }

            } catch (error) {
                console.error("Error saving answer:", error);
                toast('Failed to save answer');
            } finally {
                setLoading(false);
            }

        } else {
            // START RECORDING
            if (isCameraCovered) {
                toast.error("Action denied: Camera blocked or too dark.");
                return;
            }
            startSpeechToText();
        }
    }

    // Reset timer when question changes
    useEffect(() => {
        if (!isRecording) {
            setTimeLeft(120);
        }
    }, [activeQuestionIndex, isRecording]);

    // Timer countdown logic
    useEffect(() => {
        let timer;
        if (isRecording && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (isRecording && timeLeft === 0) {
            clearInterval(timer);
            toast.error('Timer ran out! Auto-saving your answer...', { duration: 6000 });
            SaveUserAnswerToDB();
        }
        return () => clearInterval(timer);
    }, [isRecording, timeLeft]);

    return (
        <div className='flex items-center justify-center flex-col w-full'>
            <div className='mt-4 md:mt-10 flex items-center justify-center w-full max-w-2xl h-72 md:h-96 relative overflow-hidden rounded-lg border shadow-sm bg-secondary z-10'>
                {isCameraCovered && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 text-red-500 p-6 text-center animate-in fade-in duration-300">
                        <h3 className="font-bold text-xl mb-2">Camera Blocked!</h3>
                        <p>Your camera appears artificially covered or the room is pitch black. You cannot record answers until this is fixed.</p>
                    </div>
                )}
                <Webcam
                    ref={webcamRef}
                    mirrored={true}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                />
            </div>

            <div className={`mt-4 md:mt-8 font-mono text-2xl font-semibold tracking-wider ${timeLeft <= 30 && isRecording ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                {isRecording ? `⏱️ 0${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}` : `⏱️ 02:00`}
            </div>

            <Button 
                disabled={loading} 
                variant={isRecording ? "destructive" : "default"}
                className="my-6 md:my-10"
                onClick={SaveUserAnswerToDB}
            >
                {isRecording ? 
                    <h2 className='flex gap-2 items-center'><StopCircle/> Stop Recording</h2>
                    : 
                    <h2 className='flex gap-2 items-center'><Mic/> Record Answer</h2>
                }
            </Button>
        </div>
    )
}

export default React.memo(RecordAnswerSection);