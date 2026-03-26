"use client"
import { Button } from '@/components/ui/button';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; // Correct hook for App Router
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
const Webcam = dynamic(() => import('react-webcam'), { ssr: false });
import { GetInterviewDetails, AnalyzeAttireAction } from '@/app/_actions/interview'; // Server Action
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

function Interview() {
    const params = useParams();
    const router = useRouter();
    // Unwrapping params is sometimes needed in newer Next.js versions, but useParams handles it well usually.
    // If you see an error about Promise, access params.interviewID directly in useEffect or await it.
    const interviewID = params.interviewID; 

    const [interviewData, setInterviewData] = useState(null);
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const webcamRef = useRef(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if(interviewID) {
            GetDetails();
        }
    }, [interviewID]);

    const GetDetails = async () => {
        const result = await GetInterviewDetails(interviewID);
        setInterviewData(result);
    }

    const handleStartInterview = async () => {
        if (!webcamRef.current) return;
        setIsAnalyzing(true);
        
        try {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                toast.error("Failed to capture webcam. Ensure your camera is unrestricted.");
                setIsAnalyzing(false);
                return;
            }

            toast.info("AI strictly verifying your attire...");
            const result = await AnalyzeAttireAction(imageSrc);

            if (result.isFormal) {
                toast.success("Identity & Dress Code Verified: " + result.reason);
                router.push('/dashboard/interview/' + interviewID + '/start');
            } else {
                toast.error("Interview Denied: " + result.reason, { duration: 6000 });
                setIsAnalyzing(false); // Enable retry
            }
        } catch (error) {
            toast.error("Verification failed, allowing bypass.");
            router.push('/dashboard/interview/' + interviewID + '/start');
        }
    }

    return (
        <div className='my-10 flex justify-center flex-col items-center'>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-5'>
                {/* Left Side: Details */}
                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col p-5 rounded-lg border gap-5'>
                        <h2 className='text-lg'><strong>Job Role/Job Position:</strong> {interviewData ? interviewData.jobPosition : "Loading..."}</h2>
                        <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong> {interviewData ? interviewData.jobDescription : "Loading..."}</h2>
                        <h2 className='text-lg'><strong>Years of Experience:</strong> {interviewData ? interviewData.jobExperience : "Loading..."}</h2>
                    </div>
                    
                    <div className='p-5 border rounded-lg border-yellow-300 dark:border-yellow-800 bg-yellow-100 dark:bg-yellow-900/20'>
                        <h2 className='flex gap-2 items-center text-yellow-600 dark:text-yellow-400'><Lightbulb/><strong>Information</strong></h2>
                        <h2 className='mt-3 text-yellow-600 dark:text-yellow-400'>{process.env.NEXT_PUBLIC_NOTE || "Enable Video Web Cam and Microphone to start your AI Mock Interview. It never records your video. A formal attire is mandatory to start the interview."}</h2>
                    </div>
                </div>

                {/* Right Side: Webcam */}
                <div className='w-full h-72 md:h-96 rounded-lg border shadow-sm bg-secondary overflow-hidden relative flex items-center justify-center'>
                    {webCamEnabled ? 
                        <Webcam 
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            screenshotQuality={0.8}
                            onUserMedia={() => setWebCamEnabled(true)}
                            onUserMediaError={() => setWebCamEnabled(false)}
                            mirrored={true}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                        /> 
                    :
                        <div className="flex flex-col items-center justify-center w-full h-full p-10 z-10">
                            <WebcamIcon className='h-24 w-24 text-muted-foreground mb-4'/>
                            <Button variant="ghost" className="w-full max-w-xs border border-primary/20 bg-background" onClick={() => setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
                        </div>
                    }
                </div>
            </div>

            <div className='flex justify-end items-end w-full mt-5'>
                <Button 
                    disabled={!webCamEnabled || isAnalyzing} 
                    onClick={handleStartInterview}
                    className="gap-2"
                >
                    {isAnalyzing ? (
                        <><LoaderCircle className="animate-spin w-4 h-4" /> Analyzing Attire...</>
                    ) : (
                        webCamEnabled ? "Start Interview" : "Enable Camera to Start"
                    )}
                </Button>
            </div>
        </div>
    )
}

export default Interview