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
import DataTable from '@/components/DataTable';
import { Calendar, Download, FileText, Plus, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Expenses = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Sample expense data
  const expensesData = [
    {
      id: "EXP001",
      date: "2023-09-15",
      category: "Salary",
      amount: 350000,
      payment_mode: "Bank Transfer",
      paid_to: "Teaching Staff",
      reference: "SAL/SEP/23",
      description: "Teaching Staff Salary - September 2023"
    },
    {
      id: "EXP002",
      date: "2023-09-14",
      category: "Maintenance",
      amount: 45000,
      payment_mode: "Cheque",
      paid_to: "ABC Maintenance Services",
      reference: "CHQ/452640",
      description: "Monthly Campus Maintenance"
    },
    {
      id: "EXP003",
      date: "2023-09-10",
      category: "Utility",
      amount: 28000,
      payment_mode: "Online",
      paid_to: "State Electricity Board",
      reference: "UTIL/09/23",
      description: "Electricity Bill - September 2023"
    },
    {
      id: "EXP004",
      date: "2023-09-08",
      category: "Stationery",
      amount: 65000,
      payment_mode: "Cash",
      paid_to: "XYZ Stationery",
      reference: "PO/23/09/001",
      description: "Quarterly Stationery Purchase"
    },
    {
      id: "EXP005",
      date: "2023-09-05",
      category: "Transport",
      amount: 75000,
      payment_mode: "Cheque",
      paid_to: "ABC Fuel Services",
      reference: "CHQ/452641",
      description: "School Bus Fuel - September 2023"
    },
    {
      id: "EXP006",
      date: "2023-09-02",
      category: "Equipment",
      amount: 120000,
      payment_mode: "Bank Transfer",
      paid_to: "Lab Equipment Supplier",
      reference: "PO/23/09/002",
      description: "Science Lab Equipment"
    }
  ];
  
  // Table column definitions
  const columns = [
    {
      id: "id",
      header: "ID",
      cell: (item) => <span className="font-medium">{item.id}</span>,
      isSortable: true,
      sortKey: "id"
    },
    {
      id: "date",
      header: "Date",
      cell: (item) => <div className="flex items-center">
        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
        {item.date}
      </div>,
      isSortable: true,
      sortKey: "date"
    },
    {
      id: "category",
      header: "Category",
      cell: (item) => <Badge variant="outline">{item.category}</Badge>,
      isSortable: true,
      sortKey: "category"
    },
    {
      id: "amount",
      header: "Amount",
      cell: (item) => <span className="font-bold text-red-600">₹{item.amount.toLocaleString()}</span>,
      isSortable: true,
      sortKey: "amount"
    },
    {
      id: "payment_mode",
      header: "Payment Mode",
      cell: (item) => <span>{item.payment_mode}</span>,
      isSortable: true,
      sortKey: "payment_mode"
    },
    {
      id: "paid_to",
      header: "Paid To",
      cell: (item) => <span>{item.paid_to}</span>,
      isSortable: true,
      sortKey: "paid_to"
    },
    {
      id: "reference",
      header: "Reference",
      cell: (item) => <span className="text-muted-foreground text-sm">{item.reference}</span>,
      isSortable: false
    },
    {
      id: "description",
      header: "Description",
      cell: (item) => <span className="truncate max-w-[250px]">{item.description}</span>,
      isSortable: false,
      size: "lg"
    }
  ];
  
  // Actions for the table
  const actions = [
    {
      label: "View Details",
      onClick: (item) => alert(`Viewing details for ${item.id}`)
    },
    {
      label: "Edit",
      onClick: (item) => alert(`Editing ${item.id}`)
    },
    {
      label: "Print Receipt",
      onClick: (item) => alert(`Printing receipt for ${item.id}`)
    }
  ];
  
  // Bulk actions
  const bulkActions = [
    {
      label: "Export Selected",
      onClick: (items) => alert(`Exporting ${items.length} items`)
    },
    {
      label: "Print Receipt",
      onClick: (items) => alert(`Printing receipts for ${items.length} items`)
    }
  ];
  
  // Calculate total expenses
  const totalExpenses = expensesData.reduce((sum, item) => sum + item.amount, 0);
  
  // Expenses by category
  const expensesByCategory = expensesData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});
  
  return (
    <PageTemplate title="Expenses" subtitle="Manage school expenses">
      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                  <h3 className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Placeholder cards for showing expenses by category */}
          {Object.entries(expensesByCategory).slice(0, 3).map(([category, amount]) => (
            <Card key={category}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{category}</p>
                    <h3 className="text-2xl font-bold">₹{(amount as number).toLocaleString()}</h3>
                  </div>
                  <div className="p-2 bg-slate-100 rounded-full">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Expenses Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Expense Records</CardTitle>
              <CardDescription>Track and manage all expense transactions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                    <DialogDescription>
                      Record a new expense transaction for the school
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input id="amount" type="number" placeholder="0.00" min="0" step="0.01" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option value="">Select Category</option>
                          <option value="salary">Salary</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="utility">Utility</option>
                          <option value="stationery">Stationery</option>
                          <option value="transport">Transport</option>
                          <option value="equipment">Equipment</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="payment_mode">Payment Mode</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option value="">Select Payment Mode</option>
                          <option value="cash">Cash</option>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="cheque">Cheque</option>
                          <option value="online">Online</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="paid_to">Paid To</Label>
                      <Input id="paid_to" placeholder="Vendor, staff or organization" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="reference">Reference No.</Label>
                      <Input id="reference" placeholder="PO number, invoice number, etc." />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" placeholder="Brief description of the expense" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="receipt">Upload Receipt (optional)</Label>
                      <Input id="receipt" type="file" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" onClick={() => {
                      alert("Expense added successfully!");
                      setIsAddDialogOpen(false);
                    }}>Save Expense</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search expenses..."
                    className="pl-8"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Filter by Date
                  </Button>
                </div>
              </div>
            </div>
            
            <DataTable 
              data={expensesData}
              columns={columns}
              keyField="id"
              selectable={true}
              actions={actions}
              bulkActions={bulkActions}
              emptyState={
                <div className="text-center p-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium">No Expense Records</h3>
                  <p className="text-sm text-gray-500">
                    There are no expense records yet. Click 'Add Expense' to create one.
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

export default Expenses;
