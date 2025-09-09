"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "moneves_show_balance";

export function useShowBalance() {
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setShowBalance(JSON.parse(stored));
      }
    } catch (error) {
      console.warn("[useShowBalance] Failed to load from localStorage:", error);
      // Keep default value (true)
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever showBalance changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(showBalance));
      } catch (error) {
        console.warn("[useShowBalance] Failed to save to localStorage:", error);
      }
    }
  }, [showBalance, isLoaded]);

  const toggleBalance = () => {
    setShowBalance((prev) => !prev);
  };

  return {
    showBalance,
    setShowBalance,
    toggleBalance,
    isLoaded,
  };
}
