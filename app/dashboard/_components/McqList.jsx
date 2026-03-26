"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import McqItemCard from './McqItemCard';
import { GetMcqsByUser } from '@/app/_actions/mcq'; 
import { Button } from '@/components/ui/button';

function McqList() {
    const { user } = useUser();
    const [mcqList, setMcqList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    
    useEffect(()=>{
        user && getAllMcqs();
    }, [user, currentPage]);

    const getAllMcqs = async () => {
        setLoading(true);
        const result = await GetMcqsByUser(
            user?.primaryEmailAddress?.emailAddress,
            itemsPerPage,
            currentPage * itemsPerPage
        );
        setMcqList(result || []);
        setLoading(false);
    }

    const goToNextPage = () => {
        if (mcqList.length === itemsPerPage) {
            setCurrentPage(prev => prev + 1);
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    }

  if (loading) return null; // Or a skeleton

  return (
    <div className="mt-12">
      <h2 className='font-medium text-xl mb-4'>Recent MCQ Practices</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {mcqList && mcqList.map((mcq)=>(
            <McqItemCard 
               mcq={mcq} 
               key={mcq.mcqId} 
               onDelete={(id) => setMcqList(prev => prev.filter(m => m.mcqId !== id))}
            />
        ))}
        {mcqList.length === 0 && (
            <div className="col-span-full p-8 text-center text-muted-foreground border rounded-xl bg-muted/20">
                You haven't generated any MCQ practices yet. Try the "Interview Prep" tile above!
            </div>
        )}
      </div>
      
      {mcqList.length > 0 && (
        <div className='flex gap-3 justify-center mt-6'>
            <Button 
                onClick={goToPreviousPage} 
                disabled={currentPage === 0}
                variant="outline"
            >
                Previous
            </Button>
            <span className='flex items-center px-4'>
                Page {currentPage + 1}
            </span>
            <Button 
                onClick={goToNextPage}
                disabled={mcqList.length < itemsPerPage}
                variant="outline"
            >
                Next
            </Button>
        </div>
      )}
    </div>
  )
}

export default McqList;
