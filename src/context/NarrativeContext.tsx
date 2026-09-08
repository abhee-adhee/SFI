'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { StatusLevel } from '@/components/SystemStatus/SystemStatus';

interface NarrativeContextType {
  systemState: StatusLevel;
  setSystemState: (state: StatusLevel) => void;
}

const NarrativeContext = createContext<NarrativeContextType>({
  systemState: 'OPERATIONAL',
  setSystemState: () => {},
});

export const useNarrative = () => useContext(NarrativeContext);

export const NarrativeProvider = ({ children }: { children: React.ReactNode }) => {
  const [systemState, setSystemState] = useState<StatusLevel>('OPERATIONAL');

  useEffect(() => {
    // Hidden dev control for toggling state across the entire app
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D' && process.env.NODE_ENV === 'development') {
        setSystemState(prev => prev === 'OPERATIONAL' ? 'DEGRADED' : prev === 'DEGRADED' ? 'COMPROMISED' : 'OPERATIONAL');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <NarrativeContext.Provider value={{ systemState, setSystemState }}>
      {children}
    </NarrativeContext.Provider>
  );
};
