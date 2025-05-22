
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Route } from '@/services/transportationService';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const routeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
});

type RouteFormValues = z.infer<typeof routeSchema>;
type RouteFormProps = {
  initialData: Route | null;
  onSubmit: (data: RouteFormValues) => void;
  onCancel: () => void;
};

const RouteForm: React.FC<RouteFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      status: initialData?.status || 'active',
    },
  });

  const handleSubmit = (data: RouteFormValues) => {
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
              <FormLabel>Route Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter route name" {...field} />
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
                  placeholder="Enter route description" 
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
                defaultValue={field.value}
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Route" : "Create Route"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default RouteForm;
