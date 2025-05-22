import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart } from '@/components/ui/LineChart';
import { BarChart } from '@/components/ui/BarChart';
import { Bus, MapPin, Route, Users, Calendar, Clock, BookOpen } from 'lucide-react';

const Dashboard = () => {
  // Mock summary statistics
  const summaryStats = {
    totalActivities: 28,
    activeCategories: 6,
    ongoingActivities: 8,
    participatingStudents: 345,
    upcomingEvents: 12
  };

  // Mock data for monthly participation chart
  const monthlyParticipationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Student Participation',
        data: [120, 145, 160, 185, 210, 245],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      }
    ],
  };

  // Mock data for category distribution
  const categoryDistributionData = {
    labels: ['Sports', 'Arts', 'Cultural', 'Academic', 'Clubs', 'Social'],
    datasets: [
      {
        label: 'Activities',
        data: [8, 5, 6, 4, 3, 2],
        backgroundColor: [
          '#3b82f6', // Blue
          '#10b981', // Green
          '#f59e0b', // Yellow
          '#ef4444', // Red
          '#8b5cf6', // Purple
          '#ec4899'  // Pink
        ],
      }
    ],
  };

  // Recent activities
  const recentActivities = [
    { 
      id: 1, 
      title: 'Annual Sports Day', 
      category: 'Sports', 
      startDate: '2025-05-25', 
      status: 'upcoming',
      participants: 120,
      location: 'Main Ground'
    },
    { 
      id: 2, 
      title: 'Chess Tournament', 
      category: 'Clubs', 
      startDate: '2025-05-20', 
      status: 'ongoing',
      participants: 32,
      location: 'Indoor Games Room'
    },
    { 
      id: 3, 
      title: 'Science Exhibition', 
      category: 'Academic', 
      startDate: '2025-05-18', 
      status: 'ongoing',
      participants: 65,
      location: 'Science Lab'
    },
    { 
      id: 4, 
      title: 'Dance Competition', 
      category: 'Cultural', 
      startDate: '2025-05-15', 
      status: 'completed',
      participants: 48,
      location: 'Auditorium'
    },
  ];

  // Upcoming events
  const upcomingEvents = [
    { 
      id: 1, 
      title: 'Annual Sports Day', 
      category: 'Sports', 
      date: '2025-05-25',
      time: '09:00 AM',
      location: 'Main Ground'
    },
    { 
      id: 2, 
      title: 'Art Exhibition', 
      category: 'Arts', 
      date: '2025-05-28',
      time: '11:00 AM',
      location: 'Art Gallery'
    },
    { 
      id: 3, 
      title: 'Debate Competition', 
      category: 'Academic', 
      date: '2025-06-02',
      time: '02:00 PM',
      location: 'Conference Hall'
    },
    { 
      id: 4, 
      title: 'Music Recital', 
      category: 'Cultural', 
      date: '2025-06-05',
      time: '04:30 PM',
      location: 'Auditorium'
    },
  ];

  // Badge color based on status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-500';
      case 'ongoing': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <PageTemplate title="Activities Management" subtitle="Overview of school extracurricular activities">
      <PageHeader 
        title="Activities Dashboard" 
        description="Track and manage all extracurricular programs and events"
      />

      <div className="mt-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalActivities}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.activeCategories}</div>
              <p className="text-xs text-muted-foreground mt-1">Active categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.ongoingActivities}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.participatingStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">Student enrollments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground mt-1">Scheduled events</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Participation</CardTitle>
              <CardDescription>Tracking student involvement in activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart data={monthlyParticipationData} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Activity Distribution</CardTitle>
              <CardDescription>Activities by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart data={categoryDistributionData} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities and Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest activities and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex justify-between border-b pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{activity.title}</h3>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.category}</p>
                      <div className="flex gap-6 mt-1">
                        <span className="text-xs flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(activity.startDate).toLocaleDateString()}
                        </span>
                        <span className="text-xs flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {activity.participants} participants
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">{activity.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events scheduled in the coming weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-4 border-b pb-4">
                    <div className="rounded-md bg-primary/10 p-3 text-center min-w-16">
                      <div className="text-xs font-medium">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                      <div className="text-lg font-bold">{new Date(event.date).getDate()}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.category}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.time}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </span>
                      </div>
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
