import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageTemplate from '@/components/PageTemplate';
import DataTable, { Column } from '@/components/DataTable';
import PageHeader from '@/components/PageHeader';
import { Class, School, getClasses, deleteClass, getSchools } from '@/services/schoolManagementService';
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
import { CheckCircle, Plus, School2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import FilterDropdown from '@/components/FilterDropdown';
import usePagination from '@/hooks/usePagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch";
import { FormDescription } from "@/components/ui/form";

const classSchema = z.object({
  school_id: z.string().min(1, "School is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type ClassFormValues = z.infer<typeof classSchema>;

const ClassesPage = () => {
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [filters, setFilters] = useState({
    school_id: '',
    name: '',
    is_active: undefined as boolean | undefined,
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const pagination = usePagination();
  const { page, pageSize, setTotal } = pagination;

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      school_id: '',
      name: '',
      code: '',
      description: '',
      is_active: true,
    },
  });

  const { data: schoolsData } = useQuery({
    queryKey: ['schools-dropdown'],
    queryFn: async () => {
      const result = await getSchools();
      return result.data;
    },
  });

  const { data: classesData, isLoading, refetch } = useQuery({
    queryKey: ['classes', filters, page, pageSize],
    queryFn: async () => {
      const result = await getClasses({
        ...filters,
        page,
        pageSize,
      });
      setTotal(result.count);
      return result.data;
    },
  });

  const columns: Column<Class & { schools: { name: string } }>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (classItem) => <div className="font-medium">{classItem.name}</div>,
      isSortable: true,
      sortKey: 'name',
    },
    {
      id: 'code',
      header: 'Code',
      cell: (classItem) => <div>{classItem.code}</div>,
    },
    {
      id: 'school',
      header: 'School',
      cell: (classItem) => (
        <div className="flex items-center">
          <School2 className="h-4 w-4 mr-2 text-muted-foreground" />
          {classItem.schools?.name || '—'}
        </div>
      ),
    },
    {
      id: 'is_active',
      header: 'Status',
      cell: (classItem) => (
        <Badge variant={classItem.is_active ? 'success' : 'secondary'}>
          {classItem.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'description',
      header: 'Description',
      cell: (classItem) => (
        <div className="max-w-[200px] truncate">{classItem.description || '—'}</div>
      ),
      isVisible: false, // Changed 'visible' to 'isVisible'
    },
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (classItem: Class & { schools: { name: string } }) => handleEditClass(classItem),
    },
    {
      label: 'Delete',
      onClick: (classItem: Class & { schools: { name: string } }) => {
        setSelectedClass(classItem);
        setIsDeleteDialogOpen(true);
      },
      variant: 'destructive' as const,
    },
  ];

  const applyFilters = () => {
    const active: string[] = [];
    if (filters.school_id) active.push('school');
    if (filters.name) active.push('name');
    if (filters.is_active !== undefined) active.push('status');
    
    setActiveFilters(active);
    refetch();
  };

  const clearFilters = () => {
    setFilters({
      school_id: '',
      name: '',
      is_active: undefined,
    });
    setActiveFilters([]);
    refetch();
  };

  const handleCreateClass = () => {
    setEditingClass(null);
    form.reset({
      school_id: '',
      name: '',
      code: '',
      description: '',
      is_active: true,
    });
    setIsClassDialogOpen(true);
  };

  const handleEditClass = (classItem: Class) => {
    setEditingClass(classItem);
    form.reset({
      school_id: classItem.school_id,
      name: classItem.name,
      code: classItem.code,
      description: classItem.description || '',
      is_active: classItem.is_active,
    });
    setIsClassDialogOpen(true);
  };

  const handleDeleteClass = async () => {
    if (!selectedClass) return;
    
    const success = await deleteClass(selectedClass.id);
    if (success) {
      refetch();
      setIsDeleteDialogOpen(false);
      setSelectedClass(null);
    }
  };

  const onSubmit = async (data: ClassFormValues) => {
    try {
      if (editingClass) {
        // Update existing class
        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase
          .from('classes')
          .update({
            school_id: data.school_id,
            name: data.name,
            code: data.code,
            description: data.description,
            is_active: data.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingClass.id);

        if (error) throw error;
        
        toast({
          title: 'Class updated',
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        // Create new class
        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase
          .from('classes')
          .insert({
            school_id: data.school_id,
            name: data.name,
            code: data.code,
            description: data.description,
            is_active: data.is_active,
          });

        if (error) throw error;
        
        toast({
          title: 'Class created',
          description: `${data.name} has been created successfully.`,
        });
      }
      
      setIsClassDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <PageTemplate title="Classes" subtitle="Manage school classes">
      <PageHeader
        title="Classes"
        description="Create and manage classes for each school"
        primaryAction={{
          label: "Add Class",
          onClick: handleCreateClass,
          icon: <Plus className="h-4 w-4 mr-2" />,
        }}
        actions={[
          <FilterDropdown
            key="filter"
            filters={
              <div className="space-y-4">
                <div>
                  <Label htmlFor="school-filter">School</Label>
                  <Select
                    value={filters.school_id}
                    onValueChange={(value) => setFilters({ ...filters, school_id: value })}
                  >
                    <SelectTrigger id="school-filter">
                      <SelectValue placeholder="All schools" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All schools</SelectItem>
                      {schoolsData?.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="name-filter">Class Name</Label>
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
                    value={filters.is_active !== undefined ? filters.is_active.toString() : ""}
                    onValueChange={(value) => setFilters({ 
                      ...filters, 
                      is_active: value === "" ? undefined : value === "true" 
                    })}
                  >
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
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
        data={classesData || []}
        columns={columns}
        keyField="id"
        isLoading={isLoading}
        selectable={true}
        actions={actions}
        emptyState={
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No classes found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new class to get started.
            </p>
            <Button className="mt-4" onClick={handleCreateClass}>
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </div>
        }
      />

      {/* Class Dialog */}
      <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingClass ? "Edit Class" : "Add New Class"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="general">General Info</TabsTrigger>
                  <TabsTrigger value="extra">Extra Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="mt-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="school_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a school" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {schoolsData?.map((school) => (
                              <SelectItem key={school.id} value={school.id}>
                                {school.name}
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter class name" {...field} />
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
                        <FormLabel>Class Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter class code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="extra" className="mt-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter class description" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Active Status</FormLabel>
                          <FormDescription>
                            Mark if this class is currently active
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsClassDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingClass ? "Update Class" : "Create Class"}
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
              <span className="font-semibold">{selectedClass?.name}</span>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. This will permanently delete the
              class and all associated data.
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
              onClick={handleDeleteClass}
            >
              Delete Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

// Add missing imports
import { Switch } from "@/components/ui/switch";
import { FormDescription } from "@/components/ui/form";

export default ClassesPage;
