
import { supabase } from '@/integrations/supabase/client';

export interface Hostel {
  id: string;
  created_at: string;
  school_id: string;
  name: string;
  description: string;
  capacity: number;
  gender: 'male' | 'female' | 'mixed';
  status: 'active' | 'inactive';
}

export const getHostels = async () => {
  try {
    // Use type assertion to avoid TypeScript errors
    const { data, error } = await (supabase
      .from('hostels') as any)
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching hostels:', error);
    throw error;
  }
};

// Mock data for getHostelStatistics
export const getHostelStatistics = async (schoolId: string) => {
  try {
    // Fetch real hostels data
    const hostels = await getHostels();
    
    // Filter by school_id if provided
    const filteredHostels = schoolId 
      ? hostels.filter(hostel => hostel.school_id === schoolId)
      : hostels;
    
    // Generate mock statistics based on real hostels
    const hostelStats = filteredHostels.map(hostel => {
      // Generate random but reasonable occupancy numbers
      const occupied = Math.floor(Math.random() * hostel.capacity * 0.9);
      const available = hostel.capacity - occupied;
      const occupancyRate = Math.round((occupied / hostel.capacity) * 100);
      
      return {
        id: hostel.id,
        name: hostel.name,
        capacity: hostel.capacity,
        occupied,
        available,
        occupancyRate
      };
    });
    
    // Calculate overall statistics
    const totalCapacity = hostelStats.reduce((sum, hostel) => sum + hostel.capacity, 0);
    const totalOccupied = hostelStats.reduce((sum, hostel) => sum + hostel.occupied, 0);
    const totalAvailable = totalCapacity - totalOccupied;
    const overallOccupancyRate = totalCapacity > 0 
      ? Math.round((totalOccupied / totalCapacity) * 100) 
      : 0;
    
    return {
      hostels: hostelStats,
      totalCapacity,
      totalOccupied,
      totalAvailable,
      overallOccupancyRate
    };
  } catch (error) {
    console.error('Error generating hostel statistics:', error);
    // Return empty statistics on error
    return {
      hostels: [],
      totalCapacity: 0,
      totalOccupied: 0,
      totalAvailable: 0,
      overallOccupancyRate: 0
    };
  }
};
