
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Book,
  BookOpen,
  Calendar,
  Clock,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const LibraryDashboard = () => {
  // Mock data for quick stats
  const summaryStats = [
    {
      title: "Total Books",
      value: "1,246",
      icon: <Book className="h-5 w-5" />,
      change: "+12 from last month"
    },
    {
      title: "Books Issued",
      value: "283",
      icon: <BookOpen className="h-5 w-5" />,
      change: "+18 from last week"
    },
    {
      title: "Active Cards",
      value: "498",
      icon: <Users className="h-5 w-5" />,
      change: "+5 from last week"
    },
    {
      title: "Overdue Returns",
      value: "24",
      icon: <Clock className="h-5 w-5" />,
      change: "-7 from last week"
    }
  ];
  
  // Mock data for top books
  const popularBooks = [
    {
      title: "The Science of Physics",
      author: "David Miller",
      category: "Science",
      borrowed: 18
    },
    {
      title: "Advanced Mathematics Vol. 2",
      author: "Sarah Thompson",
      category: "Mathematics",
      borrowed: 15
    },
    {
      title: "World History: Modern Era",
      author: "Robert Johnson",
      category: "History",
      borrowed: 12
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      category: "Literature",
      borrowed: 10
    }
  ];
  
  // Mock data for recent activities
  const recentActivities = [
    {
      type: "issue",
      book_title: "Introduction to Biology",
      user_name: "John Smith",
      timestamp: "2023-05-20T09:30:00Z",
      due_date: "2023-06-03T09:30:00Z"
    },
    {
      type: "return",
      book_title: "The Great Gatsby",
      user_name: "Emily Parker",
      timestamp: "2023-05-20T10:15:00Z",
      due_date: null
    },
    {
      type: "issue",
      book_title: "Computer Science Fundamentals",
      user_name: "Michael Wong",
      timestamp: "2023-05-19T14:45:00Z",
      due_date: "2023-06-02T14:45:00Z"
    },
    {
      type: "overdue",
      book_title: "Economics 101",
      user_name: "Jessica Brown",
      timestamp: "2023-05-05T11:20:00Z",
      due_date: "2023-05-19T11:20:00Z"
    },
    {
      type: "return",
      book_title: "Poetry Collection: Volume 3",
      user_name: "Robert Wilson",
      timestamp: "2023-05-18T16:30:00Z",
      due_date: null
    }
  ];
  
  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Activity badge colors
  const activityColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "bubble" | "warning"> = {
    "issue": "success",
    "return": "secondary",
    "overdue": "destructive",
    "renew": "warning"
  };

  // Activity type labels
  const activityLabels: Record<string, string> = {
    "issue": "Issued",
    "return": "Returned",
    "overdue": "Overdue",
    "renew": "Renewed"
  };

  return (
    <PageTemplate title="Library Dashboard" subtitle="Overview of library management">
      <div className="space-y-6">
        <PageHeader
          title="Library Management"
          description="Monitor and manage library activities"
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Activities</span>
                <Button variant="outline" size="sm">View All</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivities.map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant={activityColors[activity.type]}>
                            {activityLabels[activity.type]}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium max-w-[150px] truncate">
                          {activity.book_title}
                        </TableCell>
                        <TableCell>{activity.user_name}</TableCell>
                        <TableCell>
                          {formatDate(activity.timestamp)}
                          {activity.due_date && activity.type === "issue" && (
                            <div className="text-xs text-muted-foreground">
                              Due: {formatDate(activity.due_date)}
                            </div>
                          )}
                          {activity.due_date && activity.type === "overdue" && (
                            <div className="text-xs text-red-500 font-medium">
                              Due: {formatDate(activity.due_date)}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Popular Books */}
          <Card>
            <CardHeader>
              <CardTitle>Most Borrowed Books</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularBooks.map((book, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Book className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{book.title}</p>
                        <p className="text-sm text-muted-foreground">{book.author} • {book.category}</p>
                      </div>
                    </div>
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                      {book.borrowed} borrows
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Calendar and upcoming returns */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-4">
                <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <Calendar className="h-5 w-5 text-yellow-500 mr-3" />
                  <div>
                    <p className="font-medium">Today</p>
                    <p className="text-sm text-muted-foreground">8 books due</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">Tomorrow</p>
                    <p className="text-sm text-muted-foreground">5 books due</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">This Week</p>
                    <p className="text-sm text-muted-foreground">14 books due</p>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">May 22, 2023</TableCell>
                      <TableCell>The Art of Computer Programming</TableCell>
                      <TableCell>Alice Johnson</TableCell>
                      <TableCell><Badge variant="warning">Due Today</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">May 22, 2023</TableCell>
                      <TableCell>Introduction to Algorithms</TableCell>
                      <TableCell>James Wilson</TableCell>
                      <TableCell><Badge variant="warning">Due Today</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">May 23, 2023</TableCell>
                      <TableCell>Database Systems</TableCell>
                      <TableCell>Michael Brown</TableCell>
                      <TableCell><Badge>Due Tomorrow</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">May 25, 2023</TableCell>
                      <TableCell>Physics for Scientists and Engineers</TableCell>
                      <TableCell>Sarah Lee</TableCell>
                      <TableCell><Badge variant="outline">Coming Up</Badge></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default LibraryDashboard;
