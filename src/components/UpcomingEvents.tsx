
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const UpcomingEvents: React.FC = () => {
  const events = [
    {
      title: "Staff Meeting",
      date: "May 22",
      time: "09:00 AM",
      location: "Conference Hall"
    },
    {
      title: "Parent-Teacher Conference",
      date: "May 24",
      time: "01:00 PM",
      location: "School Auditorium"
    },
    {
      title: "Science Fair",
      date: "May 28",
      time: "10:00 AM",
      location: "Main Hall"
    },
    {
      title: "Sports Day",
      date: "June 2",
      time: "08:30 AM",
      location: "Sports Ground"
    }
  ];

  return (
    <Card className="bubble-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 w-10 h-10 rounded bg-bubble-soft flex flex-col items-center justify-center">
                <Calendar className="w-4 h-4 text-bubble-primary mb-0.5" />
                <span className="text-xs font-medium text-bubble-primary">{event.date}</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm">{event.title}</h4>
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <span>{event.time}</span>
                  <span>•</span>
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
