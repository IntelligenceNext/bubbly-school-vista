
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import PageTemplate from '@/components/PageTemplate';
import DataTable, { Column } from '@/components/DataTable';
import PageHeader from '@/components/PageHeader';
import { School, getSchools, deleteSchool, bulkUpdateSchoolStatus } from '@/services/schoolManagementService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import FilterDropdown from '@/components/FilterDropdown';
import usePagination from '@/hooks/usePagination';
import FileUpload from '@/components/FileUpload';
import { cn } from '@/lib/utils';

const schoolSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
});

type SchoolFormValues = z.infer<typeof schoolSchema>;

const SchoolsPage = () => {
  const [isSchoolDialogOpen, setIsSchoolDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    status: '',
    created_at_start: '',
    created_at_end: '',
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const pagination = usePagination();
  const { page, pageSize, setTotal } = pagination;

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: '',
      code: '',
      email: '',
      phone: '',
      address: '',
      status: 'active',
    },
  });

  const { data: schoolsData, isLoading, refetch } = useQuery({
    queryKey: ['schools', filters, page, pageSize],
    queryFn: async () => {
      const result = await getSchools({
        ...filters,
        page,
        pageSize,
        status: filters.status as "active" | "inactive" | undefined,
      });
      setTotal(result.count);
      return result.data;
    },
  });

  const columns: Column<School>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (school) => <div className="font-medium">{school.name}</div>,
      isSortable: true,
      sortKey: 'name',
    },
    {
      id: 'code',
      header: 'Code',
      cell: (school) => <div>{school.code}</div>,
    },
    {
      id: 'email',
      header: 'Email',
      cell: (school) => <div>{school.email || '-'}</div>,
    },
    {
      id: 'phone',
      header: 'Phone',
      cell: (school) => <div>{school.phone || '-'}</div>,
      isVisible: false, // Changed 'visible' to 'isVisible'
    },
    {
      id: 'status',
      header: 'Status',
      cell: (school) => (
        <Badge variant={school.status === 'active' ? 'success' : 'secondary'}>
          {school.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'created_at',
      header: 'Created',
      cell: (school) => <div>{format(new Date(school.created_at), 'MMM d, yyyy')}</div>,
    },
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (school: School) => handleEditSchool(school),
    },
    {
      label: 'Delete',
      onClick: (school: School) => {
        setSelectedSchool(school);
        setIsDeleteDialogOpen(true);
      },
      variant: 'destructive' as const,
    },
  ];

  const bulkActions = [
    {
      label: 'Activate',
      onClick: (schools: School[]) => handleBulkStatusChange(schools, 'active'),
    },
    {
      label: 'Deactivate',
      onClick: (schools: School[]) => handleBulkStatusChange(schools, 'inactive'),
    },
  ];

  const applyFilters = () => {
    const active: string[] = [];
    if (filters.name) active.push('name');
    if (filters.status) active.push('status');
    if (filters.created_at_start || filters.created_at_end) active.push('date');
    
    setActiveFilters(active);
    refetch();
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      status: '',
      created_at_start: '',
      created_at_end: '',
    });
    setActiveFilters([]);
    refetch();
  };

  const handleCreateSchool = () => {
    setEditingSchool(null);
    form.reset({
      name: '',
      code: '',
      email: '',
      phone: '',
      address: '',
      status: 'active',
    });
    setIsSchoolDialogOpen(true);
  };

  const handleEditSchool = (school: School) => {
    setEditingSchool(school);
    form.reset({
      name: school.name,
      code: school.code,
      email: school.email || '',
      phone: school.phone || '',
      address: school.address || '',
      status: school.status,
    });
    setIsSchoolDialogOpen(true);
  };

  const handleDeleteSchool = async () => {
    if (!selectedSchool) return;
    
    const success = await deleteSchool(selectedSchool.id);
    if (success) {
      refetch();
      setIsDeleteDialogOpen(false);
      setSelectedSchool(null);
    }
  };

  const handleBulkStatusChange = async (schools: School[], status: 'active' | 'inactive') => {
    const schoolIds = schools.map(school => school.id);
    const success = await bulkUpdateSchoolStatus(schoolIds, status);
    if (success) {
      refetch();
    }
  };

  const onSubmit = async (data: SchoolFormValues) => {
    try {
      if (editingSchool) {
        // Update existing school
        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase
          .from('schools')
          .update({
            name: data.name,
            code: data.code,
            email: data.email,
            phone: data.phone,
            address: data.address,
            status: data.status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingSchool.id);

        if (error) throw error;
        
        toast({
          title: 'School updated',
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        // Create new school
        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase
          .from('schools')
          .insert({
            name: data.name,
            code: data.code,
            email: data.email,
            phone: data.phone,
            address: data.address,
            status: data.status,
          });

        if (error) throw error;
        
        toast({
          title: 'School created',
          description: `${data.name} has been created successfully.`,
        });
      }
      
      setIsSchoolDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleLogoUpload = async (schoolId: string, path: string) => {
    if (!path) return;
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase
        .from('schools')
        .update({
          logo_url: path,
          updated_at: new Date().toISOString(),
        })
        .eq('id', schoolId);

      if (error) throw error;
      
      toast({
        title: 'Logo updated',
        description: 'School logo has been updated successfully.',
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error updating logo',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <PageTemplate title="Schools" subtitle="Manage all schools in the system">
      <PageHeader
        title="Schools"
        description="Create and manage schools in the system"
        primaryAction={{
          label: "Add School",
          onClick: handleCreateSchool,
          icon: <Plus className="h-4 w-4 mr-2" />,
        }}
        actions={[
          <FilterDropdown
            key="filter"
            filters={
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name-filter">School Name</Label>
                  <Input
                    id="name-filter"
                    placeholder="Search by name"
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters({ ...filters, status: value })}
                  >
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Created Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.created_at_start ? (
                            format(new Date(filters.created_at_start), "PPP")
                          ) : (
                            <span>From date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.created_at_start ? new Date(filters.created_at_start) : undefined}
                          onSelect={(date) =>
                            setFilters({
                              ...filters,
                              created_at_start: date ? date.toISOString() : "",
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.created_at_end ? (
                            format(new Date(filters.created_at_end), "PPP")
                          ) : (
                            <span>To date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.created_at_end ? new Date(filters.created_at_end) : undefined}
                          onSelect={(date) =>
                            setFilters({
                              ...filters,
                              created_at_end: date ? date.toISOString() : "",
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            }
            onClear={clearFilters}
            onApply={applyFilters}
            activeFiltersCount={activeFilters.length}
          />,
        ]}
      />

      <DataTable
        data={schoolsData || []}
        columns={columns}
        keyField="id"
        isLoading={isLoading}
        selectable={true}
        actions={actions}
        bulkActions={bulkActions}
        emptyState={
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No schools found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new school to get started.
            </p>
            <Button className="mt-4" onClick={handleCreateSchool}>
              <Plus className="h-4 w-4 mr-2" />
              Add School
            </Button>
          </div>
        }
      />

      {/* School Dialog */}
      <Dialog open={isSchoolDialogOpen} onOpenChange={setIsSchoolDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingSchool ? "Edit School" : "Add New School"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter school name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter school code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email" {...field} value={field.value || ''} />
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
                        <Input placeholder="Enter phone" {...field} value={field.value || ''} />
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
                      <Input placeholder="Enter address" {...field} value={field.value || ''} />
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {editingSchool && (
                <div className="pt-4 border-t">
                  <FormLabel>School Logo</FormLabel>
                  <div className="mt-2">
                    <FileUpload 
                      bucket="school_logos"
                      maxSize={1}
                      acceptedFileTypes={["image/*"]}
                      buttonText="Upload Logo"
                      onUploadComplete={(path) => handleLogoUpload(editingSchool.id, path)}
                    />
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSchoolDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSchool ? "Update School" : "Create School"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedSchool?.name}</span>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. This will permanently delete the
              school and all associated data.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteSchool}
            >
              Delete School
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default SchoolsPage;
