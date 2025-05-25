
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Section {
  id: string;
  class_id: string;
  section_name: string;
  teacher_id?: string;
  medium: string;
  total_capacity: number;
  created_at: string;
  updated_at: string;
}

export interface SectionCapacityView {
  id: string;
  section_name: string;
  class_id: string;
  teacher_id?: string;
  medium: string;
  total_capacity: number;
  total_enrolled: number;
  male_students: number;
  female_students: number;
  other_gender_students: number;
  capacity_percentage: number;
  class_name: string;
  teacher_name?: string;
  teacher_designation?: string;
}

export interface CreateSectionRequest {
  class_id: string;
  section_name: string;
  teacher_id?: string;
  medium: string;
  total_capacity: number;
}

export const getSectionsWithCapacity = async (): Promise<SectionCapacityView[]> => {
  try {
    const { data, error } = await supabase
      .from('section_capacity_view')
      .select('*')
      .order('class_name', { ascending: true })
      .order('section_name', { ascending: true });

    if (error) {
      console.error('Error fetching sections:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getSectionsWithCapacity:', error);
    toast({
      title: "Failed to fetch sections",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return [];
  }
};

export const createSection = async (sectionData: CreateSectionRequest): Promise<Section | null> => {
  try {
    console.log('Creating section with data:', sectionData);

    const { data, error } = await supabase
      .from('sections')
      .insert([sectionData])
      .select()
      .single();

    if (error) {
      console.error('Error creating section:', error);
      if (error.code === '23505') {
        toast({
          title: "Section already exists",
          description: "A section with this name already exists for the selected class",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to create section",
          description: error.message,
          variant: "destructive",
        });
      }
      return null;
    }

    toast({
      title: "Section created successfully",
      description: `Section ${sectionData.section_name} has been created`,
    });

    return data;
  } catch (error) {
    console.error('Error in createSection:', error);
    toast({
      title: "Failed to create section",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};

export const updateSection = async (sectionId: string, sectionData: Partial<CreateSectionRequest>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sections')
      .update(sectionData)
      .eq('id', sectionId);

    if (error) {
      console.error('Error updating section:', error);
      toast({
        title: "Failed to update section",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Section updated successfully",
      description: "The section has been updated",
    });

    return true;
  } catch (error) {
    console.error('Error in updateSection:', error);
    toast({
      title: "Failed to update section",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

export const deleteSection = async (sectionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', sectionId);

    if (error) {
      console.error('Error deleting section:', error);
      toast({
        title: "Failed to delete section",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Section deleted successfully",
      description: "The section has been removed",
    });

    return true;
  } catch (error) {
    console.error('Error in deleteSection:', error);
    toast({
      title: "Failed to delete section",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

export const assignTeacher = async (sectionId: string, teacherId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sections')
      .update({ teacher_id: teacherId })
      .eq('id', sectionId);

    if (error) {
      console.error('Error assigning teacher:', error);
      toast({
        title: "Failed to assign teacher",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Teacher assigned successfully",
      description: "The teacher has been assigned to the section",
    });

    return true;
  } catch (error) {
    console.error('Error in assignTeacher:', error);
    toast({
      title: "Failed to assign teacher",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};
