
import React, { useState, useEffect } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart } from '@/components/ui/LineChart';
import { BarChart } from '@/components/ui/BarChart';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, GraduationCap, Users, School, Mail, Check, CheckCheck } from 'lucide-react';

// Dashboard Stats Interface
interface SchoolDashboardStats {
  total_students: number;
  total_staff: number;
  active_classes: number;
  inquiries_today: number;
  inquiry_completion_rate: number;
  current_session: string;
}

// Time periods for data visualization
type TimePeriod = 'week' | 'month' | 'quarter' | 'year';

const Dashboard = () => {
  const [stats, setStats] = useState<SchoolDashboardStats>({
    total_students: 0,
    total_staff: 0,
    active_classes: 0,
    inquiries_today: 0,
    inquiry_completion_rate: 0,
    current_session: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  
  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // In a real application, this would be a single API call to get all stats
      // For demonstration, we're using mock data
      
      // Mock data
      const mockStats: SchoolDashboardStats = {
        total_students: 1250,
        total_staff: 87,
        active_classes: 42,
        inquiries_today: 8,
        inquiry_completion_rate: 78,
        current_session: '2024-2025'
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data load
  useEffect(() => {
    fetchDashboardStats();
  }, []);
  
  // Mock data for charts
  const generateInquiriesData = (period: TimePeriod) => {
    const data = [];
    const now = new Date();
    let points = 0;
    
    switch (period) {
      case 'week':
        points = 7;
        break;
      case 'month':
        points = 30;
        break;
      case 'quarter':
        points = 90;
        break;
      case 'year':
        points = 12; // Monthly points for a year
        break;
    }
    
    for (let i = 0; i < points; i++) {
      const date = new Date();
      
      if (period === 'year') {
        // For year, show monthly data
        date.setMonth(now.getMonth() - (points - i - 1));
        data.push({
          name: date.toLocaleDateString('en-US', { month: 'short' }),
          new: Math.floor(Math.random() * 50) + 10,
          closed: Math.floor(Math.random() * 40) + 5
        });
      } else {
        // For other periods, show daily data
        date.setDate(now.getDate() - (points - i - 1));
        data.push({
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          new: Math.floor(Math.random() * 10) + 1,
          closed: Math.floor(Math.random() * 8)
        });
      }
    }
    
    return data;
  };
  
  const generateAttendanceData = (period: TimePeriod) => {
    const data = [];
    const now = new Date();
    let points = 0;
    
    switch (period) {
      case 'week':
        points = 7;
        break;
      case 'month':
        points = 30;
        break;
      case 'quarter':
        points = 90;
        break;
      case 'year':
        points = 12; // Monthly points for a year
        break;
    }
    
    for (let i = 0; i < points; i++) {
      const date = new Date();
      
      if (period === 'year') {
        // For year, show monthly data
        date.setMonth(now.getMonth() - (points - i - 1));
        data.push({
          name: date.toLocaleDateString('en-US', { month: 'short' }),
          attendance: Math.floor(Math.random() * 10) + 90 // 90-100% range
        });
      } else {
        // For other periods, show daily data
        date.setDate(now.getDate() - (points - i - 1));
        data.push({
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          attendance: Math.floor(Math.random() * 10) + 90 // 90-100% range
        });
      }
    }
    
    return data;
  };
  
  // Generate enrollment data by class
  const generateEnrollmentData = () => {
    const classNames = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
                        'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
    
    return classNames.map(className => ({
      name: className,
      students: Math.floor(Math.random() * 30) + 20 // 20-50 students per class
    }));
  };
  
  // Get chart data based on selected time period
  const inquiriesData = generateInquiriesData(timePeriod);
  const attendanceData = generateAttendanceData(timePeriod);
  const enrollmentData = generateEnrollmentData();

  return (
    <PageTemplate title="School Dashboard" subtitle="Overview of individual school performance">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <h4 className="text-2xl font-bold">{stats.total_students.toLocaleString()}</h4>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
                <h4 className="text-2xl font-bold">{stats.total_staff.toLocaleString()}</h4>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="bg-amber-500/10 p-3 rounded-full">
                <School className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Classes</p>
                <h4 className="text-2xl font-bold">{stats.active_classes}</h4>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <Mail className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inquiries Today</p>
                <h4 className="text-2xl font-bold">{stats.inquiries_today}</h4>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500/10 p-3 rounded-full">
                <Check className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inquiry Completion Rate</p>
                <h4 className="text-2xl font-bold">{stats.inquiry_completion_rate}%</h4>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="bg-cyan-500/10 p-3 rounded-full">
                <CalendarDays className="h-6 w-6 text-cyan-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Session</p>
                <h4 className="text-2xl font-bold">{stats.current_session}</h4>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
            <div>
              <CardTitle>School Performance Overview</CardTitle>
              <CardDescription>
                Visualize key performance metrics over time
              </CardDescription>
            </div>
            <Tabs value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="quarter">Quarter</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 p-4 border rounded-md bg-muted/10">
                <h3 className="font-medium mb-4">Inquiries Trend</h3>
                <LineChart
                  data={inquiriesData}
                  index="name"
                  categories={["new", "closed"]}
                  colors={["blue", "green"]}
                  valueFormatter={(value: number) => `${value} inquiries`}
                  showLegend={true}
                  yAxisWidth={40}
                />
              </div>
              
              <div className="h-80 p-4 border rounded-md bg-muted/10">
                <h3 className="font-medium mb-4">Average Attendance Rate</h3>
                <LineChart
                  data={attendanceData}
                  index="name"
                  categories={["attendance"]}
                  colors={["violet"]}
                  valueFormatter={(value: number) => `${value}%`}
                  showLegend={false}
                  yAxisWidth={40}
                  startAtZero={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Enrollment by Class</CardTitle>
            <CardDescription>
              Distribution of students across different classes
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="h-80">
              <BarChart
                data={enrollmentData}
                index="name"
                categories={["students"]}
                colors={["indigo"]}
                valueFormatter={(value: number) => `${value} students`}
                showLegend={false}
                showYAxis={true}
                yAxisWidth={40}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default Dashboard;
