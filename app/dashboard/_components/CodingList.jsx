"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import CodingItemCard from './CodingItemCard';
import { GetCodingRoundsByUser } from '@/app/_actions/coding'; 
import { Button } from '@/components/ui/button';

function CodingList() {
    const { user } = useUser();
    const [codingList, setCodingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    
    useEffect(()=>{
        user && getAllRounds();
    }, [user, currentPage]);

    const getAllRounds = async () => {
        setLoading(true);
        const result = await GetCodingRoundsByUser(
            user?.primaryEmailAddress?.emailAddress,
            itemsPerPage,
            currentPage * itemsPerPage
        );
        setCodingList(result || []);
        setLoading(false);
    }

    const goToNextPage = () => {
        if (codingList.length === itemsPerPage) {
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
    <div className="mt-12">
      <h2 className='font-medium text-xl mb-4'>Recent Live Coding Rounds</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {codingList && codingList.map((round)=>(
            <CodingItemCard 
               round={round} 
               key={round.roundId} 
               onDelete={(id) => setCodingList(prev => prev.filter(m => m.roundId !== id))}
            />
        ))}
        {codingList.length === 0 && (
            <div className="col-span-full p-8 text-center text-muted-foreground border rounded-xl bg-muted/20">
                You haven't attempted any Coding Rounds yet. Try the "Live Coding Round" tile above!
            </div>
        )}
      </div>
      
      {codingList.length > 0 && (
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
                disabled={codingList.length < itemsPerPage}
                variant="outline"
            >
                Next
            </Button>
        </div>
      )}
    </div>
  )
}

export default CodingList;
