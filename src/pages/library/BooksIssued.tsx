
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

// Define ButtonVariant type to fix the error
type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "warning";

const BooksIssued: React.FC = () => {
  // State for storing books issued data
  const [issuedBooks, setIssuedBooks] = React.useState([
    {
      id: "1",
      book_title: "Introduction to Physics",
      student_name: "John Smith",
      issue_date: "2023-05-01",
      due_date: "2023-05-15",
      return_date: null,
      status: "Issued"
    },
    {
      id: "2",
      book_title: "Advanced Mathematics",
      student_name: "Emma Johnson",
      issue_date: "2023-04-20",
      due_date: "2023-05-04",
      return_date: null,
      status: "Overdue"
    },
    {
      id: "3",
      book_title: "World History",
      student_name: "Michael Brown",
      issue_date: "2023-05-05",
      due_date: "2023-05-19",
      return_date: null,
      status: "Issued"
    },
    {
      id: "4",
      book_title: "Literature Anthology",
      student_name: "Sarah Wilson",
      issue_date: "2023-04-10",
      due_date: "2023-04-24",
      return_date: "2023-04-22",
      status: "Returned"
    }
  ]);

  // State for dialogs
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [selectedIssue, setSelectedIssue] = React.useState<any>(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = React.useState(false);

  // Function to view issue details
  const viewIssueDetails = (issue: any) => {
    setSelectedIssue(issue);
    setViewDialogOpen(true);
  };

  // Function to mark a book as returned
  const markAsReturned = (issue: any) => {
    setIssuedBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === issue.id 
          ? { ...book, status: "Returned", return_date: new Date().toISOString().split('T')[0] } 
          : book
      )
    );
  };

  // Function to print receipt
  const printReceipt = (issue: any) => {
    setSelectedIssue(issue);
    setReceiptDialogOpen(true);
  };

  // Action buttons
  const actions = [
    {
      label: "View Details",
      onClick: (issue: any) => viewIssueDetails(issue),
    },
    {
      label: "Mark Returned",
      onClick: (issue: any) => markAsReturned(issue),
      variant: (issue: any) => issue.status === "Issued" ? "default" : "secondary" as ButtonVariant,
      disabled: (issue: any) => issue.status !== "Issued",
    },
    {
      label: "Print Receipt",
      onClick: (issue: any) => printReceipt(issue),
    },
  ];

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Issued":
        return "success";
      case "Overdue":
        return "destructive";
      case "Returned":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <PageTemplate title="Books Issued" subtitle="Track issued books and manage returns">
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issuedBooks.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-medium">{issue.book_title}</TableCell>
                    <TableCell>{issue.student_name}</TableCell>
                    <TableCell>{issue.issue_date}</TableCell>
                    <TableCell>{issue.due_date}</TableCell>
                    <TableCell>{issue.return_date || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(issue.status)}>
                        {issue.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {actions.map((action, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant={action.variant ? action.variant(issue) : "outline"}
                            disabled={action.disabled ? action.disabled(issue) : false}
                            onClick={() => action.onClick(issue)}
                          >
                            {action.label}
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
            <DialogTitle>Book Issue Details</DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold">Book Title</h4>
                  <p>{selectedIssue.book_title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Student Name</h4>
                  <p>{selectedIssue.student_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Issue Date</h4>
                  <p>{selectedIssue.issue_date}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Due Date</h4>
                  <p>{selectedIssue.due_date}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Return Date</h4>
                  <p>{selectedIssue.return_date || "Not returned yet"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Status</h4>
                  <Badge variant={getStatusBadge(selectedIssue.status)}>
                    {selectedIssue.status}
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

      {/* Print Receipt Dialog */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Issue Receipt</DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <div className="space-y-4 print:p-4">
              <div className="text-center border-b pb-4">
                <h3 className="text-xl font-bold">School Library</h3>
                <p className="text-sm text-muted-foreground">Book Issue Receipt</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Receipt No:</span>
                  <span>{`LIB-${selectedIssue.id}-${new Date().getFullYear()}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Book Title:</span>
                  <span>{selectedIssue.book_title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Issued To:</span>
                  <span>{selectedIssue.student_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Issue Date:</span>
                  <span>{selectedIssue.issue_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Due Date:</span>
                  <span>{selectedIssue.due_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Status:</span>
                  <span>{selectedIssue.status}</span>
                </div>
              </div>
              <div className="border-t pt-4 mt-6 text-center text-sm text-muted-foreground">
                <p>Please return the book on or before the due date to avoid fines.</p>
                <p>Thank you for using the school library!</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => window.print()}>Print</Button>
            <Button variant="outline" onClick={() => setReceiptDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default BooksIssued;
