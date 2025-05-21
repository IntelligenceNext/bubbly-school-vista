
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Edit, Trash, Book } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";

const ManageGroups = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Mock data for exam groups
  const examGroups = [
    {
      id: "1",
      exam: "Final Term Examination",
      subject: "Mathematics",
      class: "Class 10",
      section: "A",
      date: "2023-12-05",
      time: "09:00 AM - 12:00 PM",
      room: "Hall A",
      fullMarks: 100,
      passMarks: 33,
    },
    {
      id: "2",
      exam: "Final Term Examination",
      subject: "Science",
      class: "Class 10",
      section: "A",
      date: "2023-12-07",
      time: "09:00 AM - 12:00 PM",
      room: "Hall A",
      fullMarks: 100,
      passMarks: 33,
    },
    {
      id: "3",
      exam: "Final Term Examination",
      subject: "English",
      class: "Class 10",
      section: "A",
      date: "2023-12-09",
      time: "09:00 AM - 12:00 PM",
      room: "Hall B",
      fullMarks: 100,
      passMarks: 33,
    },
    {
      id: "4",
      exam: "Mid Term Assessment",
      subject: "Mathematics",
      class: "Class 8",
      section: "B",
      date: "2023-08-15",
      time: "10:00 AM - 12:00 PM",
      room: "Room 101",
      fullMarks: 50,
      passMarks: 17,
    },
    {
      id: "5",
      exam: "Mid Term Assessment",
      subject: "History",
      class: "Class 9",
      section: "A",
      date: "2023-08-16",
      time: "10:00 AM - 12:00 PM",
      room: "Room 102",
      fullMarks: 50,
      passMarks: 17,
    }
  ];
  
  // Mock data for dropdowns
  const exams = [
    { id: "1", name: "Final Term Examination" },
    { id: "2", name: "Mid Term Assessment" },
    { id: "3", name: "First Unit Test" },
    { id: "4", name: "Pre-Board Examination" }
  ];
  
  const classes = [
    { id: "1", name: "Class 1" },
    { id: "2", name: "Class 2" },
    { id: "8", name: "Class 8" },
    { id: "9", name: "Class 9" },
    { id: "10", name: "Class 10" },
    { id: "11", name: "Class 11" },
    { id: "12", name: "Class 12" }
  ];
  
  const sections = [
    { id: "A", name: "Section A" },
    { id: "B", name: "Section B" },
    { id: "C", name: "Section C" },
  ];
  
  const subjects = [
    { id: "1", name: "Mathematics" },
    { id: "2", name: "Science" },
    { id: "3", name: "English" },
    { id: "4", name: "History" },
    { id: "5", name: "Geography" },
    { id: "6", name: "Physics" },
    { id: "7", name: "Chemistry" },
    { id: "8", name: "Biology" }
  ];
  
  // Form schema for exam group creation/editing
  const formSchema = z.object({
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
    }),
    fullMarks: z.string().transform((val) => parseInt(val)),
    passMarks: z.string().transform((val) => parseInt(val)),
    examDate: z.date({
      required_error: "Exam date is required",
    }),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time (HH:MM)"),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time (HH:MM)"),
    roomNo: z.string().min(1, "Room number is required"),
  });
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullMarks: "100",
      passMarks: "33",
      startTime: "09:00",
      endTime: "11:00",
      roomNo: ""
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
      id: "exam",
      header: "Examination",
      cell: (row: any) => <span className="font-medium">{row.exam}</span>,
      isSortable: true,
      sortKey: "exam"
    },
    {
      id: "subject",
      header: "Subject",
      cell: (row: any) => (
        <div className="flex items-center">
          <Book className="h-4 w-4 mr-2 text-slate-500" />
          {row.subject}
        </div>
      ),
      isSortable: true,
      sortKey: "subject"
    },
    {
      id: "class",
      header: "Class",
      cell: (row: any) => (
        <span>{row.class} {row.section && `- ${row.section}`}</span>
      ),
      isSortable: true,
      sortKey: "class"
    },
    {
      id: "schedule",
      header: "Schedule",
      cell: (row: any) => (
        <div>
          <div>{row.date}</div>
          <div className="text-sm text-muted-foreground">{row.time}</div>
        </div>
      ),
      isSortable: true,
      sortKey: "date"
    },
    {
      id: "room",
      header: "Room",
      cell: (row: any) => row.room,
      isSortable: true,
      sortKey: "room"
    },
    {
      id: "marks",
      header: "Marks",
      cell: (row: any) => (
        <div>
          <div>Full: {row.fullMarks}</div>
          <div className="text-sm text-muted-foreground">Pass: {row.passMarks}</div>
        </div>
      ),
      isSortable: false
    }
  ];
  
  // Table actions
  const actions = [
    {
      label: "Edit",
      onClick: (group: any) => {
        console.log("Edit group:", group);
      },
    },
    {
      label: "Delete",
      onClick: (group: any) => {
        console.log("Delete group:", group);
      },
      variant: "destructive"
    }
  ];
  
  return (
    <PageTemplate title="Manage Groups" subtitle="Organize exam groups by class, section, and subject">
      <div className="space-y-6">
        <PageHeader
          title="Examination Groups"
          description="Create and manage examination schedules by subject"
          primaryAction={{
            label: "Add Exam Group",
            onClick: () => setIsDialogOpen(true),
          }}
        />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <DataTable
            data={examGroups}
            columns={columns}
            keyField="id"
            selectable={true}
            actions={actions}
            onRowClick={(group) => console.log("Row clicked:", group)}
            bulkActions={[
              {
                label: "Delete Selected",
                onClick: (selectedGroups) => console.log("Delete selected:", selectedGroups),
                variant: "destructive"
              }
            ]}
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Exam Group</DialogTitle>
              <DialogDescription>
                Schedule an examination for a specific class, section, and subject
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                  
                  <FormField
                    control={form.control}
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullMarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Marks</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="passMarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pass Marks</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="examDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Exam Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="roomNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room/Hall</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Hall A, Room 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Schedule Exam</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </PageTemplate>
  );
};

export default ManageGroups;
