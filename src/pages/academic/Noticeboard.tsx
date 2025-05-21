
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Bell, Calendar, Users, Pin, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Noticeboard = () => {
  const [notices] = useState([
    { 
      id: 1, 
      title: "School Closure Due to Weather Conditions",
      message: "The school will remain closed on May 25th due to severe weather warnings.",
      audience: ["Students", "Parents", "Staff"],
      visibleFrom: "2025-05-21",
      visibleTo: "2025-05-25",
      isPinned: true,
    },
    { 
      id: 2, 
      title: "Annual Sports Meet Registration",
      message: "Registration for the annual sports meet is now open. Please register by May 30th.",
      audience: ["Students"],
      visibleFrom: "2025-05-20",
      visibleTo: "2025-05-30",
      isPinned: false,
    },
    { 
      id: 3, 
      title: "Staff Meeting - End of Term Evaluation",
      message: "A staff meeting will be held on May 24th to discuss end of term evaluations.",
      audience: ["Staff"],
      visibleFrom: "2025-05-20",
      visibleTo: "2025-05-24",
      isPinned: false,
    },
    { 
      id: 4, 
      title: "Parent-Teacher Conference Schedule",
      message: "The schedule for the Parent-Teacher conferences on June 1st is now available.",
      audience: ["Parents"],
      visibleFrom: "2025-05-15",
      visibleTo: "2025-06-01",
      isPinned: true,
    },
  ]);

  const getAudienceBadges = (audience) => {
    const colors = {
      Students: "blue",
      Parents: "green",
      Staff: "purple"
    };

    return audience.map(type => (
      <Badge key={type} variant="outline" className={`bg-${colors[type]}-100 text-${colors[type]}-800 border-${colors[type]}-200`}>
        {type}
      </Badge>
    ));
  };

  return (
    <PageTemplate title="Noticeboard" subtitle="School announcements and notices">
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>School Notifications</CardTitle>
              <CardDescription>Manage school-wide announcements and notices</CardDescription>
            </div>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Notice
            </Button>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {notices.map((notice) => (
                <Card key={notice.id} className={`border ${notice.isPinned ? 'border-primary/50 bg-primary/5' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-md ${notice.isPinned ? 'bg-primary/10' : 'bg-muted'}`}>
                          <Bell size={20} className={notice.isPinned ? 'text-primary' : ''} />
                        </div>
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            {notice.title}
                            {notice.isPinned && <Pin size={14} className="text-primary" />}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{notice.message}</p>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex gap-1 text-xs text-muted-foreground items-center">
                              <Calendar size={12} />
                              <span>
                                {new Date(notice.visibleFrom).toLocaleDateString()} - {new Date(notice.visibleTo).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex gap-1 text-xs text-muted-foreground items-center ml-3">
                              <Users size={12} />
                              <span>For:</span>
                            </div>
                            <div className="flex gap-1">
                              {getAudienceBadges(notice.audience)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye size={16} />
                        </Button>
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

export default Noticeboard;
