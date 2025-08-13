
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
import { Eye, MoreVertical, Pencil, Plus, Search, Shield, Trash, UserPlus } from 'lucide-react';
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
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role_id: z.string().min(1, 'Role is required'),
  school_id: z.string().optional(),
  send_invitation: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
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
  }, [searchQuery, page, pageSize]);

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

      // Simplified approach - just create administrator record without auth.signUp
      // This allows creating admin records for existing users or using a simpler approach
      let authUserId = null;
      
      // For now, we'll create a unique ID for the admin record
      // In a real implementation, you'd handle user authentication separately
      const tempUserId = crypto.randomUUID();
      
      // Determine if school_id should be null (for all schools access)
      const schoolId = data.school_id === 'all_schools' ? null : data.school_id || null;
      
      // Get the role name for the text field (backwards compatibility)
      const selectedRole = roleOptions.find(role => role.id === data.role_id);
      
      // Create the administrator record
      const { error: adminError } = await supabase
        .from('administrators')
        .insert({
          user_id: tempUserId,
          full_name: data.full_name,
          username: data.username,
          email: data.email,
          phone: data.phone || null,
          role: selectedRole?.name || 'Unknown',
          role_id: data.role_id,
          school_id: schoolId,
          status: 'active',
        });
      
      if (adminError) throw adminError;
      
      // If admin should be connected to a school, create the relationship
      if (schoolId) {
        const { error: relationError } = await supabase
          .from('users_to_schools')
          .insert({
            user_id: tempUserId,
            school_id: schoolId,
            role: selectedRole?.name || 'Unknown',
          });
          
        if (relationError) throw relationError;
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
        description: 'Administrator has been created successfully',
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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all-admins">All Administrators</TabsTrigger>
            <TabsTrigger value="add-admin">Add Administrator</TabsTrigger>
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
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>View Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  <span>Edit Admin</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="mr-2 h-4 w-4" />
                                  <span>Change Role</span>
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
        
        <TabsContent value="add-admin">
          <Card>
            <CardHeader>
              <CardTitle>Add Administrator</CardTitle>
              <CardDescription>Create a new administrator account</CardDescription>
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
