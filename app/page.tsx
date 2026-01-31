'use client';

import ResumeUpload from '@/components/ResumeUpload';
import ResumePreview from '@/components/ResumePreview';
import ATSScore from '@/components/ATSScore';
import FeedbackPanel from '@/components/FeedbackPanel';
import { useAppSelector } from '@/lib/store/hooks';

export default function Home() {
  const { text, result } = useAppSelector((state) => state.resume);

  return (
    <main className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          ATS Resume Analyzer
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get insightful feedback on your resume's ATS compatibility instantly. 
          No sign-ups, no hidden fees, 100% free.
        </p>
      </div>

      <ResumeUpload />

      {text && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="space-y-6">
            <div className="lg:sticky lg:top-8">
              <ResumePreview />
            </div>
          </div>
          
          <div className="space-y-6">
             <ATSScore />
             <FeedbackPanel />
          </div>
        </div>
      )}
    </main>
  );
}
