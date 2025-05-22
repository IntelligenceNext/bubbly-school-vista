
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, Filter, MapPin, Plus, Search, Users } from 'lucide-react';

const Activities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);

  // Mock data for activities
  const activities = [
    { 
      id: 1, 
      title: 'Annual Sports Day', 
      category: 'Sports', 
      startDate: '2025-05-25', 
      endDate: '2025-05-25',
      status: 'upcoming',
      participants: 120,
      location: 'Main Ground',
      type: 'Team',
      audience: 'All',
      isCompetitive: true,
      description: 'Annual inter-house sports competition featuring track and field events.'
    },
    { 
      id: 2, 
      title: 'Chess Tournament', 
      category: 'Clubs', 
      startDate: '2025-05-20', 
      endDate: '2025-05-21',
      status: 'ongoing',
      participants: 32,
      location: 'Indoor Games Room',
      type: 'Individual',
      audience: 'Class-wise',
      isCompetitive: true,
      description: 'Inter-class chess tournament for students of all age groups.'
    },
    { 
      id: 3, 
      title: 'Science Exhibition', 
      category: 'Academic', 
      startDate: '2025-05-18', 
      endDate: '2025-05-19',
      status: 'ongoing',
      participants: 65,
      location: 'Science Lab',
      type: 'Team',
      audience: 'Section-wise',
      isCompetitive: true,
      description: 'Students demonstrate scientific projects and innovations in this annual exhibition.'
    },
    { 
      id: 4, 
      title: 'Dance Competition', 
      category: 'Cultural', 
      startDate: '2025-05-15', 
      endDate: '2025-05-15',
      status: 'completed',
      participants: 48,
      location: 'Auditorium',
      type: 'Individual',
      audience: 'All',
      isCompetitive: true,
      description: 'Solo and group dance performances competing for the annual cultural trophy.'
    },
    { 
      id: 5, 
      title: 'Art Workshop', 
      category: 'Arts', 
      startDate: '2025-05-10', 
      endDate: '2025-05-12',
      status: 'completed',
      participants: 40,
      location: 'Art Studio',
      type: 'Individual',
      audience: 'Class-wise',
      isCompetitive: false,
      description: 'Three-day workshop on various painting techniques led by professional artists.'
    },
    { 
      id: 6, 
      title: 'Debate Club', 
      category: 'Academic', 
      startDate: '2025-05-05', 
      endDate: '2025-06-30',
      status: 'ongoing',
      participants: 24,
      location: 'Seminar Hall',
      type: 'Team',
      audience: 'Section-wise',
      isCompetitive: false,
      description: 'Weekly debate sessions to improve public speaking and critical thinking skills.'
    },
  ];

  React.useEffect(() => {
    // Apply filters to activities
    let results = [...activities];
    
    if (searchTerm) {
      results = results.filter(activity => 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      results = results.filter(activity => activity.category === selectedCategory);
    }
    
    if (selectedStatus !== 'all') {
      results = results.filter(activity => activity.status === selectedStatus);
    }
    
    setFilteredActivities(results);
  }, [searchTerm, selectedCategory, selectedStatus]);

  // Get a list of unique categories
  const categories = [...new Set(activities.map(activity => activity.category))];

  // Badge color based on status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'upcoming':
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-500">Ongoing</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleAddActivity = () => {
    // This would be implemented to handle adding a new activity
    console.log('Add activity');
  };

  return (
    <PageTemplate title="Activities Management" subtitle="Manage all extracurricular activities">
      <PageHeader 
        title="Activities" 
        description="Create and manage school activities and events"
        primaryAction={{
          label: "Add Activity",
          onClick: handleAddActivity,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <div className="mt-6 space-y-6">
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search activities..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Participants</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground hidden md:block">{activity.location}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{activity.category}</TableCell>
                    <TableCell className="hidden lg:table-cell">{activity.type}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-col">
                        <span className="text-xs flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(activity.startDate).toLocaleDateString()}
                        </span>
                        {activity.startDate !== activity.endDate && (
                          <span className="text-xs text-muted-foreground">
                            to {new Date(activity.endDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(activity.status)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{activity.participants}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">View</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                          <DialogHeader>
                            <DialogTitle>{activity.title}</DialogTitle>
                            <DialogDescription>
                              {getStatusBadge(activity.status)} • {activity.category}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm">{activity.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium">Type</p>
                                <p className="text-sm">{activity.type}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Audience</p>
                                <p className="text-sm">{activity.audience}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Location</p>
                                <p className="text-sm flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" /> {activity.location}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Participants</p>
                                <p className="text-sm flex items-center">
                                  <Users className="h-3 w-3 mr-1" /> {activity.participants} students
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium">Date & Time</p>
                              <div className="flex items-center gap-6 text-sm">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(activity.startDate).toLocaleDateString()}
                                  {activity.startDate !== activity.endDate && (
                                    <span> to {new Date(activity.endDate).toLocaleDateString()}</span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button size="sm">Manage Participants</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredActivities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No activities found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default Activities;
