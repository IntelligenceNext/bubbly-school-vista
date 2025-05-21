
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StaffRating = () => {
  const ratings = [
    {
      id: 1,
      staff: "Mr. Robert Smith",
      role: "Mathematics Teacher",
      subject: "Mathematics",
      averageRating: 4.7,
      totalRatings: 145,
      lastMonth: 4.8
    },
    {
      id: 2,
      staff: "Ms. Jessica Brown",
      role: "Science Teacher",
      subject: "Physics",
      averageRating: 4.5,
      totalRatings: 120,
      lastMonth: 4.6
    },
    {
      id: 3,
      staff: "Mrs. Patricia Miller",
      role: "English Teacher",
      subject: "English Literature",
      averageRating: 4.9,
      totalRatings: 132,
      lastMonth: 4.9
    },
    {
      id: 4,
      staff: "Mr. David Wilson",
      role: "Science Teacher",
      subject: "Biology",
      averageRating: 4.3,
      totalRatings: 98,
      lastMonth: 4.5
    },
    {
      id: 5,
      staff: "Mrs. Susan Davis",
      role: "History Teacher",
      subject: "World History",
      averageRating: 4.6,
      totalRatings: 105,
      lastMonth: 4.4
    },
  ];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
          } else if (i === fullStars && hasHalfStar) {
            return (
              <div key={i} className="relative">
                <Star className="h-4 w-4 text-gray-300" />
                <div className="absolute top-0 left-0 overflow-hidden w-[50%]">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            );
          } else {
            return <Star key={i} className="h-4 w-4 text-gray-300" />;
          }
        })}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <PageTemplate title="Staff Rating" subtitle="Review and rate staff performance">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Staff Performance Ratings</CardTitle>
            <CardDescription>View ratings and feedback for teaching staff</CardDescription>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            Filter
          </Button>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Average Rating</TableHead>
                <TableHead>Last Month</TableHead>
                <TableHead>Total Ratings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ratings.map((rating) => (
                <TableRow key={rating.id}>
                  <TableCell className="font-medium">{rating.staff}</TableCell>
                  <TableCell>{rating.role}</TableCell>
                  <TableCell>{rating.subject}</TableCell>
                  <TableCell>{renderStars(rating.averageRating)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {renderStars(rating.lastMonth)}
                      {rating.lastMonth > rating.averageRating ? (
                        <span className="text-xs text-green-600">▲</span>
                      ) : rating.lastMonth < rating.averageRating ? (
                        <span className="text-xs text-red-600">▼</span>
                      ) : (
                        <span className="text-xs text-gray-400">■</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{rating.totalRatings}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageTemplate>
  );
};

export default StaffRating;
