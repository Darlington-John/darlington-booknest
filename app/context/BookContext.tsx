
'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const BookContext = createContext<any>(null);

export const BookProvider = ({ children }: { children: React.ReactNode }) => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/donated-books');

        if (res.ok) {
          const data = await res.json();
          setBooks(data.books);
        } else {
          console.error('Failed to fetch books');
        }
      } catch (err) {
        console.error('Failed to fetch books', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);
  const providerValue = useMemo(() => ({
  books,
    loading
  }), [
books, 
    loading
  ]);
  return (
    <BookContext.Provider value={providerValue}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => useContext(BookContext);
