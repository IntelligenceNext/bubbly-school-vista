
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'super_admin' | 'school_admin';

export interface UserSchoolAssignment {
  id: string;
  user_id: string;
  school_id: string;
  role: UserRole;
  is_active: boolean;
  assigned_at: string;
  assigned_by?: string;
}

export const getUserSchoolAssignment = async (userId?: string) => {
  try {
    const { data, error } = await supabase
      .from('user_school_assignments')
      .select('*')
      .eq('user_id', userId || (await supabase.auth.getUser()).data.user?.id)
      .eq('is_active', true)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
      console.error('Error fetching user school assignment:', error);
      return null;
    }
    
    return data as UserSchoolAssignment | null;
  } catch (error) {
    console.error('Error in getUserSchoolAssignment:', error);
    return null;
  }
};

export const assignUserToSchool = async (
  userId: string, 
  schoolId: string, 
  role: UserRole = 'school_admin'
) => {
  try {
    const { data, error } = await supabase
      .from('user_school_assignments')
      .insert({
        user_id: userId,
        school_id: schoolId,
        role,
        is_active: true,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error assigning user to school:', error);
      throw error;
    }
    
    return data as UserSchoolAssignment;
  } catch (error) {
    console.error('Error in assignUserToSchool:', error);
    throw error;
  }
};

export const getUserAssignedSchoolId = async (): Promise<string | null> => {
  try {
    const assignment = await getUserSchoolAssignment();
    return assignment?.school_id || null;
  } catch (error) {
    console.error('Error getting user assigned school ID:', error);
    return null;
  }
};

// Check if current user is super admin
export const isSuperAdmin = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('is_super_admin');
    
    if (error) {
      console.error('Error checking super admin status:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Error in isSuperAdmin:', error);
    return false;
  }
};

// Check if current user is school admin for a specific school
export const isSchoolAdminForSchool = async (schoolId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('is_school_admin_for_school', {
      school_uuid: schoolId
    });
    
    if (error) {
      console.error('Error checking school admin status:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Error in isSchoolAdminForSchool:', error);
    return false;
  }
};
