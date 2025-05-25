
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Users, UserCheck, UserX } from 'lucide-react';
import PageTemplate from '@/components/PageTemplate';
import DataTable, { Column, RowAction } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StaffForm from '@/components/StaffForm';
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getStaff, createStaff, updateStaff, deleteStaff, Staff, CreateStaffRequest } from '@/services/staffService';
import { toast } from '@/hooks/use-toast';
import usePagination from '@/hooks/usePagination';

const StaffList = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paginationState = usePagination({
    initialPage: 1,
    initialPageSize: 10,
    total: staff.length,
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const data = await getStaff();
      setStaff(data);
      paginationState.setTotal(data.length);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setIsFormOpen(true);
  };

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsFormOpen(true);
  };

  const handleDeleteStaff = (staff: Staff) => {
    setStaffToDelete(staff);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: CreateStaffRequest) => {
    setIsSubmitting(true);
    try {
      if (selectedStaff) {
        const success = await updateStaff(selectedStaff.id, data);
        if (success) {
          await fetchStaff();
        }
      } else {
        const newStaff = await createStaff(data);
        if (newStaff) {
          await fetchStaff();
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (staffToDelete) {
      const success = await deleteStaff(staffToDelete.id);
      if (success) {
        await fetchStaff();
      }
      setIsDeleteDialogOpen(false);
      setStaffToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'Active' ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <UserCheck className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        <UserX className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const columns: Column<Staff>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (staff) => (
        <div className="font-medium">
          {staff.name}
          {staff.designation && (
            <div className="text-sm text-muted-foreground">{staff.designation}</div>
          )}
        </div>
      ),
      isSortable: true,
      size: 'lg',
    },
    {
      id: 'email',
      header: 'Contact',
      cell: (staff) => (
        <div>
          <div className="text-sm">{staff.email}</div>
          {staff.phone && (
            <div className="text-sm text-muted-foreground">{staff.phone}</div>
          )}
        </div>
      ),
      size: 'md',
    },
    {
      id: 'role',
      header: 'Role',
      cell: (staff) => (
        <div>
          {staff.role && <div className="text-sm font-medium">{staff.role}</div>}
          {staff.section && (
            <div className="text-sm text-muted-foreground">
              Section: {staff.section}
            </div>
          )}
        </div>
      ),
      size: 'md',
    },
    {
      id: 'joining_date',
      header: 'Joining Date',
      cell: (staff) => staff.joining_date ? 
        new Date(staff.joining_date).toLocaleDateString() : 'N/A',
      isSortable: true,
      size: 'sm',
    },
    {
      id: 'salary',
      header: 'Salary',
      cell: (staff) => staff.salary ? 
        `₹${staff.salary.toLocaleString()}` : 'N/A',
      isSortable: true,
      size: 'sm',
    },
    {
      id: 'status',
      header: 'Status',
      cell: (staff) => getStatusBadge(staff.status),
      size: 'sm',
    },
  ];

  const actions: RowAction<Staff>[] = [
    {
      label: 'View Details',
      onClick: (staff) => {
        toast({
          title: "Staff Details",
          description: `Viewing details for ${staff.name}`,
        });
      },
      icon: <Eye className="w-4 h-4 mr-2" />,
    },
    {
      label: 'Edit',
      onClick: handleEditStaff,
      icon: <Edit className="w-4 h-4 mr-2" />,
    },
    {
      label: 'Delete',
      onClick: handleDeleteStaff,
      icon: <Trash2 className="w-4 h-4 mr-2" />,
      variant: 'destructive',
    },
  ];

  // Calculate stats
  const activeStaffCount = staff.filter(s => s.status === 'Active').length;
  const inactiveStaffCount = staff.filter(s => s.status === 'Inactive').length;
  const busInChargeCount = staff.filter(s => s.is_bus_incharge).length;

  const statsCards = [
    {
      title: 'Total Staff',
      value: staff.length,
      icon: Users,
      description: 'All staff members',
    },
    {
      title: 'Active Staff',
      value: activeStaffCount,
      icon: UserCheck,
      description: 'Currently active',
    },
    {
      title: 'Inactive Staff',
      value: inactiveStaffCount,
      icon: UserX,
      description: 'Currently inactive',
    },
    {
      title: 'Bus In-charge',
      value: busInChargeCount,
      icon: Users,
      description: 'Bus responsibilities',
    },
  ];

  return (
    <PageTemplate
      title="Staff Management"
      subtitle="Manage school staff members, their roles, and assignments"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Staff Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Staff List</CardTitle>
                <CardDescription>
                  View and manage all staff members in the system
                </CardDescription>
              </div>
              <Button onClick={handleAddStaff}>
                <Plus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              data={staff}
              columns={columns}
              keyField="id"
              isLoading={isLoading}
              actions={actions}
              paginationState={paginationState}
              emptyState={
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    No staff members
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding your first staff member.
                  </p>
                  <div className="mt-6">
                    <Button onClick={handleAddStaff}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Staff Member
                    </Button>
                  </div>
                </div>
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Staff Form Dialog */}
      <StaffForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        staff={selectedStaff}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Staff Member"
        description={`Are you sure you want to delete ${staffToDelete?.name}? This action cannot be undone.`}
      />
    </PageTemplate>
  );
};

export default StaffList;
