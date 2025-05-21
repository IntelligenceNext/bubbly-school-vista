
import React, { useState, useEffect } from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { useToast } from "@/hooks/use-toast";
import { DataTable } from '@/components/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { ColumnDef } from '@tanstack/react-table';
import { CalendarDays, FileText, Info, Mail, MessageSquare, Phone, Plus, User } from 'lucide-react';
import FilterDropdown from '@/components/FilterDropdown';
import { format } from 'date-fns';

// Define status colors
const statusColors = {
  new: "bg-blue-500 hover:bg-blue-600",
  in_progress: "bg-amber-500 hover:bg-amber-600",
  follow_up: "bg-purple-500 hover:bg-purple-600",
  closed: "bg-green-500 hover:bg-green-600"
};

// Define status badges
const statusBadges = {
  new: <Badge className="bg-blue-500 hover:bg-blue-500">New</Badge>,
  in_progress: <Badge className="bg-amber-500 hover:bg-amber-500">In Progress</Badge>,
  follow_up: <Badge className="bg-purple-500 hover:bg-purple-500">Follow Up</Badge>,
  closed: <Badge className="bg-green-500 hover:bg-green-500">Closed</Badge>
};

// Source badges
const sourceBadges = {
  website: <Badge variant="outline" className="border-blue-300 text-blue-600">Website</Badge>,
  walk_in: <Badge variant="outline" className="border-green-300 text-green-600">Walk-in</Badge>,
  phone: <Badge variant="outline" className="border-amber-300 text-amber-600">Phone</Badge>,
  social_media: <Badge variant="outline" className="border-purple-300 text-purple-600">Social Media</Badge>,
  email_campaign: <Badge variant="outline" className="border-indigo-300 text-indigo-600">Email Campaign</Badge>,
  referral: <Badge variant="outline" className="border-cyan-300 text-cyan-600">Referral</Badge>
};

// Interface for Inquiry
interface Inquiry {
  id: string;
  school_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'in_progress' | 'closed' | 'follow_up';
  source: 'website' | 'walk_in' | 'phone' | 'social_media' | 'email_campaign' | 'referral';
  preferred_contact: 'email' | 'phone' | 'whatsapp' | 'none';
  student_age?: number;
  student_grade?: string;
  inquiry_type: 'admission' | 'general' | 'tour_request' | 'fee_structure' | 'complaint';
  follow_up_date?: string;
  assigned_to?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  internal_notes?: string;
  attachments?: string[];
  created_at: string;
  updated_at?: string;
}

// Priority options with corresponding badges
const priorityOptions = [
  { value: 'low', label: 'Low', badge: <Badge variant="outline" className="text-gray-600">Low</Badge> },
  { value: 'medium', label: 'Medium', badge: <Badge variant="outline" className="text-blue-600">Medium</Badge> },
  { value: 'high', label: 'High', badge: <Badge variant="outline" className="text-amber-600">High</Badge> },
  { value: 'urgent', label: 'Urgent', badge: <Badge variant="outline" className="text-red-600">Urgent</Badge> }
];

