
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Calendar, Clock, Check, X, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const StudentLeaves = () => {
  const [leaves] = useState([
    {
      id: 1,
      student: "Emily Johnson",
      class: "Class 5-A",
      fromDate: "2025-05-22",
      toDate: "2025-05-24",
      days: 3,
      reason: "Medical appointment",
      status: "approved"
    },
    {
      id: 2,
      student: "Michael Williams",
      class: "Class 6-B",
      fromDate: "2025-05-25",
      toDate: "2025-05-25",
      days: 1,
      reason: "Family function",
      status: "pending"
    },
    {
      id: 3,
      student: "Sophia Davis",
      class: "Class 7-A",
      fromDate: "2025-05-26",
      toDate: "2025-05-27",
      days: 2,
      reason: "Personal reasons",
      status: "pending"
    },
    {
      id: 4,
      student: "James Miller",
      class: "Class 8-C",
      fromDate: "2025-05-18",
      toDate: "2025-05-20",
      days: 3,
      reason: "Medical emergency",
      status: "approved"
    },
    {
      id: 5,
      student: "Olivia Wilson",
      class: "Class 5-B",
      fromDate: "2025-05-15",
      toDate: "2025-05-16",
      days: 2,
      reason: "Religious ceremony",
      status: "rejected"
    },
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <X className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <PageTemplate title="Student Leaves" subtitle="Manage student leaves and absences">
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Leave Applications</CardTitle>
              <CardDescription>Review and manage student leave requests</CardDescription>
            </div>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              New Leave
            </Button>
          </CardHeader>
          
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell className="font-medium">{leave.student}</TableCell>
                      <TableCell>{leave.class}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{leave.days} day{leave.days > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{leave.reason}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(leave.status)}
                          {getStatusBadge(leave.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {leave.status === 'pending' ? (
                            <>
                              <Button variant="default" size="sm" className="h-8">Approve</Button>
                              <Button variant="outline" size="sm" className="h-8">Reject</Button>
                            </>
                          ) : (
                            <Button variant="outline" size="sm" className="h-8">View</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default StudentLeaves;
