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
import { LoaderIcon, Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function AddMcqPrep() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDescription, setJobDescription] = useState();
    const [jobExperience, setJobExperience] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const router = useRouter();

    const onSubmit = async (e) => {
        setLoading(true);
        setLoadingMessage('Generating MCQ practice...');
        e.preventDefault();
        
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'mcq',
                    jobPosition,
                    jobDescription,
                    jobExperience
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate MCQ Prep');
            }

            const data = await response.json();
            
            if (data.id) {
                toast.success('MCQ Prep created successfully!');
                setOpenDialog(false);
                router.push(`/dashboard/mcq/${data.id}`); 
            }
        } catch (error) {
            console.error("Error generating MCQ:", error);
            toast.error('Failed to generate MCQ Prep. Please try again.');
        } finally {
            setLoading(false);
            setLoadingMessage('');
        }
    }

    return (
        <div className="h-full block">
            <div 
              onClick={() => setOpenDialog(true)}
              className="flex flex-col items-center justify-center p-8 h-full bg-card border rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] cursor-pointer transition-all border-blue-200 hover:border-blue-400 group"
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Interview Prep (MCQs)</h2>
              <p className="text-muted-foreground text-center mb-6">
                Warm up with quick multiple-choice questions to test your core knowledge before the big interview.
              </p>
              <Button variant="outline" tabIndex={-1} className="w-full mt-auto text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30 pointer-events-none">
                Start Practice
              </Button>
            </div>
            
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Create your MCQ Practice</DialogTitle>
                        <DialogDescription>
                            Tell us the role and tech stack you want to practice for, and our AI will spin up a quick multiple-choice test for you.
                        </DialogDescription>
                    </DialogHeader>
                        
                    <form onSubmit={onSubmit}>
                        <div>
                            <div className='mt-7 my-3'>
                                <label>Job Position / Role Name</label>
                                <Input placeholder="Ex. Frontend Developer" required
                                onChange={(event) => setJobPosition(event.target.value)} />
                            </div>

                            <div className='mt-7 my-3'>
                                <label>Job Description / Tech Stack (In Short)</label>
                                <Textarea placeholder="Ex. React, Tailwind, Next.js" required
                                onChange={(event) => setJobDescription(event.target.value)} />
                            </div>

                            <div className='mt-7 my-3'>
                                <label>Years of experience</label>
                                <Input type="number" placeholder="Ex. 3" min="0" max="50" required
                                onChange={(event) => setJobExperience(event.target.value)} />
                            </div>
                        </div>
                        
                        <div className='flex gap-5 justify-end mt-6'>
                            <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)} disabled={loading}>Cancel</Button>
                            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                                {loading ? (
                                    <div className='flex gap-2 items-center'>
                                        <LoaderIcon className='animate-spin' size={18}/>
                                        <span>{loadingMessage}</span>
                                    </div>
                                ) : (
                                    'Generate MCQs'
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddMcqPrep;
