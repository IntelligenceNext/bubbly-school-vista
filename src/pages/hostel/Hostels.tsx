
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';

// Define a basic component that we'll enhance later
const Hostels: React.FC = () => {
  return (
    <PageTemplate title="Hostels" subtitle="Manage student hostels">
      <div className="space-y-6">
        <PageHeader 
          title="Hostels" 
          description="Manage all hostels and their facilities"
          primaryAction={{
            label: "Add New Hostel",
            onClick: () => console.log("Add new hostel"),
            icon: <Plus className="h-4 w-4" />
          }}
        />
        {/* Content will go here */}
        <div className="p-6 bg-white rounded-lg shadow">
          <p className="text-muted-foreground">Hostel list will be displayed here</p>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Hostels;
