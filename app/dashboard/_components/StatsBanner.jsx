"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { GetInterviewCount } from '@/app/_actions/interview';
import { GetMcqStats } from '@/app/_actions/mcq'; 
import { Brain, FileVideo, Target } from "lucide-react";

export default function StatsBanner() {
    const { user } = useUser();
    const [stats, setStats] = useState({ interviews: 0, mcqs: 0, avgMcqScore: 0 });

    useEffect(() => {
        if(user) fetchStats();
    }, [user]);

    const fetchStats = async () => {
        const email = user?.primaryEmailAddress?.emailAddress;
        
        // Fetch optimized data
        const interviewsCount = await GetInterviewCount(email);
        const mcqsScores = await GetMcqStats(email);
        
        let totalScore = 0;
        let completedMcqs = 0;
        
        mcqsScores.forEach(m => {
            if (m.score) {
                totalScore += parseInt(m.score);
                completedMcqs++;
            }
        });
        
        const avg = completedMcqs > 0 ? (totalScore / (completedMcqs * 5)) * 100 : 0;
        
        setStats({
            interviews: interviewsCount || 0,
            mcqs: completedMcqs,
            avgMcqScore: Math.round(avg)
        });
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-4">
            <div className="bg-card border p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                    <FileVideo className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-muted-foreground text-sm font-medium">Video Interviews</p>
                    <h3 className="text-3xl font-bold">{stats.interviews}</h3>
                </div>
            </div>
            
            <div className="bg-card border p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                    <Brain className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-muted-foreground text-sm font-medium">MCQs Completed</p>
                    <h3 className="text-3xl font-bold">{stats.mcqs}</h3>
                </div>
            </div>

            <div className="bg-card border p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                    <Target className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-muted-foreground text-sm font-medium">Average MCQ Score</p>
                    <h3 className="text-3xl font-bold">{stats.avgMcqScore}%</h3>
                </div>
            </div>
        </div>
    )
}
