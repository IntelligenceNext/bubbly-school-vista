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
import { supabase } from '@/integrations/supabase/client';

const sessionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  start_date: z.date(),
  end_date: z.date(),
  is_current: z.boolean().default(false),
  status: z.enum(["active", "inactive"]).default("active"),
});

type SessionFormValues = z.infer<typeof sessionSchema>;

// Fix TypeScript errors with Supabase queries using type assertion
const getSessions = async () => {
  // Use type assertion to avoid TypeScript errors
  const { data, error } = await (supabase
    .from('sessions') as any)
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
};

const createSession = async (sessionData) => {
  // Use type assertion to avoid TypeScript errors
  const { data, error } = await (supabase
    .from('sessions') as any)
    .insert({
      school_id: sessionData.school_id,
      name: sessionData.name,
      start_date: sessionData.start_date,
      end_date: sessionData.end_date,
      is_current: sessionData.is_current,
      status: sessionData.status,
    });
    
  if (error) throw error;
  return data;
};

const updateSession = async (id: string, sessionData: any) => {
  try {
    const { data, error } = await (supabase
      .from('sessions') as any)
      .update(sessionData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating session:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
};

const deleteSession = async (id: string) => {
  try {
    const { data, error } = await (supabase
      .from('sessions') as any)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting session:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
};

const SessionsPage = () => {
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<any | null>(null);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    status: '',
    start_date_start: '',
    start_date_end: '',
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const pagination = usePagination();
  const { page, pageSize, setTotal } = pagination;

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: '',
      start_date: new Date(),
      end_date: new Date(),
      is_current: false,
      status: 'active',
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
      cell: (session) => <div className="font-medium">{session.name}</div>,
      isSortable: true,
      sortKey: 'name',
    },
    {
      id: 'start_date',
      header: 'Start Date',
      cell: (session) => <div>{format(new Date(session.start_date), 'MMM d, yyyy')}</div>,
    },
    {
      id: 'end_date',
      header: 'End Date',
      cell: (session) => <div>{format(new Date(session.end_date), 'MMM d, yyyy')}</div>,
    },
    {
      id: 'is_current',
      header: 'Current',
      cell: (session) => (
        <Badge variant={session.is_current ? 'success' : 'secondary'}>
          {session.is_current ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (session) => (
        <Badge variant={session.status === 'active' ? 'success' : 'secondary'}>
          {session.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'created_at',
      header: 'Created',
      cell: (session) => <div>{format(new Date(session.created_at), 'MMM d, yyyy')}</div>,
    },
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (session: any) => handleEditSession(session),
    },
    {
      label: 'Delete',
      onClick: (session: any) => {
        setSelectedSession(session);
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
    if (filters.start_date_start || filters.start_date_end) active.push('date');
    
    setActiveFilters(active);
    refetch();
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      status: '',
      start_date_start: '',
      start_date_end: '',
    });
    setActiveFilters([]);
    refetch();
  };

  const handleCreateSession = () => {
    setEditingSession(null);
    form.reset({
      name: '',
      start_date: new Date(),
      end_date: new Date(),
      is_current: false,
      status: 'active',
    });
    setIsSessionDialogOpen(true);
  };

  const handleEditSession = (session: any) => {
    setEditingSession(session);
    form.reset({
      name: session.name,
      start_date: new Date(session.start_date),
      end_date: new Date(session.end_date),
      is_current: session.is_current,
      status: session.status,
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
    // const sessionIds = sessions.map(session => session.id);
    // const success = await bulkUpdateSessionStatus(sessionIds, status);
    // if (success) {
    //   refetch();
    // }
  };

  const onSubmit = async (data: SessionFormValues) => {
    try {
      if (editingSession) {
        // Update existing session
        const updatedSession = await updateSession(editingSession.id, {
          name: data.name,
          start_date: data.start_date.toISOString(),
          end_date: data.end_date.toISOString(),
          is_current: data.is_current,
          status: data.status,
        });

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
        const newSession = await createSession({
          name: data.name,
          start_date: data.start_date.toISOString(),
          end_date: data.end_date.toISOString(),
          is_current: data.is_current,
          status: data.status,
        });

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
    <PageTemplate title="Sessions" subtitle="Manage all sessions in the system">
      <PageHeader
        title="Sessions"
        description="Create and manage sessions in the system"
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
                <div className="space-y-2">
                  <Label>Start Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.start_date_start ? (
                            format(new Date(filters.start_date_start), "PPP")
                          ) : (
                            <span>From date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.start_date_start ? new Date(filters.start_date_start) : undefined}
                          onSelect={(date) =>
                            setFilters({
                              ...filters,
                              start_date_start: date ? date.toISOString() : "",
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
                          {filters.start_date_end ? (
                            format(new Date(filters.start_date_end), "PPP")
                          ) : (
                            <span>To date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.start_date_end ? new Date(filters.start_date_end) : undefined}
                          onSelect={(date) =>
                            setFilters({
                              ...filters,
                              start_date_end: date ? date.toISOString() : "",
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
              <div className="grid grid-cols-2 gap-4">
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
                                format(field.value, "PPP")
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
                            selected={field.value}
                            onSelect={field.onChange}
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
                                format(field.value, "PPP")
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
                            selected={field.value}
                            onSelect={field.onChange}
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
              </div>
              <FormField
                control={form.control}
                name="is_current"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Current Session</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Is this the current active session?
                      </p>
                    </div>
                    <FormControl>
                      <Input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
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
