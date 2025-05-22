
import React from 'react';
import DataTable, { Column } from '@/components/DataTable';

// Mock implementation to fix type errors
const AdmitCards = () => {
  const columns: Column<any>[] = [
    {
      id: "id",
      header: "ID",
      cell: (row) => row.id,
      isSortable: true,
      sortKey: "id",
      // Fixed the size property to use one of the allowed values
      size: "sm"
    },
    {
      id: "name",
      header: "Name",
      cell: (row) => row.name,
      isSortable: true,
      sortKey: "name"
    }
  ];
  
  return (
    <div>
      <h1>Admit Cards</h1>
      <DataTable 
        data={[]} 
        columns={columns} 
        keyField="id"
      />
    </div>
  );
};

export default AdmitCards;
