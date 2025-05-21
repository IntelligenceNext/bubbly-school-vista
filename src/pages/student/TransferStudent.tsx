
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Search, Send, Filter, FileText } from 'lucide-react';

const TransferStudent = () => {
  const [activeTab, setActiveTab] = useState("requests");
  
  // Sample data for transfer requests
  const transferRequests = [
    {
      id: "TR001",
      studentName: "Rahul Sharma",
      admissionNumber: "ST20230001",
      currentClass: "Class 8A",
      fromSchool: "Our School",
      toSchool: "City Public School",
      requestDate: "2023-05-15",
      reason: "Family relocation",
      status: "Pending"
    },
    {
      id: "TR002",
      studentName: "Priya Patel",
      admissionNumber: "ST20230002",
      currentClass: "Class 7B",
      fromSchool: "Our School",
      toSchool: "International Academy",
      requestDate: "2023-05-10",
      reason: "Seeking specialized curriculum",
      status: "Approved"
    },
    {
      id: "TR003",
      studentName: "Amit Joshi",
      admissionNumber: "ST20230025",
      currentClass: "Class 6A",
      fromSchool: "Model School",
      toSchool: "Our School",
      requestDate: "2023-05-08",
      reason: "Family relocation",
      status: "Approved"
    },
    {
      id: "TR004",
      studentName: "Kavita Singh",
      admissionNumber: "ST20230036",
      currentClass: "Class 5C",
      fromSchool: "City Public School",
      toSchool: "Our School",
      requestDate: "2023-05-18",
      reason: "Better education opportunity",
      status: "Pending"
    },
    {
      id: "TR005",
      studentName: "Rajesh Kumar",
      admissionNumber: "ST20230042",
      currentClass: "Class 9B",
      fromSchool: "Our School",
      toSchool: "Excellence High School",
      requestDate: "2023-05-05",
      reason: "Sports scholarship",
      status: "Rejected"
    }
  ];

  // Status badge color mapping
  const statusColors = {
    "Pending": "warning",
    "Approved": "success",
    "Rejected": "destructive",
    "In Process": "secondary"
  };

  return (
    <PageTemplate title="Transfer Student" subtitle="Process student transfers">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="requests">Transfer Requests</TabsTrigger>
            <TabsTrigger value="incoming">Incoming Transfers</TabsTrigger>
            <TabsTrigger value="outgoing">Outgoing Transfers</TabsTrigger>
            <TabsTrigger value="new">New Transfer</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
        </div>
        
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transfer Requests</CardTitle>
                  <CardDescription>All student transfer requests</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by student name"
                    className="pl-8 w-[250px]"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Current Class</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transferRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <div>
                          <div>{request.studentName}</div>
                          <div className="text-sm text-muted-foreground">{request.admissionNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>{request.currentClass}</TableCell>
                      <TableCell>{request.fromSchool}</TableCell>
                      <TableCell>{request.toSchool}</TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[request.status] as any || "default"}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Process</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="incoming">
          <Card>
            <CardHeader>
              <CardTitle>Incoming Transfer Requests</CardTitle>
              <CardDescription>Students transferring to our school</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>From School</TableHead>
                    <TableHead>Requested Class</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transferRequests
                    .filter(r => r.toSchool === "Our School")
                    .map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.studentName}</TableCell>
                        <TableCell>{request.fromSchool}</TableCell>
                        <TableCell>{request.currentClass}</TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>
                          <Badge variant={statusColors[request.status] as any || "default"}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Process</Button>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="outgoing">
          <Card>
            <CardHeader>
              <CardTitle>Outgoing Transfer Requests</CardTitle>
              <CardDescription>Students transferring from our school</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>To School</TableHead>
                    <TableHead>Current Class</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transferRequests
                    .filter(r => r.fromSchool === "Our School")
                    .map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>
                          <div>
                            <div>{request.studentName}</div>
                            <div className="text-sm text-muted-foreground">{request.admissionNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>{request.toSchool}</TableCell>
                        <TableCell>{request.currentClass}</TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>
                          <Badge variant={statusColors[request.status] as any || "default"}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-1" /> Issue TC
                          </Button>
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
              <CardTitle>New Transfer Request</CardTitle>
              <CardDescription>Initiate a new student transfer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="transferType">Transfer Type</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="outgoing">Outgoing (From Our School)</option>
                      <option value="incoming">Incoming (To Our School)</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="student">Select Student</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">-- Select Student --</option>
                      <option value="ST20230001">ST20230001 - Rahul Sharma</option>
                      <option value="ST20230002">ST20230002 - Priya Patel</option>
                      <option value="ST20230003">ST20230003 - Karan Singh</option>
                      <option value="ST20230004">ST20230004 - Neha Gupta</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fromSchool">From School</Label>
                    <Input id="fromSchool" defaultValue="Our School" readOnly />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="toSchool">To School</Label>
                    <Input id="toSchool" placeholder="Enter destination school" />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason for Transfer</Label>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Please provide the reason for transfer"
                  ></textarea>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="requestDate">Request Date</Label>
                    <Input id="requestDate" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="effectiveDate">Effective Date</Label>
                    <Input id="effectiveDate" type="date" />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="documents">Supporting Documents</Label>
                  <div className="border border-dashed rounded-md p-6 text-center">
                    <Input id="documents" type="file" className="hidden" />
                    <Label htmlFor="documents" className="cursor-pointer flex flex-col items-center">
                      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium mb-1">Upload Documents</span>
                      <span className="text-xs text-muted-foreground">
                        Upload application letter, address proof, or other required documents
                      </span>
                    </Label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>
                    <Send className="h-4 w-4 mr-2" /> Submit Request
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

export default TransferStudent;
