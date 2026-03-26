"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoaderIcon, TerminalSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function AddCodingRound() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDescription, setJobDescription] = useState();
    const [jobExperience, setJobExperience] = useState();
    const [codingLanguage, setCodingLanguage] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const router = useRouter();

    const onSubmit = async (e) => {
        setLoading(true);
        setLoadingMessage('Generating algorithmic problem...');
        e.preventDefault();
        
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'coding',
                    jobPosition,
                    jobDescription,
                    jobExperience,
                    codingLanguage
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate coding round');
            }

            const data = await response.json();

            if (data.id) {
                toast.success('Live Coding Environment built successfully!');
                setOpenDialog(false);
                router.push(`/dashboard/coding/${data.id}`); 
            }
        } catch (error) {
            console.error("Error generating coding round:", error);
            toast.error('Failed to provision coding round. Please try again.');
        } finally {
            setLoading(false);
            setLoadingMessage('');
        }
    }

    return (
        <div className="h-full block">
            <div 
              onClick={() => setOpenDialog(true)}
              className="flex flex-col items-center justify-center p-8 h-full bg-card border rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] cursor-pointer transition-all border-green-200 hover:border-green-400 group"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                <TerminalSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 tracking-tight">Live Coding Round</h2>
              <p className="text-muted-foreground text-center mb-6">
                Tackle AI-generated algorithmic structures in a live integrated IDE with instant Big-O complexity feedback.
              </p>
              <Button variant="outline" tabIndex={-1} className="w-full mt-auto text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-950/30 pointer-events-none">
                Start Terminal Screen
              </Button>
            </div>
            
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Configure Technical Screen</DialogTitle>
                        <DialogDescription>
                            Define the parameters of the coding challenge. The AI will spin up an algorithm tailored exactly to these specifications.
                        </DialogDescription>
                    </DialogHeader>
                        
                    <form onSubmit={onSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className='mt-5 my-2 col-span-2'>
                                <label className="text-sm font-medium">Target Role</label>
                                <Input placeholder="Ex. Machine Learning Engineer" required
                                onChange={(event) => setJobPosition(event.target.value)} />
                            </div>

                            <div className='mt-2 my-2 col-span-2 md:col-span-1'>
                                <label className="text-sm font-medium">Language Preference</label>
                                <Input placeholder="Ex. Python, Java, C++, JS" required
                                onChange={(event) => setCodingLanguage(event.target.value)} />
                            </div>

                            <div className='mt-2 my-2 col-span-2 md:col-span-1'>
                                <label className="text-sm font-medium">Years of Experience</label>
                                <Input type="number" placeholder="Ex. 4" min="0" max="50" required
                                onChange={(event) => setJobExperience(event.target.value)} />
                            </div>

                            <div className='mt-2 my-2 col-span-2'>
                                <label className="text-sm font-medium">Job Description / Tech Stack Details</label>
                                <Textarea className="h-24" placeholder="Ex. Building highly scalable microservices, graph databases..." required
                                onChange={(event) => setJobDescription(event.target.value)} />
                            </div>
                        </div>
                        
                        <div className='flex gap-5 justify-end mt-6'>
                            <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)} disabled={loading}>Cancel</Button>
                            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                                {loading ? (
                                    <div className='flex gap-2 items-center'>
                                        <LoaderIcon className='animate-spin' size={18}/>
                                        <span>{loadingMessage}</span>
                                    </div>
                                ) : (
                                    'Launch Terminal'
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddCodingRound;
