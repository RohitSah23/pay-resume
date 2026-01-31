'use client';

import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setAnalyzing, setResumeData, setAnalysisResult, setParseError } from '@/lib/store/resumeSlice';
import { analyzeResume } from '@/lib/ats/scorer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
        // Fallback to Rule-Based
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
    <div className="w-full max-w-2xl mx-auto mb-8 space-y-4">
      <div className="flex items-center justify-end space-x-2 mr-2">
        <Sparkles className={`h-4 w-4 ${useAI ? 'text-purple-500' : 'text-muted-foreground'}`} />
        <Label htmlFor="ai-toggle" className="text-sm font-medium">AI Analysis (Gemini)</Label>
        <Switch
          id="ai-toggle"
          checked={useAI}
          onCheckedChange={setUseAI}
          disabled={isAnalyzing}
        />
      </div>

      <Card 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed transition-all duration-300 ${
        dragActive ? 'border-primary bg-primary/5' : 'border-border'
      } ${isAnalyzing ? 'opacity-80 pointer-events-none' : ''}`}>
        <CardContent className="flex flex-col items-center justify-center p-10 text-center space-y-4">
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,.docx"
            onChange={handleChange}
            disabled={isAnalyzing}
          />
          
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
            {isAnalyzing ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <UploadCloud className="h-8 w-8" />
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">
              {isAnalyzing ? 'Analyzing Resume...' : 'Upload your Resume'}
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Drag & drop your PDF or DOCX file here, or click to browse.
            </p>
          </div>

          {!isAnalyzing && (
            <Button asChild variant="outline" className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                Select File
              </label>
            </Button>
          )}
        </CardContent>
      </Card>

      {parseError && (
        <Alert variant="destructive" className="mt-4 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{parseError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
