import React from 'react';
import { useQuery } from '@tanstack/react-query';
import PageTemplate from '@/components/PageTemplate';
import DashboardSummary from '@/components/DashboardSummary';
import QuickStats from '@/components/QuickStats';
import RecentActivity from '@/components/RecentActivity';
import UpcomingEvents from '@/components/UpcomingEvents';
import { getSchools, getClasses, getSessions } from '@/services/schoolManagementService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { School, School2, GraduationCap, Calendar, ChevronRight, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: schools, isLoading: isLoadingSchools } = useQuery({
    queryKey: ['dashboard-schools'],
    queryFn: async () => {
      const result = await getSchools({ pageSize: 100 });
      return result.data;
    },
  });

  const { data: classes, isLoading: isLoadingClasses } = useQuery({
    queryKey: ['dashboard-classes'],
    queryFn: async () => {
      const result = await getClasses({ pageSize: 100 });
      return result.data;
    },
  });

  const { data: sessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['dashboard-sessions'],
    queryFn: async () => {
      const result = await getSessions({ pageSize: 100, is_current: true });
      return result.data;
    },
  });

  const activeSchools = schools?.filter(school => school.status === 'active').length || 0;
  const activeClasses = classes?.filter(cls => cls.is_active).length || 0;
  const currentSessions = sessions?.length || 0;

  const schoolsByStatus = {
    active: schools?.filter(school => school.status === 'active').length || 0,
    inactive: schools?.filter(school => school.status === 'inactive').length || 0,
  };

  return (
    <PageTemplate title="School Management Dashboard" subtitle="Manage multiple schools from a central dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="Schools"
          value={schools?.length || 0}
          icon={<School className="h-5 w-5" />}
          description={`${activeSchools} active schools`}
          loading={isLoadingSchools}
          onClick={() => navigate('/school-management/schools')}
        />
        <StatsCard
          title="Classes"
          value={classes?.length || 0}
          icon={<BookOpen className="h-5 w-5" />}
          description={`${activeClasses} active classes`}
          loading={isLoadingClasses}
          onClick={() => navigate('/school-management/classes')}
        />
        <StatsCard
          title="Academic Sessions"
          value={sessions?.length || 0}
          icon={<Calendar className="h-5 w-5" />}
          description={`${currentSessions} current sessions`}
          loading={isLoadingSessions}
          onClick={() => navigate('/school-management/sessions')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">School Distribution</CardTitle>
            <CardDescription>Active vs. Inactive schools</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSchools ? (
              <div className="space-y-3">
                <Skeleton className="h-[150px] w-full" />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[150px]">
                <div className="w-full max-w-xs">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Active</span>
                    <span>{schoolsByStatus.active}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 mb-4">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ 
                        width: `${schools?.length ? (schoolsByStatus.active / schools.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Inactive</span>
                    <span>{schoolsByStatus.inactive}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 mb-4">
                    <div 
                      className="bg-muted-foreground h-2.5 rounded-full" 
                      style={{ 
                        width: `${schools?.length ? (schoolsByStatus.inactive / schools.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => navigate('/school-management/schools')}>
              View all schools
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Current Academic Sessions</CardTitle>
            <CardDescription>Active academic periods</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSessions ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : sessions && sessions.length > 0 ? (
              <ScrollArea className="h-[150px]">
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">{session.name}</span>
                      </div>
                      <Badge variant="outline">{session.schools?.name}</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[150px] text-center">
                <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No current sessions</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => navigate('/school-management/sessions')}>
              Manage sessions
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Schools Overview</CardTitle>
            <CardDescription>Recent school activities</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSchools ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : schools && schools.length > 0 ? (
              <div className="rounded-md border">
                <div className="grid grid-cols-12 p-2 text-sm font-medium bg-muted">
                  <div className="col-span-5">Name</div>
                  <div className="col-span-3">Code</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-right">Classes</div>
                </div>
                <ScrollArea className="h-[250px]">
                  {schools.slice(0, 5).map((school) => {
                    const schoolClasses = classes?.filter(cls => cls.school_id === school.id) || [];
                    return (
                      <div key={school.id} className="grid grid-cols-12 p-3 text-sm border-t">
                        <div className="col-span-5 flex items-center">
                          <School2 className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">{school.name}</span>
                        </div>
                        <div className="col-span-3 text-muted-foreground">{school.code}</div>
                        <div className="col-span-2">
                          <Badge variant={school.status === 'active' ? 'default' : 'secondary'}>
                            {school.status}
                          </Badge>
                        </div>
                        <div className="col-span-2 text-right">{schoolClasses.length}</div>
                      </div>
                    );
                  })}
                </ScrollArea>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[250px] text-center">
                <School2 className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No schools found</p>
                <Button 
                  onClick={() => navigate('/school-management/schools')}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Add a school
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => navigate('/school-management/schools')}>
              View all schools
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              size="default" 
              className="w-full justify-start" 
              onClick={() => navigate('/school-management/schools')}
            >
              <School className="mr-2 h-4 w-4" />
              Add New School
            </Button>
            <Button 
              variant="outline" 
              size="default" 
              className="w-full justify-start" 
              onClick={() => navigate('/school-management/classes')}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Create Class
            </Button>
            <Button 
              variant="outline" 
              size="default" 
              className="w-full justify-start" 
              onClick={() => navigate('/school-management/sessions')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Add Academic Session
            </Button>
            <Button 
              variant="outline" 
              size="default" 
              className="w-full justify-start" 
              onClick={() => navigate('/school-management/settings')}
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Configure Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

// Helper component for stats cards
interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  loading?: boolean;
  onClick?: () => void;
}

const StatsCard = ({ title, value, icon, description, loading = false, onClick }: StatsCardProps) => {
  return (
    <Card className={onClick ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
