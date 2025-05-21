
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
}

interface Session {
  access_token: string;
  refresh_token: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      setUserSession(session);
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
        });
      }
      
      setLoading(false);
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUserSession(session);
          setUser(session?.user ? {
            id: session.user.id,
            email: session.user.email || '',
          } : null);
        }
      );
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);
  
  return {
    user,
    userSession,
    loading,
  };
};
