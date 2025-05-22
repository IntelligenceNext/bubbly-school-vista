
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter } from 'lucide-react';
import DataTable, { RowAction, ButtonVariant } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
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
  SelectValue
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Define schema for book issue form
const issueFormSchema = z.object({
  book_id: z.string().min(1, 'Please select a book'),
  user_id: z.string().min(1, 'Please select a user'),
  issue_date: z.date(),
  due_date: z.date(),
  remarks: z.string().optional(),
});

type IssueFormValues = z.infer<typeof issueFormSchema>;

// Mock data for issued books
const mockIssuedBooks = [
  {
    id: "ISS-001",
    book_id: "BK-001",
    book_title: "To Kill a Mockingbird",
    user_id: "USR-101",
    user_name: "John Smith",
    user_type: "Student",
    user_grade: "Grade 10",
    issue_date: "2023-05-10T09:30:00Z",
    due_date: "2023-05-24T09:30:00Z",
    return_date: null,
    status: "Issued",
    fine_amount: null,
    remarks: "First issue"
  },
  {
    id: "ISS-002",
    book_id: "BK-003",
    book_title: "Introduction to Algorithms",
    user_id: "USR-102",
    user_name: "Emily Parker",
    user_type: "Student",
    user_grade: "Grade 12",
    issue_date: "2023-05-08T14:15:00Z",
    due_date: "2023-05-22T14:15:00Z",
    return_date: null,
    status: "Issued",
    fine_amount: null,
    remarks: null
  },
  {
    id: "ISS-003",
    book_id: "BK-005",
    book_title: "World History: Modern Era",
    user_id: "USR-103",
    user_name: "Michael Wong",
    user_type: "Student",
    user_grade: "Grade 11",
    issue_date: "2023-04-25T10:20:00Z",
    due_date: "2023-05-09T10:20:00Z",
    return_date: null,
    status: "Overdue",
    fine_amount: 3.50,
    remarks: null
  },
  {
    id: "ISS-004",
    book_id: "BK-002",
    book_title: "The Great Gatsby",
    user_id: "USR-104",
    user_name: "Sarah Johnson",
    user_type: "Teacher",
    user_grade: null,
    issue_date: "2023-05-15T11:45:00Z",
    due_date: "2023-05-29T11:45:00Z",
    return_date: null,
    status: "Issued",
    fine_amount: null,
    remarks: "Teacher reference"
  },
  {
    id: "ISS-005",
    book_id: "BK-004",
    book_title: "Physics for Scientists and Engineers",
    user_id: "USR-105",
    user_name: "Robert Wilson",
    user_type: "Student",
    user_grade: "Grade 12",
    issue_date: "2023-04-20T09:00:00Z",
    due_date: "2023-05-04T09:00:00Z",
    return_date: "2023-05-03T15:30:00Z",
    status: "Returned",
    fine_amount: null,
    remarks: null
  }
];

// Mock data for available books (to select in the form)
const availableBooks = [
  { id: "BK-001", title: "To Kill a Mockingbird" },
  { id: "BK-002", title: "The Great Gatsby" },
  { id: "BK-004", title: "Physics for Scientists and Engineers" },
  { id: "BK-006", title: "Macbeth" },
  { id: "BK-007", title: "Advanced Mathematics Vol. 1" }
];

// Mock data for users (to select in the form)
const users = [
  { id: "USR-101", name: "John Smith", type: "Student" },
  { id: "USR-102", name: "Emily Parker", type: "Student" },
  { id: "USR-103", name: "Michael Wong", type: "Student" },
  { id: "USR-104", name: "Sarah Johnson", type: "Teacher" },
  { id: "USR-105", name: "Robert Wilson", type: "Student" },
  { id: "USR-106", name: "Jessica Lee", type: "Student" },
  { id: "USR-107", name: "David Brown", type: "Teacher" }
];

