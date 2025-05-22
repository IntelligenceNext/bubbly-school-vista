
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Define types for our transportation entities
export interface Route {
  id: string;
  name: string;
  description: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  name: string;
  registration_number: string;
  vehicle_type: string;
  make: string;
  model: string;
  year: number;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  date: string;
  route_id: string;
  route_name: string;
  vehicle_id: string;
  vehicle_details: string;
  driver_id: string;
  driver_name: string;
  students_present: number;
  incidents: string | null;
  created_at: string;
  updated_at: string;
}

interface TransportationQueryParams {
  page?: number;
  pageSize?: number;
  name?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  created_at_start?: string;
  created_at_end?: string;
  date?: string;
  route_id?: string;
  vehicle_id?: string;
  driver_id?: string;
}

// Routes-related functions
export const getRoutes = async (params: TransportationQueryParams = {}) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      name,
      status,
      created_at_start,
      created_at_end
    } = params;
    
    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Start building the query
    let query = supabase
      .from('transportation_routes')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });
    
    // Apply filters if provided
    if (name) {
      query = query.ilike('name', `%${name}%`);
    }
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    if (created_at_start) {
      query = query.gte('created_at', created_at_start);
    }
    
    if (created_at_end) {
      query = query.lte('created_at', created_at_end);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching routes:', error);
      toast({
        title: "Error fetching routes",
        description: error.message,
        variant: "destructive",
      });
      return { data: [], count: 0 };
    }
    
    return { data: data as Route[], count: count || 0 };
  } catch (error: any) {
    console.error('Error in getRoutes:', error);
    toast({
      title: "Failed to fetch routes",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { data: [], count: 0 };
  }
};

export const deleteRoute = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('transportation_routes')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({
        title: "Error deleting route",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Route deleted",
      description: "The route has been deleted successfully.",
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Failed to delete route",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

export const bulkUpdateRouteStatus = async (ids: string[], status: 'active' | 'inactive'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('transportation_routes')
      .update({ status, updated_at: new Date().toISOString() })
      .in('id', ids);
    
    if (error) {
      toast({
        title: "Error updating routes",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Routes updated",
      description: `${ids.length} routes have been updated successfully.`,
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Failed to update routes",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

// Vehicles-related functions
export const getVehicles = async (params: TransportationQueryParams = {}) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      name,
      status,
      created_at_start,
      created_at_end
    } = params;
    
    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Start building query
    let query = supabase
      .from('transportation_vehicles')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });
    
    // Apply filters
    if (name) {
      query = query.ilike('name', `%${name}%`);
    }
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    if (created_at_start) {
      query = query.gte('created_at', created_at_start);
    }
    
    if (created_at_end) {
      query = query.lte('created_at', created_at_end);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: "Error fetching vehicles",
        description: error.message,
        variant: "destructive",
      });
      return { data: [], count: 0 };
    }
    
    return { data: data as Vehicle[], count: count || 0 };
  } catch (error: any) {
    console.error('Error in getVehicles:', error);
    toast({
      title: "Failed to fetch vehicles",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { data: [], count: 0 };
  }
};

export const deleteVehicle = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('transportation_vehicles')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({
        title: "Error deleting vehicle",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Vehicle deleted",
      description: "The vehicle has been deleted successfully.",
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Failed to delete vehicle",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

// Reports-related functions
export const getReports = async (params: TransportationQueryParams = {}) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      date,
      route_id,
      vehicle_id,
      driver_id,
    } = params;
    
    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Start building query
    let query = supabase
      .from('transportation_reports')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('date', { ascending: false });
    
    // Apply filters
    if (date) {
      query = query.eq('date', date);
    }
    
    if (route_id) {
      query = query.eq('route_id', route_id);
    }
    
    if (vehicle_id) {
      query = query.eq('vehicle_id', vehicle_id);
    }
    
    if (driver_id) {
      query = query.eq('driver_id', driver_id);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error fetching reports",
        description: error.message,
        variant: "destructive",
      });
      return { data: [], count: 0 };
    }
    
    return { data: data as Report[], count: count || 0 };
  } catch (error: any) {
    console.error('Error in getReports:', error);
    toast({
      title: "Failed to fetch reports",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { data: [], count: 0 };
  }
};
