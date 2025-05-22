
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DataTable, { ColumnSize, ButtonVariant } from '@/components/DataTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Plus, Filter, Trash, Edit } from 'lucide-react';

// Mock data for exams
const exams = [
  { id: '1', name: 'Final Term Examination' },
  { id: '2', name: 'Mid Term Assessment' },
  { id: '3', name: 'First Unit Test' },
  { id: '4', name: 'Pre-Board Examination' },
];

// Mock data for classes
const classes = [
  { id: '1', name: 'Grade 1' },
  { id: '2', name: 'Grade 2' },
  { id: '3', name: 'Grade 3' },
  { id: '4', name: 'Grade 4' },
  { id: '5', name: 'Grade 5' },
];

// Mock data for subjects
const subjects = [
  { id: '1', name: 'Mathematics', code: 'MATH' },
  { id: '2', name: 'Science', code: 'SCI' },
  { id: '3', name: 'English', code: 'ENG' },
  { id: '4', name: 'Social Studies', code: 'SOC' },
  { id: '5', name: 'Computer', code: 'COMP' },
];

// Mock data for exam groups
const examGroups = [
  {
    id: '1',
    name: 'Math Final - Grade 3',
    exam_id: '1',
    exam_name: 'Final Term Examination',
    class_id: '3',
    class_name: 'Grade 3',
    subject_id: '1',
    subject_name: 'Mathematics',
    date: '2023-12-10',
    start_time: '09:00',
    end_time: '11:00',
    room: 'Hall A',
    max_marks: 100,
    passing_marks: 40,
    instructions: 'No calculators allowed. Answer all questions.',
  },
  {
    id: '2',
    name: 'Science Mid - Grade 2',
    exam_id: '2',
    exam_name: 'Mid Term Assessment',
    class_id: '2',
    class_name: 'Grade 2',
    subject_id: '2',
    subject_name: 'Science',
    date: '2023-08-20',
    start_time: '10:00',
    end_time: '11:30',
    room: 'Lab 1',
    max_marks: 50,
    passing_marks: 20,
    instructions: 'Write neatly and answer all questions.',
  },
  {
    id: '3',
    name: 'English Unit Test - Grade 4',
    exam_id: '3',
    exam_name: 'First Unit Test',
    class_id: '4',
    class_name: 'Grade 4',
    subject_id: '3',
    subject_name: 'English',
    date: '2023-07-12',
    start_time: '09:30',
    end_time: '10:30',
    room: 'Room 7',
    max_marks: 30,
    passing_marks: 12,
    instructions: 'Answer in complete sentences.',
  },
  {
    id: '4',
    name: 'Maths Pre-Board - Grade 5',
    exam_id: '4',
    exam_name: 'Pre-Board Examination',
    class_id: '5',
    class_name: 'Grade 5',
    subject_id: '1',
    subject_name: 'Mathematics',
    date: '2023-11-15',
    start_time: '09:00',
    end_time: '12:00',
    room: 'Hall B',
    max_marks: 100,
    passing_marks: 35,
    instructions:
      'Answer all questions. Show your work for all problems. Use blue or black pen only.',
  },
];

// Form schema for creating and editing exam groups
const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  exam_id: z.string().min(1, 'Please select an exam'),
  class_id: z.string().min(1, 'Please select a class'),
  subject_id: z.string().min(1, 'Please select a subject'),
  date: z.string().min(1, 'Please enter a date'),
  start_time: z.string().min(1, 'Please enter start time'),
  end_time: z.string().min(1, 'Please enter end time'),
  room: z.string().min(1, 'Please enter a room'),
  max_marks: z.number().min(1, 'Marks must be at least 1'),
  passing_marks: z.number().min(1, 'Passing marks must be at least 1'),
  instructions: z.string().optional(),
});

