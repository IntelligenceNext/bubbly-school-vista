
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowUp, ArrowDown, FileText } from 'lucide-react';
import { BarChart } from '@/components/ui/BarChart';
import { LineChart } from '@/components/ui/LineChart';

const Dashboard = () => {
  // Sample financial data
  const financialSummary = {
    totalIncome: "₹2,574,800",
    totalExpenses: "₹1,985,300",
    pendingFees: "₹485,250",
    collectedFees: "₹2,124,600",
  };
  
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income',
        data: [150000, 180000, 220000, 210000, 180000, 240000, 220000, 200000, 280000, 260000, 240000, 190000],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
      },
      {
        label: 'Expenses',
        data: [120000, 140000, 160000, 180000, 150000, 170000, 190000, 165000, 200000, 180000, 210000, 170000],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
      }
    ]
  };

  const feeCollectionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Fee Collection',
        data: [125000, 170000, 190000, 180000, 160000, 210000, 200000, 180000, 240000, 220000, 190000, 160000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      }
    ]
  };

  const recentTransactions = [
    { id: "TR001", date: "2023-09-15", description: "Tuition Fee - Grade 10", type: "income", amount: "₹18,500" },
    { id: "TR002", date: "2023-09-14", description: "Electricity Bill Payment", type: "expense", amount: "₹24,800" },
    { id: "TR003", date: "2023-09-13", description: "Staff Salary - September", type: "expense", amount: "₹185,000" },
    { id: "TR004", date: "2023-09-12", description: "Library Fee Collection", type: "income", amount: "₹12,500" },
    { id: "TR005", date: "2023-09-10", description: "Transport Fee Collection", type: "income", amount: "₹45,000" }
  ];
  
  return (
    <PageTemplate title="Accounting Dashboard" subtitle="Financial overview of the school">
      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                  <h3 className="text-2xl font-bold text-green-600">{financialSummary.totalIncome}</h3>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <ArrowUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                  <h3 className="text-2xl font-bold text-red-600">{financialSummary.totalExpenses}</h3>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <ArrowDown className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Fees</p>
                  <h3 className="text-2xl font-bold text-amber-600">{financialSummary.pendingFees}</h3>
                </div>
                <div className="p-2 bg-amber-100 rounded-full">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Collected Fees</p>
                  <h3 className="text-2xl font-bold text-blue-600">{financialSummary.collectedFees}</h3>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses (2023)</CardTitle>
              <CardDescription>Monthly financial comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: 300 }}>
                <BarChart 
                  data={monthlyData}
                  index="name"
                  categories={['Income', 'Expenses']}
                  colors={['22, 197, 94', '239, 68, 68']}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Fee Collection Trends</CardTitle>
              <CardDescription>Monthly fee collection analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: 300 }}>
                <LineChart 
                  data={feeCollectionData}
                  index="name"
                  categories={['Fee Collection']}
                  colors={['59, 130, 246']}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Activities</CardTitle>
            <CardDescription>Recent financial transactions and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recent">
              <TabsList className="mb-4">
                <TabsTrigger value="recent">Recent Transactions</TabsTrigger>
                <TabsTrigger value="pending">Pending Payments</TabsTrigger>
                <TabsTrigger value="overdue">Overdue Fees</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent">
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                        }`}>
                          {transaction.type === "income" ? 
                            <ArrowUp className="h-4 w-4 text-green-600" /> : 
                            <ArrowDown className="h-4 w-4 text-red-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            <Calendar className="inline h-3 w-3 mr-1" /> {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className={`font-bold ${
                          transaction.type === "income" ? "text-green-600" : "text-red-600"
                        }`}>
                          {transaction.type === "income" ? "+" : "-"}{transaction.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Button variant="outline" className="w-full">View All Transactions</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="pending">
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">Pending payments data will be displayed here</p>
                </div>
              </TabsContent>
              
              <TabsContent value="overdue">
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">Overdue fees data will be displayed here</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default Dashboard;
