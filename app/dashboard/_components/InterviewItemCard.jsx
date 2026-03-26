"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { DeleteInterview } from '@/app/_actions/interview';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

function InterviewItemCard({interview, onInterviewDeleted}) {

  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const onStart = () => {
    router.push('/dashboard/interview/' + interview?.mockID);
  }

  const onFeedbackPress = () => {
    router.push('/dashboard/interview/'+interview?.mockID+'/Feedback');
  }

  const onDelete = async (e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you certain you want to permanently delete this interview?')) return;
    
    setIsDeleting(true);
    const result = await DeleteInterview(interview.mockID);
    if(result) {
        toast.success('Interview Deleted Successfully');
        // Call parent callback to update list instead of full page reload
        if(onInterviewDeleted) {
          onInterviewDeleted(interview.mockID);
        }
    } else {
        toast.error('Failed to delete interview');
        setIsDeleting(false);
    }
  }

  return (
    <div className='border shadow-sm rounded-lg p-5 flex flex-col h-full bg-card hover:shadow-md transition-shadow relative group'>
      
      {/* Hover Delete Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-3 right-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full z-10"
        onClick={onDelete}
        disabled={isDeleting}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <h2 className='font-bold text-primary pr-8 truncate text-lg'>
        {interview?.jobPosition} {interview?.jobDescription ? `- ${interview.jobDescription}` : ''}
      </h2>
      <h2 className='text-sm text-muted-foreground mt-1'>{interview?.jobExperience} Years of Experience</h2>
      <h2 className='text-xs text-muted-foreground mt-2'>Created At: {interview.createdAt}</h2>
      
      <div className='flex justify-between mt-auto pt-6 gap-5'>
        <Button size="sm" variant="outline" className="w-full" onClick={onFeedbackPress} disabled={isDeleting}>Feedback</Button>
        <Button size="sm" className="w-full" onClick={onStart} disabled={isDeleting}>Start</Button>
      </div>
    </div>
  )
}

export default InterviewItemCard