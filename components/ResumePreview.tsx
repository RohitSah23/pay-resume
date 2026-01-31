'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { FileText, Database, Shield } from 'lucide-react';

export default function ResumePreview() {
  const { text, fileName } = useAppSelector((state) => state.resume);

  if (!text) return null;

  return (
    <div className="neo-card p-0 flex flex-col h-[800px] border-t-2 border-primary/20 bg-black/40 backdrop-blur-sm group">
      <div className="p-6 border-b border-primary/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary">
            <FileText size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Source_Repository</h3>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{fileName || 'DATA_STREAM.TXT'}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="w-8 h-8 flex items-center justify-center border border-primary/10 text-primary/40 hover:text-primary transition-colors cursor-pointer">
              <Database size={14} />
           </div>
           <div className="w-8 h-8 flex items-center justify-center border border-primary/10 text-primary/40 hover:text-primary transition-colors cursor-pointer">
              <Shield size={14} />
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 relative section-grid">
         {/* Decorative Overlay */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none" />

         <div className="prose prose-sm max-w-none relative z-10">
            <div className="flex items-center gap-4 mb-8 opacity-20">
              <div className="h-px bg-primary flex-1" />
              <div className="text-[10px] font-black uppercase tracking-[1em] text-primary">RAW_EXTRACT</div>
              <div className="h-px bg-primary flex-1" />
            </div>

            <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-gray-400 p-6 bg-white/[0.01] border border-white/5 selection:bg-primary selection:text-black">
              {text}
            </pre>

            <div className="flex items-center gap-4 mt-8 opacity-20">
              <div className="h-px bg-primary flex-1" />
              <div className="text-[10px] font-black uppercase tracking-[1em] text-primary">END_OF_STREAM</div>
              <div className="h-px bg-primary flex-1" />
            </div>
         </div>
      </div>
      
      {/* Footer Pattern */}
      <div className="barcode-pattern h-1" />
    </div>
  );
}
