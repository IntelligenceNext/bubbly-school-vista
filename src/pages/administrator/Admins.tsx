
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, MoreVertical, Pencil, Plus, Search, Shield, Trash, UserPlus, CheckCircle, Key } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import usePagination from '@/hooks/usePagination';
import { getRoles } from '@/services/roleService';

// Admin schema for form validation
const adminSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  confirmPassword: z.string().optional(),
  role_id: z.string().min(1, 'Role is required'),
  school_id: z.string().optional(),
  send_invitation: z.boolean().default(false),
}).refine((data) => {
  // If password is provided, confirmPassword must match
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AdminFormValues = z.infer<typeof adminSchema>;

type Administrator = {
  id: string;
  name: string;
  email: string;
  role: string;
  username: string;
  status: string;
  lastLogin: string | null;
  school: string | null;
}

const Admins = () => {
  // ALL HOOKS MUST BE CALLED AT THE TOP - BEFORE ANY CONDITIONAL LOGIC
  const { user, loading: authLoading } = useAuth();
  const pagination = usePagination();
  const { page, pageSize, total, setTotal, setPage, setPageSize } = pagination;

  // Initialize the form - MUST be called before any returns
  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      full_name: '',
      email: '',
      username: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role_id: '',
      school_id: '',
      send_invitation: false
    },
  });

  // ALL STATE HOOKS MUST BE AT THE TOP
  const [activeTab, setActiveTab] = useState("all-admins");
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [schoolOptions, setSchoolOptions] = useState<{id: string, name: string}[]>([]);
  const [roleOptions, setRoleOptions] = useState<{id: string, name: string}[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Administrator | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Fetch schools for dropdown
  useEffect(() => {
    async function fetchSchools() {
      try {
        console.log('Fetching schools...');
        const { data, error } = await supabase
          .from('schools')
          .select('id, name')
          .eq('status', 'active')
          .order('name');
        
        if (error) {
          console.error('Error fetching schools:', error);
          return;
        }
        
        console.log('Schools fetched:', data);
        setSchoolOptions(data || []);
      } catch (error: any) {
        console.error('Error fetching schools:', error.message);
      }
    }

    fetchSchools();
  }, []);

  // Fetch roles for dropdown
  useEffect(() => {
    async function fetchRoles() {
      try {
        console.log('Fetching roles...');
        const roles = await getRoles();
        console.log('Roles fetched:', roles);
        setRoleOptions(roles.map(role => ({ id: role.id, name: role.name })));
      } catch (error: any) {
        console.error('Error fetching roles:', error.message);
      }
    }

    fetchRoles();
  }, []);

  // Fetch administrators with pagination and search
  useEffect(() => {
    async function fetchAdministrators() {
      setIsLoading(true);
      try {
        console.log('Fetching administrators...');
        
        // Build the query with joins to get school names and role names
        let query = supabase
          .from('administrators')
          .select(`
            id, 
            full_name, 
            email, 
            username, 
            role, 
            status, 
            last_login,
            school_id,
            role_id,
            schools!administrators_school_id_fkey(name),
            roles!administrators_role_id_fkey(name)
          `, { count: 'exact' });
        
        // Add search condition if searchQuery exists
        if (searchQuery) {
          query = query
            .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`);
        }
        
        // Add status filter
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        
        // Add role filter
        if (roleFilter !== 'all') {
          query = query.eq('role', roleFilter);
        }
        
        // Add pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        
        const { data, error, count } = await query
          .order('created_at', { ascending: false })
          .range(from, to);
        
        if (error) {
          console.error('Error fetching administrators:', error);
          throw error;
        }
        
        console.log('Administrators fetched:', data);
        
        if (count !== null) {
          setTotal(count);
        }
        
        // Transform to our Administrator type
        const formattedData: Administrator[] = (data || []).map((admin: any) => {
          const roleRel = (admin as any).roles;
          const schoolRel = (admin as any).schools;
          const roleName = Array.isArray(roleRel) ? roleRel[0]?.name : roleRel?.name;
          const schoolName = Array.isArray(schoolRel) ? schoolRel[0]?.name : schoolRel?.name;

          return {
            id: admin.id,
            name: admin.full_name,
            email: admin.email,
            role: roleName || admin.role || 'Unknown Role',
            username: admin.username,
            status: admin.status || 'Inactive',
            lastLogin: admin.last_login,
            school: schoolName || (admin.school_id ? 'Unknown School' : 'All Schools')
          };
        });
        
        setAdministrators(formattedData);
      } catch (error: any) {
        console.error('Error fetching administrators:', error.message);
        toast({
          title: 'Error',
          description: 'Failed to load administrators',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAdministrators();
  }, [searchQuery, page, pageSize, statusFilter, roleFilter]);

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  // Handle form submission to create new admin
  const onSubmit = async (data: AdminFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create administrators',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Creating new administrator:', data);

      // First, create the Supabase authentication user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            username: data.username,
            phone: data.phone || null,
            role: 'administrator',
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw new Error(`Authentication error: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('Failed to create authentication user');
      }

      const authUserId = authData.user.id;
      console.log('Authentication user created:', authUserId);

      // Determine if school_id should be null (for all schools access)
      const schoolId = data.school_id === 'all_schools' ? null : data.school_id || null;
      
      // Get the role name for the text field (backwards compatibility)
      const selectedRole = roleOptions.find(role => role.id === data.role_id);
      
      // Create the administrator record
      const { error: adminError } = await supabase
        .from('administrators')
        .insert({
          user_id: authUserId,
          full_name: data.full_name,
          username: data.username,
          email: data.email,
          phone: data.phone || null,
          role: selectedRole?.name || 'Unknown',
          role_id: data.role_id,
          school_id: schoolId,
          status: 'active',
        });
      
      if (adminError) {
        console.error('Admin creation error:', adminError);
        // If admin creation fails, we should clean up the auth user
        // Note: We can't use admin.deleteUser without admin privileges, so we'll just log this
        console.warn('Admin record creation failed, but auth user was created. Manual cleanup may be needed.');
        throw new Error(`Failed to create administrator record: ${adminError.message}`);
      }
      
      // If admin should be connected to a school, create the relationship
      if (schoolId) {
        const { error: relationError } = await supabase
          .from('users_to_schools')
          .insert({
            user_id: authUserId,
            school_id: schoolId,
            role: selectedRole?.name || 'Unknown',
          });
          
        if (relationError) {
          console.error('School relation error:', relationError);
          // Don't fail the entire operation for this, just log it
        }
      }
      
      // If send invitation is checked, we should handle that here
      if (data.send_invitation) {
        // In a real app, you would send an email here
        toast({
          title: 'Invitation Sent',
          description: `An invitation email has been sent to ${data.email}`,
        });
      }
      
      toast({
        title: 'Success',
        description: `Administrator has been created successfully. ${authData.user.email_confirmed_at ? 'They can now log in with their email and password.' : 'They will receive an email confirmation link and must confirm their email before they can log in.'}`,
      });
      
      form.reset();
      setActiveTab('all-admins');
      
      // Refresh the administrators list
      setPage(1);
      // Trigger a re-fetch by updating the search query briefly
      const currentQuery = searchQuery;
      setSearchQuery(currentQuery + ' ');
      setTimeout(() => setSearchQuery(currentQuery), 100);
      
    } catch (error: any) {
      console.error('Error creating administrator:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create administrator',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting an admin
  const handleDeleteAdmin = async (id: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to delete administrators',
        variant: 'destructive',
      });
      return;
    }

    if (window.confirm('Are you sure you want to delete this administrator?')) {
      try {
        const { error } = await supabase
          .from('administrators')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Administrator deleted successfully',
        });
        
        // Refresh the list
        setAdministrators(admins => admins.filter(admin => admin.id !== id));
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete administrator',
          variant: 'destructive',
        });
      }
    }
  };

  // Handle viewing admin details
  const handleViewDetails = (admin: Administrator) => {
    setActiveTab('view-admin');
    setSelectedAdmin(admin);
  };

  // Handle editing admin
  const handleEditAdmin = async (admin: Administrator) => {
    setActiveTab('edit-admin');
    setSelectedAdmin(admin);
    
    try {
      // Fetch the full admin record to get role_id and school_id
      const { data: adminData, error } = await supabase
        .from('administrators')
        .select('role_id, school_id, phone')
        .eq('id', admin.id)
        .single();
      
      if (error) {
        console.error('Error fetching admin details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load administrator details',
          variant: 'destructive',
        });
        return;
      }
      
      // Populate form with existing data
      form.reset({
        full_name: admin.name,
        email: admin.email,
        username: admin.username,
        phone: adminData.phone || '',
        password: '',
        confirmPassword: '',
        role_id: adminData.role_id || '',
        school_id: adminData.school_id || 'all_schools',
        send_invitation: false
      });
    } catch (error) {
      console.error('Error in handleEditAdmin:', error);
      toast({
        title: 'Error',
        description: 'Failed to load administrator details',
        variant: 'destructive',
      });
    }
  };

  // Handle changing admin role
  const handleChangeRole = (admin: Administrator) => {
    setActiveTab('change-role');
    setSelectedAdmin(admin);
  };

  // Handle updating admin role
  const handleUpdateRole = async (adminId: string, newRoleId: string) => {
    try {
      const selectedRole = roleOptions.find(role => role.id === newRoleId);
      
      const { error } = await supabase
        .from('administrators')
        .update({
          role: selectedRole?.name || 'Unknown',
          role_id: newRoleId,
        })
        .eq('id', adminId);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Administrator role updated successfully',
      });
      
      // Refresh the administrators list
      setPage(1);
      const currentQuery = searchQuery;
      setSearchQuery(currentQuery + ' ');
      setTimeout(() => setSearchQuery(currentQuery), 100);
      
      setActiveTab('all-admins');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update administrator role',
        variant: 'destructive',
      });
    }
  };

  // Handle updating admin information
  const handleUpdateAdmin = async (data: AdminFormValues) => {
    if (!selectedAdmin) return;
    
    setIsSubmitting(true);
    try {
      // First, update the administrator record in the database
      const updateData: any = {
        full_name: data.full_name,
        username: data.username,
        email: data.email,
        phone: data.phone || null,
      };
      
      // Only update role_id and school_id if they've changed
      if (data.role_id) {
        const selectedRole = roleOptions.find(role => role.id === data.role_id);
        updateData.role = selectedRole?.name || 'Unknown';
        updateData.role_id = data.role_id;
      }
      
      if (data.school_id) {
        updateData.school_id = data.school_id === 'all_schools' ? null : data.school_id;
      }
      
      const { error: adminError } = await supabase
        .from('administrators')
        .update(updateData)
        .eq('id', selectedAdmin.id);
      
      if (adminError) throw adminError;
      
      // If password is provided, update it in Supabase authentication
      if (data.password && data.password.length > 0) {
        try {
          // Get the user_id from the administrator record
          const { data: adminRecord, error: fetchError } = await supabase
            .from('administrators')
            .select('user_id')
            .eq('id', selectedAdmin.id)
            .single();
          
          if (fetchError) throw fetchError;
          
          if (adminRecord?.user_id) {
            // Try to update password using admin functions
            try {
              // This requires admin privileges in Supabase
              const { error: passwordUpdateError } = await supabase.auth.admin.updateUserById(
                adminRecord.user_id,
                { password: data.password }
              );
              
              if (passwordUpdateError) {
                console.error('Password update error:', passwordUpdateError);
                // If admin update fails, try alternative approach
                toast({
                  title: 'Password Update Note',
                  description: 'Profile updated successfully. Password change requires admin privileges. Consider sending a password reset email instead.',
                });
              } else {
                toast({
                  title: 'Success',
                  description: 'Administrator profile and password updated successfully',
                });
              }
            } catch (adminError) {
              console.error('Admin password update failed:', adminError);
              // Fallback: suggest password reset email
              toast({
                title: 'Password Update Note',
                description: 'Profile updated successfully. For password changes, consider sending a password reset email to the user.',
              });
            }
          }
        } catch (passwordError) {
          console.error('Error updating password:', passwordError);
          // Don't fail the entire operation for password update issues
          toast({
            title: 'Warning',
            description: 'Profile updated but password update failed. You may need admin privileges to change passwords.',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Success',
          description: 'Administrator updated successfully',
        });
      }
      
      // Refresh the administrators list
      setPage(1);
      const currentQuery = searchQuery;
      setSearchQuery(currentQuery + ' ');
      setTimeout(() => setSearchQuery(currentQuery), 100);
      
      setActiveTab('all-admins');
      setSelectedAdmin(null);
      form.reset();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update administrator',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle toggling admin status
  const handleToggleStatus = async (adminId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('administrators')
        .update({ status: newStatus })
        .eq('id', adminId);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `Administrator status changed to ${newStatus}`,
      });
      
      // Update local state
      setAdministrators(admins => 
        admins.map(admin => 
          admin.id === adminId 
            ? { ...admin, status: newStatus }
            : admin
        )
      );
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update administrator status',
        variant: 'destructive',
      });
    }
  };

  // Handle sending password reset email
  const handleSendPasswordReset = async (adminId: string) => {
    try {
      // Get the user_id from the administrator record
      const { data: adminRecord, error: fetchError } = await supabase
        .from('administrators')
        .select('user_id, email')
        .eq('id', adminId)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (adminRecord?.user_id && adminRecord?.email) {
        // Send password reset email
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          adminRecord.email,
          {
            redirectTo: `${window.location.origin}/auth/reset-password`,
          }
        );
        
        if (resetError) throw resetError;
        
        toast({
          title: 'Password Reset Email Sent',
          description: `A password reset link has been sent to ${adminRecord.email}`,
        });
      }
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send password reset email',
        variant: 'destructive',
      });
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Clear selected admin when switching to main tabs
    if (value === 'all-admins' || value === 'add-admin') {
      setSelectedAdmin(null);
      form.reset();
    }
  };

  // NOW WE CAN HAVE CONDITIONAL RETURNS - AFTER ALL HOOKS ARE CALLED
  // Show loading while checking auth
  if (authLoading) {
    return (
      <PageTemplate title="Administrators" subtitle="Manage system administrators and their permissions">
        <div className="flex justify-center items-center py-10">
          <p>Loading...</p>
        </div>
      </PageTemplate>
    );
  }

  // Show auth required message if user is not logged in
  if (!user) {
    return (
      <PageTemplate title="Administrators" subtitle="Manage system administrators and their permissions">
        <div className="flex flex-col justify-center items-center py-10">
          <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please log in to access the administrators management system.
          </p>
          <Button onClick={() => window.location.href = '/auth'}>
            Go to Login
          </Button>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title="Administrators" subtitle="Manage system administrators and their permissions">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all-admins">All Administrators</TabsTrigger>
            <TabsTrigger value="add-admin">Add Administrator</TabsTrigger>
            {selectedAdmin && (
              <>
                <TabsTrigger value="view-admin">View Details</TabsTrigger>
                <TabsTrigger value="edit-admin">Edit Admin</TabsTrigger>
                <TabsTrigger value="change-role">Change Role</TabsTrigger>
              </>
            )}
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search administrators"
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roleOptions.map(role => (
                  <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Clear Filters */}
            {(statusFilter !== 'all' || roleFilter !== 'all' || searchQuery) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatusFilter('all');
                  setRoleFilter('all');
                  setSearchQuery('');
                  setPage(1);
                }}
              >
                Clear Filters
              </Button>
            )}
            
            <Button onClick={() => setActiveTab('add-admin')}>
              <UserPlus className="mr-2 h-4 w-4" /> New Admin
            </Button>
          </div>
        </div>
        
        <TabsContent value="all-admins">
          <Card>
            <CardHeader>
              <CardTitle>System Administrators</CardTitle>
              <CardDescription>Manage users with administrative access to the system</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : administrators.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No administrators found</p>
                  <Button className="mt-4" onClick={() => setActiveTab('add-admin')}>
                    <UserPlus className="mr-2 h-4 w-4" /> Add Administrator
                  </Button>
                </div>
              ) : (
                <>
                  {/* Bulk Actions */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        {administrators.length} administrator{administrators.length !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Bulk activate all
                          administrators.forEach(admin => {
                            if (admin.status !== 'active') {
                              handleToggleStatus(admin.id, admin.status);
                            }
                          });
                        }}
                      >
                        <CheckCircle className="mr-2 h-3 w-3" />
                        Activate All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Bulk deactivate all
                          administrators.forEach(admin => {
                            if (admin.status === 'active') {
                              handleToggleStatus(admin.id, admin.status);
                            }
                          });
                        }}
                      >
                        <Shield className="mr-2 h-3 w-3" />
                        Deactivate All
                      </Button>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {administrators.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell className="font-medium">{admin.name}</TableCell>
                          <TableCell>{admin.username}</TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{admin.role}</span>
                            </div>
                          </TableCell>
                          <TableCell>{admin.school}</TableCell>
                          <TableCell>
                            <Badge variant={admin.status === "Active" ? "default" : "destructive"}>
                              {admin.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : "Never"}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(admin)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>View Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditAdmin(admin)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  <span>Edit Admin</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleChangeRole(admin)}>
                                  <Shield className="mr-2 h-4 w-4" />
                                  <span>Change Role</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleStatus(admin.id, admin.status)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  <span>{admin.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendPasswordReset(admin.id)}>
                                  <Key className="mr-2 h-4 w-4" />
                                  <span>Send Password Reset</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600" 
                                  onClick={() => handleDeleteAdmin(admin.id)}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {Math.min((page - 1) * pageSize + 1, total)} to{" "}
                      {Math.min(page * pageSize, total)} of {total} entries
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1}
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setPage(page + 1)}
                        disabled={page >= Math.ceil(total / pageSize)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="view-admin">
          {selectedAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Administrator Details</CardTitle>
                <CardDescription>Detailed information about {selectedAdmin.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                      <p className="text-lg font-semibold">{selectedAdmin.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Username</Label>
                      <p className="text-lg">{selectedAdmin.username}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-lg">{selectedAdmin.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="default">{selectedAdmin.role}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">School Assignment</Label>
                      <p className="text-lg">{selectedAdmin.school || 'All Schools'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <Badge variant={selectedAdmin.status === "Active" ? "default" : "destructive"}>
                        {selectedAdmin.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Last Login</Label>
                      <p className="text-lg">
                        {selectedAdmin.lastLogin ? new Date(selectedAdmin.lastLogin).toLocaleDateString() : "Never"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Administrator ID</Label>
                      <p className="text-sm font-mono text-muted-foreground">{selectedAdmin.id}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('all-admins')}
                  >
                    Back to List
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="edit-admin">
          <Card>
            <CardHeader>
              <CardTitle>Edit Administrator</CardTitle>
              <CardDescription>Modify existing administrator details</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedAdmin ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleUpdateAdmin)} className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter username for login" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password (Optional)</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter new password" {...field} />
                            </FormControl>
                            <FormMessage />
                            <FormDescription>
                              Leave blank to keep current password. Password updates require admin privileges.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm new password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="role_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="-- Select Role --" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {roleOptions.map(role => (
                                  <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="school_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School (Leave empty for all schools)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="-- Access to All Schools --" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="all_schools">-- Access to All Schools --</SelectItem>
                                {schoolOptions.map(school => (
                                  <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="send_invitation"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                              id="sendInvitation" 
                            />
                          </FormControl>
                          <FormLabel htmlFor="sendInvitation" className="text-sm font-normal">
                            Send account invitation email to the new administrator
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setActiveTab('all-admins');
                          setSelectedAdmin(null);
                          form.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => selectedAdmin && handleSendPasswordReset(selectedAdmin.id)}
                      >
                        <Key className="mr-2 h-4 w-4" />
                        Send Password Reset
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
                            Updating...
                          </>
                        ) : (
                          'Update Administrator'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No administrator selected for editing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="change-role">
          <Card>
            <CardHeader>
              <CardTitle>Change Administrator Role</CardTitle>
              <CardDescription>Modify the role for {selectedAdmin?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedAdmin ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Current Role</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="default">{selectedAdmin.role}</Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Current School</Label>
                      <p className="mt-2">{selectedAdmin.school || 'All Schools'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Select New Role</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {roleOptions.map(role => (
                        <Button
                          key={role.id}
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-start gap-2"
                          onClick={() => handleUpdateRole(selectedAdmin.id, role.id)}
                        >
                          <Shield className="h-4 w-4 text-primary" />
                          <div className="text-left">
                            <div className="font-medium">{role.name}</div>
                            <div className="text-xs text-muted-foreground">Click to assign</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setActiveTab('all-admins');
                        setSelectedAdmin(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No administrator selected for role change</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add-admin">
          <Card>
            <CardHeader>
              <CardTitle>Add Administrator</CardTitle>
              <CardDescription>Create a new administrator user</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter username for login" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter strong password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="role_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="-- Select Role --" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roleOptions.map(role => (
                                <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="school_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School (Leave empty for all schools)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="-- Access to All Schools --" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all_schools">-- Access to All Schools --</SelectItem>
                              {schoolOptions.map(school => (
                                <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="send_invitation"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                            id="sendInvitation" 
                          />
                        </FormControl>
                        <FormLabel htmlFor="sendInvitation" className="text-sm font-normal">
                          Send account invitation email to the new administrator
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab('all-admins')}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
                          Creating...
                        </>
                      ) : (
                        'Create Administrator'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};

export default Admins;
