
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, Calendar, Plus, Settings } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ClassTimeTable = () => {
  const [activeTab, setActiveTab] = useState("monday");
  
  const periods = [
    { id: 1, name: "Period 1", startTime: "08:00", endTime: "08:45" },
    { id: 2, name: "Period 2", startTime: "08:50", endTime: "09:35" },
    { id: 3, name: "Period 3", startTime: "09:40", endTime: "10:25" },
    { id: 4, name: "Break", startTime: "10:25", endTime: "10:40" },
    { id: 5, name: "Period 4", startTime: "10:40", endTime: "11:25" },
    { id: 6, name: "Period 5", startTime: "11:30", endTime: "12:15" },
    { id: 7, name: "Lunch", startTime: "12:15", endTime: "13:00" },
    { id: 8, name: "Period 6", startTime: "13:00", endTime: "13:45" },
    { id: 9, name: "Period 7", startTime: "13:50", endTime: "14:35" },
    { id: 10, name: "Period 8", startTime: "14:40", endTime: "15:25" },
  ];

  const timetableData = {
    monday: [
      { periodId: 1, subject: "Mathematics", teacher: "Mr. Smith", room: "101" },
      { periodId: 2, subject: "Science", teacher: "Ms. Brown", room: "Lab 1" },
      { periodId: 3, subject: "English", teacher: "Mrs. Miller", room: "102" },
      { periodId: 4, subject: "Break", teacher: "", room: "" },
      { periodId: 5, subject: "History", teacher: "Mr. Wilson", room: "103" },
      { periodId: 6, subject: "Physical Education", teacher: "Mr. Johnson", room: "Gym" },
      { periodId: 7, subject: "Lunch", teacher: "", room: "Cafeteria" },
      { periodId: 8, subject: "Art", teacher: "Ms. Davis", room: "Art Studio" },
      { periodId: 9, subject: "Computer Science", teacher: "Mr. Lee", room: "Computer Lab" },
      { periodId: 10, subject: "Music", teacher: "Mrs. White", room: "Music Room" },
    ],
    tuesday: [
      { periodId: 1, subject: "Science", teacher: "Ms. Brown", room: "Lab 1" },
      { periodId: 2, subject: "Mathematics", teacher: "Mr. Smith", room: "101" },
      { periodId: 3, subject: "Geography", teacher: "Mr. Roberts", room: "104" },
      { periodId: 4, subject: "Break", teacher: "", room: "" },
      { periodId: 5, subject: "English Literature", teacher: "Mrs. Miller", room: "102" },
      { periodId: 6, subject: "Physics", teacher: "Dr. Hughes", room: "Lab 2" },
      { periodId: 7, subject: "Lunch", teacher: "", room: "Cafeteria" },
      { periodId: 8, subject: "Computer Science", teacher: "Mr. Lee", room: "Computer Lab" },
      { periodId: 9, subject: "Mathematics", teacher: "Mr. Smith", room: "101" },
      { periodId: 10, subject: "English Grammar", teacher: "Mrs. Miller", room: "102" },
    ],
    wednesday: [
      { periodId: 1, subject: "History", teacher: "Mr. Wilson", room: "103" },
      { periodId: 2, subject: "English", teacher: "Mrs. Miller", room: "102" },
      { periodId: 3, subject: "Mathematics", teacher: "Mr. Smith", room: "101" },
      { periodId: 4, subject: "Break", teacher: "", room: "" },
      { periodId: 5, subject: "Chemistry", teacher: "Ms. Brown", room: "Lab 1" },
      { periodId: 6, subject: "Foreign Language", teacher: "Mrs. Garcia", room: "105" },
      { periodId: 7, subject: "Lunch", teacher: "", room: "Cafeteria" },
      { periodId: 8, subject: "Biology", teacher: "Dr. Chen", room: "Lab 3" },
      { periodId: 9, subject: "Social Studies", teacher: "Mr. Wilson", room: "103" },
      { periodId: 10, subject: "Mathematics", teacher: "Mr. Smith", room: "101" },
    ],
    thursday: [
      { periodId: 1, subject: "English Literature", teacher: "Mrs. Miller", room: "102" },
      { periodId: 2, subject: "Physics", teacher: "Dr. Hughes", room: "Lab 2" },
      { periodId: 3, subject: "Computer Science", teacher: "Mr. Lee", room: "Computer Lab" },
      { periodId: 4, subject: "Break", teacher: "", room: "" },
      { periodId: 5, subject: "Mathematics", teacher: "Mr. Smith", room: "101" },
      { periodId: 6, subject: "Geography", teacher: "Mr. Roberts", room: "104" },
      { periodId: 7, subject: "Lunch", teacher: "", room: "Cafeteria" },
      { periodId: 8, subject: "Science", teacher: "Ms. Brown", room: "Lab 1" },
      { periodId: 9, subject: "Physical Education", teacher: "Mr. Johnson", room: "Gym" },
      { periodId: 10, subject: "Art", teacher: "Ms. Davis", room: "Art Studio" },
    ],
    friday: [
      { periodId: 1, subject: "Geography", teacher: "Mr. Roberts", room: "104" },
      { periodId: 2, subject: "History", teacher: "Mr. Wilson", room: "103" },
      { periodId: 3, subject: "Science", teacher: "Ms. Brown", room: "Lab 1" },
      { periodId: 4, subject: "Break", teacher: "", room: "" },
      { periodId: 5, subject: "English", teacher: "Mrs. Miller", room: "102" },
      { periodId: 6, subject: "Mathematics", teacher: "Mr. Smith", room: "101" },
      { periodId: 7, subject: "Lunch", teacher: "", room: "Cafeteria" },
      { periodId: 8, subject: "Music", teacher: "Mrs. White", room: "Music Room" },
      { periodId: 9, subject: "Foreign Language", teacher: "Mrs. Garcia", room: "105" },
      { periodId: 10, subject: "Class Meeting", teacher: "Class Teacher", room: "101" },
    ],
  };

  const currentDayData = timetableData[activeTab] || [];

  const isBreakOrLunch = (subject) => {
    return subject === "Break" || subject === "Lunch";
  };

  return (
    <PageTemplate title="Class Time Table" subtitle="Manage class schedules and timetables">
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Class 8-A Timetable</CardTitle>
              <CardDescription>Weekly schedule for Class 8-A</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings size={16} />
                Configure
              </Button>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                New Schedule
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="monday" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="monday">Monday</TabsTrigger>
                <TabsTrigger value="tuesday">Tuesday</TabsTrigger>
                <TabsTrigger value="wednesday">Wednesday</TabsTrigger>
                <TabsTrigger value="thursday">Thursday</TabsTrigger>
                <TabsTrigger value="friday">Friday</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="space-y-3">
              {periods.map((period) => {
                const periodData = currentDayData.find(item => item.periodId === period.id) || { 
                  subject: "Free Period", teacher: "N/A", room: "N/A" 
                };
                
                return (
                  <div 
                    key={period.id} 
                    className={`p-4 rounded-lg border ${
                      isBreakOrLunch(periodData.subject) ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                          <Clock className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-medium">{period.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {period.startTime} - {period.endTime}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`mt-3 md:mt-0 flex flex-col md:items-end ${
                        isBreakOrLunch(periodData.subject) ? 'opacity-70' : ''
                      }`}>
                        <h4 className="font-semibold text-lg">
                          {periodData.subject}
                        </h4>
                        {!isBreakOrLunch(periodData.subject) && (
                          <div className="flex items-center gap-x-4">
                            <p className="text-sm">{periodData.teacher}</p>
                            <span className="text-sm text-muted-foreground">Room {periodData.room}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 p-3 bg-muted rounded-md">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Current Term: Spring 2025</span>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm">
                    Print Schedule
                  </Button>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default ClassTimeTable;
