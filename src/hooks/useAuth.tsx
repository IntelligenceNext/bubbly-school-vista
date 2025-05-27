
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  full_name?: string;
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
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUserSession(session);
          
          if (session?.user) {
            console.log('Auth state changed, new user data:', session.user);
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name,
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
        // Get user school assignment
        const { data: assignment, error } = await supabase
          .from('user_school_assignments')
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
      } catch (error) {
        console.error('Error in fetchUserSchoolInfo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSchoolInfo();
  }, [user?.id]);

  return {
    currentSchoolId,
    role,
    isLoading,
  };
};
