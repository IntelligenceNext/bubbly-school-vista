
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Award, ArrowUpRight, Medal, BookOpen } from 'lucide-react';
import { LineChart } from '@/components/ui/LineChart';
import { BarChart } from '@/components/ui/BarChart';

const ActivitiesDashboard = () => {
  // Mock data for statistics
  const stats = {
    total_activities: 45,
    upcoming_activities: 12,
    ongoing_activities: 8,
    completed_activities: 25,
    total_participants: 520,
    certificates_issued: 350
  };
  
  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Sports Day",
      date: "2023-11-15",
      time: "09:00 AM - 04:00 PM",
      location: "School Grounds",
      category: "Sports",
      organizer: "Physical Education Dept."
    },
    {
      id: 2,
      title: "Science Exhibition",
      date: "2023-11-22",
      time: "10:00 AM - 02:00 PM",
      location: "School Auditorium",
      category: "Academic",
      organizer: "Science Dept."
    },
    {
      id: 3,
      title: "Inter-School Debate Competition",
      date: "2023-12-05",
      time: "01:00 PM - 04:00 PM",
      location: "Conference Hall",
      category: "Cultural",
      organizer: "Literary Club"
    }
  ];
  
  // Mock data for participation by month
  const participationTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Student Participation',
        data: [120, 150, 180, 210, 190, 240, 230, 260, 280, 300],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      }
    ]
  };
  
  // Mock data for activity categories
  const activityCategoriesData = {
    labels: ['Sports', 'Cultural', 'Academic', 'Arts', 'Social', 'Clubs'],
    datasets: [
      {
        label: 'Activities Count',
        data: [14, 10, 8, 6, 4, 3],
        backgroundColor: [
          '#3b82f6', // Blue
          '#ef4444', // Red
          '#10b981', // Green
          '#f59e0b', // Yellow
          '#8b5cf6', // Purple
          '#ec4899'  // Pink
        ]
      }
    ]
  };

  // Create chart props in the format expected by the components
  const participationTrendProps = {
    index: 'labels',
    categories: participationTrendData.labels,
    colors: ['#3b82f6'],
    data: participationTrendData.datasets[0].data,
  };

  const activityCategoriesProps = {
    index: 'labels',
    categories: activityCategoriesData.labels,
    colors: [
      '#3b82f6', // Blue
      '#ef4444', // Red
      '#10b981', // Green
      '#f59e0b', // Yellow
      '#8b5cf6', // Purple
      '#ec4899'  // Pink
    ],
    data: activityCategoriesData.datasets[0].data,
  };
  
  return (
    <PageTemplate title="Activities Management" subtitle="Manage and track extracurricular activities">
      {/* Quick Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex flex-col">
            <p className="text-sm text-muted-foreground">Total Activities</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold">{stats.total_activities}</span>
              <BookOpen className="text-gray-400 h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col">
            <p className="text-sm text-muted-foreground">Upcoming</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold">{stats.upcoming_activities}</span>
              <Calendar className="text-blue-500 h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col">
            <p className="text-sm text-muted-foreground">Ongoing</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold">{stats.ongoing_activities}</span>
              <ArrowUpRight className="text-amber-500 h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col">
            <p className="text-sm text-muted-foreground">Completed</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold">{stats.completed_activities}</span>
              <Medal className="text-green-500 h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col">
            <p className="text-sm text-muted-foreground">Participants</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold">{stats.total_participants}</span>
              <Users className="text-indigo-500 h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col">
            <p className="text-sm text-muted-foreground">Certificates</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold">{stats.certificates_issued}</span>
              <Award className="text-purple-500 h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity Trends and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Participation Trend</CardTitle>
            <CardDescription>Monthly student participation in activities</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart {...participationTrendProps} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Activities</CardTitle>
            <CardDescription>Next scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge>{event.category}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1.5">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {event.date} • {event.time}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm">{event.location}</span>
                    <Button variant="ghost" size="sm" className="h-7 px-2">Details</Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-2">View All Activities</Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity Categories and Recent Winners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Categories</CardTitle>
            <CardDescription>Distribution of activities by type</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart {...activityCategoriesProps} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>Latest student accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Trophy className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">District Science Exhibition</span>
                    <Badge variant="outline" className="bg-green-50">Winner</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Team of 4 students from Class 10 secured first position</p>
                  <p className="text-xs text-muted-foreground mt-1">October 15, 2023</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-2 rounded-full">
                  <Medal className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Inter-School Chess Tournament</span>
                    <Badge variant="outline" className="bg-blue-50">Runner Up</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Rahul Sharma from Class 9 secured second position</p>
                  <p className="text-xs text-muted-foreground mt-1">October 8, 2023</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">National Art Competition</span>
                    <Badge variant="outline" className="bg-purple-50">Special Mention</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Priya Patel from Class 8 received special mention</p>
                  <p className="text-xs text-muted-foreground mt-1">September 29, 2023</p>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-4">View All Achievements</Button>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

// Trophy icon component
const Trophy = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
};

export default ActivitiesDashboard;
