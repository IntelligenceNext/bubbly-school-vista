
import { useState, useEffect } from 'react';
import { getUserSchoolAssignment, type UserSchoolAssignment } from '@/services/userSchoolService';
import { useAuth } from './useAuth';

export const useUserSchool = () => {
  const { user } = useAuth();
  const [userSchoolAssignment, setUserSchoolAssignment] = useState<UserSchoolAssignment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSchoolAssignment = async () => {
      if (!user) {
        setUserSchoolAssignment(null);
        setLoading(false);
        return;
      }

      try {
        const assignment = await getUserSchoolAssignment(user.id);
        setUserSchoolAssignment(assignment);
      } catch (error) {
        console.error('Error fetching user school assignment:', error);
        setUserSchoolAssignment(null);
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
    loading,
    refetch: async () => {
      if (user) {
        const assignment = await getUserSchoolAssignment(user.id);
        setUserSchoolAssignment(assignment);
      }
    }
  };
};
