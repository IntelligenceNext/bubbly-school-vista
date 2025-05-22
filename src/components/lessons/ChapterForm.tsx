
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import FileUpload from '@/components/FileUpload';

// Update schema to match our implementation
const chapterFormSchema = z.object({
  lesson_id: z.string().min(1, 'Lesson is required'),
  chapter_number: z.number().int().min(1, 'Chapter number must be at least 1'),
  chapter_title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  resources: z.array(z.string()).default([]),
  teacher_notes: z.string().optional(),
});

export type ChapterFormValues = z.infer<typeof chapterFormSchema>;

interface ChapterFormProps {
  defaultValues?: Partial<ChapterFormValues>;
  onSubmit: (data: ChapterFormValues) => void;
  isLoading?: boolean;
  lessons?: { id: string; title: string }[];
  lessonId?: string;
}

export function ChapterForm({
  defaultValues = {
    chapter_number: 1,
    chapter_title: '',
    content: '',
    resources: [],
    teacher_notes: '',
  },
  onSubmit,
  isLoading = false,
  lessons = [],
  lessonId,
}: ChapterFormProps) {
  const form = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterFormSchema),
    defaultValues: {
      ...defaultValues,
      lesson_id: lessonId || defaultValues.lesson_id,
    },
  });

  // Updated to handle multiple file uploads
  const handleFileUpload = (url: string) => {
    const currentUrls = form.getValues('resources') || [];
    form.setValue('resources', [...currentUrls, url], { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {!lessonId && (
          <FormField
            control={form.control}
            name="lesson_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related Lesson</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lesson" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="chapter_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chapter Number</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1}
                    placeholder="Enter chapter number" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="chapter_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chapter Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter chapter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chapter Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter chapter content" 
                  {...field} 
                  rows={8}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Resources (PDF, video, link)</FormLabel>
          <FileUpload 
            bucket="attachments"
            onUploadComplete={handleFileUpload}
            acceptedFileTypes={['pdf', 'doc', 'mp4', 'mp3']}
            maxFiles={5}
            maxSizeInMB={50}
          />
        </div>

        <FormField
          control={form.control}
          name="teacher_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Private Teacher Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter notes for teachers only (optional)" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Chapter'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
