
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateSectionRequest, SectionCapacityView } from '@/services/sectionService';
import { getClasses } from '@/services/classService';
import { getStaff, Staff } from '@/services/staffService';

const sectionSchema = z.object({
  class_id: z.string().min(1, 'Class is required'),
  section_name: z.string().min(1, 'Section name is required'),
  teacher_id: z.string().optional(),
  medium: z.string().min(1, 'Medium is required'),
  total_capacity: z.number().min(1, 'Capacity must be at least 1'),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

interface SectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSectionRequest) => Promise<void>;
  section?: SectionCapacityView | null;
  isLoading?: boolean;
}

const SectionForm: React.FC<SectionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  section,
  isLoading = false,
}) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<Staff[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      class_id: section?.class_id || '',
      section_name: section?.section_name || '',
      teacher_id: section?.teacher_id || undefined,
      medium: section?.medium || 'English',
      total_capacity: section?.total_capacity || 30,
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (section) {
      form.reset({
        class_id: section.class_id,
        section_name: section.section_name,
        teacher_id: section.teacher_id || "none",
        medium: section.medium,
        total_capacity: section.total_capacity,
      });
    } else {
      form.reset({
        class_id: '',
        section_name: '',
        teacher_id: "none",
        medium: 'English',
        total_capacity: 30,
      });
    }
  }, [section, form]);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const [classesData, staffData] = await Promise.all([
        getClasses(),
        getStaff()
      ]);
      
      setClasses(classesData);
      // Filter staff to only include teachers
      const teacherStaff = staffData.filter(staff => 
        staff.status === 'Active' && 
        (staff.role?.toLowerCase().includes('teacher') || staff.designation?.toLowerCase().includes('teacher'))
      );
      setTeachers(teacherStaff);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (data: SectionFormValues) => {
    // Ensure all required fields are present and properly typed
    const sectionData: CreateSectionRequest = {
      class_id: data.class_id!,
      section_name: data.section_name!,
      teacher_id: data.teacher_id === "none" ? undefined : data.teacher_id,
      medium: data.medium!,
      total_capacity: data.total_capacity!,
    };
    
    await onSubmit(sectionData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {section ? 'Edit Section' : 'Add New Section'}
          </DialogTitle>
          <DialogDescription>
            Create a new section for a class or edit existing section details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="class_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingData}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingData ? "Loading classes..." : "Select class"} />
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
              name="section_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., A, B, Alpha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teacher_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Teacher</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || "none"} disabled={isLoadingData}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingData ? "Loading teachers..." : "Select teacher (optional)"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No teacher assigned</SelectItem>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name} - {teacher.designation || 'Teacher'}
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
              name="medium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medium *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select medium" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Regional">Regional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="total_capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Capacity *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="30" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || isLoadingData}>
                {isLoading ? 'Saving...' : section ? 'Update Section' : 'Add Section'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SectionForm;
