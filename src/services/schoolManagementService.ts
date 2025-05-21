
import { supabase } from '@/integrations/supabase/client';

// Export the interfaces that were causing "locally declared but not exported" errors
export interface Class {
  id?: string;
  school_id: string;
  name: string;
  code: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  id?: string;
  school_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active?: boolean;
  is_current?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface School {
  id?: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  logo_url?: string;
  status?: 'active' | 'inactive'; // Fixed the string type to accept only valid values
  created_at?: string;
  updated_at?: string;
}

export interface Setting {
  id?: string;
  school_id: string;
  key: string;
  value: any;
  created_at?: string;
  updated_at?: string;
}

// Parameters interfaces to use for function parameters
export interface GetSettingsParams {
  schoolId: string;
  key?: string;
}

export interface GetClassesParams {
  schoolId: string;
  isActive?: boolean;
}

export interface GetSessionsParams {
  schoolId: string;
  isActive?: boolean;
  isCurrent?: boolean;
}

// Function to get all schools
export const getSchools = async () => {
  const { data, error } = await supabase.from('schools').select('*');

  if (error) throw error;
  return data;
};

// Get a single school by ID
export const getSchool = async (id: string) => {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Create a new school
export const createSchool = async (school: School) => {
  const { data, error } = await supabase
    .from('schools')
    .insert([school])
    .select();

  if (error) throw error;
  return data[0];
};

// Update a school
export const updateSchool = async (id: string, school: Partial<School>) => {
  const { data, error } = await supabase
    .from('schools')
    .update(school)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

// Delete a school
export const deleteSchool = async (id: string) => {
  const { error } = await supabase.from('schools').delete().eq('id', id);

  if (error) throw error;
  return true;
};

// Bulk update school status
export const bulkUpdateSchoolStatus = async (schoolIds: string[], status: 'active' | 'inactive') => {
  // Fix the bulk update - process items one by one to avoid array issue
  const results = [];
  
  for (const id of schoolIds) {
    const { data, error } = await supabase
      .from('schools')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select();
      
    if (error) throw error;
    if (data && data.length > 0) {
      results.push(data[0]);
    }
  }
  
  return results;
};

// Get all classes for a school
export const getClasses = async ({ schoolId, isActive }: GetClassesParams) => {
  let query = supabase
    .from('classes')
    .select('*')
    .eq('school_id', schoolId);

  if (isActive !== undefined) {
    query = query.eq('is_active', isActive);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

// Get a single class by ID
export const getClass = async (id: string) => {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Create a new class
export const createClass = async (classData: Class) => {
  const { data, error } = await supabase
    .from('classes')
    .insert([classData])
    .select();

  if (error) throw error;
  return data[0];
};

// Update a class
export const updateClass = async (id: string, classData: Partial<Class>) => {
  const { data, error } = await supabase
    .from('classes')
    .update(classData)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

// Delete a class
export const deleteClass = async (id: string) => {
  const { error } = await supabase.from('classes').delete().eq('id', id);

  if (error) throw error;
  return true;
};

// Bulk update class status
export const bulkUpdateClassStatus = async (classIds: string[], isActive: boolean) => {
  // Fix the bulk update - process items one by one to avoid array issue
  const results = [];
  
  for (const id of classIds) {
    const { data, error } = await supabase
      .from('classes')
      .update({ 
        is_active: isActive, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select();
      
    if (error) throw error;
    if (data && data.length > 0) {
      results.push(data[0]);
    }
  }
  
  return results;
};

// Get all sessions for a school
export const getSessions = async ({ schoolId, isActive, isCurrent }: GetSessionsParams) => {
  let query = supabase
    .from('sessions')
    .select('*')
    .eq('school_id', schoolId);

  if (isActive !== undefined) {
    query = query.eq('is_active', isActive);
  }

  if (isCurrent !== undefined) {
    query = query.eq('is_current', isCurrent);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

// Get a single session by ID
export const getSession = async (id: string) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Create a new session
export const createSession = async (session: Session) => {
  const { data, error } = await supabase
    .from('sessions')
    .insert([session])
    .select();

  if (error) throw error;
  return data[0];
};

// Update a session
export const updateSession = async (id: string, session: Partial<Session>) => {
  const { data, error } = await supabase
    .from('sessions')
    .update(session)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

// Delete a session
export const deleteSession = async (id: string) => {
  const { error } = await supabase.from('sessions').delete().eq('id', id);

  if (error) throw error;
  return true;
};

// Set a session as current
export const setCurrentSession = async (id: string, schoolId: string) => {
  // First, update all sessions for this school to not be current
  const resetQuery = await supabase
    .from('sessions')
    .update({ is_current: false })
    .eq('school_id', schoolId);

  if (resetQuery.error) throw resetQuery.error;

  // Then set the specified session as current
  const { data, error } = await supabase
    .from('sessions')
    .update({ is_current: true })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

// Get settings for a school
export const getSettings = async ({ schoolId, key }: GetSettingsParams) => {
  let query = supabase
    .from('settings')
    .select('*')
    .eq('school_id', schoolId);

  if (key) {
    query = query.eq('key', key);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

// Get a single setting by ID
export const getSetting = async (id: string) => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Create or update a setting
export const saveSetting = async (setting: Setting) => {
  // Check if setting exists
  const { data: existing, error: findError } = await supabase
    .from('settings')
    .select('id')
    .eq('school_id', setting.school_id)
    .eq('key', setting.key);

  if (findError) throw findError;

  if (existing && existing.length > 0) {
    // Update
    const { data, error } = await supabase
      .from('settings')
      .update({ value: setting.value, updated_at: new Date().toISOString() })
      .eq('id', existing[0].id)
      .select();

    if (error) throw error;
    return data[0];
  } else {
    // Insert
    const { data, error } = await supabase
      .from('settings')
      .insert([setting])
      .select();

    if (error) throw error;
    return data[0];
  }
};

// Delete a setting
export const deleteSetting = async (id: string) => {
  const { error } = await supabase.from('settings').delete().eq('id', id);

  if (error) throw error;
  return true;
};

// Add the missing createOrUpdateSetting function
export const createOrUpdateSetting = async (
  schoolId: string,
  key: string,
  value: any
) => {
  // Try to find existing setting
  const { data: existingSettings, error: findError } = await supabase
    .from('settings')
    .select('*')
    .eq('school_id', schoolId)
    .eq('key', key);

  if (findError) throw findError;

  if (existingSettings && existingSettings.length > 0) {
    // Update existing setting
    const { data, error } = await supabase
      .from('settings')
      .update({ 
        value, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', existingSettings[0].id)
      .select();

    if (error) throw error;
    return data[0];
  } else {
    // Create new setting
    const setting: Setting = {
      school_id: schoolId,
      key,
      value,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('settings')
      .insert([setting])
      .select();

    if (error) throw error;
    return data[0];
  }
};
