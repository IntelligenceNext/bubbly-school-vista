
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '@/components/FileUpload';
import FileGallery from '@/components/FileGallery';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Students = () => {
  const [refreshGallery, setRefreshGallery] = useState(0);

  const handleUploadComplete = () => {
    // Refresh the gallery when upload completes
    setRefreshGallery(prev => prev + 1);
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
            <CardHeader>
              <CardTitle>Student Directory</CardTitle>
              <CardDescription>
                View and manage all student records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Student list is under development</AlertTitle>
                <AlertDescription>
                  You can manage student photos and documents in the other tabs
                </AlertDescription>
              </Alert>
              <p className="text-muted-foreground">
                This section will display a list of all students with their information.
              </p>
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
