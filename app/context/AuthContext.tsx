
'use client';

import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  const [isDropped, setIsDropped] = useState(false);
    const linkname = usePathname();

    useEffect(() => {
setIsDropped(false);
    }, [linkname]);

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const DroppedRef = useRef<HTMLDivElement>(null);
    const toggleDroppedPopup = useCallback(() => {
      if (!isDropped) {
        setIsDropped(true);
        setIsPopupVisible(true);
      } else {
        setIsPopupVisible(false);
        setTimeout(() => setIsDropped(false), 500);
      }
    }, [isDropped]);


    const handleClickOutside = (event: MouseEvent) => {
      if (DroppedRef.current && !DroppedRef.current.contains(event.target as Node)) {
        setIsPopupVisible(false);
        setTimeout(() => setIsDropped(false), 500);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const providerValue = useMemo(() => ({
      user,
      isOverlayOpen,
      setIsOverlayOpen,
      isDropped,
      setIsDropped,
      DroppedRef,
      toggleDroppedPopup,
      isPopupVisible,
      setIsPopupVisible,
      loading,
    }), [
      user, 
      isOverlayOpen, 
      isDropped, 
      DroppedRef, 
      toggleDroppedPopup, 
      isPopupVisible, 
      loading
    ]);
  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
