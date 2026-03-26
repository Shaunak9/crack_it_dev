"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard';
import { GetInterviews } from '@/app/_actions/interview'; // Server Action
import { Button } from '@/components/ui/button';

function InterviewList() {

    const {user} = useUser();
    const [interviewList, setInterviewList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    useEffect(()=>{
        user && getAllInterviews();
    },[user, currentPage])

    const getAllInterviews = async () => {
        setLoading(true);
        // Fetch from Server Action with pagination
        const result = await GetInterviews(
            user?.primaryEmailAddress?.emailAddress,
            itemsPerPage,
            currentPage * itemsPerPage
        );
        setInterviewList(result || []);
        setLoading(false);
    }

    const goToNextPage = () => {
        if (interviewList.length === itemsPerPage) {
            setCurrentPage(prev => prev + 1);
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    }

  if (loading) return null;

  return (
    <div>
      <h2 className='font-medium text-xl mb-4'>Recent Mock Interviews</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {interviewList && interviewList.map((interview)=>(
            <InterviewItemCard 
              interview={interview} 
              key={interview.mockID}
              onInterviewDeleted={(mockID) => {
                setInterviewList(prev => prev.filter(item => item.mockID !== mockID));
              }}
            />
        ))}
        {interviewList && interviewList.length === 0 && (
            <div className="col-span-full p-8 text-center text-muted-foreground border rounded-xl bg-muted/20">
                You haven't generated any video interviews yet. Try the "Actual Interview" tile above!
            </div>
        )}
      </div>
      {interviewList.length > 0 && (
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
                disabled={interviewList.length < itemsPerPage}
                variant="outline"
            >
                Next
            </Button>
        </div>
      )}
    </div>
  )
}

export default InterviewList