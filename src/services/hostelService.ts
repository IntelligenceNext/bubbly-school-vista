
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface Hostel {
  id: string;
  name: string;
  type: 'Boys' | 'Girls' | 'Co-ed';
  warden_name?: string;
  contact_number?: string;
  capacity: number;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
  school_id: string;
}

export interface Room {
  id: string;
  hostel_id: string;
  room_number: string;
  floor?: number;
  type: 'Single' | 'Double' | 'Triple' | 'Dormitory';
  capacity: number;
  status: 'Available' | 'Occupied' | 'Maintenance';
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
  status: 'Active' | 'Exited';
  remarks?: string;
  created_at: string;
  updated_at: string;
  // For UI display with join data
  student_name?: string;
  hostel_name?: string;
  room_number?: string;
}

export interface HostelAttendance {
  id: string;
  student_id: string;
  date: string;
  status: 'Present' | 'Absent' | 'Sick' | 'Leave';
  recorded_by?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
  // For UI display with join data
  student_name?: string;
}

export interface MealPlan {
  id: string;
  hostel_id: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  meal_type: 'Breakfast' | 'Lunch' | 'Dinner';
  menu: string;
  specific_date?: string;
  created_at: string;
  updated_at: string;
  // For UI display with join data
  hostel_name?: string;
}

// Hostels
export async function getHostels(schoolId: string): Promise<Hostel[]> {
  try {
    const { data, error } = await supabase
      .from('hostels')
      .select('*')
      .eq('school_id', schoolId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast.error('Failed to fetch hostels: ' + error.message);
    return [];
  }
}

export async function getHostel(id: string): Promise<Hostel | null> {
  try {
    const { data, error } = await supabase
      .from('hostels')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error('Failed to fetch hostel: ' + error.message);
    return null;
  }
}

export async function createHostel(hostel: Omit<Hostel, 'id' | 'created_at' | 'updated_at'>): Promise<Hostel | null> {
  try {
    const { data, error } = await supabase
      .from('hostels')
      .insert(hostel)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Hostel created successfully');
    return data;
  } catch (error: any) {
    toast.error('Failed to create hostel: ' + error.message);
    return null;
  }
}

export async function updateHostel(id: string, updates: Partial<Hostel>): Promise<Hostel | null> {
  try {
    const { data, error } = await supabase
      .from('hostels')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Hostel updated successfully');
    return data;
  } catch (error: any) {
    toast.error('Failed to update hostel: ' + error.message);
    return null;
  }
}

export async function deleteHostel(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('hostels')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success('Hostel deleted successfully');
    return true;
  } catch (error: any) {
    toast.error('Failed to delete hostel: ' + error.message);
    return false;
  }
}

// Rooms
export async function getRooms(hostelId: string): Promise<Room[]> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('hostel_id', hostelId)
      .order('room_number');
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast.error('Failed to fetch rooms: ' + error.message);
    return [];
  }
}

export async function createRoom(room: Omit<Room, 'id' | 'created_at' | 'updated_at'>): Promise<Room | null> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .insert(room)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Room created successfully');
    return data;
  } catch (error: any) {
    toast.error('Failed to create room: ' + error.message);
    return null;
  }
}

export async function updateRoom(id: string, updates: Partial<Room>): Promise<Room | null> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Room updated successfully');
    return data;
  } catch (error: any) {
    toast.error('Failed to update room: ' + error.message);
    return null;
  }
}

export async function deleteRoom(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success('Room deleted successfully');
    return true;
  } catch (error: any) {
    toast.error('Failed to delete room: ' + error.message);
    return false;
  }
}

