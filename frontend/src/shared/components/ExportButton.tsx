import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/shared/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Download, FileText, FileJson, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { exportData, validateExportData, type ExportData, type ExportOptions } from '@/shared/utils/exportUtils';

interface ExportButtonProps {
  data: ExportData;
  disabled?: boolean;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  data, 
  disabled = false,
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleExport = async (format: 'csv' | 'json') => {
    if (!validateExportData(data)) {
      setErrorMessage('No data available to export');
      setExportStatus('error');
      return;
    }

    setIsExporting(true);
    setExportStatus('idle');
    setErrorMessage('');

    try {
      const options: ExportOptions = { format };
      await exportData(data, options);
      
      setExportStatus('success');
      
      // Reset success status after 3 seconds
      setTimeout(() => {
        setExportStatus('idle');
      }, 3000);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      setErrorMessage(message);
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  const isDataValid = validateExportData(data);
  const isDisabled = disabled || isExporting || !isDataValid;

  return (
    <div className={`relative ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            disabled={isDisabled}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="flex items-center gap-2 cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            Export as CSV
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleExport('json')}
            disabled={isExporting}
            className="flex items-center gap-2 cursor-pointer"
          >
            <FileJson className="h-4 w-4" />
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status Messages */}
      {exportStatus === 'success' && (
        <Alert className="absolute top-12 right-0 w-64 z-10 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Export completed successfully!
          </AlertDescription>
        </Alert>
      )}

      {exportStatus === 'error' && (
        <Alert className="absolute top-12 right-0 w-64 z-10 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Tooltip for disabled state */}
      {!isDataValid && (
        <div className="absolute top-12 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
          No data available to export
        </div>
      )}
    </div>
  );
};
