
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bus, Plus, Settings } from 'lucide-react';

// Mock data for vehicles
const mockVehicles = [
  {
    id: '1',
    registration_number: 'KA-01-AB-1234',
    vehicle_type: 'Bus',
    capacity: 40,
    driver_name: 'John Doe',
    status: 'active',
    gps_tracking_enabled: true,
    remarks: 'School bus for north route'
  },
  {
    id: '2',
    registration_number: 'KA-01-CD-5678',
    vehicle_type: 'Van',
    capacity: 15,
    driver_name: 'Jane Smith',
    status: 'inactive',
    gps_tracking_enabled: false,
    remarks: 'Staff transportation'
  },
  {
    id: '3',
    registration_number: 'KA-01-EF-9012',
    vehicle_type: 'Bus',
    capacity: 35,
    driver_name: 'Robert Johnson',
    status: 'maintenance',
    gps_tracking_enabled: true,
    remarks: 'Under maintenance for brake issues'
  },
];

const Vehicles = () => {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);
  const [showEditVehicleDialog, setShowEditVehicleDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // Form state for new/edit vehicle
  const [formData, setFormData] = useState({
    registration_number: '',
    vehicle_type: 'Bus',
    capacity: 0,
    driver_name: '',
    status: 'active',
    gps_tracking_enabled: false,
    remarks: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddVehicle = () => {
    const newVehicle = {
      id: Date.now().toString(),
      ...formData
    };
    
    setVehicles(prev => [...prev, newVehicle]);
    setShowAddVehicleDialog(false);
    resetForm();
  };

  const handleEditVehicle = () => {
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === selectedVehicle.id ? { ...vehicle, ...formData } : vehicle
    );
    
    setVehicles(updatedVehicles);
    setShowEditVehicleDialog(false);
    setSelectedVehicle(null);
    resetForm();
  };

  const openEditDialog = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      registration_number: vehicle.registration_number,
      vehicle_type: vehicle.vehicle_type,
      capacity: vehicle.capacity,
      driver_name: vehicle.driver_name,
      status: vehicle.status,
      gps_tracking_enabled: vehicle.gps_tracking_enabled,
      remarks: vehicle.remarks
    });
    setShowEditVehicleDialog(true);
  };

  const resetForm = () => {
    setFormData({
      registration_number: '',
      vehicle_type: 'Bus',
      capacity: 0,
      driver_name: '',
      status: 'active',
      gps_tracking_enabled: false,
      remarks: ''
    });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'maintenance':
        return <Badge variant="warning">Maintenance</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const columns = [
    {
      id: 'registration_number',
      header: 'Registration No.',
      cell: (item) => <span className="font-medium">{item.registration_number}</span>,
      isSortable: true,
      sortKey: 'registration_number'
    },
    {
      id: 'vehicle_type',
      header: 'Type',
      cell: (item) => <span>{item.vehicle_type}</span>,
      isSortable: true,
      sortKey: 'vehicle_type'
    },
    {
      id: 'capacity',
      header: 'Capacity',
      cell: (item) => <span>{item.capacity}</span>,
      isSortable: true,
      sortKey: 'capacity'
    },
    {
      id: 'driver_name',
      header: 'Driver',
      cell: (item) => <span>{item.driver_name}</span>,
      isSortable: true,
      sortKey: 'driver_name'
    },
    {
      id: 'status',
      header: 'Status',
      cell: (item) => getStatusBadge(item.status),
      isSortable: true,
      sortKey: 'status'
    },
    {
      id: 'gps_tracking',
      header: 'GPS Tracking',
      cell: (item) => (
        <span>{item.gps_tracking_enabled ? 'Enabled' : 'Disabled'}</span>
      ),
      isSortable: true,
      sortKey: 'gps_tracking_enabled'
    },
    {
      id: 'remarks',
      header: 'Remarks',
      cell: (item) => <span className="truncate max-w-xs">{item.remarks}</span>,
      isSortable: false,
      size: "lg"
    },
  ];

  const actions = [
    {
      label: 'Edit Vehicle',
      onClick: (item) => openEditDialog(item),
    },
    {
      label: 'View Details',
      onClick: (item) => console.log('View details for:', item),
    },
    {
      label: 'Toggle GPS',
      onClick: (item) => {
        const updatedVehicles = vehicles.map(vehicle => 
          vehicle.id === item.id 
            ? { ...vehicle, gps_tracking_enabled: !vehicle.gps_tracking_enabled } 
            : vehicle
        );
        setVehicles(updatedVehicles);
      },
    },
  ];

  return (
    <PageTemplate title="Transportation Management" subtitle="Manage school transportation fleet">
      <PageHeader 
        title="Vehicles" 
        description="Manage school transportation vehicles"
        primaryAction={{
          label: "Add Vehicle",
          onClick: () => setShowAddVehicleDialog(true),
          icon: <Plus size={16} />
        }}
      />

      <Card className="mt-6">
        <CardContent className="pt-6">
          <DataTable
            data={vehicles}
            columns={columns}
            keyField="id"
            actions={actions}
          />
        </CardContent>
      </Card>

      {/* Add Vehicle Dialog */}
      <Dialog open={showAddVehicleDialog} onOpenChange={setShowAddVehicleDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>
              Enter the details for the new vehicle.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="registration_number">Registration Number</Label>
              <Input
                id="registration_number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="vehicle_type">Vehicle Type</Label>
              <Select 
                value={formData.vehicle_type} 
                onValueChange={(value) => handleSelectChange('vehicle_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="Car">Car</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="driver_name">Driver Name</Label>
              <Input
                id="driver_name"
                name="driver_name"
                value={formData.driver_name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="gps_tracking_enabled">GPS Tracking</Label>
              <Select 
                value={formData.gps_tracking_enabled ? "true" : "false"}
                onValueChange={(value) => handleSelectChange('gps_tracking_enabled', value === "true")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="GPS Tracking" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Enabled</SelectItem>
                  <SelectItem value="false">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddVehicleDialog(false)}>Cancel</Button>
            <Button onClick={handleAddVehicle}>Save Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={showEditVehicleDialog} onOpenChange={setShowEditVehicleDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>
              Update the details for this vehicle.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_registration_number">Registration Number</Label>
              <Input
                id="edit_registration_number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit_vehicle_type">Vehicle Type</Label>
              <Select 
                value={formData.vehicle_type} 
                onValueChange={(value) => handleSelectChange('vehicle_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="Car">Car</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit_capacity">Capacity</Label>
              <Input
                id="edit_capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit_driver_name">Driver Name</Label>
              <Input
                id="edit_driver_name"
                name="driver_name"
                value={formData.driver_name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit_status">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit_gps_tracking_enabled">GPS Tracking</Label>
              <Select 
                value={formData.gps_tracking_enabled ? "true" : "false"}
                onValueChange={(value) => handleSelectChange('gps_tracking_enabled', value === "true")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="GPS Tracking" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Enabled</SelectItem>
                  <SelectItem value="false">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit_remarks">Remarks</Label>
              <Textarea
                id="edit_remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditVehicleDialog(false)}>Cancel</Button>
            <Button onClick={handleEditVehicle}>Update Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default Vehicles;
