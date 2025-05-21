
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileDown, Filter, Info, Printer, Search, UserCheck } from 'lucide-react';

const StaffAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Sample staff attendance data
  const staffAttendance = [
    {
      id: "1",
      name: "James Wilson",
      staffId: "STAFF001",
      department: "Academic",
      designation: "Mathematics Teacher",
      date: "2023-05-15",
      status: "Present",
      inTime: "08:15 AM",
      outTime: "04:30 PM",
      totalHours: "8h 15m"
    },
    {
      id: "2",
      name: "Emily Rodriguez",
      staffId: "STAFF002",
      department: "Academic",
      designation: "Science Teacher",
      date: "2023-05-15",
      status: "Present",
      inTime: "08:05 AM",
      outTime: "04:25 PM",
      totalHours: "8h 20m"
    },
    {
      id: "3",
      name: "David Kumar",
      staffId: "STAFF003",
      department: "Administrative",
      designation: "Office Assistant",
      date: "2023-05-15",
      status: "Late",
      inTime: "09:30 AM",
      outTime: "05:30 PM",
      totalHours: "8h 00m"
    },
    {
      id: "4",
      name: "Michelle Lee",
      staffId: "STAFF004",
      department: "Academic",
      designation: "English Teacher",
      date: "2023-05-15",
      status: "Absent",
      inTime: "-",
      outTime: "-",
      totalHours: "-"
    },
    {
      id: "5",
      name: "Thomas Clark",
      staffId: "STAFF005",
      department: "Administrative",
      designation: "Accountant",
      date: "2023-05-15",
      status: "Half Day",
      inTime: "08:10 AM",
      outTime: "12:30 PM",
      totalHours: "4h 20m"
    },
    {
      id: "6",
      name: "Sarah Martinez",
      staffId: "STAFF006",
      department: "Support",
      designation: "Librarian",
      date: "2023-05-15",
      status: "Present",
      inTime: "08:00 AM",
      outTime: "04:00 PM",
      totalHours: "8h 00m"
    }
  ];

  // Status colors
  const statusColors = {
    "Present": "success",
    "Absent": "destructive",
    "Late": "warning",
    "Half Day": "default"
  };

  // Summary stats
  const summary = {
    total: staffAttendance.length,
    present: staffAttendance.filter(s => s.status === "Present").length,
    absent: staffAttendance.filter(s => s.status === "Absent").length,
    late: staffAttendance.filter(s => s.status === "Late").length,
    halfDay: staffAttendance.filter(s => s.status === "Half Day").length,
  };

  return (
    <PageTemplate title="Staff Attendance" subtitle="Track and manage staff attendance records">
      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                  <h3 className="text-2xl font-bold">{summary.total}</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Present</p>
                  <h3 className="text-2xl font-bold">{summary.present}</h3>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Absent</p>
                  <h3 className="text-2xl font-bold">{summary.absent}</h3>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <UserCheck className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Late</p>
                  <h3 className="text-2xl font-bold">{summary.late}</h3>
                </div>
                <div className="p-2 bg-yellow-100 rounded-full">
                  <UserCheck className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Half Day</p>
                  <h3 className="text-2xl font-bold">{summary.halfDay}</h3>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Attendance Register */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle>Staff Attendance Register</CardTitle>
                <CardDescription>Daily attendance record of all staff members</CardDescription>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center">
                  <Label htmlFor="date" className="mr-2">Date:</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="date" 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="pl-8 w-[180px]"
                    />
                  </div>
                </div>
                
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
                <Button variant="outline">
                  <FileDown className="mr-2 h-4 w-4" /> Export
                </Button>
                <Button>Mark Attendance</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>In Time</TableHead>
                    <TableHead>Out Time</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffAttendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.staffId}</TableCell>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>{record.designation}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[record.status] as any || "default"}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.inTime}</TableCell>
                      <TableCell>{record.outTime}</TableCell>
                      <TableCell>{record.totalHours}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Info className="h-4 w-4" />
                        </Button>
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

export default StaffAttendance;
