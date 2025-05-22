
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Check, Download, Filter, Plus, RefreshCw, Search, Trophy, Users } from 'lucide-react';

const Participation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedResult, setSelectedResult] = useState('all');
  
  // Mock data for participation records
  const participationRecords = [
    { 
      id: 1, 
      studentName: 'John Doe', 
      studentId: 'S10234', 
      activity: 'Annual Sports Day',
      activityId: 1,
      class: 'Grade 10',
      classId: 10,
      section: 'A',
      teamName: 'Red House',
      result: 'winner',
      certificateIssued: true,
      remarks: 'First place in 100m race'
    },
    { 
      id: 2, 
      studentName: 'Jane Smith', 
      studentId: 'S10235', 
      activity: 'Chess Tournament',
      activityId: 2,
      class: 'Grade 9',
      classId: 9,
      section: 'B',
      teamName: null,
      result: 'participated',
      certificateIssued: true,
      remarks: 'Reached quarterfinals'
    },
    { 
      id: 3, 
      studentName: 'Sam Johnson', 
      studentId: 'S10236', 
      activity: 'Science Exhibition',
      activityId: 3,
      class: 'Grade 11',
      classId: 11,
      section: 'A',
      teamName: 'Team Innovators',
      result: 'runner-up',
      certificateIssued: true,
      remarks: 'Special mention for innovative design'
    },
    { 
      id: 4, 
      studentName: 'Emily Brown', 
      studentId: 'S10237', 
      activity: 'Dance Competition',
      activityId: 4,
      class: 'Grade 10',
      classId: 10,
      section: 'C',
      teamName: null,
      result: 'winner',
      certificateIssued: false,
      remarks: 'Best solo performer'
    },
    { 
      id: 5, 
      studentName: 'Michael Lee', 
      studentId: 'S10238', 
      activity: 'Art Workshop',
      activityId: 5,
      class: 'Grade 8',
      classId: 8,
      section: 'A',
      teamName: null,
      result: 'participated',
      certificateIssued: true,
      remarks: 'Completed all three days of the workshop'
    },
    { 
      id: 6, 
      studentName: 'Sophia Garcia', 
      studentId: 'S10239', 
      activity: 'Debate Club',
      activityId: 6,
      class: 'Grade 11',
      classId: 11,
      section: 'B',
      teamName: 'Team Eloquence',
      result: 'runner-up',
      certificateIssued: true,
      remarks: 'Best speaker award'
    },
  ];

  // Activities data for filtering
  const activities = [
    { id: 1, title: 'Annual Sports Day' },
    { id: 2, title: 'Chess Tournament' },
    { id: 3, title: 'Science Exhibition' },
    { id: 4, title: 'Dance Competition' },
    { id: 5, title: 'Art Workshop' },
    { id: 6, title: 'Debate Club' },
  ];

  // Classes data for filtering
  const classes = [
    { id: 8, name: 'Grade 8' },
    { id: 9, name: 'Grade 9' },
    { id: 10, name: 'Grade 10' },
    { id: 11, name: 'Grade 11' },
    { id: 12, name: 'Grade 12' },
  ];

  // Filter the participation records
  const filteredRecords = participationRecords.filter(record => {
    const matchesSearch = 
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.activity.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActivity = selectedActivity === 'all' || record.activityId === Number(selectedActivity);
    const matchesClass = selectedClass === 'all' || record.classId === Number(selectedClass);
    const matchesResult = selectedResult === 'all' || record.result === selectedResult;
    
    return matchesSearch && matchesActivity && matchesClass && matchesResult;
  });

  // Get result badge based on result value
  const getResultBadge = (result: string) => {
    switch(result) {
      case 'winner':
        return <Badge className="bg-amber-500">Winner</Badge>;
      case 'runner-up':
        return <Badge className="bg-slate-400">Runner-up</Badge>;
      case 'participated':
        return <Badge variant="outline">Participated</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      default:
        return <Badge>{result}</Badge>;
    }
  };

  const handleAddParticipation = () => {
    // This would be implemented to handle adding a new participation record
    console.log('Add participation');
  };

  const handleDownloadCertificates = () => {
    // This would be implemented to handle downloading certificates
    console.log('Download certificates');
  };

  return (
    <PageTemplate title="Activities Management" subtitle="Manage student participation">
      <PageHeader 
        title="Participation Records" 
        description="Track student involvement in activities and events"
        primaryAction={{
          label: "Add Participation",
          onClick: handleAddParticipation,
          icon: <Plus className="h-4 w-4" />,
        }}
        actions={[
          <Button key="download" variant="outline" onClick={handleDownloadCertificates}>
            <Download className="h-4 w-4 mr-2" />
            Certificates
          </Button>
        ]}
      />

      <div className="mt-6 space-y-6">
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search student name, ID, or activity..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select Activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  {activities.map(activity => (
                    <SelectItem key={activity.id} value={activity.id.toString()}>{activity.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedResult} onValueChange={setSelectedResult}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select Result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="winner">Winner</SelectItem>
                  <SelectItem value="runner-up">Runner-up</SelectItem>
                  <SelectItem value="participated">Participated</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="hidden md:table-cell">Activity</TableHead>
                  <TableHead className="hidden lg:table-cell">Class & Section</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead className="hidden md:table-cell">Certificate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.studentName}</p>
                        <p className="text-sm text-muted-foreground">{record.studentId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>
                        <p>{record.activity}</p>
                        {record.teamName && (
                          <p className="text-sm text-muted-foreground">{record.teamName}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {record.class} {record.section}
                    </TableCell>
                    <TableCell>
                      {getResultBadge(record.result)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {record.certificateIssued ? (
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          <Check className="h-3 w-3 mr-1" /> Issued
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-orange-500 text-orange-500">
                          <RefreshCw className="h-3 w-3 mr-1" /> Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">View</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                          <DialogHeader>
                            <DialogTitle>Participation Details</DialogTitle>
                            <DialogDescription>
                              Student and activity participation information
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium">Student Name</p>
                                <p className="text-sm">{record.studentName}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Student ID</p>
                                <p className="text-sm">{record.studentId}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Activity</p>
                                <p className="text-sm">{record.activity}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Class & Section</p>
                                <p className="text-sm">{record.class} {record.section}</p>
                              </div>
                              {record.teamName && (
                                <div>
                                  <p className="text-sm font-medium">Team</p>
                                  <p className="text-sm">{record.teamName}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium">Result</p>
                                <p className="text-sm flex items-center gap-2">
                                  {record.result === 'winner' && <Trophy className="h-4 w-4 text-amber-500" />}
                                  {record.result.charAt(0).toUpperCase() + record.result.slice(1)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Certificate</p>
                                <p className="text-sm">{record.certificateIssued ? 'Issued' : 'Not Issued'}</p>
                              </div>
                            </div>
                            
                            {record.remarks && (
                              <div>
                                <p className="text-sm font-medium">Remarks</p>
                                <p className="text-sm">{record.remarks}</p>
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button variant="outline" size="sm">Edit</Button>
                            {!record.certificateIssued && (
                              <Button size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Generate Certificate
                              </Button>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No participation records found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default Participation;
