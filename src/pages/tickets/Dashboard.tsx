
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChartProps } from '@/components/ui/LineChart';
import { BarChartProps } from '@/components/ui/BarChart';
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
  MessageSquare,
  Check,
  Calendar,
  Clock,
  Bell,
  User,
} from 'lucide-react';

const TicketsDashboard = () => {
  // Mock data for charts
  const ticketsByStatusData = {
    index: 'status',
    categories: ['New', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
    colors: ['#e11d48', '#6366f1', '#0ea5e9', '#10b981', '#6b7280'],
    data: [12, 8, 15, 24, 7]
  };
  
  const ticketsByDepartmentData = {
    index: 'department',
    categories: ['IT', 'Admin', 'Academic', 'Transport', 'Hostel', 'Other'],
    colors: ['#6366f1', '#10b981', '#f59e0b', '#0ea5e9', '#8b5cf6', '#6b7280'],
    data: [18, 12, 8, 10, 14, 4]
  };

  const ticketsTrendData = {
    index: 'date',
    categories: ['May 1', 'May 2', 'May 3', 'May 4', 'May 5', 'May 6', 'May 7'],
    colors: ['#6366f1', '#10b981'],
    data: [
      { name: 'New Tickets', data: [3, 5, 2, 7, 4, 6, 4] },
      { name: 'Resolved', data: [2, 3, 4, 2, 6, 5, 3] }
    ]
  };
  
  // Mock data for recent tickets
  const recentTickets = [
    {
      id: "TKT-001",
      title: "Projector not working in Room 203",
      status: "New",
      priority: "High",
      requester: "John Smith",
      created_at: "2023-05-10T09:30:00Z"
    },
    {
      id: "TKT-002",
      title: "Student fee discrepancy",
      status: "Assigned",
      priority: "Medium",
      requester: "Sarah Johnson",
      created_at: "2023-05-09T14:20:00Z"
    },
    {
      id: "TKT-003",
      title: "Bus route delay",
      status: "In Progress",
      priority: "Medium",
      requester: "Robert Wilson",
      created_at: "2023-05-08T08:15:00Z"
    },
    {
      id: "TKT-004",
      title: "Water leakage in Girls Hostel",
      status: "In Progress",
      priority: "Urgent",
      requester: "Emily Brown",
      created_at: "2023-05-07T18:45:00Z"
    },
    {
      id: "TKT-005",
      title: "Online class access issue",
      status: "Resolved",
      priority: "High",
      requester: "Jessica Lee",
      created_at: "2023-05-06T11:20:00Z"
    }
  ];
  
  // Status badge color mapping
  const statusColors: Record<string, "default" | "primary" | "secondary" | "destructive" | "outline"> = {
    "New": "outline",
    "Assigned": "secondary",
    "In Progress": "primary",
    "Resolved": "default",
    "Closed": "destructive"
  };
  
  // Priority badge color mapping
  const priorityColors: Record<string, "default" | "primary" | "secondary" | "destructive" | "outline"> = {
    "Low": "outline",
    "Medium": "secondary",
    "High": "primary",
    "Urgent": "destructive"
  };
  
  // Summary statistics
  const summaryStats = [
    {
      title: "Total Tickets",
      value: "66",
      icon: <MessageSquare className="h-5 w-5" />,
      change: "+12% from last week"
    },
    {
      title: "Resolved",
      value: "24",
      icon: <Check className="h-5 w-5" />,
      change: "+8% from last week"
    },
    {
      title: "Response Time",
      value: "4.2h",
      icon: <Clock className="h-5 w-5" />,
      change: "-15% from last week"
    },
    {
      title: "Urgent",
      value: "7",
      icon: <Bell className="h-5 w-5" />,
      change: "+2 from last week"
    }
  ];
  
  // Top assignees data
  const topAssignees = [
    { name: "Thomas Wilson", count: 12, department: "IT Support" },
    { name: "Emma Thompson", count: 9, department: "Transportation" },
    { name: "David Clark", count: 7, department: "Maintenance" },
    { name: "Michael Davis", count: 6, department: "Finance" }
  ];

  return (
    <PageTemplate title="Tickets Dashboard" subtitle="Overview of support tickets">
      <div className="space-y-6">
        <PageHeader
          title="Support Tickets Overview"
          description="Monitor and analyze support ticket metrics"
        />
        
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tickets by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChartProps index={ticketsByStatusData.index} categories={ticketsByStatusData.categories} colors={ticketsByStatusData.colors} data={ticketsByStatusData.data} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tickets by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChartProps index={ticketsByDepartmentData.index} categories={ticketsByDepartmentData.categories} colors={ticketsByDepartmentData.colors} data={ticketsByDepartmentData.data} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Tickets Trend (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChartProps index={ticketsTrendData.index} categories={ticketsTrendData.categories} colors={ticketsTrendData.colors} data={ticketsTrendData.data} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{ticket.title}</TableCell>
                        <TableCell>
                          <Badge variant={statusColors[ticket.status]}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={priorityColors[ticket.priority]}>
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Top Assignees */}
          <Card>
            <CardHeader>
              <CardTitle>Top Assignees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAssignees.map((assignee, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{assignee.name}</p>
                        <p className="text-sm text-muted-foreground">{assignee.department}</p>
                      </div>
                    </div>
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                      {assignee.count} tickets
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTemplate>
  );
};

export default TicketsDashboard;
