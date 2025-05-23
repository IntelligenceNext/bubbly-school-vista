import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import FilterDropdown from '@/components/FilterDropdown';
import usePagination from '@/hooks/usePagination';
import { cn } from '@/lib/utils';
import { Session, getSessions, createSession, updateSession, deleteSession } from '@/services/sessionService';

const sessionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  start_date: z.string(),
  end_date: z.string(),
  status: z.enum(["active", "inactive"]).default("active"),
  school_id: z.string().uuid(),
});

type SessionFormValues = z.infer<typeof sessionSchema>;

const SessionsPage = () => {
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    status: '',
  });
  const [activeFilters, setActiveFilters] = useState([]);

  const pagination = usePagination();
  const { page, pageSize, setTotal } = pagination;

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: '',
      start_date: '',
      end_date: '',
      status: 'active',
      school_id: 'your_school_id', // Replace with actual school ID
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

  const columns: Column<any>[] = [
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
      onClick: (sessionItem) => handleEditSession(sessionItem),
    },
    {
      label: 'Delete',
      onClick: (sessionItem) => {
        setSelectedSession(sessionItem);
        setIsDeleteDialogOpen(true);
      },
      variant: 'destructive' as const,
    },
  ];

  const bulkActions = [
    {
      label: 'Activate',
      onClick: (sessions: any[]) => handleBulkStatusChange(sessions, 'active'),
    },
    {
      label: 'Deactivate',
      onClick: (sessions: any[]) => handleBulkStatusChange(sessions, 'inactive'),
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
      school_id: 'your_school_id', // Replace with actual school ID
    });
    setIsSessionDialogOpen(true);
  };

  const handleEditSession = (sessionItem) => {
    setEditingSession(sessionItem);
    form.reset({
      name: sessionItem.name,
      start_date: sessionItem.start_date,
      end_date: sessionItem.end_date,
      status: sessionItem.status,
      school_id: sessionItem.school_id, // Replace with actual school ID
    });
    setIsSessionDialogOpen(true);
  };

  const handleDeleteSession = async () => {
    if (!selectedSession) return;
    
    const success = await deleteSession(selectedSession.id);
    if (success) {
      refetch();
      setIsDeleteDialogOpen(false);
      setSelectedSession(null);
    }
  };

  const handleBulkStatusChange = async (sessions: any[], status: 'active' | 'inactive') => {
    // Implement bulk status change logic here
  };

  const onSubmit = async (data: SessionFormValues) => {
    try {
      if (editingSession) {
        // Update existing session
        const updatedSession = await updateSession(editingSession.id, data);

        if (updatedSession) {
          toast({
            title: 'Session updated',
            description: `${data.name} has been updated successfully.`,
          });
          setIsSessionDialogOpen(false);
          refetch();
        }
      } else {
        // Create new session
        const newSession = await createSession(data);

        if (newSession) {
          toast({
            title: 'Session created',
            description: `${data.name} has been created successfully.`,
          });
          setIsSessionDialogOpen(false);
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString())}
                          disabled={(date) =>
                            date > new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString())}
                          disabled={(date) =>
                            date > new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSessionDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSession ? "Update Session" : "Create Session"}
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
            >
              Delete Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default SessionsPage;
