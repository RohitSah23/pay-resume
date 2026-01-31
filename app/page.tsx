'use client';

import ResumeUpload from '@/components/ResumeUpload';
import ResumePreview from '@/components/ResumePreview';
import ATSScore from '@/components/ATSScore';
import FeedbackPanel from '@/components/FeedbackPanel';
import { useAppSelector } from '@/lib/store/hooks';
import { LayoutGrid, Shield, Zap, Search, ChevronRight } from 'lucide-react';

export default function Home() {
  const { text, result } = useAppSelector((state) => state.resume);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      {/* Navigation Placeholder */}
      <nav className="border-b border-primary/10 py-6 px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rotate-45 flex items-center justify-center">
              <div className="w-4 h-4 bg-black -rotate-45" />
            </div>
            <span className="font-black tracking-tighter text-xl italic pt-1">PAY-RESUME</span>
          </div>
          <div className="hidden md:flex gap-8 items-center text-xs font-bold tracking-widest uppercase">
            <a href="#" className="hover:text-primary transition-colors">Analyzer</a>
            <a href="#" className="hover:text-primary transition-colors">Features</a>
            <a href="#" className="hover:text-primary transition-colors">Pricing</a>
            <button className="neo-button scale-75 origin-right">Contact</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-8 overflow-hidden section-grid">
        <div className="barcode-pattern absolute top-0 left-0" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-xs font-bold tracking-[0.5em] uppercase mb-8 inline-block border-x-2 border-primary px-4 py-1">
            ATS Compatibility 2026
          </h2>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none pt-4 uppercase italic">
            Digital Excellence <br />
            <span className="spotlight-text">In The Spotlight</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 font-medium">
            Elevate your professional visibility with our next-generation AI resume analysis. 
            Precision-engineered to bypass the most advanced Applicant Tracking Systems.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button className="neo-button" onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}>
              Start Analysis <Zap size={18} fill="currentColor" />
            </button>
            <button className="text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:text-primary transition-all">
              View Sample <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="barcode-pattern absolute bottom-0 left-0" />
      </section>

      {/* Feature Section */}
      <section className="py-24 px-8 border-y border-primary/10 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px bg-primary/30 flex-1" />
            <h3 className="text-xs font-black tracking-[0.3em] uppercase whitespace-nowrap">What We Deliver</h3>
            <div className="h-px bg-primary/30 flex-1" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            <FeatureCard 
              icon={<Shield className="text-primary" />} 
              title="ATS Shielding" 
              desc="Analysis tailored to bypass modern filters used by 99% of Fortune 500 companies." 
            />
            <FeatureCard 
              icon={<Zap className="text-primary" />} 
              title="Instant Feedback" 
              desc="Powered by Gemini 2.5 Flash for real-time scoring and optimization suggestions." 
            />
            <FeatureCard 
              icon={<Search className="text-primary" />} 
              title="Keyword Matching" 
              desc="Deep semantic scanning to identify missing skills and industry-specific keywords." 
            />
            <FeatureCard 
              icon={<LayoutGrid className="text-primary" />} 
              title="Smart Layouts" 
              desc="Structural suggestions to ensure your data is readable by all systemic parsers." 
            />
          </div>
        </div>
      </section>

      {/* Analyzer Section */}
      <section id="analyzer" className="py-24 px-8 section-grid relative">
        <div className="max-w-7xl mx-auto">
           <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-4">Featured <span className="spotlight-text">Work</span></h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Transforming Resumes into career catalysts</p>
          </div>

          <div className="neo-card p-1">
            <div className="bg-black/80 p-8">
               <ResumeUpload />

              {text && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                  <div className="space-y-8">
                    <ResumePreview />
                  </div>
                  
                  <div className="space-y-8">
                     <ATSScore />
                     <FeedbackPanel />
                  </div>
                </div>
              )}
            </div>
            <div className="barcode-pattern h-2 mt-1" />
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer className="py-24 px-8 border-t border-primary/10 bg-card">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-12">Let's Work <span className="spotlight-text">Together</span></h2>
          <div className="w-full h-px bg-primary/20 mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full text-center uppercase tracking-widest text-xs font-bold">
            <div>
              <p className="text-gray-500 mb-4">Analysis</p>
              <p className="hover:text-primary transition-colors cursor-pointer">Start Scanning</p>
            </div>
            <div>
              <p className="text-gray-500 mb-4">About</p>
              <p className="hover:text-primary transition-colors cursor-pointer">Our Tech</p>
            </div>
            <div>
              <p className="text-gray-500 mb-4">Social</p>
              <p className="hover:text-primary transition-colors cursor-pointer">Linkedin</p>
            </div>
            <div>
              <p className="text-gray-500 mb-4">Support</p>
              <p className="hover:text-primary transition-colors cursor-pointer">Contact Us</p>
            </div>
          </div>
          <div className="mt-24 text-[10px] text-gray-500 font-bold uppercase tracking-[0.5em]">
            © 2026 PAY-RESUME DIGITAL LABORATORY
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="neo-card flex flex-col gap-4 border-l-4 border-l-primary group hover:bg-primary/5 transition-colors">
      <div className="p-3 bg-primary/10 w-fit">{icon}</div>
      <h4 className="font-black italic uppercase tracking-tighter text-xl">{title}</h4>
      <p className="text-sm text-gray-400 font-medium leading-relaxed">{desc}</p>
      <div className="mt-auto pt-4">
        <div className="w-full h-[1px] bg-primary/10 group-hover:bg-primary/30 transition-all" />
      </div>
    </div>
  );
}