// Student Allocations
export async function getAllocations(hostelId?: string): Promise<StudentAllocation[]> {
  try {
    let query = supabase
      .from('student_allocations')
      .select('*');
    
    if (hostelId) {
      query = query.eq('hostel_id', hostelId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast.error('Failed to fetch allocations: ' + error.message);
    return [];
  }
}

export async function createAllocation(allocation: Omit<StudentAllocation, 'id' | 'created_at' | 'updated_at'>): Promise<StudentAllocation | null> {
  try {
    const { data, error } = await supabase
      .from('student_allocations')
      .insert(allocation)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Student allocated successfully');
    return data;
  } catch (error: any) {
    toast.error('Failed to allocate student: ' + error.message);
    return null;
  }
}

export async function updateAllocation(id: string, updates: Partial<StudentAllocation>): Promise<StudentAllocation | null> {
  try {
    const { data, error } = await supabase
      .from('student_allocations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Allocation updated successfully');
    return data;
  } catch (error: any) {
    toast.error('Failed to update allocation: ' + error.message);
    return null;
  }
}

// Hostel Attendance
export async function recordAttendance(attendance: Omit<HostelAttendance, 'id' | 'created_at' | 'updated_at'>): Promise<HostelAttendance | null> {
  try {
    const { data, error } = await supabase
      .from('hostel_attendance')
      .insert(attendance)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Attendance recorded successfully');
    return data;
  } catch (error: any) {
    toast.error('Failed to record attendance: ' + error.message);
    return null;
  }
}

export async function getAttendanceByDate(date: string, studentId?: string): Promise<HostelAttendance[]> {
  try {
    let query = supabase
      .from('hostel_attendance')
      .select('*')
      .eq('date', date);
    
    if (studentId) {
      query = query.eq('student_id', studentId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast.error('Failed to fetch attendance: ' + error.message);
    return [];
  }
}

// Meal Plans
export async function getMealPlans(hostelId: string): Promise<MealPlan[]> {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('hostel_id', hostelId)
      .order('day_of_week');
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast.error('Failed to fetch meal plans: ' + error.message);
    return [];
  }
}

export async function createMealPlan(mealPlan: Omit<MealPlan, 'id' | 'created_at' | 'updated_at'>): Promise<MealPlan | null> {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .insert(mealPlan)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Meal plan created successfully');
    return data;
  } catch (error: any) {
    toast.error('Failed to create meal plan: ' + error.message);
    return null;
  }
}

export async function updateMealPlan(id: string, updates: Partial<MealPlan>): Promise<MealPlan | null> {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Meal plan updated successfully');
    return data;
  } catch (error: any) {
    toast.error('Failed to update meal plan: ' + error.message);
    return null;
  }
}

export async function deleteMealPlan(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meal_plans')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success('Meal plan deleted successfully');
    return true;
  } catch (error: any) {
    toast.error('Failed to delete meal plan: ' + error.message);
    return false;
  }
}

// Dashboard statistics
export async function getHostelStatistics(schoolId: string) {
  try {
    // Get hostels for the school
    const { data: hostels, error: hostelsError } = await supabase
      .from('hostels')
      .select('id, name, capacity')
      .eq('school_id', schoolId);

    if (hostelsError) throw hostelsError;

    // Get allocation counts per hostel
    const hostelStats = await Promise.all(
      (hostels || []).map(async (hostel) => {
        const { count, error: countError } = await supabase
          .from('student_allocations')
          .select('*', { count: 'exact', head: true })
          .eq('hostel_id', hostel.id)
          .eq('status', 'Active');

        if (countError) throw countError;

        const occupancyRate = hostel.capacity ? Math.round((count || 0) / hostel.capacity * 100) : 0;
        
        return {
          id: hostel.id,
          name: hostel.name,
          capacity: hostel.capacity,
          occupied: count || 0,
          available: hostel.capacity - (count || 0),
          occupancyRate: occupancyRate
        };
      })
    );

    return {
      hostels: hostelStats,
      totalCapacity: hostelStats.reduce((sum, h) => sum + h.capacity, 0),
      totalOccupied: hostelStats.reduce((sum, h) => sum + h.occupied, 0),
      totalAvailable: hostelStats.reduce((sum, h) => sum + h.available, 0),
      overallOccupancyRate: hostelStats.reduce((sum, h) => sum + h.occupancyRate, 0) / (hostelStats.length || 1)
    };
  } catch (error: any) {
    toast.error('Failed to fetch hostel statistics: ' + error.message);
    return {
      hostels: [],
      totalCapacity: 0,
      totalOccupied: 0,
      totalAvailable: 0,
      overallOccupancyRate: 0
    };
  }
}
