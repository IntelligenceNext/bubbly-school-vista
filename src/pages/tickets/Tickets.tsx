
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Filter, FileDown } from 'lucide-react';
import DataTable, { ButtonVariant, RowAction } from '@/components/DataTable';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import FileUpload from '@/components/FileUpload';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';

// Define schema for ticket form
const ticketFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  priority: z.string().min(1, 'Please select a priority'),
  visibility_scope: z.string().min(1, 'Please select visibility'),
  attachments: z.array(z.string()).optional(),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

// Mock data for tickets
const mockTickets = [
  {
    id: "TKT-001",
    title: "Projector not working in Room 203",
    description: "The projector in Room 203 is not connecting to laptops. We've tried multiple devices.",
    category: "IT",
    priority: "High",
    status: "New",
    requester_id: "user-123",
    requester_name: "John Smith",
    assigned_to_id: null,
    assigned_to_name: null,
    school_id: "school-001",
    department: "IT Support",
    created_at: "2023-05-10T09:30:00Z",
    updated_at: "2023-05-10T09:30:00Z",
    resolved_at: null,
    attachments: ["screenshot1.jpg"],
    feedback_rating: null,
    visibility_scope: "School Admin",
  },
  {
    id: "TKT-002",
    title: "Student fee discrepancy",
    description: "There appears to be a discrepancy in the fee calculation for the current term.",
    category: "Admin",
    priority: "Medium",
    status: "Assigned",
    requester_id: "user-456",
    requester_name: "Sarah Johnson",
    assigned_to_id: "staff-789",
    assigned_to_name: "Michael Davis",
    school_id: "school-001",
    department: "Finance",
    created_at: "2023-05-09T14:20:00Z",
    updated_at: "2023-05-09T15:45:00Z",
    resolved_at: null,
    attachments: ["receipt.pdf", "statement.pdf"],
    feedback_rating: null,
    visibility_scope: "Private",
  },
  {
    id: "TKT-003",
    title: "Bus route delay",
    description: "Bus number 12 is consistently arriving 15 minutes late in the morning.",
    category: "Transport",
    priority: "Medium",
    status: "In Progress",
    requester_id: "user-789",
    requester_name: "Robert Wilson",
    assigned_to_id: "staff-456",
    assigned_to_name: "Emma Thompson",
    school_id: "school-001",
    department: "Transportation",
    created_at: "2023-05-08T08:15:00Z",
    updated_at: "2023-05-08T10:30:00Z",
    resolved_at: null,
    attachments: [],
    feedback_rating: null,
    visibility_scope: "Public",
  },
  {
    id: "TKT-004",
    title: "Water leakage in Girls Hostel",
    description: "There is water leakage in Room 105 of the Girls Hostel building.",
    category: "Hostel",
    priority: "Urgent",
    status: "In Progress",
    requester_id: "user-321",
    requester_name: "Emily Brown",
    assigned_to_id: "staff-654",
    assigned_to_name: "David Clark",
    school_id: "school-001",
    department: "Maintenance",
    created_at: "2023-05-07T18:45:00Z",
    updated_at: "2023-05-07T19:30:00Z",
    resolved_at: null,
    attachments: ["leakage.jpg"],
    feedback_rating: null,
    visibility_scope: "School Admin",
  },
  {
    id: "TKT-005",
    title: "Online class access issue",
    description: "Unable to access the online class platform for Mathematics.",
    category: "Academic",
    priority: "High",
    status: "Resolved",
    requester_id: "user-852",
    requester_name: "Jessica Lee",
    assigned_to_id: "staff-357",
    assigned_to_name: "Thomas Wilson",
    school_id: "school-001",
    department: "IT Support",
    created_at: "2023-05-06T11:20:00Z",
    updated_at: "2023-05-06T14:15:00Z",
    resolved_at: "2023-05-06T14:15:00Z",
    attachments: ["error_screenshot.png"],
    feedback_rating: 4,
    visibility_scope: "Private",
  }
];

