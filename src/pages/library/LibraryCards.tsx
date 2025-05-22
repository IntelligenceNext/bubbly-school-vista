
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card,
  CardContent, 
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";

// Define ButtonVariant type to fix the error
type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "warning";

const LibraryCards: React.FC = () => {
  // State for storing library cards data
  const [libraryCards, setLibraryCards] = React.useState([
    {
      id: "1",
      card_number: "LIB-2023-0001",
      student_name: "John Smith",
      class: "10A",
      issue_date: "2023-01-15",
      expiry_date: "2024-01-14",
      status: "Active"
    },
    {
      id: "2",
      card_number: "LIB-2023-0002",
      student_name: "Emma Johnson",
      class: "9B",
      issue_date: "2023-02-10",
      expiry_date: "2024-02-09",
      status: "Active"
    },
    {
      id: "3",
      card_number: "LIB-2023-0003",
      student_name: "Michael Brown",
      class: "11C",
      issue_date: "2023-01-20",
      expiry_date: "2024-01-19",
      status: "Suspended"
    },
    {
      id: "4",
      card_number: "LIB-2023-0004",
      student_name: "Sarah Wilson",
      class: "12A",
      issue_date: "2023-03-05",
      expiry_date: "2024-03-04",
      status: "Active"
    }
  ]);

  // State for dialogs
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState<any>(null);
  const [printDialogOpen, setPrintDialogOpen] = React.useState(false);

  // Form schema
  const formSchema = z.object({
    card_number: z.string(),
    student_name: z.string(),
    class: z.string(),
    expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Expiry date must be in YYYY-MM-DD format",
    }),
    status: z.enum(["Active", "Suspended", "Expired"]),
  });

  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      card_number: "",
      student_name: "",
      class: "",
      expiry_date: "",
      status: "Active",
    },
  });

  // Function to view card details
  const openViewDialog = (card: any) => {
    setSelectedCard(card);
    setViewDialogOpen(true);
  };

  // Function to edit card
  const openEditDialog = (card: any) => {
    setSelectedCard(card);
    form.reset({
      card_number: card.card_number,
      student_name: card.student_name,
      class: card.class,
      expiry_date: card.expiry_date,
      status: card.status as "Active" | "Suspended" | "Expired",
    });
    setEditDialogOpen(true);
  };

  // Function to print card
  const handlePrintCard = (card: any) => {
    setSelectedCard(card);
    setPrintDialogOpen(true);
  };

  // Function to change status (toggle between active and suspended)
  const handleStatusChange = (card: any) => {
    setLibraryCards(prevCards => 
      prevCards.map(c => 
        c.id === card.id 
          ? { ...c, status: c.status === "Active" ? "Suspended" : "Active" } 
          : c
      )
    );

    toast({
      title: "Status Updated",
      description: `Card ${card.card_number} is now ${card.status === "Active" ? "suspended" : "active"}.`,
    });
  };

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (selectedCard) {
      setLibraryCards(prevCards => 
        prevCards.map(card => 
          card.id === selectedCard.id 
            ? { ...card, ...values } 
            : card
        )
      );
      
      toast({
        title: "Card Updated",
        description: "Library card has been updated successfully.",
      });
      
      setEditDialogOpen(false);
    }
  };

  // Action buttons
  const actions = [
    {
      label: "View Details",
      onClick: (card: any) => openViewDialog(card),
    },
    {
      label: "Edit",
      onClick: (card: any) => openEditDialog(card),
    },
    {
      label: "Print Card",
      onClick: (card: any) => handlePrintCard(card),
    },
    {
      label: (card: any) => card.status === "Active" ? "Suspend" : "Activate",
      onClick: (card: any) => handleStatusChange(card),
      variant: (card: any) => card.status === "Active" ? "warning" : "success" as ButtonVariant,
    },
  ];

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Suspended":
        return "warning";
      case "Expired":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <PageTemplate title="Library Cards" subtitle="Manage student and staff library cards">
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Card Number</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {libraryCards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell className="font-medium">{card.card_number}</TableCell>
                    <TableCell>{card.student_name}</TableCell>
                    <TableCell>{card.class}</TableCell>
                    <TableCell>{card.issue_date}</TableCell>
                    <TableCell>{card.expiry_date}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(card.status)}>
                        {card.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {actions.map((action, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant={action.variant ? action.variant(card) : "outline"}
                            onClick={() => action.onClick(card)}
                          >
                            {typeof action.label === 'function' ? action.label(card) : action.label}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Library Card Details</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold">Card Number</h4>
                  <p>{selectedCard.card_number}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Student Name</h4>
                  <p>{selectedCard.student_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Class</h4>
                  <p>{selectedCard.class}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Issue Date</h4>
                  <p>{selectedCard.issue_date}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Expiry Date</h4>
                  <p>{selectedCard.expiry_date}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Status</h4>
                  <Badge variant={getStatusBadge(selectedCard.status)}>
                    {selectedCard.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Card Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Library Card</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="card_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="student_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiry_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Print Card Dialog */}
      <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Print Library Card</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4 print:p-4">
              <div className="border p-6 rounded-md shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">School Library</h3>
                    <p className="text-sm text-muted-foreground">Library Member Card</p>
                  </div>
                  <Badge variant={getStatusBadge(selectedCard.status)}>{selectedCard.status}</Badge>
                </div>
                
                <div className="my-4 border-b"></div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Card Number:</span>
                    <span>{selectedCard.card_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Name:</span>
                    <span>{selectedCard.student_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Class:</span>
                    <span>{selectedCard.class}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Issue Date:</span>
                    <span>{selectedCard.issue_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Valid Until:</span>
                    <span>{selectedCard.expiry_date}</span>
                  </div>
                </div>
                
                <div className="mt-4 text-center text-sm">
                  <p>This card must be presented when borrowing books.</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => window.print()}>Print</Button>
            <Button variant="outline" onClick={() => setPrintDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default LibraryCards;
