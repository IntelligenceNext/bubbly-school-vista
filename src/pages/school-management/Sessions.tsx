
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import PageTemplate from '@/components/PageTemplate';
import DataTable, { Column } from '@/components/DataTable';
import PageHeader from '@/components/PageHeader';
import { Session, School, getSessions, deleteSession, getSchools } from '@/services/schoolManagementService';
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
import { CalendarIcon, CheckCircle, Plus, School2, Star } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import FilterDropdown from '@/components/FilterDropdown';
import usePagination from '@/hooks/usePagination';
import { Switch } from '@/components/ui/switch';
import { FormDescription } from '@/components/ui/form';

const sessionSchema = z.object({
  school_id: z.string().min(1, "School is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date({
    required_error: "End date is required",
  }),
  is_current: z.boolean().default(false),
  is_active: z.boolean().default(true),
}).refine((data) => {
  return data.start_date <= data.end_date;
}, {
  message: "End date must be after start date",
  path: ["end_date"],
});

type SessionFormValues = z.infer<typeof sessionSchema>;

const SessionsPage = () => {
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [filters, setFilters] = useState({
    school_id: '',
    is_current: undefined as boolean | undefined,
    is_active: undefined as boolean | undefined,
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const pagination = usePagination();
  const { page, pageSize, setTotal } = pagination;

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      school_id: '',
      name: '',
      start_date: undefined,
      end_date: undefined,
      is_current: false,
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

  const { data: sessionsData, isLoading, refetch } = useQuery({
    queryKey: ['sessions', filters, page, pageSize],
    queryFn: async () => {
      const result = await getSessions({
        ...filters,
        page,
        pageSize,
      });
      setTotal(result.count);
      return result.data;
    },
  });

  const columns: Column<Session & { schools: { name: string } }>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (session) => (
        <div className="font-medium flex items-center">
          {session.name}
          {session.is_current && (
            <Badge variant="outline" className="ml-2 border-green-500">
              <Star className="h-3 w-3 mr-1 fill-green-500 text-green-500" />
              Current
            </Badge>
          )}
        </div>
      ),
      isSortable: true,
      sortKey: 'name',
    },
    {
      id: 'school',
      header: 'School',
      cell: (session) => (
        <div className="flex items-center">
          <School2 className="h-4 w-4 mr-2 text-muted-foreground" />
          {session.schools?.name || '—'}
        </div>
      ),
    },
    {
      id: 'date_range',
      header: 'Date Range',
      cell: (session) => (
        <div>
          {format(new Date(session.start_date), 'MMM d, yyyy')} - {format(new Date(session.end_date), 'MMM d, yyyy')}
        </div>
      ),
    },
    {
      id: 'is_active',
      header: 'Status',
      cell: (session) => (
        <Badge variant={session.is_active ? 'success' : 'secondary'}>
          {session.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (session: Session & { schools: { name: string } }) => handleEditSession(session),
    },
    {
      label: 'Delete',
      onClick: (session: Session & { schools: { name: string } }) => {
        setSelectedSession(session);
        setIsDeleteDialogOpen(true);
      },
      variant: 'destructive' as const,
    },
  ];

  const applyFilters = () => {
    const active: string[] = [];
    if (filters.school_id) active.push('school');
    if (filters.is_current !== undefined) active.push('current');
    if (filters.is_active !== undefined) active.push('status');
    
    setActiveFilters(active);
    refetch();
  };

  const clearFilters = () => {
    setFilters({
      school_id: '',
      is_current: undefined,
      is_active: undefined,
    });
    setActiveFilters([]);
    refetch();
  };

  const handleCreateSession = () => {
    setEditingSession(null);
    form.reset({
      school_id: '',
      name: '',
      start_date: undefined,
      end_date: undefined,
      is_current: false,
      is_active: true,
    });
    setIsSessionDialogOpen(true);
  };

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    form.reset({
      school_id: session.school_id,
      name: session.name,
      start_date: new Date(session.start_date),
      end_date: new Date(session.end_date),
      is_current: session.is_current,
      is_active: session.is_active,
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

  const onSubmit = async (data: SessionFormValues) => {
    try {
      if (editingSession) {
        // Update existing session
        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase
          .from('sessions')
          .update({
            school_id: data.school_id,
            name: data.name,
            start_date: data.start_date.toISOString().split('T')[0],
            end_date: data.end_date.toISOString().split('T')[0],
            is_current: data.is_current,
            is_active: data.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingSession.id);

        if (error) throw error;
        
        toast({
          title: 'Session updated',
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        // Create new session
        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase
          .from('sessions')
          .insert({
            school_id: data.school_id,
            name: data.name,
            start_date: data.start_date.toISOString().split('T')[0],
            end_date: data.end_date.toISOString().split('T')[0],
            is_current: data.is_current,
            is_active: data.is_active,
          });

        if (error) throw error;
        
        toast({
          title: 'Session created',
          description: `${data.name} has been created successfully.`,
        });
      }
      
      setIsSessionDialogOpen(false);
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
    <PageTemplate title="Sessions" subtitle="Manage academic sessions">
      <PageHeader
        title="Academic Sessions"
        description="Create and manage academic sessions for each school"
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
                  <Label htmlFor="current-filter">Current Session</Label>
                  <Select
                    value={filters.is_current !== undefined ? filters.is_current.toString() : ""}
                    onValueChange={(value) => setFilters({ 
                      ...filters, 
                      is_current: value === "" ? undefined : value === "true" 
                    })}
                  >
                    <SelectTrigger id="current-filter">
                      <SelectValue placeholder="All sessions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="true">Current</SelectItem>
                      <SelectItem value="false">Not Current</SelectItem>
                    </SelectContent>
                  </Select>
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
        data={sessionsData || []}
        columns={columns}
        keyField="id"
        isLoading={isLoading}
        selectable={true}
        actions={actions}
        emptyState={
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No sessions found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new academic session to get started.
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
                    <FormLabel>Session Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2025-2026 Academic Year" {...field} />
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={
                                "w-full pl-3 text-left font-normal"
                              }
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
                              date < new Date("1900-01-01")
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
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={
                                "w-full pl-3 text-left font-normal"
                              }
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
                              date < new Date("1900-01-01")
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
              <div className="space-y-3 pt-2">
                <FormField
                  control={form.control}
                  name="is_current"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Current Session</FormLabel>
                        <FormDescription>
                          Mark if this is the current academic session
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
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          Mark if this session is currently active
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
              </div>
              <DialogFooter className="mt-6">
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
              academic session and all associated data.
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
