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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart } from "@/components/ui/BarChart";
import { LineChart } from "@/components/ui/LineChart";
import {
  FileText,
  Printer,
  Search,
  Download,
  BarChart as BarChartIcon,
  PieChart,
  List,
  Award
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
import { ScrollArea } from "@/components/ui/scroll-area";

const AcademicReport = () => {
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  
  // Mock data for exams, classes
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
  
  // Subject performance data for charts
  const subjectPerformance = {
    labels: ["Mathematics", "Science", "English", "Hindi", "Social Science"],
    datasets: [
      {
        label: "Pass Percentage",
        data: [92, 85, 95, 88, 78],
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgb(34, 197, 94)",
      },
      {
        label: "Average Score",
        data: [72, 68, 75, 70, 65],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
      }
    ]
  };
  
  // Student performance data for charts
  const performanceTrend = {
    labels: ["Unit Test 1", "Mid Term", "Unit Test 2", "Final Term"],
    datasets: [
      {
        label: "Class Average",
        data: [68, 72, 70, 75],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
      {
        label: "School Average",
        data: [65, 70, 68, 73],
        borderColor: "rgb(147, 51, 234)",
        backgroundColor: "rgba(147, 51, 234, 0.5)",
      }
    ]
  };
  
  // Top performers data
  const topPerformers = [
    {
      rank: 1,
      name: "Priya Patel",
      rollNo: "A002",
      percentage: 90.0,
      grade: "A+",
    },
    {
      rank: 2,
      name: "Aryan Sharma",
      rollNo: "A001",
      percentage: 82.0,
      grade: "A",
    },
    {
      rank: 3,
      name: "Anjali Singh",
      rollNo: "A004",
      percentage: 80.2,
      grade: "A",
    },
    {
      rank: 4,
      name: "Mohammed Rizwan",
      rollNo: "A005",
      percentage: 75.4,
      grade: "B",
    },
    {
      rank: 5,
      name: "Rahul Yadav",
      rollNo: "A003",
      percentage: 70.0,
      grade: "B",
    }
  ];
  
  // Grade distribution data
  const gradeDistribution = {
    "A+": 8,
    "A": 15,
    "B+": 22,
    "B": 18,
    "C+": 12,
    "C": 10,
    "D": 5,
    "F": 2
  };
  
  // Subject-wise analysis
  const subjectAnalysis = [
    {
      subject: "Mathematics",
      highestScore: 95,
      lowestScore: 35,
      averageScore: 72,
      passPercentage: 92,
      gradeDistribution: {
        "A+": 10,
        "A": 15,
        "B+": 25,
        "B": 20,
        "C+": 15,
        "C": 7,
        "D": 5,
        "F": 3
      }
    },
    {
      subject: "Science",
      highestScore: 98,
      lowestScore: 30,
      averageScore: 68,
      passPercentage: 85,
      gradeDistribution: {
        "A+": 8,
        "A": 12,
        "B+": 20,
        "B": 25,
        "C+": 18,
        "C": 10,
        "D": 4,
        "F": 3
      }
    },
    {
      subject: "English",
      highestScore: 99,
      lowestScore: 40,
      averageScore: 75,
      passPercentage: 95,
      gradeDistribution: {
        "A+": 15,
        "A": 20,
        "B+": 30,
        "B": 15,
        "C+": 10,
        "C": 5,
        "D": 3,
        "F": 2
      }
    },
    {
      subject: "Hindi",
      highestScore: 95,
      lowestScore: 38,
      averageScore: 70,
      passPercentage: 88,
      gradeDistribution: {
        "A+": 12,
        "A": 18,
        "B+": 22,
        "B": 20,
        "C+": 15,
        "C": 8,
        "D": 3,
        "F": 2
      }
    },
    {
      subject: "Social Science",
      highestScore: 90,
      lowestScore: 32,
      averageScore: 65,
      passPercentage: 78,
      gradeDistribution: {
        "A+": 5,
        "A": 15,
        "B+": 18,
        "B": 22,
        "C+": 20,
        "C": 15,
        "D": 3,
        "F": 2
      }
    }
  ];
  
  // Comparison data between classes
  const classComparison = [
    { class: "Class 10-A", passPercentage: 95, averageScore: 75 },
    { class: "Class 10-B", passPercentage: 92, averageScore: 73 },
    { class: "Class 9-A", passPercentage: 88, averageScore: 70 },
    { class: "Class 9-B", passPercentage: 85, averageScore: 68 },
    { class: "Class 8-A", passPercentage: 90, averageScore: 72 },
    { class: "Class 8-B", passPercentage: 87, averageScore: 69 },
  ];
  
  return (
    <PageTemplate title="Academic Report" subtitle="Generate academic performance reports">
      <div className="space-y-6">
        <PageHeader
          title="Academic Performance Analysis"
          description="Comprehensive reports and analytics on student performance"
          actions={[
            <Button key="download" variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
          ]}
        />
        
        {/* Filter Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="exam-select" className="mb-2 block">Examination</Label>
                <Select 
                  value={selectedExam} 
                  onValueChange={setSelectedExam}
                >
                  <SelectTrigger id="exam-select">
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
              
              <div className="flex-1 flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="class-select" className="mb-2 block">Class</Label>
                  <Select 
                    value={selectedClass} 
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger id="class-select">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <Label htmlFor="section-select" className="mb-2 block">Section</Label>
                  <Select 
                    value={selectedSection} 
                    onValueChange={setSelectedSection}
                  >
                    <SelectTrigger id="section-select">
                      <SelectValue placeholder="All Sections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {sections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="shrink-0">
                <Label htmlFor="view-type" className="invisible block mb-2">Search</Label>
                <Button className="w-full">
                  <Search className="mr-2 h-4 w-4" /> Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Report Content */}
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">
              <BarChartIcon className="h-4 w-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="subjects">
              <PieChart className="h-4 w-4 mr-2" /> Subject Analysis
            </TabsTrigger>
            <TabsTrigger value="toppers">
              <Award className="h-4 w-4 mr-2" /> Top Performers
            </TabsTrigger>
            <TabsTrigger value="comparison">
              <List className="h-4 w-4 mr-2" /> Class Comparison
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Performance</CardTitle>
                  <CardDescription>Subject-wise pass percentage and average scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ height: 300 }}>
                    <BarChart 
                      data={subjectPerformance}
                      index="name"
                      categories={['Pass Percentage', 'Average Score']}
                      colors={['34, 197, 94', '59, 130, 246']}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trend</CardTitle>
                  <CardDescription>Average scores across examinations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ height: 300 }}>
                    <LineChart 
                      data={performanceTrend}
                      index="name"
                      categories={['Class Average', 'School Average']}
                      colors={['59, 130, 246', '147, 51, 234']}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Class 10 - Final Term</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Grade</TableHead>
                        <TableHead className="text-right">Students</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(gradeDistribution).map(([grade, count]) => {
                        const total = Object.values(gradeDistribution).reduce((a, b) => a + b, 0);
                        const percentage = ((count / total) * 100).toFixed(1);
                        
                        return (
                          <TableRow key={grade}>
                            <TableCell className="font-medium">{grade}</TableCell>
                            <TableCell className="text-right">{count}</TableCell>
                            <TableCell className="text-right">{percentage}%</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>Class 10 - Final Term Examination 2023-24</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Students Appeared</p>
                      <p className="text-2xl font-bold">92</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Pass Percentage</p>
                      <p className="text-2xl font-bold text-green-600">87%</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Average Score</p>
                      <p className="text-2xl font-bold text-blue-600">72.5%</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">A+ Grades</p>
                      <p className="text-2xl font-bold text-purple-600">8</p>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Highest Score</p>
                      <p className="text-2xl font-bold text-amber-600">98%</p>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Failed</p>
                      <p className="text-2xl font-bold text-red-600">2</p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Key Observations:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Mathematics and English have the highest pass percentage</li>
                      <li>Social Science requires additional attention with lowest pass rate of 78%</li>
                      <li>Overall performance improved by 5% compared to Mid Term Assessment</li>
                      <li>8 students scored above 90% across all subjects</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Subject Analysis Tab */}
          <TabsContent value="subjects" className="space-y-6">
            {subjectAnalysis.map((subject, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{subject.subject}</CardTitle>
                      <CardDescription>Subject performance analysis</CardDescription>
                    </div>
                    <Badge variant={subject.passPercentage >= 90 ? "outline" : subject.passPercentage >= 80 ? "secondary" : "destructive"} className="ml-auto">
                      Pass: {subject.passPercentage}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-1 md:col-span-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-50 p-4 rounded-lg text-center">
                          <p className="text-xs text-gray-500">Highest Score</p>
                          <p className="text-xl font-bold">{subject.highestScore}</p>
                        </div>
                        
                        <div className="bg-slate-50 p-4 rounded-lg text-center">
                          <p className="text-xs text-gray-500">Average Score</p>
                          <p className="text-xl font-bold">{subject.averageScore}</p>
                        </div>
                        
                        <div className="bg-slate-50 p-4 rounded-lg text-center">
                          <p className="text-xs text-gray-500">Lowest Score</p>
                          <p className="text-xl font-bold">{subject.lowestScore}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">Grade Distribution:</h4>
                        <div className="flex items-center h-8">
                          {Object.entries(subject.gradeDistribution).map(([grade, count], i) => {
                            const total = Object.values(subject.gradeDistribution).reduce((a, b) => a + b, 0);
                            const percentage = (count / total) * 100;
                            
                            const getColor = (grade: string) => {
                              const colorMap: Record<string, string> = {
                                "A+": "bg-green-500",
                                "A": "bg-green-400", 
                                "B+": "bg-blue-500",
                                "B": "bg-blue-400",
                                "C+": "bg-yellow-500",
                                "C": "bg-yellow-400",
                                "D": "bg-orange-400",
                                "F": "bg-red-500"
                              };
                              return colorMap[grade] || "bg-gray-400";
                            };
                            
                            return (
                              <div 
                                key={i} 
                                className={`h-full ${getColor(grade)}`} 
                                style={{ width: `${percentage}%` }}
                                title={`${grade}: ${count} students (${percentage.toFixed(1)}%)`}
                              ></div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>A+</span>
                          <span>F</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">Observations:</h4>
                        <ul className="text-sm space-y-1 list-disc list-inside">
                          <li>
                            {subject.passPercentage >= 90 
                              ? "Excellent performance with high pass percentage" 
                              : subject.passPercentage >= 80 
                                ? "Good performance, but room for improvement" 
                                : "Performance below expected, requires attention"}
                          </li>
                          <li>
                            {subject.highestScore >= 95 
                              ? "Outstanding top scores in the subject" 
                              : "Top scores can be improved further"}
                          </li>
                          <li>
                            {subject.averageScore >= 75 
                              ? "High average score indicates good teaching effectiveness" 
                              : subject.averageScore >= 65 
                                ? "Average score is satisfactory" 
                                : "Low average score requires teaching methodology review"}
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border-l pl-4">
                      <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                      <ul className="text-sm space-y-2">
                        {subject.passPercentage < 85 && (
                          <li>✓ Organize remedial classes for struggling students</li>
                        )}
                        {subject.averageScore < 70 && (
                          <li>✓ Review teaching methodology and materials</li>
                        )}
                        {subject.lowestScore < 40 && (
                          <li>✓ Schedule individual sessions with low performers</li>
                        )}
                        <li>✓ Conduct topic-wise assessments to identify difficult areas</li>
                        <li>✓ Provide additional practice materials</li>
                        {subject.highestScore < 95 && (
                          <li>✓ Develop advanced material for high performers</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          {/* Top Performers Tab */}
          <TabsContent value="toppers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Top 5 Performers</CardTitle>
                  <CardDescription>Class 10 - Final Term Examination 2023-24</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Roll No</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topPerformers.map((student) => (
                        <TableRow key={student.rank}>
                          <TableCell>
                            <Badge variant={student.rank <= 3 ? "outline" : "secondary"}>
                              {student.rank}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.rollNo}</TableCell>
                          <TableCell className="text-right">{student.percentage.toFixed(1)}%</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="font-bold">
                              {student.grade}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4 mr-1" /> Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Printer className="mr-2 h-4 w-4" /> Print Merit List
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Highlights</CardTitle>
                  <CardDescription>Achievement summary</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium mb-2">Subject Toppers:</h4>
                    <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Mathematics</span>
                        <span className="font-medium">Priya Patel (95/100)</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Science</span>
                        <span className="font-medium">Aryan Sharma (92/100)</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>English</span>
                        <span className="font-medium">Priya Patel (94/100)</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Hindi</span>
                        <span className="font-medium">Anjali Singh (90/100)</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Social Science</span>
                        <span className="font-medium">Mohammed Rizwan (88/100)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Achievements:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Award className="h-4 w-4 mr-2 text-amber-500 mt-0.5 shrink-0" />
                        <span><strong>8</strong> students scored above 90% (A+ grade)</span>
                      </li>
                      <li className="flex items-start">
                        <Award className="h-4 w-4 mr-2 text-blue-500 mt-0.5 shrink-0" />
                        <span><strong>15</strong> students scored between 80-90% (A grade)</span>
                      </li>
                      <li className="flex items-start">
                        <Award className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                        <span>Class 10-A achieved highest class average of 75%</span>
                      </li>
                      <li className="flex items-start">
                        <Award className="h-4 w-4 mr-2 text-purple-500 mt-0.5 shrink-0" />
                        <span>Perfect attendance by <strong>12</strong> students during exam period</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Most Improved Students</CardTitle>
                <CardDescription>Students showing significant progress compared to previous exam</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Roll No</TableHead>
                        <TableHead>Previous %</TableHead>
                        <TableHead>Current %</TableHead>
                        <TableHead className="text-right">Improvement</TableHead>
                        <TableHead>Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Rahul Yadav</TableCell>
                        <TableCell>A003</TableCell>
                        <TableCell>58.5%</TableCell>
                        <TableCell>70.0%</TableCell>
                        <TableCell className="text-right text-green-600">+11.5%</TableCell>
                        <TableCell>Significant improvement in Mathematics and Science</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Kavita Gupta</TableCell>
                        <TableCell>A008</TableCell>
                        <TableCell>62.0%</TableCell>
                        <TableCell>73.2%</TableCell>
                        <TableCell className="text-right text-green-600">+11.2%</TableCell>
                        <TableCell>Remarkable progress in all subjects</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Sameer Khan</TableCell>
                        <TableCell>A012</TableCell>
                        <TableCell>55.8%</TableCell>
                        <TableCell>65.5%</TableCell>
                        <TableCell className="text-right text-green-600">+9.7%</TableCell>
                        <TableCell>Notable improvement after attending remedial classes</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Pooja Sharma</TableCell>
                        <TableCell>A015</TableCell>
                        <TableCell>68.0%</TableCell>
                        <TableCell>76.8%</TableCell>
                        <TableCell className="text-right text-green-600">+8.8%</TableCell>
                        <TableCell>Consistent improvement throughout the term</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Vikram Singh</TableCell>
                        <TableCell>A021</TableCell>
                        <TableCell>59.5%</TableCell>
                        <TableCell>68.0%</TableCell>
                        <TableCell className="text-right text-green-600">+8.5%</TableCell>
                        <TableCell>Significant improvement in language subjects</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Class Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Class-wise Comparison</CardTitle>
                <CardDescription>Performance analysis across different classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class</TableHead>
                        <TableHead className="text-right">Pass %</TableHead>
                        <TableHead className="text-right">Avg. Score</TableHead>
                        <TableHead className="text-right">A+ Grades</TableHead>
                        <TableHead className="text-right">Failed</TableHead>
                        <TableHead>Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classComparison.map((cls, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{cls.class}</TableCell>
                          <TableCell className="text-right">{cls.passPercentage}%</TableCell>
                          <TableCell className="text-right">{cls.averageScore}%</TableCell>
                          <TableCell className="text-right">{Math.floor(Math.random() * 10) + 1}</TableCell>
                          <TableCell className="text-right">{Math.floor(Math.random() * 3)}</TableCell>
                          <TableCell>
                            <div className="w-full bg-slate-100 rounded-full h-2.5">
                              <div 
                                className="bg-green-500 h-2.5 rounded-full" 
                                style={{ width: `${cls.passPercentage}%` }}
                              ></div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Observations:</h3>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Class 10-A has the highest pass percentage (95%)</li>
                        <li>Class 10-A also leads in average score (75%)</li>
                        <li>Class 9-B shows the lowest performance metrics</li>
                        <li>Upper classes (10 & 9) show better overall results than lower classes</li>
                        <li>Section A consistently outperforms section B across all classes</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Recommendations:</h3>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Investigate teaching methodologies in Class 9-B to identify areas for improvement</li>
                        <li>Document and share best practices from Class 10-A</li>
                        <li>Consider additional support for section B classes</li>
                        <li>Review subject-wise performance in lower classes</li>
                        <li>Organize teacher training based on performance analysis</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export Comparison
                </Button>
                <Button>
                  <Printer className="mr-2 h-4 w-4" /> Print Report
                </Button>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subject-wise Class Comparison</CardTitle>
                  <CardDescription>Performance by subject across classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-right">Class 10</TableHead>
                        <TableHead className="text-right">Class 9</TableHead>
                        <TableHead className="text-right">Class 8</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Mathematics</TableCell>
                        <TableCell className="text-right">72%</TableCell>
                        <TableCell className="text-right">68%</TableCell>
                        <TableCell className="text-right">65%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Science</TableCell>
                        <TableCell className="text-right">68%</TableCell>
                        <TableCell className="text-right">65%</TableCell>
                        <TableCell className="text-right">70%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">English</TableCell>
                        <TableCell className="text-right">75%</TableCell>
                        <TableCell className="text-right">72%</TableCell>
                        <TableCell className="text-right">74%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Hindi</TableCell>
                        <TableCell className="text-right">70%</TableCell>
                        <TableCell className="text-right">68%</TableCell>
                        <TableCell className="text-right">72%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Social Science</TableCell>
                        <TableCell className="text-right">65%</TableCell>
                        <TableCell className="text-right">62%</TableCell>
                        <TableCell className="text-right">64%</TableCell>
                      </TableRow>
                      <TableRow className="font-medium">
                        <TableCell>Overall Average</TableCell>
                        <TableCell className="text-right">70.0%</TableCell>
                        <TableCell className="text-right">67.0%</TableCell>
                        <TableCell className="text-right">69.0%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Gender-wise Performance</CardTitle>
                  <CardDescription>Comparison of academic performance by gender</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Boys Average</p>
                      <p className="text-2xl font-bold text-blue-600">68.5%</p>
                      <p className="text-sm text-gray-500 mt-1">Pass Rate: 85%</p>
                    </div>
                    
                    <div className="bg-pink-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Girls Average</p>
                      <p className="text-2xl font-bold text-pink-600">73.2%</p>
                      <p className="text-sm text-gray-500 mt-1">Pass Rate: 92%</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Subject-wise Gender Performance:</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead className="text-right">Boys</TableHead>
                          <TableHead className="text-right">Girls</TableHead>
                          <TableHead className="text-right">Difference</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Mathematics</TableCell>
                          <TableCell className="text-right">74%</TableCell>
                          <TableCell className="text-right">70%</TableCell>
                          <TableCell className="text-right text-blue-600">+4%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Science</TableCell>
                          <TableCell className="text-right">69%</TableCell>
                          <TableCell className="text-right">67%</TableCell>
                          <TableCell className="text-right text-blue-600">+2%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>English</TableCell>
                          <TableCell className="text-right">70%</TableCell>
                          <TableCell className="text-right">78%</TableCell>
                          <TableCell className="text-right text-pink-600">+8%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Hindi</TableCell>
                          <TableCell className="text-right">65%</TableCell>
                          <TableCell className="text-right">74%</TableCell>
                          <TableCell className="text-right text-pink-600">+9%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Social Science</TableCell>
                          <TableCell className="text-right">64%</TableCell>
                          <TableCell className="text-right">77%</TableCell>
                          <TableCell className="text-right text-pink-600">+13%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTemplate>
  );
};

export default AcademicReport;
