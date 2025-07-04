'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  coins?: number;
  unlocked_courses?: string[];
}

const UserContext = createContext<{
  user: User | null,
  setUser: (user: User | null) => void,
  refetchUser: () => Promise<void>,
  unlockCourse: (courseSlug: string) => Promise<void>
}>({
  user: null,
  setUser: () => {},
  refetchUser: async () => {},
  unlockCourse: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Fetch user from backend
  const refetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
    }
  };

  // Hydrate user on mount
  useEffect(() => {
    refetchUser();
  }, []);

  const unlockCourse = async (courseSlug: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/users/unlock-course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseSlug }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || 'Failed to unlock course');
    // After unlocking, refetch user to get updated coins and unlocked_courses
    await refetchUser();
  };

  return (
    <UserContext.Provider value={{ user, setUser, refetchUser, unlockCourse }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);