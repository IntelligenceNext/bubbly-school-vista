
import React from 'react';
import DashboardSummary from '@/components/DashboardSummary';
import QuickStats from '@/components/QuickStats';
import RecentActivity from '@/components/RecentActivity';
import UpcomingEvents from '@/components/UpcomingEvents';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">School Management Dashboard</h1>
        <p className="text-gray-500">Welcome back, John! Here's what's happening.</p>
      </div>
      
      <DashboardSummary />
      
      <QuickStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <UpcomingEvents />
      </div>
    </div>
  );
};

export default Dashboard;
