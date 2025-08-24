import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/shared/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Input } from '@/shared/components/ui/input';
import { format, parseISO } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import { Table as TableIcon, Search, X } from 'lucide-react';
import type { UsageEvent, PaginationInfo } from '@/shared/types/api';
import { ExportButton } from '@/shared/components/ExportButton';
import type { ExportData } from '@/shared/utils/exportUtils';

interface DataTableProps {
  events: UsageEvent[];
  pagination: PaginationInfo | null;
  loading: boolean;
  query: string;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange: (query: string) => void;
  filters?: {
    startDate?: string;
    endDate?: string;
    companies?: string[];
  };
  exportData?: ExportData;
}

const DataTable: React.FC<DataTableProps> = ({ 
  events, 
  pagination, 
  loading, 
  query,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  filters,
  exportData
}) => {
  const formatDate = (timestamp: string) => {
    try {
      const date = parseISO(timestamp);
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch {
      return timestamp;
    }
  };

  // Use provided export data or create from current table view
  const tableExportData: ExportData = exportData || {
    events: events,
    filters: {
      startDate: filters?.startDate,
      endDate: filters?.endDate,
      companies: filters?.companies,
      query: query
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Table Heading with Search */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TableIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Usage Events</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search by company name, user email, or endpoint..."
                value={query}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-10 text-base h-10 bg-background border-2 border-input hover:border-primary/50 focus:border-primary shadow-sm"
              />
              {query && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <ExportButton 
              data={tableExportData}
              disabled={!events || events.length === 0}
            />
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-4 font-bold">Company</TableHead>
                <TableHead className="px-6 py-4 font-bold">User</TableHead>
                <TableHead className="px-6 py-4 font-bold">Endpoint</TableHead>
                <TableHead className="px-6 py-4 font-bold">Timestamp</TableHead>
                <TableHead className="px-6 py-4 text-right font-bold">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="space-y-4">
        {/* Table Heading with Search */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TableIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Usage Events</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search by company name, user email, or endpoint..."
                value={query}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-10 text-base h-10 bg-background border-2 border-input hover:border-primary/50 focus:border-primary shadow-sm"
              />
              {query && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {tableExportData && (
              <ExportButton 
                data={tableExportData}
                disabled={!events || events.length === 0}
              />
            )}
          </div>
        </div>
        
        <div className="rounded-md border">
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No events found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Heading with Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TableIcon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Usage Events</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search by company name, user email, or endpoint..."
              value={query}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10 text-base h-10 bg-background border-2 border-input hover:border-primary/50 focus:border-primary shadow-sm"
            />
            {query && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {tableExportData && (
            <ExportButton 
              data={tableExportData}
              disabled={!events || events.length === 0}
            />
          )}
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4 font-bold">Company</TableHead>
              <TableHead className="px-6 py-4 font-bold">User</TableHead>
              <TableHead className="px-6 py-4 font-bold">Endpoint</TableHead>
              <TableHead className="px-6 py-4 font-bold">Timestamp</TableHead>
              <TableHead className="px-6 py-4 text-right font-bold">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} className="hover:bg-muted/50">
                <TableCell className="px-6 py-4 font-medium text-base">
                  {event.companyName || 'N/A'}
                </TableCell>
                <TableCell className="px-6 py-4 text-base text-muted-foreground">
                  {event.user || 'N/A'}
                </TableCell>
                <TableCell className="px-6 py-4 font-mono text-base">
                  {event.endpoint || 'N/A'}
                </TableCell>
                <TableCell className="px-6 py-4 font-mono text-base">
                  {event.created_at ? formatDate(event.created_at) : 'N/A'}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  {event.value !== undefined && event.value !== null ? (
                    <span className="font-mono text-base">
                      {event.value.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-base">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-base text-muted-foreground whitespace-nowrap">
            Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of{' '}
            {pagination.totalItems} results
          </div>
          
          <div className="flex items-center gap-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => onPageChange(pagination.currentPage - 1)}
                    className={!pagination.hasPrev ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  const isActive = page === pagination.currentPage;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => onPageChange(page)}
                        isActive={isActive}
                        className={cn(
                          "cursor-pointer",
                          isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => onPageChange(pagination.currentPage + 1)}
                    className={!pagination.hasNext ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            
            {onPageSizeChange && (
              <div className="flex items-center gap-2">
                <span className="text-base text-muted-foreground whitespace-nowrap">Items per page:</span>
                <Select
                  value={pagination.pageSize.toString()}
                  onValueChange={(value) => onPageSizeChange(parseInt(value))}
                >
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
