
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
import { Calendar, FileText, Plus, Search, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const FeeTypes = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Sample fee type data
  const feeTypes = [
    {
      id: 1,
      title: "Tuition Fee",
      frequency: "Monthly",
      amount: 5000,
      description: "Regular monthly tuition fee for all students",
      applicable_classes: "All",
      is_mandatory: true,
      created_at: "2023-04-01"
    },
    {
      id: 2,
      title: "Admission Fee",
      frequency: "One Time",
      amount: 25000,
      description: "One-time fee collected during admission",
      applicable_classes: "New Admissions",
      is_mandatory: true,
      created_at: "2023-04-01"
    },
    {
      id: 3,
      title: "Library Fee",
      frequency: "Yearly",
      amount: 2000,
      description: "Annual library usage and maintenance fee",
      applicable_classes: "All",
      is_mandatory: true,
      created_at: "2023-04-01"
    },
    {
      id: 4,
      title: "Transport Fee",
      frequency: "Monthly",
      amount: 3000,
      description: "School bus transportation fee",
      applicable_classes: "Optional",
      is_mandatory: false,
      created_at: "2023-04-01"
    },
    {
      id: 5,
      title: "Computer Lab Fee",
      frequency: "Yearly",
      amount: 5000,
      description: "Annual computer lab maintenance and usage fee",
      applicable_classes: "Grade 6-12",
      is_mandatory: true,
      created_at: "2023-04-01"
    },
    {
      id: 6,
      title: "Sports Fee",
      frequency: "Yearly",
      amount: 2500,
      description: "Annual sports facilities and equipment fee",
      applicable_classes: "All",
      is_mandatory: true,
      created_at: "2023-04-01"
    },
    {
      id: 7,
      title: "Examination Fee",
      frequency: "Term",
      amount: 1500,
      description: "Fee for conducting periodic examinations",
      applicable_classes: "All",
      is_mandatory: true,
      created_at: "2023-04-01"
    }
  ];
  
  // Table column definitions
  const columns = [
    {
      id: "title",
      header: "Fee Type",
      cell: (item) => <span className="font-medium">{item.title}</span>,
      isSortable: true,
      sortKey: "title"
    },
    {
      id: "frequency",
      header: "Frequency",
      cell: (item) => <Badge variant="outline">{item.frequency}</Badge>,
      isSortable: true,
      sortKey: "frequency"
    },
    {
      id: "amount",
      header: "Amount",
      cell: (item) => <span className="font-bold">₹{item.amount.toLocaleString()}</span>,
      isSortable: true,
      sortKey: "amount"
    },
    {
      id: "applicable_classes",
      header: "Applies To",
      cell: (item) => <span>{item.applicable_classes}</span>,
      isSortable: true,
      sortKey: "applicable_classes"
    },
    {
      id: "is_mandatory",
      header: "Required",
      cell: (item) => item.is_mandatory ? 
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Yes</Badge> : 
        <Badge variant="outline">Optional</Badge>,
      isSortable: true,
      sortKey: "is_mandatory"
    },
    {
      id: "description",
      header: "Description",
      cell: (item) => <span className="truncate max-w-[250px] text-sm text-muted-foreground">{item.description}</span>,
      isSortable: false,
      size: "lg"
    }
  ];
  
  // Actions for the table
  const actions = [
    {
      label: "Edit",
      onClick: (item) => alert(`Editing ${item.title}`)
    },
    {
      label: "Duplicate",
      onClick: (item) => alert(`Duplicating ${item.title}`)
    },
    {
      label: "Delete",
      onClick: (item) => alert(`Deleting ${item.title}`),
      variant: "destructive"
    }
  ];
  
  // Calculate stats
  const totalFeeTypes = feeTypes.length;
  const mandatoryFeeTypes = feeTypes.filter(item => item.is_mandatory).length;
  const optionalFeeTypes = feeTypes.filter(item => !item.is_mandatory).length;
  
  // Frequency distribution
  const frequencyDistribution = feeTypes.reduce((acc, item) => {
    acc[item.frequency] = (acc[item.frequency] || 0) + 1;
    return acc;
  }, {});
  
  return (
    <PageTemplate title="Fee Types" subtitle="Manage different fee categories">
      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Fee Types</p>
                  <h3 className="text-2xl font-bold">{totalFeeTypes}</h3>
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
                  <p className="text-sm font-medium text-muted-foreground">Mandatory Fees</p>
                  <h3 className="text-2xl font-bold">{mandatoryFeeTypes}</h3>
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
                  <p className="text-sm font-medium text-muted-foreground">Optional Fees</p>
                  <h3 className="text-2xl font-bold">{optionalFeeTypes}</h3>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fee Structure</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Button size="sm" variant="outline" className="h-8">View</Button>
                    <Button size="sm" variant="outline" className="h-8">Print</Button>
                  </div>
                </div>
                <div className="p-2 bg-amber-100 rounded-full">
                  <Settings className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Fee Types Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Fee Types</CardTitle>
              <CardDescription>Manage all fee categories and their configurations</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Fee Type
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Fee Type</DialogTitle>
                  <DialogDescription>
                    Create a new fee category to be used in student billing
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Fee Title</Label>
                    <Input id="title" placeholder="e.g., Tuition Fee, Library Fee" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input id="amount" type="number" placeholder="0.00" min="0" step="0.01" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">Select Frequency</option>
                        <option value="One Time">One Time</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Term">Term</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="applicable_classes">Applicable Classes</Label>
                    <Input id="applicable_classes" placeholder="e.g., All, Grade 1-5, Optional" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>Is Mandatory</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      If checked, this fee will be automatically included in all applicable student invoices
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Brief description of this fee type" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" onClick={() => {
                    alert("Fee type added successfully!");
                    setIsAddDialogOpen(false);
                  }}>Save Fee Type</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search fee types..."
                  className="pl-8"
                />
              </div>
            </div>
            
            <DataTable 
              data={feeTypes}
              columns={columns}
              keyField="id"
              actions={actions}
              emptyState={
                <div className="text-center p-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium">No Fee Types</h3>
                  <p className="text-sm text-gray-500">
                    There are no fee types defined yet. Click 'Add Fee Type' to create one.
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

export default FeeTypes;
