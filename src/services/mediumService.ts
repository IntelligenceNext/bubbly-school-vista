
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
  console.log('Fetching mediums...');
  const { data, error } = await supabase
    .from('mediums')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching mediums:', error);
    throw error;
  }
  console.log('Fetched mediums:', data);
  return data || [];
};

export const createMedium = async (mediumData: Omit<Medium, 'id' | 'created_at' | 'updated_at'>) => {
  console.log('Creating medium with data:', mediumData);
  
  // Ensure school_id is set
  if (!mediumData.school_id) {
    throw new Error('School ID is required');
  }
  
  const { data, error } = await supabase
    .from('mediums')
    .insert(mediumData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating medium:', error);
    throw error;
  }
  console.log('Created medium:', data);
  return data;
};

export const updateMedium = async (id: string, mediumData: Partial<Omit<Medium, 'id' | 'created_at' | 'updated_at'>>) => {
  console.log('Updating medium:', id, mediumData);
  const { data, error } = await supabase
    .from('mediums')
    .update(mediumData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating medium:', error);
    throw error;
  }
  console.log('Updated medium:', data);
  return data;
};

export const deleteMedium = async (id: string) => {
  console.log('Deleting medium:', id);
  const { error } = await supabase
    .from('mediums')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting medium:', error);
    throw error;
  }
  console.log('Deleted medium successfully');
  return true;
};
