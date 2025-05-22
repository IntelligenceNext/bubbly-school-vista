
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { LessonPlan, Chapter, LessonSummary } from '@/types/lessons';

// Get all lessons with summary information
export const getLessons = async (schoolId: string): Promise<LessonSummary[]> => {
  try {
    // In a real implementation, this would join with classes and subjects tables
    // and count chapters from the chapters table
    const { data, error } = await supabase
      .from('lesson_plans')
      .select(`
        id, 
        title,
        description,
        duration_minutes,
        status,
        classes!inner(id, name),
        subjects!inner(id, name)
      `)
      .eq('school_id', schoolId);

    if (error) {
      toast({
        title: "Failed to fetch lessons",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }

    // Get chapter counts for each lesson
    const lessonIds = data.map(lesson => lesson.id);
    
    const { data: chapterCounts, error: countError } = await supabase
      .from('chapters')
      .select('lesson_id, id')
      .in('lesson_id', lessonIds);

    if (countError) {
      console.error('Error fetching chapter counts:', countError);
    }

    // Transform data to match LessonSummary interface
    return data.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      class_name: lesson.classes.name,
      subject_name: lesson.subjects.name,
      duration_minutes: lesson.duration_minutes,
      status: lesson.status,
      chapters_count: chapterCounts 
        ? chapterCounts.filter(c => c.lesson_id === lesson.id).length
        : 0
    }));
  } catch (error) {
    console.error('Error in getLessons:', error);
    toast({
      title: "Failed to fetch lessons",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return [];
  }
};

// Get a single lesson by ID
export const getLessonById = async (id: string): Promise<LessonPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('lesson_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast({
        title: "Failed to fetch lesson",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    return data as LessonPlan;
  } catch (error) {
    console.error('Error in getLessonById:', error);
    toast({
      title: "Failed to fetch lesson",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Create a new lesson
export const createLesson = async (lessonData: Omit<LessonPlan, 'id' | 'created_at' | 'updated_at'>): Promise<LessonPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('lesson_plans')
      .insert([lessonData])
      .select()
      .single();

    if (error) {
      toast({
        title: "Failed to create lesson",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Lesson created",
      description: "The lesson plan has been created successfully",
    });

    return data as LessonPlan;
  } catch (error) {
    console.error('Error in createLesson:', error);
    toast({
      title: "Failed to create lesson",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Update an existing lesson
export const updateLesson = async (id: string, lessonData: Partial<LessonPlan>): Promise<LessonPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('lesson_plans')
      .update(lessonData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Failed to update lesson",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Lesson updated",
      description: "The lesson plan has been updated successfully",
    });

    return data as LessonPlan;
  } catch (error) {
    console.error('Error in updateLesson:', error);
    toast({
      title: "Failed to update lesson",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Delete a lesson by ID
export const deleteLesson = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lesson_plans')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Failed to delete lesson",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Lesson deleted",
      description: "The lesson plan has been deleted successfully",
    });

    return true;
  } catch (error) {
    console.error('Error in deleteLesson:', error);
    toast({
      title: "Failed to delete lesson",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};

// Get all chapters for a specific lesson
export const getChaptersByLessonId = async (lessonId: string): Promise<Chapter[]> => {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('chapter_number', { ascending: true });

    if (error) {
      toast({
        title: "Failed to fetch chapters",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }

    return data as Chapter[];
  } catch (error) {
    console.error('Error in getChaptersByLessonId:', error);
    toast({
      title: "Failed to fetch chapters",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return [];
  }
};

// Get a single chapter by ID
export const getChapterById = async (id: string): Promise<Chapter | null> => {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast({
        title: "Failed to fetch chapter",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    return data as Chapter;
  } catch (error) {
    console.error('Error in getChapterById:', error);
    toast({
      title: "Failed to fetch chapter",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Create a new chapter
export const createChapter = async (chapterData: Omit<Chapter, 'id' | 'created_at' | 'updated_at'>): Promise<Chapter | null> => {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .insert([chapterData])
      .select()
      .single();

    if (error) {
      toast({
        title: "Failed to create chapter",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Chapter created",
      description: "The chapter has been created successfully",
    });

    return data as Chapter;
  } catch (error) {
    console.error('Error in createChapter:', error);
    toast({
      title: "Failed to create chapter",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Update an existing chapter
export const updateChapter = async (id: string, chapterData: Partial<Chapter>): Promise<Chapter | null> => {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .update(chapterData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Failed to update chapter",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Chapter updated",
      description: "The chapter has been updated successfully",
    });

    return data as Chapter;
  } catch (error) {
    console.error('Error in updateChapter:', error);
    toast({
      title: "Failed to update chapter",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Delete a chapter by ID
export const deleteChapter = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Failed to delete chapter",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Chapter deleted",
      description: "The chapter has been deleted successfully",
    });

    return true;
  } catch (error) {
    console.error('Error in deleteChapter:', error);
    toast({
      title: "Failed to delete chapter",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};
