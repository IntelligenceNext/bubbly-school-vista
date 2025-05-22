
import { supabase } from "@/integrations/supabase/client";

// Define types
export interface Hostel {
  id: string;
  name: string;
  type: "Boys" | "Girls" | "Co-ed";
  warden_name?: string;
  contact_number?: string;
  capacity: number;
  status: string;
  school_id: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface Room {
  id: string;
  room_number: string;
  type: "Single" | "Double" | "Triple" | "Dormitory";
  capacity: number;
  hostel_id: string;
  floor?: number;
  status: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentAllocation {
  id: string;
  student_id: string;
  hostel_id: string;
  room_id: string;
  bed_number?: string;
  allocation_date: string;
  exit_date?: string;
  status: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

// Function to fetch all hostels
export const getHostels = async (schoolId?: string): Promise<Hostel[]> => {
  let query = supabase.from('hostels').select('*');
  
  if (schoolId) {
    query = query.eq('school_id', schoolId);
  }
  
  const { data: hostels, error } = await query;
  
  if (error) throw error;
  
  return hostels.map(hostel => ({
    ...hostel,
    type: hostel.type as "Boys" | "Girls" | "Co-ed" // Type assertion for hostel type
  })) as Hostel[];
};

// Function to fetch a single hostel by ID
export const getHostel = async (id: string): Promise<Hostel | null> => {
  const { data: hostel, error } = await supabase
    .from('hostels')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) return null;
  if (!hostel) return null;
  
  return {
    ...hostel,
    type: hostel.type as "Boys" | "Girls" | "Co-ed"
  } as Hostel;
};

// Function to create a new hostel
export const createHostel = async (data: Omit<Hostel, 'id' | 'created_at' | 'updated_at'>): Promise<Hostel> => {
  const { data: hostel, error } = await supabase
    .from('hostels')
    .insert({
      ...data,
    })
    .select()
    .single();
  
  if (error) throw error;
    
  return {
    ...hostel,
    type: hostel.type as "Boys" | "Girls" | "Co-ed"
  } as Hostel;
};

// Function to update an existing hostel
export const updateHostel = async (id: string, data: Partial<Omit<Hostel, 'id' | 'created_at' | 'updated_at'>>): Promise<Hostel | null> => {
  const { data: hostel, error } = await supabase
    .from('hostels')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) return null;
  
  return {
    ...hostel,
    type: hostel.type as "Boys" | "Girls" | "Co-ed"
  } as Hostel;
};

// Function to delete a hostel by ID
export const deleteHostel = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('hostels')
    .delete()
    .eq('id', id);
  
  return !error;
};

// Function to fetch all rooms
export const getRooms = async (hostelId?: string): Promise<Room[]> => {
  let query = supabase.from('rooms').select('*');
  
  if (hostelId) {
    query = query.eq('hostel_id', hostelId);
  }
  
  const { data: rooms, error } = await query;
  
  if (error) throw error;
  
  return rooms.map(room => ({
    ...room,
    type: room.type as "Single" | "Double" | "Triple" | "Dormitory"
  })) as Room[];
};

// Function to fetch a single room by ID
export const getRoom = async (id: string): Promise<Room | null> => {
  const { data: room, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) return null;
  if (!room) return null;
  
  return {
    ...room,
    type: room.type as "Single" | "Double" | "Triple" | "Dormitory"
  } as Room;
};

// Function to create a new room
export const createRoom = async (data: Omit<Room, 'id' | 'created_at' | 'updated_at'>): Promise<Room> => {
  const { data: room, error } = await supabase
    .from('rooms')
    .insert({
      ...data,
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    ...room,
    type: room.type as "Single" | "Double" | "Triple" | "Dormitory"
  } as Room;
};

// Function to update an existing room
export const updateRoom = async (id: string, data: Partial<Omit<Room, 'id' | 'created_at' | 'updated_at'>>): Promise<Room | null> => {
  const { data: room, error } = await supabase
    .from('rooms')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) return null;
  
  return {
    ...room,
    type: room.type as "Single" | "Double" | "Triple" | "Dormitory"
  } as Room;
};

// Function to delete a room by ID
export const deleteRoom = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', id);
  
  return !error;
};

// Function to fetch all student allocations
export const getStudentAllocations = async (filters?: { studentId?: string, hostelId?: string, roomId?: string }): Promise<StudentAllocation[]> => {
  let query = supabase.from('student_allocations').select('*');
  
  if (filters?.studentId) {
    query = query.eq('student_id', filters.studentId);
  }
  
  if (filters?.hostelId) {
    query = query.eq('hostel_id', filters.hostelId);
  }
  
  if (filters?.roomId) {
    query = query.eq('room_id', filters.roomId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as StudentAllocation[];
};

// Function to fetch a single student allocation by ID
export const getStudentAllocation = async (id: string): Promise<StudentAllocation | null> => {
  const { data, error } = await supabase
    .from('student_allocations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) return null;
  return data as StudentAllocation;
};

// Function to create a new student allocation
export const createStudentAllocation = async (data: Omit<StudentAllocation, 'id' | 'created_at' | 'updated_at'>): Promise<StudentAllocation> => {
  const { data: allocation, error } = await supabase
    .from('student_allocations')
    .insert({
      ...data,
    })
    .select()
    .single();
  
  if (error) throw error;
  return allocation as StudentAllocation;
};

// Function to update an existing student allocation
export const updateStudentAllocation = async (id: string, data: Partial<Omit<StudentAllocation, 'id' | 'created_at' | 'updated_at'>>): Promise<StudentAllocation | null> => {
  const { data: allocation, error } = await supabase
    .from('student_allocations')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) return null;
  return allocation as StudentAllocation;
};

// Function to delete a student allocation by ID
export const deleteStudentAllocation = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('student_allocations')
    .delete()
    .eq('id', id);
  
  return !error;
};

// Function to get hostel statistics
export const getHostelStatistics = async (schoolId: string) => {
  // Get all hostels for the school
  const hostels = await getHostels(schoolId);
  
  // Get student allocations
  const { data: allocations, error } = await supabase
    .from('student_allocations')
    .select('*')
    .in('hostel_id', hostels.map(h => h.id))
    .eq('status', 'Active');
  
  if (error) throw error;
  
  // Calculate statistics
  let totalCapacity = 0;
  let totalOccupied = 0;
  
  const hostelStats = hostels.map(hostel => {
    const hostelAllocations = allocations?.filter(a => a.hostel_id === hostel.id) || [];
    const occupied = hostelAllocations.length;
    const available = hostel.capacity - occupied;
    const occupancyRate = hostel.capacity > 0 ? (occupied / hostel.capacity) * 100 : 0;
    
    totalCapacity += hostel.capacity;
    totalOccupied += occupied;
    
    return {
      id: hostel.id,
      name: hostel.name,
      capacity: hostel.capacity,
      occupied,
      available,
      occupancyRate
    };
  });
  
  const totalAvailable = totalCapacity - totalOccupied;
  const overallOccupancyRate = totalCapacity > 0 ? (totalOccupied / totalCapacity) * 100 : 0;
  
  return {
    hostels: hostelStats,
    totalCapacity,
    totalOccupied,
    totalAvailable,
    overallOccupancyRate
  };
};
