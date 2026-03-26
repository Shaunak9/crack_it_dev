"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoaderIcon, FileVideo } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function AddNewInterview(){

    const [openDialog,setOpenDialog] = useState(false);
    const [jobPosition,setJobPosition] = useState();
    const [jobDescription,setJobDescription] = useState();
    const [jobExperience,setJobExperience] = useState();
    const [loading,setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const router = useRouter();

    const onSubmit=async(e)=>{
        setLoading(true);
        setLoadingMessage('Generating interview questions...');
        e.preventDefault();
        
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'interview',
                    jobPosition,
                    jobDescription,
                    jobExperience
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate interview');
            }

            const data = await response.json();
            
            if(data.id){
                toast.success('Interview created successfully!');
                setOpenDialog(false);
                router.push(`/dashboard/interview/${data.id}`); 
            }
        } catch (error) {
            console.error("Error generating interview:", error);
            toast.error('Failed to generate interview. Please try again.');
        } finally {
            setLoading(false);
            setLoadingMessage('');
        }
    }

    return(
        <div>
            <div 
              onClick={()=>setOpenDialog(true)}
              className="flex flex-col items-center justify-center p-8 h-full bg-card border rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] cursor-pointer transition-all border-purple-200 hover:border-purple-400 group"
            >
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                <FileVideo className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Actual Interview</h2>
              <p className="text-muted-foreground text-center mb-6">
                Experience a realistic AI mock interview with speech-to-text, tailored questions, and detailed feedback.
              </p>
              <Button className="w-full mt-auto bg-purple-600 hover:bg-purple-700 text-white pointer-events-none">
                Start Mock Interview
              </Button>
            </div>
            
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Tell us more about your job interviewing for</DialogTitle>
                        <DialogDescription>
                            Add Details about your job position/role, Job description and years of experience
                        </DialogDescription>
                    </DialogHeader>
                        
                    <form onSubmit={onSubmit}>
                        <div>
                            <div className='mt-7 my-3'>
                                <label>Job Position / Role Name</label>
                                <Input placeholder="Ex. Full Stack Developer" required
                                onChange={(event)=>setJobPosition(event.target.value)}/>
                            </div>

                            <div className='mt-7 my-3'>
                                <label>Job Description / Tech Stack (In Short)</label>
                                <Textarea placeholder="Ex. React, Angular, NodeJs, MySql etc" required
                                onChange={(event)=>setJobDescription(event.target.value)}/>
                            </div>

                            <div className='mt-7 my-3'>
                                <label>Years of experience</label>
                                <Input type="number" placeholder="Ex. 5" min="0" max="50" required
                                onChange={(event)=>setJobExperience(event.target.value)}/>
                            </div>
                        </div>
                        
                        <div className='flex gap-5 justify-end'>
                            <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)} disabled={loading}>Cancel</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <div className='flex gap-2 items-center'>
                                        <LoaderIcon className='animate-spin' size={18}/>
                                        <span>{loadingMessage}</span>
                                    </div>
                                ) : (
                                    'Start Interview'
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewInterview