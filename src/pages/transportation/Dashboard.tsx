import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart } from '@/components/ui/LineChart';
import { BarChart } from '@/components/ui/BarChart';
import { Bus, MapPin, Route, Users } from 'lucide-react';

const Dashboard = () => {
  // Summary statistics
  const summaryStats = {
    activeVehicles: 8,
    activeRoutes: 5,
    totalDrivers: 10,
    totalStudents: 320
  };

  // Mock data for charts
  const monthlyDistanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Distance Traveled (km)',
        data: [1200, 1350, 1280, 1400, 1540, 1620],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      }
    ],
  };

  const vehicleMaintenanceData = {
    labels: ['Bus 1', 'Bus 2', 'Bus 3', 'Van 1', 'Van 2'],
    datasets: [
      {
        label: 'Cost (USD)',
        data: [320, 240, 400, 180, 120],
        backgroundColor: '#10b981',
      }
    ],
  };

  const routeOccupancyData = {
    labels: ['North', 'South', 'East', 'West', 'Central'],
    datasets: [
      {
        label: 'Students',
        data: [45, 38, 62, 35, 42],
        backgroundColor: '#f59e0b',
      },
      {
        label: 'Capacity',
        data: [50, 50, 80, 40, 50],
        backgroundColor: '#a3a3a3',
      }
    ],
  };

  // Recent events
  const recentEvents = [
    { id: 1, type: 'maintenance', vehicle: 'Bus 1', description: 'Regular maintenance completed', date: '2025-05-20' },
    { id: 2, type: 'delay', route: 'North Route', description: 'Delayed by 15 minutes due to traffic', date: '2025-05-21' },
    { id: 3, type: 'driver', name: 'John Doe', description: 'New driver assigned to East Route', date: '2025-05-21' },
    { id: 4, type: 'update', route: 'South Route', description: 'Added new stop at Market Square', date: '2025-05-22' },
  ];

  // Driver status
  const driverStatus = [
    { id: 1, name: 'John Doe', route: 'North Route', status: 'active', lastLocation: 'Central Park' },
    { id: 2, name: 'Jane Smith', route: 'South Route', status: 'active', lastLocation: 'City Center' },
    { id: 3, name: 'Robert Johnson', route: 'East Route', status: 'inactive', lastLocation: 'N/A' },
    { id: 4, name: 'Emily Brown', route: 'West Route', status: 'active', lastLocation: 'West Market' },
  ];

  return (
    <PageTemplate title="Transportation Management" subtitle="Overview of school transportation">
      <PageHeader 
        title="Transportation Dashboard" 
        description="Real-time metrics and key performance indicators for the school transportation system"
      />

      <div className="mt-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.activeVehicles}</div>
              <p className="text-xs text-muted-foreground mt-1">2 under maintenance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
              <Route className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.activeRoutes}</div>
              <p className="text-xs text-muted-foreground mt-1">Covering 45 stops</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drivers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalDrivers}</div>
              <p className="text-xs text-muted-foreground mt-1">8 active today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">Using transportation services</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Distance Traveled</CardTitle>
              <CardDescription>Total kilometers covered by all vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart 
                  data={monthlyDistanceData} 
                  index={0}
                  categories={["Distance"]}
                  colors={["#3b82f6"]}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Maintenance Costs</CardTitle>
              <CardDescription>Maintenance expenses per vehicle (Last 30 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart 
                  data={vehicleMaintenanceData}
                  index={0}
                  categories={["Maintenance"]}
                  colors={["#10b981"]}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Route Occupancy</CardTitle>
              <CardDescription>Current students vs. capacity by route</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart 
                  data={routeOccupancyData}
                  index={0}
                  categories={["Occupancy"]}
                  colors={["#f59e0b", "#a3a3a3"]}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Driver Status and Recent Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Driver Status</CardTitle>
              <CardDescription>Current location of drivers on routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {driverStatus.map(driver => (
                  <div key={driver.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm text-muted-foreground">{driver.route}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 text-right">
                        {driver.status === 'active' ? (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-sm">{driver.lastLocation}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not on route</span>
                        )}
                      </div>
                      <Badge 
                        variant={driver.status === 'active' ? 'success' : 'secondary'}
                      >
                        {driver.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Transportation Events</CardTitle>
              <CardDescription>Latest updates from the transportation system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map(event => (
                  <div key={event.id} className="flex border-b pb-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      {event.type === 'maintenance' && <Bus className="h-6 w-6 text-blue-500" />}
                      {event.type === 'delay' && <Route className="h-6 w-6 text-amber-500" />}
                      {event.type === 'driver' && <Users className="h-6 w-6 text-green-500" />}
                      {event.type === 'update' && <MapPin className="h-6 w-6 text-purple-500" />}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">
                          {event.vehicle || event.route || event.name}
                        </p>
                        <p className="text-xs text-muted-foreground ml-2">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm mt-1">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Dashboard;
