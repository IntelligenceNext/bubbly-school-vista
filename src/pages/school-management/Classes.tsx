
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import PageTemplate from '@/components/PageTemplate';
import DataTable, { Column } from '@/components/DataTable';
import PageHeader from '@/components/PageHeader';
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
import { Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import FilterDropdown from '@/components/FilterDropdown';
import usePagination from '@/hooks/usePagination';
import { Class, getClasses, createClass, updateClass, deleteClass } from '@/services/classService';

// Generate a UUID for default school ID (in a real app, this would come from auth context)
const DEFAULT_SCHOOL_ID = crypto.randomUUID();

const classSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  school_id: z.string().uuid(),
});

type ClassFormValues = z.infer<typeof classSchema>;

const ClassesPage = () => {
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    status: '',
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const pagination = usePagination();
  const { page, pageSize, setTotal } = pagination;
  
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      status: 'active',
      school_id: DEFAULT_SCHOOL_ID,
    },
  });

  const { data: classesData, isLoading, error } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const classes = await getClasses();
      setTotal(classes.length);
      return classes;
    },
  });

  const createClassMutation = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({
        title: 'Success',
        description: 'Class created successfully.',
      });
      setIsClassDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create class',
        variant: 'destructive',
      });
    },
  });

  const updateClassMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Class, 'id' | 'created_at' | 'updated_at'>> }) =>
      updateClass(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({
        title: 'Success',
        description: 'Class updated successfully.',
      });
      setIsClassDialogOpen(false);
      setEditingClass(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update class',
        variant: 'destructive',
      });
    },
  });

  const deleteClassMutation = useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({
        title: 'Success',
        description: 'Class deleted successfully.',
      });
      setIsDeleteDialogOpen(false);
      setSelectedClass(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete class',
        variant: 'destructive',
      });
    },
  });

  const columns: Column<Class>[] = [
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
      id: 'description',
      header: 'Description',
      cell: (classItem) => <div>{classItem.description || '-'}</div>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (classItem) => (
        <Badge variant={classItem.status === 'active' ? 'success' : 'secondary'}>
          {classItem.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'created_at',
      header: 'Created',
      cell: (classItem) => <div>{format(new Date(classItem.created_at), 'MMM d, yyyy')}</div>,
    },
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (classItem: Class) => handleEditClass(classItem),
    },
    {
      label: 'Delete',
      onClick: (classItem: Class) => {
        setSelectedClass(classItem);
        setIsDeleteDialogOpen(true);
      },
      variant: 'destructive' as const,
    },
  ];

  const bulkActions = [
    {
      label: 'Activate',
      onClick: (classes: Class[]) => handleBulkStatusChange(classes, 'active'),
    },
    {
      label: 'Deactivate',
      onClick: (classes: Class[]) => handleBulkStatusChange(classes, 'inactive'),
    },
  ];

  const applyFilters = () => {
    const active: string[] = [];
    if (filters.name) active.push('name');
    if (filters.status) active.push('status');
    setActiveFilters(active);
    queryClient.invalidateQueries({ queryKey: ['classes'] });
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      status: '',
    });
    setActiveFilters([]);
    queryClient.invalidateQueries({ queryKey: ['classes'] });
  };

  const handleCreateClass = () => {
    setEditingClass(null);
    form.reset({
      name: '',
      code: '',
      description: '',
      status: 'active',
      school_id: DEFAULT_SCHOOL_ID,
    });
    setIsClassDialogOpen(true);
  };

  const handleEditClass = (classItem: Class) => {
    setEditingClass(classItem);
    form.reset({
      name: classItem.name,
      code: classItem.code,
      description: classItem.description || '',
      status: classItem.status,
      school_id: classItem.school_id || DEFAULT_SCHOOL_ID,
    });
    setIsClassDialogOpen(true);
  };

  const handleDeleteClass = async () => {
    if (!selectedClass) return;
    deleteClassMutation.mutate(selectedClass.id);
  };

  const handleBulkStatusChange = async (classes: Class[], status: 'active' | 'inactive') => {
    // Implement bulk status change logic here
    console.log('Bulk status change:', classes, status);
  };

  const onSubmit = async (data: ClassFormValues) => {
    try {
      if (editingClass) {
        updateClassMutation.mutate({
          id: editingClass.id,
          data: {
            name: data.name,
            code: data.code,
            description: data.description,
            status: data.status,
            school_id: data.school_id,
          }
        });
      } else {
        createClassMutation.mutate({
          name: data.name,
          code: data.code,
          description: data.description,
          status: data.status,
          school_id: data.school_id,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  if (error) {
    return (
      <PageTemplate title="Classes" subtitle="Manage classes">
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-destructive">Error loading classes</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {error.message || 'Failed to load classes'}
          </p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title="Classes" subtitle="Manage classes">
      <PageHeader
        title="Classes"
        description="Create and manage classes"
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
        bulkActions={bulkActions}
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
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter description" {...field} />
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
              
              {/* Hidden school_id field */}
              <FormField
                control={form.control}
                name="school_id"
                render={({ field }) => (
                  <input type="hidden" {...field} />
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsClassDialogOpen(false)}
                  disabled={createClassMutation.isPending || updateClassMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createClassMutation.isPending || updateClassMutation.isPending}
                >
                  {createClassMutation.isPending || updateClassMutation.isPending
                    ? 'Saving...'
                    : editingClass ? "Update Class" : "Create Class"
                  }
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
              disabled={deleteClassMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteClass}
              disabled={deleteClassMutation.isPending}
            >
              {deleteClassMutation.isPending ? 'Deleting...' : 'Delete Class'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default ClassesPage;
