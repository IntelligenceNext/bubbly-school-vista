
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import DataTable from '@/components/DataTable';
import { Calendar, Check, CircleDollarSign, Download, FileText, Printer, Receipt, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CollectPayments = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample pending invoices data
  const pendingInvoices = [
    {
      id: "INV-2023-003",
      student_name: "Arjun Kumar",
      student_id: "ST20230003",
      class: "11A",
      amount: 15000,
      discount: 1500,
      fine: 0,
      total: 13500,
      status: "Pending",
      issue_date: "2023-09-01",
      due_date: "2023-09-15",
      payment_date: null
    },
    {
      id: "INV-2023-004",
      student_name: "Neha Gupta",
      student_id: "ST20230004",
      class: "8C",
      amount: 10000,
      discount: 0,
      fine: 200,
      total: 10200,
      status: "Overdue",
      issue_date: "2023-09-01",
      due_date: "2023-09-15",
      payment_date: null
    },
    {
      id: "INV-2023-006",
      student_name: "Ananya Verma",
      student_id: "ST20230006",
      class: "7A",
      amount: 8000,
      discount: 0,
      fine: 150,
      total: 8150,
      status: "Partially Paid",
      issue_date: "2023-09-01",
      due_date: "2023-09-15",
      payment_date: "2023-09-14"
    },
    {
      id: "INV-2023-008",
      student_name: "Karan Singh",
      student_id: "ST20230008",
      class: "9B",
      amount: 12000,
      discount: 0,
      fine: 0,
      total: 12000,
      status: "Pending",
      issue_date: "2023-09-05",
      due_date: "2023-09-20",
      payment_date: null
    },
    {
      id: "INV-2023-010",
      student_name: "Priya Patel",
      student_id: "ST20230010",
      class: "10A",
      amount: 14000,
      discount: 500,
      fine: 0,
      total: 13500,
      status: "Pending",
      issue_date: "2023-09-10",
      due_date: "2023-09-25",
      payment_date: null
    }
  ];
  
  // Sample recent payment history
  const recentPayments = [
    {
      id: "PAY-2023-001",
      invoice_id: "INV-2023-001",
      student_name: "Rahul Sharma",
      student_id: "ST20230001",
      amount: 12000,
      payment_date: "2023-09-10",
      payment_mode: "Online",
      received_by: "John Doe"
    },
    {
      id: "PAY-2023-002",
      invoice_id: "INV-2023-002",
      student_name: "Priya Patel",
      student_id: "ST20230002",
      amount: 12500,
      payment_date: "2023-09-12",
      payment_mode: "Cash",
      received_by: "Jane Smith"
    },
    {
      id: "PAY-2023-003",
      invoice_id: "INV-2023-006",
      student_name: "Ananya Verma",
      student_id: "ST20230006",
      amount: 5000,
      payment_date: "2023-09-14",
      payment_mode: "Cheque",
      received_by: "Jane Smith"
    },
    {
      id: "PAY-2023-004",
      invoice_id: "INV-2023-005",
      student_name: "Ravi Singh",
      student_id: "ST20230005",
      amount: 18000,
      payment_date: "2023-09-05",
      payment_mode: "Bank Transfer",
      received_by: "John Doe"
    }
  ];
  
  // Status color mapping
  const statusColors = {
    "Paid": "success",
    "Pending": "warning",
    "Overdue": "destructive",
    "Partially Paid": "default"
  };
  
  // Table column definitions for pending invoices
  const pendingInvoiceColumns = [
    {
      id: "id",
      header: "Invoice #",
      cell: (item) => <span className="font-medium">{item.id}</span>,
      isSortable: true,
      sortKey: "id"
    },
    {
      id: "student",
      header: "Student",
      cell: (item) => (
        <div>
          <div className="font-medium">{item.student_name}</div>
          <div className="text-sm text-muted-foreground">{item.student_id} • {item.class}</div>
        </div>
      ),
      isSortable: true,
      sortKey: "student_name"
    },
    {
      id: "total",
      header: "Amount",
      cell: (item) => (
        <div>
          <div className="font-bold">₹{item.total.toLocaleString()}</div>
          {(item.discount > 0 || item.fine > 0) && (
            <div className="text-xs text-muted-foreground">
              {item.discount > 0 && <span className="text-green-600">-₹{item.discount}</span>}
              {item.fine > 0 && <span className="text-red-600 ml-1">+₹{item.fine}</span>}
            </div>
          )}
        </div>
      ),
      isSortable: true,
      sortKey: "total"
    },
    {
      id: "status",
      header: "Status",
      cell: (item) => (
        <Badge variant={statusColors[item.status] as any}>
          {item.status}
        </Badge>
      ),
      isSortable: true,
      sortKey: "status"
    },
    {
      id: "dates",
      header: "Due Date",
      cell: (item) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          {item.due_date}
        </div>
      ),
      isSortable: true,
      sortKey: "due_date"
    }
  ];
  
  // Table column definitions for payment history
  const paymentHistoryColumns = [
    {
      id: "id",
      header: "Payment #",
      cell: (item) => <span className="font-medium">{item.id}</span>,
      isSortable: true,
      sortKey: "id"
    },
    {
      id: "invoice_id",
      header: "Invoice #",
      cell: (item) => <span className="text-muted-foreground">{item.invoice_id}</span>,
      isSortable: true,
      sortKey: "invoice_id"
    },
    {
      id: "student",
      header: "Student",
      cell: (item) => (
        <div>
          <div className="font-medium">{item.student_name}</div>
          <div className="text-sm text-muted-foreground">{item.student_id}</div>
        </div>
      ),
      isSortable: true,
      sortKey: "student_name"
    },
    {
      id: "amount",
      header: "Amount",
      cell: (item) => <span className="font-bold text-green-600">₹{item.amount.toLocaleString()}</span>,
      isSortable: true,
      sortKey: "amount"
    },
    {
      id: "payment_date",
      header: "Date",
      cell: (item) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          {item.payment_date}
        </div>
      ),
      isSortable: true,
      sortKey: "payment_date"
    },
    {
      id: "payment_mode",
      header: "Mode",
      cell: (item) => <Badge variant="outline">{item.payment_mode}</Badge>,
      isSortable: true,
      sortKey: "payment_mode"
    },
    {
      id: "received_by",
      header: "Received By",
      cell: (item) => <span>{item.received_by}</span>,
      isSortable: true,
      sortKey: "received_by"
    }
  ];
  
  // Handler to open the payment dialog
  const handleCollectPayment = (invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentDialogOpen(true);
  };
  
  // Calculate statistics
  const totalPendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const overduePendingAmount = pendingInvoices
    .filter(inv => inv.status === "Overdue")
    .reduce((sum, inv) => sum + inv.total, 0);
  
  return (
    <PageTemplate title="Collect Payments" subtitle="Process and record fee payments">
      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Pending</p>
                  <h3 className="text-2xl font-bold text-amber-600">₹{totalPendingAmount.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-amber-100 rounded-full">
                  <CircleDollarSign className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {pendingInvoices.length} invoices pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue Amount</p>
                  <h3 className="text-2xl font-bold text-red-600">₹{overduePendingAmount.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <CircleDollarSign className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {pendingInvoices.filter(inv => inv.status === "Overdue").length} overdue invoices
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Collection</p>
                  <h3 className="text-2xl font-bold text-green-600">₹18,500</h3>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <CircleDollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                3 payments received today
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Pending Invoices */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle>Pending Invoices</CardTitle>
                <CardDescription>Record payments for pending invoices</CardDescription>
              </div>
              
              <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name or ID..."
                    className="pl-8 w-full md:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Filter by Date
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable 
              data={pendingInvoices}
              columns={pendingInvoiceColumns}
              keyField="id"
              actions={[
                {
                  label: "View Invoice",
                  onClick: (item) => alert(`Viewing invoice ${item.id}`)
                },
                {
                  label: "Collect Payment",
                  onClick: handleCollectPayment,
                  variant: "default"
                }
              ]}
              emptyState={
                <div className="text-center p-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium">No Pending Invoices</h3>
                  <p className="text-sm text-gray-500">
                    There are no pending invoices to collect payment for.
                  </p>
                </div>
              }
            />
            
            {/* Payment Collection Dialog */}
            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Collect Payment</DialogTitle>
                  <DialogDescription>
                    Record payment for invoice {selectedInvoice?.id}
                  </DialogDescription>
                </DialogHeader>
                
                {selectedInvoice && (
                  <div className="grid gap-4 py-4">
                    <div className="bg-muted/50 rounded-md p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-muted-foreground">Invoice</span>
                          <h3 className="font-bold">{selectedInvoice.id}</h3>
                        </div>
                        <Badge variant={statusColors[selectedInvoice.status] as any}>
                          {selectedInvoice.status}
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground">Student</span>
                        <p>{selectedInvoice.student_name} ({selectedInvoice.student_id})</p>
                        <p className="text-sm text-muted-foreground">Class: {selectedInvoice.class}</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="font-medium">Amount Due</div>
                        <div className="font-bold">₹{selectedInvoice.total.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="payment_amount">Payment Amount (₹)</Label>
                      <Input 
                        id="payment_amount"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={selectedInvoice.total}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="payment_date">Payment Date</Label>
                        <Input 
                          id="payment_date"
                          type="date"
                          defaultValue={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="payment_mode">Payment Mode</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option value="">Select Payment Mode</option>
                          <option value="cash">Cash</option>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="cheque">Cheque</option>
                          <option value="online">Online</option>
                          <option value="upi">UPI</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="reference">Reference / Transaction ID</Label>
                      <Input id="reference" placeholder="Bank reference, UPI ID, etc." />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Input id="notes" placeholder="Any additional notes for this payment" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="receipt">Send Receipt</Label>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="email_receipt" className="w-4 h-4" defaultChecked />
                        <Label htmlFor="email_receipt" className="text-sm">Email Receipt</Label>
                      </div>
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      alert("Payment recorded successfully!");
                      setIsPaymentDialogOpen(false);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Record Payment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        
        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Recently recorded payments</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable 
              data={recentPayments}
              columns={paymentHistoryColumns}
              keyField="id"
              actions={[
                {
                  label: "View Receipt",
                  onClick: (item) => alert(`Viewing receipt for ${item.id}`)
                },
                {
                  label: "Print Receipt",
                  onClick: (item) => alert(`Printing receipt for ${item.id}`)
                },
                {
                  label: "Email Receipt",
                  onClick: (item) => alert(`Emailing receipt for ${item.id}`)
                }
              ]}
              emptyState={
                <div className="text-center p-8">
                  <Receipt className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium">No Recent Payments</h3>
                  <p className="text-sm text-gray-500">
                    No payments have been recorded recently.
                  </p>
                </div>
              }
            />
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default CollectPayments;
