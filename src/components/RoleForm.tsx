
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Permission, CreateRoleRequest, RoleWithPermissions } from '@/services/roleService';

interface RoleFormProps {
  permissions: Permission[];
  onSubmit: (data: CreateRoleRequest) => void;
  onCancel: () => void;
  existingRole?: RoleWithPermissions;
  isLoading?: boolean;
}

interface FormData {
  name: string;
  description: string;
}

const RoleForm: React.FC<RoleFormProps> = ({
  permissions,
  onSubmit,
  onCancel,
  existingRole,
  isLoading = false
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>();

  useEffect(() => {
    if (existingRole) {
      setValue('name', existingRole.name);
      setValue('description', existingRole.description || '');
      setSelectedPermissions(existingRole.permissions.map(p => p.id));
    }
  }, [existingRole, setValue]);

  // Group permissions by category
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  // Expand all categories by default so admins can see everything at a glance
  useEffect(() => {
    const allCategories = Object.keys(groupedPermissions);
    setExpandedCategories(allCategories);
  }, [permissions]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const selectAllInCategory = (category: string) => {
    const categoryPermissions = groupedPermissions[category] || [];
    const categoryPermissionIds = categoryPermissions.map(p => p.id);
    const allSelected = categoryPermissionIds.every(id => selectedPermissions.includes(id));

    if (allSelected) {
      // Deselect all in category
      setSelectedPermissions(prev => prev.filter(id => !categoryPermissionIds.includes(id)));
    } else {
      // Select all in category
      setSelectedPermissions(prev => [
        ...prev.filter(id => !categoryPermissionIds.includes(id)),
        ...categoryPermissionIds
      ]);
    }
  };

  const onFormSubmit = (data: FormData) => {
    onSubmit({
      name: data.name,
      description: data.description,
      permission_ids: selectedPermissions
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingRole ? 'Edit Role' : 'Create New Role'}</CardTitle>
        <CardDescription>
          {existingRole ? 'Update role details and permissions' : 'Define a new role and set permissions'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Role name is required' })}
                placeholder="Enter role name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                {...register('description')}
                placeholder="Brief description of this role"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Permissions</h3>
              <p className="text-sm text-gray-500">Define what actions users with this role can perform</p>
            </div>

            <div className="border rounded-md">
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
                const isExpanded = expandedCategories.includes(category);
                const selectedInCategory = categoryPermissions.filter(p => selectedPermissions.includes(p.id)).length;
                const totalInCategory = categoryPermissions.length;

                // Order actions consistently across entities
                const actionKey = (n: string) => n.toLowerCase().split(' ')[0].replace('_', ' ');
                const actionOrder = ['read','view','write','update','assign','assign to','append','append to'];
                const sortedCategoryPermissions = [...categoryPermissions].sort((a, b) => {
                  const ai = actionOrder.indexOf(actionKey(a.name));
                  const bi = actionOrder.indexOf(actionKey(b.name));
                  if (ai !== bi) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
                  return a.name.localeCompare(b.name);
                });

                return (
                  <div key={category} className="border-b last:border-b-0">
                    <Collapsible open={isExpanded}>
                      <CollapsibleTrigger
                        className="flex items-center justify-between w-full p-4 hover:bg-muted cursor-pointer"
                        onClick={() => toggleCategory(category)}
                      >
                        <div className="flex items-center space-x-2">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="font-medium">{category}</span>
                          <span className="text-sm text-muted-foreground">
                            ({selectedInCategory}/{totalInCategory})
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectAllInCategory(category);
                          }}
                        >
                          {selectedInCategory === totalInCategory ? 'Deselect All' : 'Select All'}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="bg-muted/50 p-4 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                          {sortedCategoryPermissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission.id}
                                checked={selectedPermissions.includes(permission.id)}
                                onCheckedChange={() => togglePermission(permission.id)}
                              />
                              <Label htmlFor={permission.id} className="text-sm font-normal cursor-pointer">
                                {permission.name.replace(/_/g, ' ')}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : existingRole ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoleForm;
