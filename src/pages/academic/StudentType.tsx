
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash, Users } from 'lucide-react';

const StudentType = () => {
  const [studentTypes] = useState([
    { 
      id: 1, 
      name: "Day Scholar", 
      description: "Students who attend school during the day only",
      count: 458
    },
    { 
      id: 2, 
      name: "Hostel Resident", 
      description: "Students who stay in the school hostel",
      count: 126
    },
    { 
      id: 3, 
      name: "Transport Availing", 
      description: "Students who use school transportation",
      count: 235
    },
    { 
      id: 4, 
      name: "Scholarship", 
      description: "Students on different scholarship programs",
      count: 42
    },
    { 
      id: 5, 
      name: "Special Needs", 
      description: "Students requiring special education attention",
      count: 18
    },
  ]);

  return (
    <PageTemplate title="Manage Student Type" subtitle="Manage various student types and categories">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Student Categories</CardTitle>
            <CardDescription>Classify students for administrative and fee purposes</CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Add Type
          </Button>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Student Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>{type.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-muted-foreground" />
                      <span>{type.count} students</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash size={16} />
                      </Button>
                    </div>
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

export default StudentType;
