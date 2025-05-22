
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/DataTable';
import { Textarea } from '@/components/ui/textarea';
import { Hostel, Room, getHostel, getRooms, createRoom, updateRoom, deleteRoom } from '@/services/hostelService';
import { PlusCircle, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Column } from '@/components/DataTable';
import { RowAction } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';

const defaultRoom: Omit<Room, 'id' | 'created_at' | 'updated_at' | 'hostel_id'> = {
  room_number: '',
  floor: undefined,
  type: 'Single',
  capacity: 1,
  status: 'Available',
  remarks: ''
};

const RoomsPage = () => {
  const { hostelId } = useParams<{ hostelId: string }>();
  const navigate = useNavigate();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<typeof defaultRoom>(defaultRoom);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  useEffect(() => {
    if (hostelId) {
      fetchHostelAndRooms();
    }
  }, [hostelId]);

  const fetchHostelAndRooms = async () => {
    if (!hostelId) return;
    
    setLoading(true);
    const hostelData = await getHostel(hostelId);
    setHostel(hostelData);
    
    const roomsData = await getRooms(hostelId);
    setRooms(roomsData);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'capacity' || name === 'floor' ? parseInt(value, 10) || undefined : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData(defaultRoom);
    setIsEditing(false);
    setCurrentRoomId(null);
  };

  const handleOpenDialog = (room?: Room) => {
    if (room) {
      setIsEditing(true);
      setCurrentRoomId(room.id);
      setFormData({
        room_number: room.room_number,
        floor: room.floor,
        type: room.type,
        capacity: room.capacity,
        status: room.status,
        remarks: room.remarks || ''
      });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hostelId) {
      toast.error('Hostel ID is required');
      return;
    }

    if (!formData.room_number.trim()) {
      toast.error('Room number is required');
      return;
    }

    if (formData.capacity <= 0) {
      toast.error('Capacity must be greater than 0');
      return;
    }

    try {
      if (isEditing && currentRoomId) {
        await updateRoom(currentRoomId, formData);
      } else {
        await createRoom({
          ...formData,
          hostel_id: hostelId,
        });
      }
      setOpenDialog(false);
      resetForm();
      fetchHostelAndRooms();
    } catch (error: any) {
      toast.error('Failed to save room: ' + error.message);
    }
  };

  const handleDelete = async (room: Room) => {
    if (confirm(`Are you sure you want to delete room ${room.room_number}?`)) {
      const success = await deleteRoom(room.id);
      if (success) {
        fetchHostelAndRooms();
      }
    }
  };

  const columns: Column<Room>[] = [
    {
      id: 'room_number',
      header: 'Room Number',
      cell: (row) => <span className="font-medium">{row.room_number}</span>,
      isSortable: true,
      sortKey: 'room_number',
    },
    {
      id: 'floor',
      header: 'Floor',
      cell: (row) => row.floor !== undefined ? row.floor : 'N/A',
      isSortable: true,
      sortKey: 'floor',
    },
    {
      id: 'type',
      header: 'Type',
      cell: (row) => <Badge variant="outline">{row.type}</Badge>,
      isSortable: true,
      sortKey: 'type',
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
      cell: (row) => {
        const variants: { [key: string]: any } = {
          'Available': 'success',
          'Occupied': 'warning',
          'Maintenance': 'destructive'
        };
        return (
          <Badge variant={variants[row.status] || 'default'}>
            {row.status}
          </Badge>
        );
      },
      isSortable: true,
      sortKey: 'status',
    },
    {
      id: 'remarks',
      header: 'Remarks',
      cell: (row) => row.remarks || 'No remarks',
      isSortable: false,
    },
  ];

  const rowActions: RowAction<Room>[] = [
    {
      label: 'Edit Room',
      onClick: (room) => handleOpenDialog(room),
    },
    {
      label: 'Delete',
      onClick: handleDelete,
      variant: 'destructive',
    },
  ];

  return (
    <PageTemplate 
      title={`Rooms - ${hostel?.name || 'Loading...'}`} 
      subtitle="Manage rooms and bed spaces in this hostel"
    >
      <div className="flex justify-between mb-4">
        <Button variant="outline" onClick={() => navigate('/hostel/hostels')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hostels
        </Button>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Room
        </Button>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={rooms}
          isLoading={loading}
          searchPlaceholder="Search rooms by number..."
          searchColumn="room_number"
          rowActions={rowActions}
          pagination={{
            pageSize: 10
          }}
        />
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Room' : 'Add New Room'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update room information'
                : 'Enter details to create a new room'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room_number" className="text-right">
                  Room Number
                </Label>
                <Input
                  id="room_number"
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="floor" className="text-right">
                  Floor
                </Label>
                <Input
                  id="floor"
                  name="floor"
                  type="number"
                  value={formData.floor === undefined ? '' : formData.floor}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Optional"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Room Type
                </Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Double">Double</SelectItem>
                    <SelectItem value="Triple">Triple</SelectItem>
                    <SelectItem value="Dormitory">Dormitory</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Occupied">Occupied</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="remarks" className="text-right">
                  Remarks
                </Label>
                <Textarea
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Optional notes or remarks about this room"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Update Room' : 'Create Room'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default RoomsPage;
