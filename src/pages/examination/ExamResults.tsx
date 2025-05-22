
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import { Download, Filter, FileText, UploadCloud } from 'lucide-react';

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

// Mock data for students with results
const studentResults = [
  {
    id: '1',
    student_id: 'ST001',
    student_name: 'Aiden Carter',
    class_name: 'Grade 3',
    exam_name: 'Final Term Examination',
    subject_name: 'Mathematics',
    marks_obtained: 85,
    max_marks: 100,
    percentage: 85,
    grade: 'A',
    result: 'Pass',
    remarks: 'Excellent work',
    date_published: '2023-12-20',
  },
  {
    id: '2',
    student_id: 'ST002',
    student_name: 'Emma Johnson',
    class_name: 'Grade 3',
    exam_name: 'Final Term Examination',
    subject_name: 'Mathematics',
    marks_obtained: 92,
    max_marks: 100,
    percentage: 92,
    grade: 'A+',
    result: 'Pass',
    remarks: 'Outstanding performance',
    date_published: '2023-12-20',
  },
  {
    id: '3',
    student_id: 'ST003',
    student_name: 'Noah Williams',
    class_name: 'Grade 3',
    exam_name: 'Final Term Examination',
    subject_name: 'Mathematics',
    marks_obtained: 35,
    max_marks: 100,
    percentage: 35,
    grade: 'F',
    result: 'Fail',
    remarks: 'Needs significant improvement',
    date_published: '2023-12-20',
  },
  {
    id: '4',
    student_id: 'ST004',
    student_name: 'Olivia Brown',
    class_name: 'Grade 2',
    exam_name: 'Mid Term Assessment',
    subject_name: 'Science',
    marks_obtained: 42,
    max_marks: 50,
    percentage: 84,
    grade: 'A',
    result: 'Pass',
    remarks: 'Good understanding of concepts',
    date_published: '2023-09-01',
  },
  {
    id: '5',
    student_id: 'ST005',
    student_name: 'Liam Davis',
    class_name: 'Grade 2',
    exam_name: 'Mid Term Assessment',
    subject_name: 'Science',
    marks_obtained: 38,
    max_marks: 50,
    percentage: 76,
    grade: 'B',
    result: 'Pass',
    remarks: 'Good effort',
    date_published: '2023-09-01',
  },
  {
    id: '6',
    student_id: 'ST006',
    student_name: 'Sophia Miller',
    class_name: 'Grade 4',
    exam_name: 'First Unit Test',
    subject_name: 'English',
    marks_obtained: 27,
    max_marks: 30,
    percentage: 90,
    grade: 'A+',
    result: 'Pass',
    remarks: 'Excellent language skills',
    date_published: '2023-07-20',
  },
  {
    id: '7',
    student_id: 'ST007',
    student_name: 'Jackson Wilson',
    class_name: 'Grade 4',
    exam_name: 'First Unit Test',
    subject_name: 'English',
    marks_obtained: 18,
    max_marks: 30,
    percentage: 60,
    grade: 'C',
    result: 'Pass',
    remarks: 'Needs to work on grammar',
    date_published: '2023-07-20',
  },
  {
    id: '8',
    student_id: 'ST008',
    student_name: 'Isabella Moore',
    class_name: 'Grade 5',
    exam_name: 'Pre-Board Examination',
    subject_name: 'Mathematics',
    marks_obtained: 88,
    max_marks: 100,
    percentage: 88,
    grade: 'A',
    result: 'Pass',
    remarks: 'Very good performance',
    date_published: '2023-11-25',
  },
  {
    id: '9',
    student_id: 'ST009',
    student_name: 'Lucas Taylor',
    class_name: 'Grade 5',
    exam_name: 'Pre-Board Examination',
    subject_name: 'Mathematics',
    marks_obtained: 31,
    max_marks: 100,
    percentage: 31,
    grade: 'F',
    result: 'Fail',
    remarks: 'Needs to focus more on practice',
    date_published: '2023-11-25',
  },
  {
    id: '10',
    student_id: 'ST010',
    student_name: 'Mia Anderson',
    class_name: 'Grade 5',
    exam_name: 'Pre-Board Examination',
    subject_name: 'Mathematics',
    marks_obtained: 65,
    max_marks: 100,
    percentage: 65,
    grade: 'C',
    result: 'Pass',
    remarks: 'Average performance',
    date_published: '2023-11-25',
  },
];

