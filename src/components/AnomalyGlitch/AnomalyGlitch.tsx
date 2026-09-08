'use client';
import React, { useEffect, useState } from 'react';
import styles from './AnomalyGlitch.module.css';

interface AnomalyGlitchProps {
  children: React.ReactNode;
  active?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export default function AnomalyGlitch({ children, active = false, intensity = 'low' }: AnomalyGlitchProps) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    if (!active) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGlitching(false);
      return;
    }

    let intervalId: NodeJS.Timeout;

    const triggerGlitch = () => {
      setGlitching(true);
      
      // Glitch lasts for 100-300ms
      setTimeout(() => {
        setGlitching(false);
      }, 100 + Math.random() * 200);

      // Next glitch in 3s to 15s depending on intensity
      const nextDelay = intensity === 'high' 
        ? 1000 + Math.random() * 3000 
        : 3000 + Math.random() * 12000;
        
      intervalId = setTimeout(triggerGlitch, nextDelay);
    };

    // Initial random delay
    intervalId = setTimeout(triggerGlitch, 1000 + Math.random() * 5000);

    return () => clearTimeout(intervalId);
  }, [active, intensity]);

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div className={`${styles.wrapper} ${glitching ? styles[`glitch-${intensity}`] : ''}`}>
      {children}
      {glitching && <div className={styles.overlay} />}
    </div>
  );
}
