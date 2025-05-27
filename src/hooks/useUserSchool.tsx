
import { useState, useEffect } from 'react';
import { getUserSchoolAssignment, isSuperAdmin, type UserSchoolAssignment, type UserRole } from '@/services/userSchoolService';
import { useAuth } from './useAuth';

export const useUserSchool = () => {
  const { user } = useAuth();
  const [userSchoolAssignment, setUserSchoolAssignment] = useState<UserSchoolAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUserSuperAdmin, setIsUserSuperAdmin] = useState(false);

  useEffect(() => {
    const fetchUserSchoolAssignment = async () => {
      if (!user) {
        setUserSchoolAssignment(null);
        setIsUserSuperAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user is super admin
        const superAdminStatus = await isSuperAdmin();
        setIsUserSuperAdmin(superAdminStatus);

        // Get user school assignment
        const assignment = await getUserSchoolAssignment(user.id);
        setUserSchoolAssignment(assignment);
      } catch (error) {
        console.error('Error fetching user school assignment:', error);
        setUserSchoolAssignment(null);
        setIsUserSuperAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSchoolAssignment();
  }, [user]);

  return {
    userSchoolAssignment,
    schoolId: userSchoolAssignment?.school_id || null,
    userRole: userSchoolAssignment?.role || null,
    isSuperAdmin: isUserSuperAdmin,
    isSchoolAdmin: userSchoolAssignment?.role === 'school_admin',
    loading,
    refetch: async () => {
      if (user) {
        const superAdminStatus = await isSuperAdmin();
        setIsUserSuperAdmin(superAdminStatus);
        
        const assignment = await getUserSchoolAssignment(user.id);
        setUserSchoolAssignment(assignment);
      }
    }
  };
};
