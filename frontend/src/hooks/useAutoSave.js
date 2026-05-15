import { useState, useCallback } from 'react';
import { useEffect, useRef } from 'react';

/**
 * Debounce a value — used for auto-save triggers.
 */
export const useDebounce = (value, delay = 1000) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

/**
 * Auto-save hook — calls saveFn after content has stopped changing for `delay` ms.
 * Returns: { isSaving, lastSaved }
 */
export const useAutoSave = (content, saveFn, delay = 1500) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const debouncedContent = useDebounce(content, delay);
  const isFirstRender = useRef(true);
  const previousContent = useRef(content);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousContent.current = debouncedContent;
      return;
    }
    if (debouncedContent === previousContent.current) return;

    previousContent.current = debouncedContent;

    const doSave = async () => {
      setIsSaving(true);
      try {
        await saveFn(debouncedContent);
        setLastSaved(new Date());
      } catch (e) {
        console.error('Auto-save failed:', e);
      } finally {
        setIsSaving(false);
      }
    };

    doSave();
  }, [debouncedContent, saveFn]);

  return { isSaving, lastSaved };
};

/**
 * Search state hook with debouncing — for the notes explorer search bar.
 */
export const useSearch = (delay = 300) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, delay);
  return { query, setQuery, debouncedQuery };
};