const Tickets = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Status badge color mapping
  const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "bubble" | "warning"> = {
    "New": "outline",
    "Assigned": "secondary",
    "In Progress": "bubble",
    "Resolved": "success",
    "Closed": "destructive"
  };

  // Priority badge color mapping
  const priorityColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "bubble" | "warning"> = {
    "Low": "outline",
    "Medium": "secondary",
    "High": "bubble",
    "Urgent": "destructive"
  };

  // Category badge color mapping
  const categoryColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "bubble" | "warning"> = {
    "IT": "outline",
    "Admin": "secondary",
    "Academic": "bubble",
    "Transport": "success",
    "Hostel": "warning",
    "Other": "secondary"
  };

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: '',
      visibility_scope: '',
      attachments: [],
    }
  });

  const onSubmit = (values: TicketFormValues) => {
    console.log('Form submitted:', values);
    toast({
      title: "Ticket created",
      description: "Your support ticket has been submitted successfully.",
    });
    setIsCreateDialogOpen(false);
    form.reset();
  };

  // Modified handleFileUpload to work with FileUpload component
  const handleFileUpload = (urls: string[]) => {
    console.log("Files uploaded:", urls);
    form.setValue('attachments', urls);
  };

  const columns = [
    {
      id: "id",
      header: "Ticket ID",
      cell: (row: any) => <span className="font-medium">{row.id}</span>,
      isSortable: true,
      sortKey: "id"
    },
    {
      id: "title",
      header: "Title",
      cell: (row: any) => row.title,
      isSortable: true,
      sortKey: "title"
    },
    {
      id: "category",
      header: "Category",
      cell: (row: any) => (
        <Badge variant={categoryColors[row.category]}>
          {row.category}
        </Badge>
      ),
      isSortable: true,
      sortKey: "category"
    },
    {
      id: "priority",
      header: "Priority",
      cell: (row: any) => (
        <Badge variant={priorityColors[row.priority]}>
          {row.priority}
        </Badge>
      ),
      isSortable: true,
      sortKey: "priority"
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
      id: "requester",
      header: "Requester",
      cell: (row: any) => row.requester_name,
      isSortable: true,
      sortKey: "requester_name"
    },
    {
      id: "assignee",
      header: "Assigned To",
      cell: (row: any) => row.assigned_to_name || "Not assigned",
      isSortable: true,
      sortKey: "assigned_to_name"
    },
    {
      id: "created_at",
      header: "Created",
      cell: (row: any) => new Date(row.created_at).toLocaleDateString(),
      isSortable: true,
      sortKey: "created_at"
    }
  ];

  const actions: RowAction<any>[] = [
    {
      label: "View Details",
      onClick: (ticket: any) => {
        setSelectedTicket(ticket);
        setIsViewDialogOpen(true);
      },
    },
    {
      label: "Assign",
      onClick: (ticket: any) => {
        console.log("Assign ticket:", ticket);
        // Handle assignment logic
      },
    },
    {
      label: "Close Ticket",
      onClick: (ticket: any) => {
        console.log("Close ticket:", ticket);
        // Handle ticket closing logic
      },
      variant: "destructive" as ButtonVariant
    }
  ];

  return (
    <PageTemplate title="Tickets" subtitle="Manage support tickets and requests">
      <div className="space-y-6">
        <PageHeader
          title="Support Tickets"
          description="View and manage all support requests"
          primaryAction={{
            label: "Create New Ticket",
            onClick: () => setIsCreateDialogOpen(true),
            icon: <Plus className="h-4 w-4" />
          }}
          actions={[
            <Button key="filter" variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>,
            <Button key="export" variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
          ]}
        />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <DataTable
            data={mockTickets}
            columns={columns}
            keyField="id"
            selectable={true}
            actions={actions}
            onRowClick={(ticket) => {
              setSelectedTicket(ticket);
              setIsViewDialogOpen(true);
            }}
            bulkActions={[
              {
                label: "Bulk Assign",
                onClick: (selectedTickets) => console.log("Bulk assign:", selectedTickets),
              },
              {
                label: "Bulk Close",
                onClick: (selectedTickets) => console.log("Bulk close:", selectedTickets),
                variant: "destructive" as ButtonVariant
              }
            ]}
          />
        </div>
        
        {/* Create Ticket Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Submit a New Ticket</DialogTitle>
              <DialogDescription>
                Fill out the form to create a new support ticket.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a brief title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your issue in detail" 
                          {...field} 
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="IT">IT</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Academic">Academic</SelectItem>
                            <SelectItem value="Transport">Transport</SelectItem>
                            <SelectItem value="Hostel">Hostel</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="visibility_scope"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visibility</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Private">Private</SelectItem>
                            <SelectItem value="Public">Public</SelectItem>
                            <SelectItem value="School Admin">School Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <FormLabel>Attachments (Optional)</FormLabel>
                  {/* Fixed FileUpload component usage */}
                  <FileUpload 
                    bucket="attachments"
                    onUploadComplete={handleFileUpload}
                    acceptedFileTypes={['image', 'pdf', 'doc']}
                    maxFiles={5}
                    maxSizeInMB={10}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Ticket</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* View Ticket Dialog */}
        {selectedTicket && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedTicket.id}: {selectedTicket.title}
                  <Badge variant={statusColors[selectedTicket.status]} className="ml-2">
                    {selectedTicket.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Created on {new Date(selectedTicket.created_at).toLocaleDateString()} by {selectedTicket.requester_name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Category</p>
                    <Badge variant={categoryColors[selectedTicket.category]}>
                      {selectedTicket.category}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Priority</p>
                    <Badge variant={priorityColors[selectedTicket.priority]}>
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Description</p>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    {selectedTicket.description}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Assigned To</p>
                  <p className="text-sm">{selectedTicket.assigned_to_name || "Not yet assigned"}</p>
                </div>
                
                {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Attachments</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTicket.attachments.map((file: string, index: number) => (
                        <div key={index} className="bg-gray-100 px-3 py-1 rounded-md text-xs flex items-center">
                          {file}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium mb-2">Comments</p>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between">
                        <p className="text-xs font-medium">Michael Davis</p>
                        <p className="text-xs text-gray-500">2023-05-09T16:30:00Z</p>
                      </div>
                      <p className="text-sm mt-1">Looking into this issue. Will update once I have more information.</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Textarea 
                      placeholder="Add a comment..." 
                      rows={2}
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm">Post Comment</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <div className="flex w-full justify-between">
                  <Button variant="destructive" size="sm">
                    Close Ticket
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setIsViewDialogOpen(false)}>
                      Close
                    </Button>
                    <Button size="sm">
                      Update Status
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageTemplate>
  );
};

export default Tickets;
