
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, BellOff, Calendar, CheckCircle, Clock, Filter, Plus, Search, Send, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Sample notifications data
  const notifications = [
    {
      id: "NOT001",
      title: "Fee payment reminder",
      message: "This is a reminder that the quarterly fee payment is due on May 30th, 2023.",
      sentTo: "All Classes",
      createdBy: "Admin",
      createdAt: "2023-05-15 10:30 AM",
      readStatus: 80,
      priority: "High"
    },
    {
      id: "NOT002",
      title: "Sports Day Event",
      message: "Annual sports day will be held on June 5th. All students must attend in proper sports uniform.",
      sentTo: "All Classes",
      createdBy: "Sports Teacher",
      createdAt: "2023-05-14 09:15 AM",
      readStatus: 65,
      priority: "Medium"
    },
    {
      id: "NOT003",
      title: "Class 10 Parent-Teacher Meeting",
      message: "A parent-teacher meeting for Class 10 is scheduled for May 25th from 10 AM to 12 PM.",
      sentTo: "Class 10",
      createdBy: "Class Teacher",
      createdAt: "2023-05-13 11:45 AM",
      readStatus: 90,
      priority: "High"
    },
    {
      id: "NOT004",
      title: "Holiday Notice",
      message: "The school will remain closed on May 20th on account of local elections.",
      sentTo: "All Classes",
      createdBy: "Principal",
      createdAt: "2023-05-12 02:30 PM",
      readStatus: 95,
      priority: "Medium"
    },
    {
      id: "NOT005",
      title: "Mathematics Remedial Classes",
      message: "Remedial classes for mathematics will be conducted for Class 8 students on weekends starting May 27th.",
      sentTo: "Class 8",
      createdBy: "Math Teacher",
      createdAt: "2023-05-11 04:00 PM",
      readStatus: 70,
      priority: "Medium"
    }
  ];

  const studentNotifications = [
    {
      id: "SNT001",
      title: "Performance Recognition",
      message: "Congratulations on securing the first position in the science quiz competition!",
      student: "Rahul Sharma",
      admissionNumber: "ST20230001",
      createdAt: "2023-05-15",
      readStatus: "Read",
      type: "Achievement"
    },
    {
      id: "SNT002",
      title: "Attendance Warning",
      message: "The student's attendance has fallen below 75%. Please improve attendance to avoid academic penalties.",
      student: "Priya Patel",
      admissionNumber: "ST20230002",
      createdAt: "2023-05-14",
      readStatus: "Unread",
      type: "Warning"
    },
    {
      id: "SNT003",
      title: "Fee Payment Overdue",
      message: "The quarterly fee payment is overdue. Please make the payment at the earliest.",
      student: "Karan Singh",
      admissionNumber: "ST20230003",
      createdAt: "2023-05-13",
      readStatus: "Read",
      type: "Reminder"
    },
    {
      id: "SNT004",
      title: "Assignment Submission",
      message: "Reminder to submit the science project by May 25th.",
      student: "Neha Gupta",
      admissionNumber: "ST20230004",
      createdAt: "2023-05-12",
      readStatus: "Unread",
      type: "Academic"
    }
  ];

  // Priority badge color mapping
  const priorityColors = {
    "High": "destructive",
    "Medium": "warning",
    "Low": "secondary"
  };

  // Student notification type colors
  const notificationTypeColors = {
    "Achievement": "success",
    "Warning": "destructive",
    "Reminder": "warning",
    "Academic": "primary"
  };

  return (
    <PageTemplate title="Notifications" subtitle="Manage student notifications">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Broadcasts</TabsTrigger>
            <TabsTrigger value="student">Student Specific</TabsTrigger>
            <TabsTrigger value="compose">Compose New</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notifications"
                className="pl-8 w-[250px]"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Notification
            </Button>
          </div>
        </div>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast Notifications</CardTitle>
              <CardDescription>Notifications sent to classes or groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {notifications.map((notification) => (
                  <div key={notification.id} className="border rounded-md p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">{notification.title}</h3>
                        <Badge variant={priorityColors[notification.priority] as any}>
                          {notification.priority}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {notification.createdAt}
                      </div>
                    </div>
                    <p className="text-sm">{notification.message}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1" />
                          Sent to: {notification.sentTo}
                        </span>
                        <span className="text-muted-foreground">
                          By: {notification.createdBy}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                        <span>{notification.readStatus}% read</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="student">
          <Card>
            <CardHeader>
              <CardTitle>Student-Specific Notifications</CardTitle>
              <CardDescription>Individual notifications sent to specific students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {studentNotifications.map((notification) => (
                  <div key={notification.id} className="border rounded-md p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {notification.readStatus === "Read" ? (
                          <Bell className="h-4 w-4 text-primary" />
                        ) : (
                          <BellOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <h3 className="font-medium">{notification.title}</h3>
                        <Badge variant={notificationTypeColors[notification.type] as any}>
                          {notification.type}
                        </Badge>
                      </div>
                      <Badge variant={notification.readStatus === "Read" ? "outline" : "secondary"}>
                        {notification.readStatus}
                      </Badge>
                    </div>
                    <p className="text-sm">{notification.message}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <span className="text-muted-foreground">
                          Student: <span className="font-medium text-foreground">{notification.student}</span>
                          <span className="mx-1">•</span>
                          {notification.admissionNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{notification.createdAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle>Compose Notification</CardTitle>
              <CardDescription>Create and send a new notification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="notificationType">Notification Type</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="broadcast">Broadcast (To Classes/Groups)</option>
                    <option value="individual">Individual (To Specific Students)</option>
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="recipients">Recipients</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">-- Select Recipients --</option>
                    <option value="all">All Students</option>
                    <option value="class10">Class 10</option>
                    <option value="class9">Class 9</option>
                    <option value="class8">Class 8</option>
                    <option value="class7">Class 7</option>
                  </select>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">-- Select Category --</option>
                      <option value="academic">Academic</option>
                      <option value="event">Event</option>
                      <option value="fee">Fee</option>
                      <option value="exam">Examination</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="title">Notification Title</Label>
                  <Input id="title" placeholder="Enter notification title" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea 
                    className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Enter notification message"
                  ></textarea>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="scheduleDate">Schedule Date (Optional)</Label>
                    <Input id="scheduleDate" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="scheduleTime">Schedule Time</Label>
                    <Input id="scheduleTime" type="time" />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Save Draft</Button>
                  <Button variant="outline">Preview</Button>
                  <Button>
                    <Send className="mr-2 h-4 w-4" /> Send Notification
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};

export default Notifications;
