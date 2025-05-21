
import { supabase } from "@/integrations/supabase/client";

export interface School {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  logo_url?: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string | null;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  school_id: string;
  created_at: string;
  updated_at: string | null;
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
  school_id: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
}

export interface GetSchoolsParams {
  page?: number;
  pageSize?: number;
  name?: string;
  code?: string;
  status?: "active" | "inactive";
}

export interface GetClassesParams {
  page?: number;
  pageSize?: number;
  name?: string;
  school_id?: string;
  is_active?: boolean;
}

export interface GetSessionsParams {
  page?: number;
  pageSize?: number;
  name?: string;
  school_id?: string;
  is_current?: boolean;
  is_active?: boolean;
}

export interface GetSettingsParams {
  school_id: string;
}

// SCHOOLS

export const getSchools = async (params: GetSchoolsParams = {}): Promise<PaginatedResponse<School>> => {
  try {
    const {
      page = 1,
      pageSize = 10,
      name,
      code,
      status,
    } = params;

    let query = supabase
      .from('schools')
      .select('*', { count: 'exact' });

    if (name) {
      query = query.ilike('name', `%${name}%`);
    }

    if (code) {
      query = query.ilike('code', `%${code}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await query.range(from, to);

    if (error) {
      console.error('Error fetching schools:', error);
      throw new Error(error.message);
    }

    // Cast the status to the expected type
    const typedData = data?.map(school => ({
      ...school,
      status: school.status as "active" | "inactive"
    })) || [];

    return {
      data: typedData,
      count: count || 0,
    };
  } catch (error: any) {
    console.error('Error in getSchools:', error);
    throw new Error(error.message);
  }
};

export const getSchoolById = async (id: string): Promise<School> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching school:', error);
      throw new Error(error.message);
    }

    // Cast the status to the expected type
    return {
      ...data,
      status: data.status as "active" | "inactive"
    };
  } catch (error: any) {
    console.error('Error in getSchoolById:', error);
    throw new Error(error.message);
  }
};

export const createSchool = async (school: Partial<School>): Promise<School> => {
  try {
    // Make sure required fields are provided
    if (!school.name || !school.code) {
      throw new Error('School name and code are required');
    }
    
    // Ensure we're working with a valid school object with required fields
    const validSchool = {
      name: school.name,
      code: school.code,
      status: school.status || 'active' as "active" | "inactive",
      // Add other optional fields
      email: school.email,
      phone: school.phone,
      address: school.address,
      logo_url: school.logo_url
    };
    
    const { data, error } = await supabase
      .from('schools')
      .insert([validSchool])
      .select()
      .single();

    if (error) {
      console.error('Error creating school:', error);
      throw new Error(error.message);
    }

    // Cast the status to the expected type
    return {
      ...data,
      status: data.status as "active" | "inactive"
    };
  } catch (error: any) {
    console.error('Error in createSchool:', error);
    throw new Error(error.message);
  }
};

export const updateSchool = async (id: string, school: Partial<School>): Promise<School> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .update(school)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating school:', error);
      throw new Error(error.message);
    }

    // Cast the status to the expected type
    return {
      ...data,
      status: data.status as "active" | "inactive"
    };
  } catch (error: any) {
    console.error('Error in updateSchool:', error);
    throw new Error(error.message);
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
      throw new Error(error.message);
    }

    return true;
  } catch (error: any) {
    console.error('Error in deleteSchool:', error);
    throw new Error(error.message);
  }
};

// Add bulk update status function
export const bulkUpdateSchoolStatus = async (schoolIds: string[], status: "active" | "inactive"): Promise<boolean> => {
  try {
    for (const id of schoolIds) {
      const { error } = await supabase
        .from('schools')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error(`Error updating school ${id} status:`, error);
        throw new Error(error.message);
      }
    }
    
    return true;
  } catch (error: any) {
    console.error('Error in bulkUpdateSchoolStatus:', error);
    throw new Error(error.message);
  }
};

// CLASSES

export const getClasses = async (params: GetClassesParams = {}): Promise<PaginatedResponse<Class>> => {
  try {
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

    const { data, count, error } = await query.range(from, to);

    if (error) {
      console.error('Error fetching classes:', error);
      throw new Error(error.message);
    }

    // Cast the schools.status to the expected type
    const typedData = data?.map(classItem => ({
      ...classItem,
      schools: classItem.schools ? {
        ...classItem.schools,
        status: classItem.schools.status as "active" | "inactive"
      } : undefined
    })) || [];

    return {
      data: typedData,
      count: count || 0,
    };
  } catch (error: any) {
    console.error('Error in getClasses:', error);
    throw new Error(error.message);
  }
};

export const getClassById = async (id: string): Promise<Class> => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*, schools(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching class:', error);
      throw new Error(error.message);
    }

    // Cast the schools.status to the expected type
    return {
      ...data,
      schools: data.schools ? {
        ...data.schools,
        status: data.schools.status as "active" | "inactive"
      } : undefined
    };
  } catch (error: any) {
    console.error('Error in getClassById:', error);
    throw new Error(error.message);
  }
};

export const createClass = async (classData: Partial<Class>): Promise<Class> => {
  try {
    // Make sure required fields are provided
    if (!classData.name || !classData.code || !classData.school_id) {
      throw new Error('Class name, code, and school_id are required');
    }
    
    // Ensure we're working with a valid class object with required fields
    const validClass = {
      name: classData.name,
      code: classData.code,
      school_id: classData.school_id,
      description: classData.description,
      is_active: classData.is_active !== undefined ? classData.is_active : true
    };
    
    const { data, error } = await supabase
      .from('classes')
      .insert([validClass])
      .select()
      .single();

    if (error) {
      console.error('Error creating class:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('Error in createClass:', error);
    throw new Error(error.message);
  }
};

export const updateClass = async (id: string, classData: Partial<Class>): Promise<Class> => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .update(classData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating class:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('Error in updateClass:', error);
    throw new Error(error.message);
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
      throw new Error(error.message);
    }

    return true;
  } catch (error: any) {
    console.error('Error in deleteClass:', error);
    throw new Error(error.message);
  }
};

// SESSIONS

export const getSessions = async (params: GetSessionsParams = {}): Promise<PaginatedResponse<Session>> => {
  try {
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

    const { data, count, error } = await query.range(from, to);

    if (error) {
      console.error('Error fetching sessions:', error);
      throw new Error(error.message);
    }

    // Cast the schools.status to the expected type
    const typedData = data?.map(session => ({
      ...session,
      schools: session.schools ? {
        ...session.schools,
        status: session.schools.status as "active" | "inactive"
      } : undefined
    })) || [];

    return {
      data: typedData,
      count: count || 0,
    };
  } catch (error: any) {
    console.error('Error in getSessions:', error);
    throw new Error(error.message);
  }
};

// Adding missing session functions
export const getSessionById = async (id: string): Promise<Session> => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, schools(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching session:', error);
      throw new Error(error.message);
    }

    // Cast the schools.status to the expected type
    return {
      ...data,
      schools: data.schools ? {
        ...data.schools,
        status: data.schools.status as "active" | "inactive"
      } : undefined
    };
  } catch (error: any) {
    console.error('Error in getSessionById:', error);
    throw new Error(error.message);
  }
};

export const createSession = async (session: Partial<Session>): Promise<Session> => {
  try {
    // Make sure required fields are provided
    if (!session.name || !session.school_id || !session.start_date || !session.end_date) {
      throw new Error('Session name, school_id, start_date, and end_date are required');
    }
    
    // Ensure we're working with a valid session object with required fields
    const validSession = {
      name: session.name,
      school_id: session.school_id,
      start_date: session.start_date,
      end_date: session.end_date,
      is_current: session.is_current !== undefined ? session.is_current : false,
      is_active: session.is_active !== undefined ? session.is_active : true
    };
    
    const { data, error } = await supabase
      .from('sessions')
      .insert([validSession])
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('Error in createSession:', error);
    throw new Error(error.message);
  }
};

export const updateSession = async (id: string, session: Partial<Session>): Promise<Session> => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .update(session)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating session:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('Error in updateSession:', error);
    throw new Error(error.message);
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
      throw new Error(error.message);
    }

    return true;
  } catch (error: any) {
    console.error('Error in deleteSession:', error);
    throw new Error(error.message);
  }
};

// SETTINGS

export const getSettings = async (params: GetSettingsParams): Promise<Setting[]> => {
  try {
    const { school_id } = params;
    
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('school_id', school_id);

    if (error) {
      console.error('Error fetching settings:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error: any) {
    console.error('Error in getSettings:', error);
    throw new Error(error.message);
  }
};

export const getSettingById = async (id: string): Promise<Setting> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching setting:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('Error in getSettingById:', error);
    throw new Error(error.message);
  }
};

export const getSettingByKey = async (schoolId: string, key: string): Promise<Setting | null> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('school_id', schoolId)
      .eq('key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching setting by key:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('Error in getSettingByKey:', error);
    throw new Error(error.message);
  }
};

export const createOrUpdateSetting = async (
  schoolId: string,
  key: string,
  value: any
): Promise<Setting> => {
  try {
    // Check if setting exists
    const existingSetting = await getSettingByKey(schoolId, key);
    
    if (existingSetting) {
      // Update existing setting
      const { data, error } = await supabase
        .from('settings')
        .update({ value })
        .eq('id', existingSetting.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating setting:', error);
        throw new Error(error.message);
      }

      return data;
    } else {
      // Create new setting
      const { data, error } = await supabase
        .from('settings')
        .insert([{ 
          school_id: schoolId, 
          key, 
          value 
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating setting:', error);
        throw new Error(error.message);
      }

      return data;
    }
  } catch (error: any) {
    console.error('Error in createOrUpdateSetting:', error);
    throw new Error(error.message);
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
      throw new Error(error.message);
    }

    return true;
  } catch (error: any) {
    console.error('Error in deleteSetting:', error);
    throw new Error(error.message);
  }
};
