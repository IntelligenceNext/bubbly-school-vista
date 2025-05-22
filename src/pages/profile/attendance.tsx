import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export type AttendanceStatus = "present" | "absent" | "late" | "half-day" | "leave" | "weekend";

interface AttendanceRecord {
  date: Date;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
}

interface LeaveRequest {
  id: string;
  type: string;
  status: 'approved' | 'pending' | 'rejected';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  appliedOn: Date;
}

const AttendancePage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  const leaveForm = useForm({
    defaultValues: {
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: ''
    }
  });
  
  // Mock attendance data
  const attendanceData: AttendanceRecord[] = [
    { date: new Date(2023, 4, 1), status: 'present', checkIn: '08:55', checkOut: '17:05' },
    { date: new Date(2023, 4, 2), status: 'present', checkIn: '09:02', checkOut: '17:00' },
    { date: new Date(2023, 4, 3), status: 'late', checkIn: '09:35', checkOut: '17:15' },
    { date: new Date(2023, 4, 4), status: 'absent' },
    { date: new Date(2023, 4, 5), status: 'present', checkIn: '08:50', checkOut: '17:10' },
    { date: new Date(2023, 4, 6), status: 'weekend' },
    { date: new Date(2023, 4, 7), status: 'weekend' },
    { date: new Date(2023, 4, 8), status: 'present', checkIn: '08:58', checkOut: '17:05' },
    { date: new Date(2023, 4, 9), status: 'present', checkIn: '09:01', checkOut: '17:00' },
    { date: new Date(2023, 4, 10), status: 'present', checkIn: '08:45', checkOut: '16:55' },
    { date: new Date(2023, 4, 11), status: 'half-day', checkIn: '08:50', checkOut: '13:30' },
    { date: new Date(2023, 4, 12), status: 'present', checkIn: '08:55', checkOut: '17:02' },
    { date: new Date(2023, 4, 13), status: 'weekend' },
    { date: new Date(2023, 4, 14), status: 'weekend' },
    { date: new Date(2023, 4, 15), status: 'leave' },
    { date: new Date(2023, 4, 16), status: 'leave' },
    { date: new Date(2023, 4, 17), status: 'leave' },
    { date: new Date(2023, 4, 18), status: 'present', checkIn: '08:48', checkOut: '17:05' },
    { date: new Date(2023, 4, 19), status: 'present', checkIn: '08:53', checkOut: '17:10' },
    { date: new Date(2023, 4, 20), status: 'weekend' },
    { date: new Date(2023, 4, 21), status: 'weekend' },
    { date: new Date(2023, 4, 22), status: 'present', checkIn: '09:05', checkOut: '17:00' },
  ];
  
  // Mock leave data
  const leaveRequests: LeaveRequest[] = [
    {
      id: 'leave1',
      type: 'Casual Leave',
      status: 'approved',
      startDate: new Date(2023, 4, 15),
      endDate: new Date(2023, 4, 17),
      days: 3,
      reason: 'Family function',
      appliedOn: new Date(2023, 4, 8)
    },
    {
      id: 'leave2',
      type: 'Sick Leave',
      status: 'approved',
      startDate: new Date(2023, 3, 5),
      endDate: new Date(2023, 3, 6),
      days: 2,
      reason: 'Not feeling well, fever',
      appliedOn: new Date(2023, 3, 4)
    },
    {
      id: 'leave3',
      type: 'Casual Leave',
      status: 'pending',
      startDate: new Date(2023, 5, 10),
      endDate: new Date(2023, 5, 12),
      days: 3,
      reason: 'Personal work',
      appliedOn: new Date(2023, 4, 20)
    }
  ];
  
  // Mock leave balance
  const leaveBalance = {
    casual: { total: 12, used: 6, balance: 6 },
    sick: { total: 10, used: 2, balance: 8 },
    earned: { total: 15, used: 0, balance: 15 }
  };
  
  const onLeaveSubmit = (data: any) => {
    console.log('Leave request data:', data);
    toast({
      title: "Leave request submitted",
      description: "Your leave request has been submitted for approval.",
    });
    leaveForm.reset();
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="success">Present</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'late':
        return <Badge variant="warning">Late</Badge>;
      case 'half-day':
        return <Badge>Half Day</Badge>;
      case 'leave':
        return <Badge variant="outline">Leave</Badge>;
      default:
        return null;
    }
  };
  
  const getLeaveBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };
  
  const renderSummary = () => {
    const present = attendanceData.filter(a => a.status === 'present').length;
    const absent = attendanceData.filter(a => a.status === 'absent').length;
    const late = attendanceData.filter(a => a.status === 'late').length;
    const leave = attendanceData.filter(a => a.status === 'leave').length;
    const halfDay = attendanceData.filter(a => a.status === 'half-day').length;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Present
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{present}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <XCircle className="mr-2 h-4 w-4 text-red-600" />
              Absent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{absent}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Clock className="mr-2 h-4 w-4 text-amber-600" />
              Late
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{late}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <FileText className="mr-2 h-4 w-4 text-blue-600" />
              Leave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{leave}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <AlertCircle className="mr-2 h-4 w-4 text-purple-600" />
              Half Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{halfDay}</p>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <PageTemplate title="Attendance & Leave" subtitle="View your attendance records and manage leave requests">
      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave-requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="leave-balance">Leave Balance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="space-y-6">
          {renderSummary()}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Attendance</CardTitle>
                <CardDescription>View and track your attendance for the month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between mb-4">
                    <Select
                      value={selectedMonth.toString()}
                      onValueChange={(value) => setSelectedMonth(parseInt(value))}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">January</SelectItem>
                        <SelectItem value="1">February</SelectItem>
                        <SelectItem value="2">March</SelectItem>
                        <SelectItem value="3">April</SelectItem>
                        <SelectItem value="4">May</SelectItem>
                        <SelectItem value="5">June</SelectItem>
                        <SelectItem value="6">July</SelectItem>
                        <SelectItem value="7">August</SelectItem>
                        <SelectItem value="8">September</SelectItem>
                        <SelectItem value="9">October</SelectItem>
                        <SelectItem value="10">November</SelectItem>
                        <SelectItem value="11">December</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={selectedYear.toString()}
                      onValueChange={(value) => setSelectedYear(parseInt(value))}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Daily Records</CardTitle>
                <CardDescription>Attendance records for this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-auto">
                  {attendanceData.map((record, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{format(record.date, 'dd MMM yyyy')}</p>
                        {record.checkIn && record.checkOut && (
                          <p className="text-sm text-muted-foreground">
                            {record.checkIn} - {record.checkOut}
                          </p>
                        )}
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="leave-requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Leave Requests</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Apply for Leave</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Apply for Leave</DialogTitle>
                      <DialogDescription>
                        Fill in the details to submit your leave application.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...leaveForm}>
                      <form onSubmit={leaveForm.handleSubmit(onLeaveSubmit)} className="space-y-4">
                        <FormField
                          control={leaveForm.control}
                          name="leaveType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Leave Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select leave type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="casual">Casual Leave</SelectItem>
                                  <SelectItem value="sick">Sick Leave</SelectItem>
                                  <SelectItem value="earned">Earned Leave</SelectItem>
                                  <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={leaveForm.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={leaveForm.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={leaveForm.control}
                          name="reason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reason for Leave</FormLabel>
                              <FormControl>
                                <Textarea rows={3} placeholder="Please provide a reason for your leave request" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button type="submit" className="w-full">Submit Leave Request</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
              <CardDescription>
                View and manage your leave applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">From</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">To</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Days</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Applied On</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {leaveRequests.map((leave) => (
                        <tr key={leave.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle font-medium">{leave.type}</td>
                          <td className="p-4 align-middle">{format(leave.startDate, 'dd MMM yyyy')}</td>
                          <td className="p-4 align-middle">{format(leave.endDate, 'dd MMM yyyy')}</td>
                          <td className="p-4 align-middle">{leave.days}</td>
                          <td className="p-4 align-middle">{format(leave.appliedOn, 'dd MMM yyyy')}</td>
                          <td className="p-4 align-middle">
                            {getLeaveBadge(leave.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leave-balance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Casual Leave</CardTitle>
                <CardDescription>Regular personal leaves</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium">{leaveBalance.casual.total} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Used</span>
                    <span className="font-medium">{leaveBalance.casual.used} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balance</span>
                    <span className="font-bold">{leaveBalance.casual.balance} days</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${(leaveBalance.casual.used / leaveBalance.casual.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sick Leave</CardTitle>
                <CardDescription>Medical and health-related leaves</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium">{leaveBalance.sick.total} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Used</span>
                    <span className="font-medium">{leaveBalance.sick.used} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balance</span>
                    <span className="font-bold">{leaveBalance.sick.balance} days</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${(leaveBalance.sick.used / leaveBalance.sick.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Earned Leave</CardTitle>
                <CardDescription>Accumulated leaves based on service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium">{leaveBalance.earned.total} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Used</span>
                    <span className="font-medium">{leaveBalance.earned.used} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balance</span>
                    <span className="font-bold">{leaveBalance.earned.balance} days</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${(leaveBalance.earned.used / leaveBalance.earned.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Leave Policy</CardTitle>
              <CardDescription>Information about the organization's leave policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Casual Leave</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>12 days per year, non-accumulating</li>
                    <li>Maximum 3 consecutive days</li>
                    <li>Requires approval 2 days in advance except for emergencies</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Sick Leave</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>10 days per year</li>
                    <li>Medical certificate required for more than 2 consecutive days</li>
                    <li>Can be clubbed with casual leave if needed</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Earned Leave</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>15 days per year, accumulating up to 45 days</li>
                    <li>Minimum 7 days notice required</li>
                    <li>Subject to management approval based on workload</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};

export default AttendancePage;
