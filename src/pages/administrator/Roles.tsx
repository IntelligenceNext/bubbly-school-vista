
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, MoreVertical, Pencil, Plus, Search, Shield, Trash, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import RoleForm from '@/components/RoleForm';
import {
  getRoles,
  getPermissions,
  getRoleWithPermissions,
  createRole,
  updateRole,
  deleteRole,
  Role,
  Permission,
  CreateRoleRequest,
  RoleWithPermissions
} from '@/services/roleService';

const Roles = () => {
  const [activeTab, setActiveTab] = useState("all-roles");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRole, setEditingRole] = useState<RoleWithPermissions | null>(null);
  const [viewingRole, setViewingRole] = useState<RoleWithPermissions | null>(null);

  const queryClient = useQueryClient();

  // Fetch roles
  const { data: roles = [], isLoading: isLoadingRoles, refetch: refetchRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  // Fetch permissions
  const { data: permissions = [], isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
  });

  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setActiveTab("all-roles");
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: Partial<CreateRoleRequest> }) =>
      updateRole(roleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setEditingRole(null);
      setActiveTab("all-roles");
    },
  });

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  // Filter roles based on search term
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateRole = (data: CreateRoleRequest) => {
    createRoleMutation.mutate(data);
  };

  const handleUpdateRole = (data: CreateRoleRequest) => {
    if (editingRole) {
      updateRoleMutation.mutate({
        roleId: editingRole.id,
        data
      });
    }
  };

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (window.confirm(`Are you sure you want to delete the role "${roleName}"? This action cannot be undone.`)) {
      deleteRoleMutation.mutate(roleId);
    }
  };

  const handleViewRole = async (roleId: string) => {
    const roleWithPermissions = await getRoleWithPermissions(roleId);
    if (roleWithPermissions) {
      setViewingRole(roleWithPermissions);
    }
  };

  const handleEditRole = async (roleId: string) => {
    const roleWithPermissions = await getRoleWithPermissions(roleId);
    if (roleWithPermissions) {
      setEditingRole(roleWithPermissions);
      setActiveTab("create-role");
    }
  };

  const handleNewRole = () => {
    setEditingRole(null);
    setActiveTab("create-role");
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    setActiveTab("all-roles");
  };

  if (isLoadingRoles || isLoadingPermissions) {
    return (
      <PageTemplate title="Roles" subtitle="Define and manage user roles and permissions">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-500">Loading roles and permissions...</p>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title="Roles" subtitle="Define and manage user roles and permissions">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all-roles">All Roles ({roles.length})</TabsTrigger>
            <TabsTrigger value="create-role">
              {editingRole ? 'Edit Role' : 'Create Role'}
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search roles..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleNewRole}>
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
                    <TableHead>Type</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {searchTerm ? 'No roles found matching your search.' : 'No roles found.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>
                          <div className="flex items-center gap-2 font-medium">
                            <Shield className="h-4 w-4 text-primary" />
                            {role.name}
                          </div>
                        </TableCell>
                        <TableCell>{role.description || 'No description'}</TableCell>
                        <TableCell>
                          {role.is_system_role ? (
                            <Badge variant="secondary">System</Badge>
                          ) : (
                            <Badge variant="outline">Custom</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {/* We'll show permission count here - could fetch this data separately */}
                            View details
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">0</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(role.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewRole(role.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Permissions
                              </DropdownMenuItem>
                              {!role.is_system_role && (
                                <>
                                  <DropdownMenuItem onClick={() => handleEditRole(role.id)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Role
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteRole(role.id, role.name)}
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="create-role">
          <RoleForm
            permissions={permissions}
            onSubmit={editingRole ? handleUpdateRole : handleCreateRole}
            onCancel={handleCancelEdit}
            existingRole={editingRole || undefined}
            isLoading={createRoleMutation.isPending || updateRoleMutation.isPending}
          />
        </TabsContent>
      </Tabs>

      {/* Role Details Modal/View - You can implement this as a separate component */}
      {viewingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{viewingRole.name} Permissions</h2>
              <Button variant="ghost" onClick={() => setViewingRole(null)}>×</Button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">{viewingRole.description}</p>
              <div>
                <h3 className="font-medium mb-2">Assigned Permissions:</h3>
                <div className="grid gap-2">
                  {viewingRole.permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>{permission.name}</span>
                      <Badge variant="outline">{permission.category}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTemplate>
  );
};

export default Roles;
