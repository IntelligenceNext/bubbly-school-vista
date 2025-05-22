
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Edit, Plus } from 'lucide-react';

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    description?: string;
    class_name: string;
    subject_name: string;
    duration_minutes?: number;
    status: 'Draft' | 'Published';
    chapters_count: number;
  };
  onEdit: (id: string) => void;
  onAddChapter: (id: string) => void;
  onViewChapters: (id: string) => void;
}

export function LessonCard({ 
  lesson,
  onEdit,
  onAddChapter,
  onViewChapters
}: LessonCardProps) {
  const statusColor = lesson.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800';
  
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium leading-tight mb-1">
            {lesson.title}
          </CardTitle>
          <Badge className={statusColor}>
            {lesson.status}
          </Badge>
        </div>
        <div className="flex text-sm text-muted-foreground gap-2">
          <span>{lesson.class_name}</span>
          <span>•</span>
          <span>{lesson.subject_name}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {lesson.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {lesson.description}
          </p>
        )}
        <div className="flex items-center gap-4">
          {lesson.duration_minutes && (
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{lesson.duration_minutes} min</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-sm">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>{lesson.chapters_count} {lesson.chapters_count === 1 ? 'chapter' : 'chapters'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4 flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(lesson.id)}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onAddChapter(lesson.id)}
          className="flex-1"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Chapter
        </Button>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => onViewChapters(lesson.id)}
          className="flex-1"
        >
          Chapters
        </Button>
      </CardFooter>
    </Card>
  );
}
