'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, ListChecks, Type, FileSearch, Eye, TrendingUp } from 'lucide-react';

export default function ATSScore() {
  const { result } = useAppSelector((state) => state.resume);

  if (!result) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-12 duration-1000">
      {/* Main Score Card */}
      <div className="neo-card p-0 overflow-hidden border-l-8 border-l-primary scale-[1.02]">
        <div className="p-8 flex flex-col items-center justify-center relative overflow-hidden">
           {/* Background Decoration */}
           <div className="absolute top-0 right-0 p-2 opacity-5">
              <TrendingUp size={160} className="text-primary" />
           </div>

           <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-8 w-full text-left bg-primary/5 py-2 px-4 border-l-2 border-primary">
            Systemic_Match_Index
          </div>

          <div className="flex items-baseline gap-2 mb-4 relative z-10">
            <span className="text-[120px] leading-none font-black italic text-primary animate-glitch select-none tracking-tighter">{result.score}</span>
            <span className="text-3xl font-black italic text-primary/30 uppercase">%</span>
          </div>
          
          <div className="w-full space-y-3 relative z-10 pt-4">
            <div className="h-1.5 w-full bg-primary/10 overflow-hidden">
               <div className="h-full bg-primary" style={{ width: `${result.score}%` }} />
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest pt-2">
              <span className="text-primary flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
                Performance: {result.score >= 70 ? 'OPTIMIZED' : 'SUBOPTIMAL'}
              </span>
              <span className="text-gray-500">Target: 85%+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: <ListChecks size={18} />, label: 'Structure', val: result.breakdown.sectionPresence, max: 30 },
          { icon: <FileSearch size={18} />, label: 'Keywords', val: result.breakdown.keywordMatching, max: 40 },
          { icon: <Type size={18} />, label: 'Format', val: result.breakdown.formatting, max: 20 },
          { icon: <Eye size={18} />, label: 'Readable', val: result.breakdown.readability, max: 10 },
        ].map((item, idx) => (
          <div key={idx} className="neo-card flex flex-col gap-5 border-primary/20 group hover:border-primary transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-primary/10 text-primary">{item.icon}</div>
              <div className="text-right">
                <div className="text-[8px] font-black uppercase tracking-widest text-primary/50">Efficiency</div>
                <div className="text-sm font-black italic text-primary">{Math.round((item.val / item.max) * 100)}%</div>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">{item.label}</div>
              <div className="text-3xl font-black italic tracking-tighter">{item.val}<span className="text-xs text-gray-700 opacity-50 ml-1">/{item.max}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Detected Sections */}
      <div className="neo-card p-8 border-t-2 border-primary/10">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-6">
           <div className="w-2 h-2 bg-primary" />
           <span>Detected_Nodes</span>
           <div className="h-px bg-primary/5 flex-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          {result.details.sections.map((section) => (
            <div key={section.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rotate-45 transition-colors ${section.present ? 'bg-primary' : 'bg-gray-900 border border-white/10'}`} />
                <span className={`text-xs font-black uppercase tracking-[0.1em] transition-colors ${section.present ? 'text-white' : 'text-gray-700'}`}>
                  {section.name}
                </span>
              </div>
              <div className="text-[8px] font-mono opacity-30 select-none">
                {section.present ? 'NODE_ACTIVE' : 'NODE_OFFLINE'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
