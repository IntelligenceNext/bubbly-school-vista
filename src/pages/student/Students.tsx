import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '@/components/FileUpload';
import FileGallery from '@/components/FileGallery';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// The existing Students component has a TabsContent for the student list that needs to be updated
// Let's enhance this component to better match the Student entity described in the requirements

const Students = () => {
  const [refreshGallery, setRefreshGallery] = useState(0);

  const handleUploadComplete = () => {
    // Refresh the gallery when upload completes
    setRefreshGallery(prev => prev + 1);
  };

  // Sample student data for demonstration
  const students = [
    {
      id: 1,
      admissionNumber: "ST20230001",
      firstName: "Rahul",
      lastName: "Sharma",
      gender: "Male",
      dateOfBirth: "2008-05-15",
      classSection: "Class 8A",
      medium: "English",
      studentType: "Day Scholar",
      admissionDate: "2023-04-01",
      guardianName: "Vikram Sharma",
      guardianContact: "+91 98765 43210",
      status: "Active"
    },
    {
      id: 2,
      admissionNumber: "ST20230002",
      firstName: "Priya",
      lastName: "Patel",
      gender: "Female",
      dateOfBirth: "2009-02-28",
      classSection: "Class 7B",
      medium: "English",
      studentType: "Hostel Resident",
      admissionDate: "2023-04-02",
      guardianName: "Raj Patel",
      guardianContact: "+91 87654 32109",
      status: "Active"
    },
    {
      id: 3,
      admissionNumber: "ST20230003",
      firstName: "Karan",
      lastName: "Singh",
      gender: "Male",
      dateOfBirth: "2010-11-10",
      classSection: "Class 6A",
      medium: "Hindi",
      studentType: "Transport Availing",
      admissionDate: "2023-04-03",
      guardianName: "Gurpreet Singh",
      guardianContact: "+91 76543 21098",
      status: "Transferred"
    },
    {
      id: 4,
      admissionNumber: "ST20230004",
      firstName: "Neha",
      lastName: "Gupta",
      gender: "Female",
      dateOfBirth: "2011-07-20",
      classSection: "Class 5C",
      medium: "English",
      studentType: "Day Scholar",
      admissionDate: "2023-04-05",
      guardianName: "Rahul Gupta",
      guardianContact: "+91 65432 10987",
      status: "Active"
    },
    {
      id: 5,
      admissionNumber: "ST20230005",
      firstName: "Arjun",
      lastName: "Kumar",
      gender: "Male",
      dateOfBirth: "2009-09-03",
      classSection: "Class 7A",
      medium: "English",
      studentType: "Scholarship",
      admissionDate: "2023-04-10",
      guardianName: "Mohan Kumar",
      guardianContact: "+91 54321 09876",
      status: "Active"
    }
  ];
  
  const statusColors: Record<string, string> = {
    "Active": "success",
    "Transferred": "warning",
    "Graduated": "secondary",
    "Inactive": "destructive"
  };

  return (
    <PageTemplate title="Students" subtitle="Manage student profiles and records">
      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Student List</TabsTrigger>
          <TabsTrigger value="photos">Student Photos</TabsTrigger>
          <TabsTrigger value="attachments">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Student Directory</CardTitle>
                <CardDescription>
                  View and manage all student records
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search students..."
                    className="pl-8 w-[250px]"
                  />
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Student
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admission No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class & Section</TableHead>
                    <TableHead>Medium</TableHead>
                    <TableHead>Student Type</TableHead>
                    <TableHead>Guardian</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.admissionNumber}</TableCell>
                      <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                      <TableCell>{student.classSection}</TableCell>
                      <TableCell>{student.medium}</TableCell>
                      <TableCell>{student.studentType}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{student.guardianName}</div>
                          <div className="text-muted-foreground">{student.guardianContact}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColors[student.status] as any || "default"}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle>Student Photos</CardTitle>
              <CardDescription>
                Upload and manage student photos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-md bg-muted/50">
                <h3 className="font-medium mb-2">Upload New Photo</h3>
                <FileUpload 
                  bucket="student_photos" 
                  maxSize={2}
                  acceptedFileTypes="image/*"
                  buttonText="Select Photo"
                  onUploadComplete={handleUploadComplete}
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Photo Gallery</h3>
                <FileGallery 
                  bucketName="student_photos"
                  filePath=""
                  refreshKey={refreshGallery}
                  onFileDelete={() => setRefreshGallery(prev => prev + 1)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attachments">
          <Card>
            <CardHeader>
              <CardTitle>Student Documents</CardTitle>
              <CardDescription>
                Upload and manage student documents and certificates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-md bg-muted/50">
                <h3 className="font-medium mb-2">Upload New Document</h3>
                <FileUpload 
                  bucket="attachments"
                  folder="students"
                  maxSize={10}
                  buttonText="Select Document"
                  onUploadComplete={handleUploadComplete}
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Document Library</h3>
                <FileGallery 
                  bucketName="attachments"
                  filePath="students"
                  refreshKey={refreshGallery}
                  onFileDelete={() => setRefreshGallery(prev => prev + 1)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};

export default Students;