const ManageGroups = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      exam_id: '',
      class_id: '',
      subject_id: '',
      date: '',
      start_time: '09:00',
      end_time: '11:00',
      room: '',
      max_marks: 100, // Fixed: This is now a number, not a string
      passing_marks: 40, // Fixed: This is now a number, not a string
      instructions: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted:', values);
    setIsDialogOpen(false);
    form.reset();
  };

  // Filter groups based on selection
  const filteredGroups = examGroups.filter((group) => {
    if (selectedExam && group.exam_id !== selectedExam) return false;
    if (selectedClass && group.class_id !== selectedClass) return false;
    if (selectedSubject && group.subject_id !== selectedSubject) return false;
    return true;
  });

  // Define columns for the DataTable with proper type for size
  const columns = [
    {
      id: 'name',
      header: 'Group Name',
      cell: (group: any) => <span className="font-medium">{group.name}</span>,
      isSortable: true,
      sortKey: 'name',
    },
    {
      id: 'exam',
      header: 'Exam',
      cell: (group: any) => group.exam_name,
      isSortable: true,
      sortKey: 'exam_name',
    },
    {
      id: 'class',
      header: 'Class',
      cell: (group: any) => group.class_name,
      isSortable: true,
      sortKey: 'class_name',
    },
    {
      id: 'subject',
      header: 'Subject',
      cell: (group: any) => group.subject_name,
      isSortable: true,
      sortKey: 'subject_name',
    },
    {
      id: 'schedule',
      header: 'Schedule',
      cell: (group: any) => (
        <div>
          <div>{group.date}</div>
          <div className="text-sm text-gray-500">
            {group.start_time} - {group.end_time}
          </div>
        </div>
      ),
      isSortable: true,
      sortKey: 'date',
    },
    {
      id: 'room',
      header: 'Room',
      cell: (group: any) => group.room,
      isSortable: true,
      sortKey: 'room',
    },
    {
      id: 'marks',
      header: 'Marks',
      cell: (group: any) => (
        <div>
          <div>Max: {group.max_marks}</div>
          <div className="text-sm text-gray-500">
            Pass: {group.passing_marks}
          </div>
        </div>
      ),
      isSortable: false,
      size: 'sm' as ColumnSize,
    },
  ];

  // Define actions for the DataTable with proper typing for variant
  const actions = [
    {
      label: 'Edit Group',
      onClick: (group: any) => {
        console.log('Edit group:', group);
      },
    },
    {
      label: 'Delete',
      onClick: (group: any) => {
        console.log('Delete group:', group);
      },
      variant: 'destructive' as ButtonVariant,
    },
  ];

  return (
    <PageTemplate
      title="Exam Groups"
      subtitle="Create and manage examination groups"
    >
      <div className="space-y-6">
        <PageHeader
          title="Exam Groups"
          description="Schedule exams for specific classes and subjects"
          primaryAction={{
            label: 'Create New Group',
            onClick: () => setIsDialogOpen(true),
            icon: <Plus className="h-4 w-4" />,
          }}
        />

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="w-full sm:w-auto">
                <Select
                  value={selectedExam || ''}
                  onValueChange={(value) =>
                    setSelectedExam(value === 'all' ? null : value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exams</SelectItem>
                    {exams.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-auto">
                <Select
                  value={selectedClass || ''}
                  onValueChange={(value) =>
                    setSelectedClass(value === 'all' ? null : value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by Class" />
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

              <div className="w-full sm:w-auto">
                <Select
                  value={selectedSubject || ''}
                  onValueChange={(value) =>
                    setSelectedSubject(value === 'all' ? null : value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DataTable
              data={filteredGroups}
              columns={columns}
              keyField="id"
              selectable={true}
              actions={actions}
              bulkActions={[
                {
                  label: 'Delete Selected',
                  onClick: (selectedGroups) =>
                    console.log('Delete selected:', selectedGroups),
                  variant: 'destructive' as ButtonVariant,
                },
              ]}
            />
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Exam Group</DialogTitle>
              <DialogDescription>
                Schedule an exam for a specific class and subject.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Mathematics Final - Grade 3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="exam_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exam</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select exam" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {exams.map((exam) => (
                              <SelectItem key={exam.id} value={exam.id}>
                                {exam.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="class_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classes.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="start_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="room"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Hall A"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="max_marks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Marks</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 100"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="passing_marks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passing Marks</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 40"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter instructions for students"
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Group</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </PageTemplate>
  );
};

export default ManageGroups;
