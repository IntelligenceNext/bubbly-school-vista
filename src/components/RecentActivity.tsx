
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      user: "John Smith",
      action: "added new student",
      target: "Sarah Johnson",
      time: "2 minutes ago",
      avatar: "JS",
      avatarColor: "bg-bubble-primary"
    },
    {
      user: "Emma Davis",
      action: "updated class schedule",
      target: "Class 9A",
      time: "25 minutes ago",
      avatar: "ED",
      avatarColor: "bg-blue-500"
    },
    {
      user: "Robert Wilson",
      action: "created exam",
      target: "Final Term Mathematics",
      time: "1 hour ago",
      avatar: "RW",
      avatarColor: "bg-green-500"
    },
    {
      user: "Lisa Brown",
      action: "marked attendance for",
      target: "Class 7B",
      time: "3 hours ago",
      avatar: "LB",
      avatarColor: "bg-amber-500"
    },
    {
      user: "Michael Taylor",
      action: "sent notification to",
      target: "All Teachers",
      time: "5 hours ago",
      avatar: "MT",
      avatarColor: "bg-purple-500"
    }
  ];

  return (
    <Card className="bubble-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`${activity.avatarColor} flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                {activity.avatar}
              </div>
              <div className="flex flex-col flex-1">
                <div className="text-sm">
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-gray-500"> {activity.action} </span>
                  <span className="font-medium">{activity.target}</span>
                </div>
                <span className="text-xs text-gray-400 mt-0.5">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
