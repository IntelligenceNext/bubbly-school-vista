
import { supabase } from '@/integrations/supabase/client';

export interface Medium {
  id: string;
  name: string;
  description: string | null;
  school_id: string;
  status: string;
  created_at: string;
  updated_at: string | null;
}

export const getMediums = async () => {
  try {
    const { data, error } = await supabase
      .from('mediums')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching mediums:', error);
    throw error;
  }
};

export const createMedium = async (mediumData: Omit<Medium, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('mediums')
      .insert(mediumData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating medium:', error);
    throw error;
  }
};

export const updateMedium = async (id: string, mediumData: Partial<Omit<Medium, 'id' | 'created_at' | 'updated_at'>>) => {
  try {
    const { data, error } = await supabase
      .from('mediums')
      .update(mediumData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating medium:', error);
    throw error;
  }
};

export const deleteMedium = async (id: string) => {
  try {
    const { error } = await supabase
      .from('mediums')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting medium:', error);
    throw error;
  }
};
