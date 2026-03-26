import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TipsPage() {
  return (
    <div className="min-h-screen bg-background p-8 flex flex-col items-center">

      <h1 className="text-4xl font-bold text-center mb-10 text-primary">
        Tips and Tricks for Interview Preparation
      </h1>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl w-full">

        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-3">Self Introduction</h2>
          <p className="text-muted-foreground">Prepare a short and confident introduction about yourself including education, skills and goals.</p>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-3">Body Language</h2>
          <p className="text-muted-foreground">Maintain eye contact, sit straight and avoid unnecessary movements during interview.</p>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-3">Common HR Questions</h2>
          <p className="text-muted-foreground">Practice questions like strengths, weaknesses, career goals and teamwork experiences.</p>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-3">Technical Preparation</h2>
          <p className="text-muted-foreground">Revise core subjects, projects and practical implementation knowledge.</p>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-3">Resume Knowledge</h2>
          <p className="text-muted-foreground">Be ready to explain every skill, certification and project mentioned in your resume.</p>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-3">Confidence</h2>
          <p className="text-muted-foreground">Stay calm, think before answering and communicate clearly.</p>
        </div>

      </div>

      <div className="mt-12">
        <Link href="/dashboard">
          <Button size="lg" className="rounded-full px-8">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}