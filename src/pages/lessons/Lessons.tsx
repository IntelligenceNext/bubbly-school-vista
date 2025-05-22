
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LessonForm, LessonFormValues } from '@/components/lessons/LessonForm';
import { LessonCard } from '@/components/lessons/LessonCard';
import { Plus, Search } from 'lucide-react';

// Mock data for development
const mockClasses = [
  { id: '1', name: 'Grade 1' },
  { id: '2', name: 'Grade 2' },
  { id: '3', name: 'Grade 3' },
  { id: '4', name: 'Grade 4' },
];

const mockSections = [
  { id: '1', name: 'Section A' },
  { id: '2', name: 'Section B' },
];

const mockSubjects = [
  { id: '1', name: 'Mathematics' },
  { id: '2', name: 'Science' },
  { id: '3', name: 'English' },
  { id: '4', name: 'Social Studies' },
];

const mockLessons = [
  {
    id: '1',
    title: 'Introduction to Algebra',
    description: 'Basic introduction to algebraic concepts for beginners.',
    class_name: 'Grade 3',
    subject_name: 'Mathematics',
    duration_minutes: 45,
    status: 'Published' as const,
    chapters_count: 3,
  },
  {
    id: '2',
    title: 'Plant Life Cycle',
    description: 'Exploring how plants grow, reproduce, and their life cycles.',
    class_name: 'Grade 2',
    subject_name: 'Science',
    duration_minutes: 30,
    status: 'Draft' as const,
    chapters_count: 2,
  },
  {
    id: '3',
    title: 'Reading Comprehension',
    description: 'Strategies for understanding and analyzing texts.',
    class_name: 'Grade 4',
    subject_name: 'English',
    duration_minutes: 60,
    status: 'Published' as const,
    chapters_count: 5,
  },
];

const Lessons = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  
  // Filter lessons
  const filteredLessons = mockLessons.filter(lesson => {
    // Filter by tab
    if (activeTab === 'published' && lesson.status !== 'Published') return false;
    if (activeTab === 'draft' && lesson.status !== 'Draft') return false;
    
    // Filter by class
    if (classFilter && lesson.class_name !== mockClasses.find(c => c.id === classFilter)?.name) return false;
    
    // Filter by subject
    if (subjectFilter && lesson.subject_name !== mockSubjects.find(s => s.id === subjectFilter)?.name) return false;
    
    // Filter by search
    if (search && !lesson.title.toLowerCase().includes(search.toLowerCase())) return false;
    
    return true;
  });

  const handleLessonSave = (data: LessonFormValues) => {
    setIsLoading(true);
    
    // Mock API call
    setTimeout(() => {
      console.log('Lesson data:', data);
      setIsLoading(false);
      setIsDialogOpen(false);
      // Would update state here in real implementation
    }, 1000);
  };

  const handleEditLesson = (id: string) => {
    // In a real implementation, you would fetch the lesson data and open the form
    console.log('Edit lesson:', id);
  };

  const handleAddChapter = (lessonId: string) => {
    navigate(`/lessons/chapters/new?lessonId=${lessonId}`);
  };

  const handleViewChapters = (lessonId: string) => {
    navigate(`/lessons/chapters?lessonId=${lessonId}`);
  };

  return (
    <PageTemplate title="Lessons" subtitle="Manage teaching lessons and lesson plans">
      <div className="space-y-6">
        <PageHeader
          title="Lessons"
          description="Create and manage lesson plans for your classes and subjects"
          primaryAction={{
            label: 'New Lesson',
            onClick: () => setIsDialogOpen(true),
            icon: <Plus className="h-4 w-4" />,
          }}
        />

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search lessons..." 
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-classes">All Classes</SelectItem>
                {mockClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-subjects">All Subjects</SelectItem>
                {mockSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Tabs and Lessons List */}
        <Tabs 
          defaultValue="all" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="all">All Lessons</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredLessons.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No lessons found</h3>
                <p className="text-muted-foreground mt-1">
                  {search || classFilter || subjectFilter ? 
                    'Try adjusting your filters to see more results' : 
                    'Create your first lesson to get started'}
                </p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Lesson
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLessons.map(lesson => (
                  <LessonCard 
                    key={lesson.id}
                    lesson={lesson}
                    onEdit={handleEditLesson}
                    onAddChapter={handleAddChapter}
                    onViewChapters={handleViewChapters}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* New Lesson Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Lesson Plan</DialogTitle>
          </DialogHeader>
          <LessonForm 
            onSubmit={handleLessonSave}
            isLoading={isLoading}
            classes={mockClasses}
            sections={mockSections}
            subjects={mockSubjects}
          />
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default Lessons;
