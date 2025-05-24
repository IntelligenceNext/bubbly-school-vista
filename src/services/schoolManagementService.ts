
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Interfaces for tables
export interface School {
  id: string;
  name: string;
  code: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: 'active' | 'inactive';
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  school_id: string;
  name: string;
  code: string;
  description: string | null;
  is_active: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  schools?: { name: string };
}

export interface Session {
  id: string;
  school_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  is_active: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  schools?: { name: string };
}

// Setting interface
export interface Setting {
  id?: string;
  school_id: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
}

// Response interfaces
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
}

// Parameter interfaces
export interface GetSchoolsParams {
  name?: string;
  status?: 'active' | 'inactive';
  created_at_start?: string;
  created_at_end?: string;
  page?: number;
  pageSize?: number;
}

export interface GetClassesParams {
  school_id?: string;
  name?: string;
  is_active?: boolean;
  page?: number;
  pageSize?: number;
}

export interface GetSessionsParams {
  school_id?: string;
  is_current?: boolean;
  is_active?: boolean;
  page?: number;
  pageSize?: number;
}

export interface GetSettingsParams {
  schoolId: string;
  key?: string;
}

// School management APIs
export const getSchools = async (params: GetSchoolsParams = {}): Promise<PaginatedResponse<School>> => {
  console.log('Fetching schools with params:', params);
  const { name, status, created_at_start, created_at_end, page, pageSize } = params;

  try {
    // Log the supabase instance to verify it's properly initialized
    console.log('Supabase client:', supabase);
    
    let query = supabase
      .from('schools')
      .select('*', { count: 'exact' });
    
    console.log('Query initialized for schools table');
    
    if (name) {
      query = query.ilike('name', `%${name}%`);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (created_at_start) {
      query = query.gte('created_at', created_at_start);
    }
    
    if (created_at_end) {
      const endDate = new Date(created_at_end);
      endDate.setDate(endDate.getDate() + 1);
      query = query.lt('created_at', endDate.toISOString());
    }

    // Apply pagination if provided
    if (page !== undefined && pageSize !== undefined) {
      const start = (page - 1) * pageSize;
      query = query.range(start, start + pageSize - 1);
    }
    
    // Sort by created_at date, newest first
    query = query.order('created_at', { ascending: false });
    
    console.log('Executing query:', query);
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching schools:', error);
      throw error;
    }
    
    console.log(`Retrieved ${count} schools:`, data);
    
    // Ensure status is cast to the correct type
    const typedData = data?.map(school => ({
      ...school,
      status: school.status as 'active' | 'inactive'
    })) || [];
    
    return { 
      data: typedData,
      count: count || 0
    };
  } catch (error: any) {
    console.error('Error in getSchools:', error);
    toast({
      title: "Failed to fetch schools",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return { data: [], count: 0 };
  }
};

export const createSchool = async (school: Omit<School, 'id' | 'created_at' | 'updated_at'>): Promise<School | null> => {
  try {
    console.log('Creating school with data:', school);
    
    // Make sure we have the correct column names matching the database
    const schoolData = {
      name: school.name,
      code: school.code || null,
      email: school.email || null,
      phone: school.phone || null,
      address: school.address || null,
      status: school.status || 'active',
      logo_url: school.logo_url || null,
    };
    
    console.log('Prepared school data for insertion:', schoolData);
    
    const { data, error } = await supabase
      .from('schools')
      .insert([schoolData])
      .select();
    
    if (error) {
      console.error('Error creating school:', error);
      throw error;
    }
    
    console.log('School created successfully:', data);
    return data[0] as School;
  } catch (error: any) {
    console.error('Error in createSchool:', error);
    toast({
      title: "Failed to create school",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};

export const getSchoolById = async (id: string): Promise<School | null> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching school by ID:', error);
      toast({
        title: "Error fetching school",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
    
    return data as School;
  } catch (error: any) {
    console.error('Error in getSchoolById:', error);
    toast({
      title: "Failed to fetch school",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};

export const updateSchool = async (
  id: string,
  updates: Partial<Omit<School, 'id' | 'created_at'>>
): Promise<School | null> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating school:', error);
      toast({
        title: "Error updating school",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
    
    return data as School;
  } catch (error: any) {
    console.error('Error in updateSchool:', error);
    toast({
      title: "Failed to update school",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};

export const getClasses = async (params: GetClassesParams = {}): Promise<PaginatedResponse<Class>> => {
  const { school_id, name, is_active, page, pageSize } = params;
  
  try {
    let query = supabase
      .from('classes')
      .select('*', { count: 'exact' });
    
    if (school_id) {
      query = query.eq('school_id', school_id);
    }
    
    if (name) {
      query = query.ilike('name', `%${name}%`);
    }
    
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active);
    }
    
    // Apply pagination if provided
    if (page !== undefined && pageSize !== undefined) {
      const start = (page - 1) * pageSize;
      query = query.range(start, start + pageSize - 1);
    }
    
    // Sort by created_at date, newest first
    query = query.order('created_at', { ascending: false });
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
    
    return {
      data: (data || []) as Class[],
      count: count || 0
    };
  } catch (error) {
    console.error('Error in getClasses:', error);
    toast({
      title: "Failed to fetch classes",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { data: [], count: 0 };
  }
};

export const getSessions = async (params: GetSessionsParams = {}): Promise<PaginatedResponse<Session>> => {
  const { school_id, is_current, is_active, page, pageSize } = params;
  
  try {
    let query = supabase
      .from('sessions')
      .select('*', { count: 'exact' });
    
    if (school_id) {
      query = query.eq('school_id', school_id);
    }
    
    if (is_current !== undefined) {
      query = query.eq('is_current', is_current);
    }
    
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active);
    }
    
    // Apply pagination if provided
    if (page !== undefined && pageSize !== undefined) {
      const start = (page - 1) * pageSize;
      query = query.range(start, start + pageSize - 1);
    }
    
    // Sort by start_date date, newest first
    query = query.order('start_date', { ascending: false });
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
    
    return {
      data: (data || []) as Session[],
      count: count || 0
    };
  } catch (error) {
    console.error('Error in getSessions:', error);
    toast({
      title: "Failed to fetch sessions",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { data: [], count: 0 };
  }
};

export const deleteSchool = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting school:', error);
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error in deleteSchool:', error);
    toast({
      title: "Failed to delete school",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

export const deleteClass = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error in deleteClass:', error);
    toast({
      title: "Failed to delete class",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

export const deleteSession = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error in deleteSession:', error);
    toast({
      title: "Failed to delete session",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

export const bulkUpdateSchoolStatus = async (ids: string[], status: 'active' | 'inactive'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('schools')
      .update({ status, updated_at: new Date().toISOString() })
      .in('id', ids);
    
    if (error) {
      console.error('Error updating schools status:', error);
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error in bulkUpdateSchoolStatus:', error);
    toast({
      title: "Failed to update schools status",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

// Settings management functions
export const getSettings = async (params: GetSettingsParams): Promise<Setting[]> => {
  const { schoolId, key } = params;
  
  try {
    let query = supabase
      .from('settings')
      .select('*')
      .eq('school_id', schoolId);
    
    if (key) {
      query = query.eq('key', key);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
    
    return (data || []) as Setting[];
  } catch (error: any) {
    console.error('Error in getSettings:', error);
    toast({
      title: "Failed to fetch settings",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return [];
  }
};

export const createOrUpdateSetting = async (
  schoolId: string,
  key: string,
  value: any
): Promise<Setting> => {
  // Check if setting exists
  try {
    const { data: existingSettings, error: fetchError } = await supabase
      .from('settings')
      .select('*')
      .eq('school_id', schoolId)
      .eq('key', key);
    
    if (fetchError) {
      console.error('Error checking for existing setting:', fetchError);
      throw fetchError;
    }
    
    const exists = existingSettings && existingSettings.length > 0;
    const now = new Date().toISOString();
    
    if (exists) {
      // Update
      const { data, error } = await supabase
        .from('settings')
        .update({ 
          value,
          updated_at: now
        })
        .eq('school_id', schoolId)
        .eq('key', key)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating setting:', error);
        throw error;
      }
      
      return data as Setting;
    } else {
      // Create
      const { data, error } = await supabase
        .from('settings')
        .insert([{ 
          school_id: schoolId,
          key,
          value,
          created_at: now,
          updated_at: now
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating setting:', error);
        throw error;
      }
      
      return data as Setting;
    }
  } catch (error: any) {
    console.error('Error in createOrUpdateSetting:', error);
    toast({
      title: "Failed to manage setting",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    throw error;
  }
};

export const deleteSetting = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting setting:', error);
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error in deleteSetting:', error);
    toast({
      title: "Failed to delete setting",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};
