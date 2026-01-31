'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle, ListChecks, Type, FileSearch, Eye } from 'lucide-react';

export default function ATSScore() {
  const { result } = useAppSelector((state) => state.resume);

  if (!result) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Main Score Card */}
      <Card className="overflow-hidden border-t-4 border-t-primary">
        <CardHeader className="bg-muted/30 pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            ATS Compatibility Score
            <Badge variant={result.score >= 70 ? "default" : "destructive"}>
              {result.score >= 70 ? "Good" : "Needs Improvement"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
              {result.score}%
            </div>
            <Progress value={result.score} className="h-3 w-full" indicatorClassName={getProgressColor(result.score)} />
            <p className="text-sm text-center text-muted-foreground">
              {result.score >= 80 ? "Your resume is highly optimized for ATS!" : 
               result.score >= 60 ? "Good start, but room for improvement." : 
               "Your resume may get filtered out by ATS systems."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScoreItem 
          icon={<ListChecks className="h-5 w-5 text-blue-500" />}
          label="Section Presence"
          score={result.breakdown.sectionPresence}
          max={30}
        />
        <ScoreItem 
          icon={<FileSearch className="h-5 w-5 text-purple-500" />}
          label="Keywords"
          score={result.breakdown.keywordMatching}
          max={40}
        />
        <ScoreItem 
          icon={<Type className="h-5 w-5 text-orange-500" />}
          label="Formatting"
          score={result.breakdown.formatting}
          max={20}
        />
        <ScoreItem 
          icon={<Eye className="h-5 w-5 text-teal-500" />}
          label="Readability"
          score={result.breakdown.readability}
          max={10}
        />
      </div>

      {/* Sections Found */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Detected Sections</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          {result.details.sections.map((section) => (
            <div key={section.name} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
              {section.present ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm ${section.present ? 'font-medium' : 'text-muted-foreground'}`}>
                {section.name}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
      
    </div>
  );
}

function ScoreItem({ icon, label, score, max }: { icon: React.ReactNode, label: string, score: number, max: number }) {
  const percentage = (score / max) * 100;
  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium text-sm">{label}</span>
          </div>
          <span className="text-sm font-bold">{Math.round(score)}/{max}</span>
        </div>
        <Progress value={percentage} className="h-2" />
      </CardContent>
    </Card>
  );
}
