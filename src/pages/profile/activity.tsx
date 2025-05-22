
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Download, Calendar, Clock, User, Monitor, Shield, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/DateRangePicker'; // Assume this exists based on shadcn-ui docs

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: Date;
  ip: string;
  device: string;
  category: 'auth' | 'data' | 'security' | 'system';
  status: 'success' | 'warning' | 'error';
}

const ActivityLogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Mock activity log data
  const activityLogs: ActivityLog[] = [
    {
      id: 'log1',
      action: 'Login',
      details: 'Successfully logged in to the system',
      timestamp: new Date(2023, 4, 22, 9, 15),
      ip: '192.168.1.105',
      device: 'Chrome on Windows',
      category: 'auth',
      status: 'success'
    },
    {
      id: 'log2',
      action: 'Profile Update',
      details: 'Updated personal information',
      timestamp: new Date(2023, 4, 21, 14, 30),
      ip: '192.168.1.105',
      device: 'Chrome on Windows',
      category: 'data',
      status: 'success'
    },
    {
      id: 'log3',
      action: 'Grade Submission',
      details: 'Submitted grades for Class 10A - Mathematics',
      timestamp: new Date(2023, 4, 20, 16, 45),
      ip: '192.168.1.105',
      device: 'Chrome on Windows',
      category: 'data',
      status: 'success'
    },
    {
      id: 'log4',
      action: 'Password Change',
      details: 'Changed account password',
      timestamp: new Date(2023, 4, 18, 10, 22),
      ip: '192.168.1.105',
      device: 'Chrome on Windows',
      category: 'security',
      status: 'success'
    },
    {
      id: 'log5',
      action: 'Login Attempt',
      details: 'Failed login attempt',
      timestamp: new Date(2023, 4, 17, 8, 5),
      ip: '203.45.67.89',
      device: 'Unknown device',
      category: 'auth',
      status: 'error'
    },
    {
      id: 'log6',
      action: 'Report Access',
      details: 'Accessed student performance reports',
      timestamp: new Date(2023, 4, 15, 11, 30),
      ip: '192.168.1.110',
      device: 'Safari on MacOS',
      category: 'data',
      status: 'success'
    },
    {
      id: 'log7',
      action: 'File Upload',
      details: 'Uploaded teaching materials for Class 10A',
      timestamp: new Date(2023, 4, 15, 9, 45),
      ip: '192.168.1.110',
      device: 'Safari on MacOS',
      category: 'data',
      status: 'success'
    },
    {
      id: 'log8',
      action: 'Login',
      details: 'Successfully logged in to the system',
      timestamp: new Date(2023, 4, 15, 9, 10),
      ip: '192.168.1.110',
      device: 'Safari on MacOS',
      category: 'auth',
      status: 'success'
    }
  ];
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return <User className="h-4 w-4" />;
      case 'data':
        return <Shield className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const filteredLogs = activityLogs.filter(log => {
    // Filter by search query
    if (searchQuery && !log.action.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !log.details.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (categoryFilter !== 'all' && log.category !== categoryFilter) {
      return false;
    }
    
    // Filter by date range
    if (dateFilter?.from && dateFilter?.to) {
      const logDate = new Date(log.timestamp);
      if (logDate < dateFilter.from || logDate > dateFilter.to) {
        return false;
      }
    }
    
    return true;
  });
  
  return (
    <PageTemplate title="Activity Log" subtitle="Track your system activities and login history">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Activity History</span>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Log
              </Button>
            </CardTitle>
            <CardDescription>
              Review your recent activities and system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search activities..." 
                    className="pl-8" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select 
                  value={categoryFilter} 
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="auth">Authentication</SelectItem>
                    <SelectItem value="data">Data Changes</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <div>
                  {/* We would need a DateRangePicker component here */}
                  <Button variant="outline" className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Date Range</span>
                  </Button>
                </div>
              </div>
              
              {/* Activity Log Table */}
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Action</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Details</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date & Time</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">IP & Device</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">
                            <div className="flex items-center">
                              {getCategoryIcon(log.category)}
                              <span className="ml-2 font-medium">{log.action}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            {log.details}
                          </td>
                          <td className="p-4 align-middle whitespace-nowrap">
                            {format(log.timestamp, 'dd MMM yyyy, HH:mm')}
                          </td>
                          <td className="p-4 align-middle">
                            <div>
                              <div className="font-mono text-xs">{log.ip}</div>
                              <div className="text-xs text-muted-foreground">{log.device}</div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            {getStatusBadge(log.status)}
                          </td>
                        </tr>
                      ))}
                      {filteredLogs.length === 0 && (
                        <tr>
                          <td colSpan={5} className="h-24 text-center">
                            No activity logs matching your filters
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredLogs.length} of {activityLogs.length} entries
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled={true}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <User className="mr-2 h-4 w-4 text-blue-600" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {activityLogs.filter(log => log.category === 'auth').length}
              </p>
              <p className="text-sm text-muted-foreground">
                Login and authentication activities
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Shield className="mr-2 h-4 w-4 text-green-600" />
                Data Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {activityLogs.filter(log => log.category === 'data').length}
              </p>
              <p className="text-sm text-muted-foreground">
                Data modifications and updates
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Shield className="mr-2 h-4 w-4 text-amber-600" />
                Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {activityLogs.filter(log => log.category === 'security').length}
              </p>
              <p className="text-sm text-muted-foreground">
                Security-related activities
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Security Recommendations</CardTitle>
            <CardDescription>
              Based on your activity patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start border rounded-lg p-4">
                <Shield className="h-5 w-5 mr-3 mt-0.5 text-amber-500" />
                <div>
                  <h3 className="font-medium">Enable Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We recommend enabling two-factor authentication for better account security.
                  </p>
                  <Button variant="link" className="px-0 py-0 h-auto mt-2">
                    Set up 2FA
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start border rounded-lg p-4">
                <Clock className="h-5 w-5 mr-3 mt-0.5 text-blue-500" />
                <div>
                  <h3 className="font-medium">Regular Password Updates</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your password was last changed 45 days ago. Consider updating it regularly.
                  </p>
                  <Button variant="link" className="px-0 py-0 h-auto mt-2">
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default ActivityLogPage;
