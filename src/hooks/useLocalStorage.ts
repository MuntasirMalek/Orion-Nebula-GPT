import { useState, useEffect, useRef } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    }
  });

  const timeoutRef = useRef<any>(null);
  const latestValueRef = useRef<T>(storedValue);
  latestValueRef.current = storedValue;

  // Flush to localStorage immediately on unmount or tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        window.localStorage.setItem(key, JSON.stringify(latestValueRef.current));
      } catch {
        // Silent fallback
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      try {
        window.localStorage.setItem(key, JSON.stringify(latestValueRef.current));
      } catch {
        // Silent fallback
      }
    };
  }, [key]);

  // Debounced write: Batches disk I/O so streaming 50 tokens/sec never freezes the main thread
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.warn(`Error writing to localStorage key "${key}":`, error);
      }
    }, 250);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
