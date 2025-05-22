
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Eye, 
  FileArchive, 
  FilePlus, 
  FileCheck,
  FileX 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'verified' | 'pending' | 'rejected';
  uploadDate: string;
  expiryDate?: string;
}

const DocumentsPage = () => {
  const [personalDocs, setPersonalDocs] = useState<Document[]>([
    {
      id: 'doc1',
      name: 'ID Card.pdf',
      type: 'PDF',
      size: '2.4 MB',
      status: 'verified',
      uploadDate: '2023-02-15',
      expiryDate: '2025-02-15'
    },
    {
      id: 'doc2',
      name: 'Address Proof.jpg',
      type: 'Image',
      size: '1.2 MB',
      status: 'verified',
      uploadDate: '2023-03-10'
    },
    {
      id: 'doc3',
      name: 'Academic Certificates.pdf',
      type: 'PDF',
      size: '5.7 MB',
      status: 'pending',
      uploadDate: '2023-04-22'
    }
  ]);

  const [employmentDocs, setEmploymentDocs] = useState<Document[]>([
    {
      id: 'emp1',
      name: 'Employment Contract.pdf',
      type: 'PDF',
      size: '3.1 MB',
      status: 'verified',
      uploadDate: '2022-08-15',
      expiryDate: '2024-08-15'
    },
    {
      id: 'emp2',
      name: 'Background Verification.pdf',
      type: 'PDF',
      size: '1.8 MB',
      status: 'verified',
      uploadDate: '2022-08-20'
    },
    {
      id: 'emp3',
      name: 'Non-Disclosure Agreement.pdf',
      type: 'PDF',
      size: '0.9 MB',
      status: 'verified',
      uploadDate: '2022-08-15'
    }
  ]);

  const [trainDocs, setTrainDocs] = useState<Document[]>([
    {
      id: 'train1',
      name: 'Teaching Certification.pdf',
      type: 'PDF',
      size: '2.3 MB',
      status: 'verified',
      uploadDate: '2022-09-05',
      expiryDate: '2025-09-05'
    },
    {
      id: 'train2',
      name: 'First Aid Training.pdf',
      type: 'PDF',
      size: '1.5 MB',
      status: 'verified',
      uploadDate: '2023-01-12',
      expiryDate: '2024-01-12'
    }
  ]);

  const handleUpload = (category: string) => {
    // Mock upload functionality
    toast({
      title: "Upload started",
      description: "Your document is being uploaded...",
    });
    
    setTimeout(() => {
      toast({
        title: "Upload complete",
        description: "Your document has been uploaded and is pending verification.",
      });
    }, 2000);
  };

  const handleDelete = (id: string, category: string) => {
    if (category === 'personal') {
      setPersonalDocs(personalDocs.filter(doc => doc.id !== id));
    } else if (category === 'employment') {
      setEmploymentDocs(employmentDocs.filter(doc => doc.id !== id));
    } else {
      setTrainDocs(trainDocs.filter(doc => doc.id !== id));
    }
    
    toast({
      title: "Document deleted",
      description: "The document has been deleted successfully.",
    });
  };

  const renderDocumentTable = (documents: Document[], category: string) => {
    return (
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Size</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Upload Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Expiry</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <tr key={doc.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        {doc.name}
                      </div>
                    </td>
                    <td className="p-4 align-middle">{doc.type}</td>
                    <td className="p-4 align-middle">{doc.size}</td>
                    <td className="p-4 align-middle">
                      {doc.status === 'verified' && (
                        <Badge variant="success">Verified</Badge>
                      )}
                      {doc.status === 'pending' && (
                        <Badge variant="warning">Pending</Badge>
                      )}
                      {doc.status === 'rejected' && (
                        <Badge variant="destructive">Rejected</Badge>
                      )}
                    </td>
                    <td className="p-4 align-middle">{doc.uploadDate}</td>
                    <td className="p-4 align-middle">{doc.expiryDate || '-'}</td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" title="View Document">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Download Document">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Delete Document" onClick={() => handleDelete(doc.id, category)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="h-24 text-center">
                    No documents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <PageTemplate title="Documents" subtitle="Upload and manage your personal and professional documents">
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="personal">Personal Documents</TabsTrigger>
          <TabsTrigger value="employment">Employment Documents</TabsTrigger>
          <TabsTrigger value="training">Certifications & Training</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Personal Identification Documents</span>
                <Button onClick={() => handleUpload('personal')}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </CardTitle>
              <CardDescription>
                Add your personal identification documents like ID proof, address proof, and educational certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderDocumentTable(personalDocs, 'personal')}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <FileCheck className="mr-2 h-5 w-5 text-green-600" />
                  Verified Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {personalDocs.filter(doc => doc.status === 'verified').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <FilePlus className="mr-2 h-5 w-5 text-amber-600" />
                  Pending Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {personalDocs.filter(doc => doc.status === 'pending').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <FileX className="mr-2 h-5 w-5 text-red-600" />
                  Rejected Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {personalDocs.filter(doc => doc.status === 'rejected').length}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="employment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Employment Documents</span>
                <Button onClick={() => handleUpload('employment')}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </CardTitle>
              <CardDescription>
                Manage your employment-related documents like contracts, agreements, and background checks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderDocumentTable(employmentDocs, 'employment')}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Certifications & Training Documents</span>
                <Button onClick={() => handleUpload('training')}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </CardTitle>
              <CardDescription>
                Upload your professional certifications, training completion certificates, and other qualifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderDocumentTable(trainDocs, 'training')}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileArchive className="mr-2 h-5 w-5" />
                Certification Requirements
              </CardTitle>
              <CardDescription>
                Required certifications based on your role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Teaching Certification</p>
                    <p className="text-sm text-muted-foreground">Required for all teaching staff</p>
                  </div>
                  <Badge variant="success">Submitted</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">First Aid Training</p>
                    <p className="text-sm text-muted-foreground">Required for all staff</p>
                  </div>
                  <Badge variant="success">Submitted</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Child Protection Training</p>
                    <p className="text-sm text-muted-foreground">Required for all staff</p>
                  </div>
                  <Badge variant="destructive">Missing</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};

export default DocumentsPage;
