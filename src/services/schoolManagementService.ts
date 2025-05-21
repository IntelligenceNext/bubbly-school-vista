
import { supabase } from '@/integrations/supabase/client';

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
  updated_at: string | null;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  school_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  description: string | null;
  schools?: School;
}

export interface Session {
  id: string;
  name: string;
  school_id: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  schools?: School;
}

export interface Setting {
  id: string;
  key: string;
  value: any;
  school_id: string;
  created_at: string;
  updated_at: string | null;
}

interface PaginatedResponse<T> {
  data: T[];
  count: number;
}

interface GetSchoolsParams {
  page?: number;
  pageSize?: number;
  name?: string;
  status?: 'active' | 'inactive';
  created_at_start?: string;
  created_at_end?: string;
}

interface GetClassesParams {
  page?: number;
  pageSize?: number;
  name?: string;
  school_id?: string;
  is_active?: boolean;
}

interface GetSessionsParams {
  page?: number;
  pageSize?: number;
  name?: string;
  school_id?: string;
  is_current?: boolean;
  is_active?: boolean;
}

interface GetSettingsParams {
  page?: number;
  pageSize?: number;
  key?: string;
  school_id?: string;
}

export const getSchools = async (params: GetSchoolsParams = {}): Promise<PaginatedResponse<School>> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const {
      page = 1,
      pageSize = 10,
      name,
      status,
      created_at_start,
      created_at_end,
    } = params;

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
      query = query.lte('created_at', created_at_end);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data as School[],
      count: count || 0,
    };
  } catch (error) {
    console.error('Error fetching schools:', error);
    return { data: [], count: 0 };
  }
};

export const getClasses = async (params: GetClassesParams = {}): Promise<PaginatedResponse<Class>> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const {
      page = 1,
      pageSize = 10,
      name,
      school_id,
      is_active,
    } = params;

    let query = supabase
      .from('classes')
      .select('*, schools(*)', { count: 'exact' });

    if (name) {
      query = query.ilike('name', `%${name}%`);
    }

    if (school_id) {
      query = query.eq('school_id', school_id);
    }

    if (is_active !== undefined) {
      query = query.eq('is_active', is_active);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data as Class[],
      count: count || 0,
    };
  } catch (error) {
    console.error('Error fetching classes:', error);
    return { data: [], count: 0 };
  }
};

export const getSessions = async (params: GetSessionsParams = {}): Promise<PaginatedResponse<Session>> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const {
      page = 1,
      pageSize = 10,
      name,
      school_id,
      is_current,
      is_active,
    } = params;

    let query = supabase
      .from('sessions')
      .select('*, schools(*)', { count: 'exact' });

    if (name) {
      query = query.ilike('name', `%${name}%`);
    }

    if (school_id) {
      query = query.eq('school_id', school_id);
    }

    if (is_current !== undefined) {
      query = query.eq('is_current', is_current);
    }
    
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data as Session[],
      count: count || 0,
    };
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return { data: [], count: 0 };
  }
};

export const getSettings = async (params: GetSettingsParams = {}): Promise<PaginatedResponse<Setting>> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const {
      page = 1,
      pageSize = 10,
      key,
      school_id,
    } = params;

    let query = supabase
      .from('settings')
      .select('*', { count: 'exact' });

    if (key) {
      query = query.eq('key', key);
    }

    if (school_id) {
      query = query.eq('school_id', school_id);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data as Setting[],
      count: count || 0,
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return { data: [], count: 0 };
  }
};

export const deleteSchool = async (schoolId: string): Promise<boolean> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', schoolId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting school:', error);
    return false;
  }
};

export const deleteClass = async (classId: string): Promise<boolean> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting class:', error);
    return false;
  }
};

export const deleteSession = async (sessionId: string): Promise<boolean> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', sessionId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
};

export const deleteSetting = async (settingId: string): Promise<boolean> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('id', settingId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting setting:', error);
    return false;
  }
};

export const bulkUpdateSchoolStatus = async (schoolIds: string[], status: 'active' | 'inactive'): Promise<boolean> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { error } = await supabase
      .from('schools')
      .update({ status, updated_at: new Date().toISOString() })
      .in('id', schoolIds);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating school status:', error);
    return false;
  }
};

export const createOrUpdateSetting = async (settingData: Partial<Setting>): Promise<Setting | null> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    if (settingData.id) {
      // Update existing setting
      const { data, error } = await supabase
        .from('settings')
        .update({
          key: settingData.key,
          value: settingData.value,
          updated_at: new Date().toISOString()
        })
        .eq('id', settingData.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Setting;
    } else {
      // Create new setting
      const { data, error } = await supabase
        .from('settings')
        .insert({
          key: settingData.key,
          value: settingData.value,
          school_id: settingData.school_id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Setting;
    }
  } catch (error) {
    console.error('Error creating/updating setting:', error);
    return null;
  }
};
