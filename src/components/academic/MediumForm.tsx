
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Medium } from '@/services/mediumService';

const mediumSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

type MediumFormValues = z.infer<typeof mediumSchema>;

interface MediumFormProps {
  initialData: Medium | null;
  onSubmit: (data: MediumFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const MediumForm: React.FC<MediumFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const form = useForm<MediumFormValues>({
    resolver: zodResolver(mediumSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      status: (initialData?.status as 'active' | 'inactive') || 'active',
    },
  });

  const handleSubmit = (data: MediumFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medium Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter medium name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter medium description" 
                  {...field} 
                  value={field.value || ''} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : initialData ? "Update Medium" : "Create Medium"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default MediumForm;
