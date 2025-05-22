import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import PageTemplate from '@/components/PageTemplate';
import DataTable, { Column } from '@/components/DataTable';
import PageHeader from '@/components/PageHeader';
import { Route, getRoutes, deleteRoute, bulkUpdateRouteStatus } from '@/services/transportationService';
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
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import FilterDropdown from '@/components/FilterDropdown';
import usePagination from '@/hooks/usePagination';

const routeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
});

type RouteFormValues = z.infer<typeof routeSchema>;

const RoutesPage = () => {
  const [isRouteDialogOpen, setIsRouteDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
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

  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
    },
  });

  const { data: routes, isLoading, refetch } = useQuery({
    queryKey: ['routes', filters, page, pageSize],
    queryFn: async () => {
      const result = await getRoutes({
        ...filters,
        page,
        pageSize,
        status: filters.status as "active" | "inactive" | undefined,
      });
      setTotal(result.count);
      return result.data;
    },
  });

  // Let's fix the columns type to match the expected Column type
  const columns: Column<Route>[] = [
    {
      id: 'name',
      header: 'Route Name',
      cell: (route) => <div className="font-medium">{route.name}</div>,
      isSortable: true,
      sortKey: 'name',
    },
    {
      id: 'description',
      header: 'Description',
      cell: (route) => <div>{route.description || '-'}</div>,
      isSortable: false,
      size: "lg",
    },
    {
      id: 'status',
      header: 'Status',
      cell: (route) => (
        <Badge variant={route.status === 'active' ? 'success' : 'secondary'}>
          {route.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'created_at',
      header: 'Created',
      cell: (route) => <div>{format(new Date(route.created_at), 'MMM d, yyyy')}</div>,
    },
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (route: Route) => handleEditRoute(route),
    },
    {
      label: 'Delete',
      onClick: (route: Route) => {
        setSelectedRoute(route);
        setIsDeleteDialogOpen(true);
      },
      variant: 'destructive' as const,
    },
  ];

  const bulkActions = [
    {
      label: 'Activate',
      onClick: (routes: Route[]) => handleBulkStatusChange(routes, 'active'),
    },
    {
      label: 'Deactivate',
      onClick: (routes: Route[]) => handleBulkStatusChange(routes, 'inactive'),
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

  const handleCreateRoute = () => {
    setEditingRoute(null);
    form.reset({
      name: '',
      description: '',
      status: 'active',
    });
    setIsRouteDialogOpen(true);
  };

  const handleEditRoute = (route: Route) => {
    setEditingRoute(route);
    form.reset({
      name: route.name,
      description: route.description || '',
      status: route.status,
    });
    setIsRouteDialogOpen(true);
  };

  const handleDeleteRoute = async () => {
    if (!selectedRoute) return;
    
    const success = await deleteRoute(selectedRoute.id);
    if (success) {
      refetch();
      setIsDeleteDialogOpen(false);
      setSelectedRoute(null);
    }
  };

  const handleBulkStatusChange = async (routes: Route[], status: 'active' | 'inactive') => {
    const routeIds = routes.map(route => route.id);
    const success = await bulkUpdateRouteStatus(routeIds, status);
    if (success) {
      refetch();
    }
  };

  const onSubmit = async (data: RouteFormValues) => {
    try {
      if (editingRoute) {
        // Update existing route
        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase
          .from('transportation_routes')
          .update({
            name: data.name,
            description: data.description,
            status: data.status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingRoute.id);

        if (error) throw error;
        
        toast({
          title: 'Route updated',
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        // Create new route
        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase
          .from('transportation_routes')
          .insert({
            name: data.name,
            description: data.description,
            status: data.status,
          });

        if (error) throw error;
        
        toast({
          title: 'Route created',
          description: `${data.name} has been created successfully.`,
        });
      }
      
      setIsRouteDialogOpen(false);
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
    <PageTemplate title="Routes" subtitle="Manage transportation routes">
      <PageHeader
        title="Routes"
        description="Create and manage transportation routes"
        primaryAction={{
          label: "Add Route",
          onClick: handleCreateRoute,
          icon: <Plus className="h-4 w-4 mr-2" />,
        }}
        actions={[
          <FilterDropdown
            key="filter"
            filters={
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name-filter">Route Name</Label>
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
        data={routes}
        columns={[
          {
            id: 'name',
            header: 'Route Name',
            cell: (route) => <div className="font-medium">{route.name}</div>,
            isSortable: true,
            sortKey: 'name',
          },
          {
            id: 'description',
            header: 'Description',
            cell: (route) => <div>{route.description}</div>,
            isSortable: false,
            size: "lg",
          },
          {
            id: 'status',
            header: 'Status',
            cell: (route) => (
              <Badge variant={route.status === 'active' ? 'success' : 'secondary'}>
                {route.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            ),
          },
          {
            id: 'created_at',
            header: 'Created',
            cell: (route) => <div>{format(new Date(route.created_at), 'MMM d, yyyy')}</div>,
          },
        ]}
        keyField="id"
        isLoading={isLoading}
        selectable={true}
        actions={actions}
        bulkActions={bulkActions}
        emptyState={
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No routes found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new route to get started.
            </p>
            <Button className="mt-4" onClick={handleCreateRoute}>
              <Plus className="h-4 w-4 mr-2" />
              Add Route
            </Button>
          </div>
        }
      />

      {/* Route Dialog */}
      <Dialog open={isRouteDialogOpen} onOpenChange={setIsRouteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingRoute ? "Edit Route" : "Add New Route"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Route Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter route name" {...field} />
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
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRouteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRoute ? "Update Route" : "Create Route"}
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
              <span className="font-semibold">{selectedRoute?.name}</span>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. This will permanently delete the
              route and all associated data.
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
              onClick={handleDeleteRoute}
            >
              Delete Route
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default RoutesPage;
