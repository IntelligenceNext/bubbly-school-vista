
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Plus, Calendar, FileText } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Homework = () => {
  const [activeTab, setActiveTab] = useState("pending");
  
  const homeworkList = [
    { 
      id: 1, 
      title: "Mathematics Assignment", 
      subject: "Mathematics",
      class: "Class 8-A", 
      dueDate: "2025-05-25",
      submissions: 18,
      totalStudents: 25,
      status: "pending"
    },
    { 
      id: 2, 
      title: "Science Lab Report", 
      subject: "Science",
      class: "Class 8-A", 
      dueDate: "2025-05-23",
      submissions: 22,
      totalStudents: 25,
      status: "pending"
    },
    { 
      id: 3, 
      title: "History Essay", 
      subject: "History",
      class: "Class 8-B", 
      dueDate: "2025-05-20",
      submissions: 25,
      totalStudents: 25,
      status: "completed"
    },
    { 
      id: 4, 
      title: "English Literature Analysis", 
      subject: "English",
      class: "Class 8-A", 
      dueDate: "2025-05-18",
      submissions: 20,
      totalStudents: 25,
      status: "completed"
    },
  ];

  const filteredHomework = activeTab === "all" 
    ? homeworkList 
    : homeworkList.filter(hw => hw.status === activeTab);

  return (
    <PageTemplate title="Homework" subtitle="Assign and track student homework">
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Homework Management</CardTitle>
              <CardDescription>Assign and track homework assignments</CardDescription>
            </div>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Assign Homework
            </Button>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              <TabsList>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="all">All Homework</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHomework.map((hw) => (
                    <TableRow key={hw.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} className="text-primary" />
                          <span>{hw.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{hw.subject}</TableCell>
                      <TableCell>{hw.class}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>{new Date(hw.dueDate).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`${hw.submissions === hw.totalStudents ? "text-green-500" : "text-amber-500"}`}>
                          {hw.submissions}/{hw.totalStudents}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <FileText size={14} className="mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">Edit</Button>
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

export default Homework;
