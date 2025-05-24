
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInquiries, Inquiry, updateInquiryStatus } from '@/services/inquiryService';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import FilterDropdown from '@/components/FilterDropdown';
import usePagination from '@/hooks/usePagination';
import { MoreHorizontal, Calendar, ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define badge color mappings with proper variants
const priorityColors: Record<string, "secondary" | "default" | "destructive" | "outline" | "success"> = {
  high: "destructive",
  medium: "default",
  low: "secondary",
  urgent: "destructive",
};

const statusColors: Record<string, "secondary" | "default" | "destructive" | "outline" | "success"> = {
  new: "destructive",
  contacted: "default",
  interested: "success",
  scheduled: "default",
  enrolled: "secondary",
  closed: "outline",
};

const InquiriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, userSession } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [inquiriesData, setInquiriesData] = useState<Inquiry[]>([]);
  const [filters, setFilters] = useState({
    source: "",
    priority: "",
    dateFrom: "",
    dateTo: "",
  });

  // For demo purposes, using the same valid UUID as in CreateInquiry
  const DEMO_SCHOOL_ID = "550e8400-e29b-41d4-a716-446655440000";

  const { pageIndex, pageSize, setTotalCount, pageCount, setPageIndex } = usePagination({
    initialPageSize: 10,
  });

  const fetchInquiriesOptions = {
    schoolId: DEMO_SCHOOL_ID, // Use the same valid UUID
    filters: {
      ...filters,
      status: activeTab !== "all" ? activeTab : undefined,
    },
    page: pageIndex + 1,
    pageSize,
  };

  console.log('Fetching inquiries with options:', fetchInquiriesOptions);

  const {
    data: inquiriesResponse,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ['inquiries', fetchInquiriesOptions],
    queryFn: async () => {
      console.log('Query function called with schoolId:', fetchInquiriesOptions.schoolId);
      return getInquiries(
        fetchInquiriesOptions.schoolId,
        fetchInquiriesOptions.filters,
        fetchInquiriesOptions.page,
        fetchInquiriesOptions.pageSize
      );
    },
  });

  console.log('Query response:', inquiriesResponse);
  console.log('Query error:', error);

  useEffect(() => {
    if (inquiriesResponse) {
      console.log('Setting inquiries data:', inquiriesResponse.data);
      setInquiriesData(inquiriesResponse.data);
      setTotalCount(inquiriesResponse.count);
    }
  }, [inquiriesResponse, setTotalCount]);

  // Calculate status counts from the fetched data
  const statusCounts = {
    all: inquiriesResponse?.count || 0,
    new: inquiriesData.filter(inq => inq.status === 'new').length,
    contacted: inquiriesData.filter(inq => inq.status === 'contacted').length,
    interested: inquiriesData.filter(inq => inq.status === 'interested').length,
    scheduled: inquiriesData.filter(inq => inq.status === 'scheduled').length,
    enrolled: inquiriesData.filter(inq => inq.status === 'enrolled').length,
    closed: inquiriesData.filter(inq => inq.status === 'closed').length,
  };

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    try {
      await updateInquiryStatus(inquiryId, newStatus);
      toast({
        title: "Status updated",
        description: `Inquiry status changed to ${newStatus}`,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update inquiry status",
        variant: "destructive",
      });
    }
  };

  const handleCreate = () => {
    navigate('/school/inquiries/create');
  };

  const handleView = (inquiryId: string) => {
    navigate(`/school/inquiries/${inquiryId}`);
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      source: "",
      priority: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  return (
    <PageTemplate title="Inquiries" subtitle="Manage student inquiries">
      <Card>
        <CardHeader>
          <CardTitle>Inquiry Management</CardTitle>
          <CardDescription>View and manage all student inquiries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
                <TabsTrigger value="new">New ({statusCounts.new})</TabsTrigger>
                <TabsTrigger value="contacted">Contacted ({statusCounts.contacted})</TabsTrigger>
                <TabsTrigger value="interested">Interested ({statusCounts.interested})</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled ({statusCounts.scheduled})</TabsTrigger>
                <TabsTrigger value="enrolled">Enrolled ({statusCounts.enrolled})</TabsTrigger>
                <TabsTrigger value="closed">Closed ({statusCounts.closed})</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create Inquiry
            </Button>
          </div>

          <div className="mb-4 flex items-center space-x-2">
            <FilterDropdown
              filterKey="source"
              filterName="Source"
              options={['website', 'referral', 'event', 'social_media', 'advertisement', 'walk_in', 'other']}
              selectedValue={filters.source}
              onFilterChange={handleFilterChange}
            />
            <FilterDropdown
              filterKey="priority"
              filterName="Priority"
              options={['low', 'medium', 'high', 'urgent']}
              selectedValue={filters.priority}
              onFilterChange={handleFilterChange}
            />
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                placeholder="Date from"
                className="bg-transparent border px-8 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 rounded-md w-32"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                placeholder="Date to"
                className="bg-transparent border px-8 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 rounded-md w-32"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>

          <div className="relative overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Inquiry Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Loading inquiries...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-red-500">
                      Error loading inquiries: {error.message}
                    </TableCell>
                  </TableRow>
                ) : inquiriesData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">No inquiries found.</TableCell>
                  </TableRow>
                ) : (
                  inquiriesData.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell className="font-medium">{inquiry.name}</TableCell>
                      <TableCell>{inquiry.email}</TableCell>
                      <TableCell>{inquiry.phone || 'N/A'}</TableCell>
                      <TableCell className="capitalize">{inquiry.inquiry_type}</TableCell>
                      <TableCell>
                        <Badge variant={priorityColors[inquiry.priority as keyof typeof priorityColors] || "default"}>
                          {inquiry.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColors[inquiry.status as keyof typeof statusColors] || "default"}>
                          {inquiry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(inquiry.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(inquiry.id)}>
                              <ArrowRight className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(inquiry.id, 'contacted')}>
                              Mark as Contacted
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(inquiry.id, 'interested')}>
                              Mark as Interested
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(inquiry.id, 'scheduled')}>
                              Mark as Scheduled
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(inquiry.id, 'enrolled')}>
                              Mark as Enrolled
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(inquiry.id, 'closed')}>
                              Mark as Closed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {inquiriesResponse && inquiriesResponse.count > pageSize && (
            <div className="flex items-center justify-between mt-4">
              <Button
                onClick={() => setPageIndex(0)}
                disabled={pageIndex === 0}
                variant="outline"
                size="sm"
              >
                First
              </Button>
              <Button
                onClick={() => setPageIndex(pageIndex - 1)}
                disabled={pageIndex === 0}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pageIndex + 1} of {pageCount} ({inquiriesResponse.count} total)
              </span>
              <Button
                onClick={() => setPageIndex(pageIndex + 1)}
                disabled={pageIndex >= pageCount - 1}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
              <Button
                onClick={() => setPageIndex(pageCount - 1)}
                disabled={pageIndex >= pageCount - 1}
                variant="outline"
                size="sm"
              >
                Last
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </PageTemplate>
  );
};

export default InquiriesPage;
