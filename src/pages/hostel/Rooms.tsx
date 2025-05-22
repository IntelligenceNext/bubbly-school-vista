
import React from 'react';
import { useParams } from 'react-router-dom';
import PageTemplate from '@/components/PageTemplate';
import DataTable, { Column, RowAction } from '@/components/DataTable';

// This is a minimal implementation to fix type errors
const Rooms = () => {
  const { hostelId } = useParams<{ hostelId: string }>();

  // Define columns with correct types
  const columns: Column<any>[] = [
    {
      id: "room_number",
      header: "Room Number",
      cell: (room) => room.room_number,
      isSortable: true,
      sortKey: "room_number"
    }
  ];

  // Define row actions with correct types
  const rowActions: RowAction<any>[] = [
    {
      label: "View Details",
      onClick: (room) => alert(`View room ${room.id}`)
    }
  ];
  
  return (
    <PageTemplate title="Hostel Rooms" subtitle={`Manage rooms for hostel ID: ${hostelId}`}>
      <DataTable
        data={[]}
        columns={columns}
        keyField="id"
        actions={rowActions}
        isLoading={false}
      />
    </PageTemplate>
  );
};

export default Rooms;
