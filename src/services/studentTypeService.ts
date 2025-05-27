
import { supabase } from '@/integrations/supabase/client';

export interface StudentType {
  id: string;
  name: string;
  description: string | null;
  school_id: string;
  status: string;
  created_at: string;
  updated_at: string | null;
}

export const getStudentTypes = async () => {
  console.log('Fetching student types...');
  const { data, error } = await supabase
    .from('student_types')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching student types:', error);
    throw error;
  }
  console.log('Fetched student types:', data);
  return data || [];
};

export const createStudentType = async (studentTypeData: Omit<StudentType, 'id' | 'created_at' | 'updated_at'>) => {
  console.log('Creating student type with data:', studentTypeData);
  
  if (!studentTypeData.school_id) {
    throw new Error('School ID is required');
  }
  
  const { data, error } = await supabase
    .from('student_types')
    .insert(studentTypeData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating student type:', error);
    throw error;
  }
  console.log('Created student type:', data);
  return data;
};

export const updateStudentType = async (id: string, studentTypeData: Partial<Omit<StudentType, 'id' | 'created_at' | 'updated_at'>>) => {
  console.log('Updating student type:', id, studentTypeData);
  const { data, error } = await supabase
    .from('student_types')
    .update(studentTypeData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating student type:', error);
    throw error;
  }
  console.log('Updated student type:', data);
  return data;
};

export const deleteStudentType = async (id: string) => {
  console.log('Deleting student type:', id);
  const { error } = await supabase
    .from('student_types')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting student type:', error);
    throw error;
  }
  console.log('Deleted student type successfully');
  return true;
};
