
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrentSchoolContextType {
  currentSchoolId: string | null;
  setCurrentSchoolId: (schoolId: string | null) => void;
}

const CurrentSchoolContext = createContext<CurrentSchoolContextType | undefined>(undefined);

export const useCurrentSchool = () => {
  const context = useContext(CurrentSchoolContext);
  if (context === undefined) {
    throw new Error('useCurrentSchool must be used within a CurrentSchoolProvider');
  }
  return context;
};

interface CurrentSchoolProviderProps {
  children: ReactNode;
}

export const CurrentSchoolProvider: React.FC<CurrentSchoolProviderProps> = ({ children }) => {
  const [currentSchoolId, setCurrentSchoolIdState] = useState<string | null>(() => {
    // Initialize from localStorage if available
    return localStorage.getItem('currentSchoolId');
  });

  const setCurrentSchoolId = (schoolId: string | null) => {
    setCurrentSchoolIdState(schoolId);
    if (schoolId) {
      localStorage.setItem('currentSchoolId', schoolId);
    } else {
      localStorage.removeItem('currentSchoolId');
    }
  };

  return (
    <CurrentSchoolContext.Provider value={{ currentSchoolId, setCurrentSchoolId }}>
      {children}
    </CurrentSchoolContext.Provider>
  );
};
