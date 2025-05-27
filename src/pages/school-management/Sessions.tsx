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
import { Plus, Crown, CheckCircle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import FilterDropdown from '@/components/FilterDropdown';
import usePagination from '@/hooks/usePagination';
import { Session, getSessions, createSession, updateSession, deleteSession } from '@/services/sessionService';
import { evaluateSessionsStatus, evaluateSessionStatus, getCurrentActiveSession } from '@/utils/sessionUtils';

const sessionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  status: z.enum(["active", "inactive"]).default("active"),
  school_id: z.string().min(1, "School ID is required"),
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
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
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
      school_id: '',
    },
  });

  const { data: sessionsData, isLoading, refetch } = useQuery({
    queryKey: ['sessions', filters, page, pageSize],
    queryFn: async () => {
      console.log('Fetching sessions with auto-sync...');
      const sessions = await getSessions();
      console.log('Sessions fetched with synced status:', sessions);
      
      setTotal(sessions.length);
      return sessions;
    },
  });

  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: (data) => {
      console.log('Session created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: 'Success',
        description: data.status === 'active' 
          ? 'Session created and activated successfully. This is now the current session.'
          : 'Session created successfully.',
      });
      setIsSessionDialogOpen(false);
      setEditingSession(null);
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: 'Success',
        description: data?.status === 'active' 
          ? 'Session updated and activated successfully. This is now the current session.'
          : 'Session updated successfully.',
      });
      setIsSessionDialogOpen(false);
      setEditingSession(null);
      setIsActivateDialogOpen(false);
      setSelectedSession(null);
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

  // Define columns for the DataTable with enhanced status display
  const columns: Column<Session>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (sessionItem) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{sessionItem.name}</span>
          {sessionItem.is_current && (
            <Crown className="h-4 w-4 text-yellow-500" />
          )}
        </div>
      ),
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
      id: 'computed_status',
      header: 'Date Status',
      cell: (sessionItem) => {
        const computedStatus = evaluateSessionStatus(sessionItem);
        const badgeVariant = computedStatus === 'Active Session' 
          ? 'success' 
          : computedStatus === 'Inactive - Past Session' 
          ? 'secondary' 
          : 'outline';
        
        return (
          <div className="flex flex-col gap-1">
            <Badge variant={badgeVariant} className="text-xs">
              {computedStatus}
            </Badge>
            {computedStatus === 'Active Session' && sessionItem.status !== 'active' && (
              <span className="text-xs text-orange-600">Auto-syncing...</span>
            )}
          </div>
        );
      },
    },
    {
      id: 'status',
      header: 'System Status',
      cell: (sessionItem) => (
        <div className="flex items-center gap-2">
          <Badge variant={sessionItem.status === 'active' ? 'success' : 'secondary'}>
            {sessionItem.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
          {sessionItem.is_current && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
              Current
            </Badge>
          )}
        </div>
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
      label: 'Activate',
      onClick: (sessionItem: Session) => {
        setSelectedSession(sessionItem);
        setIsActivateDialogOpen(true);
      },
      isVisible: (sessionItem: Session) => sessionItem.status !== 'active',
    },
    {
      label: 'Deactivate',
      onClick: (sessionItem: Session) => handleDeactivateSession(sessionItem),
      isVisible: (sessionItem: Session) => sessionItem.status === 'active',
      variant: 'secondary' as const,
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
      label: 'Deactivate Selected',
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
    console.log('Opening create session dialog');
    setEditingSession(null);
    form.reset({
      name: '',
      start_date: '',
      end_date: '',
      status: 'active',
      school_id: 'temp',
    });
    setIsSessionDialogOpen(true);
  };

  const handleEditSession = (sessionItem: Session) => {
    setEditingSession(sessionItem);
    form.reset({
      name: sessionItem.name,
      start_date: sessionItem.start_date,
      end_date: sessionItem.end_date,
      status: sessionItem.status as 'active' | 'inactive',
      school_id: sessionItem.school_id,
    });
    setIsSessionDialogOpen(true);
  };

  const handleActivateSession = async () => {
    if (!selectedSession) return;
    
    updateSessionMutation.mutate({
      id: selectedSession.id,
      data: {
        status: 'active',
        is_active: true,
      }
    });
  };

  const handleDeactivateSession = async (sessionItem: Session) => {
    updateSessionMutation.mutate({
      id: sessionItem.id,
      data: {
        status: 'inactive',
        is_active: false,
      }
    });
  };

  const handleDeleteSession = async () => {
    if (!selectedSession) return;
    deleteSessionMutation.mutate(selectedSession.id);
  };

  const handleBulkStatusChange = async (sessions: Session[], status: string) => {
    console.log('Bulk status change:', sessions, status);
    for (const session of sessions) {
      await updateSessionMutation.mutateAsync({
        id: session.id,
        data: {
          status: status as 'active' | 'inactive',
          is_active: status === 'active',
        }
      });
    }
  };

  const onSubmit = async (data: SessionFormValues) => {
    console.log('Form submitted with data:', data);
    
    try {
      const sessionData = {
        ...data,
        school_id: editingSession ? editingSession.school_id : crypto.randomUUID(),
        is_active: data.status === 'active',
      };

      if (editingSession) {
        console.log('Updating session:', editingSession.id);
        await updateSessionMutation.mutateAsync({
          id: editingSession.id,
          data: {
            name: sessionData.name,
            start_date: sessionData.start_date,
            end_date: sessionData.end_date,
            status: sessionData.status,
            school_id: sessionData.school_id,
            is_active: sessionData.is_active,
          }
        });
      } else {
        console.log('Creating new session');
        await createSessionMutation.mutateAsync({
          name: sessionData.name,
          start_date: sessionData.start_date,
          end_date: sessionData.end_date,
          status: sessionData.status,
          school_id: sessionData.school_id,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleDateChange = (field: any, date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      field.onChange(formattedDate);
    } else {
      field.onChange('');
    }
  };

  const handleDialogClose = () => {
    setIsSessionDialogOpen(false);
    setEditingSession(null);
    form.reset({
      name: '',
      start_date: '',
      end_date: '',
      status: 'active',
      school_id: '',
    });
  };
  
  return (
    <PageTemplate title="Sessions" subtitle="Manage sessions">
      <PageHeader
        title="Sessions"
        description="Create and manage sessions. Sessions are automatically activated when their date range matches the current date."
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
      <Dialog open={isSessionDialogOpen} onOpenChange={handleDialogClose}>
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
                        onDateChange={(date) => handleDateChange(field, date)}
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
                        onDateChange={(date) => handleDateChange(field, date)}
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
                        <SelectItem value="active">Active (Will become current session)</SelectItem>
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
                  onClick={handleDialogClose}
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

      {/* Activate Confirmation Dialog */}
      <Dialog open={isActivateDialogOpen} onOpenChange={setIsActivateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Activate Session
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to activate{" "}
              <span className="font-semibold">{selectedSession?.name}</span>?
            </p>
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Activating this session will automatically:
              </p>
              <ul className="text-sm text-yellow-800 mt-1 ml-4 list-disc">
                <li>Deactivate all other sessions</li>
                <li>Make this session the current session</li>
                <li>All school data will be associated with this session</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsActivateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleActivateSession}
              disabled={updateSessionMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {updateSessionMutation.isPending ? 'Activating...' : 'Activate Session'}
            </Button>
          </DialogFooter>
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
            {selectedSession?.is_current && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> This is the current active session. Deleting it will affect all school operations.
                </p>
              </div>
            )}
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
