'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';

export default function ResumePreview() {
  const { text, fileName } = useAppSelector((state) => state.resume);

  if (!text) return null;

  return (
    <Card className="h-150 flex flex-col overflow-hidden border-t-4 border-t-primary/20">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Resume Preview
          {fileName && <span className="text-sm font-normal text-muted-foreground ml-auto truncate max-w-50">{fileName}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-full p-6">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/80">
              {text}
            </pre>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
