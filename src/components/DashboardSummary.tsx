
import React from 'react';
import { Users, BookOpen, School, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const DashboardSummary: React.FC = () => {
  const summaryCards = [
    {
      title: "Total Students",
      value: 3582,
      icon: <Users className="h-6 w-6" />,
      increase: "+12%",
      color: "text-bubble-primary",
      bgColor: "bg-bubble-soft",
      progress: 78,
    },
    {
      title: "Total Teachers",
      value: 245,
      icon: <BookOpen className="h-6 w-6" />,
      increase: "+5%",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      progress: 63,
    },
    {
      title: "Total Schools",
      value: 12,
      icon: <School className="h-6 w-6" />,
      increase: "+2%",
      color: "text-green-500",
      bgColor: "bg-green-50",
      progress: 92,
    },
    {
      title: "Academic Year",
      value: "2025",
      icon: <Calendar className="h-6 w-6" />,
      subtitle: "Current Session",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      progress: 45,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {summaryCards.map((card, index) => (
        <Card key={index} className="bubble-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm text-gray-500 font-medium">{card.title}</h3>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
                {card.increase && (
                  <p className="text-xs text-green-500 font-medium mt-1">
                    {card.increase} this month
                  </p>
                )}
                {card.subtitle && (
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    {card.subtitle}
                  </p>
                )}
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg ${card.color}`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Progress</span>
                <span className="text-xs font-medium">{card.progress}%</span>
              </div>
              <Progress value={card.progress} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardSummary;
