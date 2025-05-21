
import { supabase } from '@/integrations/supabase/client';

// Interfaces for tables
export interface School {
  id: string;
  name: string;
  code: string;
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
  created_at: string;
  updated_at: string;
  schools?: { name: string };
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

// School management APIs
export const getSchools = async (params: GetSchoolsParams = {}): Promise<PaginatedResponse<School>> => {
  const { name, status, created_at_start, created_at_end, page, pageSize } = params;

  let query = supabase
    .from('schools')
    .select('*', { count: 'exact' });
  
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
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
  
  return { 
    data: data || [],
    count: count || 0
  };
};

export const getClasses = async (params: GetClassesParams = {}): Promise<PaginatedResponse<Class>> => {
  const { school_id, name, is_active, page, pageSize } = params;
  
  let query = supabase
    .from('classes')
    .select('*, schools(name)', { count: 'exact' });
  
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
    data: data || [],
    count: count || 0
  };
};

export const getSessions = async (params: GetSessionsParams = {}): Promise<PaginatedResponse<Session>> => {
  const { school_id, is_current, is_active, page, pageSize } = params;
  
  let query = supabase
    .from('sessions')
    .select('*, schools(name)', { count: 'exact' });
  
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
    data: data || [],
    count: count || 0
  };
};

export const deleteSchool = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('schools')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting school:', error);
    return false;
  }
  
  return true;
};

export const deleteClass = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting class:', error);
    return false;
  }
  
  return true;
};

export const deleteSession = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting session:', error);
    return false;
  }
  
  return true;
};

export const bulkUpdateSchoolStatus = async (ids: string[], status: 'active' | 'inactive'): Promise<boolean> => {
  const { error } = await supabase
    .from('schools')
    .update({ status, updated_at: new Date().toISOString() })
    .in('id', ids);
  
  if (error) {
    console.error('Error updating schools status:', error);
    return false;
  }
  
  return true;
};

// Add other functions here as needed

