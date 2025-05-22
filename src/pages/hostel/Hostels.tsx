import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DataTable, { Column, RowAction } from '@/components/DataTable';
import { Hostel, getHostels, createHostel, updateHostel, deleteHostel } from '@/services/hostelService';
import { Building, Phone, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const defaultHostel: Omit<Hostel, 'id' | 'created_at' | 'updated_at' | 'school_id'> = {
  name: '',
  type: 'Boys',
  warden_name: '',
  contact_number: '',
  capacity: 0,
  status: 'Active',
};

const HostelsPage = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const navigate = useNavigate();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<typeof defaultHostel>(defaultHostel);
  const [currentHostelId, setCurrentHostelId] = useState<string | null>(null);

  useEffect(() => {
    fetchHostels();
  }, [schoolId]);

  const fetchHostels = async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const data = await getHostels(schoolId);
      setHostels(data);
    } catch (error) {
      console.error("Failed to fetch hostels:", error);
      toast.error("Failed to load hostels");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'capacity' ? parseInt(value, 10) || 0 : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData(defaultHostel);
    setIsEditing(false);
    setCurrentHostelId(null);
  };

  const handleOpenDialog = (hostel?: Hostel) => {
    if (hostel) {
      setIsEditing(true);
      setCurrentHostelId(hostel.id);
      setFormData({
        name: hostel.name,
        type: hostel.type,
        warden_name: hostel.warden_name || '',
        contact_number: hostel.contact_number || '',
        capacity: hostel.capacity,
        status: hostel.status,
      });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!schoolId) {
      toast.error('School ID is required');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Hostel name is required');
      return;
    }

    if (formData.capacity <= 0) {
      toast.error('Capacity must be greater than 0');
      return;
    }

    try {
      if (isEditing && currentHostelId) {
        await updateHostel(currentHostelId, formData);
      } else {
        await createHostel({
          ...formData,
          school_id: schoolId,
        });
      }
      setOpenDialog(false);
      resetForm();
      fetchHostels();
    } catch (error: any) {
      toast.error('Failed to save hostel: ' + error.message);
    }
  };

  const handleDelete = async (hostel: Hostel) => {
    if (confirm(`Are you sure you want to delete ${hostel.name}?`)) {
      const success = await deleteHostel(hostel.id);
      if (success) {
        fetchHostels();
      }
    }
  };

  const handleViewRooms = (hostel: Hostel) => {
    navigate(`/hostel/rooms/${hostel.id}`);
  };

  const columns: Column<Hostel>[] = [
    {
      id: 'name',
      header: 'Hostel Name',
      cell: (row) => (
        <div className="flex items-center">
          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
      isSortable: true,
      sortKey: 'name',
    },
    {
      id: 'type',
      header: 'Type',
      cell: (row) => <Badge variant="outline">{row.type}</Badge>,
      isSortable: true,
      sortKey: 'type',
    },
    {
      id: 'warden',
      header: 'Warden',
      cell: (row) => row.warden_name || 'Not assigned',
      isSortable: true,
      sortKey: 'warden_name',
    },
    {
      id: 'contact',
      header: 'Contact',
      cell: (row) => (
        <div className="flex items-center">
          {row.contact_number ? (
            <>
              <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
              {row.contact_number}
            </>
          ) : (
            'Not available'
          )}
        </div>
      ),
      isSortable: false,
    },
    {
      id: 'capacity',
      header: 'Capacity',
      cell: (row) => row.capacity,
      isSortable: true,
      sortKey: 'capacity',
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'destructive'}>
          {row.status}
        </Badge>
      ),
      isSortable: true,
      sortKey: 'status',
    },
  ];

  const rowActions: RowAction<Hostel>[] = [
    {
      label: 'View Rooms',
      onClick: handleViewRooms,
    },
    {
      label: 'Edit Hostel',
      onClick: (hostel) => handleOpenDialog(hostel),
    },
    {
      label: 'Delete',
      onClick: handleDelete,
      variant: 'destructive',
    },
  ];

  return (
    <PageTemplate title="Hostels Management" subtitle="Manage hostel buildings and facilities">
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Hostel
        </Button>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={hostels}
          isLoading={loading}
          keyField="id"
          actions={rowActions}
        />
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Hostel' : 'Add New Hostel'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update hostel information'
                : 'Enter details to create a new hostel'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Hostel Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select hostel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Boys">Boys</SelectItem>
                    <SelectItem value="Girls">Girls</SelectItem>
                    <SelectItem value="Co-ed">Co-ed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="warden_name" className="text-right">
                  Warden Name
                </Label>
                <Input
                  id="warden_name"
                  name="warden_name"
                  value={formData.warden_name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact_number" className="text-right">
                  Contact Number
                </Label>
                <Input
                  id="contact_number"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacity
                </Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="col-span-3"
                  min="1"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Update Hostel' : 'Create Hostel'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default HostelsPage;
