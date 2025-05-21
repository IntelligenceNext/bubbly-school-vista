
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
  CardFooter,
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
import {
  FileText,
  Search,
  FilePlus,
  Printer,
  User,
  Calendar,
  Clock
} from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from 'date-fns';

const AdmitCards = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  
  // Mock data for students
  const students = [
    {
      id: "1",
      rollNo: "A001",
      name: "Aryan Sharma",
      class: "Class 10",
      section: "A",
      admitCardNo: "FINAL2024-10A-001",
      issueDate: "2023-11-25",
      status: "Issued"
    },
    {
      id: "2",
      rollNo: "A002",
      name: "Priya Patel",
      class: "Class 10",
      section: "A",
      admitCardNo: "FINAL2024-10A-002",
      issueDate: "2023-11-25",
      status: "Issued"
    },
    {
      id: "3",
      rollNo: "A003",
      name: "Rahul Yadav",
      class: "Class 10",
      section: "A",
      admitCardNo: null,
      issueDate: null,
      status: "Not Issued"
    },
    {
      id: "4",
      rollNo: "A004",
      name: "Anjali Singh",
      class: "Class 10",
      section: "A",
      admitCardNo: "FINAL2024-10A-004",
      issueDate: "2023-11-25",
      status: "Issued"
    },
    {
      id: "5",
      rollNo: "B001",
      name: "Mohammed Rizwan",
      class: "Class 10",
      section: "B",
      admitCardNo: "FINAL2024-10B-001",
      issueDate: "2023-11-26",
      status: "Issued"
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
  
  // Form schema
  const formSchema = z.object({
    examId: z.string({
      required_error: "Please select an examination",
    }),
    studentId: z.string({
      required_error: "Please enter student ID or roll number",
    }),
    remarks: z.string().optional(),
  });
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      remarks: ""
    }
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
    setIsDialogOpen(false);
    form.reset();
  };
  
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
      id: "admitCardNo",
      header: "Admit Card No",
      cell: (row: any) => row.admitCardNo || "-",
      isSortable: true,
      sortKey: "admitCardNo"
    },
    {
      id: "issueDate",
      header: "Issue Date",
      cell: (row: any) => row.issueDate || "-",
      isSortable: true,
      sortKey: "issueDate",
      size: "sm"
    },
    {
      id: "status",
      header: "Status",
      cell: (row: any) => (
        <Badge variant={row.status === "Issued" ? "outline" : "secondary"}>
          {row.status}
        </Badge>
      ),
      isSortable: true,
      sortKey: "status",
      size: "sm"
    }
  ];
  
  // Table actions
  const actions = [
    {
      label: "Issue Admit Card",
      onClick: (student: any) => {
        console.log("Issue admit card:", student);
        setIsDialogOpen(true);
      },
      condition: (student: any) => student.status === "Not Issued"
    },
    {
      label: "Print Admit Card",
      onClick: (student: any) => {
        console.log("Print admit card:", student);
        setSelectedStudent(student);
        setIsPrintPreviewOpen(true);
      },
      condition: (student: any) => student.status === "Issued"
    },
    {
      label: "View Details",
      onClick: (student: any) => {
        console.log("View student details:", student);
      }
    }
  ];
  
  // Sample exam schedule for admit card
  const examSchedule = [
    { date: "2023-12-05", subject: "Mathematics", time: "09:00 AM - 12:00 PM", venue: "Hall A" },
    { date: "2023-12-07", subject: "Science", time: "09:00 AM - 12:00 PM", venue: "Hall A" },
    { date: "2023-12-09", subject: "English", time: "09:00 AM - 12:00 PM", venue: "Hall B" },
    { date: "2023-12-11", subject: "Hindi", time: "09:00 AM - 11:00 AM", venue: "Hall B" },
    { date: "2023-12-13", subject: "Social Science", time: "09:00 AM - 12:00 PM", venue: "Hall A" },
  ];
  
  return (
    <PageTemplate title="Admit Cards" subtitle="Generate and print examination admit cards">
      <div className="space-y-6">
        <PageHeader
          title="Student Admit Cards"
          description="Issue and manage examination admit cards"
          primaryAction={{
            label: "Issue New Admit Card",
            onClick: () => setIsDialogOpen(true),
            icon: <FilePlus className="h-4 w-4" />
          }}
          actions={[
            <Button key="bulk" variant="outline" onClick={() => console.log("Bulk issue")}>
              Bulk Issue
            </Button>
          ]}
        />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select examination" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 flex gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 flex gap-2">
              <Input placeholder="Search by name or roll no" />
              <Button variant="secondary" className="shrink-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <DataTable
            data={students}
            columns={columns}
            keyField="id"
            selectable={true}
            actions={actions}
            onRowClick={(student) => console.log("Row clicked:", student)}
            bulkActions={[
              {
                label: "Bulk Print",
                onClick: (selectedStudents) => console.log("Bulk print:", selectedStudents),
                variant: "default"
              },
              {
                label: "Issue Selected",
                onClick: (selectedStudents) => console.log("Issue selected:", selectedStudents),
                variant: "secondary"
              }
            ]}
          />
        </div>
        
        {/* Issue Admit Card Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Issue Admit Card</DialogTitle>
              <DialogDescription>
                Generate an admit card for a student
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any additional information to be printed on the admit card"
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Issue Admit Card</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Print Preview Dialog */}
        <Dialog open={isPrintPreviewOpen} onOpenChange={setIsPrintPreviewOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Admit Card Preview</DialogTitle>
              <DialogDescription>
                Preview and print the admit card
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-white border border-gray-200 p-6 rounded-md">
              <div className="text-center border-b pb-4 mb-4">
                <h3 className="text-xl font-bold">SCHOOL NAME</h3>
                <p className="text-sm text-gray-600">School Address, City, Pin Code</p>
                <h2 className="text-lg font-bold mt-2">EXAMINATION ADMIT CARD</h2>
                <p className="text-sm">Final Term Examination 2023-24</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="col-span-2 space-y-2">
                  <div className="grid grid-cols-3">
                    <div className="text-sm font-medium">Student Name:</div>
                    <div className="col-span-2 text-sm font-bold">{selectedStudent?.name || "Aryan Sharma"}</div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="text-sm font-medium">Roll No:</div>
                    <div className="col-span-2 text-sm">{selectedStudent?.rollNo || "A001"}</div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="text-sm font-medium">Class:</div>
                    <div className="col-span-2 text-sm">{selectedStudent?.class || "Class 10"} - {selectedStudent?.section || "A"}</div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="text-sm font-medium">Admit Card No:</div>
                    <div className="col-span-2 text-sm">{selectedStudent?.admitCardNo || "FINAL2024-10A-001"}</div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="text-sm font-medium">Issue Date:</div>
                    <div className="col-span-2 text-sm">{selectedStudent?.issueDate || "2023-11-25"}</div>
                  </div>
                </div>
                
                <div className="border border-dashed border-gray-300 flex items-center justify-center">
                  <User size={64} />
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-bold mb-2">Examination Schedule</h4>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border border-gray-200 p-2 text-left">Date</th>
                      <th className="border border-gray-200 p-2 text-left">Subject</th>
                      <th className="border border-gray-200 p-2 text-left">Time</th>
                      <th className="border border-gray-200 p-2 text-left">Venue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examSchedule.map((exam, index) => (
                      <tr key={index}>
                        <td className="border border-gray-200 p-2">{exam.date}</td>
                        <td className="border border-gray-200 p-2">{exam.subject}</td>
                        <td className="border border-gray-200 p-2">{exam.time}</td>
                        <td className="border border-gray-200 p-2">{exam.venue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="text-sm">
                <p className="font-bold">Instructions:</p>
                <ol className="list-decimal list-inside text-xs space-y-1 mt-1">
                  <li>This admit card must be carried to the examination hall every day.</li>
                  <li>Students must reach the examination venue 30 minutes before the scheduled time.</li>
                  <li>No electronic devices are permitted in the examination hall.</li>
                  <li>Students will not be allowed to leave the examination hall during the first hour and last 15 minutes.</li>
                </ol>
              </div>
              
              <div className="mt-6 pt-4 border-t grid grid-cols-2">
                <div className="text-center">
                  <div className="h-8"></div>
                  <div className="text-sm">Student's Signature</div>
                </div>
                <div className="text-center">
                  <div className="h-8"></div>
                  <div className="text-sm">Principal's Signature</div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPrintPreviewOpen(false)}>
                Close
              </Button>
              <Button onClick={() => console.log("Print admit card")}>
                <Printer className="mr-2 h-4 w-4" /> Print Admit Card
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTemplate>
  );
};

export default AdmitCards;
