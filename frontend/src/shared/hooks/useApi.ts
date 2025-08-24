import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  fetchData: () => Promise<void>;
  setData: (data: T) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useApi = <T>(
  apiCall: () => Promise<T>,
  immediate: boolean = false
): UseApiReturn<T> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await apiCall();
      setState(prev => ({ ...prev, data: result, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [apiCall]);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  // Call fetchData immediately if requested
  if (immediate && !state.data && !state.loading && !state.error) {
    fetchData();
  }

  return {
    ...state,
    fetchData,
    setData,
    setError,
    setLoading,
  };
};
