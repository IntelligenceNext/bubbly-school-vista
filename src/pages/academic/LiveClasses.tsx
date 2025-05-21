
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Video, Calendar, Clock, Users, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const LiveClasses = () => {
  const classes = [
    { 
      id: 1, 
      title: "Advanced Mathematics - Calculus", 
      class: "Class 10-A",
      subject: "Mathematics",
      scheduledAt: "2025-05-22T10:00:00",
      duration: 45,
      teacher: "Mr. Robert Smith",
      students: 28,
      status: "scheduled"
    },
    { 
      id: 2, 
      title: "Physics - Laws of Motion", 
      class: "Class 9-B",
      subject: "Science",
      scheduledAt: "2025-05-22T11:00:00",
      duration: 45,
      teacher: "Ms. Jessica Brown",
      students: 32,
      status: "scheduled"
    },
    { 
      id: 3, 
      title: "English Literature - Shakespeare", 
      class: "Class 8-A",
      subject: "English",
      scheduledAt: "2025-05-21T14:30:00",
      duration: 60,
      teacher: "Mrs. Patricia Miller",
      students: 30,
      status: "completed"
    },
    { 
      id: 4, 
      title: "Biology - Cellular Structure", 
      class: "Class 9-A",
      subject: "Science",
      scheduledAt: "2025-05-21T09:15:00",
      duration: 45,
      teacher: "Mr. David Wilson",
      students: 25,
      status: "completed"
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Scheduled</Badge>;
      case 'live':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Live Now</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Completed</Badge>;
      default:
        return null;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <PageTemplate title="Live Classes" subtitle="Conduct and monitor online classes">
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Virtual Classroom</CardTitle>
              <CardDescription>Schedule and manage online classes</CardDescription>
            </div>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Schedule Class
            </Button>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {classes.map((cls) => (
                <Card key={cls.id} className="overflow-hidden">
                  <div className="flex border-b">
                    <div className={`w-2 ${cls.status === 'scheduled' ? 'bg-blue-500' : cls.status === 'live' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4 text-primary" />
                            <h3 className="font-medium">{cls.title}</h3>
                            {getStatusBadge(cls.status)}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-3">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Class:</span>
                              <span>{cls.class}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Subject:</span>
                              <span>{cls.subject}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>{formatDate(cls.scheduledAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{formatTime(cls.scheduledAt)} ({cls.duration} min)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Teacher:</span>
                              <span>{cls.teacher}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span>{cls.students} students</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Button variant={cls.status === 'scheduled' ? "default" : "outline"} size="sm" className="flex items-center gap-1">
                            {cls.status === 'scheduled' ? 'Join Class' : 'View Recording'}
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default LiveClasses;
