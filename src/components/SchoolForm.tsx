
import React from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { School } from '@/services/schoolManagementService';

const schoolSchema = z.object({
  name: z.string().min(2, 'School name must be at least 2 characters'),
  code: z.string().min(2, 'School code must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  description: z.string().optional(),
  enrollment_prefix: z.string().optional(),
  enrollment_base_number: z.number().min(0, 'Base number must be 0 or greater'),
  enrollment_base_padding: z.number().min(1, 'Padding must be at least 1'),
  admission_prefix: z.string().optional(),
  admission_base_number: z.number().min(0, 'Base number must be 0 or greater'),
  admission_base_padding: z.number().min(1, 'Padding must be at least 1'),
});

type SchoolFormValues = z.infer<typeof schoolSchema>;

interface SchoolFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SchoolFormValues) => Promise<void>;
  school?: School | null;
  isLoading?: boolean;
}

const SchoolForm: React.FC<SchoolFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  school,
  isLoading = false,
}) => {
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: school?.name || '',
      code: school?.code || '',
      email: school?.email || '',
      phone: school?.phone || '',
      address: school?.address || '',
      description: school?.description || '',
      enrollment_prefix: school?.enrollment_prefix || '',
      enrollment_base_number: school?.enrollment_base_number || 0,
      enrollment_base_padding: school?.enrollment_base_padding || 6,
      admission_prefix: school?.admission_prefix || '',
      admission_base_number: school?.admission_base_number || 0,
      admission_base_padding: school?.admission_base_padding || 6,
    },
  });

  React.useEffect(() => {
    if (school) {
      form.reset({
        name: school.name,
        code: school.code || '',
        email: school.email,
        phone: school.phone,
        address: school.address,
        description: school.description || '',
        enrollment_prefix: school.enrollment_prefix || '',
        enrollment_base_number: school.enrollment_base_number || 0,
        enrollment_base_padding: school.enrollment_base_padding || 6,
        admission_prefix: school.admission_prefix || '',
        admission_base_number: school.admission_base_number || 0,
        admission_base_padding: school.admission_base_padding || 6,
      });
    } else {
      form.reset({
        name: '',
        code: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        enrollment_prefix: '',
        enrollment_base_number: 0,
        enrollment_base_padding: 6,
        admission_prefix: '',
        admission_base_number: 0,
        admission_base_padding: 6,
      });
    }
  }, [school, form]);

  const handleSubmit = async (data: SchoolFormValues) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {school ? 'Edit School' : 'Add New School'}
          </DialogTitle>
          <DialogDescription>
            Create a new school or edit existing school details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter school name" {...field} />
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
                      <FormLabel>School Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., SCH001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter school description"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="school@example.com" {...field} />
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
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Enrollment Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Enrollment Settings</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="enrollment_prefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prefix</FormLabel>
                      <FormControl>
                        <Input placeholder="ENR" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enrollment_base_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enrollment_base_padding"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Padding</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="6"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 6)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Admission Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Admission Settings</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="admission_prefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prefix</FormLabel>
                      <FormControl>
                        <Input placeholder="ADM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="admission_base_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="admission_base_padding"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Padding</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="6"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 6)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : school ? 'Update School' : 'Add School'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SchoolForm;
