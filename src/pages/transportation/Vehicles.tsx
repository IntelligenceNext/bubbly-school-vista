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
} from '@/components/ui/dialog';
import { Vehicle, getVehicles, deleteVehicle, createOrUpdateVehicle } from '@/services/transportationService';
import FilterDropdown from '@/components/FilterDropdown';
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog';
import usePagination from '@/hooks/usePagination';

const Vehicles = () => {
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
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

  const { data: vehiclesData, isLoading, refetch } = useQuery({
    queryKey: ['vehicles', filters, page, pageSize],
    queryFn: async () => {
      const result = await getVehicles({
        ...filters,
        page,
        pageSize,
        status: filters.status as 'active' | 'inactive' | 'maintenance' | undefined,
      });
      setTotal(result.count);
      return result.data;
    },
  });

  const vehicles = vehiclesData || [];

  const getStatusBadge = (status: 'active' | 'inactive' | 'maintenance') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-500">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: Column<Vehicle>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (vehicle) => <div className="font-medium">{vehicle.name}</div>,
      isSortable: true,
      sortKey: 'name',
    },
    {
      id: 'registration',
      header: 'Registration',
      cell: (vehicle) => <div>{vehicle.registration_number}</div>,
      isSortable: true,
    },
    {
      id: 'type',
      header: 'Type',
      cell: (vehicle) => <div>{vehicle.vehicle_type}</div>,
    },
    {
      id: 'make_model',
      header: 'Make & Model',
      cell: (vehicle) => <div>{vehicle.make} {vehicle.model}</div>,
      size: 'md' as const,
    },
    {
      id: 'capacity',
      header: 'Capacity',
      cell: (vehicle) => <div>{vehicle.capacity} seats</div>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (vehicle) => getStatusBadge(vehicle.status),
    },
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (vehicle: Vehicle) => handleEditVehicle(vehicle),
    },
    {
      label: 'Delete',
      onClick: (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsDeleteDialogOpen(true);
      },
      variant: 'destructive' as const,
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

  const handleCreateVehicle = () => {
    setEditingVehicle(null);
    setIsVehicleDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsVehicleDialogOpen(true);
  };

  const handleDeleteVehicle = async () => {
    if (!selectedVehicle) return;
    
    const success = await deleteVehicle(selectedVehicle.id);
    if (success) {
      refetch();
      setIsDeleteDialogOpen(false);
      setSelectedVehicle(null);
    }
  };

  const handleSaveVehicle = async (data: Partial<Vehicle> & { 
    name: string, 
    registration_number: string,
  }) => {
    const success = await createOrUpdateVehicle(data, editingVehicle?.id);
    if (success) {
      setIsVehicleDialogOpen(false);
      refetch();
    }
  };

  return (
    <PageTemplate title="Transportation Vehicles" subtitle="Manage fleet of vehicles">
      <PageHeader
        title="Vehicles"
        description="Manage your transportation fleet"
        primaryAction={{
          label: "Add Vehicle",
          onClick: handleCreateVehicle,
          icon: <Plus className="h-4 w-4 mr-2" />,
        }}
        actions={[
          <FilterDropdown
            key="filter"
            filters={
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name-filter">Name/Registration</Label>
                  <Input
                    id="name-filter"
                    placeholder="Search by name or registration"
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
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Added Date Range</Label>
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
        data={vehicles}
        columns={columns}
        keyField="id"
        isLoading={isLoading}
        actions={actions}
        pagination={pagination}
        emptyState={
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No vehicles found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new vehicle to get started.
            </p>
            <Button className="mt-4" onClick={handleCreateVehicle}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        }
      />

      {/* Vehicle Form Dialog - Implementation left as a future exercise */}
      {isVehicleDialogOpen && (
        <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </DialogTitle>
            </DialogHeader>
            {/* Vehicle form to be implemented */}
            <div className="py-4">
              <p>Vehicle form placeholder - To be implemented.</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsVehicleDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingVehicle ? "Update Vehicle" : "Create Vehicle"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Vehicle"
        description={`Are you sure you want to delete the vehicle "${selectedVehicle?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteVehicle}
      />
    </PageTemplate>
  );
};

export default Vehicles;
