
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Printer,
  ChevronRight,
  Download,
  Settings,
  Share2,
  Users,
  FilePlus,
  Mail
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const BulkPrintResults = () => {
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Mock data for exams, classes, subjects
  const exams = [
    { id: "1", name: "Final Term Examination 2023-24" },
    { id: "2", name: "Mid Term Assessment 2023-24" },
    { id: "3", name: "First Unit Test 2023-24" }
  ];
  
  const classes = [
    { id: "1", name: "Class 10" },
    { id: "2", name: "Class 9" },
    { id: "3", name: "Class 8" },
    { id: "4", name: "Class 7" },
    { id: "5", name: "Class 6" }
  ];
  
  const sections = [
    { id: "A", name: "Section A" },
    { id: "B", name: "Section B" },
    { id: "C", name: "Section C" }
  ];
  
  // Recent bulk generation history
  const recentBulkJobs = [
    {
      id: "1",
      name: "Final Term Examination - Class 10",
      date: "2023-12-28 14:30",
      count: 62,
      status: "Completed",
      type: "PDF"
    },
    {
      id: "2",
      name: "Final Term Examination - Class 9",
      date: "2023-12-28 13:15",
      count: 58,
      status: "Completed",
      type: "PDF"
    },
    {
      id: "3",
      name: "Mid Term Assessment - Class 11",
      date: "2023-09-05 10:45",
      count: 54,
      status: "Completed",
      type: "Email"
    },
    {
      id: "4",
      name: "Unit Test - Class 8",
      date: "2023-07-25 11:20",
      count: 60,
      status: "Failed",
      type: "Email"
    }
  ];
  
  const handleGenerate = () => {
    if (!selectedExam || !selectedClass) {
      return;
    }
    
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  return (
    <PageTemplate title="Bulk Print Results" subtitle="Print multiple result sheets at once">
      <div className="space-y-6">
        <PageHeader
          title="Bulk Print Result Cards"
          description="Generate and distribute multiple result cards at once"
        />
        
        <Tabs defaultValue="generate">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Results</TabsTrigger>
            <TabsTrigger value="settings">Result Card Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Filter and Generate Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Generate Result Cards</CardTitle>
                  <CardDescription>
                    Select examination and class to generate multiple result cards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exam">Examination</Label>
                      <Select 
                        value={selectedExam} 
                        onValueChange={setSelectedExam}
                      >
                        <SelectTrigger id="exam" className="mt-1">
                          <SelectValue placeholder="Select examination" />
                        </SelectTrigger>
                        <SelectContent>
                          {exams.map((exam) => (
                            <SelectItem key={exam.id} value={exam.id}>
                              {exam.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="class">Class</Label>
                      <Select 
                        value={selectedClass} 
                        onValueChange={setSelectedClass}
                      >
                        <SelectTrigger id="class" className="mt-1">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="section">Section (Optional)</Label>
                    <Select 
                      value={selectedSection} 
                      onValueChange={setSelectedSection}
                    >
                      <SelectTrigger id="section" className="mt-1">
                        <SelectValue placeholder="All Sections" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Fix: Changed empty string value to "all" */}
                        <SelectItem value="all">All Sections</SelectItem>
                        {sections.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <Label className="mb-2 block">Output Format</Label>
                    <RadioGroup defaultValue="pdf" className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pdf" id="pdf" />
                        <Label htmlFor="pdf" className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" /> PDF Documents
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <Label htmlFor="email" className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" /> Email to Parents
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both" className="flex items-center">
                          <Share2 className="h-4 w-4 mr-2" /> Both PDF and Email
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-chart" defaultChecked />
                      <Label htmlFor="include-chart">Include performance chart</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-rank" defaultChecked />
                      <Label htmlFor="include-rank">Include class rank</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-remarks" defaultChecked />
                      <Label htmlFor="include-remarks">Include teacher remarks</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-attendance" />
                      <Label htmlFor="include-attendance">Include attendance record</Label>
                    </div>
                  </div>
                  
                  {isGenerating && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Generating result cards...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Preview</Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={!selectedExam || !selectedClass || isGenerating}
                  >
                    {isGenerating ? (
                      <>Generating...</>
                    ) : (
                      <>
                        <Printer className="mr-2 h-4 w-4" />
                        Generate Results
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Quick Links Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common result operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => console.log("Generate for all")}>
                    <Users className="mr-2 h-4 w-4" />
                    Generate for All Classes
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => console.log("Download template")}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF Template
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => console.log("Schedule auto")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configure Email Template
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => console.log("Schedule auto")}>
                    <FilePlus className="mr-2 h-4 w-4" />
                    Create Custom Report
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Generations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bulk Generations</CardTitle>
                <CardDescription>History of recently generated result batches</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead className="text-center">Cards Count</TableHead>
                      <TableHead className="text-center">Type</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBulkJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.name}</TableCell>
                        <TableCell>{job.date}</TableCell>
                        <TableCell className="text-center">{job.count}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {job.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={job.status === "Completed" ? "outline" : "destructive"}>
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            {job.type === "PDF" ? (
                              <><FileText className="h-4 w-4 mr-1" /> Download</>
                            ) : (
                              <><Mail className="h-4 w-4 mr-1" /> Resend</>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Result Card Template Settings</CardTitle>
                <CardDescription>
                  Customize the appearance and content of result cards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Header Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="school-logo">School Logo</Label>
                      <Input id="school-logo" type="file" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="header-text">Header Text</Label>
                      <Input id="header-text" placeholder="e.g. ANNUAL PROGRESS REPORT" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="footer-text">Footer Text</Label>
                      <Input id="footer-text" placeholder="e.g. School contact information" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signature-image">Principal's Signature</Label>
                      <Input id="signature-image" type="file" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Content Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="show-percentage" defaultChecked />
                      <Label htmlFor="show-percentage">Show percentage</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="show-grades" defaultChecked />
                      <Label htmlFor="show-grades">Show grades</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="show-highest" defaultChecked />
                      <Label htmlFor="show-highest">Show highest marks in class</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="show-previous" />
                      <Label htmlFor="show-previous">Show comparison with previous exam</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="show-behavior" defaultChecked />
                      <Label htmlFor="show-behavior">Include behavior assessment</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="show-activities" />
                      <Label htmlFor="show-activities">Include co-curricular activities</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-subject">Email Subject</Label>
                      <Input id="email-subject" placeholder="e.g. {Student Name} - Result Card" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sender-name">Sender Name</Label>
                      <Input id="sender-name" placeholder="e.g. School Name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-template">Email Body Template</Label>
                    <div className="border rounded-md p-4 bg-slate-50 text-sm">
                      <p>Dear Parent/Guardian,</p>
                      <p className="my-2">
                        We are pleased to share the result card for <strong>[Student Name]</strong> for <strong>[Exam Name]</strong>.
                      </p>
                      <p className="my-2">
                        Kindly find the result card attached to this email.
                      </p>
                      <p className="my-2">
                        If you have any questions or concerns regarding the result, please feel free to contact the class teacher.
                      </p>
                      <p>Thank you,</p>
                      <p>School Administration</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Restore Defaults</Button>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTemplate>
  );
};

export default BulkPrintResults;
