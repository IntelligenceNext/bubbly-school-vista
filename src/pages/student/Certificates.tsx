
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileOutput, FileText, Plus, Printer, Search, Settings } from 'lucide-react';

const Certificates = () => {
  const [activeTab, setActiveTab] = useState("issued");
  
  // Sample certificates data
  const certificates = [
    {
      id: "CERT001",
      studentName: "Rahul Sharma",
      admissionNumber: "ST20230001",
      certificateType: "Bonafide",
      issueDate: "2023-03-15",
      issuedBy: "Principal",
      purpose: "Scholarship Application"
    },
    {
      id: "CERT002",
      studentName: "Priya Patel",
      admissionNumber: "ST20230002",
      certificateType: "Character",
      issueDate: "2023-04-10",
      issuedBy: "Vice Principal",
      purpose: "College Application"
    },
    {
      id: "CERT003",
      studentName: "Karan Singh",
      admissionNumber: "ST20230003",
      certificateType: "Transfer",
      issueDate: "2023-02-28",
      issuedBy: "Admin Officer",
      purpose: "School Transfer"
    },
    {
      id: "CERT004",
      studentName: "Neha Gupta",
      admissionNumber: "ST20230004",
      certificateType: "Bonafide",
      issueDate: "2023-05-05",
      issuedBy: "Principal",
      purpose: "Passport Application"
    },
    {
      id: "CERT005",
      studentName: "Arjun Kumar",
      admissionNumber: "ST20230005",
      certificateType: "Conduct",
      issueDate: "2023-04-22",
      issuedBy: "Class Teacher",
      purpose: "Sports Competition"
    }
  ];

  // Certificate type colors
  const certificateTypeColors = {
    "Bonafide": "primary",
    "Character": "secondary",
    "Transfer": "warning",
    "Conduct": "default"
  };

  // Certificate templates
  const templates = [
    { id: 1, name: "Bonafide Certificate", description: "Standard student bonafide certificate" },
    { id: 2, name: "Character Certificate", description: "Student character and conduct certificate" },
    { id: 3, name: "Transfer Certificate", description: "School leaving/transfer certificate" },
    { id: 4, name: "Conduct Certificate", description: "Student behavior and conduct certificate" }
  ];

  return (
    <PageTemplate title="Certificates" subtitle="Generate and manage student certificates">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="issued">Issued Certificates</TabsTrigger>
            <TabsTrigger value="generate">Generate Certificate</TabsTrigger>
            <TabsTrigger value="templates">Certificate Templates</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search certificates"
                className="pl-8 w-[250px]"
              />
            </div>
          </div>
        </div>
        
        <TabsContent value="issued">
          <Card>
            <CardHeader>
              <CardTitle>Issued Certificates</CardTitle>
              <CardDescription>All certificates issued to students</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Issued By</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((certificate) => (
                    <TableRow key={certificate.id}>
                      <TableCell className="font-medium">{certificate.id}</TableCell>
                      <TableCell>
                        <div>
                          <div>{certificate.studentName}</div>
                          <div className="text-sm text-muted-foreground">{certificate.admissionNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={certificateTypeColors[certificate.certificateType] as any || "default"}>
                          {certificate.certificateType}
                        </Badge>
                      </TableCell>
                      <TableCell>{certificate.issueDate}</TableCell>
                      <TableCell>{certificate.issuedBy}</TableCell>
                      <TableCell>{certificate.purpose}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate Certificate</CardTitle>
              <CardDescription>Create a new certificate for a student</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="certificateType">Certificate Type</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">-- Select Certificate Type --</option>
                      <option value="bonafide">Bonafide Certificate</option>
                      <option value="character">Character Certificate</option>
                      <option value="transfer">Transfer Certificate</option>
                      <option value="conduct">Conduct Certificate</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="student">Select Student</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">-- Select Student --</option>
                      {certificates.map((cert) => (
                        <option key={cert.admissionNumber} value={cert.admissionNumber}>
                          {cert.admissionNumber} - {cert.studentName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input id="issueDate" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="issuedBy">Issued By</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">-- Select Issuer --</option>
                      <option value="principal">Principal</option>
                      <option value="vice-principal">Vice Principal</option>
                      <option value="class-teacher">Class Teacher</option>
                      <option value="admin-officer">Administrative Officer</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Input id="purpose" placeholder="Certificate purpose" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="content">Certificate Content</Label>
                  <div className="border rounded-md p-4">
                    <div className="text-sm text-muted-foreground mb-3">
                      Use variables like {{student_name}}, {{class}}, {{admission_number}} in your template
                    </div>
                    <textarea 
                      className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      defaultValue="This is to certify that {{student_name}}, admission number {{admission_number}}, is a bonafide student of {{class}} in our school during the academic year 2022-2023."
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Preview</Button>
                  <Button>Generate Certificate</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Certificate Templates</CardTitle>
                <CardDescription>Manage certificate templates</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Template
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Variables</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">{{student_name}}</Badge>
                          <Badge variant="outline" className="text-xs">{{class}}</Badge>
                          <Badge variant="outline" className="text-xs">{{admission_number}}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileOutput className="h-4 w-4 mr-1" /> Preview
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};

export default Certificates;
