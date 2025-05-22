
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import PageTemplate from '@/components/PageTemplate';
import DataTable, { Column } from '@/components/DataTable';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Route, createOrUpdateRoute, deleteRoute, getRoutes, bulkUpdateRouteStatus } from '@/services/transportationService';
import FilterDropdown from '@/components/FilterDropdown';
import RouteForm from '@/components/transportation/RouteForm';
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog';
import usePagination from '@/hooks/usePagination';

const RoutesPage: React.FC = () => {
  const [isRouteDialogOpen, setIsRouteDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    status: '',
    created_at_start: '',
    created_at_end: '',
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const pagination = usePagination();
  const { page, pageSize, setTotal } = pagination;

  const { data: routesData, isLoading, refetch } = useQuery({
    queryKey: ['routes', filters, page, pageSize],
    queryFn: async () => {
      const result = await getRoutes({
        ...filters,
        page,
        pageSize,
        status: filters.status as 'active' | 'inactive' | undefined,
      });
      setTotal(result.count);
      return result.data;
    },
  });

  const routes = routesData || [];

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
      size: 'lg' as const,
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
    setIsRouteDialogOpen(true);
  };

  const handleEditRoute = (route: Route) => {
    setEditingRoute(route);
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
    const routeIds = routes.map((route) => route.id);
    const success = await bulkUpdateRouteStatus(routeIds, status);
    if (success) {
      refetch();
    }
  };

  const handleSaveRoute = async (data: Partial<Route> & { name: string }) => {
    const success = await createOrUpdateRoute(
      data,
      editingRoute?.id
    );
    
    if (success) {
      setIsRouteDialogOpen(false);
      refetch();
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
                      <SelectItem value="all-statuses">All</SelectItem>
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
        columns={columns}
        keyField="id"
        isLoading={isLoading}
        selectable={true}
        actions={actions}
        bulkActions={bulkActions}
        paginationState={pagination}
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

      {/* Route Form Dialog */}
      <Dialog open={isRouteDialogOpen} onOpenChange={setIsRouteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              {editingRoute ? "Edit Route" : "Add New Route"}
            </DialogTitle>
          </DialogHeader>
          <RouteForm 
            initialData={editingRoute}
            onSubmit={handleSaveRoute}
            onCancel={() => setIsRouteDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Route"
        description={`Are you sure you want to delete the route "${selectedRoute?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteRoute}
      />
    </PageTemplate>
  );
};

export default RoutesPage;
