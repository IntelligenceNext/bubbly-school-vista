
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, FileText, Printer, Search, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const BulkInvoicePrints = () => {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [selectedPrintOption, setSelectedPrintOption] = useState('all');
  
  // Sample classes data
  const classes = [
    { id: 1, name: "Class 1", students: 45 },
    { id: 2, name: "Class 2", students: 42 },
    { id: 3, name: "Class 3", students: 48 },
    { id: 4, name: "Class 4", students: 50 },
    { id: 5, name: "Class 5", students: 46 },
    { id: 6, name: "Class 6", students: 52 },
    { id: 7, name: "Class 7", students: 49 },
    { id: 8, name: "Class 8", students: 54 },
    { id: 9, name: "Class 9", students: 51 },
    { id: 10, name: "Class 10", students: 48 },
    { id: 11, name: "Class 11", students: 45 },
    { id: 12, name: "Class 12", students: 42 }
  ];
  
  // Sample invoices data
  const invoices = [
    {
      id: "INV-2023-001",
      student_name: "Rahul Sharma",
      student_id: "ST20230001",
      class_name: "Class 10",
      amount: 12500,
      status: "Paid",
      issue_date: "2023-09-01",
      due_date: "2023-09-15"
    },
    {
      id: "INV-2023-002",
      student_name: "Priya Patel",
      student_id: "ST20230002",
      class_name: "Class 9",
      amount: 12500,
      status: "Paid",
      issue_date: "2023-09-01",
      due_date: "2023-09-15"
    },
    {
      id: "INV-2023-003",
      student_name: "Arjun Kumar",
      student_id: "ST20230003",
      class_name: "Class 11",
      amount: 15000,
      status: "Pending",
      issue_date: "2023-09-01",
      due_date: "2023-09-15"
    },
    {
      id: "INV-2023-004",
      student_name: "Neha Gupta",
      student_id: "ST20230004",
      class_name: "Class 8",
      amount: 10000,
      status: "Overdue",
      issue_date: "2023-09-01",
      due_date: "2023-09-15"
    },
    {
      id: "INV-2023-005",
      student_name: "Ravi Singh",
      student_id: "ST20230005",
      class_name: "Class 12",
      amount: 18000,
      status: "Paid",
      issue_date: "2023-09-01",
      due_date: "2023-09-15"
    },
    {
      id: "INV-2023-006",
      student_name: "Ananya Verma",
      student_id: "ST20230006",
      class_name: "Class 7",
      amount: 8000,
      status: "Partially Paid",
      issue_date: "2023-09-01",
      due_date: "2023-09-15"
    },
    {
      id: "INV-2023-007",
      student_name: "Vikram Malhotra",
      student_id: "ST20230007",
      class_name: "Class 10",
      amount: 12500,
      status: "Pending",
      issue_date: "2023-09-05",
      due_date: "2023-09-20"
    },
    {
      id: "INV-2023-008",
      student_name: "Karan Singh",
      student_id: "ST20230008",
      class_name: "Class 9",
      amount: 12000,
      status: "Pending",
      issue_date: "2023-09-05",
      due_date: "2023-09-20"
    }
  ];
  
  // Filter invoices based on selected print option
  const getFilteredInvoices = () => {
    if (selectedPrintOption === 'all') return invoices;
    if (selectedPrintOption === 'paid') return invoices.filter(inv => inv.status === "Paid");
    if (selectedPrintOption === 'pending') return invoices.filter(inv => inv.status === "Pending");
    if (selectedPrintOption === 'overdue') return invoices.filter(inv => ["Overdue", "Partially Paid"].includes(inv.status));
    return invoices;
  };
  
  // Status color mapping
  const statusColors = {
    "Paid": "success",
    "Pending": "warning",
    "Overdue": "destructive",
    "Partially Paid": "default"
  };
  
  // Toggle class selection
  const handleClassToggle = (classId) => {
    setSelectedClasses(prev => {
      if (prev.includes(classId)) {
        return prev.filter(id => id !== classId);
      } else {
        return [...prev, classId];
      }
    });
  };
  
  // Toggle invoice selection
  const handleInvoiceToggle = (invoiceId) => {
    setSelectedInvoices(prev => {
      if (prev.includes(invoiceId)) {
        return prev.filter(id => id !== invoiceId);
      } else {
        return [...prev, invoiceId];
      }
    });
  };
  
  // Select all invoices
  const handleSelectAll = () => {
    const filteredInvoices = getFilteredInvoices();
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(inv => inv.id));
    }
  };
  
  // Calculate count of selected invoices
  const selectedInvoicesCount = selectedInvoices.length;
  
  return (
    <PageTemplate title="Bulk Invoice Prints" subtitle="Print multiple invoices at once">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bulk Invoice Printing</CardTitle>
            <CardDescription>
              Select invoices to print in bulk or filter by class and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Left sidebar - Class selection */}
              <div className="md:col-span-1">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Filter by Class</h3>
                  <div className="relative mb-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search classes..."
                      className="pl-8"
                    />
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <div className="max-h-[300px] overflow-y-auto">
                      {classes.map((cls) => (
                        <div 
                          key={cls.id}
                          className="flex items-center justify-between p-3 border-b hover:bg-muted/50 cursor-pointer"
                          onClick={() => handleClassToggle(cls.id)}
                        >
                          <div className="flex items-center">
                            <Checkbox 
                              checked={selectedClasses.includes(cls.id)} 
                              onCheckedChange={() => handleClassToggle(cls.id)}
                              className="mr-2"
                            />
                            <span>{cls.name}</span>
                          </div>
                          <Badge variant="outline">{cls.students}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Print Options</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="all" 
                        name="printOption" 
                        value="all"
                        checked={selectedPrintOption === 'all'}
                        onChange={() => setSelectedPrintOption('all')}
                        className="mr-2"
                      />
                      <label htmlFor="all">All Invoices</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="paid" 
                        name="printOption" 
                        value="paid"
                        checked={selectedPrintOption === 'paid'}
                        onChange={() => setSelectedPrintOption('paid')}
                        className="mr-2"
                      />
                      <label htmlFor="paid">Paid Only</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="pending" 
                        name="printOption" 
                        value="pending"
                        checked={selectedPrintOption === 'pending'}
                        onChange={() => setSelectedPrintOption('pending')}
                        className="mr-2"
                      />
                      <label htmlFor="pending">Pending Only</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="overdue" 
                        name="printOption" 
                        value="overdue"
                        checked={selectedPrintOption === 'overdue'}
                        onChange={() => setSelectedPrintOption('overdue')}
                        className="mr-2"
                      />
                      <label htmlFor="overdue">Overdue Only</label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Date Range</h3>
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <Label htmlFor="from_date">From</Label>
                      <Input id="from_date" type="date" />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="to_date">To</Label>
                      <Input id="to_date" type="date" />
                    </div>
                    <Button variant="outline" className="mt-1">
                      <Calendar className="mr-2 h-4 w-4" />
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Right content - Invoice selection */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices..."
                      className="pl-8"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      Options
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={
                              getFilteredInvoices().length > 0 && 
                              selectedInvoices.length === getFilteredInvoices().length
                            }
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredInvoices().length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-muted-foreground">No invoices found matching your filters</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        getFilteredInvoices().map((invoice) => (
                          <TableRow 
                            key={invoice.id}
                            className="cursor-pointer"
                            onClick={() => handleInvoiceToggle(invoice.id)}
                          >
                            <TableCell className="w-12">
                              <Checkbox 
                                checked={selectedInvoices.includes(invoice.id)}
                                onCheckedChange={() => handleInvoiceToggle(invoice.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{invoice.id}</TableCell>
                            <TableCell>
                              <div>
                                <div>{invoice.student_name}</div>
                                <div className="text-sm text-muted-foreground">{invoice.student_id}</div>
                              </div>
                            </TableCell>
                            <TableCell>{invoice.class_name}</TableCell>
                            <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={statusColors[invoice.status] as any}>{invoice.status}</Badge>
                            </TableCell>
                            <TableCell>{invoice.due_date}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="font-medium">Selected Invoices: <span className="text-primary">{selectedInvoicesCount}</span></h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedInvoicesCount > 0
                              ? `You've selected ${selectedInvoicesCount} invoices to print`
                              : "Select invoices to print in bulk"}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" disabled={selectedInvoicesCount === 0}>
                            Preview
                          </Button>
                          <Button disabled={selectedInvoicesCount === 0}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print Selected ({selectedInvoicesCount})
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default BulkInvoicePrints;
