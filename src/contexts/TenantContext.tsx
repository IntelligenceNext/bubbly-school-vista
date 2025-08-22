import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tenant, TenantContext as TenantContextType } from '@/types/tenant';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTenant = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Get tenant information based on user's context
        let tenantId: string | null = null;

        // Check if user is a super admin (can access all tenants)
        if (user.role === 'super_admin') {
          // For super admin, we might want to get the current tenant from URL or context
          const urlParams = new URLSearchParams(window.location.search);
          tenantId = urlParams.get('tenant');
        } else {
          // For other users, get their assigned tenant
          const { data: userTenant, error: userTenantError } = await supabase
            .from('tenant_users')
            .select('tenant_id')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .single();

          if (userTenantError) {
            throw new Error('Failed to fetch user tenant assignment');
          }

          tenantId = userTenant?.tenant_id || null;
        }

        if (!tenantId) {
          setError('No tenant assigned to user');
          setIsLoading(false);
          return;
        }

        // Fetch tenant details
        const { data: tenantData, error: tenantError } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', tenantId)
          .eq('status', 'active')
          .single();

        if (tenantError) {
          throw new Error('Failed to fetch tenant information');
        }

        if (!tenantData) {
          setError('Tenant not found or inactive');
          setIsLoading(false);
          return;
        }

        setTenant(tenantData as Tenant);
      } catch (err) {
        console.error('Error fetching tenant:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tenant');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenant();
  }, [user?.id, user?.role]);

  const value: TenantContextType = {
    tenant,
    isLoading,
    error,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
