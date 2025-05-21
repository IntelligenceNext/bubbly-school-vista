
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen, FileText, Award, Star, Users, ChevronRight } from 'lucide-react';
import { BarChart } from '@/components/ui/BarChart';
import { LineChart } from '@/components/ui/LineChart';

const Dashboard = () => {
  // Sample data for charts and statistics
  const examPerformanceData = {
    labels: ["Term 1", "Mid Term", "Term 2", "Final"],
    datasets: [
      {
        label: "Average Score",
        data: [68, 72, 74, 78],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      }
    ]
  };
  
  const subjectPerformanceData = {
    labels: ["Mathematics", "Science", "English", "History", "Geography"],
    datasets: [
      {
        label: "Pass Rate (%)",
        data: [92, 88, 95, 87, 91],
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgb(34, 197, 94)",
      }
    ]
  };

  const upcomingExams = [
    {
      name: "Final Term Examination",
      startDate: "2023-12-05",
      endDate: "2023-12-18",
      classes: "All",
    },
    {
      name: "Class 12 Pre-Board",
      startDate: "2023-11-15",
      endDate: "2023-11-25",
      classes: "Class 12",
    },
    {
      name: "Class 10 Mid-Term",
      startDate: "2023-11-10",
      endDate: "2023-11-15",
      classes: "Class 10",
    },
  ];

  const recentResults = [
    {
      exam: "First Term Examination",
      publishDate: "2023-09-30",
      classes: "Classes 6-10",
      status: "Published"
    },
    {
      exam: "Unit Test - October",
      publishDate: "2023-10-20",
      classes: "Classes 1-5",
      status: "Published"
    },
    {
      exam: "Mid-Term Assessment",
      publishDate: "2023-10-15",
      classes: "Classes 11-12",
      status: "Draft"
    },
  ];

  const quickStats = [
    { title: "Total Exams", value: "24", icon: <Award className="h-5 w-5 text-indigo-600" /> },
    { title: "Subjects Under Assessment", value: "18", icon: <BookOpen className="h-5 w-5 text-blue-600" /> },
    { title: "Results Published", value: "16", icon: <FileText className="h-5 w-5 text-green-600" /> },
    { title: "Pass Percentage", value: "87%", icon: <Star className="h-5 w-5 text-amber-600" /> }
  ];

  return (
    <PageTemplate title="Examination Dashboard" subtitle="Overview of examinations and academic performance">
      <div className="grid gap-6">
        {/* Quick stats at the top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                  </div>
                  <div className="p-2 bg-slate-100 rounded-full">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Performance Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam Performance Trend</CardTitle>
              <CardDescription>Average scores by term</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: 300 }}>
                <LineChart 
                  data={examPerformanceData}
                  index="name"
                  categories={['Average Score']}
                  colors={['59, 130, 246']}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Pass Rates</CardTitle>
              <CardDescription>Percentage of students passing by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: 300 }}>
                <BarChart 
                  data={subjectPerformanceData}
                  index="name"
                  categories={['Pass Rate (%)']}
                  colors={['34, 197, 94']}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for Upcoming/Recent */}
        <Card>
          <CardHeader>
            <CardTitle>Examination Schedule</CardTitle>
            <CardDescription>Upcoming exams and recent results</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming Exams</TabsTrigger>
                <TabsTrigger value="recent">Recent Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <div className="space-y-4">
                  {upcomingExams.map((exam, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{exam.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {exam.startDate} to {exam.endDate} • {exam.classes}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Button variant="outline" className="w-full">View All Exams</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recent">
                <div className="space-y-4">
                  {recentResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-full">
                          <FileText className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{result.exam}</p>
                          <p className="text-xs text-muted-foreground">
                            Published: {result.publishDate} • {result.classes}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant={result.status === "Published" ? "outline" : "secondary"} 
                        size="sm"
                      >
                        {result.status}
                      </Button>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Button variant="outline" className="w-full">View All Results</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default Dashboard;
