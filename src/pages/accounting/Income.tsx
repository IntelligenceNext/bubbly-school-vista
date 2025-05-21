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
import { BadgeCheck, Calendar, Download, FileText, Plus, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Income = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Sample income data
  const incomeData = [
    {
      id: "INC001",
      date: "2023-09-15",
      category: "Tuition Fee",
      amount: 235000,
      payment_mode: "Bank Transfer",
      reference: "HDFC/TR/20230915/001",
      received_by: "John Doe",
      description: "Grade 10 Tuition Fee Collection - September 2023"
    },
    {
      id: "INC002",
      date: "2023-09-14",
      category: "Library Fee",
      amount: 45000,
      payment_mode: "Cash",
      reference: "CASH/001",
      received_by: "Jane Smith",
      description: "Library Fee Collection - First Term"
    },
    {
      id: "INC003",
      date: "2023-09-10",
      category: "Transport Fee",
      amount: 120000,
      payment_mode: "Cheque",
      reference: "CHQ/452639",
      received_by: "Mike Johnson",
      description: "Transport Fee Collection - September 2023"
    },
    {
      id: "INC004",
      date: "2023-09-08",
      category: "Admission Fee",
      amount: 350000,
      payment_mode: "Online",
      reference: "RAZORPAY/23/09/001",
      received_by: "John Doe",
      description: "New Student Admissions - Batch 2023"
    },
    {
      id: "INC005",
      date: "2023-09-05",
      category: "Donation",
      amount: 500000,
      payment_mode: "Bank Transfer",
      reference: "ICICI/TR/20230905/123",
      received_by: "Jane Smith",
      description: "Alumni Association Donation"
    },
    {
      id: "INC006",
      date: "2023-09-02",
      category: "Hostel Fee",
      amount: 180000,
      payment_mode: "Cash",
      reference: "CASH/002",
      received_by: "Mike Johnson",
      description: "Hostel Fee Collection - September 2023"
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
      cell: (item) => <span className="font-bold text-green-600">₹{item.amount.toLocaleString()}</span>,
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
      id: "reference",
      header: "Reference",
      cell: (item) => <span className="text-muted-foreground text-sm">{item.reference}</span>,
      isSortable: false
    },
    {
      id: "received_by",
      header: "Received By",
      cell: (item) => <span>{item.received_by}</span>,
      isSortable: true,
      sortKey: "received_by"
    },
    {
      id: "description",
      header: "Description",
      cell: (item) => <span className="truncate max-w-[250px]">{item.description}</span>,
      isSortable: false,
      size: "lg" // Changed from string to "lg" literal
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
  
  // Calculate total income
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  
  // Income by category
  const incomeByCategory = incomeData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});
  
  return (
    <PageTemplate title="Income" subtitle="Track school income sources">
      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                  <h3 className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <BadgeCheck className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Placeholder cards for showing income by category */}
          {Object.entries(incomeByCategory).slice(0, 3).map(([category, amount]) => (
            <Card key={category}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{category}</p>
                    <h3 className="text-2xl font-bold">₹{amount.toLocaleString()}</h3>
                  </div>
                  <div className="p-2 bg-slate-100 rounded-full">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Income Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Income Records</CardTitle>
              <CardDescription>Track and manage all income transactions</CardDescription>
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
                    Add Income
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Income</DialogTitle>
                    <DialogDescription>
                      Record a new income transaction for the school
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
                          <option value="tuition">Tuition Fee</option>
                          <option value="admission">Admission Fee</option>
                          <option value="library">Library Fee</option>
                          <option value="transport">Transport Fee</option>
                          <option value="hostel">Hostel Fee</option>
                          <option value="donation">Donation</option>
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
                      <Label htmlFor="reference">Reference No.</Label>
                      <Input id="reference" placeholder="Bank reference, cheque no., etc." />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" placeholder="Brief description of the income" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="received_by">Received By</Label>
                      <Input id="received_by" placeholder="Name of the person who received the payment" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" onClick={() => {
                      alert("Income added successfully!");
                      setIsAddDialogOpen(false);
                    }}>Save Income</Button>
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
                    placeholder="Search incomes..."
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
              data={incomeData}
              columns={columns}
              keyField="id"
              selectable={true}
              actions={actions}
              bulkActions={bulkActions}
              emptyState={
                <div className="text-center p-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium">No Income Records</h3>
                  <p className="text-sm text-gray-500">
                    There are no income records yet. Click 'Add Income' to create one.
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

export default Income;
