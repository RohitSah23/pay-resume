import { NextRequest, NextResponse } from 'next/server';
import { analyzeResumeWithAI } from '@/lib/ats/ai-analyzer';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No resume text provided' }, { status: 400 });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({ 
        error: 'Gemini API Key is missing in environment variables.' 
      }, { status: 500 });
    }

    const result = await analyzeResumeWithAI(text);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI Route Error:', error);
    return NextResponse.json({ error: error.message || 'AI Analysis failed' }, { status: 500 });
  }
}
