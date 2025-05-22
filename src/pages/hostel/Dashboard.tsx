
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart } from '@/components/ui/BarChart';
import { LineChart } from '@/components/ui/LineChart';
import { getHostelStatistics, Hostel } from '@/services/hostelService';
import { Building, Users, UserCheck } from 'lucide-react';

const HostelDashboard = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<{
    hostels: Array<{
      id: string;
      name: string;
      capacity: number;
      occupied: number;
      available: number;
      occupancyRate: number;
    }>;
    totalCapacity: number;
    totalOccupied: number;
    totalAvailable: number;
    overallOccupancyRate: number;
  }>({
    hostels: [],
    totalCapacity: 0,
    totalOccupied: 0,
    totalAvailable: 0,
    overallOccupancyRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (schoolId) {
        setLoading(true);
        try {
          const data = await getHostelStatistics(schoolId);
          setStats(data);
        } catch (error) {
          console.error("Failed to fetch hostel statistics:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStatistics();
  }, [schoolId]);

  // Prepare data for charts
  const occupancyChartData = stats.hostels.map(hostel => ({
    name: hostel.name,
    Occupied: hostel.occupied,
    Available: hostel.available
  }));

  const occupancyRateChartData = stats.hostels.map(hostel => ({
    name: hostel.name,
    "Occupancy Rate": hostel.occupancyRate
  }));

  return (
    <PageTemplate title="Hostel Dashboard" subtitle="Monitor and manage hostel operations">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.hostels.length}</div>
                <p className="text-xs text-muted-foreground">Active hostels in the system</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCapacity}</div>
                <p className="text-xs text-muted-foreground">Total student capacity</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(stats.overallOccupancyRate)}%</div>
                <p className="text-xs text-muted-foreground">Average occupancy across all hostels</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Available Spaces</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAvailable}</div>
                <p className="text-xs text-muted-foreground">Unoccupied beds across all hostels</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Hostel Occupancy</CardTitle>
                <CardDescription>Current student distribution across hostels</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {!loading && stats.hostels.length > 0 && (
                  <BarChart
                    data={occupancyChartData}
                    index="name"
                    categories={["Occupied", "Available"]}
                    colors={["71, 130, 218", "152, 216, 158"]}
                    valueFormatter={(value) => `${value} students`}
                    showLegend={true}
                  />
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Occupancy Rate</CardTitle>
                <CardDescription>Percentage of capacity utilized per hostel</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {!loading && stats.hostels.length > 0 && (
                  <LineChart
                    data={occupancyRateChartData}
                    index="name"
                    categories={["Occupancy Rate"]}
                    colors={["255, 99, 71"]}
                    valueFormatter={(value) => `${value}%`}
                    showLegend={false}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="occupancy">
          <Card>
            <CardHeader>
              <CardTitle>Hostel Occupancy Details</CardTitle>
              <CardDescription>Detailed breakdown of occupancy per hostel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {stats.hostels.map((hostel) => (
                  <div key={hostel.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{hostel.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {hostel.occupied} / {hostel.capacity} ({hostel.occupancyRate}%)
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${hostel.occupancyRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>Will show attendance trends once data is available</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No attendance data is available yet. Record daily attendance to see statistics here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};

export default HostelDashboard;
