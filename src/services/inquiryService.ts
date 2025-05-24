
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Inquiry {
  id: string;
  school_id: string;
  name: string;
  email: string;
  phone: string | null;
  inquiry_type: string;
  message: string | null;
  priority: string;
  status: string;
  source: string | null;
  assigned_to: string | null;
  student_grade: string | null;
  parent_name: string | null;
  student_age: number | null;
  preferred_contact_method: string | null;
  follow_up_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InquiryFilters {
  status?: string;
  source?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface InquiryResponse {
  data: Inquiry[];
  count: number;
}

export const getInquiries = async (
  schoolId: string,
  filters: InquiryFilters = {},
  page = 1,
  pageSize = 10
): Promise<InquiryResponse> => {
  try {
    let query = supabase
      .from('inquiries')
      .select('*', { count: 'exact' })
      .eq('school_id', schoolId);

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
      const endDate = new Date(filters.dateTo);
      endDate.setDate(endDate.getDate() + 1);
      query = query.lt('created_at', endDate.toISOString());
    }

    // Apply pagination
    const start = (page - 1) * pageSize;
    query = query.range(start, start + pageSize - 1);
    
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
  } catch (error) {
    console.error('Error in getInquiries:', error);
    toast({
      title: "Failed to fetch inquiries",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { data: [], count: 0 };
  }
};

export const updateInquiryStatus = async (inquiryId: string, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('inquiries')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', inquiryId);
    
    if (error) {
      console.error('Error updating inquiry status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateInquiryStatus:', error);
    return false;
  }
};

export const createInquiry = async (inquiry: Omit<Inquiry, 'id' | 'created_at' | 'updated_at'>): Promise<Inquiry | null> => {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([inquiry])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating inquiry:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createInquiry:', error);
    return null;
  }
};

export const getInquiryById = async (inquiryId: string): Promise<Inquiry | null> => {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', inquiryId)
      .single();
    
    if (error) {
      console.error('Error fetching inquiry:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getInquiryById:', error);
    return null;
  }
};
