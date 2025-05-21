
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import DashboardSummary from '@/components/DashboardSummary';
import QuickStats from '@/components/QuickStats';
import RecentActivity from '@/components/RecentActivity';
import UpcomingEvents from '@/components/UpcomingEvents';

const Dashboard = () => {
  return (
    <PageTemplate title="School Management Dashboard" subtitle="Manage multiple schools from a central dashboard">
      <DashboardSummary />
      <QuickStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <UpcomingEvents />
      </div>
    </PageTemplate>
  );
};

export default Dashboard;
