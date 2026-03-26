"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Brain, FileVideo, ChevronRight, Sparkles, CheckCircle, TerminalSquare } from "lucide-react";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-background selection:bg-primary/30">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
            <Image src="/logo.svg" width={40} height={40} alt="Logo" className="dark:invert w-auto h-8" />
            <span className="font-bold text-xl tracking-tight hidden sm:block">Crack It Dev</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <SignedIn>
            <Button onClick={() => router.push("/dashboard")} variant="outline" className="rounded-full px-6 border-primary/20 hover:bg-primary/5">
              Dashboard
            </Button>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Button onClick={() => router.push("/dashboard")} variant="outline" className="rounded-full px-6 border-primary/20 hover:bg-primary/5">
              Sign In
            </Button>
          </SignedOut>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 w-full pt-12 pb-24 relative">
        {/* Background Gradients */}
        <div className="absolute top-0 -z-10 h-full w-full bg-background overflow-hidden">
          <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[20%] translate-y-[10%] rounded-full bg-[rgba(173,109,244,0.2)] dark:bg-[rgba(173,109,244,0.15)] opacity-50 blur-[100px]" />
          <div className="absolute bottom-auto left-0 right-auto top-0 h-[500px] w-[500px] translate-x-[20%] translate-y-[20%] rounded-full bg-[rgba(59,130,246,0.2)] dark:bg-[rgba(59,130,246,0.15)] opacity-50 blur-[100px]" />
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-center max-w-5xl tracking-tight leading-[1.1] mb-12 mt-8 slide-in-from-bottom animate-in duration-700 delay-150">
          Nail your next interview with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Crack It Dev.</span>
        </h1>

        {/* Features Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full slide-in-from-bottom animate-in duration-700 delay-500 mb-16 z-10 text-left">
          {/* Feature 1 */}
          <div className="flex flex-col p-10 bg-card border border-border/50 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150" />
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mb-8 relative z-10">
              <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">MCQ Based Preparation</h3>
            <p className="text-muted-foreground text-lg leading-relaxed flex-1 relative z-10">
              Warm up with quick, highly specific multiple-choice questions tailored to your precise tech stack and experience level. Instantly see where you stand.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col p-10 bg-card border border-border/50 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150" />
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center mb-8 relative z-10">
              <FileVideo className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">Live Mock Interviews</h3>
            <p className="text-muted-foreground text-lg leading-relaxed flex-1 relative z-10">
              Simulate the pressure of a real interview. Speak directly into your webcam and receive granular, constructive feedback on your responses.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col p-10 bg-card border border-border/50 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150" />
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-2xl flex items-center justify-center mb-8 relative z-10">
              <TerminalSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">Live Coding Rounds</h3>
            <p className="text-muted-foreground text-lg leading-relaxed flex-1 relative z-10">
              Tackle AI-generated algorithmic structures in a live integrated IDE with instant Big-O complexity feedback and Senior-level code review.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md slide-in-from-bottom animate-in duration-700 delay-700">
          <Button 
            onClick={() => router.push("/dashboard")} 
            size="lg" 
            className="rounded-full h-14 px-8 text-lg font-medium shadow-xl shadow-blue-500/20 hover:scale-105 transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 z-10 relative"
          >
            Start Practicing Now <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-10 text-center text-muted-foreground border-t border-border/50 text-sm">
        <p>© {new Date().getFullYear()} AI Mock Interviewer. All rights reserved.</p>
      </footer>
    </div>
  );
}
