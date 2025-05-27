
import { format, isAfter, isBefore, isWithinInterval, parseISO } from 'date-fns';

export type SessionStatus = 'Active Session' | 'Inactive - Past Session' | 'Inactive - Upcoming Session';

export interface SessionWithStatus {
  id?: string;
  name: string;
  start_date: string;
  end_date: string;
  status: SessionStatus;
  [key: string]: any; // Allow for additional properties
}

/**
 * Evaluates a single session's status based on the current date
 * @param session - Session object with start_date and end_date
 * @param currentDate - Optional current date (defaults to today)
 * @returns Session status
 */
export const evaluateSessionStatus = (
  session: { start_date: string; end_date: string },
  currentDate: Date = new Date()
): SessionStatus => {
  try {
    const startDate = parseISO(session.start_date);
    const endDate = parseISO(session.end_date);
    
    // Check if current date is within the session period (inclusive)
    if (isWithinInterval(currentDate, { start: startDate, end: endDate })) {
      return 'Active Session';
    }
    
    // Check if current date is after the end date
    if (isAfter(currentDate, endDate)) {
      return 'Inactive - Past Session';
    }
    
    // Current date is before the start date
    if (isBefore(currentDate, startDate)) {
      return 'Inactive - Upcoming Session';
    }
    
    // Fallback (should not reach here with valid dates)
    return 'Inactive - Upcoming Session';
  } catch (error) {
    console.error('Error evaluating session status:', error);
    return 'Inactive - Upcoming Session';
  }
};

/**
 * Evaluates multiple sessions and updates their status
 * @param sessions - Array of session objects
 * @param currentDate - Optional current date (defaults to today)
 * @returns Array of sessions with updated status
 */
export const evaluateSessionsStatus = <T extends { start_date: string; end_date: string }>(
  sessions: T[],
  currentDate: Date = new Date()
): (T & { status: SessionStatus })[] => {
  return sessions.map(session => ({
    ...session,
    status: evaluateSessionStatus(session, currentDate)
  }));
};

/**
 * Gets the currently active session from a list of sessions
 * @param sessions - Array of session objects
 * @param currentDate - Optional current date (defaults to today)
 * @returns The active session or null if none found
 */
export const getCurrentActiveSession = <T extends { start_date: string; end_date: string }>(
  sessions: T[],
  currentDate: Date = new Date()
): (T & { status: SessionStatus }) | null => {
  const evaluatedSessions = evaluateSessionsStatus(sessions, currentDate);
  return evaluatedSessions.find(session => session.status === 'Active Session') || null;
};

/**
 * Gets sessions grouped by their status
 * @param sessions - Array of session objects
 * @param currentDate - Optional current date (defaults to today)
 * @returns Object with sessions grouped by status
 */
export const getSessionsByStatus = <T extends { start_date: string; end_date: string }>(
  sessions: T[],
  currentDate: Date = new Date()
) => {
  const evaluatedSessions = evaluateSessionsStatus(sessions, currentDate);
  
  return {
    active: evaluatedSessions.filter(s => s.status === 'Active Session'),
    past: evaluatedSessions.filter(s => s.status === 'Inactive - Past Session'),
    upcoming: evaluatedSessions.filter(s => s.status === 'Inactive - Upcoming Session')
  };
};

/**
 * Formats session dates for display
 * @param session - Session object
 * @returns Formatted date string
 */
export const formatSessionDates = (session: { start_date: string; end_date: string }): string => {
  try {
    const startDate = parseISO(session.start_date);
    const endDate = parseISO(session.end_date);
    return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
  } catch (error) {
    return 'Invalid dates';
  }
};
