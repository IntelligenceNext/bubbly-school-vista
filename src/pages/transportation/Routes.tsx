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
import { MapPin, Plus, Settings } from 'lucide-react';

// Mock data for routes
const mockRoutes = [
  {
    id: '1',
    name: 'North Route',
    vehicle: 'Bus 1',
    driver: 'John Doe',
    stops: 4,
    students: 35,
    distance: '12 km',
    duration: '45 min',
    status: 'active',
    description: 'Covers residential areas in the north'
  },
  {
    id: '2',
    name: 'South Route',
    vehicle: 'Van 2',
    driver: 'Jane Smith',
    stops: 5,
    students: 15,
    distance: '8 km',
    duration: '30 min',
    status: 'inactive',
    description: 'Services the downtown area'
  },
  {
    id: '3',
    name: 'East Route',
    vehicle: 'Bus 3',
    driver: 'Robert Johnson',
    stops: 6,
    students: 40,
    distance: '15 km',
    duration: '50 min',
    status: 'active',
    description: 'Connects the eastern suburbs'
  },
];

const Routes = () => {
  const [routes, setRoutes] = useState(mockRoutes);
  const [showAddRouteDialog, setShowAddRouteDialog] = useState(false);
  const [showEditRouteDialog, setShowEditRouteDialog] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  
  // Form state for new/edit route
  const [formData, setFormData] = useState({
    name: '',
    vehicle: '',
    driver: '',
    stops: 0,
    students: 0,
    distance: '',
    duration: '',
    status: 'active',
    description: ''
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

  const handleAddRoute = () => {
    const newRoute = {
      id: Date.now().toString(),
      ...formData
    };
    
    setRoutes(prev => [...prev, newRoute]);
    setShowAddRouteDialog(false);
    resetForm();
  };

  const handleEditRoute = () => {
    const updatedRoutes = routes.map(route => 
      route.id === selectedRoute.id ? { ...route, ...formData } : route
    );
    
    setRoutes(updatedRoutes);
    setShowEditRouteDialog(false);
    setSelectedRoute(null);
    resetForm();
  };

  const openEditDialog = (route) => {
    setSelectedRoute(route);
    setFormData({
      name: route.name,
      vehicle: route.vehicle,
      driver: route.driver,
      stops: route.stops,
      students: route.students,
      distance: route.distance,
      duration: route.duration,
      status: route.status,
      description: route.description
    });
    setShowEditRouteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      vehicle: '',
      driver: '',
      stops: 0,
      students: 0,
      distance: '',
      duration: '',
      status: 'active',
      description: ''
    });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const columns = [
    {
      id: 'name',
      header: 'Route Name',
      cell: (item) => <span className="font-medium">{item.name}</span>,
      isSortable: true,
      sortKey: 'name'
    },
    {
      id: 'vehicle',
      header: 'Vehicle',
      cell: (item) => <span>{item.vehicle}</span>,
      isSortable: true,
      sortKey: 'vehicle'
    },
    {
      id: 'driver',
      header: 'Driver',
      cell: (item) => <span>{item.driver}</span>,
      isSortable: true,
      sortKey: 'driver'
    },
    {
      id: 'stops',
      header: 'Stops',
      cell: (item) => <span>{item.stops}</span>,
      isSortable: true,
      sortKey: 'stops'
    },
    {
      id: 'students',
      header: 'Students',
      cell: (item) => <span>{item.students}</span>,
      isSortable: true,
      sortKey: 'students'
    },
    {
      id: 'distance',
      header: 'Distance',
      cell: (item) => <span>{item.distance}</span>,
      isSortable: true,
      sortKey: 'distance'
    },
    {
      id: 'duration',
      header: 'Duration',
      cell: (item) => <span>{item.duration}</span>,
      isSortable: true,
      sortKey: 'duration'
    },
    {
      id: 'status',
      header: 'Status',
      cell: (item) => getStatusBadge(item.status),
      isSortable: true,
      sortKey: 'status'
    },
    {
      id: 'description',
      header: 'Description',
      cell: (item) => <span className="text-sm">{item.description}</span>,
      isSortable: false,
      size: "lg"
    },
  ];

  const actions = [
    {
      label: 'Edit Route',
      onClick: (item) => openEditDialog(item),
    },
    {
      label: 'View Details',
      onClick: (item) => console.log('View details for:', item),
    },
    {
      label: 'Toggle Status',
      onClick: (item) => {
        const updatedRoutes = routes.map(route => 
          route.id === item.id 
            ? { ...route, status: route.status === 'active' ? 'inactive' : 'active' } 
            : route
        );
        setRoutes(updatedRoutes);
      },
    },
  ];

  return (
    <PageTemplate title="Transportation Management" subtitle="Manage school transportation routes">
      <PageHeader 
        title="Routes" 
        description="Manage school transportation routes"
        primaryAction={{
          label: "Add Route",
          onClick: () => setShowAddRouteDialog(true),
          icon: <Plus size={16} />
        }}
      />

      <Card className="mt-6">
        <CardContent className="pt-6">
          <DataTable
            data={routes}
            columns={columns}
            keyField="id"
            actions={actions}
          />
        </CardContent>
      </Card>

      {/* Add Route Dialog */}
      <Dialog open={showAddRouteDialog} onOpenChange={setShowAddRouteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Route</DialogTitle>
            <DialogDescription>
              Enter the details for the new route.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Route Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Input
                id="vehicle"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="driver">Driver</Label>
              <Input
                id="driver"
                name="driver"
                value={formData.driver}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="stops">Stops</Label>
              <Input
                id="stops"
                name="stops"
                type="number"
                value={formData.stops}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="students">Students</Label>
              <Input
                id="students"
                name="students"
                type="number"
                value={formData.students}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="distance">Distance</Label>
              <Input
                id="distance"
                name="distance"
                value={formData.distance}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
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
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRouteDialog(false)}>Cancel</Button>
            <Button onClick={handleAddRoute}>Save Route</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Route Dialog */}
      <Dialog open={showEditRouteDialog} onOpenChange={setShowEditRouteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
            <DialogDescription>
              Update the details for this route.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_name">Route Name</Label>
              <Input
                id="edit_name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit_vehicle">Vehicle</Label>
              <Input
                id="edit_vehicle"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit_driver">Driver</Label>
              <Input
                id="edit_driver"
                name="driver"
                value={formData.driver}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit_stops">Stops</Label>
              <Input
                id="edit_stops"
                name="stops"
                type="number"
                value={formData.stops}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit_students">Students</Label>
              <Input
                id="edit_students"
                name="students"
                type="number"
                value={formData.students}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit_distance">Distance</Label>
              <Input
                id="edit_distance"
                name="distance"
                value={formData.distance}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit_duration">Duration</Label>
              <Input
                id="edit_duration"
                name="duration"
                value={formData.duration}
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
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditRouteDialog(false)}>Cancel</Button>
            <Button onClick={handleEditRoute}>Update Route</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default Routes;
