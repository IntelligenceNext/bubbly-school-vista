
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, BookOpen, Edit, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Subjects = () => {
  const subjects = [
    { 
      id: 1, 
      name: "Mathematics", 
      code: "MATH101",
      class: "Class 8", 
      medium: "English",
      teacher: "Mr. Robert Smith",
      description: "Includes algebra, geometry and statistics"
    },
    { 
      id: 2, 
      name: "Science", 
      code: "SCI102",
      class: "Class 8", 
      medium: "English",
      teacher: "Ms. Jessica Brown",
      description: "Physics, chemistry and biology concepts"
    },
    { 
      id: 3, 
      name: "English", 
      code: "ENG103",
      class: "Class 8", 
      medium: "English",
      teacher: "Mrs. Patricia Miller",
      description: "Grammar, literature, and composition"
    },
    { 
      id: 4, 
      name: "History", 
      code: "HIS104",
      class: "Class 8", 
      medium: "English",
      teacher: "Mr. David Wilson",
      description: "World history focusing on modern era"
    },
  ];

  return (
    <PageTemplate title="Subjects" subtitle="Manage subjects and course materials">
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Subject Management</CardTitle>
              <CardDescription>Configure subjects for different classes</CardDescription>
            </div>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Subject
            </Button>
          </CardHeader>
          
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Medium</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} className="text-primary" />
                          <span>{subject.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{subject.code}</Badge>
                      </TableCell>
                      <TableCell>{subject.class}</TableCell>
                      <TableCell>{subject.medium}</TableCell>
                      <TableCell>{subject.teacher}</TableCell>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default Subjects;
