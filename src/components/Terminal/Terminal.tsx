'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from './Terminal.module.css';

interface TerminalProps {
  initialPath?: string;
  onCommand?: (command: string) => string;
}

export default function Terminal({ initialPath = 'root@nexus-core:~#', onCommand }: TerminalProps) {
  const [history, setHistory] = useState<{ type: 'input' | 'output'; content: string }[]>([
    { type: 'output', content: 'NEXUS DYNAMICS SECURE TERMINAL v9.2.1' },
    { type: 'output', content: 'Type "help" for a list of commands.' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      const command = input.trim();
      setHistory(prev => [...prev, { type: 'input', content: `${initialPath} ${command}` }]);
      
      let output = 'Command not found.';
      if (onCommand) {
        output = onCommand(command);
      } else {
        if (command === 'help') output = 'Available commands: help, status, clear';
        if (command === 'status') output = 'SYSTEM OPERATIONAL.';
        if (command === 'clear') {
          setHistory([]);
          setInput('');
          return;
        }
      }

      setHistory(prev => [...prev, { type: 'output', content: output }]);
      setInput('');
    }
  };

  return (
    <div className={styles.terminal}>
      <div className={styles.header}>
        <div className={styles.controls}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <div className={styles.title}>NEXUS SECURE SHELL</div>
      </div>
      <div className={styles.body}>
        {history.map((line, idx) => (
          <div key={idx} className={line.type === 'input' ? styles.inputLine : styles.outputLine}>
            {line.content}
          </div>
        ))}
        <div className={styles.inputRow}>
          <span className={styles.prompt}>{initialPath}</span>
          <input 
            type="text" 
            className={styles.inputField} 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={handleKeyDown} 
            spellCheck={false}
            autoFocus
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
