
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, FileText, Download, BookOpen, Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const StudyMaterials = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const materials = [
    {
      id: 1,
      title: "Mathematics - Algebra Fundamentals",
      subject: "Mathematics",
      class: "Class 8-A",
      uploadedBy: "Mr. Robert Smith",
      uploadDate: "2025-05-15",
      fileSize: "2.4 MB",
      fileType: "pdf",
      downloads: 45
    },
    {
      id: 2,
      title: "Science - Periodic Table Elements",
      subject: "Science",
      class: "Class 9-B",
      uploadedBy: "Ms. Jessica Brown",
      uploadDate: "2025-05-14",
      fileSize: "1.8 MB",
      fileType: "pdf",
      downloads: 38
    },
    {
      id: 3,
      title: "English Literature - Shakespeare Plays",
      subject: "English",
      class: "Class 10-A",
      uploadedBy: "Mrs. Patricia Miller",
      uploadDate: "2025-05-12",
      fileSize: "3.2 MB",
      fileType: "doc",
      downloads: 52
    },
    {
      id: 4,
      title: "History - World War II Timeline",
      subject: "History",
      class: "Class 9-A",
      uploadedBy: "Mr. David Wilson",
      uploadDate: "2025-05-10",
      fileSize: "5.7 MB",
      fileType: "ppt",
      downloads: 29
    },
    {
      id: 5,
      title: "Biology - Cellular Structure",
      subject: "Science",
      class: "Class 8-B",
      uploadedBy: "Mrs. Susan Davis",
      uploadDate: "2025-05-08",
      fileSize: "4.1 MB",
      fileType: "pdf",
      downloads: 41
    }
  ];

  const getFileTypeIcon = (fileType) => {
    const colorMap = {
      'pdf': 'text-red-500',
      'doc': 'text-blue-500',
      'ppt': 'text-orange-500'
    };
    
    return (
      <div className={`p-2 bg-white rounded-md border shadow-sm`}>
        <FileText className={`h-6 w-6 ${colorMap[fileType] || 'text-gray-500'}`} />
      </div>
    );
  };

  return (
    <PageTemplate title="Study Materials" subtitle="Manage educational resources and materials">
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Learning Resources</CardTitle>
              <CardDescription>Upload and share study materials</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search materials..." 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Upload Material
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              <TabsList>
                <TabsTrigger value="all">All Materials</TabsTrigger>
                <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
                <TabsTrigger value="science">Science</TabsTrigger>
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="space-y-4">
              {materials.map((material) => (
                <div key={material.id} className="flex rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                  <div className="p-4 flex items-center justify-center">
                    {getFileTypeIcon(material.fileType)}
                  </div>
                  <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-l">
                    <div>
                      <h3 className="font-medium flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                        {material.title}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Subject:</span> {material.subject}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Class:</span> {material.class}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Uploaded By:</span> {material.uploadedBy} on {new Date(material.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between md:items-end">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="uppercase">
                          {material.fileType}
                        </Badge>
                        <Badge variant="secondary">
                          {material.fileSize}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-4 md:mt-0">
                        <span className="text-xs text-muted-foreground mr-4">{material.downloads} downloads</span>
                        <Button className="flex items-center gap-2">
                          <Download size={16} />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default StudyMaterials;
