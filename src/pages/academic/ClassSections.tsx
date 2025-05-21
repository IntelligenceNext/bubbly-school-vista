
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash, Users, BookOpen, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ClassSections = () => {
  const [sections] = useState([
    { 
      id: 1, 
      className: "Class 1", 
      sectionName: "A", 
      classTeacher: "Mrs. Patricia Miller",
      medium: "English", 
      studentType: "Day Scholar", 
      capacity: 30,
      enrolled: 28
    },
    { 
      id: 2, 
      className: "Class 1", 
      sectionName: "B", 
      classTeacher: "Mr. David Wilson",
      medium: "English", 
      studentType: "Day Scholar", 
      capacity: 30,
      enrolled: 26
    },
    { 
      id: 3, 
      className: "Class 2", 
      sectionName: "A", 
      classTeacher: "Ms. Jessica Brown",
      medium: "English", 
      studentType: "Day Scholar", 
      capacity: 30,
      enrolled: 30
    },
    { 
      id: 4, 
      className: "Class 2", 
      sectionName: "B", 
      classTeacher: "Mr. Robert Smith",
      medium: "Hindi", 
      studentType: "Day Scholar", 
      capacity: 30,
      enrolled: 24
    },
    { 
      id: 5, 
      className: "Class 3", 
      sectionName: "A", 
      classTeacher: "Mrs. Susan Davis",
      medium: "English", 
      studentType: "Hostel", 
      capacity: 25,
      enrolled: 22
    },
  ]);

  const calculateCapacityPercentage = (enrolled, capacity) => {
    return (enrolled / capacity) * 100;
  };

  const getCapacityColor = (percentage) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <PageTemplate title="Manage Class Sections" subtitle="Create and manage class sections">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Class Sections</CardTitle>
            <CardDescription>Organize classes into sections</CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Add Section
          </Button>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Class Teacher</TableHead>
                <TableHead>Medium</TableHead>
                <TableHead>Student Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section) => {
                const capacityPercentage = calculateCapacityPercentage(section.enrolled, section.capacity);
                
                return (
                  <TableRow key={section.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-primary" />
                        <span>{section.className}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge>{section.sectionName}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserCheck size={16} className="text-muted-foreground" />
                        <span>{section.classTeacher}</span>
                      </div>
                    </TableCell>
                    <TableCell>{section.medium}</TableCell>
                    <TableCell>{section.studentType}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-muted-foreground" />
                          <span>{section.enrolled}/{section.capacity}</span>
                        </div>
                        <div className="w-32 h-2 bg-gray-200 rounded-full mt-1.5">
                          <div 
                            className={`h-2 rounded-full ${getCapacityColor(capacityPercentage)}`} 
                            style={{ width: `${capacityPercentage}%` }}
                          ></div>
                        </div>
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
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageTemplate>
  );
};

export default ClassSections;
