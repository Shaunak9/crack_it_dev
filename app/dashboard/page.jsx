import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import AddMcqPrep from './_components/AddMcqPrep'
import AddCodingRound from './_components/AddCodingRound'
import InterviewList from './_components/InterviewList'
import McqList from './_components/McqList'
import CodingList from './_components/CodingList'
import StatsBanner from './_components/StatsBanner'
import Link from 'next/link'
import { Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'

function Dashboard() {
  return (
    <div className='p-10'> 
      <h2 className='font-bold text-3xl mb-2 text-primary'>Dashboard</h2>
      <h2 className='text-muted-foreground text-lg mb-8'>Choose your practice mode and get ready for your dream job.</h2>
      
      {/* Dynamic Stats Overview */}
      <StatsBanner />
   
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-5 w-full'>
        {/* Actual Interview Flow Component (Styled inside AddNewInterview.jsx) */}
        <AddNewInterview />
        
        {/* Interview Prep MCQs Component */}
        <AddMcqPrep />

        {/* Live Coding Round Engine Component */}
        <AddCodingRound />
      </div>
      
      {/* List of previous interviews */}
      <div className="mt-12">
        <InterviewList/>
      </div>

      {/* List of previous MCQs */}
      <div className="mt-12">
        <McqList/>
      </div>

      {/* List of previous Coding Rounds */}
      <div className="mt-12 mb-20">
        <CodingList/>
      </div>
    </div>
  )
}

export default Dashboard