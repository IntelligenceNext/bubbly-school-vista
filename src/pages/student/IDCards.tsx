import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Filter, IdCard, Plus, Printer, Search, Settings } from 'lucide-react';

const IDCards = () => {
  const [activeTab, setActiveTab] = useState("generated");
  
  // Sample data for ID cards
  const idCards = [
    {
      id: "IDC001",
      studentName: "Rahul Sharma",
      admissionNumber: "ST20230001",
      class: "Class 8A",
      issueDate: "2023-04-15",
      expiryDate: "2024-03-31",
      status: "Active"
    },
    {
      id: "IDC002",
      studentName: "Priya Patel",
      admissionNumber: "ST20230002",
      class: "Class 7B",
      issueDate: "2023-04-15",
      expiryDate: "2024-03-31",
      status: "Active"
    },
    {
      id: "IDC003",
      studentName: "Karan Singh",
      admissionNumber: "ST20230003",
      class: "Class 6A",
      issueDate: "2023-04-15",
      expiryDate: "2024-03-31",
      status: "Inactive"
    },
    {
      id: "IDC004",
      studentName: "Neha Gupta",
      admissionNumber: "ST20230004",
      class: "Class 5C",
      issueDate: "2023-04-15",
      expiryDate: "2024-03-31",
      status: "Active"
    },
    {
      id: "IDC005",
      studentName: "Arjun Kumar",
      admissionNumber: "ST20230005",
      class: "Class 7A",
      issueDate: "2023-04-15",
      expiryDate: "2024-03-31",
      status: "Active"
    }
  ];

  // Status badge color mapping
  const statusColors = {
    "Active": "success",
    "Inactive": "destructive",
    "Expired": "warning"
  };

  // Mock template options
  const templates = [
    { id: 1, name: "Standard Template", description: "Default school ID card template" },
    { id: 2, name: "Modern Layout", description: "Contemporary design with QR code" },
    { id: 3, name: "Simple Design", description: "Minimalist design with essential info only" }
  ];

  return (
    <PageTemplate title="ID Cards" subtitle="Generate and manage student ID cards">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="generated">Generated Cards</TabsTrigger>
            <TabsTrigger value="generate">Generate New</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" /> Bulk Print
            </Button>
          </div>
        </div>
        
        <TabsContent value="generated">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>ID Card Registry</CardTitle>
                  <CardDescription>All generated student ID cards</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by student name or admission number"
                    className="pl-8 w-[300px]"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Card ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Admission Number</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {idCards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell className="font-medium">{card.id}</TableCell>
                      <TableCell>{card.studentName}</TableCell>
                      <TableCell>{card.admissionNumber}</TableCell>
                      <TableCell>{card.class}</TableCell>
                      <TableCell>{card.issueDate}</TableCell>
                      <TableCell>{card.expiryDate}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[card.status] as any || "default"}>
                          {card.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <IdCard className="h-4 w-4" />
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
              <CardTitle>Generate ID Cards</CardTitle>
              <CardDescription>Create new ID cards for students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="class">Select Class</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">All Classes</option>
                    <option value="Class 8A">Class 8A</option>
                    <option value="Class 7B">Class 7B</option>
                    <option value="Class 6A">Class 6A</option>
                    <option value="Class 5C">Class 5C</option>
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="template">Select Template</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input id="issueDate" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input id="expiryDate" type="date" />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Select Students</Label>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <input type="checkbox" />
                          </TableHead>
                          <TableHead>Admission No</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {idCards.map((student, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <input type="checkbox" />
                            </TableCell>
                            <TableCell>{student.admissionNumber}</TableCell>
                            <TableCell>{student.studentName}</TableCell>
                            <TableCell>{student.class}</TableCell>
                            <TableCell>
                              <Badge variant={statusColors[student.status] as any || "default"}>
                                {student.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Generate ID Cards</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>ID Card Templates</CardTitle>
              <CardDescription>Manage and customize ID card templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-md">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-center h-40 bg-slate-100 rounded-md">
                        <IdCard className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 flex justify-between">
                      <Button variant="outline" size="sm">Preview</Button>
                      <Button size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Customize
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                <Card className="border-dashed">
                  <div className="flex items-center justify-center h-full p-8">
                    <Button variant="outline" className="w-full h-full">
                      <Plus className="h-6 w-6 mr-2" />
                      Add New Template
                    </Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};

export default IDCards;