// Form schema for uploading results
const uploadFormSchema = z.object({
  exam_id: z.string().min(1, 'Please select an exam'),
  class_id: z.string().min(1, 'Please select a class'),
  subject_id: z.string().min(1, 'Please select a subject'),
  result_file: z.any().optional(),
});

const ExamResults = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Initialize form
  const form = useForm<z.infer<typeof uploadFormSchema>>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      exam_id: '',
      class_id: '',
      subject_id: '',
    },
  });

  const onSubmit = (values: z.infer<typeof uploadFormSchema>) => {
    console.log('Form submitted:', values);
    setIsDialogOpen(false);
    form.reset();
  };

  // Filter results based on selection
  const filteredResults = studentResults.filter((result) => {
    if (selectedExam && result.exam_name !== exams.find(e => e.id === selectedExam)?.name) return false;
    if (selectedClass && result.class_name !== classes.find(c => c.id === selectedClass)?.name) return false;
    if (selectedSubject && result.subject_name !== subjects.find(s => s.id === selectedSubject)?.name) return false;
    return true;
  });

  // Define columns for the DataTable with proper typing for column size
  const columns = [
    {
      id: 'student_id',
      header: 'Student ID',
      cell: (row: any) => row.student_id,
      isSortable: true,
      sortKey: 'student_id',
      size: 'sm' as ColumnSize,
    },
    {
      id: 'student_name',
      header: 'Student Name',
      cell: (row: any) => <span className="font-medium">{row.student_name}</span>,
      isSortable: true,
      sortKey: 'student_name',
    },
    {
      id: 'class',
      header: 'Class',
      cell: (row: any) => row.class_name,
      isSortable: true,
      sortKey: 'class_name',
    },
    {
      id: 'exam',
      header: 'Exam',
      cell: (row: any) => row.exam_name,
      isSortable: true,
      sortKey: 'exam_name',
    },
    {
      id: 'subject',
      header: 'Subject',
      cell: (row: any) => row.subject_name,
      isSortable: true,
      sortKey: 'subject_name',
    },
    {
      id: 'marks',
      header: 'Marks',
      cell: (row: any) => (
        <div>
          {row.marks_obtained}/{row.max_marks} ({row.percentage}%)
        </div>
      ),
      isSortable: true,
      sortKey: 'percentage',
    },
    {
      id: 'grade',
      header: 'Grade',
      cell: (row: any) => (
        <span className="font-medium">{row.grade}</span>
      ),
      isSortable: true,
      sortKey: 'grade',
      size: 'sm' as ColumnSize,
    },
    {
      id: 'result',
      header: 'Result',
      cell: (row: any) => (
        <Badge variant={row.result === 'Pass' ? 'default' : 'destructive'}>
          {row.result}
        </Badge>
      ),
      isSortable: true,
      sortKey: 'result',
      size: 'sm' as ColumnSize,
    },
  ];

  // Define actions for the DataTable with proper typing for variants
  const actions = [
    {
      label: 'View Detail',
      onClick: (result: any) => {
        console.log('View result:', result);
      },
    },
    {
      label: 'Download',
      onClick: (result: any) => {
        console.log('Download result:', result);
      },
      variant: 'secondary' as ButtonVariant,
    },
  ];

  return (
    <PageTemplate
      title="Exam Results"
      subtitle="View and manage examination results"
    >
      <div className="space-y-6">
        <PageHeader
          title="Exam Results"
          description="View, filter, and download student examination results"
          primaryAction={{
            label: 'Upload Results',
            onClick: () => setIsDialogOpen(true),
            icon: <UploadCloud className="h-4 w-4" />,
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

              <div className="ml-auto">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              </div>
            </div>

            <DataTable
              data={filteredResults}
              columns={columns}
              keyField="id"
              selectable={true}
              actions={actions}
              bulkActions={[
                {
                  label: 'Download Selected',
                  onClick: (selectedResults) =>
                    console.log('Download selected:', selectedResults),
                  variant: 'secondary' as ButtonVariant,
                },
              ]}
            />
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload Exam Results</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
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

                <FormField
                  control={form.control}
                  name="result_file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Result File</FormLabel>
                      <FormControl>
                        <Input type="file" accept=".csv,.xlsx,.xls" />
                      </FormControl>
                      <FormDescription>
                        Upload a CSV or Excel file with student results. 
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a href="#" className="ml-1">
                            Download template
                          </a>
                        </Button>
                      </FormDescription>
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
                  <Button type="submit">Upload Results</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </PageTemplate>
  );
};

export default ExamResults;
