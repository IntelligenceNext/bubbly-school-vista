
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Type definitions
export interface School {
  id: string;
  name: string;
  code: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  logo_url: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  school_id: string;
  name: string;
  description: string | null;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
}

export interface Setting {
  id: string;
  school_id: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
}

export interface UserSchoolRole {
  id: string;
  user_id: string;
  school_id: string;
  role: "super_admin" | "school_admin" | "staff";
  created_at: string;
}

export interface SchoolFilterParams {
  name?: string;
  status?: "active" | "inactive";
  created_at_start?: string;
  created_at_end?: string;
  page?: number;
  pageSize?: number;
}

export interface ClassFilterParams {
  school_id?: string;
  name?: string;
  is_active?: boolean;
  page?: number;
  pageSize?: number;
}

export interface SessionFilterParams {
  school_id?: string;
  is_current?: boolean;
  is_active?: boolean;
  start_date_after?: string;
  end_date_before?: string;
  page?: number;
  pageSize?: number;
}

// Schools CRUD
export const getSchools = async (filters: SchoolFilterParams = {}) => {
  try {
    let query = supabase
      .from("schools")
      .select("*");
    
    if (filters.name) {
      query = query.ilike("name", `%${filters.name}%`);
    }
    
    if (filters.status) {
      query = query.eq("status", filters.status);
    }
    
    if (filters.created_at_start) {
      query = query.gte("created_at", filters.created_at_start);
    }
    
    if (filters.created_at_end) {
      query = query.lte("created_at", filters.created_at_end);
    }
    
    // Add pagination
    const pageSize = filters.pageSize || 10;
    const page = filters.page || 1;
    const start = (page - 1) * pageSize;
    query = query.range(start, start + pageSize - 1);
    
    const { data, error, count } = await query.order("name").select("*", { count: "exact" });
    
    if (error) {
      console.error("Error fetching schools:", error);
      toast({
        title: "Error fetching schools",
        description: error.message,
        variant: "destructive"
      });
      return { data: [], count: 0 };
    }
    
    return { data: data as School[], count: count || 0 };
  } catch (error) {
    console.error("Unexpected error fetching schools:", error);
    toast({
      title: "Error fetching schools",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return { data: [], count: 0 };
  }
};

export const getSchoolById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("schools")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching school:", error);
      toast({
        title: "Error fetching school",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    return data as School;
  } catch (error) {
    console.error("Unexpected error fetching school:", error);
    toast({
      title: "Error fetching school",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const createSchool = async (school: Omit<School, "id" | "created_at" | "updated_at">) => {
  try {
    const { data, error } = await supabase
      .from("schools")
      .insert(school)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating school:", error);
      toast({
        title: "Error creating school",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    toast({
      title: "School created",
      description: `${school.name} has been created successfully.`
    });
    
    return data as School;
  } catch (error) {
    console.error("Unexpected error creating school:", error);
    toast({
      title: "Error creating school",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const updateSchool = async (id: string, updates: Partial<Omit<School, "id" | "created_at" | "updated_at">>) => {
  try {
    const { data, error } = await supabase
      .from("schools")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating school:", error);
      toast({
        title: "Error updating school",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    toast({
      title: "School updated",
      description: "School has been updated successfully."
    });
    
    return data as School;
  } catch (error) {
    console.error("Unexpected error updating school:", error);
    toast({
      title: "Error updating school",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const deleteSchool = async (id: string) => {
  try {
    const { error } = await supabase
      .from("schools")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting school:", error);
      toast({
        title: "Error deleting school",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "School deleted",
      description: "School has been deleted successfully."
    });
    
    return true;
  } catch (error) {
    console.error("Unexpected error deleting school:", error);
    toast({
      title: "Error deleting school",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};

export const bulkUpdateSchoolStatus = async (ids: string[], status: "active" | "inactive") => {
  try {
    const { error } = await supabase
      .from("schools")
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);
    
    if (error) {
      console.error("Error updating schools status:", error);
      toast({
        title: "Error updating schools",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Schools updated",
      description: `${ids.length} schools have been ${status === "active" ? "activated" : "deactivated"}.`
    });
    
    return true;
  } catch (error) {
    console.error("Unexpected error updating schools status:", error);
    toast({
      title: "Error updating schools",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};

// Classes CRUD
export const getClasses = async (filters: ClassFilterParams = {}) => {
  try {
    let query = supabase
      .from("classes")
      .select("*, schools(name)");
    
    if (filters.school_id) {
      query = query.eq("school_id", filters.school_id);
    }
    
    if (filters.name) {
      query = query.ilike("name", `%${filters.name}%`);
    }
    
    if (filters.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active);
    }
    
    // Add pagination
    const pageSize = filters.pageSize || 10;
    const page = filters.page || 1;
    const start = (page - 1) * pageSize;
    query = query.range(start, start + pageSize - 1);
    
    const { data, error, count } = await query.order("name").select("*", { count: "exact" });
    
    if (error) {
      console.error("Error fetching classes:", error);
      toast({
        title: "Error fetching classes",
        description: error.message,
        variant: "destructive"
      });
      return { data: [], count: 0 };
    }
    
    return { data: data as (Class & { schools: { name: string } })[], count: count || 0 };
  } catch (error) {
    console.error("Unexpected error fetching classes:", error);
    toast({
      title: "Error fetching classes",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return { data: [], count: 0 };
  }
};

export const getClassById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("classes")
      .select("*, schools(name)")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching class:", error);
      toast({
        title: "Error fetching class",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    return data as Class & { schools: { name: string } };
  } catch (error) {
    console.error("Unexpected error fetching class:", error);
    toast({
      title: "Error fetching class",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const createClass = async (classData: Omit<Class, "id" | "created_at" | "updated_at">) => {
  try {
    const { data, error } = await supabase
      .from("classes")
      .insert(classData)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating class:", error);
      toast({
        title: "Error creating class",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    toast({
      title: "Class created",
      description: `${classData.name} has been created successfully.`
    });
    
    return data as Class;
  } catch (error) {
    console.error("Unexpected error creating class:", error);
    toast({
      title: "Error creating class",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const updateClass = async (id: string, updates: Partial<Omit<Class, "id" | "created_at" | "updated_at">>) => {
  try {
    const { data, error } = await supabase
      .from("classes")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating class:", error);
      toast({
        title: "Error updating class",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    toast({
      title: "Class updated",
      description: "Class has been updated successfully."
    });
    
    return data as Class;
  } catch (error) {
    console.error("Unexpected error updating class:", error);
    toast({
      title: "Error updating class",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const deleteClass = async (id: string) => {
  try {
    const { error } = await supabase
      .from("classes")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting class:", error);
      toast({
        title: "Error deleting class",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Class deleted",
      description: "Class has been deleted successfully."
    });
    
    return true;
  } catch (error) {
    console.error("Unexpected error deleting class:", error);
    toast({
      title: "Error deleting class",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};

// Sessions CRUD
export const getSessions = async (filters: SessionFilterParams = {}) => {
  try {
    let query = supabase
      .from("sessions")
      .select("*, schools(name)");
    
    if (filters.school_id) {
      query = query.eq("school_id", filters.school_id);
    }
    
    if (filters.is_current !== undefined) {
      query = query.eq("is_current", filters.is_current);
    }
    
    if (filters.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active);
    }
    
    if (filters.start_date_after) {
      query = query.gte("start_date", filters.start_date_after);
    }
    
    if (filters.end_date_before) {
      query = query.lte("end_date", filters.end_date_before);
    }
    
    // Add pagination
    const pageSize = filters.pageSize || 10;
    const page = filters.page || 1;
    const start = (page - 1) * pageSize;
    query = query.range(start, start + pageSize - 1);
    
    const { data, error, count } = await query.order("start_date", { ascending: false }).select("*", { count: "exact" });
    
    if (error) {
      console.error("Error fetching sessions:", error);
      toast({
        title: "Error fetching sessions",
        description: error.message,
        variant: "destructive"
      });
      return { data: [], count: 0 };
    }
    
    return { data: data as (Session & { schools: { name: string } })[], count: count || 0 };
  } catch (error) {
    console.error("Unexpected error fetching sessions:", error);
    toast({
      title: "Error fetching sessions",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return { data: [], count: 0 };
  }
};

export const getSessionById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .select("*, schools(name)")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching session:", error);
      toast({
        title: "Error fetching session",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    return data as Session & { schools: { name: string } };
  } catch (error) {
    console.error("Unexpected error fetching session:", error);
    toast({
      title: "Error fetching session",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const createSession = async (session: Omit<Session, "id" | "created_at" | "updated_at">) => {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .insert(session)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating session:", error);
      toast({
        title: "Error creating session",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    toast({
      title: "Session created",
      description: `${session.name} has been created successfully.`
    });
    
    return data as Session;
  } catch (error) {
    console.error("Unexpected error creating session:", error);
    toast({
      title: "Error creating session",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const updateSession = async (id: string, updates: Partial<Omit<Session, "id" | "created_at" | "updated_at">>) => {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating session:", error);
      toast({
        title: "Error updating session",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    toast({
      title: "Session updated",
      description: "Session has been updated successfully."
    });
    
    return data as Session;
  } catch (error) {
    console.error("Unexpected error updating session:", error);
    toast({
      title: "Error updating session",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const deleteSession = async (id: string) => {
  try {
    const { error } = await supabase
      .from("sessions")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting session:", error);
      toast({
        title: "Error deleting session",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Session deleted",
      description: "Session has been deleted successfully."
    });
    
    return true;
  } catch (error) {
    console.error("Unexpected error deleting session:", error);
    toast({
      title: "Error deleting session",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};

// Settings CRUD
export const getSettings = async (schoolId: string) => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("school_id", schoolId);
    
    if (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error fetching settings",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }
    
    return data as Setting[];
  } catch (error) {
    console.error("Unexpected error fetching settings:", error);
    toast({
      title: "Error fetching settings",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return [];
  }
};

export const getSettingByKey = async (schoolId: string, key: string) => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("school_id", schoolId)
      .eq("key", key)
      .single();
    
    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned, not really an error
        return null;
      }
      
      console.error("Error fetching setting:", error);
      toast({
        title: "Error fetching setting",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    return data as Setting;
  } catch (error) {
    console.error("Unexpected error fetching setting:", error);
    toast({
      title: "Error fetching setting",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const createOrUpdateSetting = async (schoolId: string, key: string, value: any) => {
  try {
    // Check if setting exists
    const existing = await getSettingByKey(schoolId, key);
    
    if (existing) {
      const { data, error } = await supabase
        .from("settings")
        .update({ 
          value, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", existing.id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating setting:", error);
        toast({
          title: "Error updating setting",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
      
      toast({
        title: "Setting updated",
        description: `Setting "${key}" has been updated.`
      });
      
      return data as Setting;
    } else {
      const { data, error } = await supabase
        .from("settings")
        .insert({
          school_id: schoolId,
          key,
          value
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating setting:", error);
        toast({
          title: "Error creating setting",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
      
      toast({
        title: "Setting created",
        description: `Setting "${key}" has been created.`
      });
      
      return data as Setting;
    }
  } catch (error) {
    console.error("Unexpected error creating/updating setting:", error);
    toast({
      title: "Error saving setting",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const deleteSetting = async (id: string) => {
  try {
    const { error } = await supabase
      .from("settings")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting setting:", error);
      toast({
        title: "Error deleting setting",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Setting deleted",
      description: "Setting has been deleted successfully."
    });
    
    return true;
  } catch (error) {
    console.error("Unexpected error deleting setting:", error);
    toast({
      title: "Error deleting setting",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};
