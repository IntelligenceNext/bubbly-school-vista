
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import DataTable, { Column } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { StudentType, getStudentTypes, createStudentType, updateStudentType, deleteStudentType } from '@/services/studentTypeService';
import StudentTypeForm from '@/components/academic/StudentTypeForm';
import { useUserSchool } from '@/hooks/useAuth';

const StudentTypePage = () => {
  const [isStudentTypeDialogOpen, setIsStudentTypeDialogOpen] = useState(false);
  const [editingStudentType, setEditingStudentType] = useState<StudentType | null>(null);
  const [selectedStudentType, setSelectedStudentType] = useState<StudentType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { currentSchoolId, isLoading: isSchoolLoading } = useUserSchool();

  const { data: studentTypes = [], isLoading } = useQuery({
    queryKey: ['studentTypes'],
    queryFn: getStudentTypes,
  });

  const createStudentTypeMutation = useMutation({
    mutationFn: createStudentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentTypes'] });
      toast({
        title: 'Success',
        description: 'Student type created successfully.',
      });
      setIsStudentTypeDialogOpen(false);
      setEditingStudentType(null);
    },
    onError: (error: any) => {
      console.error('Create student type error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create student type.',
        variant: 'destructive',
      });
    },
  });

  const updateStudentTypeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateStudentType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentTypes'] });
      toast({
        title: 'Success',
        description: 'Student type updated successfully.',
      });
      setIsStudentTypeDialogOpen(false);
      setEditingStudentType(null);
    },
    onError: (error: any) => {
      console.error('Update student type error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update student type.',
        variant: 'destructive',
      });
    },
  });

  const deleteStudentTypeMutation = useMutation({
    mutationFn: deleteStudentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentTypes'] });
      toast({
        title: 'Success',
        description: 'Student type deleted successfully.',
      });
      setIsDeleteDialogOpen(false);
      setSelectedStudentType(null);
    },
    onError: (error: any) => {
      console.error('Delete student type error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete student type.',
        variant: 'destructive',
      });
    },
  });

  const columns: Column<StudentType>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (studentType) => <span className="font-medium">{studentType.name}</span>,
      isSortable: true,
      sortKey: 'name',
    },
    {
      id: 'description',
      header: 'Description',
      cell: (studentType) => <span>{studentType.description || 'No description'}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (studentType) => (
        <Badge variant={studentType.status === 'active' ? 'success' : 'secondary'}>
          {studentType.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'created_at',
      header: 'Created',
      cell: (studentType) => <span>{format(new Date(studentType.created_at), 'MMM d, yyyy')}</span>,
    },
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (studentType: StudentType) => handleEditStudentType(studentType),
    },
    {
      label: 'Delete',
      onClick: (studentType: StudentType) => {
        setSelectedStudentType(studentType);
        setIsDeleteDialogOpen(true);
      },
      variant: 'destructive' as const,
    },
  ];

  const handleCreateStudentType = () => {
    if (!currentSchoolId) {
      toast({
        title: 'Error',
        description: 'No school assigned. Please contact your administrator.',
        variant: 'destructive',
      });
      return;
    }
    setEditingStudentType(null);
    setIsStudentTypeDialogOpen(true);
  };

  const handleEditStudentType = (studentType: StudentType) => {
    setEditingStudentType(studentType);
    setIsStudentTypeDialogOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    console.log('Form submitted with data:', data);
    
    if (!currentSchoolId) {
      toast({
        title: 'Error',
        description: 'No school assigned. Please contact your administrator.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingStudentType) {
        await updateStudentTypeMutation.mutateAsync({
          id: editingStudentType.id,
          data,
        });
      } else {
        const studentTypeData = {
          ...data,
          school_id: currentSchoolId,
        };
        console.log('Creating student type with data:', studentTypeData);
        await createStudentTypeMutation.mutateAsync(studentTypeData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleDeleteStudentType = async () => {
    if (!selectedStudentType) return;
    deleteStudentTypeMutation.mutate(selectedStudentType.id);
  };

  const handleDialogClose = () => {
    setIsStudentTypeDialogOpen(false);
    setEditingStudentType(null);
  };

  if (isSchoolLoading) {
    return (
      <PageTemplate title="Manage Student Type" subtitle="Configure student types and categories">
        <div className="flex items-center justify-center py-10">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </div>
      </PageTemplate>
    );
  }

  if (!currentSchoolId) {
    return (
      <PageTemplate title="Manage Student Type" subtitle="Configure student types and categories">
        <div className="flex items-center justify-center py-10">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600">No School Assigned</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You are not assigned to any school. Please contact your administrator.
            </p>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title="Manage Student Type" subtitle="Configure student types and categories">
      <PageHeader
        title="Student Types"
        description="Configure various student types and categories"
        primaryAction={{
          label: "Add Student Type",
          onClick: handleCreateStudentType,
          icon: <Plus className="h-4 w-4 mr-2" />,
        }}
      />

      <DataTable
        data={studentTypes}
        columns={columns}
        keyField="id"
        isLoading={isLoading}
        actions={actions}
        emptyState={
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No student types found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new student type to get started.
            </p>
            <Button className="mt-4" onClick={handleCreateStudentType}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student Type
            </Button>
          </div>
        }
      />

      <Dialog open={isStudentTypeDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingStudentType ? "Edit Student Type" : "Add New Student Type"}
            </DialogTitle>
          </DialogHeader>
          <StudentTypeForm
            initialData={editingStudentType}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
            isLoading={createStudentTypeMutation.isPending || updateStudentTypeMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedStudentType?.name}</span>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteStudentType}
              disabled={deleteStudentTypeMutation.isPending}
            >
              {deleteStudentTypeMutation.isPending ? 'Deleting...' : 'Delete Student Type'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default StudentTypePage;
