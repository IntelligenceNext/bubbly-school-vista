
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Check, ChevronDown, ChevronRight, Eye, MoreVertical, Pencil, Plus, Search, Shield, Trash } from 'lucide-react';

const Roles = () => {
  const [activeTab, setActiveTab] = useState("all-roles");
  const [expandedModule, setExpandedModule] = useState<string | null>("student");

  // Sample roles data
  const roles = [
    {
      id: "1",
      name: "Super Admin",
      description: "Complete access to all system features",
      permissions: { all: true },
      createdBy: "System",
      createdAt: "2023-01-01",
      assignedUsers: 2
    },
    {
      id: "2",
      name: "Principal",
      description: "School administrator with comprehensive access to school data",
      permissions: { 
        student: { view: true, add: true, edit: true, delete: false },
        staff: { view: true, add: true, edit: true, delete: false },
        finance: { view: true, add: false, edit: false, delete: false }
      },
      createdBy: "John Smith",
      createdAt: "2023-03-12",
      assignedUsers: 5
    },
    {
      id: "3",
      name: "Registrar",
      description: "Manages student records and admissions",
      permissions: { 
        student: { view: true, add: true, edit: true, delete: false },
        staff: { view: true, add: false, edit: false, delete: false },
        finance: { view: false, add: false, edit: false, delete: false }
      },
      createdBy: "Sarah Johnson",
      createdAt: "2023-03-15",
      assignedUsers: 3
    },
    {
      id: "4",
      name: "Admin Clerk",
      description: "Basic administrative tasks and record viewing",
      permissions: { 
        student: { view: true, add: false, edit: false, delete: false },
        staff: { view: true, add: false, edit: false, delete: false },
        finance: { view: false, add: false, edit: false, delete: false }
      },
      createdBy: "Michael Wong",
      createdAt: "2023-04-10",
      assignedUsers: 8
    }
  ];

  // Permission modules for the form
  const permissionModules = [
    {
      id: "student",
      name: "Student Management",
      permissions: [
        { id: "view_student", name: "View Student Records" },
        { id: "add_student", name: "Add New Students" },
        { id: "edit_student", name: "Edit Student Information" },
        { id: "delete_student", name: "Delete Student Records" },
        { id: "promote_student", name: "Promote Students" },
        { id: "transfer_student", name: "Transfer Students" }
      ]
    },
    {
      id: "staff",
      name: "Staff Management",
      permissions: [
        { id: "view_staff", name: "View Staff Records" },
        { id: "add_staff", name: "Add New Staff" },
        { id: "edit_staff", name: "Edit Staff Information" },
        { id: "delete_staff", name: "Delete Staff Records" },
        { id: "manage_attendance", name: "Manage Staff Attendance" },
        { id: "approve_leaves", name: "Approve Staff Leaves" }
      ]
    },
    {
      id: "finance",
      name: "Finance Management",
      permissions: [
        { id: "view_finance", name: "View Financial Records" },
        { id: "create_invoices", name: "Create Fee Invoices" },
        { id: "collect_payments", name: "Collect Payments" },
        { id: "manage_expenses", name: "Manage Expenses" },
        { id: "view_reports", name: "View Financial Reports" },
        { id: "approve_expenses", name: "Approve Expenses" }
      ]
    },
    {
      id: "academic",
      name: "Academic Management",
      permissions: [
        { id: "manage_classes", name: "Manage Classes" },
        { id: "manage_subjects", name: "Manage Subjects" },
        { id: "manage_timetable", name: "Manage Timetables" },
        { id: "manage_exams", name: "Manage Examinations" },
        { id: "publish_results", name: "Publish Results" }
      ]
    }
  ];

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <PageTemplate title="Roles" subtitle="Define and manage user roles and permissions">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all-roles">All Roles</TabsTrigger>
            <TabsTrigger value="create-role">Create Role</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search roles"
                className="pl-8 w-[250px]"
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Role
            </Button>
          </div>
        </div>
        
        <TabsContent value="all-roles">
          <Card>
            <CardHeader>
              <CardTitle>System Roles</CardTitle>
              <CardDescription>Manage roles and their assigned permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Assigned Users</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium">
                          <Shield className="h-4 w-4 text-primary" />
                          {role.name}
                          {role.name === "Super Admin" && (
                            <Badge variant="secondary" className="ml-2">System</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>{role.createdBy}</TableCell>
                      <TableCell>{role.createdAt}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{role.assignedUsers} users</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Permissions</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit Role</span>
                            </DropdownMenuItem>
                            {role.name !== "Super Admin" && (
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="create-role">
          <Card>
            <CardHeader>
              <CardTitle>Create Role</CardTitle>
              <CardDescription>Define a new role and set permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="roleName">Role Name</Label>
                    <Input id="roleName" placeholder="Enter role name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Brief description of this role" />
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Permissions</h3>
                  <p className="text-sm text-gray-500 mb-4">Define what actions users with this role can perform</p>
                  
                  <div className="border rounded-md overflow-hidden">
                    {permissionModules.map((module) => (
                      <div key={module.id} className="border-b last:border-b-0">
                        <Collapsible open={expandedModule === module.id}>
                          <CollapsibleTrigger
                            className="flex items-center justify-between w-full p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => toggleModule(module.id)}
                          >
                            <div className="flex items-center">
                              <div className="mr-2">
                                {expandedModule === module.id ? (
                                  <ChevronDown className="h-5 w-5 text-gray-500" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                              <span className="font-medium">{module.name}</span>
                            </div>
                            <div>
                              <Button variant="outline" size="sm">
                                Select All
                              </Button>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="bg-gray-50 p-4 grid md:grid-cols-2 gap-2">
                              {module.permissions.map((permission) => (
                                <div key={permission.id} className="flex items-center space-x-2">
                                  <input 
                                    type="checkbox" 
                                    id={permission.id} 
                                    className="h-4 w-4 rounded border-gray-300"
                                  />
                                  <Label htmlFor={permission.id} className="text-sm font-normal">
                                    {permission.name}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Role</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};

export default Roles;
