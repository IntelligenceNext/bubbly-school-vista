
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
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([
    { id: 1, name: 'Sports', description: 'Physical activities and competitions', status: 'active', activitiesCount: 6 },
    { id: 2, name: 'Arts', description: 'Visual and performing arts activities', status: 'active', activitiesCount: 3 },
    { id: 3, name: 'Cultural', description: 'Activities related to culture and tradition', status: 'active', activitiesCount: 4 },
    { id: 4, name: 'Academic', description: 'Learning and knowledge-based competitions', status: 'active', activitiesCount: 5 },
    { id: 5, name: 'Clubs', description: 'Interest-based student groups', status: 'active', activitiesCount: 2 },
    { id: 6, name: 'Social', description: 'Community service and social events', status: 'inactive', activitiesCount: 1 }
  ]);
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form for adding/editing categories
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      status: 'active'
    }
  });

  React.useEffect(() => {
    if (editingCategory) {
      form.reset({
        name: editingCategory.name,
        description: editingCategory.description,
        status: editingCategory.status
      });
    }
  }, [editingCategory, form]);

  React.useEffect(() => {
    // Filter categories based on search term
    const filtered = categories.filter(
      category => category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const handleAddCategory = (data: any) => {
    const newCategory = {
      id: categories.length + 1,
      name: data.name,
      description: data.description,
      status: data.status || 'active',
      activitiesCount: 0
    };
    
    setCategories([...categories, newCategory]);
    form.reset();
    setIsAddDialogOpen(false);
  };

  const handleUpdateCategory = (data: any) => {
    const updatedCategories = categories.map(cat => 
      cat.id === editingCategory.id ? { ...cat, ...data } : cat
    );
    
    setCategories(updatedCategories);
    setEditingCategory(null);
    form.reset();
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const openAddDialog = () => {
    form.reset({
      name: '',
      description: '',
      status: 'active'
    });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (category: any) => {
    setEditingCategory(category);
  };
  
  return (
    <PageTemplate title="Activities Management" subtitle="Manage activity categories">
      <PageHeader 
        title="Activity Categories" 
        description="Define and organize types of extracurricular activities"
        primaryAction={{
          label: "Add Category",
          onClick: openAddDialog,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <div className="mt-6 space-y-6">
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <div className="relative w-full sm:w-auto sm:flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Activities</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{category.description}</TableCell>
                    <TableCell>
                      {category.status === 'active' ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{category.activitiesCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={category.activitiesCount > 0}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredCategories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No categories found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category for organizing activities.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddCategory)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
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
                      <Textarea placeholder="Brief description of this category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel>Status:</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Label className="flex items-center gap-1">
                          <input
                            type="radio"
                            value="active"
                            checked={field.value === 'active'}
                            onChange={() => field.onChange('active')}
                          />
                          Active
                        </Label>
                        <Label className="flex items-center gap-1">
                          <input
                            type="radio"
                            value="inactive"
                            checked={field.value === 'inactive'}
                            onChange={() => field.onChange('inactive')}
                          />
                          Inactive
                        </Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Category</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category details.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateCategory)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
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
                      <Textarea placeholder="Brief description of this category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel>Status:</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Label className="flex items-center gap-1">
                          <input
                            type="radio"
                            value="active"
                            checked={field.value === 'active'}
                            onChange={() => field.onChange('active')}
                          />
                          Active
                        </Label>
                        <Label className="flex items-center gap-1">
                          <input
                            type="radio"
                            value="inactive"
                            checked={field.value === 'inactive'}
                            onChange={() => field.onChange('inactive')}
                          />
                          Inactive
                        </Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Update Category</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default Categories;
