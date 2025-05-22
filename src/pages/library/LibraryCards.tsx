
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter, Search, Printer, QrCode } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format, addMonths, addYears } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

// Define schema for library card form
const cardFormSchema = z.object({
  user_id: z.string().min(1, 'Please select a user'),
  issue_date: z.date(),
  expiry_date: z.date(),
  card_type: z.string().min(1, 'Please select card type'),
  max_books: z.number().min(1, 'Minimum allowed books is 1'),
});

type CardFormValues = z.infer<typeof cardFormSchema>;

// Mock data for library cards
const mockLibraryCards = [
  {
    id: "LC-001",
    card_number: "LC20230001",
    user_id: "USR-101",
    user_name: "John Smith",
    user_type: "Student",
    user_grade: "Grade 10",
    user_avatar: null,
    issue_date: "2023-01-15T09:30:00Z",
    expiry_date: "2024-01-15T09:30:00Z",
    status: "Active",
    max_books: 3,
    books_borrowed: 1,
    fine_balance: 0
  },
  {
    id: "LC-002",
    card_number: "LC20230002",
    user_id: "USR-102",
    user_name: "Emily Parker",
    user_type: "Student",
    user_grade: "Grade 12",
    user_avatar: null,
    issue_date: "2023-01-20T10:15:00Z",
    expiry_date: "2024-01-20T10:15:00Z",
    status: "Active",
    max_books: 3,
    books_borrowed: 2,
    fine_balance: 0
  },
  {
    id: "LC-003",
    card_number: "LC20230003",
    user_id: "USR-103",
    user_name: "Michael Wong",
    user_type: "Student",
    user_grade: "Grade 11",
    user_avatar: null,
    issue_date: "2023-02-05T14:20:00Z",
    expiry_date: "2024-02-05T14:20:00Z",
    status: "Active",
    max_books: 3,
    books_borrowed: 0,
    fine_balance: 3.25
  },
  {
    id: "LC-004",
    card_number: "LC20230004",
    user_id: "USR-104",
    user_name: "Sarah Johnson",
    user_type: "Teacher",
    user_grade: null,
    user_avatar: null,
    issue_date: "2023-02-10T11:45:00Z",
    expiry_date: "2024-02-10T11:45:00Z",
    status: "Active",
    max_books: 5,
    books_borrowed: 3,
    fine_balance: 0
  },
  {
    id: "LC-005",
    card_number: "LC20230005",
    user_id: "USR-105",
    user_name: "Robert Wilson",
    user_type: "Student",
    user_grade: "Grade 12",
    user_avatar: null,
    issue_date: "2023-01-05T09:00:00Z",
    expiry_date: "2023-05-05T09:00:00Z",
    status: "Expired",
    max_books: 3,
    books_borrowed: 0,
    fine_balance: 0
  }
];

// Mock data for users
const users = [
  { id: "USR-101", name: "John Smith", type: "Student", grade: "Grade 10" },
  { id: "USR-102", name: "Emily Parker", type: "Student", grade: "Grade 12" },
  { id: "USR-103", name: "Michael Wong", type: "Student", grade: "Grade 11" },
  { id: "USR-104", name: "Sarah Johnson", type: "Teacher", grade: null },
  { id: "USR-105", name: "Robert Wilson", type: "Student", grade: "Grade 12" },
  { id: "USR-106", name: "Jessica Lee", type: "Student", grade: "Grade 9" },
  { id: "USR-107", name: "David Brown", type: "Teacher", grade: null },
  { id: "USR-108", name: "Amanda White", type: "Staff", grade: null }
];

