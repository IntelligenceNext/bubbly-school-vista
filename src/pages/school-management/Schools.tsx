
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { School, getSchools, createSchool, updateSchool, deleteSchool } from '@/services/schoolManagementService';
import SchoolForm from '@/components/SchoolForm';
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog';

const Schools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);

  const queryClient = useQueryClient();

  // Fetch schools
  const { data: schoolsResponse, isLoading, error } = useQuery({
    queryKey: ['schools', searchTerm],
    queryFn: () => getSchools({ 
      page: 1, 
      pageSize: 100,
      search: searchTerm || undefined 
    }),
  });

  // Create school mutation
  const createMutation = useMutation({
    mutationFn: createSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      setIsFormOpen(false);
      setSelectedSchool(null);
      toast({
        title: 'School created',
        description: 'The school has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating school',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    },
  });

  // Update school mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<School> }) =>
      updateSchool(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      setIsFormOpen(false);
      setSelectedSchool(null);
      toast({
        title: 'School updated',
        description: 'The school has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating school',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    },
  });

  // Delete school mutation
  const deleteMutation = useMutation({
    mutationFn: deleteSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      setIsDeleteDialogOpen(false);
      setSchoolToDelete(null);
      toast({
        title: 'School deleted',
        description: 'The school has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting school',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    },
  });

  const handleCreateSchool = async (data: any) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdateSchool = async (data: any) => {
    if (selectedSchool) {
      await updateMutation.mutateAsync({ id: selectedSchool.id, data });
    }
  };

  const handleDeleteSchool = async () => {
    if (schoolToDelete) {
      await deleteMutation.mutateAsync(schoolToDelete.id);
    }
  };

  const openEditForm = (school: School) => {
    setSelectedSchool(school);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setSelectedSchool(null);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (school: School) => {
    setSchoolToDelete(school);
    setIsDeleteDialogOpen(true);
  };

  const schools = schoolsResponse?.data || [];

  if (error) {
    return (
      <PageTemplate title="Schools" subtitle="Manage educational institutions">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading schools: {(error as Error).message}</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title="Schools" subtitle="Manage educational institutions">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={openCreateForm} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add School
          </Button>
        </div>

        {/* Schools Table */}
        <Card>
          <CardHeader>
            <CardTitle>Schools ({schools.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading schools...</div>
            ) : schools.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No schools found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Enrollment</TableHead>
                    <TableHead>Admission</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell>
                        {school.code && (
                          <Badge variant="outline">{school.code}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{school.email}</div>
                          <div className="text-gray-500">{school.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {school.address}
                      </TableCell>
                      <TableCell>
                        <Badge variant={school.status === 'active' ? 'default' : 'secondary'}>
                          {school.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {school.enrollment_prefix && (
                            <div>Prefix: {school.enrollment_prefix}</div>
                          )}
                          {school.enrollment_base_number !== undefined && school.enrollment_base_number !== null && (
                            <div>Base: {school.enrollment_base_number}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {school.admission_prefix && (
                            <div>Prefix: {school.admission_prefix}</div>
                          )}
                          {school.admission_base_number !== undefined && school.admission_base_number !== null && (
                            <div>Base: {school.admission_base_number}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditForm(school)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(school)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* School Form Dialog */}
        <SchoolForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedSchool(null);
          }}
          onSubmit={selectedSchool ? handleUpdateSchool : handleCreateSchool}
          school={selectedSchool}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSchoolToDelete(null);
          }}
          onConfirm={handleDeleteSchool}
          title="Delete School"
          description={`Are you sure you want to delete "${schoolToDelete?.name}"? This action cannot be undone.`}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </PageTemplate>
  );
};

export default Schools;
