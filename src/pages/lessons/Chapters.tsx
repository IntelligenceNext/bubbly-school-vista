
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChapterForm, ChapterFormValues } from '@/components/lessons/ChapterForm';
import { ChapterCard } from '@/components/lessons/ChapterCard';
import { ArrowLeft, Plus } from 'lucide-react';

// Mock data for development
const mockLessons = [
  {
    id: '1',
    title: 'Introduction to Algebra',
    class_name: 'Grade 3',
    subject_name: 'Mathematics',
  },
  {
    id: '2',
    title: 'Plant Life Cycle',
    class_name: 'Grade 2',
    subject_name: 'Science',
  },
];

const mockChapters = [
  {
    id: '1',
    lesson_id: '1',
    chapter_number: 1,
    chapter_title: 'Variables and Constants',
    content: 'This chapter introduces the concept of variables and constants in algebra. Variables are symbols that represent values that can change, while constants are fixed values.',
    resources: ['https://example.com/resource1.pdf'],
  },
  {
    id: '2',
    lesson_id: '1',
    chapter_number: 2,
    chapter_title: 'Basic Operations with Variables',
    content: 'Learn how to perform addition, subtraction, multiplication, and division with algebraic expressions and variables.',
    resources: ['https://example.com/resource2.pdf', 'https://example.com/resource3.mp4'],
  },
  {
    id: '3',
    lesson_id: '2',
    chapter_number: 1,
    chapter_title: 'Seed Germination',
    content: 'Explore how seeds germinate and transform into seedlings, including the conditions needed for successful germination.',
    resources: [],
  },
];

const Chapters = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [chapters, setChapters] = useState<typeof mockChapters>([]);
  
  // Parse lessonId from query params if present
  const queryParams = new URLSearchParams(location.search);
  const lessonIdParam = queryParams.get('lessonId');
  
  useEffect(() => {
    if (lessonIdParam) {
      setSelectedLesson(lessonIdParam);
      // Filter chapters for this lesson
      setChapters(mockChapters.filter(chapter => chapter.lesson_id === lessonIdParam));
    } else {
      setChapters(mockChapters);
    }
  }, [lessonIdParam]);
  
  const currentLesson = selectedLesson ? 
    mockLessons.find(lesson => lesson.id === selectedLesson) : 
    null;
  
  const handleChapterSave = (data: ChapterFormValues) => {
    setIsLoading(true);
    
    // Mock API call
    setTimeout(() => {
      console.log('Chapter data:', data);
      setIsLoading(false);
      setIsDialogOpen(false);
      // Would update state here in real implementation
    }, 1000);
  };

  const handleEditChapter = (id: string) => {
    // In a real implementation, you would fetch the chapter data and open the form
    console.log('Edit chapter:', id);
  };

  const handleViewChapter = (id: string) => {
    // In a real implementation, you would navigate to the chapter details page
    console.log('View chapter:', id);
  };

  const handleBack = () => {
    navigate('/lessons');
  };

  return (
    <PageTemplate 
      title={currentLesson ? `Chapters: ${currentLesson.title}` : 'Chapters'} 
      subtitle={currentLesson ? `${currentLesson.class_name} | ${currentLesson.subject_name}` : 'Organize subject chapters and content'}
    >
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Lessons
          </Button>
          
          <PageHeader
            title={currentLesson ? `Chapters: ${currentLesson.title}` : 'All Chapters'}
            description="Create and manage chapter content for your lessons"
            primaryAction={{
              label: 'New Chapter',
              onClick: () => setIsDialogOpen(true),
              icon: <Plus className="h-4 w-4" />,
            }}
          />
        </div>
        
        {/* Chapters List */}
        <div className="space-y-6">
          {chapters.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No chapters found</h3>
              <p className="text-muted-foreground mt-1">
                {currentLesson ? 
                  `Add chapters to "${currentLesson.title}" to get started` : 
                  'Select a lesson or create a new chapter'}
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Chapter
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chapters.map(chapter => (
                <ChapterCard 
                  key={chapter.id}
                  chapter={chapter}
                  onEdit={handleEditChapter}
                  onView={handleViewChapter}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* New Chapter Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentLesson ? 
                `Add Chapter to "${currentLesson.title}"` : 
                'Create New Chapter'}
            </DialogTitle>
          </DialogHeader>
          <ChapterForm 
            onSubmit={handleChapterSave}
            isLoading={isLoading}
            lessons={mockLessons}
            lessonId={selectedLesson || undefined}
          />
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default Chapters;
