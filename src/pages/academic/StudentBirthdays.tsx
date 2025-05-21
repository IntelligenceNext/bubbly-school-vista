
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Gift, Cake, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StudentBirthdays = () => {
  const today = new Date();
  const birthdays = [
    {
      id: 1,
      name: "Emily Johnson",
      class: "Class 5-A",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      age: 10,
      photo: null
    },
    {
      id: 2,
      name: "Michael Williams",
      class: "Class 6-B",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      age: 11,
      photo: null
    },
    {
      id: 3,
      name: "Sophia Davis",
      class: "Class 7-A",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      age: 12,
      photo: null
    },
    {
      id: 4,
      name: "James Miller",
      class: "Class 8-C",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
      age: 13,
      photo: null
    },
    {
      id: 5,
      name: "Olivia Wilson",
      class: "Class 5-B",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6),
      age: 10,
      photo: null
    }
  ];

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth();
  };

  return (
    <PageTemplate title="Student Birthdays" subtitle="Track and celebrate student birthdays">
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Birthday Calendar</CardTitle>
              <CardDescription>Upcoming student birthdays</CardDescription>
            </div>
            <Tabs defaultValue="day">
              <TabsList>
                <TabsTrigger value="day">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <div className="grid gap-4">
              {birthdays.map((birthday) => (
                <Card key={birthday.id} className={`bg-gradient-to-r ${isToday(birthday.date) ? 'from-pink-50 to-blue-50 border-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isToday(birthday.date) ? 'bg-primary/10' : 'bg-muted'}`}>
                          {isToday(birthday.date) ? (
                            <Cake className="h-6 w-6 text-primary" />
                          ) : (
                            <Calendar className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            {birthday.name}
                            {isToday(birthday.date) && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">
                                <Gift className="h-3 w-3 mr-1" />
                                Today!
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {birthday.class} • Turning {birthday.age} on {formatDate(birthday.date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                        >
                          <Mail className="h-3 w-3" />
                          Send Wish
                        </Button>
                        {isToday(birthday.date) && (
                          <Button size="sm" className="flex items-center gap-1">
                            <Gift className="h-3 w-3" />
                            Celebrate
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default StudentBirthdays;
