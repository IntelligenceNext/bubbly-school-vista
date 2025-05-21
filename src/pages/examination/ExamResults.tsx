
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  FileText, 
  Search, 
  Edit, 
  FilePlus, 
  FileUp, 
  UserCheck, 
  Book, 
  Award
} from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const ExamResults = () => {
  const [isIndividualEntryOpen, setIsIndividualEntryOpen] = useState(false);
  const [isGroupEntryOpen, setIsGroupEntryOpen] = useState(false);
  
  // Mock data for students
  const students = [
    {
      id: "1",
      rollNo: "A001",
      name: "Aryan Sharma",
      class: "Class 10",
      section: "A",
      subjects: {
        "Mathematics": { marks: 85, grade: "A", status: "Pass" },
        "Science": { marks: 78, grade: "B", status: "Pass" },
        "English": { marks: 92, grade: "A", status: "Pass" },
        "Hindi": { marks: 80, grade: "A", status: "Pass" },
        "Social Science": { marks: 75, grade: "B", status: "Pass" }
      },
      totalMarks: 410,
      percentage: 82,
      grade: "A",
      position: 2,
      status: "Pass"
    },
    {
      id: "2",
      rollNo: "A002",
      name: "Priya Patel",
      class: "Class 10",
      section: "A",
      subjects: {
        "Mathematics": { marks: 95, grade: "A+", status: "Pass" },
        "Science": { marks: 88, grade: "A", status: "Pass" },
        "English": { marks: 90, grade: "A", status: "Pass" },
        "Hindi": { marks: 85, grade: "A", status: "Pass" },
        "Social Science": { marks: 92, grade: "A+", status: "Pass" }
      },
      totalMarks: 450,
      percentage: 90,
      grade: "A+",
      position: 1,
      status: "Pass"
    },
    {
      id: "3",
      rollNo: "A003",
      name: "Rahul Yadav",
      class: "Class 10",
      section: "A",
      subjects: {
        "Mathematics": { marks: 65, grade: "C", status: "Pass" },
        "Science": { marks: 72, grade: "B", status: "Pass" },
        "English": { marks: 68, grade: "C", status: "Pass" },
        "Hindi": { marks: 75, grade: "B", status: "Pass" },
        "Social Science": { marks: 70, grade: "B", status: "Pass" }
      },
      totalMarks: 350,
      percentage: 70,
      grade: "B",
      position: 5,
      status: "Pass"
    },
    {
      id: "4",
      rollNo: "A004",
      name: "Anjali Singh",
      class: "Class 10",
      section: "A",
      subjects: {
        "Mathematics": { marks: 82, grade: "A", status: "Pass" },
        "Science": { marks: 78, grade: "B", status: "Pass" },
        "English": { marks: 85, grade: "A", status: "Pass" },
        "Hindi": { marks: 80, grade: "A", status: "Pass" },
        "Social Science": { marks: 76, grade: "B", status: "Pass" }
      },
      totalMarks: 401,
      percentage: 80.2,
      grade: "A",
      position: 3,
      status: "Pass"
    },
    {
      id: "5",
      rollNo: "A005",
      name: "Mohammed Rizwan",
      class: "Class 10",
      section: "A",
      subjects: {
        "Mathematics": { marks: 75, grade: "B", status: "Pass" },
        "Science": { marks: 80, grade: "A", status: "Pass" },
        "English": { marks: 72, grade: "B", status: "Pass" },
        "Hindi": { marks: 68, grade: "C", status: "Pass" },
        "Social Science": { marks: 82, grade: "A", status: "Pass" }
      },
      totalMarks: 377,
      percentage: 75.4,
      grade: "B",
      position: 4,
      status: "Pass"
    }
  ];
  
  // Mock data for exams, classes, subjects
  const exams = [
    { id: "1", name: "Final Term Examination 2023-24" },
    { id: "2", name: "Mid Term Assessment 2023-24" },
    { id: "3", name: "First Unit Test 2023-24" }
  ];
  
  const classes = [
    { id: "1", name: "Class 10" },
    { id: "2", name: "Class 9" },
    { id: "3", name: "Class 8" }
  ];
  
  const sections = [
    { id: "A", name: "Section A" },
    { id: "B", name: "Section B" },
    { id: "C", name: "Section C" }
  ];
  
  const subjects = [
    { id: "1", name: "Mathematics" },
    { id: "2", name: "Science" },
    { id: "3", name: "English" },
    { id: "4", name: "Hindi" },
    { id: "5", name: "Social Science" }
  ];
  
  // Table columns
  const columns = [
    {
      id: "rollNo",
      header: "Roll No",
      cell: (row: any) => row.rollNo,
      isSortable: true,
      sortKey: "rollNo",
      size: "sm"
    },
    {
      id: "name",
      header: "Student Name",
      cell: (row: any) => <span className="font-medium">{row.name}</span>,
      isSortable: true,
      sortKey: "name"
    },
    {
      id: "class",
      header: "Class",
      cell: (row: any) => (
        <span>{row.class} - {row.section}</span>
      ),
      isSortable: true,
      sortKey: "class",
      size: "sm"
    },
    {
      id: "marks",
      header: "Marks",
      cell: (row: any) => (
        <div>
          <div><strong>{row.totalMarks}/500</strong></div>
          <div className="text-sm text-muted-foreground">{row.percentage}%</div>
        </div>
      ),
      isSortable: true,
      sortKey: "totalMarks",
      size: "sm"
    },
    {
      id: "grade",
      header: "Grade",
      cell: (row: any) => (
        <Badge variant="outline" className="text-lg font-bold">
          {row.grade}
        </Badge>
      ),
      isSortable: true,
      sortKey: "grade",
      size: "sm"
    },
    {
      id: "position",
      header: "Rank",
      cell: (row: any) => (
        <div className="text-center">
          <span className="font-bold text-lg">{row.position}</span>
        </div>
      ),
      isSortable: true,
      sortKey: "position",
      size: "sm"
    },
    {
      id: "status",
      header: "Status",
      cell: (row: any) => (
        <Badge variant={row.status === "Pass" ? "outline" : "destructive"}>
          {row.status}
        </Badge>
      ),
      isSortable: true,
      sortKey: "status",
      size: "sm"
    }
  ];
  
  // Individual result entry form schema
  const individualFormSchema = z.object({
    examId: z.string({
      required_error: "Please select an examination",
    }),
    studentId: z.string({
      required_error: "Please enter student ID or roll number",
    }),
    subject: z.string({
      required_error: "Please select a subject",
    }),
    marks: z.string().transform((val) => parseFloat(val)),
    grade: z.string({
      required_error: "Please select a grade",
    }),
    remarks: z.string().optional(),
  });
  
  // Group result entry form schema
  const groupFormSchema = z.object({
    examId: z.string({
      required_error: "Please select an examination",
    }),
    classId: z.string({
      required_error: "Please select a class",
    }),
    sectionId: z.string({
      required_error: "Please select a section",
    }),
    subjectId: z.string({
      required_error: "Please select a subject",
    })
  });
  
  // Initialize forms
  const individualForm = useForm<z.infer<typeof individualFormSchema>>({
    resolver: zodResolver(individualFormSchema),
    defaultValues: {
      remarks: ""
    }
  });
  
  const groupForm = useForm<z.infer<typeof groupFormSchema>>({
    resolver: zodResolver(groupFormSchema)
  });
  
  const onIndividualSubmit = (values: z.infer<typeof individualFormSchema>) => {
    console.log("Individual form submitted:", values);
    setIsIndividualEntryOpen(false);
    individualForm.reset();
  };
  
  const onGroupSubmit = (values: z.infer<typeof groupFormSchema>) => {
    console.log("Group form submitted:", values);
    setIsGroupEntryOpen(false);
    groupForm.reset();
  };
  
  // Table actions
  const actions = [
    {
      label: "View Details",
      onClick: (student: any) => {
        console.log("View student details:", student);
      },
    },
    {
      label: "Edit Results",
      onClick: (student: any) => {
        console.log("Edit results:", student);
      },
    },
    {
      label: "Print Report Card",
      onClick: (student: any) => {
        console.log("Print report card:", student);
      },
    }
  ];
  
  return (
    <PageTemplate title="Exam Results" subtitle="Enter and manage exam results">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Individual Entry</CardTitle>
              <CardDescription>Enter results for one student</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => setIsIndividualEntryOpen(true)}
              >
                <UserCheck className="mr-2 h-4 w-4" /> Record Individual Result
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Group Entry</CardTitle>
              <CardDescription>Enter results for a class/section</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => setIsGroupEntryOpen(true)}
              >
                <FilePlus className="mr-2 h-4 w-4" /> Record Group Results
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Import Results</CardTitle>
              <CardDescription>Upload from CSV/Excel format</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                <FileUp className="mr-2 h-4 w-4" /> Import From File
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <PageHeader
          title="Final Term Examination 2023-24"
          description="Class 10 - Section A"
          actions={[
            <Button key="filter" variant="outline">
              <Search className="mr-2 h-4 w-4" /> Filter
            </Button>,
            <Button key="print" variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Print Results
            </Button>
          ]}
        />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <DataTable
            data={students}
            columns={columns}
            keyField="id"
            selectable={true}
            actions={actions}
            onRowClick={(student) => console.log("Row clicked:", student)}
          />
        </div>
        
        {/* Individual Result Entry Dialog */}
        <Dialog open={isIndividualEntryOpen} onOpenChange={setIsIndividualEntryOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Record Individual Result</DialogTitle>
              <DialogDescription>
                Enter exam result details for an individual student
              </DialogDescription>
            </DialogHeader>
            
            <Form {...individualForm}>
              <form onSubmit={individualForm.handleSubmit(onIndividualSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={individualForm.control}
                  name="examId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Examination</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select examination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {exams.map((exam) => (
                            <SelectItem key={exam.id} value={exam.id}>
                              {exam.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={individualForm.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID / Roll Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter student ID or roll number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={individualForm.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={individualForm.control}
                    name="marks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marks</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={individualForm.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C+">C+</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="D">D</SelectItem>
                            <SelectItem value="F">F (Fail)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={individualForm.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any remarks or notes about the student's performance"
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsIndividualEntryOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Result</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Group Result Entry Dialog */}
        <Dialog open={isGroupEntryOpen} onOpenChange={setIsGroupEntryOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Group Result Entry</DialogTitle>
              <DialogDescription>
                Record results for an entire class or section
              </DialogDescription>
            </DialogHeader>
            
            <Form {...groupForm}>
              <form onSubmit={groupForm.handleSubmit(onGroupSubmit)} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={groupForm.control}
                    name="examId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Examination</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select examination" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {exams.map((exam) => (
                              <SelectItem key={exam.id} value={exam.id}>
                                {exam.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={groupForm.control}
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={groupForm.control}
                    name="classId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classes.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={groupForm.control}
                    name="sectionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sections.map((section) => (
                              <SelectItem key={section.id} value={section.id}>
                                {section.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="bg-slate-50 p-3 rounded-md">
                  <h3 className="text-sm font-medium mb-2">
                    Class 10-A | Mathematics | Final Term Examination 2023-24
                  </h3>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Roll No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead className="w-[120px]">Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>A001</TableCell>
                        <TableCell>Aryan Sharma</TableCell>
                        <TableCell>
                          <Input type="number" className="w-20" defaultValue="" />
                        </TableCell>
                        <TableCell>
                          <Select>
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="--" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="C+">C+</SelectItem>
                              <SelectItem value="C">C</SelectItem>
                              <SelectItem value="D">D</SelectItem>
                              <SelectItem value="F">F</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input className="w-full" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>A002</TableCell>
                        <TableCell>Priya Patel</TableCell>
                        <TableCell>
                          <Input type="number" className="w-20" defaultValue="" />
                        </TableCell>
                        <TableCell>
                          <Select>
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="--" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="C+">C+</SelectItem>
                              <SelectItem value="C">C</SelectItem>
                              <SelectItem value="D">D</SelectItem>
                              <SelectItem value="F">F</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input className="w-full" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>A003</TableCell>
                        <TableCell>Rahul Yadav</TableCell>
                        <TableCell>
                          <Input type="number" className="w-20" defaultValue="" />
                        </TableCell>
                        <TableCell>
                          <Select>
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="--" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="C+">C+</SelectItem>
                              <SelectItem value="C">C</SelectItem>
                              <SelectItem value="D">D</SelectItem>
                              <SelectItem value="F">F</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input className="w-full" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsGroupEntryOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save All Results</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </PageTemplate>
  );
};

export default ExamResults;
