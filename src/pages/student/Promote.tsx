
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowUp, CheckCircle, Filter, MoreHorizontal, Save } from 'lucide-react';

const Promote = () => {
  const [step, setStep] = useState(1);
  const [fromClass, setFromClass] = useState("Class 8A");
  const [toClass, setToClass] = useState("Class 9A");
  
  // Sample data for students
  const students = [
    {
      id: 1,
      admissionNumber: "ST20230001",
      name: "Rahul Sharma",
      currentClass: "Class 8A",
      academicYear: "2022-2023",
      attendance: "92%",
      academicStatus: "Pass",
      selected: true
    },
    {
      id: 2,
      admissionNumber: "ST20230010",
      name: "Priya Patel",
      currentClass: "Class 8A",
      academicYear: "2022-2023",
      attendance: "95%",
      academicStatus: "Pass",
      selected: true
    },
    {
      id: 3,
      admissionNumber: "ST20230015",
      name: "Karan Singh",
      currentClass: "Class 8A",
      academicYear: "2022-2023",
      attendance: "85%",
      academicStatus: "Pass",
      selected: true
    },
    {
      id: 4,
      admissionNumber: "ST20230022",
      name: "Neha Gupta",
      currentClass: "Class 8A",
      academicYear: "2022-2023",
      attendance: "70%",
      academicStatus: "Conditional Pass",
      selected: false
    },
    {
      id: 5,
      admissionNumber: "ST20230031",
      name: "Arjun Kumar",
      currentClass: "Class 8A",
      academicYear: "2022-2023",
      attendance: "60%",
      academicStatus: "Fail",
      selected: false
    }
  ];

  // Status badge color mapping
  const statusColors = {
    "Pass": "success",
    "Conditional Pass": "warning",
    "Fail": "destructive"
  };

  const handlePromote = () => {
    setStep(3); // Move to success step
    // In a real app, this would send promotion data to the server
  };

  return (
    <PageTemplate title="Promote" subtitle="Promote students to next classes">
      <Card>
        <CardHeader>
          <CardTitle>Student Promotion</CardTitle>
          <CardDescription>Promote students to the next academic year</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="academicYear">Current Academic Year</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="2022-2023">2022-2023</option>
                    <option value="2021-2022">2021-2022</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nextAcademicYear">Next Academic Year</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" disabled>
                    <option value="2023-2024">2023-2024</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fromClass">From Class</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={fromClass}
                    onChange={(e) => setFromClass(e.target.value)}
                  >
                    <option value="Class 8A">Class 8A</option>
                    <option value="Class 7B">Class 7B</option>
                    <option value="Class 6A">Class 6A</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="toClass">To Class</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={toClass}
                    onChange={(e) => setToClass(e.target.value)}
                  >
                    <option value="Class 9A">Class 9A</option>
                    <option value="Class 8B">Class 8B</option>
                    <option value="Class 7A">Class 7A</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)}>Next</Button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">
                    Student Selection: {fromClass} → {toClass}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Select students to promote to the next class
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" /> Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    Select All
                  </Button>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input type="checkbox" />
                    </TableHead>
                    <TableHead>Admission No.</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Current Class</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <input type="checkbox" defaultChecked={student.selected} />
                      </TableCell>
                      <TableCell className="font-medium">{student.admissionNumber}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.currentClass}</TableCell>
                      <TableCell>{student.attendance}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[student.academicStatus] as any || "default"}>
                          {student.academicStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Promotion Warning</h4>
                  <p className="text-sm text-amber-700">
                    Two students have failed or are conditionally passed. Please review their status before promotion.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handlePromote}>
                  <ArrowUp className="h-4 w-4 mr-2" /> Promote Selected Students
                </Button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6 text-center py-6">
              <div className="mx-auto rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium">Students Promoted Successfully</h3>
                <p className="text-muted-foreground mt-1">
                  3 students have been promoted from {fromClass} to {toClass}
                </p>
              </div>
              <div className="pt-4">
                <Button onClick={() => setStep(1)}>New Promotion</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PageTemplate>
  );
};

export default Promote;
