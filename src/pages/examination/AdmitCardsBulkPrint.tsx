
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Printer,
  ChevronRight,
  Download,
  CalendarCheck
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const AdmitCardsBulkPrint = () => {
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
      date: "2023-11-25 14:30",
      count: 62,
      status: "Completed"
    },
    {
      id: "2",
      name: "Final Term Examination - Class 9",
      date: "2023-11-25 13:15",
      count: 58,
      status: "Completed"
    },
    {
      id: "3",
      name: "Mid Term Assessment - Class 11",
      date: "2023-08-12 10:45",
      count: 54,
      status: "Completed"
    },
    {
      id: "4",
      name: "Unit Test - Class 8",
      date: "2023-07-05 11:20",
      count: 60,
      status: "Completed"
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
    <PageTemplate title="Admit Cards Bulk Print" subtitle="Generate and print multiple admit cards at once">
      <div className="space-y-6">
        <PageHeader
          title="Bulk Print Admit Cards"
          description="Generate PDF files with multiple admit cards for printing"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Filter and Generate Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Generate Admit Cards</CardTitle>
              <CardDescription>
                Select examination and class to generate multiple admit cards
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
                    <SelectItem value="">All Sections</SelectItem>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-instructions" defaultChecked />
                  <Label htmlFor="include-instructions">Include exam instructions</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-photo" />
                  <Label htmlFor="include-photo">Include student photos</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="multiple-cards" defaultChecked />
                  <Label htmlFor="multiple-cards">Multiple cards per page (4 cards layout)</Label>
                </div>
              </div>
              
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Generating admit cards...</span>
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
                    Generate Admit Cards
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Quick Links Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common admit card operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => console.log("Generate for all")}>
                <Printer className="mr-2 h-4 w-4" />
                Generate for All Classes
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={() => console.log("Download template")}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF Template
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={() => console.log("Schedule auto")}>
                <CalendarCheck className="mr-2 h-4 w-4" />
                Schedule Automatic Issue
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Generations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bulk Generations</CardTitle>
            <CardDescription>History of recently generated admit card batches</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Cards Count</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBulkJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.name}</TableCell>
                    <TableCell>{job.date}</TableCell>
                    <TableCell>{job.count} cards</TableCell>
                    <TableCell>{job.status}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-1" /> Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default AdmitCardsBulkPrint;
