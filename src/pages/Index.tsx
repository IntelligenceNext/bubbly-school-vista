
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentSchool } from '@/contexts/CurrentSchoolContext';
import { getDefaultSchoolId } from '@/utils/storageUtils';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { currentSchoolId, setCurrentSchoolId } = useCurrentSchool();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Check user role and redirect accordingly
        const checkUserRoleAndRedirect = async () => {
          try {
            // First check if user is an administrator
            const { data: adminData, error: adminError } = await supabase
              .from('administrators')
              .select('id, role, school_id, status')
              .eq('user_id', user.id)
              .eq('status', 'active')
              .single();

            if (adminError && adminError.code !== 'PGRST116') {
              console.error('Error checking admin status:', adminError);
            }

            if (adminData) {
              // Set current school for administrators
              if (adminData.school_id) {
                setCurrentSchoolId(adminData.school_id);
              } else {
                setCurrentSchoolId(null);
              }
              // User is an administrator, redirect to admin dashboard
              navigate('/administrator/dashboard');
              return;
            }

            // Check if user has school assignments
            const { data: schoolData, error: schoolError } = await supabase
              .from('users_to_schools')
              .select('school_id, role')
              .eq('user_id', user.id)
              .eq('is_active', true)
              .single();

            if (schoolError && schoolError.code !== 'PGRST116') {
              console.error('Error checking school assignment:', schoolError);
            }

            if (schoolData) {
              // Ensure context reflects assigned school
              if (schoolData.school_id) {
                setCurrentSchoolId(schoolData.school_id);
              }
              // User has school access
              if (currentSchoolId || schoolData.school_id) {
                navigate('/school/dashboard');
              } else {
                const defaultSchoolId = getDefaultSchoolId();
                if (defaultSchoolId) {
                  setCurrentSchoolId(defaultSchoolId);
                }
                navigate('/school-management/dashboard');
              }
            } else {
              // Regular user or no specific role
              if (currentSchoolId) {
                navigate('/school/dashboard');
              } else {
                const defaultSchoolId = getDefaultSchoolId();
                if (defaultSchoolId) {
                  setCurrentSchoolId(defaultSchoolId);
                }
                navigate('/school-management/dashboard');
              }
            }
          } catch (error) {
            console.error('Error checking user role:', error);
            // Fallback to school management dashboard
            navigate('/school-management/dashboard');
          }
        };

        checkUserRoleAndRedirect();
      } else {
        navigate('/auth/login');
      }
    }
  }, [navigate, user, loading, currentSchoolId, setCurrentSchoolId]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default Index;
