import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ATSResult, ResumeData } from '@/lib/ats/types';

interface ResumeState {
  file: File | null; // Note: Non-serializable parts like File objects might cause Redux warnings. 
                     // Usually we don't store File in Redux, but for MVP it's convenient if we disable the check or just store meaningful data.
                     // Better: Store file name and extract text. File object is only needed for upload.
  fileName: string | null;
  text: string | null;
  isAnalyzing: boolean;
  parseError: string | null;
  result: ATSResult | null;
}

const initialState: ResumeState = {
  file: null,
  fileName: null,
  text: null,
  isAnalyzing: false,
  parseError: null,
  result: null,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setAnalyzing: (state, action: PayloadAction<boolean>) => {
      state.isAnalyzing = action.payload;
      if (action.payload) {
        state.parseError = null;
      }
    },
    setResumeData: (state, action: PayloadAction<{ fileName: string; text: string }>) => {
      state.fileName = action.payload.fileName;
      state.text = action.payload.text;
    },
    setAnalysisResult: (state, action: PayloadAction<ATSResult>) => {
      state.result = action.payload;
      state.isAnalyzing = false;
    },
    setParseError: (state, action: PayloadAction<string>) => {
      state.parseError = action.payload;
      state.isAnalyzing = false;
    },
    resetResume: (state) => {
      return initialState;
    }
  },
});

export const { setAnalyzing, setResumeData, setAnalysisResult, setParseError, resetResume } = resumeSlice.actions;
export default resumeSlice.reducer;
