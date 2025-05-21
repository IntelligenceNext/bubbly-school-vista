
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Define interfaces
export type Inquiry = Tables<"inquiries">;

export interface CreateInquiryParams {
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  preferred_contact: string;
  inquiry_type: string;
  priority?: string;
  student_age?: number;
  student_grade?: string;
  internal_notes?: string;
  school_id: string;
  class_id?: string; // Add class_id as optional
}

interface GetInquiriesFilters {
  status?: string;
  source?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface GetInquiriesResponse {
  data: Inquiry[];
  count: number;
}

// Get all inquiries for a school
export const getInquiries = async (
  schoolId: string, 
  filters?: GetInquiriesFilters, 
  page: number = 1, 
  pageSize: number = 20
): Promise<GetInquiriesResponse> => {
  let query = supabase
    .from('inquiries')
    .select('*', { count: 'exact' })
    .eq('school_id', schoolId);
  
  // Apply filters
  if (filters) {
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.source) {
      query = query.eq('source', filters.source);
    }
    
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    
    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }
    
    if (filters.dateTo) {
      // Add 1 day to include the entire end date
      const dateTo = new Date(filters.dateTo);
      dateTo.setDate(dateTo.getDate() + 1);
      query = query.lt('created_at', dateTo.toISOString());
    }
  }
  
  // Apply pagination
  if (page && pageSize) {
    const start = (page - 1) * pageSize;
    query = query.range(start, start + pageSize - 1);
  }
  
  // Sort by created_at date, newest first
  query = query.order('created_at', { ascending: false });
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error('Error fetching inquiries:', error);
    throw error;
  }
  
  return {
    data: data || [],
    count: count || 0
  };
};

// Create a new inquiry
export const createInquiry = async (inquiry: CreateInquiryParams) => {
  const { data, error } = await supabase
    .from('inquiries')
    .insert([{
      ...inquiry,
      status: 'new',
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating inquiry:', error);
    throw error;
  }
  
  return data;
};

// Update an inquiry's status
export const updateInquiryStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('inquiries')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating inquiry status:', error);
    throw error;
  }
  
  return data;
};
