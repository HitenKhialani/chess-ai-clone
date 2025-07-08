'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface SectionTimes {
  [section: string]: number;
}

interface TimeTrackerContextType {
  totalTime: number;
  sectionTimes: SectionTimes;
}

const TimeTrackerContext = createContext<TimeTrackerContextType>({
  totalTime: 0,
  sectionTimes: {},
});

const SECTION_MAP: { [key: string]: string } = {
  '/play': 'Play',
  '/learn': 'Learn',
  '/puzzles': "Mate'n Rush",
  '/analysis': 'Analysis',
  // Add more mappings as needed
};

function getSectionFromPath(path: string) {
  const entry = Object.entries(SECTION_MAP).find(([prefix]) => path.startsWith(prefix));
  return entry ? entry[1] : 'Other';
}

export const TimeTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [totalTime, setTotalTime] = useState(0);
  const [sectionTimes, setSectionTimes] = useState<SectionTimes>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sectionTimes');
      if (stored) return JSON.parse(stored);
    }
    return {};
  });
  const lastSection = useRef(getSectionFromPath(pathname));
  const lastTimestamp = useRef(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // On mount, fetch initial total and section times
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/users/section-times', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setTotalTime(data.total_time_spent || 0);
        setSectionTimes(data.section_times || {});
      });
  }, []);

  // Track time globally and per section
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    function sendTime(increment: number, section: string) {
      fetch('/api/users/increment-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ seconds: increment, section }),
      });
    }
    function tick() {
      const now = Date.now();
      const section = getSectionFromPath(pathname);
      const elapsed = Math.floor((now - lastTimestamp.current) / 1000);
      if (elapsed > 0) {
        setTotalTime(prev => prev + elapsed);
        setSectionTimes(prev => ({ ...prev, [section]: (prev[section] || 0) + elapsed }));
        sendTime(elapsed, section);
      }
      lastTimestamp.current = now;
      lastSection.current = section;
    }
    intervalRef.current = setInterval(tick, 10000); // every 10 seconds
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // On unmount, send any remaining time
      tick();
    };
    // eslint-disable-next-line
  }, [pathname]);

  // Persist sectionTimes to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sectionTimes', JSON.stringify(sectionTimes));
    }
  }, [sectionTimes]);

  return (
    <TimeTrackerContext.Provider value={{ totalTime, sectionTimes }}>
      {children}
    </TimeTrackerContext.Provider>
  );
};

export function useTimeTracker() {
  return useContext(TimeTrackerContext);
} 