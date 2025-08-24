import type { UsageEvent } from '@/shared/types/api';

export interface ExportOptions {
  format: 'csv' | 'json';
  filename?: string;
  includeHeaders?: boolean;
}

export interface ExportData {
  events: UsageEvent[];
  filters?: {
    startDate?: string;
    endDate?: string;
    companies?: string[];
    query?: string;
  };
}

/**
 * Converts data to CSV format
 */
export const convertToCSV = (data: ExportData): string => {
  const { events } = data;
  
  if (!events || events.length === 0) {
    return '';
  }

  // Define CSV headers based on UsageEvent structure
  const headers = [
    'ID',
    'Created At',
    'Company Name',
    'Type',
    'Content',
    'Attribute',
    'User',
    'Endpoint',
    'Updated At',
    'Original Timestamp',
    'Value'
  ];

  // Convert events to CSV rows
  const rows = events.map(event => [
    event.id || '',
    event.created_at || '',
    event.companyName || '',
    event.type || '',
    event.content || '',
    event.attribute || '',
    event.user || '',
    event.endpoint || '',
    event.updated_at || '',
    event.original_timestamp || '',
    event.value || ''
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
};

/**
 * Converts data to JSON format
 */
export const convertToJSON = (data: ExportData): string => {
  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      totalRecords: data.events.length,
      filters: data.filters || {}
    },
    data: data.events
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Generates filename with timestamp and format
 */
export const generateFilename = (format: 'csv' | 'json', filters?: ExportData['filters']): string => {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const time = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '-'); // HH-MM-SS
  
  let filename = `analytics-export-${timestamp}-${time}`;
  
  // Add filter information to filename if available
  if (filters) {
    if (filters.startDate && filters.endDate) {
      filename += `-${filters.startDate}-to-${filters.endDate}`;
    }
    if (filters.companies && filters.companies.length > 0) {
      const companySuffix = filters.companies.length === 1 
        ? filters.companies[0] 
        : `${filters.companies.length}-companies`;
      filename += `-${companySuffix}`;
    }
  }
  
  return `${filename}.${format}`;
};

/**
 * Downloads data as a file
 */
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};

/**
 * Main export function
 */
export const exportData = async (
  data: ExportData,
  options: ExportOptions
): Promise<void> => {
  const { format, filename: customFilename } = options;
  
  try {
    let content: string;
    let mimeType: string;
    
    if (format === 'csv') {
      content = convertToCSV(data);
      mimeType = 'text/csv;charset=utf-8;';
    } else {
      content = convertToJSON(data);
      mimeType = 'application/json;charset=utf-8;';
    }
    
    if (!content) {
      throw new Error('No data to export');
    }
    
    const filename = customFilename || generateFilename(format, data.filters);
    downloadFile(content, filename, mimeType);
    
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error(`Failed to export data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Validates export data
 */
export const validateExportData = (data: ExportData): boolean => {
  return data.events && Array.isArray(data.events) && data.events.length > 0;
};