const LibraryCards = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      user_id: '',
      issue_date: new Date(),
      expiry_date: addYears(new Date(), 1), // Default to 1 year from now
      card_type: 'student',
      max_books: 3,
    }
  });

  const onSubmit = (values: CardFormValues) => {
    console.log('Form submitted:', values);
    toast({
      title: "Library card created",
      description: "The library card has been issued successfully.",
    });
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleCardTypeChange = (value: string) => {
    // Update max books based on card type
    if (value === 'student') {
      form.setValue('max_books', 3);
    } else if (value === 'teacher') {
      form.setValue('max_books', 5);
    } else if (value === 'staff') {
      form.setValue('max_books', 4);
    }
    
    // Update expiry date based on card type
    if (value === 'student' || value === 'staff') {
      form.setValue('expiry_date', addYears(new Date(), 1));
    } else if (value === 'teacher') {
      form.setValue('expiry_date', addYears(new Date(), 2));
    }
  };

  const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "bubble" | "warning"> = {
    "Active": "success",
    "Expired": "destructive",
    "Suspended": "warning"
  };

  const userTypeColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "bubble" | "warning"> = {
    "Student": "bubble",
    "Teacher": "success",
    "Staff": "secondary",
    "Guest": "outline"
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const isCardExpired = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    return expiry < now;
  };

  const columns = [
    {
      id: "card_number",
      header: "Card Number",
      cell: (row: any) => <span className="font-medium">{row.card_number}</span>,
      isSortable: true,
      sortKey: "card_number"
    },
    {
      id: "user",
      header: "User",
      cell: (row: any) => (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={row.user_avatar} />
            <AvatarFallback>{getInitials(row.user_name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.user_name}</div>
            <div className="flex items-center">
              <Badge variant={userTypeColors[row.user_type]} className="mr-1">
                {row.user_type}
              </Badge>
              {row.user_grade && (
                <span className="text-xs text-muted-foreground">{row.user_grade}</span>
              )}
            </div>
          </div>
        </div>
      ),
      isSortable: true,
      sortKey: "user_name"
    },
    {
      id: "validity",
      header: "Validity",
      cell: (row: any) => (
        <div>
          <div className="text-xs">
            From: {format(new Date(row.issue_date), 'dd MMM yyyy')}
          </div>
          <div className="text-xs">
            To: {format(new Date(row.expiry_date), 'dd MMM yyyy')}
          </div>
        </div>
      ),
      isSortable: true,
      sortKey: "expiry_date"
    },
    {
      id: "status",
      header: "Status",
      cell: (row: any) => {
        // Check if expired but status hasn't been updated
        const status = isCardExpired(row.expiry_date) ? "Expired" : row.status;
        return (
          <Badge variant={statusColors[status]}>
            {status}
          </Badge>
        );
      },
      isSortable: true,
      sortKey: "status"
    },
    {
      id: "books",
      header: "Books",
      cell: (row: any) => (
        <div>
          <div className="font-medium">
            {row.books_borrowed} / {row.max_books}
          </div>
          {row.fine_balance > 0 && (
            <div className="text-xs text-red-600">
              Fine: ${row.fine_balance.toFixed(2)}
            </div>
          )}
        </div>
      ),
      isSortable: true,
      sortKey: "books_borrowed"
    }
  ];

  const actions: RowAction<any>[] = [
    {
      label: "View Details",
      onClick: (card: any) => {
        setSelectedCard(card);
        setIsViewDialogOpen(true);
      },
    },
    {
      label: "Print Card",
      onClick: (card: any) => {
        setSelectedCard(card);
        setIsPrintDialogOpen(true);
      },
    },
    {
      label: "Renew Card",
      onClick: (card: any) => {
        // Only allow renewal if card is expired or active
        if (card.status !== "Suspended") {
          console.log("Renew card:", card);
          toast({
            title: "Card renewed",
            description: "The library card has been renewed for one year.",
          });
        } else {
          toast({
            title: "Cannot renew",
            description: "Suspended cards cannot be renewed. Please resolve outstanding issues first.",
            variant: "destructive"
          });
        }
      },
    },
    {
      label: "Suspend Card",
      onClick: (card: any) => {
        if (card.status !== "Suspended") {
          console.log("Suspend card:", card);
          toast({
            title: "Card suspended",
            description: "The library card has been suspended.",
          });
        } else {
          console.log("Reactivate card:", card);
          toast({
            title: "Card reactivated",
            description: "The library card has been reactivated.",
          });
        }
      },
      variant: card => card.status === "Suspended" ? "success" : "warning"
    }
  ];

  const handleUserCheckboxChange = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  return (
    <PageTemplate title="Library Cards" subtitle="Manage student and staff library cards">
      <div className="space-y-6">
        <PageHeader
          title="Library Cards"
          description="Manage library cards for students and staff"
          primaryAction={{
            label: "Create New Card",
            onClick: () => setIsCreateDialogOpen(true),
            icon: <Plus className="h-4 w-4" />
          }}
          actions={[
            <Button key="print-batch" variant="outline" size="sm" onClick={() => setIsPrintDialogOpen(true)}>
              <Printer className="h-4 w-4 mr-2" />
              Batch Print
            </Button>,
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
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active Cards</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
              <TabsTrigger value="suspended">Suspended</TabsTrigger>
              <TabsTrigger value="all">All Cards</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-0">
              <DataTable
                data={mockLibraryCards.filter(card => !isCardExpired(card.expiry_date) && card.status === "Active")}
                columns={columns}
                keyField="id"
                selectable={true}
                actions={actions}
                bulkActions={[
                  {
                    label: "Print Selected",
                    onClick: (selected) => {
                      console.log("Print selected:", selected);
                      toast({
                        title: "Cards sent to printer",
                        description: `${selected.length} cards have been sent to the printer.`,
                      });
                    },
                  },
                  {
                    label: "Renew Selected",
                    onClick: (selected) => {
                      console.log("Renew selected:", selected);
                      toast({
                        title: "Cards renewed",
                        description: `${selected.length} cards have been renewed.`,
                      });
                    },
                  }
                ]}
              />
            </TabsContent>
            
            <TabsContent value="expired" className="mt-0">
              <DataTable
                data={mockLibraryCards.filter(card => isCardExpired(card.expiry_date) || card.status === "Expired")}
                columns={columns}
                keyField="id"
                selectable={true}
                actions={actions}
                bulkActions={[
                  {
                    label: "Renew Selected",
                    onClick: (selected) => {
                      console.log("Renew selected:", selected);
                      toast({
                        title: "Cards renewed",
                        description: `${selected.length} cards have been renewed.`,
                      });
                    },
                  }
                ]}
              />
            </TabsContent>
            
            <TabsContent value="suspended" className="mt-0">
              <DataTable
                data={mockLibraryCards.filter(card => card.status === "Suspended")}
                columns={columns}
                keyField="id"
                selectable={true}
                actions={actions}
              />
            </TabsContent>
            
            <TabsContent value="all" className="mt-0">
              <DataTable
                data={mockLibraryCards}
                columns={columns}
                keyField="id"
                selectable={true}
                actions={actions}
                bulkActions={[
                  {
                    label: "Print Selected",
                    onClick: (selected) => {
                      console.log("Print selected:", selected);
                      toast({
                        title: "Cards sent to printer",
                        description: `${selected.length} cards have been sent to the printer.`,
                      });
                    },
                  },
                  {
                    label: "Renew Selected",
                    onClick: (selected) => {
                      console.log("Renew selected:", selected);
                      toast({
                        title: "Cards renewed",
                        description: `${selected.length} cards have been renewed.`,
                      });
                    },
                  }
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Create Card Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Library Card</DialogTitle>
              <DialogDescription>
                Issue a new library card to a student, teacher, or staff member.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
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
                              {user.name} ({user.type}) {user.grade ? ` - ${user.grade}` : ''}
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
                  name="card_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Type</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleCardTypeChange(value);
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select card type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
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
                    name="expiry_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expiry Date</FormLabel>
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
                              disabled={(date) => date <= new Date()}
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
                  name="max_books"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Books Allowed</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Card</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* View Card Dialog */}
        {selectedCard && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Library Card Details</DialogTitle>
                <DialogDescription>
                  Card Number: {selectedCard.card_number}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Library Card Preview */}
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-primary p-4 text-white">
                    <h3 className="text-lg font-bold">School Library Card</h3>
                    <p className="text-sm opacity-80">Academic Year 2023-2024</p>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedCard.user_avatar} />
                        <AvatarFallback className="text-lg">{getInitials(selectedCard.user_name)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold">{selectedCard.user_name}</h4>
                        <div className="flex items-center">
                          <Badge variant={userTypeColors[selectedCard.user_type]} className="mr-2">
                            {selectedCard.user_type}
                          </Badge>
                          {selectedCard.user_grade && (
                            <span className="text-sm">{selectedCard.user_grade}</span>
                          )}
                        </div>
                        <p className="text-sm">ID: {selectedCard.user_id}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Card Number</p>
                        <p className="font-mono">{selectedCard.card_number}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <Badge variant={statusColors[selectedCard.status]}>
                          {selectedCard.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Issue Date</p>
                        <p>{format(new Date(selectedCard.issue_date), 'dd MMM yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Expiry Date</p>
                        <p>{format(new Date(selectedCard.expiry_date), 'dd MMM yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Books Allowed</p>
                        <p>{selectedCard.max_books}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Books Borrowed</p>
                        <p>{selectedCard.books_borrowed}</p>
                      </div>
                      <div className="col-span-2 mt-2">
                        <div className="flex justify-center mt-3">
                          <QrCode className="h-24 w-24" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Card Actions */}
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1" onClick={() => setIsPrintDialogOpen(true)}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Card
                  </Button>
                  <Button 
                    className="flex-1"
                    disabled={selectedCard.status === "Suspended"}
                  >
                    Renew Card
                  </Button>
                </div>
                
                {/* Borrowing History Preview */}
                {selectedCard.books_borrowed > 0 && (
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Currently Borrowed Books</h4>
                    <ul className="space-y-2">
                      <li className="text-sm flex justify-between items-center">
                        <div>
                          <p className="font-medium">To Kill a Mockingbird</p>
                          <p className="text-xs text-muted-foreground">Due on {format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'dd MMM yyyy')}</p>
                        </div>
                        <Badge>7 days left</Badge>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Print Cards Dialog */}
        <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Print Library Cards</DialogTitle>
              <DialogDescription>
                Select users and print their library cards.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                <h4 className="font-medium mb-3">Select Users</h4>
                <div className="space-y-2">
                  {users.map(user => (
                    <div 
                      key={user.id} 
                      className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded-md"
                    >
                      <Checkbox 
                        id={`user-${user.id}`} 
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleUserCheckboxChange(user.id)}
                      />
                      <label 
                        htmlFor={`user-${user.id}`} 
                        className="flex-grow flex items-center space-x-3 cursor-pointer text-sm"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{user.name}</p>
                          <div className="flex items-center">
                            <Badge variant={userTypeColors[user.type]} className="mr-1 text-xs">
                              {user.type}
                            </Badge>
                            {user.grade && (
                              <span className="text-xs text-muted-foreground">{user.grade}</span>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Select defaultValue="standard">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Card template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Template</SelectItem>
                    <SelectItem value="compact">Compact Template</SelectItem>
                    <SelectItem value="premium">Premium Template</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  className="ml-auto" 
                  onClick={() => setSelectedUsers(users.map(user => user.id))}
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedUsers([])}
                >
                  Clear
                </Button>
              </div>
            </div>
            
            <DialogFooter>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {selectedUsers.length} users selected
                </p>
                <div>
                  <Button type="button" variant="outline" className="mr-2" onClick={() => setIsPrintDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    disabled={selectedUsers.length === 0}
                    onClick={() => {
                      toast({
                        title: "Cards sent to printer",
                        description: `${selectedUsers.length} cards have been sent to the printer.`,
                      });
                      setIsPrintDialogOpen(false);
                      setSelectedUsers([]);
                    }}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Cards
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTemplate>
  );
};

export default LibraryCards;
