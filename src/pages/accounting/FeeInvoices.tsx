
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable from '@/components/DataTable';
import { Calendar, CircleDollarSign, Download, FileText, Plus, Printer, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const FeeInvoices = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isNewInvoiceDialogOpen, setIsNewInvoiceDialogOpen] = useState(false);
  
  // Sample invoices data
  const invoices = [
    {
      id: "INV-2023-001",
      student_name: "Rahul Sharma",
      student_id: "ST20230001",
      class: "10A",
      amount: 12500,
      discount: 500,
      fine: 0,
      total: 12000,
      status: "Paid",
      issue_date: "2023-09-01",
      due_date: "2023-09-15",
      payment_date: "2023-09-10"
    },
    {
      id: "INV-2023-002",
      student_name: "Priya Patel",
      student_id: "ST20230002",
      class: "9B",
      amount: 12500,
      discount: 0,
      fine: 0,
      total: 12500,
      status: "Paid",
      issue_date: "2023-09-01",
      due_date: "2023-09-15",
      payment_date: "2023-09-12"
    },
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
      id: "INV-2023-005",
      student_name: "Ravi Singh",
      student_id: "ST20230005",
      class: "12B",
      amount: 18000,
      discount: 0,
      fine: 0,
      total: 18000,
      status: "Paid",
      issue_date: "2023-09-01",
      due_date: "2023-09-15",
      payment_date: "2023-09-05"
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
    }
  ];
  
  // Filter invoices based on active tab
  const getFilteredInvoices = () => {
    if (activeTab === "all") return invoices;
    if (activeTab === "paid") return invoices.filter(inv => inv.status === "Paid");
    if (activeTab === "pending") return invoices.filter(inv => inv.status === "Pending");
    if (activeTab === "overdue") return invoices.filter(inv => inv.status === "Overdue" || inv.status === "Partially Paid");
    return invoices;
  };
  
  // Status color mapping - fixed the variants to match accepted values
  const statusColors = {
    "Paid": "default",
    "Pending": "secondary",
    "Overdue": "destructive",
    "Partially Paid": "outline"
  };
  
  // Table column definitions
  const columns = [
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
      header: "Dates",
      cell: (item) => (
        <div className="text-sm">
          <div>
            <span className="text-muted-foreground">Issued:</span> {item.issue_date}
          </div>
          <div>
            <span className="text-muted-foreground">Due:</span> {item.due_date}
          </div>
          {item.payment_date && (
            <div>
              <span className="text-muted-foreground">Paid:</span> {item.payment_date}
            </div>
          )}
        </div>
      ),
      isSortable: true,
      sortKey: "due_date"
    }
  ];
  
  // Actions for the table - fixed the variants to match accepted values
  const actions = [
    {
      label: "View Invoice",
      onClick: (item) => alert(`Viewing invoice ${item.id}`)
    },
    {
      label: "Print",
      onClick: (item) => alert(`Printing invoice ${item.id}`)
    },
    {
      label: "Email",
      onClick: (item) => alert(`Emailing invoice ${item.id}`)
    },
    {
      label: "Collect Payment",
      onClick: (item) => alert(`Collecting payment for invoice ${item.id}`),
      condition: (item) => item.status !== "Paid"
    },
    {
      label: "Cancel Invoice",
      onClick: (item) => alert(`Cancelling invoice ${item.id}`),
      variant: "destructive"
    }
  ];
  
  // Bulk actions
  const bulkActions = [
    {
      label: "Print Selected",
      onClick: (items) => alert(`Printing ${items.length} invoices`)
    },
    {
      label: "Email Selected",
      onClick: (items) => alert(`Emailing ${items.length} invoices`)
    }
  ];
  
  // Statistics
  const stats = {
    totalInvoices: invoices.length,
    paidInvoices: invoices.filter(inv => inv.status === "Paid").length,
    pendingInvoices: invoices.filter(inv => inv.status === "Pending").length,
    overdueInvoices: invoices.filter(inv => inv.status === "Overdue" || inv.status === "Partially Paid").length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.total, 0)
  };
  
  return (
    <PageTemplate title="Fee Invoices" subtitle="Generate and manage student fee invoices">
      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <h3 className="text-2xl font-bold">₹{stats.totalAmount.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-slate-100 rounded-full">
                  <CircleDollarSign className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                  <h3 className="text-2xl font-bold">{stats.totalInvoices}</h3>
                </div>
                <div className="p-2 bg-slate-100 rounded-full">
                  <FileText className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paid</p>
                  <h3 className="text-2xl font-bold text-green-600">{stats.paidInvoices}</h3>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <h3 className="text-2xl font-bold text-amber-600">{stats.pendingInvoices}</h3>
                </div>
                <div className="p-2 bg-amber-100 rounded-full">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <h3 className="text-2xl font-bold text-red-600">{stats.overdueInvoices}</h3>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Invoice Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Fee Invoices</CardTitle>
              <CardDescription>Manage student fee invoices and payments</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Bulk Print
              </Button>
              <Dialog open={isNewInvoiceDialogOpen} onOpenChange={setIsNewInvoiceDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                    <DialogDescription>
                      Generate a new fee invoice for a student
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="student">Select Student</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">-- Select Student --</option>
                        {invoices.map(inv => (
                          <option key={inv.student_id} value={inv.student_id}>
                            {inv.student_id} - {inv.student_name} ({inv.class})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="issue_date">Issue Date</Label>
                        <Input id="issue_date" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="due_date">Due Date</Label>
                        <Input id="due_date" type="date" />
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">Fee Items</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b">
                          <div>
                            <div className="font-medium">Tuition Fee</div>
                            <div className="text-sm text-muted-foreground">Monthly - September 2023</div>
                          </div>
                          <div className="font-bold">₹5,000</div>
                        </div>
                        
                        <div className="flex items-center justify-between py-2 border-b">
                          <div>
                            <div className="font-medium">Computer Lab Fee</div>
                            <div className="text-sm text-muted-foreground">Monthly - September 2023</div>
                          </div>
                          <div className="font-bold">₹2,000</div>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="flex w-full justify-start">
                          <Plus className="h-4 w-4 mr-1" /> Add Fee Item
                        </Button>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="font-medium">Sub Total</div>
                          <div className="font-bold">₹7,000</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-green-600">Discount</div>
                            <div className="text-sm text-muted-foreground">Sibling Discount</div>
                          </div>
                          <div className="font-bold text-green-600">-₹500</div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="font-medium">Total Amount</div>
                          <div className="font-bold text-xl">₹6,500</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Input id="notes" placeholder="Any additional notes for this invoice" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewInvoiceDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" onClick={() => {
                      alert("Invoice created successfully!");
                      setIsNewInvoiceDialogOpen(false);
                    }}>Create Invoice</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Invoices</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="overdue">Overdue</TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  <div className="relative w-[250px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices..."
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <DataTable 
                  data={getFilteredInvoices()}
                  columns={columns}
                  keyField="id"
                  selectable={true}
                  actions={actions}
                  bulkActions={bulkActions}
                  emptyState={
                    <div className="text-center p-8">
                      <FileText className="h-12 w-12 mx-auto text-gray-300" />
                      <h3 className="mt-2 text-lg font-medium">No Invoices Found</h3>
                      <p className="text-sm text-gray-500">
                        No invoices match your search criteria.
                      </p>
                    </div>
                  }
                />
              </TabsContent>
              
              <TabsContent value="paid" className="mt-0">
                <DataTable 
                  data={getFilteredInvoices()}
                  columns={columns}
                  keyField="id"
                  selectable={true}
                  actions={actions}
                  bulkActions={bulkActions}
                />
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                <DataTable 
                  data={getFilteredInvoices()}
                  columns={columns}
                  keyField="id"
                  selectable={true}
                  actions={actions}
                  bulkActions={bulkActions}
                />
              </TabsContent>
              
              <TabsContent value="overdue" className="mt-0">
                <DataTable 
                  data={getFilteredInvoices()}
                  columns={columns}
                  keyField="id"
                  selectable={true}
                  actions={actions}
                  bulkActions={bulkActions}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default FeeInvoices;
