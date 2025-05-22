
export interface LessonPlan {
  id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  title: string;
  description?: string;
  objective: string;
  duration_minutes?: number;
  created_by: string;
  status: 'Draft' | 'Published';
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  lesson_id: string;
  chapter_title: string;
  chapter_number: number;
  content: string;
  resources?: string[];
  assessment?: any; // JSON object with assessment questions
  teacher_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LessonSummary {
  id: string;
  title: string;
  description?: string;
  class_name: string;
  subject_name: string;
  duration_minutes?: number;
  status: 'Draft' | 'Published';
  chapters_count: number;
}

export interface ClassOption {
  id: string;
  name: string;
}

export interface SectionOption {
  id: string;
  name: string;
}

export interface SubjectOption {
  id: string;
  name: string;
}
