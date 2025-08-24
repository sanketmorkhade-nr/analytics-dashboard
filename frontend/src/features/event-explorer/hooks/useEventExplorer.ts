import { useState, useEffect, useCallback } from 'react';
import { eventExplorerService } from '../services/eventExplorerService';
import type { SearchResponse } from '@/shared/types/api';

export interface EventExplorerFilters {
  startDate: string;
  endDate: string;
  company: string;
  companies?: string[];
}

export interface EventExplorerState {
  query: string;
  filters: EventExplorerFilters;
  page: number;
  pageSize: number;
}

export const useEventExplorer = () => {
  const [state, setState] = useState<EventExplorerState>({
    query: '',
    filters: {
      startDate: '',
      endDate: '',
      company: '',
      companies: [],
    },
    page: 1,
    pageSize: 10,
  });

  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        query: state.query || undefined,
        startDate: state.filters.startDate || undefined,
        endDate: state.filters.endDate || undefined,
        company: state.filters.company || undefined,
        companies: state.filters.companies || undefined,
        page: state.page,
        pageSize: state.pageSize,
      };

      const response = await eventExplorerService.searchEvents(params);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [state]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [fetchData]);

  const setQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query, page: 1 }));
  }, []);

  const setFilters = useCallback((filters: Partial<EventExplorerFilters>) => {
    setState(prev => ({ 
      ...prev, 
      filters: { ...prev.filters, ...filters },
      page: 1 
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setState(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const resetAll = useCallback(() => {
    setState({
      query: '',
      filters: {
        startDate: '',
        endDate: '',
        company: '',
        companies: [],
      },
      page: 1,
      pageSize: 10,
    });
  }, []);

  return {
    // State
    query: state.query,
    filters: state.filters,
    data,
    loading,
    error,
    page: state.page,
    pageSize: state.pageSize,

    // Actions
    setQuery,
    setFilters,
    setPage,
    setPageSize,
    resetAll,
  };
};
