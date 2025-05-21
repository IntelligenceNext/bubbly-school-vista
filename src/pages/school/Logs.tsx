
import React, { useState, useEffect } from 'react';
import PageTemplate from '@/components/PageTemplate';
import DataTable from '@/components/DataTable';
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FilterDropdown from '@/components/FilterDropdown';
import { format } from 'date-fns';
import { CalendarDays, Filter, Info, User } from 'lucide-react';

// Interface for Logs
interface Log {
  id: string;
  school_id: string;
  user_id: string;
  action_type: string;
  entity: string;
  entity_id: string | null;
  description: string;
  timestamp: string;
  ip_address: string;
  user_name?: string; // For display purposes
}

// Mock logs - We'll use this since the logs table doesn't exist in the database yet
const generateMockLogs = (): Log[] => {
  const mockLogs: Log[] = [];
  const actionTypes = ['create', 'update', 'delete', 'login', 'logout', 'view'];
  const entityTypes = ['student', 'class', 'school', 'session', 'setting', 'user', 'inquiry'];
  
  for (let i = 1; i <= 15; i++) {
    const date = new Date();
    date.setHours(date.getHours() - i);
    
    mockLogs.push({
      id: `log-${i}`,
      school_id: "school-id-1",
      user_id: `user-${i % 3 + 1}`,
      user_name: `User ${i % 3 + 1}`,
      action_type: actionTypes[i % actionTypes.length],
      entity: entityTypes[i % entityTypes.length],
      entity_id: `entity-${i}`,
      description: `${actionTypes[i % actionTypes.length]} operation performed on ${entityTypes[i % entityTypes.length]} with ID entity-${i}`,
      timestamp: date.toISOString(),
      ip_address: `192.168.1.${i % 255}`
    });
  }
  
  return mockLogs;
};

const Logs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Filter states
  const [filters, setFilters] = useState({
    actionType: '',
    entity: '',
    userId: '',
    dateRange: { from: '', to: '' }
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Action types and entities for filtering
  const actionTypes = ['create', 'update', 'delete', 'login', 'logout', 'view'];
  const entityTypes = ['student', 'class', 'school', 'session', 'setting', 'user', 'inquiry'];
  
  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (filters.actionType) count++;
    if (filters.entity) count++;
    if (filters.userId) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    setActiveFiltersCount(count);
  }, [filters]);
  
  // Fetch logs
  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Since the 'logs' table doesn't exist in the database yet, we'll use mock data
      // In a real implementation, we would query the database
      const mockLogs = generateMockLogs();
      
      // Apply filters
      let filteredLogs = [...mockLogs];
      
      if (filters.actionType) {
        filteredLogs = filteredLogs.filter(log => log.action_type === filters.actionType);
      }
      
      if (filters.entity) {
        filteredLogs = filteredLogs.filter(log => log.entity === filters.entity);
      }
      
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.user_id === filters.userId);
      }
      
      if (filters.dateRange.from) {
        const fromDate = new Date(filters.dateRange.from);
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= fromDate);
      }
      
      if (filters.dateRange.to) {
        const toDate = new Date(filters.dateRange.to);
        toDate.setDate(toDate.getDate() + 1); // Include the end date
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= toDate);
      }
      
      setLogs(filteredLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: "Error",
        description: "Failed to load logs. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchLogs();
  }, []);
  
  // Apply filters
  const handleApplyFilters = () => {
    fetchLogs();
  };
  
  // Reset filters
  const handleClearFilters = () => {
    setFilters({
      actionType: '',
      entity: '',
      userId: '',
      dateRange: { from: '', to: '' }
    });
  };
  
  // Define table columns
  const columns = [
    {
      id: 'user_name',
      header: 'User',
      cell: (row: Log) => (
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{row.user_name || row.user_id}</span>
        </div>
      )
    },
    {
      id: 'action_type',
      header: 'Action',
      cell: (row: Log) => (
        <div className="capitalize">
          {row.action_type}
        </div>
      )
    },
    {
      id: 'entity',
      header: 'Entity',
      cell: (row: Log) => (
        <div className="capitalize">
          {row.entity}
        </div>
      )
    },
    {
      id: 'description',
      header: 'Description',
      cell: (row: Log) => (
        <div className="max-w-md truncate">
          {row.description}
        </div>
      )
    },
    {
      id: 'timestamp',
      header: 'Timestamp',
      cell: (row: Log) => (
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
          {format(new Date(row.timestamp), 'dd MMM yyyy HH:mm:ss')}
        </div>
      )
    },
    {
      id: 'ip_address',
      header: 'IP Address',
      cell: (row: Log) => (
        <div className="font-mono text-sm">
          {row.ip_address}
        </div>
      )
    }
  ];
  
  // Build filters UI
  const filtersUI = (
    <div className="space-y-4">
      <div>
        <Label>Action Type</Label>
        <Select value={filters.actionType} onValueChange={(value) => setFilters({...filters, actionType: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select action type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {actionTypes.map(type => (
              <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Entity</Label>
        <Select value={filters.entity} onValueChange={(value) => setFilters({...filters, entity: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {entityTypes.map(entity => (
              <SelectItem key={entity} value={entity} className="capitalize">{entity}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>User</Label>
        <Select value={filters.userId} onValueChange={(value) => setFilters({...filters, userId: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="user-1">User 1</SelectItem>
            <SelectItem value="user-2">User 2</SelectItem>
            <SelectItem value="user-3">User 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Date Range</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div>
            <Label className="text-xs">From</Label>
            <Input 
              type="date" 
              value={filters.dateRange.from}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, from: e.target.value}})}
            />
          </div>
          <div>
            <Label className="text-xs">To</Label>
            <Input 
              type="date" 
              value={filters.dateRange.to}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, to: e.target.value}})}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PageTemplate title="Logs" subtitle="View system logs and activities">
      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
          <div>
            <CardTitle>Activity Logs</CardTitle>
            <CardDescription>
              View all system activities and user actions
            </CardDescription>
          </div>
          <div>
            <FilterDropdown
              filters={filtersUI}
              onClear={handleClearFilters}
              onApply={handleApplyFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </div>
        </CardHeader>

        <CardContent>
          {!loading && logs.length === 0 ? (
            <div className="text-center py-8">
              <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium">No logs found</h3>
              <p className="text-muted-foreground mt-1">
                {activeFiltersCount > 0 
                  ? 'Try clearing your search filters.' 
                  : 'No system logs have been recorded yet.'}
              </p>
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outline" 
                  onClick={handleClearFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <DataTable 
              data={logs} 
              columns={columns} 
              keyField="id" 
              isLoading={loading}
            />
          )}
        </CardContent>
      </Card>
    </PageTemplate>
  );
};

export default Logs;
