import { supabase } from '@/integrations/supabase/client';

export interface Hostel {
  id: string;
  created_at: string;
  school_id: string;
  name: string;
  description: string;
  capacity: number;
  gender: 'male' | 'female' | 'mixed';
  status: 'active' | 'inactive';
}

export const getHostels = async () => {
  try {
    // Use type assertion to avoid TypeScript errors
    const { data, error } = await (supabase
      .from('hostels') as any)
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching hostels:', error);
    throw error;
  }
};
