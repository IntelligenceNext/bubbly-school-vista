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
import { Plus, Edit, Trash } from 'lucide-react';
import { Medium, getMediums, createMedium, updateMedium, deleteMedium } from '@/services/mediumService';
import MediumForm from '@/components/academic/MediumForm';
import { useCurrentSchool } from '@/contexts/CurrentSchoolContext';

const MediumPage = () => {
  const [isMediumDialogOpen, setIsMediumDialogOpen] = useState(false);
  const [editingMedium, setEditingMedium] = useState<Medium | null>(null);
  const [selectedMedium, setSelectedMedium] = useState<Medium | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { currentSchoolId } = useCurrentSchool();

  console.log('Current school ID from context:', currentSchoolId);

  // For now, we'll assume this is a super admin if no current school is set
  // In a real app, you'd get this from your auth context
  const userRole = currentSchoolId ? 'school_admin' : 'super_admin';

  const { data: mediums = [], isLoading } = useQuery({
    queryKey: ['mediums', userRole, currentSchoolId],
    queryFn: () => getMediums(userRole, currentSchoolId || undefined),
  });

  const createMediumMutation = useMutation({
    mutationFn: createMedium,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediums'] });
      toast({
        title: 'Success',
        description: 'Medium created successfully.',
      });
      setIsMediumDialogOpen(false);
      setEditingMedium(null);
    },
    onError: (error: any) => {
      console.error('Create medium error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create medium.',
        variant: 'destructive',
      });
    },
  });

  const updateMediumMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateMedium(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediums'] });
      toast({
        title: 'Success',
        description: 'Medium updated successfully.',
      });
      setIsMediumDialogOpen(false);
      setEditingMedium(null);
    },
    onError: (error: any) => {
      console.error('Update medium error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update medium.',
        variant: 'destructive',
      });
    },
  });

  const deleteMediumMutation = useMutation({
    mutationFn: deleteMedium,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediums'] });
      toast({
        title: 'Success',
        description: 'Medium deleted successfully.',
      });
      setIsDeleteDialogOpen(false);
      setSelectedMedium(null);
    },
    onError: (error: any) => {
      console.error('Delete medium error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete medium.',
        variant: 'destructive',
      });
    },
  });

  const columns: Column<Medium>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (medium) => <span className="font-medium">{medium.name}</span>,
      isSortable: true,
      sortKey: 'name',
    },
    {
      id: 'description',
      header: 'Description',
      cell: (medium) => <span>{medium.description || 'No description'}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (medium) => (
        <Badge variant={medium.status === 'active' ? 'success' : 'secondary'}>
          {medium.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'created_at',
      header: 'Created',
      cell: (medium) => <span>{format(new Date(medium.created_at), 'MMM d, yyyy')}</span>,
    },
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (medium: Medium) => handleEditMedium(medium),
    },
    {
      label: 'Delete',
      onClick: (medium: Medium) => {
        setSelectedMedium(medium);
        setIsDeleteDialogOpen(true);
      },
      variant: 'destructive' as const,
    },
  ];

  const handleCreateMedium = () => {
    // For super admins without a current school, we'll still allow them to create mediums
    // They'll need to specify the school ID in the form
    setEditingMedium(null);
    setIsMediumDialogOpen(true);
  };

  const handleEditMedium = (medium: Medium) => {
    setEditingMedium(medium);
    setIsMediumDialogOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    console.log('Form submitted with data:', data);
    
    try {
      if (editingMedium) {
        await updateMediumMutation.mutateAsync({
          id: editingMedium.id,
          data,
        });
      } else {
        let mediumData = { ...data };
        
        // For school admins with a current school, use that school ID
        if (userRole === 'school_admin' && currentSchoolId) {
          mediumData.school_id = currentSchoolId;
        }
        // For super admins, the school_id should be provided in the form
        // If no school_id is provided, show an error
        if (!mediumData.school_id) {
          toast({
            title: 'Error',
            description: 'Please provide a school ID.',
            variant: 'destructive',
          });
          return;
        }
        
        console.log('Creating medium with data:', mediumData);
        await createMediumMutation.mutateAsync(mediumData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleDeleteMedium = async () => {
    if (!selectedMedium) return;
    deleteMediumMutation.mutate(selectedMedium.id);
  };

  const handleDialogClose = () => {
    setIsMediumDialogOpen(false);
    setEditingMedium(null);
  };

  return (
    <PageTemplate title="Manage Medium" subtitle="Configure teaching mediums for your school">
      <PageHeader
        title="Teaching Mediums"
        description="Configure language and instruction mediums"
        primaryAction={{
          label: "Add Medium",
          onClick: handleCreateMedium,
          icon: <Plus className="h-4 w-4 mr-2" />,
        }}
      />

      <DataTable
        data={mediums}
        columns={columns}
        keyField="id"
        isLoading={isLoading}
        actions={actions}
        emptyState={
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No mediums found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new medium to get started.
            </p>
            <Button className="mt-4" onClick={handleCreateMedium}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medium
            </Button>
          </div>
        }
      />

      {/* Medium Dialog */}
      <Dialog open={isMediumDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingMedium ? "Edit Medium" : "Add New Medium"}
            </DialogTitle>
          </DialogHeader>
          <MediumForm
            initialData={editingMedium}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
            isLoading={createMediumMutation.isPending || updateMediumMutation.isPending}
            userRole={userRole}
            currentSchoolId={currentSchoolId}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedMedium?.name}</span>?
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
              onClick={handleDeleteMedium}
              disabled={deleteMediumMutation.isPending}
            >
              {deleteMediumMutation.isPending ? 'Deleting...' : 'Delete Medium'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default MediumPage;
