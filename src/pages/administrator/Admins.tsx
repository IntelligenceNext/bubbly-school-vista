
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, MoreVertical, Pencil, Plus, Search, Shield, Trash, UserPlus } from 'lucide-react';

const Admins = () => {
  const [activeTab, setActiveTab] = useState("all-admins");
  
  // Sample admin users data
  const adminUsers = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@school.edu",
      role: "Super Admin",
      username: "johnsmith",
      status: "Active",
      lastLogin: "2023-05-15 08:30 AM",
      school: null
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@school.edu",
      role: "Principal",
      username: "sarahj",
      status: "Active",
      lastLogin: "2023-05-14 09:15 AM",
      school: "Main Campus"
    },
    {
      id: "3",
      name: "Michael Wong",
      email: "michael.w@school.edu",
      role: "Registrar",
      username: "michaelw",
      status: "Inactive",
      lastLogin: "2023-05-10 10:22 AM",
      school: "Branch Campus"
    },
    {
      id: "4",
      name: "Lisa Chen",
      email: "lisa.chen@school.edu",
      role: "Admin Clerk",
      username: "lisac",
      status: "Active",
      lastLogin: "2023-05-15 09:45 AM",
      school: "Main Campus"
    },
    {
      id: "5",
      name: "Robert Garcia",
      email: "robert.g@school.edu",
      role: "IT Admin",
      username: "robertg",
      status: "Active",
      lastLogin: "2023-05-14 02:30 PM",
      school: "Main Campus"
    }
  ];

  return (
    <PageTemplate title="Administrators" subtitle="Manage system administrators and their permissions">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all-admins">All Administrators</TabsTrigger>
            <TabsTrigger value="add-admin">Add Administrator</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search administrators"
                className="pl-8 w-[250px]"
              />
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> New Admin
            </Button>
          </div>
        </div>
        
        <TabsContent value="all-admins">
          <Card>
            <CardHeader>
              <CardTitle>System Administrators</CardTitle>
              <CardDescription>Manage users with administrative access to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell>{admin.username}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{admin.role}</span>
                        </div>
                      </TableCell>
                      <TableCell>{admin.school || "All Schools"}</TableCell>
                      <TableCell>
                        <Badge variant={admin.status === "Active" ? "success" : "destructive"}>
                          {admin.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{admin.lastLogin}</TableCell>
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
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit Admin</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Change Role</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
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
        
        <TabsContent value="add-admin">
          <Card>
            <CardHeader>
              <CardTitle>Add Administrator</CardTitle>
              <CardDescription>Create a new administrator account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="Enter username for login" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter strong password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirm password" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">-- Select Role --</option>
                      <option value="super_admin">Super Admin</option>
                      <option value="principal">Principal</option>
                      <option value="registrar">Registrar</option>
                      <option value="admin_clerk">Admin Clerk</option>
                      <option value="it_admin">IT Admin</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="school">School (Leave empty for all schools)</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">-- Access to All Schools --</option>
                      <option value="main_campus">Main Campus</option>
                      <option value="branch_campus">Branch Campus</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="sendInvitation" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="sendInvitation" className="text-sm font-normal">
                    Send account invitation email to the new administrator
                  </Label>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Administrator</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};

export default Admins;
