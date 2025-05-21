import React, { useState, useEffect } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from '@/components/FileUpload';
import FileGallery from '@/components/FileGallery';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Settings = () => {
  const [refreshGallery, setRefreshGallery] = useState(0);
  const [selectedSetting, setSelectedSetting] = useState("");
  const [value, setValue] = useState("");

  const handleUploadComplete = () => {
    // Refresh the gallery when upload completes
    setRefreshGallery(prev => prev + 1);
  };

  // Fix the type error by checking for an empty string with !selectedSetting instead of comparing to ""
  const handleTabChange = (value: string) => {
    // Instead of:
    // if (selectedSetting === "") {
    // Use:
    if (!selectedSetting) {
      setValue("key", value);
      setSelectedSetting(value);
    } else {
      // ... keep existing code
    }
  };

  return (
    <PageTemplate title="Settings" subtitle="Configure school information and appearance">
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage basic school information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Settings page is under development</AlertTitle>
                <AlertDescription>
                  You can upload and manage school logos in the Appearance tab
                </AlertDescription>
              </Alert>
              <p className="text-muted-foreground">
                This section will contain general school settings and information.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>School Logo</CardTitle>
              <CardDescription>
                Upload and manage your school's logo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-md bg-muted/50">
                <h3 className="font-medium mb-2">Upload New Logo</h3>
                <FileUpload 
                  bucket="school_logos"
                  maxSize={1}
                  acceptedFileTypes="image/*"
                  buttonText="Select Logo Image"
                  onUploadComplete={handleUploadComplete}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended size: 200x200px. Maximum file size: 1MB.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Uploaded Logos</h3>
                <FileGallery 
                  bucketName="school_logos"
                  filePath=""
                  refreshKey={refreshGallery}
                  onFileDelete={() => setRefreshGallery(prev => prev + 1)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how notifications are sent to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section will contain notification settings (coming soon).
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};

export default Settings;
