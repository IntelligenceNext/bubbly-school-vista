
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Users, Plus } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Event = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PageTemplate title="School Events" subtitle="Manage school events and functions">
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Event Management</CardTitle>
              <CardDescription>Create and manage school events</CardDescription>
            </div>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Create Event
            </Button>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
                <TabsTrigger value="all">All Events</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mt-4">
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between p-4 border rounded-md bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <Calendar size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Annual Sports Day</h3>
                      <p className="text-sm text-muted-foreground">10 Jun 2025 • School Ground</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div 
                          key={i} 
                          className="h-8 w-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center overflow-hidden"
                        >
                          <Users size={14} className="text-primary" />
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-md bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <Calendar size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Parent-Teacher Meeting</h3>
                      <p className="text-sm text-muted-foreground">15 Jun 2025 • All Classes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center -space-x-2">
                      {[1, 2, 3, 4].map(i => (
                        <div 
                          key={i} 
                          className="h-8 w-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center overflow-hidden"
                        >
                          <Users size={14} className="text-primary" />
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Settings Section */}
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-8 border rounded-md p-4">
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <h3 className="text-sm font-medium">Event Settings</h3>
                <span className="text-xs text-muted-foreground">{isOpen ? "Hide" : "Show"}</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Default Event Audience</h4>
                    <RadioGroup defaultValue="all">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="all" />
                          <Label htmlFor="all">All</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="students" id="students" />
                          <Label htmlFor="students">Students</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="staff" id="staff" />
                          <Label htmlFor="staff">Staff</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="parents" id="parents" />
                          <Label htmlFor="parents">Parents</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Notification Settings</h4>
                    <RadioGroup defaultValue="email_app">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="email" />
                          <Label htmlFor="email">Email</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="app" id="app" />
                          <Label htmlFor="app">App</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email_app" id="email_app" />
                          <Label htmlFor="email_app">Both</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default Event;
