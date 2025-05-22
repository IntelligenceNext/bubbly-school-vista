import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import PageTemplate from '@/components/PageTemplate';
import { School, getSchoolById, updateSchool } from '@/services/schoolManagementService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Pencil } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import FileUpload from '@/components/FileUpload';
import { cn } from '@/lib/utils';

const schoolSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

type SchoolFormValues = z.infer<typeof schoolSchema>;

const Settings = () => {
  const [school, setSchool] = useState<School | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const schoolId = localStorage.getItem('schoolId');

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: '',
      code: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const { data: schoolData, isLoading, refetch } = useQuery({
    queryKey: ['school', schoolId],
    queryFn: () => getSchoolById(schoolId as string),
    enabled: !!schoolId,
  });

  useEffect(() => {
    if (schoolData) {
      setSchool(schoolData);
      form.reset({
        name: schoolData.name,
        code: schoolData.code,
        email: schoolData.email || '',
        phone: schoolData.phone || '',
        address: schoolData.address || '',
      });
    }
  }, [schoolData, form]);

  const onSubmit = async (data: SchoolFormValues) => {
    try {
      if (!schoolId) {
        toast({
          title: 'Error',
          description: 'School ID not found in local storage',
          variant: 'destructive',
        });
        return;
      }

      const updatedSchool = await updateSchool(schoolId, {
        name: data.name,
        code: data.code,
        email: data.email,
        phone: data.phone,
        address: data.address,
      });

      if (updatedSchool) {
        setSchool(updatedSchool);
        setIsEditing(false);
        toast({
          title: 'School updated',
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update school',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleLogoUpload = async (path: string) => {
    if (!schoolId) {
      toast({
        title: 'Error',
        description: 'School ID not found in local storage',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase
        .from('schools')
        .update({
          logo_url: path,
          updated_at: new Date().toISOString(),
        })
        .eq('id', schoolId);

      if (error) throw error;
      
      toast({
        title: 'Logo updated',
        description: 'School logo has been updated successfully.',
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error updating logo',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!school) {
    return <div>School not found</div>;
  }

  return (
    <PageTemplate title="School Settings" subtitle="Manage school details">
      <div className="space-y-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                School Information
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Manage your school's basic information.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-4 rounded-md shadow-sm">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Name</FormLabel>
                      <FormControl>
                        <Input disabled={!isEditing} placeholder="School Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Code</FormLabel>
                      <FormControl>
                        <Input disabled={!isEditing} placeholder="Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!isEditing}
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!isEditing}
                          placeholder="Phone"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!isEditing}
                          placeholder="Address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="ghost" onClick={() => {
                        setIsEditing(false);
                        form.reset({
                          name: school.name,
                          code: school.code,
                          email: school.email || '',
                          phone: school.phone || '',
                          address: school.address || '',
                        });
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit">Save</Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>

        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                School Logo
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Upload or update your school's logo.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="mt-2">
                <FileUpload
                  bucket="school_logos"
                  maxSize={2}
                  acceptedFileTypes={["image/*"]}
                  onUploadComplete={handleLogoUpload}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Settings;
