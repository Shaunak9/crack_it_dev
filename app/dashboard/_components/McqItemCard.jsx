"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { DeleteMockMcq } from '@/app/_actions/mcq'
import { toast } from 'sonner'

function McqItemCard({ mcq, onDelete }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const onStartOrReview = () => {
    router.push('/dashboard/mcq/' + mcq?.mcqId + '/start');
  }

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Are you certain you want to permanently delete this MCQ practice?')) return;
    
    setIsDeleting(true);
    const success = await DeleteMockMcq(mcq.mcqId);
    if (success) {
      toast.success("MCQ Practice deleted successfully");
      if (onDelete) onDelete(mcq.mcqId);
    } else {
      toast.error("Failed to delete MCQ");
      setIsDeleting(false);
    }
  }

  const isCompleted = !!mcq.score;

  return (
    <div className='border shadow-sm rounded-lg p-5 flex flex-col h-full bg-card hover:shadow-md transition-shadow relative group'>
      
      {/* Delete Button (Visible on Hover in Desktop, always accessible) */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-3 right-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <h2 className='font-bold text-primary truncate text-lg pr-8'>{mcq?.jobPosition} {mcq?.jobDescription ? `- ${mcq.jobDescription}` : ''} </h2>
      <h2 className='text-sm text-muted-foreground mt-1'>{mcq?.jobExperience} Years Exp</h2>
      <h2 className='text-xs text-muted-foreground mt-2'>Created: {mcq.createdAt}</h2>
      
      {isCompleted ? (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md border border-green-200 dark:border-green-800 text-center font-medium">
          Score: {mcq.score} / 5
        </div>
      ) : (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-md border border-amber-200 dark:border-amber-800 text-center font-medium">
          Pending Practice
        </div>
      )}
      
      <div className='mt-auto pt-6'>
        <Button size="sm" className="w-full" variant={isCompleted ? "outline" : "default"} onClick={onStartOrReview} disabled={isDeleting}>
          {isCompleted ? "Review Mistakes" : "Start Practice"}
        </Button>
      </div>
    </div>
  )
}

export default McqItemCard;
