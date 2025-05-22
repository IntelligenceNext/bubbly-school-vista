import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import DataTable from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { BarChart } from '@/components/ui/BarChart';
import { Bus, Route, User } from 'lucide-react';

const Report = () => {
  const [activeTab, setActiveTab] = useState('vehicle-usage');
  const [filterMonth, setFilterMonth] = useState('may');
  
  // Mock data for reports
  const vehicleUsageData = [
    {
      id: '1',
      vehicle_number: 'KA-01-AB-1234',
      vehicle_type: 'Bus',
      total_km: 620,
      total_trips: 42,
      avg_occupancy: '85%',
      maintenance_count: 1,
      fuel_consumption: '120L',
      cost_per_km: '$0.45'
    },
    {
      id: '2',
      vehicle_number: 'KA-01-CD-5678',
      vehicle_type: 'Van',
      total_km: 380,
      total_trips: 38,
      avg_occupancy: '72%',
      maintenance_count: 0,
      fuel_consumption: '65L',
      cost_per_km: '$0.38'
    },
    {
      id: '3',
      vehicle_number: 'KA-01-EF-9012',
      vehicle_type: 'Bus',
      total_km: 540,
      total_trips: 36,
      avg_occupancy: '90%',
      maintenance_count: 1,
      fuel_consumption: '110L',
      cost_per_km: '$0.42'
    }
  ];

  const routePerformanceData = [
    {
      id: '1',
      route_name: 'North Route',
      avg_time: '43 min',
      variance: '+2 min',
      student_count: 35,
      punctuality: '92%',
      total_stops: 4,
      most_delayed_stop: 'Market Circle (avg. +3 min)',
      avg_rating: '4.2/5'
    },
    {
      id: '2',
      route_name: 'South Route',
      avg_time: '31 min',
      variance: '-1 min',
      student_count: 14,
      punctuality: '95%',
      total_stops: 4,
      most_delayed_stop: 'None',
      avg_rating: '4.5/5'
    },
    {
      id: '3',
      route_name: 'East Route',
      avg_time: '38 min',
      variance: '+5 min',
      student_count: 28,
      punctuality: '87%',
      total_stops: 5,
      most_delayed_stop: 'Town Hall (avg. +6 min)',
      avg_rating: '3.8/5'
    }
  ];

  const studentTransportData = [
    {
      id: '1',
      student_name: 'Alice Johnson',
      class: '10A',
      route: 'North Route',
      stop: 'Central Park',
      pickup_time: '07:30 AM',
      drop_time: '03:15 PM',
      attendance: '95%',
      fee_status: 'Paid'
    },
    {
      id: '2',
      student_name: 'Bob Smith',
      class: '9B',
      route: 'South Route',
      stop: 'Downtown',
      pickup_time: '07:20 AM',
      drop_time: '03:20 PM',
      attendance: '98%',
      fee_status: 'Paid'
    },
    {
      id: '3',
      student_name: 'Charlie Brown',
      class: '8C',
      route: 'East Route',
      stop: 'Town Hall',
      pickup_time: '07:25 AM',
      drop_time: '03:10 PM',
      attendance: '90%',
      fee_status: 'Pending'
    },
    {
      id: '4',
      student_name: 'Diana Ross',
      class: '10A',
      route: 'North Route',
      stop: 'Market Circle',
      pickup_time: '07:15 AM',
      drop_time: '03:15 PM',
      attendance: '92%',
      fee_status: 'Paid'
    },
    {
      id: '5',
      student_name: 'Edward Miller',
      class: '9A',
      route: 'East Route',
      stop: 'City Square',
      pickup_time: '07:15 AM',
      drop_time: '03:10 PM',
      attendance: '87%',
      fee_status: 'Overdue'
    }
  ];

  // Chart data for vehicle usage
  const vehicleUsageChartData = {
    labels: vehicleUsageData.map(v => v.vehicle_number),
    datasets: [
      {
        label: 'Total KM',
        data: vehicleUsageData.map(v => v.total_km),
        backgroundColor: '#4f46e5'
      },
      {
        label: 'Trips',
        data: vehicleUsageData.map(v => v.total_trips * 10), // Scaling for visualization
        backgroundColor: '#10b981'
      }
    ]
  };

  // Chart data for route performance
  const routePerformanceChartData = {
    labels: routePerformanceData.map(r => r.route_name),
    datasets: [
      {
        label: 'Students',
        data: routePerformanceData.map(r => r.student_count),
        backgroundColor: '#f59e0b'
      },
      {
        label: 'Punctuality (%)',
        data: routePerformanceData.map(r => parseInt(r.punctuality)),
        backgroundColor: '#3b82f6'
      }
    ]
  };

  // Chart data for student distribution
  const studentDistributionData = {
    labels: ['North Route', 'South Route', 'East Route', 'West Route'],
    datasets: [
      {
        label: 'Student Count',
        data: [35, 14, 28, 18],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
      }
    ]
  };

  // Column definitions for each report table
  const vehicleColumns = [
    {
      id: 'vehicle_number',
      header: 'Vehicle Number',
      cell: (item) => <span className="font-medium">{item.vehicle_number}</span>,
      isSortable: true,
      sortKey: 'vehicle_number'
    },
    {
      id: 'vehicle_type',
      header: 'Type',
      cell: (item) => <span>{item.vehicle_type}</span>,
      isSortable: true,
      sortKey: 'vehicle_type'
    },
    {
      id: 'total_km',
      header: 'Total KM',
      cell: (item) => <span>{item.total_km}</span>,
      isSortable: true,
      sortKey: 'total_km'
    },
    {
      id: 'total_trips',
      header: 'Trips',
      cell: (item) => <span>{item.total_trips}</span>,
      isSortable: true,
      sortKey: 'total_trips'
    },
    {
      id: 'avg_occupancy',
      header: 'Avg. Occupancy',
      cell: (item) => <span>{item.avg_occupancy}</span>,
      isSortable: true,
      sortKey: 'avg_occupancy'
    },
    {
      id: 'maintenance',
      header: 'Maintenance',
      cell: (item) => (
        <Badge variant={item.maintenance_count > 0 ? "warning" : "success"}>
          {item.maintenance_count}
        </Badge>
      ),
      isSortable: true,
      sortKey: 'maintenance_count'
    },
    {
      id: 'fuel',
      header: 'Fuel',
      cell: (item) => <span>{item.fuel_consumption}</span>,
      isSortable: true,
      sortKey: 'fuel_consumption'
    },
    {
      id: 'cost_per_km',
      header: 'Cost/KM',
      cell: (item) => <span>{item.cost_per_km}</span>,
      isSortable: true,
      sortKey: 'cost_per_km'
    }
  ];

  const routeColumns = [
    {
      id: 'route_name',
      header: 'Route',
      cell: (item) => <span className="font-medium">{item.route_name}</span>,
      isSortable: true,
      sortKey: 'route_name'
    },
    {
      id: 'avg_time',
      header: 'Avg. Time',
      cell: (item) => <span>{item.avg_time}</span>,
      isSortable: true,
      sortKey: 'avg_time'
    },
    {
      id: 'variance',
      header: 'Variance',
      cell: (item) => (
        <span className={item.variance.startsWith('+') ? 'text-amber-500' : 'text-green-500'}>
          {item.variance}
        </span>
      ),
      isSortable: true,
      sortKey: 'variance'
    },
    {
      id: 'student_count',
      header: 'Students',
      cell: (item) => <span>{item.student_count}</span>,
      isSortable: true,
      sortKey: 'student_count'
    },
    {
      id: 'punctuality',
      header: 'Punctuality',
      cell: (item) => (
        <span className={parseInt(item.punctuality) > 90 ? 'text-green-500' : 'text-amber-500'}>
          {item.punctuality}
        </span>
      ),
      isSortable: true,
      sortKey: 'punctuality'
    },
    {
      id: 'total_stops',
      header: 'Stops',
      cell: (item) => <span>{item.total_stops}</span>,
      isSortable: true,
      sortKey: 'total_stops'
    },
    {
      id: 'most_delayed_stop',
      header: 'Most Delayed Stop',
      cell: (item) => <span className="text-sm">{item.most_delayed_stop}</span>,
      isSortable: false,
      size: "md"
    },
    {
      id: 'avg_rating',
      header: 'Rating',
      cell: (item) => <span>{item.avg_rating}</span>,
      isSortable: true,
      sortKey: 'avg_rating'
    }
  ];

  const studentColumns = [
    {
      id: 'student_name',
      header: 'Student Name',
      cell: (item) => <span className="font-medium">{item.student_name}</span>,
      isSortable: true,
      sortKey: 'student_name'
    },
    {
      id: 'class',
      header: 'Class',
      cell: (item) => <span>{item.class}</span>,
      isSortable: true,
      sortKey: 'class'
    },
    {
      id: 'route',
      header: 'Route',
      cell: (item) => <span>{item.route}</span>,
      isSortable: true,
      sortKey: 'route'
    },
    {
      id: 'stop',
      header: 'Stop',
      cell: (item) => <span>{item.stop}</span>,
      isSortable: true,
      sortKey: 'stop'
    },
    {
      id: 'pickup_time',
      header: 'Pickup',
      cell: (item) => <span>{item.pickup_time}</span>,
      isSortable: true,
      sortKey: 'pickup_time'
    },
    {
      id: 'drop_time',
      header: 'Drop',
      cell: (item) => <span>{item.drop_time}</span>,
      isSortable: true,
      sortKey: 'drop_time'
    },
    {
      id: 'attendance',
      header: 'Attendance',
      cell: (item) => (
        <span className={parseInt(item.attendance) > 90 ? 'text-green-500' : 'text-amber-500'}>
          {item.attendance}
        </span>
      ),
      isSortable: true,
      sortKey: 'attendance'
    },
    {
      id: 'fee_status',
      header: 'Fee Status',
      cell: (item) => {
        const color = 
          item.fee_status === 'Paid' ? 'success' :
          item.fee_status === 'Pending' ? 'warning' : 
          'destructive';
        return <Badge variant={color}>{item.fee_status}</Badge>;
      },
      isSortable: true,
      sortKey: 'fee_status'
    }
  ];

  return (
    <PageTemplate title="Transportation Management" subtitle="Transportation reports and analytics">
      <PageHeader 
        title="Transportation Reports" 
        description="Analytics and performance data for the school transportation system"
      />

      <div className="mt-6 space-y-6">
        <div className="flex justify-between items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="vehicle-usage" className="flex items-center gap-2">
                <Bus className="h-4 w-4" />
                Vehicle Usage
              </TabsTrigger>
              <TabsTrigger value="route-performance" className="flex items-center gap-2">
                <Route className="h-4 w-4" />
                Route Performance
              </TabsTrigger>
              <TabsTrigger value="student-transport" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Student Transport
              </TabsTrigger>
            </TabsList>
            
            <div className="flex justify-end mb-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="month-filter" className="mr-2">Filter by Month:</Label>
                <Select value={filterMonth} onValueChange={setFilterMonth}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="january">January</SelectItem>
                    <SelectItem value="february">February</SelectItem>
                    <SelectItem value="march">March</SelectItem>
                    <SelectItem value="april">April</SelectItem>
                    <SelectItem value="may">May</SelectItem>
                    <SelectItem value="june">June</SelectItem>
                    <SelectItem value="july">July</SelectItem>
                    <SelectItem value="august">August</SelectItem>
                    <SelectItem value="september">September</SelectItem>
                    <SelectItem value="october">October</SelectItem>
                    <SelectItem value="november">November</SelectItem>
                    <SelectItem value="december">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="vehicle-usage" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,540 km</div>
                    <p className="text-xs text-muted-foreground mt-1">+5.2% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">116</div>
                    <p className="text-xs text-muted-foreground mt-1">-2.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Occupancy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">82%</div>
                    <p className="text-xs text-muted-foreground mt-1">+3.5% from last month</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Usage Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <BarChart 
                      data={vehicleUsageChartData}
                      index="Total KM"
                      categories={["Usage"]}
                      colors={["#4f46e5", "#10b981"]}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Usage Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={vehicleUsageData}
                    columns={vehicleColumns}
                    keyField="id"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="route-performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Routes Operating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground mt-1">No change from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Punctuality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">91%</div>
                    <p className="text-xs text-muted-foreground mt-1">+2.3% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.2/5</div>
                    <p className="text-xs text-muted-foreground mt-1">+0.2 from last month</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Route Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <BarChart 
                      data={routePerformanceChartData}
                      index="Students"
                      categories={["Performance"]}
                      colors={["#f59e0b", "#3b82f6"]}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Route Performance Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={routePerformanceData}
                    columns={routeColumns}
                    keyField="id"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="student-transport" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">95</div>
                    <p className="text-xs text-muted-foreground mt-1">+5 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">92.4%</div>
                    <p className="text-xs text-muted-foreground mt-1">-1.2% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Fee Collection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">87%</div>
                    <p className="text-xs text-muted-foreground mt-1">+4.5% from last month</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Student Distribution by Route</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <BarChart 
                      data={studentDistributionData}
                      index="Student Count"
                      categories={["Distribution"]}
                      colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Student Transport Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={studentTransportData}
                    columns={studentColumns}
                    keyField="id"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Report;
