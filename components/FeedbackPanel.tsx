'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { AlertTriangle, CheckCheck, Lightbulb, Terminal, AlertCircle } from 'lucide-react';

export default function FeedbackPanel() {
  const { result } = useAppSelector((state) => state.resume);

  if (!result) return null;

  const { feedback } = result.details;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
      
      {/* Missing Keywords - Terminal Style */}
      <div className="neo-card p-0 border-l-4 border-l-red-500 overflow-hidden">
        <div className="bg-red-500/5 p-8">
          <div className="flex items-center gap-3 mb-8 border-b border-red-500/20 pb-4">
            <Terminal className="text-red-500" size={20} />
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-red-500 pt-1">Keyword_Extraction_Gaps</h3>
          </div>
          
          {feedback.missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {feedback.missingKeywords.map((keyword) => (
                <div key={keyword} className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-black uppercase tracking-widest italic hover:bg-red-500 hover:text-black transition-all cursor-crosshair group relative">
                  <span className="relative z-10">{keyword}</span>
                  <div className="absolute inset-0 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-4 text-primary bg-primary/5 p-6 border border-primary/20">
              <CheckCheck size={24} />
              <div className="space-y-1">
                <div className="text-xs font-black uppercase tracking-widest pt-1">Optimization_Complete</div>
                <div className="text-[10px] uppercase font-bold text-primary/60 tracking-widest">Semantic match at 100% efficiency.</div>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 animate-pulse" />
            <span className="text-[8px] font-mono text-red-500/50 uppercase tracking-widest">Priority_High: Strategic_Insertion_Recommended</span>
          </div>
        </div>
      </div>

      {/* Suggestions Chain */}
      <div className="space-y-4">
        {/* Formatting */}
        {feedback.formattingIssues.length > 0 && (
          <div className="neo-card border-l-4 border-l-primary group hover:bg-primary/5 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-primary text-black">
                <AlertCircle size={18} fill="currentColor" />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary pt-1">System_Format_Alert</h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {feedback.formattingIssues.map((issue, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <span className="text-primary font-black italic text-xl opacity-20">0{idx + 1}</span>
                  <p className="text-[13px] font-medium text-gray-400 leading-relaxed pt-1 flex-1">
                    {issue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements / Suggestions */}
        {(feedback.missingSections.length > 0 || feedback.sectionOrderSuggestions.length > 0) && (
          <div className="neo-card bg-white/[0.02] border-primary/5">
             <div className="flex items-center gap-4 mb-8">
                <div className="p-2 bg-white/10 text-white">
                  <Lightbulb size={18} fill="currentColor" />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] pt-1">Career_Directives</h3>
             </div>
             
             <div className="space-y-8">
                {feedback.missingSections.length > 0 && (
                  <div className="relative p-6 border-l-2 border-white/10 ml-2">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 bg-white rotate-45" />
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] mb-4">Required_Nodes_Offline</p>
                    <div className="flex flex-wrap gap-4">
                      {feedback.missingSections.map(section => (
                        <div key={section} className="text-xs font-black uppercase tracking-widest border border-white/20 px-3 py-1 flex items-center gap-2">
                           <span className="w-1 h-1 bg-white" />
                           {section}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {feedback.sectionOrderSuggestions.length > 0 && (
                   <div className="relative p-6 border-l-2 border-primary/20 ml-2">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 bg-primary rotate-45" />
                    <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.4em] mb-4">Sequence_Optimization</p>
                    <div className="space-y-4">
                      {feedback.sectionOrderSuggestions.map((suggestion, idx) => (
                        <p key={idx} className="text-[12px] font-bold text-gray-300 tracking-wide leading-relaxed">
                          {suggestion}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>
        )}
      </div>

      <div className="barcode-pattern h-1 opacity-20 mt-12" />
    </div>
  );
}
