
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
import { Map, MapPin, Plus, Route } from 'lucide-react';

// Mock data for routes
const mockRoutes = [
  {
    id: '1',
    name: 'North Route',
    start_location: 'School Campus',
    end_location: 'North Suburb',
    distance_km: 12.5,
    expected_duration: '45 min',
    vehicle_id: '1',
    vehicle_name: 'KA-01-AB-1234 (Bus)',
    driver_id: '1',
    driver_name: 'John Doe',
    stops: [
      { stop_name: 'School Campus', stop_time: '07:00 AM', latitude: 12.9716, longitude: 77.5946 },
      { stop_name: 'Market Circle', stop_time: '07:15 AM', latitude: 12.9815, longitude: 77.6089 },
      { stop_name: 'Central Park', stop_time: '07:30 AM', latitude: 12.9898, longitude: 77.6192 },
      { stop_name: 'North Suburb', stop_time: '07:45 AM', latitude: 13.0012, longitude: 77.6297 }
    ]
  },
  {
    id: '2',
    name: 'South Route',
    start_location: 'School Campus',
    end_location: 'South Residential Area',
    distance_km: 8.3,
    expected_duration: '30 min',
    vehicle_id: '2',
    vehicle_name: 'KA-01-CD-5678 (Van)',
    driver_id: '2',
    driver_name: 'Jane Smith',
    stops: [
      { stop_name: 'School Campus', stop_time: '07:00 AM', latitude: 12.9716, longitude: 77.5946 },
      { stop_name: 'City Center', stop_time: '07:10 AM', latitude: 12.9625, longitude: 77.5871 },
      { stop_name: 'Downtown', stop_time: '07:20 AM', latitude: 12.9532, longitude: 77.5793 },
      { stop_name: 'South Residential Area', stop_time: '07:30 AM', latitude: 12.9447, longitude: 77.5701 }
    ]
  }
];

