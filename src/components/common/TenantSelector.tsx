import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/contexts/TenantContext';
import { Tenant } from '@/types/tenant';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Building2, ChevronDown, Check } from 'lucide-react';

interface TenantSelectorProps {
  className?: string;
  showCurrentTenant?: boolean;
}

export const TenantSelector: React.FC<TenantSelectorProps> = ({
  className = '',
  showCurrentTenant = true,
}) => {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAvailableTenants = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);

        // Fetch all tenants the user has access to
        const { data, error } = await supabase
          .from('tenant_users')
          .select(`
            tenant_id,
            tenants (
              id,
              name,
              code,
              status,
              plan,
              settings
            )
          `)
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching available tenants:', error);
          return;
        }

        const tenants = data
          ?.map(item => item.tenants)
          .filter(t => t && t.status === 'active') as Tenant[];

        setAvailableTenants(tenants || []);
      } catch (error) {
        console.error('Error in fetchAvailableTenants:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableTenants();
  }, [user?.id]);

  const handleTenantSwitch = async (selectedTenant: Tenant) => {
    if (!user?.id) return;

    try {
      // Update the current tenant in the context
      // This would typically be handled by the TenantContext
      // For now, we'll just update localStorage and reload
      localStorage.setItem('currentTenantId', selectedTenant.id);
      window.location.reload();
    } catch (error) {
      console.error('Error switching tenant:', error);
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'basic':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user || availableTenants.length === 0) {
    return null;
  }

  if (availableTenants.length === 1 && showCurrentTenant) {
    const singleTenant = availableTenants[0];
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Building2 className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-900">
          {singleTenant.name}
        </span>
        <Badge className={getPlanBadgeColor(singleTenant.plan)}>
          {singleTenant.plan}
        </Badge>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 ${className}`}
          disabled={isLoading}
        >
          <Building2 className="h-4 w-4" />
          <span className="text-sm font-medium">
            {tenant?.name || 'Select Institution'}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {availableTenants.map((availableTenant) => (
          <DropdownMenuItem
            key={availableTenant.id}
            onClick={() => handleTenantSwitch(availableTenant)}
            className="flex items-center justify-between p-3 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {availableTenant.name}
                </div>
                <div className="text-xs text-gray-500">
                  {availableTenant.code}
                </div>
              </div>
              <Badge className={getPlanBadgeColor(availableTenant.plan)}>
                {availableTenant.plan}
              </Badge>
            </div>
            {tenant?.id === availableTenant.id && (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Standalone tenant selection page component
export const TenantSelectionPage: React.FC = () => {
  const { user } = useAuth();
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableTenants = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('tenant_users')
          .select(`
            tenant_id,
            tenants (
              id,
              name,
              code,
              status,
              plan,
              settings
            )
          `)
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching available tenants:', error);
          return;
        }

        const tenants = data
          ?.map(item => item.tenants)
          .filter(t => t && t.status === 'active') as Tenant[];

        setAvailableTenants(tenants || []);
      } catch (error) {
        console.error('Error in fetchAvailableTenants:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableTenants();
  }, [user?.id]);

  const handleTenantSelect = async (selectedTenant: Tenant) => {
    try {
      localStorage.setItem('currentTenantId', selectedTenant.id);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error selecting tenant:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (availableTenants.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Institutions Available
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have access to any institutions. Please contact your administrator.
          </p>
          <Button onClick={() => window.location.href = '/auth/logout'}>
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Select Institution
          </h1>
          <p className="text-gray-600">
            Choose the institution you want to access
          </p>
        </div>

        <div className="space-y-4">
          {availableTenants.map((tenant) => (
            <div
              key={tenant.id}
              onClick={() => handleTenantSelect(tenant)}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {tenant.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {tenant.code}
                    </p>
                  </div>
                </div>
                <Badge className={getPlanBadgeColor(tenant.plan)}>
                  {tenant.plan}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/auth/logout'}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

const getPlanBadgeColor = (plan: string) => {
  switch (plan) {
    case 'enterprise':
      return 'bg-purple-100 text-purple-800';
    case 'premium':
      return 'bg-blue-100 text-blue-800';
    case 'basic':
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
