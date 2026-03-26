"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { DeleteMockCodingRound } from '@/app/_actions/coding'
import { toast } from 'sonner'

function CodingItemCard({ round, onDelete }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const onStartOrReview = () => {
    if (round.score) {
        router.push('/dashboard/coding/' + round?.roundId + '/feedback');
    } else {
        router.push('/dashboard/coding/' + round?.roundId);
    }
  }

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Are you certain you want to permanently delete this coding round?')) return;

    setIsDeleting(true);
    const success = await DeleteMockCodingRound(round.roundId);
    if (success) {
      toast.success("Coding Round deleted successfully");
      if (onDelete) onDelete(round.roundId);
    } else {
      toast.error("Failed to delete Coding Round");
      setIsDeleting(false);
    }
  }

  const isCompleted = !!round.score;

  return (
    <div className='border shadow-sm rounded-lg p-5 flex flex-col h-full bg-card hover:shadow-md transition-shadow relative group'>
      
      {/* Delete Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-3 right-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <h2 className='font-bold text-primary truncate text-lg pr-8'>{round?.jobPosition}</h2>
      <h2 className='text-sm text-muted-foreground mt-1'>{round?.codingLanguage} • {round?.jobExperience} Years Exp</h2>
      <h2 className='text-xs text-muted-foreground mt-2'>Created: {round.createdAt}</h2>
      
      {isCompleted ? (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md border border-green-200 dark:border-green-800 text-center font-medium">
          Score: {round.score} / 10
        </div>
      ) : (
        <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 rounded-md border border-cyan-200 dark:border-cyan-800 text-center font-medium">
          Terminal Ready
        </div>
      )}
      
      <div className='mt-auto pt-6'>
        <Button size="sm" className="w-full" variant={isCompleted ? "outline" : "default"} onClick={onStartOrReview} disabled={isDeleting}>
          {isCompleted ? "Review Source Code" : "Boot Terminal"}
        </Button>
      </div>
    </div>
  )
}

export default CodingItemCard;
