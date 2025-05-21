
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, UserCheck, Calendar, Book, Bell, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const stats = [
    {
      title: "Total Classes",
      value: 18,
      change: "+2",
      changeType: "increase",
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-50"
    },
    {
      title: "Total Students",
      value: 845,
      change: "+12",
      changeType: "increase",
      icon: <Users className="h-6 w-6 text-green-500" />,
      color: "bg-green-50"
    },
    {
      title: "Staff Members",
      value: 42,
      change: "+3",
      changeType: "increase",
      icon: <UserCheck className="h-6 w-6 text-purple-500" />,
      color: "bg-purple-50"
    },
    {
      title: "Attendance Rate",
      value: "94.2%",
      change: "+0.5%",
      changeType: "increase",
      icon: <Calendar className="h-6 w-6 text-orange-500" />,
      color: "bg-orange-50"
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Parent-Teacher Meeting",
      date: "2025-05-28",
      time: "10:00 AM"
    },
    {
      id: 2,
      title: "Quarterly Examination",
      date: "2025-06-05",
      time: "09:00 AM"
    },
    {
      id: 3,
      title: "Science Exhibition",
      date: "2025-06-12",
      time: "11:00 AM"
    },
  ];

  const recentNotices = [
    {
      id: 1,
      title: "Mid-Term Holiday Announcement",
      date: "2025-05-21"
    },
    {
      id: 2,
      title: "New Library Books Available",
      date: "2025-05-19"
    },
    {
      id: 3,
      title: "Updated School Calendar",
      date: "2025-05-15"
    },
  ];

  const upcomingClasses = [
    {
      id: 1,
      subject: "Mathematics",
      class: "Class 8-A",
      time: "08:00 AM - 08:45 AM",
      teacher: "Mr. Smith"
    },
    {
      id: 2,
      subject: "Science",
      class: "Class 9-B",
      time: "09:00 AM - 09:45 AM",
      teacher: "Ms. Brown"
    },
    {
      id: 3,
      subject: "English",
      class: "Class 10-A",
      time: "10:00 AM - 10:45 AM",
      teacher: "Mrs. Miller"
    },
  ];

  const pendingAssignments = [
    {
      id: 1,
      title: "Mathematics Homework",
      class: "Class 8-A",
      dueDate: "2025-05-25"
    },
    {
      id: 2,
      title: "Science Lab Report",
      class: "Class 9-B",
      dueDate: "2025-05-28"
    },
    {
      id: 3,
      title: "English Essay",
      class: "Class 10-A",
      dueDate: "2025-05-30"
    },
  ];

  return (
    <PageTemplate title="Academic Dashboard" subtitle="Overview of academic operations">
      <div className="grid gap-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className={`text-xs font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.title}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Upcoming Classes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                Today's Classes
              </CardTitle>
              <CardDescription>Upcoming classes scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <Book className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{cls.subject}</h4>
                        <p className="text-xs text-muted-foreground">{cls.class} • {cls.teacher}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{cls.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Events
              </CardTitle>
              <CardDescription>School events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{event.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} • {event.time}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notices */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Recent Notices
              </CardTitle>
              <CardDescription>Latest announcements and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotices.map((notice) => (
                  <div key={notice.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <Bell className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{notice.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          Posted on {new Date(notice.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Read</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Assignments */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Pending Assignments
              </CardTitle>
              <CardDescription>Assignments due soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{assignment.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {assignment.class} • Due {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Details</Button>
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
