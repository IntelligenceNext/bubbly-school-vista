
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: 'administrator' | 'school_admin' | 'super_admin' | 'user';
  isAdmin?: boolean;
}

interface Session {
  access_token: string;
  refresh_token: string;
}

interface UserSchoolInfo {
  currentSchoolId: string | null;
  role: 'super_admin' | 'school_admin' | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to check user role and update user object
  const checkUserRole = async (userId: string) => {
    try {
      // Check if user is an administrator
      const { data: adminData, error: adminError } = await supabase
        .from('administrators')
        .select('id, role, school_id, status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (adminError && adminError.code !== 'PGRST116') {
        console.error('Error checking admin status:', adminError);
      }

      if (adminData) {
        return {
          role: 'administrator' as const,
          isAdmin: true,
        };
      }

      // Check if user has school assignments
      const { data: schoolData, error: schoolError } = await supabase
        .from('users_to_schools')
        .select('school_id, role')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (schoolError && schoolError.code !== 'PGRST116') {
        console.error('Error checking school assignment:', schoolError);
      }

      if (schoolData) {
        return {
          role: schoolData.role as 'school_admin' | 'super_admin' | 'user',
          isAdmin: false,
        };
      }

      return {
        role: 'user' as const,
        isAdmin: false,
      };
    } catch (error) {
      console.error('Error checking user role:', error);
      return {
        role: 'user' as const,
        isAdmin: false,
      };
    }
  };

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        // Get current session first
        const { data: { session } } = await supabase.auth.getSession();
        setUserSession(session);
        
        if (session?.user) {
          console.log('User data from session:', session.user);
          
          // Check user role
          const roleInfo = await checkUserRole(session.user.id);
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name,
            ...roleInfo,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setUserSession(session);
          
          if (session?.user) {
            console.log('Auth state changed, new user data:', session.user);
            
            // Check user role
            const roleInfo = await checkUserRole(session.user.id);
            
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name,
              ...roleInfo,
            });
          } else {
            setUser(null);
          }
        }
      );
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);
  
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      return { success: false, error };
    }
  };
  
  return {
    user,
    userSession,
    loading,
    logout,
  };
};

export const useUserSchool = (): UserSchoolInfo => {
  const [currentSchoolId, setCurrentSchoolId] = useState<string | null>(null);
  const [role, setRole] = useState<'super_admin' | 'school_admin' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserSchoolInfo = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // If user is an admin, they might have access to all schools
        if (user.isAdmin) {
          // Check if admin has a specific school assignment
          const { data: adminData, error: adminError } = await supabase
            .from('administrators')
            .select('school_id, role')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

          if (adminError && adminError.code !== 'PGRST116') {
            console.error('Error fetching admin school info:', adminError);
          } else if (adminData && adminData.school_id) {
            setCurrentSchoolId(adminData.school_id);
            setRole(adminData.role as 'super_admin' | 'school_admin');
          } else {
            // Admin with access to all schools
            setCurrentSchoolId(null);
            setRole('super_admin');
          }
        } else {
          // Regular user - get school assignment
          const { data: assignment, error } = await supabase
            .from('users_to_schools')
            .select('school_id, role')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .single();

          if (error) {
            console.error('Error fetching user school info:', error);
          } else if (assignment) {
            setCurrentSchoolId(assignment.school_id);
            setRole(assignment.role as 'super_admin' | 'school_admin');
          }
        }
      } catch (error) {
        console.error('Error in fetchUserSchoolInfo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSchoolInfo();
  }, [user?.id, user?.isAdmin]);

  return {
    currentSchoolId,
    role,
    isLoading,
  };
};
