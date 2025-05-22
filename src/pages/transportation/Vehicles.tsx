import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import PageTemplate from '@/components/PageTemplate';
import DataTable, { Column } from '@/components/DataTable';
import PageHeader from '@/components/PageHeader';
import { Vehicle, getVehicles, deleteVehicle } from '@/services/transportationService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Plus, Trash2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import FilterDropdown from '@/components/FilterDropdown';
import usePagination from '@/hooks/usePagination';

const vehicleSchema = z.object({
  registration_number: z.string().min(2, "Registration number must be at least 2 characters"),
  vehicle_type: z.string().min(2, "Vehicle type must be at least 2 characters"),
  make: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  year: z.number().optional().nullable(),
  capacity: z.number().optional().nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

const VehiclesPage = () => {
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [filters, setFilters] = useState({
    registration_number: '',
    vehicle_type: '',
    status: '',
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const pagination = usePagination();
  const { page, pageSize, setTotal } = pagination;

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registration_number: '',
      vehicle_type: '',
      make: '',
      model: '',
      year: undefined,
      capacity: undefined,
      status: 'active',
    },
  });

  const { data: vehicles, isLoading, refetch } = useQuery({
    queryKey: ['vehicles', filters, page, pageSize],
    queryFn: async () => {
      const result = await getVehicles({
        ...filters,
        page,
        pageSize,
        status: filters.status as "active" | "inactive" | undefined,
      });
      setTotal(result.count);
      return result.data;
    },
  });

  const columns: Column<Vehicle>[] = [
    {
      id: 'registration',
      header: 'Registration',
      cell: (vehicle) => <div className="font-medium">{vehicle.registration_number}</div>,
      isSortable: true,
      sortKey: 'registration_number',
    },
    {
      id: 'type',
      header: 'Type',
      cell: (vehicle) => <div>{vehicle.vehicle_type}</div>,
      isSortable: true,
      size: "md" as const,
    },
    {
      id: 'make',
      header: 'Make',
      cell: (vehicle) => <div>{vehicle.make || '-'}</div>,
      visible: false,
    },
    {
      id: 'model',
      header: 'Model',
      cell: (vehicle) => <div>{vehicle.model || '-'}</div>,
      visible: false,
    },
    {
      id: 'year',
      header: 'Year',
      cell: (vehicle) => <div>{vehicle.year || '-'}</div>,
      visible: false,
    },
    {
      id: 'capacity',
      header: 'Capacity',
      cell: (vehicle) => <div>{vehicle.capacity || '-'}</div>,
      visible: false,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (vehicle) => (
        <Label className='capitalize' variant={vehicle.status === 'active' ? 'success' : 'secondary'}>
          {vehicle.status}
        </Label>
      ),
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

  const bulkActions = [
    // {
    //   label: 'Activate',
    //   onClick: (vehicles: Vehicle[]) => handleBulkStatusChange(vehicles, 'active'),
    // },
    // {
    //   label: 'Deactivate',
    //   onClick: (vehicles: Vehicle[]) => handleBulkStatusChange(vehicles, 'inactive'),
    // },
  ];

  const applyFilters = () => {
    const active: string[] = [];
    if (filters.registration_number) active.push('registration_number');
    if (filters.vehicle_type) active.push('vehicle_type');
    if (filters.status) active.push('status');
    
    setActiveFilters(active);
    refetch();
  };

  const clearFilters = () => {
    setFilters({
      registration_number: '',
      vehicle_type: '',
      status: '',
    });
    setActiveFilters([]);
    refetch();
  };

  const handleCreateVehicle = () => {
    setEditingVehicle(null);
    form.reset({
      registration_number: '',
      vehicle_type: '',
      make: '',
      model: '',
      year: undefined,
      capacity: undefined,
      status: 'active',
    });
    setIsVehicleDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    form.reset({
      registration_number: vehicle.registration_number,
      vehicle_type: vehicle.vehicle_type,
      make: vehicle.make || '',
      model: vehicle.model || '',
      year: vehicle.year || undefined,
      capacity: vehicle.capacity || undefined,
      status: vehicle.status,
    });
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

  // const handleBulkStatusChange = async (vehicles: Vehicle[], status: 'active' | 'inactive') => {
  //   const vehicleIds = vehicles.map(vehicle => vehicle.id);
  //   const success = await bulkUpdateVehicleStatus(vehicleIds, status);
  //   if (success) {
  //     refetch();
  //   }
  // };

  const onSubmit = async (data: VehicleFormValues) => {
    try {
      if (editingVehicle) {
        // Update existing vehicle
        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase
          .from('transportation_vehicles')
          .update({
            registration_number: data.registration_number,
            vehicle_type: data.vehicle_type,
            make: data.make,
            model: data.model,
            year: data.year,
            capacity: data.capacity,
            status: data.status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingVehicle.id);

        if (error) throw error;
        
        toast({
          title: 'Vehicle updated',
          description: `${data.registration_number} has been updated successfully.`,
        });
      } else {
        // Create new vehicle
        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase
          .from('transportation_vehicles')
          .insert({
            registration_number: data.registration_number,
            vehicle_type: data.vehicle_type,
            make: data.make,
            model: data.model,
            year: data.year,
            capacity: data.capacity,
            status: data.status,
          });

        if (error) throw error;
        
        toast({
          title: 'Vehicle created',
          description: `${data.registration_number} has been created successfully.`,
        });
      }
      
      setIsVehicleDialogOpen(false);
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
    <PageTemplate title="Vehicles" subtitle="Manage all transportation vehicles">
      <PageHeader
        title="Vehicles"
        description="Create and manage vehicles for transportation"
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
                  <Label htmlFor="registration-filter">Registration Number</Label>
                  <Input
                    id="registration-filter"
                    placeholder="Search by registration"
                    value={filters.registration_number}
                    onChange={(e) => setFilters({ ...filters, registration_number: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle_type-filter">Vehicle Type</Label>
                  <Input
                    id="vehicle_type-filter"
                    placeholder="Search by vehicle type"
                    value={filters.vehicle_type}
                    onChange={(e) => setFilters({ ...filters, vehicle_type: e.target.value })}
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
        data={vehicles || []}
        columns={columns}
        keyField="id"
        isLoading={isLoading}
        selectable={false}
        actions={actions}
        bulkActions={bulkActions}
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

      {/* Vehicle Dialog */}
      <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="registration_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter registration number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicle_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter vehicle type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter make" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter model" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Enter year"
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) => {
                            const value = e.target.value === '' ? undefined : Number(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Enter capacity"
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) => {
                            const value = e.target.value === '' ? undefined : Number(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                  onClick={() => setIsVehicleDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingVehicle ? "Update Vehicle" : "Create Vehicle"}
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
              <span className="font-semibold">{selectedVehicle?.registration_number}</span>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. This will permanently delete the
              vehicle and all associated data.
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
              onClick={handleDeleteVehicle}
            >
              Delete Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default VehiclesPage;
