"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GetCodingRoundDetails, EvaluateAndSaveCodingFeedback } from '@/app/_actions/coding'; // We will add SaveCodingFeedback later
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });
import { Button } from '@/components/ui/button';
import { Play, Code2, CheckCircle, LoaderCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

function CodingEnvironment() {
    const params = useParams();
    const router = useRouter();
    const roundId = params.roundId;

    const [roundData, setRoundData] = useState(null);
    const [problemDetails, setProblemDetails] = useState(null);
    const [userCode, setUserCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

    useEffect(() => {
        if (roundId) {
            GetDetails();
        }
    }, [roundId]);

    const GetDetails = async () => {
        setLoading(true);
        const result = await GetCodingRoundDetails(roundId);
        setRoundData(result);

        try {
            const parsed = typeof result.jsonMockResp === 'string' ? JSON.parse(result.jsonMockResp) : result.jsonMockResp;
            setProblemDetails(parsed);
            if (parsed.startingCode) {
                setUserCode(parsed.startingCode);
            }
        } catch (e) {
            console.error("Error parsing problem details", e);
        }
        setLoading(false);
    }

    // Timer logic
    useEffect(() => {
        let timer;
        if (timeLeft > 0 && !isEvaluating) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !isEvaluating) {
            toast.error('Timer ran out! Auto-submitting the code...', { duration: 6000 });
            handleSubmitCode();
        }
        return () => clearInterval(timer);
    }, [timeLeft, isEvaluating]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleEditorChange = (value) => {
        setUserCode(value);
    };

    const handleSubmitCode = async () => {
        if (!userCode || userCode.trim().length < 5) {
            toast.error("Please write some code before submitting.");
            return;
        }

        setIsEvaluating(true);
        try {
            toast.info("AI is running and grading your code...");
            await EvaluateAndSaveCodingFeedback(roundData.roundId, userCode, problemDetails, roundData?.codingLanguage);
            toast.success("Code Evaluated!");

            // Redirect to a feedback summary page
            router.push('/dashboard/coding/' + roundData?.roundId + '/feedback');

        } catch (error) {
            console.error(error);
            toast.error("Failed to grade code. Please try again.");
        } finally {
            setIsEvaluating(false);
        }
    }

    const languageMap = {
        'javascript': 'javascript',
        'js': 'javascript',
        'python': 'python',
        'py': 'python',
        'java': 'java',
        'c++': 'cpp',
        'cpp': 'cpp',
        'c#': 'csharp',
        'typescript': 'typescript',
        'ts': 'typescript'
    };

    // Default to python if unknown
    const editorLanguage = roundData?.codingLanguage ?
        (languageMap[roundData.codingLanguage.toLowerCase()] || 'python') : 'python';

    if (loading || !problemDetails) {
        return <div className="h-screen flex items-center justify-center"><LoaderCircle className="animate-spin w-10 h-10 text-primary" /></div>;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] w-full">
            {/* Header */}
            <header className="flex flex-col md:flex-row items-center justify-between p-4 gap-4 border-b bg-card">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <Code2 className="text-primary" />
                    <h1 className="text-lg font-bold">Technical Screen</h1>
                    <span className="text-sm bg-secondary px-2 py-1 rounded-md md:ml-4 text-muted-foreground">{roundData?.codingLanguage}</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                    <div className={`flex items-center gap-2 font-mono text-lg font-semibold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : ''}`}>
                        <Clock className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>

                    <Button onClick={handleSubmitCode} disabled={isEvaluating} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                        {isEvaluating ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        {isEvaluating ? "Analyzing..." : "Submit Code"}
                    </Button>
                </div>
            </header>

            {/* Split Screen Workspace */}
            <div className="flex flex-col md:flex-row flex-1 overflow-auto md:overflow-hidden font-sans">
                {/* Left Panel - Question Description */}
                <div className="w-full md:w-5/12 p-6 overflow-visible md:overflow-y-auto border-b md:border-b-0 md:border-r bg-background flex flex-col gap-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">{roundData?.jobPosition} Challenge</h2>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {problemDetails?.problemStatement}
                            </p>
                        </div>
                    </div>

                    {problemDetails?.examples?.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Examples</h3>
                            {problemDetails.examples.map((ex, idx) => (
                                <div key={idx} className="bg-secondary p-4 rounded-lg mb-3 font-mono text-sm border-l-4 border-primary">
                                    <p><strong className="text-muted-foreground">Input:</strong><br />{ex.input}</p>
                                    <p className="mt-2"><strong className="text-muted-foreground">Output:</strong><br />{ex.output}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {problemDetails?.constraints?.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Constraints</h3>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground bg-secondary/50 p-4 rounded-lg">
                                {problemDetails.constraints.map((c, idx) => (
                                    <li key={idx}>{c}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right Panel - Code Editor */}
                <div className="w-full h-[500px] md:h-auto md:w-7/12 bg-[#1e1e1e] flex flex-col relative shrink-0">
                    <Editor
                        height="100%"
                        language={editorLanguage}
                        theme="vs-dark"
                        value={userCode}
                        onChange={handleEditorChange}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            wordWrap: 'on',
                            formatOnPaste: true,
                            fontFamily: 'JetBrains Mono, Fira Code, monospace',
                            padding: { top: 20 },
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default CodingEnvironment;
