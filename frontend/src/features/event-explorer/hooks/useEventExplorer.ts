import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventExplorerService } from '../services/eventExplorerService';
import { QUERY_KEYS, ERROR_MESSAGES, ANALYTICS_CONSTANTS } from '@/shared/constants/analytics';
import { 
  buildQueryKey,
  formatQueryError,
} from '@/shared/utils/queryUtils';

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
    page: ANALYTICS_CONSTANTS.DEFAULT_PAGE,
    pageSize: ANALYTICS_CONSTANTS.DEFAULT_PAGE_SIZE,
  });

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: buildQueryKey(QUERY_KEYS.EVENT_EXPLORER, state),
    queryFn: () => {
      const params = {
        query: state.query || undefined,
        startDate: state.filters.startDate || ANALYTICS_CONSTANTS.DEFAULT_DATE_RANGE.startDate,
        endDate: state.filters.endDate || ANALYTICS_CONSTANTS.DEFAULT_DATE_RANGE.endDate,
        company: state.filters.company || undefined,
        companies: state.filters.companies || undefined,
        page: state.page,
        pageSize: state.pageSize,
      };

      return eventExplorerService.searchEvents(params);
    },
  });

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
        startDate: ANALYTICS_CONSTANTS.DEFAULT_DATE_RANGE.startDate,
        endDate: ANALYTICS_CONSTANTS.DEFAULT_DATE_RANGE.endDate,
        company: '',
        companies: [],
      },
      page: ANALYTICS_CONSTANTS.DEFAULT_PAGE,
      pageSize: ANALYTICS_CONSTANTS.DEFAULT_PAGE_SIZE,
    });
  }, []);

  return {
    // State
    query: state.query,
    filters: state.filters,
    data,
    loading,
    error: formatQueryError(error, ERROR_MESSAGES.EVENT_EXPLORER_DATA),
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
