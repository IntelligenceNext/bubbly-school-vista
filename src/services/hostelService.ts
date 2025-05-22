
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Hostel Types
export type HostelType = 'Boys' | 'Girls' | 'Co-ed';
export type RoomType = 'Single' | 'Double' | 'Triple' | 'Dormitory';
export type HostelStatus = 'active' | 'inactive' | 'maintenance';
export type RoomStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface Hostel {
  id: string;
  name: string;
  type: HostelType;
  warden_name: string | null;
  contact_number: string | null;
  capacity: number;
  status: string;
  school_id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface Room {
  id: string;
  room_number: string;
  hostel_id: string;
  type: RoomType;
  capacity: number;
  floor: number | null;
  status: RoomStatus;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

// Response interface
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
}

export interface GetHostelsParams {
  school_id?: string;
  type?: HostelType;
  status?: HostelStatus;
  page?: number;
  pageSize?: number;
}

export interface GetRoomsParams {
  hostel_id: string;
  type?: RoomType;
  status?: RoomStatus;
  floor?: number;
  page?: number;
  pageSize?: number;
}

// Hostel management APIs
export const getHostels = async (params: GetHostelsParams = {}): Promise<PaginatedResponse<Hostel>> => {
  const { school_id, type, status, page, pageSize } = params;
  
  try {
    let query = supabase
      .from('hostels')
      .select('*', { count: 'exact' });
    
    if (school_id) {
      query = query.eq('school_id', school_id);
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (status) {
      query = query.eq('status', status);
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
      console.error('Error fetching hostels:', error);
      throw error;
    }
    
    return { 
      data: data as Hostel[],
      count: count || 0
    };
  } catch (error) {
    console.error('Error in getHostels:', error);
    toast({
      title: "Failed to fetch hostels",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { data: [], count: 0 };
  }
};

export const getRooms = async (params: GetRoomsParams): Promise<PaginatedResponse<Room>> => {
  const { hostel_id, type, status, floor, page, pageSize } = params;
  
  try {
    let query = supabase
      .from('rooms')
      .select('*', { count: 'exact' })
      .eq('hostel_id', hostel_id);
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (floor !== undefined) {
      query = query.eq('floor', floor);
    }
    
    // Apply pagination if provided
    if (page !== undefined && pageSize !== undefined) {
      const start = (page - 1) * pageSize;
      query = query.range(start, start + pageSize - 1);
    }
    
    // Sort by room_number
    query = query.order('room_number', { ascending: true });
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
    
    return { 
      data: data as Room[],
      count: count || 0
    };
  } catch (error) {
    console.error('Error in getRooms:', error);
    toast({
      title: "Failed to fetch rooms",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { data: [], count: 0 };
  }
};

export const getHostelById = async (id: string): Promise<Hostel | null> => {
  try {
    const { data, error } = await supabase
      .from('hostels')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching hostel:', error);
      return null;
    }
    
    return data as Hostel;
  } catch (error) {
    console.error('Error in getHostelById:', error);
    return null;
  }
};

export const getRoomById = async (id: string): Promise<Room | null> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching room:', error);
      return null;
    }
    
    return data as Room;
  } catch (error) {
    console.error('Error in getRoomById:', error);
    return null;
  }
};
