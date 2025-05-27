import { supabase } from '@/integrations/supabase/client';
import { evaluateSessionsStatus, evaluateAndSyncSessionsStatus, type SessionStatus } from '@/utils/sessionUtils';

export interface Session {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  school_id: string;
  created_at: string;
  updated_at: string | null;
  is_active: boolean | null;
  is_current: boolean | null;
  computed_status?: SessionStatus;
}

export const getSessions = async () => {
  try {
    console.log('Fetching sessions with school-based filtering...');
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return [];
    }

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} sessions for user's assigned school`);
    
    // Evaluate sessions with computed status and check if system status needs updating
    const sessionsWithStatus = evaluateAndSyncSessionsStatus(data || []);
    
    // Auto-update sessions that should be active based on date
    const sessionsToUpdate = sessionsWithStatus.filter(session => session.should_update_system_status);
    
    if (sessionsToUpdate.length > 0) {
      console.log('Auto-updating sessions to active based on current date:', sessionsToUpdate);
      
      // Update each session that should be active
      for (const session of sessionsToUpdate) {
        await updateSession(session.id, {
          status: 'active',
          is_active: true
        });
      }
      
      // Refetch updated data
      const { data: updatedData, error: refetchError } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (refetchError) throw refetchError;
      
      const finalSessionsWithStatus = evaluateSessionsStatus(updatedData || []);
      return finalSessionsWithStatus.map(session => ({
        ...session,
        computed_status: session.status as SessionStatus
      }));
    }
    
    return sessionsWithStatus.map(session => ({
      ...session,
      computed_status: session.computed_status
    }));
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

export const createSession = async (sessionData: Omit<Session, 'id' | 'created_at' | 'updated_at' | 'is_active' | 'is_current'>) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert(sessionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

export const updateSession = async (id: string, sessionData: Partial<Omit<Session, 'id' | 'created_at' | 'updated_at'>>) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .update(sessionData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
};

export const deleteSession = async (id: string) => {
  try {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting session:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
};
