'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCheck, Lightbulb, UserX } from 'lucide-react';

export default function FeedbackPanel() {
  const { result } = useAppSelector((state) => state.resume);

  if (!result) return null;

  const { feedback } = result.details;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Missing Keywords */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserX className="h-5 w-5 text-red-500" />
            Missing Keywords
          </CardTitle>
        </CardHeader>
        <CardContent>
          {feedback.missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {feedback.missingKeywords.map((keyword) => (
                <span key={keyword} className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs font-semibold capitalize">
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCheck className="h-4 w-4" />
              <span className="text-sm font-medium">Great job! You matched all expected key terms.</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            Adding these keywords can help your resume get flagged by ATS algorithms for relevant roles.
          </p>
        </CardContent>
      </Card>

      {/* Formatting Issues */}
      {(feedback.formattingIssues.length > 0) && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Formatting & Readability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.formattingIssues.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Missing Sections / Improvements */}
      {(feedback.missingSections.length > 0 || feedback.sectionOrderSuggestions.length > 0) && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feedback.missingSections.length > 0 && (
                <Alert className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                  <AlertTitle className="text-blue-800 dark:text-blue-300 text-sm font-semibold">Missing Important Sections</AlertTitle>
                  <AlertDescription className="text-blue-700 dark:text-blue-400 text-xs mt-1">
                    Consider adding: {feedback.missingSections.join(", ")}
                  </AlertDescription>
                </Alert>
              )}
              
              {feedback.sectionOrderSuggestions.map((suggestion, idx) => (
                <div key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                   <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                   {suggestion}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
