import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Download, FileText, Printer, Search, Settings } from 'lucide-react';
import { BarChart } from '@/components/ui/BarChart';
import { LineChart } from '@/components/ui/LineChart';
import DataTable from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';

const InvoicesReport = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [dateRange, setDateRange] = useState({
    from: "2023-01-01",
    to: "2023-09-30"
  });
  
  // Sample summary data
  const summaryData = {
    totalInvoiced: 3850000,
    totalCollected: 3215000,
    totalPending: 635000,
    totalOverdue: 215000,
    invoiceCount: 850,
    paidCount: 720,
    pendingCount: 130,
    overdueCount: 45
  };
  
  // Chart data for monthly collections
  const monthlyCollectionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Invoiced',
        data: [320000, 350000, 400000, 450000, 420000, 380000, 510000, 480000, 540000],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
      },
      {
        label: 'Collected',
        data: [300000, 330000, 380000, 420000, 400000, 350000, 480000, 450000, 495000],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
      }
    ]
  };
  
  // Chart data for fee type distribution
  const feeDistributionData = {
    labels: ['Tuition Fee', 'Transport Fee', 'Library Fee', 'Exam Fee', 'Computer Fee', 'Sports Fee'],
    datasets: [
      {
        label: 'Amount',
        data: [2100000, 580000, 210000, 350000, 390000, 220000],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(75, 85, 99, 0.7)'
        ]
      }
    ]
  };

  // Create chart props in the format expected by the components
  const monthlyCollectionProps = {
    index: 'labels',
    categories: monthlyCollectionData.labels,
    colors: ['rgba(59, 130, 246, 0.5)', 'rgba(34, 197, 94, 0.5)'],
    data: [
      monthlyCollectionData.datasets[0].data,
      monthlyCollectionData.datasets[1].data,
    ],
  };

  const feeDistributionProps = {
    index: 'labels',
    categories: feeDistributionData.labels,
    colors: [
      'rgba(59, 130, 246, 0.7)',
      'rgba(34, 197, 94, 0.7)',
      'rgba(245, 158, 11, 0.7)',
      'rgba(139, 92, 246, 0.7)',
      'rgba(236, 72, 153, 0.7)',
      'rgba(75, 85, 99, 0.7)'
    ],
    data: feeDistributionData.datasets[0].data,
  };
  
  // Sample report data for data table
  const reportData = [
    {
      id: 1,
      month: "January",
      invoiced_amount: 320000,
      collected_amount: 300000,
      pending_amount: 20000,
      collection_rate: 93.75
    },
    {
      id: 2,
      month: "February",
      invoiced_amount: 350000,
      collected_amount: 330000,
      pending_amount: 20000,
      collection_rate: 94.29
    },
    {
      id: 3,
      month: "March",
      invoiced_amount: 400000,
      collected_amount: 380000,
      pending_amount: 20000,
      collection_rate: 95.00
    },
    {
      id: 4,
      month: "April",
      invoiced_amount: 450000,
      collected_amount: 420000,
      pending_amount: 30000,
      collection_rate: 93.33
    },
    {
      id: 5,
      month: "May",
      invoiced_amount: 420000,
      collected_amount: 400000,
      pending_amount: 20000,
      collection_rate: 95.24
    },
    {
      id: 6,
      month: "June",
      invoiced_amount: 380000,
      collected_amount: 350000,
      pending_amount: 30000,
      collection_rate: 92.11
    },
    {
      id: 7,
      month: "July",
      invoiced_amount: 510000,
      collected_amount: 480000,
      pending_amount: 30000,
      collection_rate: 94.12
    },
    {
      id: 8,
      month: "August",
      invoiced_amount: 480000,
      collected_amount: 450000,
      pending_amount: 30000,
      collection_rate: 93.75
    },
    {
      id: 9,
      month: "September",
      invoiced_amount: 540000,
      collected_amount: 495000,
      pending_amount: 45000,
      collection_rate: 91.67
    }
  ];
  
  // Defaulters report
  const defaultersData = [
    {
      id: 1,
      student_name: "Rahul Sharma",
      student_id: "ST20230001",
      class: "10A",
      pending_amount: 12500,
      overdue_days: 45,
      contacts: "+91-9876543210",
      status: "Follow-up"
    },
    {
      id: 2,
      student_name: "Priya Patel",
      student_id: "ST20230045",
      class: "11B",
      pending_amount: 18500,
      overdue_days: 30,
      contacts: "+91-9876543211",
      status: "Reminder Sent"
    },
    {
      id: 3,
      student_name: "Karan Singh",
      student_id: "ST20230023",
      class: "9C",
      pending_amount: 10000,
      overdue_days: 60,
      contacts: "+91-9876543212",
      status: "Pending"
    },
    {
      id: 4,
      student_name: "Neha Gupta",
      student_id: "ST20230078",
      class: "12A",
      pending_amount: 25000,
      overdue_days: 15,
      contacts: "+91-9876543213",
      status: "Partially Paid"
    },
    {
      id: 5,
      student_name: "Arjun Kumar",
      student_id: "ST20230105",
      class: "8B",
      pending_amount: 8500,
      overdue_days: 25,
      contacts: "+91-9876543214",
      status: "Follow-up"
    }
  ];
  
  // Table column definitions for monthly report
  const monthlyReportColumns = [
    {
      id: "month",
      header: "Month",
      cell: (item) => <span className="font-medium">{item.month}</span>,
      isSortable: true,
      sortKey: "month"
    },
    {
      id: "invoiced_amount",
      header: "Invoiced Amount",
      cell: (item) => <span className="font-medium">₹{item.invoiced_amount.toLocaleString()}</span>,
      isSortable: true,
      sortKey: "invoiced_amount"
    },
    {
      id: "collected_amount",
      header: "Collected Amount",
      cell: (item) => <span className="font-medium text-green-600">₹{item.collected_amount.toLocaleString()}</span>,
      isSortable: true,
      sortKey: "collected_amount"
    },
    {
      id: "pending_amount",
      header: "Pending Amount",
      cell: (item) => <span className="font-medium text-amber-600">₹{item.pending_amount.toLocaleString()}</span>,
      isSortable: true,
      sortKey: "pending_amount"
    },
    {
      id: "collection_rate",
      header: "Collection Rate",
      cell: (item) => (
        <Badge variant={item.collection_rate > 94 ? "success" : "warning"} className="font-medium">
          {item.collection_rate}%
        </Badge>
      ),
      isSortable: true,
      sortKey: "collection_rate"
    }
  ];
  
  // Table column definitions for defaulters report
  const defaultersReportColumns = [
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
      id: "pending_amount",
      header: "Pending Amount",
      cell: (item) => <span className="font-medium text-red-600">₹{item.pending_amount.toLocaleString()}</span>,
      isSortable: true,
      sortKey: "pending_amount"
    },
    {
      id: "overdue_days",
      header: "Overdue Days",
      cell: (item) => <span className="font-medium">{item.overdue_days} days</span>,
      isSortable: true,
      sortKey: "overdue_days"
    },
    {
      id: "contacts",
      header: "Contact",
      cell: (item) => <span>{item.contacts}</span>,
      isSortable: false
    },
    {
      id: "status",
      header: "Status",
      cell: (item) => {
        let badgeVariant = "default";
        if (item.status === "Follow-up") badgeVariant = "warning";
        if (item.status === "Reminder Sent") badgeVariant = "secondary";
        if (item.status === "Partially Paid") badgeVariant = "success";
        
        return <Badge variant={badgeVariant as any}>{item.status}</Badge>;
      },
      isSortable: true,
      sortKey: "status"
    }
  ];
  
  return (
    <PageTemplate title="Invoices Report" subtitle="View and export invoice reports">
      <div className="grid gap-6">
        {/* Report Header with Date Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium">Financial Report</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">From:</Label>
                  <Input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                    className="w-auto"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">To:</Label>
                  <Input
                    type="date" 
                    value={dateRange.to}
                    onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                    className="w-auto"
                  />
                </div>
                <Button>Apply</Button>
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Report
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Report Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
            <TabsTrigger value="fee-type">Fee Type Breakdown</TabsTrigger>
            <TabsTrigger value="defaulters">Defaulters</TabsTrigger>
          </TabsList>
          
          {/* Summary Tab */}
          <TabsContent value="summary">
            <div className="grid gap-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col">
                    <p className="text-sm font-medium text-muted-foreground">Total Invoiced</p>
                    <h3 className="text-2xl font-bold">₹{summaryData.totalInvoiced.toLocaleString()}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {summaryData.invoiceCount} invoices
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col">
                    <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
                    <h3 className="text-2xl font-bold text-green-600">₹{summaryData.totalCollected.toLocaleString()}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {summaryData.paidCount} paid invoices
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col">
                    <p className="text-sm font-medium text-muted-foreground">Total Pending</p>
                    <h3 className="text-2xl font-bold text-amber-600">₹{summaryData.totalPending.toLocaleString()}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {summaryData.pendingCount} pending invoices
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col">
                    <p className="text-sm font-medium text-muted-foreground">Total Overdue</p>
                    <h3 className="text-2xl font-bold text-red-600">₹{summaryData.totalOverdue.toLocaleString()}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {summaryData.overdueCount} overdue invoices
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Charts */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Collection Trend</CardTitle>
                  <CardDescription>Comparison of invoiced vs collected amounts</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BarChart {...monthlyCollectionProps} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Fee Type Distribution</CardTitle>
                  <CardDescription>Breakdown of collected fees by category</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BarChart {...feeDistributionProps} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Monthly Report Tab */}
          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Collection Report</CardTitle>
                <CardDescription>Detailed monthly fee collection analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable 
                  data={reportData}
                  columns={monthlyReportColumns}
                  keyField="id"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Fee Type Breakdown Tab */}
          <TabsContent value="fee-type">
            <Card>
              <CardHeader>
                <CardTitle>Fee Type Breakdown</CardTitle>
                <CardDescription>Analysis of fee collection by fee category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="h-[300px]">
                    <BarChart {...feeDistributionProps} />
                  </div>
                  
                  <div className="overflow-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Fee Type</th>
                          <th className="text-right py-2">Amount (₹)</th>
                          <th className="text-right py-2">% of Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feeDistributionData.labels.map((label, index) => {
                          const amount = feeDistributionData.datasets[0].data[index];
                          const totalAmount = feeDistributionData.datasets[0].data.reduce((a, b) => a + b, 0);
                          const percentage = ((amount / totalAmount) * 100).toFixed(2);
                          
                          return (
                            <tr key={label} className="border-b">
                              <td className="py-3">{label}</td>
                              <td className="text-right py-3">{amount.toLocaleString()}</td>
                              <td className="text-right py-3">{percentage}%</td>
                            </tr>
                          );
                        })}
                        <tr className="font-bold">
                          <td className="py-3">Total</td>
                          <td className="text-right py-3">
                            {feeDistributionData.datasets[0].data.reduce((a, b) => a + b, 0).toLocaleString()}
                          </td>
                          <td className="text-right py-3">100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Defaulters Tab */}
          <TabsContent value="defaulters">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Fee Defaulters Report</CardTitle>
                    <CardDescription>Students with pending or overdue fee payments</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
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
                <div className="mb-4">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students..."
                      className="pl-8"
                    />
                  </div>
                </div>
                <DataTable 
                  data={defaultersData}
                  columns={defaultersReportColumns}
                  keyField="id"
                  actions={[
                    {
                      label: "View Details",
                      onClick: (item) => alert(`Viewing details for ${item.student_name}`)
                    },
                    {
                      label: "Mark as Followed Up",
                      onClick: (item) => alert(`Marking ${item.student_name} as followed up`)
                    },
                    {
                      label: "Send Reminder",
                      onClick: (item) => alert(`Sending reminder to ${item.student_name}`)
                    }
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTemplate>
  );
};

const Label = ({ className, children, ...props }) => {
  return (
    <label className={`text-sm font-medium ${className || ""}`} {...props}>
      {children}
    </label>
  );
};

export default InvoicesReport;
