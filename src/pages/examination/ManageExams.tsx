
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, Edit, Trash, FilePlus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Badge } from '@/components/ui/badge';

const ManageExams = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Mock data for exams
  const exams = [
    {
      id: "1",
      name: "Final Term Examination",
      session: "2023-2024",
      term: "Term 2",
      startDate: "2023-12-05",
      endDate: "2023-12-18",
      resultPublishDate: "2023-12-28",
      status: "Upcoming"
    },
    {
      id: "2",
      name: "Mid Term Assessment",
      session: "2023-2024",
      term: "Term 1",
      startDate: "2023-08-15",
      endDate: "2023-08-25",
      resultPublishDate: "2023-09-05",
      status: "Completed"
    },
    {
      id: "3",
      name: "First Unit Test",
      session: "2023-2024",
      term: "Term 1",
      startDate: "2023-07-10",
      endDate: "2023-07-15",
      resultPublishDate: "2023-07-25",
      status: "Completed"
    },
    {
      id: "4",
      name: "Pre-Board Examination",
      session: "2023-2024",
      term: "Term 2",
      startDate: "2023-11-10",
      endDate: "2023-11-20",
      resultPublishDate: "2023-11-30",
      status: "Ongoing"
    }
  ];
  
  // Form schema for exam creation/editing
  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    session: z.string().min(3, "Please select a valid session"),
    term: z.string().min(1, "Please enter the term"),
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z.date({
      required_error: "End date is required",
    }),
    resultPublishDate: z.date({
      required_error: "Result publish date is required",
    }),
    description: z.string().optional(),
  });
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      session: "2023-2024",
      term: "",
      description: ""
    }
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
    setIsDialogOpen(false);
    form.reset();
  };
  
  // Status badge color mapping
  const statusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    "Upcoming": "outline",
    "Ongoing": "secondary",
    "Completed": "default",
  };

  // Table columns
  const columns = [
    {
      id: "name",
      header: "Exam Name",
      cell: (row: any) => <span className="font-medium">{row.name}</span>,
      isSortable: true,
      sortKey: "name"
    },
    {
      id: "session",
      header: "Session",
      cell: (row: any) => row.session,
      isSortable: true,
      sortKey: "session"
    },
    {
      id: "term",
      header: "Term",
      cell: (row: any) => row.term,
      isSortable: true,
      sortKey: "term"
    },
    {
      id: "dateRange",
      header: "Exam Period",
      cell: (row: any) => (
        <span>
          {row.startDate} to {row.endDate}
        </span>
      ),
      isSortable: false
    },
    {
      id: "resultDate",
      header: "Result Date",
      cell: (row: any) => row.resultPublishDate,
      isSortable: true,
      sortKey: "resultPublishDate"
    },
    {
      id: "status",
      header: "Status",
      cell: (row: any) => (
        <Badge variant={statusColor[row.status]}>
          {row.status}
        </Badge>
      ),
      isSortable: true,
      sortKey: "status"
    }
  ];
  
  // Table actions
  const actions = [
    {
      label: "Edit Exam",
      onClick: (exam: any) => {
        console.log("Edit exam:", exam);
      },
    },
    {
      label: "Delete",
      onClick: (exam: any) => {
        console.log("Delete exam:", exam);
      },
      variant: "destructive"
    },
    {
      label: "Schedule Groups",
      onClick: (exam: any) => {
        console.log("Schedule groups for exam:", exam);
      }
    }
  ];
  
  return (
    <PageTemplate title="Manage Exams" subtitle="Create and manage examination schedules">
      <div className="space-y-6">
        <PageHeader
          title="Examinations"
          description="Create, edit and schedule exams"
          primaryAction={{
            label: "Create New Exam",
            onClick: () => setIsDialogOpen(true),
            icon: <FilePlus className="h-4 w-4" />
          }}
        />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <DataTable
            data={exams}
            columns={columns}
            keyField="id"
            selectable={true}
            actions={actions}
            onRowClick={(exam) => console.log("Row clicked:", exam)}
            bulkActions={[
              {
                label: "Delete Selected",
                onClick: (selectedExams) => console.log("Delete selected:", selectedExams),
                variant: "destructive"
              }
            ]}
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Examination</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new exam schedule.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exam Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Final Term Examination" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="session"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Session</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 2023-2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Term</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Term 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
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
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
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
                  
                  <FormField
                    control={form.control}
                    name="resultPublishDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Result Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
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
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional information or notes about this examination"
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
                  <Button type="submit">Create Exam</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </PageTemplate>
  );
};

export default ManageExams;
