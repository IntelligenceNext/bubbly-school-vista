
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from '@/components/ui/BarChart';
import { LineChart } from '@/components/ui/LineChart';

const QuickStats: React.FC = () => {
  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Students',
        data: [92, 88, 95, 91, 94],
        backgroundColor: 'rgba(155, 135, 245, 0.8)',
      },
      {
        label: 'Staff',
        data: [96, 97, 94, 98, 95],
        backgroundColor: 'rgba(51, 195, 240, 0.8)',
      },
    ],
  };

  const feesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Collected',
        data: [8500, 9200, 8700, 9800, 9500],
        borderColor: 'rgba(155, 135, 245, 1)',
        backgroundColor: 'rgba(155, 135, 245, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card className="bubble-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold">Weekly Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <BarChart 
              data={attendanceData} 
              index="name"
              categories={['Students', 'Staff']}
              colors={['rgba(155, 135, 245, 0.8)', 'rgba(51, 195, 240, 0.8)']}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bubble-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold">Fee Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <LineChart 
              data={feesData} 
              index="name"
              categories={['Collected']}
              colors={['rgba(155, 135, 245, 1)']}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
