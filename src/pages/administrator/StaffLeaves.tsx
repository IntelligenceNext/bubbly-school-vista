
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, FileText, Filter, Plus, Search, Settings } from 'lucide-react';

const StaffLeaves = () => {
  const [activeTab, setActiveTab] = useState("pending");

  // Sample leaves data
  const leaves = [
    {
      id: "1",
      staffName: "James Wilson",
      staffId: "STAFF001",
      designation: "Mathematics Teacher",
      leaveType: "Sick Leave",
      fromDate: "2023-05-15",
      toDate: "2023-05-17",
      days: 3,
      reason: "Medical treatment",
      appliedOn: "2023-05-10",
      status: "Pending"
    },
    {
      id: "2",
      staffName: "Emily Rodriguez",
      staffId: "STAFF002",
      designation: "Science Teacher",
      leaveType: "Casual Leave",
      fromDate: "2023-05-18",
      toDate: "2023-05-18",
      days: 1,
      reason: "Personal work",
      appliedOn: "2023-05-12",
      status: "Approved"
    },
    {
      id: "3",
      staffName: "David Kumar",
      staffId: "STAFF003",
      designation: "Office Assistant",
      leaveType: "Casual Leave",
      fromDate: "2023-05-20",
      toDate: "2023-05-20",
      days: 1,
      reason: "Family function",
      appliedOn: "2023-05-13",
      status: "Pending"
    },
    {
      id: "4",
      staffName: "Michelle Lee",
      staffId: "STAFF004",
      designation: "English Teacher",
      leaveType: "Medical Leave",
      fromDate: "2023-05-10",
      toDate: "2023-05-20",
      days: 11,
      reason: "Surgery recovery",
      appliedOn: "2023-05-05",
      status: "Approved"
    },
    {
      id: "5",
      staffName: "Thomas Clark",
      staffId: "STAFF005",
      designation: "Accountant",
      leaveType: "Casual Leave",
      fromDate: "2023-05-12",
      toDate: "2023-05-14",
      days: 3,
      reason: "Out of station",
      appliedOn: "2023-05-08",
      status: "Rejected"
    }
  ];

  // Filter leaves by status
  const pendingLeaves = leaves.filter(leave => leave.status === "Pending");
  const approvedLeaves = leaves.filter(leave => leave.status === "Approved");
  const rejectedLeaves = leaves.filter(leave => leave.status === "Rejected");

  // Status colors
  const statusColors = {
    "Pending": "warning",
    "Approved": "success",
    "Rejected": "destructive"
  };
  
  // Leave type colors
  const leaveTypeColors = {
    "Sick Leave": "purple",
    "Casual Leave": "blue",
    "Medical Leave": "pink",
    "Maternity Leave": "orange",
    "Paternity Leave": "green",
    "Other": "gray"
  };

  // Leave types for the form
  const leaveTypes = [
    "Sick Leave", 
    "Casual Leave", 
    "Medical Leave", 
    "Maternity Leave", 
    "Paternity Leave",
    "Unpaid Leave", 
    "Other"
  ];

  return (
    <PageTemplate title="Staff Leaves" subtitle="Manage staff leaves and absences">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Requests 
              <Badge className="ml-2 bg-amber-100 text-amber-700 hover:bg-amber-100">{pendingLeaves.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All Leaves</TabsTrigger>
            <TabsTrigger value="apply">Apply Leave</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search leave requests"
                className="pl-8 w-[250px]"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Leave
            </Button>
          </div>
        </div>
        
        <TabsContent value="pending">
          <LeaveRequestsTable 
            leaves={pendingLeaves} 
            showApproveReject={true}
            title="Pending Leave Requests"
            description="Leave applications awaiting approval"
            statusColors={statusColors}
            leaveTypeColors={leaveTypeColors}
          />
        </TabsContent>
        
        <TabsContent value="approved">
          <LeaveRequestsTable 
            leaves={approvedLeaves} 
            showApproveReject={false}
            title="Approved Leave Requests"
            description="Previously approved leave applications"
            statusColors={statusColors}
            leaveTypeColors={leaveTypeColors}
          />
        </TabsContent>
        
        <TabsContent value="rejected">
          <LeaveRequestsTable 
            leaves={rejectedLeaves} 
            showApproveReject={false}
            title="Rejected Leave Requests"
            description="Previously rejected leave applications"
            statusColors={statusColors}
            leaveTypeColors={leaveTypeColors}
          />
        </TabsContent>
        
        <TabsContent value="all">
          <LeaveRequestsTable 
            leaves={leaves} 
            showApproveReject={false}
            title="All Leave Applications"
            description="Complete history of leave requests"
            statusColors={statusColors}
            leaveTypeColors={leaveTypeColors}
          />
        </TabsContent>
        
        <TabsContent value="apply">
          <Card>
            <CardHeader>
              <CardTitle>Apply for Leave</CardTitle>
              <CardDescription>Submit a new leave application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="staffMember">Staff Member</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">-- Select Staff Member --</option>
                    {[...new Set(leaves.map(leave => leave.staffName))].map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="leaveType">Leave Type</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">-- Select Leave Type --</option>
                      {leaveTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="days">Total Days</Label>
                    <Input id="days" type="number" min="1" placeholder="Number of days" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fromDate">From Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="fromDate" type="date" className="pl-8" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="toDate">To Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="toDate" type="date" className="pl-8" />
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason for Leave</Label>
                  <textarea
                    id="reason"
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Please provide detailed reason for the leave"
                  ></textarea>
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="attachment" className="h-4 w-4 rounded border-gray-300" />
                    <Label htmlFor="attachment" className="text-sm font-normal">
                      Include supporting document (for medical leave, etc.)
                    </Label>
                  </div>
                  
                  {/* Conditionally shown file upload */}
                  <div className="mt-2">
                    <Input id="document" type="file" />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Submit Leave Request</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};

// Reusable table component for leave requests
interface LeaveRequestsTableProps {
  leaves: any[];
  showApproveReject: boolean;
  title: string;
  description: string;
  statusColors: Record<string, string>;
  leaveTypeColors: Record<string, string>;
}

const LeaveRequestsTable: React.FC<LeaveRequestsTableProps> = ({ 
  leaves, 
  showApproveReject,
  title,
  description,
  statusColors,
  leaveTypeColors
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.length > 0 ? (
                leaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell className="font-medium">{leave.staffId}</TableCell>
                    <TableCell>
                      <div>
                        <div>{leave.staffName}</div>
                        <div className="text-xs text-muted-foreground">{leave.designation}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`bg-${leaveTypeColors[leave.leaveType]}-50 text-${leaveTypeColors[leave.leaveType]}-700 border-${leaveTypeColors[leave.leaveType]}-200`}>
                        {leave.leaveType}
                      </Badge>
                    </TableCell>
                    <TableCell>{leave.fromDate}</TableCell>
                    <TableCell>{leave.toDate}</TableCell>
                    <TableCell>{leave.days}</TableCell>
                    <TableCell>{leave.appliedOn}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[leave.status] as any}>
                        {leave.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-1" /> View
                      </Button>
                      {showApproveReject && leave.status === "Pending" && (
                        <>
                          <Button variant="outline" size="sm" className="ml-1 bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="ml-1 bg-red-50 text-red-700 hover:bg-red-100 border-red-200">
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No leave requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffLeaves;