const BooksIssued = () => {
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      book_id: '',
      user_id: '',
      issue_date: new Date(),
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default to 14 days from now
      remarks: '',
    }
  });

  const onSubmit = (values: IssueFormValues) => {
    console.log('Form submitted:', values);
    toast({
      title: "Book issued",
      description: "The book has been issued successfully.",
    });
    setIsIssueDialogOpen(false);
    form.reset();
  };

  const handleReturnBook = () => {
    if (!selectedIssue) return;
    
    console.log('Book returned:', selectedIssue);
    toast({
      title: "Book returned",
      description: `"${selectedIssue.book_title}" has been returned successfully.`,
    });
    setIsReturnDialogOpen(false);
    setSelectedIssue(null);
  };

  const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "bubble" | "warning"> = {
    "Issued": "success",
    "Overdue": "destructive",
    "Returned": "secondary"
  };

  const userTypeColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "bubble" | "warning"> = {
    "Student": "bubble",
    "Teacher": "success",
    "Staff": "secondary",
    "Guest": "outline"
  };

  // Function to calculate days remaining/overdue
  const getDaysStatus = (dueDate: string, returnDate: string | null) => {
    if (returnDate) return { label: "Returned", days: 0 };
    
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { label: "Overdue", days: Math.abs(diffDays) };
    }
    
    return { label: "Remaining", days: diffDays };
  };

  // Calculate fine for overdue books
  const calculateFine = (dueDate: string, returnDate: string | null, fineAmount: number | null) => {
    if (returnDate || fineAmount !== null) return fineAmount || 0;
    
    const daysStatus = getDaysStatus(dueDate, returnDate);
    if (daysStatus.label !== "Overdue") return 0;
    
    // Example fine calculation: $0.25 per day overdue
    return Number((daysStatus.days * 0.25).toFixed(2));
  };

  const columns = [
    {
      id: "id",
      header: "Issue ID",
      cell: (row: any) => <span className="font-medium">{row.id}</span>,
      isSortable: true,
      sortKey: "id"
    },
    {
      id: "book",
      header: "Book",
      cell: (row: any) => (
        <div>
          <div className="font-medium">{row.book_title}</div>
          <div className="text-xs text-muted-foreground">{row.book_id}</div>
        </div>
      ),
      isSortable: true,
      sortKey: "book_title"
    },
    {
      id: "user",
      header: "Issued To",
      cell: (row: any) => (
        <div>
          <div className="flex items-center gap-2">
            <span>{row.user_name}</span>
            <Badge variant={userTypeColors[row.user_type]}>
              {row.user_type}
            </Badge>
          </div>
          {row.user_grade && (
            <div className="text-xs text-muted-foreground">{row.user_grade}</div>
          )}
        </div>
      ),
      isSortable: true,
      sortKey: "user_name"
    },
    {
      id: "dates",
      header: "Dates",
      cell: (row: any) => {
        const daysStatus = getDaysStatus(row.due_date, row.return_date);
        return (
          <div>
            <div className="text-xs">
              Issued: {format(new Date(row.issue_date), 'MMM dd, yyyy')}
            </div>
            <div className="text-xs">
              Due: {format(new Date(row.due_date), 'MMM dd, yyyy')}
              {!row.return_date && daysStatus.label === "Remaining" && (
                <span className="ml-2 text-green-600">
                  ({daysStatus.days} days left)
                </span>
              )}
              {!row.return_date && daysStatus.label === "Overdue" && (
                <span className="ml-2 text-red-600">
                  ({daysStatus.days} days overdue)
                </span>
              )}
            </div>
            {row.return_date && (
              <div className="text-xs">
                Returned: {format(new Date(row.return_date), 'MMM dd, yyyy')}
              </div>
            )}
          </div>
        );
      },
      isSortable: true,
      sortKey: "due_date"
    },
    {
      id: "status",
      header: "Status",
      cell: (row: any) => (
        <Badge variant={statusColors[row.status]}>
          {row.status}
        </Badge>
      ),
      isSortable: true,
      sortKey: "status"
    },
    {
      id: "fine",
      header: "Fine",
      cell: (row: any) => {
        const fine = calculateFine(row.due_date, row.return_date, row.fine_amount);
        if (fine <= 0) return <span>$0.00</span>;
        
        return <span className="font-medium text-red-600">${fine.toFixed(2)}</span>;
      },
      isSortable: true,
      sortKey: "fine_amount"
    }
  ];

  const actions: RowAction<any>[] = [
    {
      label: "View Details",
      onClick: (issue: any) => {
        console.log("View issue details:", issue);
        // Handle view logic
      },
    },
    {
      label: "Return Book",
      onClick: (issue: any) => {
        if (issue.status !== "Returned") {
          setSelectedIssue(issue);
          setIsReturnDialogOpen(true);
        } else {
          toast({
            title: "Already returned",
            description: "This book has already been returned.",
          });
        }
      },
      variant: issue => issue.status === "Returned" ? "secondary" : "default"
    },
    {
      label: "Renew Issue",
      onClick: (issue: any) => {
        if (issue.status !== "Returned") {
          console.log("Renew issue:", issue);
          toast({
            title: "Issue renewed",
            description: "The book issue has been renewed for 14 more days.",
          });
        } else {
          toast({
            title: "Cannot renew",
            description: "Cannot renew a returned book.",
            variant: "destructive"
          });
        }
      },
    }
  ];

  return (
    <PageTemplate title="Books Issued" subtitle="Track books issued to students and staff">
      <div className="space-y-6">
        <PageHeader
          title="Books Issued"
          description="Track and manage book issuances and returns"
          primaryAction={{
            label: "Issue New Book",
            onClick: () => setIsIssueDialogOpen(true),
            icon: <Plus className="h-4 w-4" />
          }}
          actions={[
            <Button key="filter" variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>,
            <Button key="export" variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          ]}
        />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <DataTable
            data={mockIssuedBooks}
            columns={columns}
            keyField="id"
            selectable={true}
            actions={actions}
            bulkActions={[
              {
                label: "Export Selected",
                onClick: (selected) => console.log("Export selected:", selected),
              },
              {
                label: "Mark as Returned",
                onClick: (selected) => {
                  console.log("Mark selected as returned:", selected);
                  toast({
                    title: "Books returned",
                    description: `${selected.length} books have been marked as returned.`,
                  });
                },
              }
            ]}
          />
        </div>
        
        {/* Issue Book Dialog */}
        <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Issue a Book</DialogTitle>
              <DialogDescription>
                Complete the form to issue a book to a student or staff member.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="book_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Book</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a book" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableBooks.map(book => (
                            <SelectItem key={book.id} value={book.id}>
                              {book.title} ({book.id})
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
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select User</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} ({user.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="issue_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Issue Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
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
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
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
                              disabled={(date) => date < new Date()}
                              initialFocus
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
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Add any additional notes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsIssueDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Issue Book</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Return Book Dialog */}
        {selectedIssue && (
          <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Return Book</DialogTitle>
                <DialogDescription>
                  Confirm the return of this book.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="border rounded-md p-4">
                  <p className="text-sm font-medium">Book Details</p>
                  <p className="text-lg font-bold">{selectedIssue.book_title}</p>
                  <p className="text-sm text-muted-foreground">ID: {selectedIssue.book_id}</p>
                  
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium">Issued To</p>
                    <p>{selectedIssue.user_name} ({selectedIssue.user_type})</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Issue Date</p>
                        <p>{format(new Date(selectedIssue.issue_date), 'MMM dd, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <p>{format(new Date(selectedIssue.due_date), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {getDaysStatus(selectedIssue.due_date, null).label === "Overdue" && (
                  <div className="border border-red-200 bg-red-50 rounded-md p-4">
                    <p className="text-red-600 font-medium">Overdue Notice</p>
                    <p className="text-sm">
                      This book is overdue by {getDaysStatus(selectedIssue.due_date, null).days} days.
                      A fine of ${calculateFine(selectedIssue.due_date, null, selectedIssue.fine_amount).toFixed(2)} will be applied.
                    </p>
                  </div>
                )}
                
                <div>
                  <FormLabel>Condition on Return</FormLabel>
                  <Select defaultValue="good">
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <FormLabel>Return Notes (Optional)</FormLabel>
                  <Input placeholder="Add any additional notes" />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsReturnDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleReturnBook}>Confirm Return</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageTemplate>
  );
};

export default BooksIssued;