const Routes = () => {
  const [routes, setRoutes] = useState(mockRoutes);
  const [showAddRouteDialog, setShowAddRouteDialog] = useState(false);
  const [showEditRouteDialog, setShowEditRouteDialog] = useState(false);
  const [showRouteDetailsDialog, setShowRouteDetailsDialog] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  
  // Form state for new/edit route
  const [formData, setFormData] = useState({
    name: '',
    start_location: '',
    end_location: '',
    distance_km: 0,
    expected_duration: '',
    vehicle_id: '',
    vehicle_name: '',
    driver_id: '',
    driver_name: '',
    stops: [{ stop_name: '', stop_time: '', latitude: 0, longitude: 0 }]
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

  const handleStopChange = (index, field, value) => {
    const updatedStops = [...formData.stops];
    updatedStops[index] = { ...updatedStops[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      stops: updatedStops
    }));
  };

  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, { stop_name: '', stop_time: '', latitude: 0, longitude: 0 }]
    }));
  };

  const removeStop = (index) => {
    if (formData.stops.length > 1) {
      const updatedStops = formData.stops.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        stops: updatedStops
      }));
    }
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
      start_location: route.start_location,
      end_location: route.end_location,
      distance_km: route.distance_km,
      expected_duration: route.expected_duration,
      vehicle_id: route.vehicle_id,
      vehicle_name: route.vehicle_name,
      driver_id: route.driver_id,
      driver_name: route.driver_name,
      stops: [...route.stops]
    });
    setShowEditRouteDialog(true);
  };

  const openDetailsDialog = (route) => {
    setSelectedRoute(route);
    setShowRouteDetailsDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      start_location: '',
      end_location: '',
      distance_km: 0,
      expected_duration: '',
      vehicle_id: '',
      vehicle_name: '',
      driver_id: '',
      driver_name: '',
      stops: [{ stop_name: '', stop_time: '', latitude: 0, longitude: 0 }]
    });
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
      id: 'locations',
      header: 'Route Path',
      cell: (item) => (
        <div>
          <div className="text-sm">{item.start_location}</div>
          <div className="text-xs text-gray-500">to</div>
          <div className="text-sm">{item.end_location}</div>
        </div>
      ),
      isSortable: false,
      size: "md"
    },
    {
      id: 'stops',
      header: 'Stops',
      cell: (item) => <span>{item.stops.length}</span>,
      isSortable: true,
      sortKey: 'stops.length'
    },
    {
      id: 'distance',
      header: 'Distance',
      cell: (item) => <span>{item.distance_km} km</span>,
      isSortable: true,
      sortKey: 'distance_km'
    },
    {
      id: 'duration',
      header: 'Duration',
      cell: (item) => <span>{item.expected_duration}</span>,
      isSortable: true,
      sortKey: 'expected_duration'
    },
    {
      id: 'vehicle',
      header: 'Vehicle',
      cell: (item) => <span>{item.vehicle_name}</span>,
      isSortable: true,
      sortKey: 'vehicle_name'
    },
    {
      id: 'driver',
      header: 'Driver',
      cell: (item) => <span>{item.driver_name}</span>,
      isSortable: true,
      sortKey: 'driver_name'
    },
  ];

  const actions = [
    {
      label: 'View Details',
      onClick: (item) => openDetailsDialog(item),
    },
    {
      label: 'Edit Route',
      onClick: (item) => openEditDialog(item),
    },
  ];

  return (
    <PageTemplate title="Transportation Management" subtitle="Manage school transportation routes">
      <PageHeader 
        title="Routes" 
        description="Configure transportation routes and stops"
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
      <Dialog 
        open={showAddRouteDialog} 
        onOpenChange={setShowAddRouteDialog}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Route</DialogTitle>
            <DialogDescription>
              Enter the details for the new transportation route.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="expected_duration">Expected Duration</Label>
                <Input
                  id="expected_duration"
                  name="expected_duration"
                  value={formData.expected_duration}
                  onChange={handleInputChange}
                  placeholder="e.g. 45 min"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_location">Start Location</Label>
                <Input
                  id="start_location"
                  name="start_location"
                  value={formData.start_location}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="end_location">End Location</Label>
                <Input
                  id="end_location"
                  name="end_location"
                  value={formData.end_location}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="distance_km">Distance (km)</Label>
                <Input
                  id="distance_km"
                  name="distance_km"
                  type="number"
                  step="0.1"
                  value={formData.distance_km}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="vehicle_name">Assigned Vehicle</Label>
                <Select 
                  value={formData.vehicle_id}
                  onValueChange={(value) => {
                    // Simulate getting vehicle name based on ID
                    const vehicleName = value === '1' ? 'KA-01-AB-1234 (Bus)' : 
                                        value === '2' ? 'KA-01-CD-5678 (Van)' : '';
                    handleSelectChange('vehicle_id', value);
                    handleSelectChange('vehicle_name', vehicleName);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">KA-01-AB-1234 (Bus)</SelectItem>
                    <SelectItem value="2">KA-01-CD-5678 (Van)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="driver_name">Assigned Driver</Label>
              <Select 
                value={formData.driver_id}
                onValueChange={(value) => {
                  // Simulate getting driver name based on ID
                  const driverName = value === '1' ? 'John Doe' : 
                                     value === '2' ? 'Jane Smith' : '';
                  handleSelectChange('driver_id', value);
                  handleSelectChange('driver_name', driverName);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">John Doe</SelectItem>
                  <SelectItem value="2">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Route Stops</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addStop}
                >
                  <Plus size={16} className="mr-1" />
                  Add Stop
                </Button>
              </div>
              
              {formData.stops.map((stop, index) => (
                <div key={index} className="grid gap-4 p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Stop {index + 1}</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeStop(index)}
                      disabled={formData.stops.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Stop Name</Label>
                      <Input
                        value={stop.stop_name}
                        onChange={(e) => handleStopChange(index, 'stop_name', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Stop Time</Label>
                      <Input
                        value={stop.stop_time}
                        onChange={(e) => handleStopChange(index, 'stop_time', e.target.value)}
                        placeholder="e.g. 07:45 AM"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Latitude</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={stop.latitude}
                        onChange={(e) => handleStopChange(index, 'latitude', parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Longitude</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={stop.longitude}
                        onChange={(e) => handleStopChange(index, 'longitude', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRouteDialog(false)}>Cancel</Button>
            <Button onClick={handleAddRoute}>Save Route</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Route Dialog */}
      <Dialog 
        open={showEditRouteDialog} 
        onOpenChange={setShowEditRouteDialog}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
            <DialogDescription>
              Update the details for this transportation route.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="edit_expected_duration">Expected Duration</Label>
                <Input
                  id="edit_expected_duration"
                  name="expected_duration"
                  value={formData.expected_duration}
                  onChange={handleInputChange}
                  placeholder="e.g. 45 min"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_start_location">Start Location</Label>
                <Input
                  id="edit_start_location"
                  name="start_location"
                  value={formData.start_location}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit_end_location">End Location</Label>
                <Input
                  id="edit_end_location"
                  name="end_location"
                  value={formData.end_location}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_distance_km">Distance (km)</Label>
                <Input
                  id="edit_distance_km"
                  name="distance_km"
                  type="number"
                  step="0.1"
                  value={formData.distance_km}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit_vehicle_name">Assigned Vehicle</Label>
                <Select 
                  value={formData.vehicle_id}
                  onValueChange={(value) => {
                    // Simulate getting vehicle name based on ID
                    const vehicleName = value === '1' ? 'KA-01-AB-1234 (Bus)' : 
                                        value === '2' ? 'KA-01-CD-5678 (Van)' : '';
                    handleSelectChange('vehicle_id', value);
                    handleSelectChange('vehicle_name', vehicleName);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">KA-01-AB-1234 (Bus)</SelectItem>
                    <SelectItem value="2">KA-01-CD-5678 (Van)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_driver_name">Assigned Driver</Label>
              <Select 
                value={formData.driver_id}
                onValueChange={(value) => {
                  // Simulate getting driver name based on ID
                  const driverName = value === '1' ? 'John Doe' : 
                                     value === '2' ? 'Jane Smith' : '';
                  handleSelectChange('driver_id', value);
                  handleSelectChange('driver_name', driverName);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">John Doe</SelectItem>
                  <SelectItem value="2">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Route Stops</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addStop}
                >
                  <Plus size={16} className="mr-1" />
                  Add Stop
                </Button>
              </div>
              
              {formData.stops.map((stop, index) => (
                <div key={index} className="grid gap-4 p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Stop {index + 1}</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeStop(index)}
                      disabled={formData.stops.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Stop Name</Label>
                      <Input
                        value={stop.stop_name}
                        onChange={(e) => handleStopChange(index, 'stop_name', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Stop Time</Label>
                      <Input
                        value={stop.stop_time}
                        onChange={(e) => handleStopChange(index, 'stop_time', e.target.value)}
                        placeholder="e.g. 07:45 AM"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Latitude</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={stop.latitude}
                        onChange={(e) => handleStopChange(index, 'latitude', parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Longitude</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={stop.longitude}
                        onChange={(e) => handleStopChange(index, 'longitude', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditRouteDialog(false)}>Cancel</Button>
            <Button onClick={handleEditRoute}>Update Route</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Route Details Dialog */}
      <Dialog 
        open={showRouteDetailsDialog} 
        onOpenChange={setShowRouteDetailsDialog}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Route Details: {selectedRoute?.name}</DialogTitle>
            <DialogDescription>
              Comprehensive information about this transportation route.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRoute && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Route Name</p>
                  <p className="font-medium">{selectedRoute.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expected Duration</p>
                  <p className="font-medium">{selectedRoute.expected_duration}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Start Location</p>
                  <p className="font-medium">{selectedRoute.start_location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Location</p>
                  <p className="font-medium">{selectedRoute.end_location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Distance</p>
                  <p className="font-medium">{selectedRoute.distance_km} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Stops</p>
                  <p className="font-medium">{selectedRoute.stops.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Assigned Vehicle</p>
                  <p className="font-medium">{selectedRoute.vehicle_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Driver</p>
                  <p className="font-medium">{selectedRoute.driver_name}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Route Stops</h3>
                <div className="space-y-4">
                  {selectedRoute.stops.map((stop, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{stop.stop_name}</h4>
                          <div className="flex text-sm text-gray-500 space-x-4">
                            <span>{stop.stop_time}</span>
                            <span>({stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">Map View (Placeholder)</p>
                <div className="bg-gray-100 h-48 flex items-center justify-center border rounded">
                  <div className="flex flex-col items-center text-gray-500">
                    <Map size={32} />
                    <p className="mt-2">Map view would appear here</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowRouteDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default Routes;