const Inquiries = () => {
  // State variables
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [viewMode, setViewMode] = useState('all');
  const { toast } = useToast();
  
  // Form state for new inquiry
  const [formData, setFormData] = useState<Partial<Inquiry>>({
    name: '',
    email: '',
    phone: '',
    message: '',
    status: 'new',
    source: 'website',
    preferred_contact: 'email',
    inquiry_type: 'general',
    priority: 'medium'
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    priority: '',
    dateRange: { from: '', to: '' }
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (filters.status) count++;
    if (filters.source) count++;
    if (filters.priority) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  // Get all inquiries
  const fetchInquiries = async () => {
    setLoading(true);
    try {
      let query = supabase.from('inquiries').select('*');
      
      // Apply filters if any
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.source) {
        query = query.eq('source', filters.source);
      }
      
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      
      if (filters.dateRange.from) {
        query = query.gte('created_at', filters.dateRange.from);
      }
      
      if (filters.dateRange.to) {
        query = query.lte('created_at', filters.dateRange.to);
      }
      
      // Apply view mode filters
      if (viewMode === 'today') {
        const today = new Date().toISOString().split('T')[0];
        query = query.gte('created_at', today);
      } else if (viewMode === 'follow_up') {
        const today = new Date().toISOString().split('T')[0];
        query = query.eq('status', 'follow_up').lte('follow_up_date', today);
      }

      // Order by latest first
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setInquiries(data as Inquiry[]);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast({
        title: "Error",
        description: "Failed to load inquiries. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchInquiries();
  }, [viewMode, filters]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      status: 'new',
      source: 'website',
      preferred_contact: 'email',
      inquiry_type: 'general',
      priority: 'medium'
    });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get current school_id - For now using a placeholder, this should be dynamically set
      const school_id = "your-school-id"; // This would typically come from context or state
      
      const { data, error } = await supabase
        .from('inquiries')
        .insert([{ ...formData, school_id }])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "New inquiry has been created successfully.",
      });
      
      setOpenForm(false);
      resetForm();
      fetchInquiries();
    } catch (error) {
      console.error('Error creating inquiry:', error);
      toast({
        title: "Error",
        description: "Failed to create inquiry. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Reset filters
  const handleClearFilters = () => {
    setFilters({
      status: '',
      source: '',
      priority: '',
      dateRange: { from: '', to: '' }
    });
  };

  // Apply filters
  const handleApplyFilters = () => {
    fetchInquiries();
  };

  // Update inquiry status
  const updateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      fetchInquiries();
      toast({
        title: "Status Updated",
        description: `Inquiry status changed to ${status}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Define table columns
  const columns: ColumnDef<Inquiry>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{row.original.name}</span>
        </div>
      )
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{row.original.email}</span>
        </div>
      )
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{row.original.phone}</span>
        </div>
      )
    },
    {
      accessorKey: 'inquiry_type',
      header: 'Type',
      cell: ({ row }) => (
        <div>
          {row.original.inquiry_type === 'admission' && <span>Admission</span>}
          {row.original.inquiry_type === 'general' && <span>General</span>}
          {row.original.inquiry_type === 'tour_request' && <span>Tour Request</span>}
          {row.original.inquiry_type === 'fee_structure' && <span>Fee Structure</span>}
          {row.original.inquiry_type === 'complaint' && <span>Complaint</span>}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div>
          {statusBadges[row.original.status]}
        </div>
      )
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => (
        <div>
          {sourceBadges[row.original.source]}
        </div>
      )
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const priority = priorityOptions.find(p => p.value === row.original.priority);
        return priority ? priority.badge : null;
      }
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => (
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
          {format(new Date(row.original.created_at), 'dd MMM yyyy')}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {row.original.status !== 'in_progress' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => updateInquiryStatus(row.original.id, 'in_progress')}
            >
              Mark In Progress
            </Button>
          )}
          {row.original.status !== 'closed' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => updateInquiryStatus(row.original.id, 'closed')}
            >
              Close
            </Button>
          )}
          {row.original.status !== 'follow_up' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => updateInquiryStatus(row.original.id, 'follow_up')}
            >
              Mark For Follow-up
            </Button>
          )}
        </div>
      )
    }
  ];

  // Build filters UI
  const filtersUI = (
    <div className="space-y-4">
      <div>
        <Label>Status</Label>
        <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="follow_up">Follow Up</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Source</Label>
        <Select value={filters.source} onValueChange={(value) => setFilters({...filters, source: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="website">Website</SelectItem>
            <SelectItem value="walk_in">Walk-in</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="social_media">Social Media</SelectItem>
            <SelectItem value="email_campaign">Email Campaign</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Priority</Label>
        <Select value={filters.priority} onValueChange={(value) => setFilters({...filters, priority: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
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
    <PageTemplate title="Inquiries" subtitle="Manage school inquiries from prospective parents and students">
      <div className="mb-6">
        <PageHeader
          title="School Inquiries"
          description="Manage and respond to inquiries from parents and students"
          primaryAction={{
            label: "New Inquiry",
            onClick: () => setOpenForm(true),
            icon: <Plus className="h-4 w-4 mr-2" />
          }}
        />
      </div>
      
      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
          <div>
            <CardTitle>Inquiries</CardTitle>
            <CardDescription>
              View and manage all school inquiries
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Tabs 
              defaultValue="all" 
              value={viewMode} 
              onValueChange={setViewMode}
              className="mr-2"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="follow_up">Pending Follow-up</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <FilterDropdown
              filters={filtersUI}
              onClear={handleClearFilters}
              onApply={handleApplyFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </div>
        </CardHeader>

        <CardContent>
          {!loading && inquiries.length === 0 ? (
            <div className="text-center py-8">
              <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium">No inquiries found</h3>
              <p className="text-muted-foreground mt-1">
                {viewMode !== 'all' 
                  ? 'Try changing your view filters or adding a new inquiry.' 
                  : activeFiltersCount > 0 
                    ? 'Try clearing your search filters.' 
                    : 'Create your first inquiry by clicking the "New Inquiry" button.'}
              </p>
              <Button 
                variant="outline" 
                onClick={() => setOpenForm(true)} 
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Inquiry
              </Button>
            </div>
          ) : (
            <DataTable columns={columns} data={inquiries} loading={loading} />
          )}
        </CardContent>
      </Card>

      {/* New Inquiry Dialog */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Inquiry</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source">Source *</Label>
                <Select 
                  value={formData.source} 
                  onValueChange={(value) => handleSelectChange('source', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="walk_in">Walk-in</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="email_campaign">Email Campaign</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferred_contact">Preferred Contact Method *</Label>
                <Select 
                  value={formData.preferred_contact} 
                  onValueChange={(value) => handleSelectChange('preferred_contact', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preferred contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="none">No Preference</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inquiry_type">Inquiry Type *</Label>
                <Select 
                  value={formData.inquiry_type} 
                  onValueChange={(value) => handleSelectChange('inquiry_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select inquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admission">Admission</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="tour_request">Tour Request</SelectItem>
                    <SelectItem value="fee_structure">Fee Structure</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.inquiry_type === 'admission' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="student_age">Student Age</Label>
                    <Input
                      id="student_age"
                      name="student_age"
                      type="number"
                      min="1"
                      max="30"
                      value={formData.student_age || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="student_grade">Student Grade/Class</Label>
                    <Input
                      id="student_grade"
                      name="student_grade"
                      value={formData.student_grade || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="message">Message/Query *</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setOpenForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Inquiry</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default Inquiries;
