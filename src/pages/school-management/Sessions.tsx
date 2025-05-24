import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import PageTemplate from '@/components/PageTemplate';
import DataTable, { Column } from '@/components/DataTable';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { DatePickerWithMonthYear } from '@/components/ui/DatePickerWithMonthYear';
import { Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import FilterDropdown from '@/components/FilterDropdown';
import usePagination from '@/hooks/usePagination';
import { Session, getSessions, createSession, updateSession, deleteSession } from '@/services/sessionService';

// Define a default school_id to use throughout the application
// In a real application, you would get this from user context/authentication
const DEFAULT_SCHOOL_ID = 'your_school_id';

const sessionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  status: z.string().default("active"),
  school_id: z.string().uuid(),
}).refine((data) => {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  return endDate > startDate;
}, {
  message: "End date must be after start date",
  path: ["end_date"],
});

type SessionFormValues = z.infer<typeof sessionSchema>;

const SessionsPage = () => {
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    status: '',
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const pagination = usePagination();
  const { page, pageSize, setTotal } = pagination;
  const queryClient = useQueryClient();

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: '',
      start_date: '',
      end_date: '',
      status: 'active',
      school_id: DEFAULT_SCHOOL_ID,
    },
  });

  const { data: sessionsData, isLoading, refetch } = useQuery({
    queryKey: ['sessions', filters, page, pageSize],
    queryFn: async () => {
      const sessions = await getSessions();
      setTotal(sessions.length);
      return sessions;
    },
  });

  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: 'Success',
        description: 'Session created successfully.',
      });
      setIsSessionDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      console.error('Create session error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create session.',
        variant: 'destructive',
      });
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Session, 'id' | 'created_at' | 'updated_at'>> }) =>
      updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: 'Success',
        description: 'Session updated successfully.',
      });
      setIsSessionDialogOpen(false);
      setEditingSession(null);
      form.reset();
    },
    onError: (error: any) => {
      console.error('Update session error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update session.',
        variant: 'destructive',
      });
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: 'Success',
        description: 'Session deleted successfully.',
      });
      setIsDeleteDialogOpen(false);
      setSelectedSession(null);
    },
    onError: (error: any) => {
      console.error('Delete session error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete session.',
        variant: 'destructive',
      });
    },
  });

  const columns: Column<Session>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (sessionItem) => <div className="font-medium">{sessionItem.name}</div>,
      isSortable: true,
      sortKey: 'name',
    },
    {
      id: 'start_date',
      header: 'Start Date',
      cell: (sessionItem) => <div>{format(new Date(sessionItem.start_date), 'MMM d, yyyy')}</div>,
    },
    {
      id: 'end_date',
      header: 'End Date',
      cell: (sessionItem) => <div>{format(new Date(sessionItem.end_date), 'MMM d, yyyy')}</div>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (sessionItem) => (
        <Badge variant={sessionItem.status === 'active' ? 'success' : 'secondary'}>
          {sessionItem.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'created_at',
      header: 'Created',
      cell: (sessionItem) => <div>{format(new Date(sessionItem.created_at), 'MMM d, yyyy')}</div>,
    },
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (sessionItem: Session) => handleEditSession(sessionItem),
    },
    {
      label: 'Delete',
      onClick: (sessionItem: Session) => {
        setSelectedSession(sessionItem);
        setIsDeleteDialogOpen(true);
      },
      variant: 'destructive' as const,
    },
  ];

  const bulkActions = [
    {
      label: 'Activate',
      onClick: async (sessions: Session[]) => handleBulkStatusChange(sessions, 'active'),
    },
    {
      label: 'Deactivate',
      onClick: async (sessions: Session[]) => handleBulkStatusChange(sessions, 'inactive'),
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

  const handleCreateSession = () => {
    setEditingSession(null);
    form.reset({
      name: '',
      start_date: '',
      end_date: '',
      status: 'active',
      school_id: DEFAULT_SCHOOL_ID,
    });
    setIsSessionDialogOpen(true);
  };

  const handleEditSession = (sessionItem: Session) => {
    setEditingSession(sessionItem);
    form.reset({
      name: sessionItem.name,
      start_date: sessionItem.start_date,
      end_date: sessionItem.end_date,
      status: sessionItem.status,
      school_id: sessionItem.school_id || DEFAULT_SCHOOL_ID,
    });
    setIsSessionDialogOpen(true);
  };

  const handleDeleteSession = async () => {
    if (!selectedSession) return;
    deleteSessionMutation.mutate(selectedSession.id);
  };

  const handleBulkStatusChange = async (sessions: Session[], status: string) => {
    console.log('Bulk status change:', sessions, status);
  };

  const onSubmit = async (data: SessionFormValues) => {
    console.log('Form submitted with data:', data);
    
    try {
      if (editingSession) {
        updateSessionMutation.mutate({
          id: editingSession.id,
          data: {
            name: data.name,
            start_date: data.start_date,
            end_date: data.end_date,
            status: data.status,
            school_id: data.school_id,
          }
        });
      } else {
        createSessionMutation.mutate({
          name: data.name,
          start_date: data.start_date,
          end_date: data.end_date,
          status: data.status,
          school_id: data.school_id,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  
  return (
    <PageTemplate title="Sessions" subtitle="Manage sessions">
      <PageHeader
        title="Sessions"
        description="Create and manage sessions"
        primaryAction={{
          label: "Add Session",
          onClick: handleCreateSession,
          icon: <Plus className="h-4 w-4 mr-2" />,
        }}
        actions={[
          <FilterDropdown
            key="filter"
            filters={
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name-filter">Session Name</Label>
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
        data={sessionsData || []}
        columns={columns}
        keyField="id"
        isLoading={isLoading}
        selectable={true}
        actions={actions}
        bulkActions={bulkActions}
        emptyState={
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No sessions found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new session to get started.
            </p>
            <Button className="mt-4" onClick={handleCreateSession}>
              <Plus className="h-4 w-4 mr-2" />
              Add Session
            </Button>
          </div>
        }
      />

      {/* Session Dialog */}
      <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingSession ? "Edit Session" : "Add New Session"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter session name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DatePickerWithMonthYear
                        date={field.value ? new Date(field.value) : undefined}
                        onDateChange={(date) => {
                          console.log('Start date selected:', date);
                          field.onChange(date ? date.toISOString().split('T')[0] : '');
                        }}
                        placeholder="Select start date"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DatePickerWithMonthYear
                        date={field.value ? new Date(field.value) : undefined}
                        onDateChange={(date) => {
                          console.log('End date selected:', date);
                          field.onChange(date ? date.toISOString().split('T')[0] : '');
                        }}
                        placeholder="Select end date"
                        disabled={(date) => {
                          const startDate = form.getValues('start_date');
                          return startDate ? date < new Date(startDate) : false;
                        }}
                        className="w-full"
                      />
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
                      value={field.value}
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
                  onClick={() => {
                    setIsSessionDialogOpen(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createSessionMutation.isPending || updateSessionMutation.isPending}
                >
                  {createSessionMutation.isPending || updateSessionMutation.isPending 
                    ? 'Saving...' 
                    : editingSession ? "Update Session" : "Create Session"
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
              <span className="font-semibold">{selectedSession?.name}</span>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. This will permanently delete the
              session and all associated data.
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
              onClick={handleDeleteSession}
              disabled={deleteSessionMutation.isPending}
            >
              {deleteSessionMutation.isPending ? 'Deleting...' : 'Delete Session'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default SessionsPage;
