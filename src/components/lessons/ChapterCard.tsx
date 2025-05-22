
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, File } from 'lucide-react';

interface ChapterCardProps {
  chapter: {
    id: string;
    chapter_number: number;
    chapter_title: string;
    content: string;
    resources?: string[];
  };
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

export function ChapterCard({ 
  chapter,
  onEdit,
  onView
}: ChapterCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex gap-2 items-baseline">
          <span className="text-lg font-semibold">#{chapter.chapter_number}</span>
          <h3 className="text-lg font-medium">{chapter.chapter_title}</h3>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {chapter.content}
        </p>
        {chapter.resources && chapter.resources.length > 0 && (
          <div className="mt-2 flex items-center gap-1">
            <File className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {chapter.resources.length} {chapter.resources.length === 1 ? 'resource' : 'resources'}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(chapter.id)}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => onView(chapter.id)}
          className="flex-1"
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
}
