
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Shield, 
  School, 
  Activity, 
  Settings, 
  Plus,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <PageTemplate 
      title="Administrator Dashboard" 
      subtitle={`Welcome back, ${user?.full_name || 'Administrator'}! Here's what's happening in your system.`}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-blue-900 mb-2">
                  Welcome to the Administration Panel
                </h2>
                <p className="text-blue-700">
                  Manage system administrators, schools, and monitor system activities from this central dashboard.
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Link to="/administrator/admins" className="block">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Add Administrator</h3>
                    <p className="text-sm text-muted-foreground">Create new admin accounts</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Link to="/administrator/roles" className="block">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Manage Roles</h3>
                    <p className="text-sm text-muted-foreground">Configure user roles and permissions</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Link to="/school-management/schools" className="block">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <School className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">School Management</h3>
                    <p className="text-sm text-muted-foreground">Manage schools and settings</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Link to="/school-management/settings" className="block">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">System Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure system preferences</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Link to="/administrator/staff-list" className="block">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">View Activities</h3>
                    <p className="text-sm text-muted-foreground">Monitor system activities</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Link to="/administrator/staff-list" className="block">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">User Management</h3>
                    <p className="text-sm text-muted-foreground">Manage all system users</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Authentication</p>
                  <p className="text-sm text-muted-foreground">Operational</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-sm text-muted-foreground">Operational</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Admin System</p>
                  <p className="text-sm text-muted-foreground">Operational</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Current User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User ID:</span>
                <span className="text-sm text-muted-foreground">{user?.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm text-muted-foreground">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Full Name:</span>
                <span className="text-sm text-muted-foreground">{user?.full_name || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Role:</span>
                <Badge variant="default">{user?.role || 'Unknown'}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Admin Status:</span>
                <Badge variant={user?.isAdmin ? "default" : "secondary"}>
                  {user?.isAdmin ? 'Administrator' : 'Regular User'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default Dashboard;
