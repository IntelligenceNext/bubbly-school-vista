
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, UserCheck, LockKeyhole, Layers, ShieldCheck, ShieldAlert, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Permission {
  id: string;
  module: string;
  action: string;
  description: string;
  granted: boolean;
}

interface PermissionGroup {
  module: string;
  icon: React.ReactNode;
  permissions: Permission[];
}

const PermissionsPage = () => {
  const [requestReason, setRequestReason] = React.useState('');
  const [selectedPermission, setSelectedPermission] = React.useState('');

  const permissionGroups: PermissionGroup[] = [
    {
      module: 'Student Management',
      icon: <UserCheck className="h-5 w-5" />,
      permissions: [
        {
          id: 'student-view',
          module: 'Student',
          action: 'View',
          description: 'View student profiles and basic information',
          granted: true
        },
        {
          id: 'student-edit',
          module: 'Student',
          action: 'Edit',
          description: 'Edit student details and information',
          granted: true
        },
        {
          id: 'student-delete',
          module: 'Student',
          action: 'Delete',
          description: 'Delete student records',
          granted: false
        },
        {
          id: 'student-add',
          module: 'Student',
          action: 'Add',
          description: 'Add new student records',
          granted: true
        }
      ]
    },
    {
      module: 'Academic Management',
      icon: <Layers className="h-5 w-5" />,
      permissions: [
        {
          id: 'class-view',
          module: 'Class',
          action: 'View',
          description: 'View class details and schedules',
          granted: true
        },
        {
          id: 'class-edit',
          module: 'Class',
          action: 'Edit',
          description: 'Edit class information and schedules',
          granted: false
        },
        {
          id: 'grade-view',
          module: 'Grade',
          action: 'View',
          description: 'View student grades and assessments',
          granted: true
        },
        {
          id: 'grade-edit',
          module: 'Grade',
          action: 'Edit',
          description: 'Edit and update student grades',
          granted: true
        }
      ]
    },
    {
      module: 'Admin & System',
      icon: <LockKeyhole className="h-5 w-5" />,
      permissions: [
        {
          id: 'settings-view',
          module: 'Settings',
          action: 'View',
          description: 'View system settings',
          granted: false
        },
        {
          id: 'user-manage',
          module: 'User',
          action: 'Manage',
          description: 'Manage user accounts',
          granted: false
        },
        {
          id: 'reports-generate',
          module: 'Reports',
          action: 'Generate',
          description: 'Generate system reports',
          granted: true
        },
        {
          id: 'backup-create',
          module: 'Backup',
          action: 'Create',
          description: 'Create system backups',
          granted: false
        }
      ]
    }
  ];
  
  const assignedRoles = [
    {
      name: 'Math Teacher',
      description: 'Can access and manage math curriculum and student grades',
      isPrimary: true
    },
    {
      name: 'Class Advisor - 10A',
      description: 'Manages class 10A students and activities',
      isPrimary: false
    },
    {
      name: 'Examination Committee',
      description: 'Access to examination creation and management',
      isPrimary: false
    }
  ];
  
  const handleRequestPermission = () => {
    if (!selectedPermission || !requestReason) {
      toast({
        title: "Incomplete Information",
        description: "Please select a permission and provide a reason for your request.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Permission Request Submitted",
      description: "Your request has been sent to the administrator for review.",
    });
    setRequestReason('');
    setSelectedPermission('');
  };
  
  return (
    <PageTemplate title="Roles & Permissions" subtitle="View and manage your system roles and permissions">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <UserCheck className="mr-2 h-5 w-5" />
                Assigned Roles
              </CardTitle>
              <CardDescription>
                Your current roles in the system
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Request Role</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Additional Role</DialogTitle>
                  <DialogDescription>
                    Submit a request to be assigned an additional role in the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="role">Select Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dept-head">Department Head</SelectItem>
                        <SelectItem value="exam-coord">Examination Coordinator</SelectItem>
                        <SelectItem value="event-coord">Event Coordinator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Reason for Request</Label>
                    <Textarea 
                      id="reason" 
                      placeholder="Explain why you need this role..." 
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Submit Request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedRoles.map((role, index) => (
                <div key={index} className="flex items-start justify-between border rounded-lg p-4">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{role.name}</h3>
                      {role.isPrimary && (
                        <Badge variant="secondary" className="ml-2">Primary Role</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm">View Permissions</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Permissions
              </CardTitle>
              <CardDescription>
                Your access permissions within the system
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Request Permission</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Additional Permission</DialogTitle>
                  <DialogDescription>
                    Submit a request for additional permissions in the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="permission">Permission</Label>
                    <Select 
                      value={selectedPermission} 
                      onValueChange={setSelectedPermission}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select permission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student-delete">Delete Student Records</SelectItem>
                        <SelectItem value="class-edit">Edit Class Information</SelectItem>
                        <SelectItem value="settings-view">View System Settings</SelectItem>
                        <SelectItem value="user-manage">Manage User Accounts</SelectItem>
                        <SelectItem value="backup-create">Create System Backups</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="request-reason">Reason for Request</Label>
                    <Textarea 
                      id="request-reason" 
                      placeholder="Explain why you need this permission..." 
                      className="min-h-[100px]"
                      value={requestReason}
                      onChange={(e) => setRequestReason(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleRequestPermission}>Submit Request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {permissionGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-3">
                  <div className="flex items-center">
                    {group.icon}
                    <h3 className="text-lg font-medium ml-2">{group.module}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-7">
                    {group.permissions.map((permission, permIndex) => (
                      <div 
                        key={`${groupIndex}-${permIndex}`} 
                        className={`border rounded-lg p-4 ${permission.granted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Badge variant={permission.granted ? 'outline' : 'secondary'} className="mr-2">
                              {permission.action}
                            </Badge>
                            <span className="font-medium">{permission.module}</span>
                          </div>
                          <div className="flex items-center">
                            {permission.granted ? (
                              <ShieldCheck className="h-5 w-5 text-green-600" />
                            ) : (
                              <ShieldAlert className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{permission.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Permission Requests
            </CardTitle>
            <CardDescription>
              Status of your permission and role requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">Department Head Role</h3>
                    <Badge className="ml-2" variant="warning">Pending</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Requested on: May 15, 2023</p>
                </div>
                <Button variant="ghost" size="sm">Cancel Request</Button>
              </div>
              
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">Backup Creation Permission</h3>
                    <Badge className="ml-2" variant="destructive">Rejected</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Rejected on: April 20, 2023</p>
                  <p className="text-sm text-muted-foreground">Reason: Limited to IT administrators</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">View Student Transcripts</h3>
                    <Badge className="ml-2" variant="success">Approved</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Approved on: March 5, 2023</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default PermissionsPage;
