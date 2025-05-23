
import { supabase } from '@/integrations/supabase/client';

export interface Class {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: 'active' | 'inactive';
  school_id: string;
  created_at: string;
  updated_at: string | null;
}

export const getClasses = async () => {
  try {
    // Use type assertion to avoid TypeScript errors
    const { data, error } = await (supabase
      .from('classes') as any)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};

export const createClass = async (classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // Use type assertion to avoid TypeScript errors
    const { data, error } = await (supabase
      .from('classes') as any)
      .insert(classData)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
  }
};

export const updateClass = async (id: string, classData: Partial<Omit<Class, 'id' | 'created_at' | 'updated_at'>>) => {
  try {
    // Use type assertion to avoid TypeScript errors
    const { data, error } = await (supabase
      .from('classes') as any)
      .update(classData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating class:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating class:', error);
    throw error;
  }
};

export const deleteClass = async (id: string) => {
  try {
    // Use type assertion to avoid TypeScript errors
    const { error } = await (supabase
      .from('classes') as any)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting class:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting class:', error);
    return false;
  }
};
