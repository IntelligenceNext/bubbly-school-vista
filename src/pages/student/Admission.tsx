
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, File, Plus, Search, UserPlus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const Admission = () => {
  const [activeTab, setActiveTab] = useState("applications");

  // Sample admission applications data
  const applications = [
    {
      id: "APP001",
      name: "Rahul Sharma",
      date: "2023-05-10",
      preferredClass: "Class 5",
      status: "Under Review",
      medium: "English"
    },
    {
      id: "APP002",
      name: "Priya Patel",
      date: "2023-05-11",
      preferredClass: "Class 3",
      status: "Applied",
      medium: "English"
    },
    {
      id: "APP003",
      name: "Amit Singh",
      date: "2023-05-09",
      preferredClass: "Class 7",
      status: "Approved",
      medium: "Hindi"
    },
    {
      id: "APP004",
      name: "Neha Gupta",
      date: "2023-05-08",
      preferredClass: "Class 1",
      status: "Rejected",
      medium: "English"
    },
    {
      id: "APP005",
      name: "Vikram Malhotra",
      date: "2023-05-12",
      preferredClass: "Class 10",
      status: "Under Review",
      medium: "English"
    }
  ];

  // Status badge color mapping
  const statusColors: Record<string, string> = {
    "Applied": "secondary",
    "Under Review": "warning",
    "Approved": "success",
    "Rejected": "destructive"
  };

  return (
    <PageTemplate title="Admission" subtitle="Process new student admissions">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="new">New Admission</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="pl-8 w-[250px]"
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Application
            </Button>
          </div>
        </div>
        
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Admission Applications</CardTitle>
              <CardDescription>Manage student admission applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Preferred Class</TableHead>
                    <TableHead>Medium</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.id}</TableCell>
                      <TableCell>{app.name}</TableCell>
                      <TableCell>{app.date}</TableCell>
                      <TableCell>{app.preferredClass}</TableCell>
                      <TableCell>{app.medium}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[app.status] as any || "default"}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>New Admission Form</CardTitle>
              <CardDescription>Enter details to create a new student admission</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="First Name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Last Name" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <div className="relative">
                      <Input id="dob" type="date" />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="guardian">Guardian Details</Label>
                  <Input id="guardian" placeholder="Guardian Name" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input id="contact" placeholder="Contact Number" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Email Address" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="class">Preferred Class</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select Class</option>
                      <option value="1">Class 1</option>
                      <option value="2">Class 2</option>
                      <option value="3">Class 3</option>
                      {/* More options */}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="medium">Medium</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select Medium</option>
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                      <option value="french">French</option>
                      <option value="spanish">Spanish</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Address" />
                </div>
                
                <div className="grid gap-2">
                  <Label>Documents</Label>
                  <div className="border border-dashed rounded-md p-8 text-center">
                    <File className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-sm mb-2">Drag & drop files here, or click to browse</div>
                    <Button variant="outline" size="sm">Upload Documents</Button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Submit Application</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Admission Reports</CardTitle>
              <CardDescription>View and generate admission-related reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Applications by Class</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-muted-foreground">Chart will appear here</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Applications by Status</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-muted-foreground">Chart will appear here</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Monthly Applications</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-muted-foreground">Chart will appear here</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button variant="outline" className="mr-2">
                  <Clock className="mr-2 h-4 w-4" /> Generate Monthly Report
                </Button>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" /> Generate Yearly Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};

export default Admission;
