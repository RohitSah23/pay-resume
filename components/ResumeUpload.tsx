'use client';

import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setAnalyzing, setResumeData, setAnalysisResult, setParseError } from '@/lib/store/resumeSlice';
import { analyzeResume } from '@/lib/ats/scorer';
import { UploadCloud, AlertCircle, Loader2, Sparkles, Zap } from 'lucide-react';

export default function ResumeUpload() {
  const dispatch = useAppDispatch();
  const { isAnalyzing, parseError } = useAppSelector((state) => state.resume);
  const [dragActive, setDragActive] = useState(false);
  const [useAI, setUseAI] = useState(true);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const processFile = async (file: File) => {
    if (!file) return;

    if (file.type !== 'application/pdf' && 
        file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
        !file.name.endsWith('.docx')) {
      dispatch(setParseError('Unsupported file format. Please upload PDF or DOCX.'));
      return;
    }

    dispatch(setAnalyzing(true));
    dispatch(setParseError(''));
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      // 1. Extract Text
      const parseResponse = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!parseResponse.ok) {
        throw new Error('Failed to parse resume');
      }

      const parseData = await parseResponse.json();
      
      if (parseData.error) {
        throw new Error(parseData.error);
      }

      dispatch(setResumeData({ fileName: file.name, text: parseData.text }));
      
      // 2. Analyze
      if (useAI) {
        const aiResponse = await fetch('/api/analyze-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: parseData.text }),
        });

        if (!aiResponse.ok) {
          const err = await aiResponse.json();
          throw new Error(err.error || 'AI Analysis failed');
        }

        const aiResult = await aiResponse.json();
        dispatch(setAnalysisResult(aiResult));
      } else {
        const results = analyzeResume(parseData.text);
        dispatch(setAnalysisResult(results));
      }

    } catch (error: any) {
      dispatch(setParseError(error.message || 'An error occurred during analysis.'));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-center gap-6 mb-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={useAI} 
            onChange={(e) => setUseAI(e.target.checked)} 
            className="hidden"
          />
          <div className={`w-10 h-10 border flex items-center justify-center transition-all ${useAI ? 'bg-primary border-primary text-black' : 'border-primary/20 text-primary/20 hover:border-primary/50'}`}>
            <Sparkles size={20} />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${useAI ? 'text-white' : 'text-gray-600'}`}>
            AI Analysis Powered
          </span>
        </label>
      </div>

      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`neo-card transition-all duration-500 min-h-[300px] flex items-center justify-center border-2 border-dashed ${
          dragActive ? 'border-primary scale-[1.01] bg-primary/5' : 'border-primary/10'
        } ${isAnalyzing ? 'opacity-80 pointer-events-none' : ''}`}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/10 overflow-hidden">
          {isAnalyzing && <div className="h-full bg-primary animate-[shimmer_2s_infinite] w-[30%]" />}
        </div>

        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleChange}
          disabled={isAnalyzing}
        />
        
        <div className={`flex flex-col items-center gap-6 p-8 relative z-10 text-center transition-all duration-500 ${isAnalyzing ? 'scale-110' : ''}`}>
          <div className={`w-20 h-20 flex items-center justify-center border border-primary/20 relative group-hover:border-primary/50 transition-colors ${isAnalyzing ? 'border-primary shadow-[0_0_30px_rgba(212,255,0,0.2)]' : ''}`}>
            {isAnalyzing ? (
              <div className="relative">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
              </div>
            ) : (
              <>
                <UploadCloud className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary" />
              </>
            )}
          </div>

          <div className="space-y-4">
            <h3 className={`text-2xl font-black uppercase tracking-tighter italic ${isAnalyzing ? 'animate-glitch spotlight-text' : ''}`}>
              {isAnalyzing ? 'Scanning Pulse...' : 'Upload Repository'}
            </h3>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em] max-w-xs mx-auto leading-loose">
              {isAnalyzing ? 'Extracting semantic layers and verifying integrity' : 'PDF / DOCX Format Supported. Systemic Extraction Enabled.'}
            </p>
          </div>

          {!isAnalyzing && (
            <label htmlFor="file-upload" className="neo-button cursor-pointer">
               Initialize Scan <Zap size={16} fill="currentColor" />
            </label>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 text-[8px] font-mono text-gray-700 uppercase">SYS_UPLOAD_V2.0.26</div>
        <div className="absolute bottom-4 right-4 text-[8px] font-mono text-gray-700 uppercase">ENCRYPTED_TRANSFER</div>
      </div>

      {parseError && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 flex gap-4 items-center animate-in fade-in slide-in-from-top-4">
           <AlertCircle className="text-red-500 shrink-0" />
           <div className="text-xs font-bold uppercase tracking-widest text-red-500">{parseError}</div>
        </div>
      )}
    </div>
  );
}
