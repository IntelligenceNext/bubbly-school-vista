
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Check, X, Clock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("today");
  
  const students = [
    { id: 1, name: "John Smith", roll: "A001", status: "present" },
    { id: 2, name: "Emma Davis", roll: "A002", status: "absent" },
    { id: 3, name: "Michael Johnson", roll: "A003", status: "late" },
    { id: 4, name: "Sophia Williams", roll: "A004", status: "present" },
    { id: 5, name: "David Miller", roll: "A005", status: "present" },
    { id: 6, name: "Olivia Brown", roll: "A006", status: "absent" },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'absent':
        return <X className="h-5 w-5 text-red-500" />;
      case 'late':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <PageTemplate title="Attendance" subtitle="Track and manage student attendance">
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Attendance Register</CardTitle>
              <CardDescription>Class 5 - Section A</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar size={16} />
                Select Date
              </Button>
              <Button>Save Attendance</Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Roll No.</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.roll}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {getStatusIcon(student.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant={student.status === 'present' ? "default" : "outline"} 
                            size="sm"
                            className="h-8"
                          >
                            Present
                          </Button>
                          <Button 
                            variant={student.status === 'absent' ? "destructive" : "outline"} 
                            size="sm"
                            className="h-8"
                          >
                            Absent
                          </Button>
                          <Button 
                            variant={student.status === 'late' ? "secondary" : "outline"} 
                            size="sm"
                            className="h-8"
                          >
                            Late
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Total: {students.length} students | 
                Present: {students.filter(s => s.status === 'present').length} | 
                Absent: {students.filter(s => s.status === 'absent').length} | 
                Late: {students.filter(s => s.status === 'late').length}
              </div>
              <Button>Submit</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default Attendance;
