import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { CreateStaffRequest, Staff } from '@/services/staffService';
import { getRoles, Role } from '@/services/roleService';

const staffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  date_of_birth: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address'),
  joining_date: z.string().optional(),
  role: z.string().optional(),
  salary: z.number().min(0, 'Salary must be positive').optional(),
  designation: z.string().optional(),
  qualification: z.string().optional(),
  note_description: z.string().optional(),
  is_bus_incharge: z.boolean().default(false),
  username: z.string().optional(),
  login_email: z.string().email('Invalid email').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  login_type: z.enum(['disable', 'existing', 'new']).default('disable'),
  zoom_client_id: z.string().optional(),
  zoom_client_secret: z.string().optional(),
  zoom_redirect_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  zoom_sdk_key: z.string().optional(),
  zoom_sdk_secret: z.string().optional(),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface StaffFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStaffRequest) => Promise<void>;
  staff?: Staff | null;
  isLoading?: boolean;
}

const StaffForm: React.FC<StaffFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  staff,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoadingRoles(true);
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: staff?.name || '',
      gender: staff?.gender as 'Male' | 'Female' | 'Other' || undefined,
      date_of_birth: staff?.date_of_birth || '',
      address: staff?.address || '',
      phone: staff?.phone || '',
      email: staff?.email || '',
      joining_date: staff?.joining_date || '',
      role: staff?.role || '',
      salary: staff?.salary || undefined,
      designation: staff?.designation || '',
      qualification: staff?.qualification || '',
      note_description: staff?.note_description || '',
      is_bus_incharge: staff?.is_bus_incharge || false,
      username: staff?.username || '',
      login_email: staff?.login_email || '',
      password: '',
      login_type: staff?.login_type || 'disable',
      zoom_client_id: staff?.zoom_client_id || '',
      zoom_client_secret: staff?.zoom_client_secret || '',
      zoom_redirect_url: staff?.zoom_redirect_url || '',
      zoom_sdk_key: staff?.zoom_sdk_key || '',
      zoom_sdk_secret: staff?.zoom_sdk_secret || '',
      status: staff?.status || 'Active',
    },
  });

  const handleSubmit = async (data: StaffFormValues) => {
    // Ensure name is provided - this satisfies the CreateStaffRequest interface
    const staffData: CreateStaffRequest = {
      name: data.name, // This is guaranteed to be a string from schema validation
      gender: data.gender,
      date_of_birth: data.date_of_birth,
      address: data.address,
      phone: data.phone,
      email: data.email,
      joining_date: data.joining_date,
      role: data.role,
      salary: data.salary,
      designation: data.designation,
      qualification: data.qualification,
      note_description: data.note_description,
      is_bus_incharge: data.is_bus_incharge,
      username: data.username,
      login_email: data.login_email,
      password: data.password,
      login_type: data.login_type,
      zoom_client_id: data.zoom_client_id,
      zoom_client_secret: data.zoom_client_secret,
      zoom_redirect_url: data.zoom_redirect_url,
      zoom_sdk_key: data.zoom_sdk_key,
      zoom_sdk_secret: data.zoom_sdk_secret,
      status: data.status,
    };

    await onSubmit(staffData);
    form.reset();
    onClose();
  };

  const loginType = form.watch('login_type');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
          </DialogTitle>
          <DialogDescription>
            Fill in the staff member's information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="joining">Joining</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="zoom">Zoom</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
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
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="joining" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="joining_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Joining Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Assistant Teacher" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingRoles}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={isLoadingRoles ? "Loading roles..." : "Select role"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.name}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter salary" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="qualification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualification</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter qualification" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="note_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional notes about the staff member" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_bus_incharge"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Bus In-charge
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="login" className="space-y-4">
                <FormField
                  control={form.control}
                  name="login_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select login type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="disable">Disable</SelectItem>
                          <SelectItem value="existing">Existing</SelectItem>
                          <SelectItem value="new">Generate New</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {loginType === 'new' && (
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertDescription>
                      Note: User login credentials will be stored but the actual user account will need to be created separately by an administrator.
                    </AlertDescription>
                  </Alert>
                )}

                {loginType !== 'disable' && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="login_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Login Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Login email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {loginType === 'new' && (
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="zoom" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="zoom_client_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zoom Client ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Zoom client ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zoom_client_secret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zoom Client Secret</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Zoom client secret" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zoom_redirect_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zoom Redirect URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/callback" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zoom_sdk_key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zoom SDK Key</FormLabel>
                        <FormControl>
                          <Input placeholder="Zoom SDK key" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zoom_sdk_secret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zoom SDK Secret</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Zoom SDK secret" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : staff ? 'Update Staff' : 'Add Staff'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StaffForm;
