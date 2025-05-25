import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Staff {
  id: string;
  user_id?: string;
  name: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
  phone?: string;
  email: string;
  joining_date?: string;
  role?: string;
  salary?: number;
  designation?: string;
  qualification?: string;
  note_description?: string;
  class_id?: string;
  section?: string;
  is_bus_incharge: boolean;
  username?: string;
  login_email?: string;
  password_hash?: string;
  login_type: 'disable' | 'existing' | 'new';
  zoom_client_id?: string;
  zoom_client_secret?: string;
  zoom_redirect_url?: string;
  zoom_sdk_key?: string;
  zoom_sdk_secret?: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export interface CreateStaffRequest {
  name: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
  phone?: string;
  email: string;
  joining_date?: string;
  role?: string;
  salary?: number;
  designation?: string;
  qualification?: string;
  note_description?: string;
  class_id?: string;
  section?: string;
  is_bus_incharge?: boolean;
  username?: string;
  login_email?: string;
  password?: string;
  login_type?: 'disable' | 'existing' | 'new';
  zoom_client_id?: string;
  zoom_client_secret?: string;
  zoom_redirect_url?: string;
  zoom_sdk_key?: string;
  zoom_sdk_secret?: string;
  status?: 'Active' | 'Inactive';
}

export const getStaff = async (): Promise<Staff[]> => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }

    // Type assertion to ensure proper typing from Supabase
    return (data || []).map(item => ({
      ...item,
      login_type: item.login_type as 'disable' | 'existing' | 'new',
      status: item.status as 'Active' | 'Inactive'
    }));
  } catch (error) {
    console.error('Error in getStaff:', error);
    toast({
      title: "Failed to fetch staff",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return [];
  }
};

export const createStaff = async (staffData: CreateStaffRequest): Promise<Staff | null> => {
  try {
    // For now, we'll store the staff information without creating auth users
    // Auth user creation can be handled separately by administrators
    console.log('Creating staff with data:', staffData);

    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .insert([{
        user_id: null, // Will be set later when auth user is created
        name: staffData.name,
        gender: staffData.gender,
        date_of_birth: staffData.date_of_birth,
        address: staffData.address,
        phone: staffData.phone,
        email: staffData.email,
        joining_date: staffData.joining_date,
        role: staffData.role,
        salary: staffData.salary,
        designation: staffData.designation,
        qualification: staffData.qualification,
        note_description: staffData.note_description,
        class_id: staffData.class_id,
        section: staffData.section,
        is_bus_incharge: staffData.is_bus_incharge || false,
        username: staffData.username,
        login_email: staffData.login_email,
        password_hash: staffData.password ? await hashPassword(staffData.password) : null,
        login_type: staffData.login_type || 'disable',
        zoom_client_id: staffData.zoom_client_id,
        zoom_client_secret: staffData.zoom_client_secret,
        zoom_redirect_url: staffData.zoom_redirect_url,
        zoom_sdk_key: staffData.zoom_sdk_key,
        zoom_sdk_secret: staffData.zoom_sdk_secret,
        status: staffData.status || 'Active',
      }])
      .select()
      .single();

    if (staffError) {
      console.error('Error creating staff:', staffError);
      toast({
        title: "Failed to create staff",
        description: staffError.message,
        variant: "destructive",
      });
      return null;
    }

    // Type assertion for return value
    const typedStaff = {
      ...staff,
      login_type: staff.login_type as 'disable' | 'existing' | 'new',
      status: staff.status as 'Active' | 'Inactive'
    };

    toast({
      title: "Staff created successfully",
      description: `${staffData.name} has been added to the system`,
    });

    return typedStaff;
  } catch (error) {
    console.error('Error in createStaff:', error);
    toast({
      title: "Failed to create staff",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};

export const updateStaff = async (staffId: string, staffData: Partial<CreateStaffRequest>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('staff')
      .update(staffData)
      .eq('id', staffId);

    if (error) {
      console.error('Error updating staff:', error);
      toast({
        title: "Failed to update staff",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Staff updated successfully",
      description: "The staff information has been updated",
    });

    return true;
  } catch (error) {
    console.error('Error in updateStaff:', error);
    toast({
      title: "Failed to update staff",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

export const deleteStaff = async (staffId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', staffId);

    if (error) {
      console.error('Error deleting staff:', error);
      toast({
        title: "Failed to delete staff",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Staff deleted successfully",
      description: "The staff member has been removed from the system",
    });

    return true;
  } catch (error) {
    console.error('Error in deleteStaff:', error);
    toast({
      title: "Failed to delete staff",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

// Simple password hashing function (in production, use a proper hashing library)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
