import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import FilterDropdown from '@/components/FilterDropdown';
import usePagination from '@/hooks/usePagination';
import { cn } from '@/lib/utils';
import { Class, getClasses, createClass, updateClass, deleteClass } from '@/services/classService';

// Define a default school_id to use throughout the application
// In a real application, you would get this from user context/authentication
const DEFAULT_SCHOOL_ID = 'your_school_id';

const classSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  description: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
  school_id: z.string().uuid(),
});

type ClassFormValues = z.infer<typeof classSchema>;

const ClassesPage = () => {
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    status: '',
  });
  const [activeFilters, setActiveFilters] = useState([]);

  const pagination = usePagination();
  const { page, pageSize, setTotal } = pagination;
  
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      status: 'active',
      school_id: DEFAULT_SCHOOL_ID, // Set a default school ID
    },
  });

  const { data: classesData, isLoading, refetch } = useQuery({
    queryKey: ['classes', filters, page, pageSize],
    queryFn: async () => {
      const classes = await getClasses();
      setTotal(classes.length);
      return classes;
    },
  });

  useEffect(() => {
    refetch();
  }, [page, pageSize, refetch]);

  const columns: Column<any>[] = [
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
      onClick: (classItem) => handleEditClass(classItem),
    },
    {
      label: 'Delete',
      onClick: (classItem) => {
        setSelectedClass(classItem);
        setIsDeleteDialogOpen(true);
      },
      variant: 'destructive' as const,
    },
  ];

  const bulkActions = [
    {
      label: 'Activate',
      onClick: (classes: any[]) => handleBulkStatusChange(classes, 'active'),
    },
    {
      label: 'Deactivate',
      onClick: (classes: any[]) => handleBulkStatusChange(classes, 'inactive'),
    },
  ];

  const applyFilters = () => {
    const active: string[] = [];
    if (filters.name) active.push('name');
    if (filters.status) active.push('status');
    setActiveFilters(active);
    refetch();
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      status: '',
    });
    setActiveFilters([]);
    refetch();
  };

  const handleCreateClass = () => {
    setEditingClass(null);
    form.reset({
      name: '',
      code: '',
      description: '',
      status: 'active',
      school_id: DEFAULT_SCHOOL_ID, // Always provide a default school_id
    });
    setIsClassDialogOpen(true);
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    form.reset({
      name: classItem.name,
      code: classItem.code,
      description: classItem.description || '',
      status: classItem.status,
      school_id: classItem.school_id || DEFAULT_SCHOOL_ID, // Use the class's school_id or default
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

  const handleBulkStatusChange = async (classes: any[], status: 'active' | 'inactive') => {
    // Implement bulk status change logic here
  };

  const onSubmit = async (data: ClassFormValues) => {
    try {
      if (editingClass) {
        // Update existing class
        const updatedClass = await updateClass(editingClass.id, {
          name: data.name,
          code: data.code,
          description: data.description,
          status: data.status,
          school_id: data.school_id,
        });

        if (updatedClass) {
          toast({
            title: 'Class updated',
            description: `${data.name} has been updated successfully.`,
          });
          setIsClassDialogOpen(false);
          refetch();
        }
      } else {
        // Create new class - ensure school_id is included
        const newClass = await createClass({
          name: data.name,
          code: data.code,
          description: data.description,
          status: data.status,
          school_id: data.school_id,
        });

        if (newClass) {
          toast({
            title: 'Class created',
            description: `${data.name} has been created successfully.`,
          });
          setIsClassDialogOpen(false);
          refetch();
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

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
              
          {/* Hidden school_id field - not visible to users but required for form submission */}
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

export default ClassesPage;
