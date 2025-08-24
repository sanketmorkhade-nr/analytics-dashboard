import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Badge } from '@/shared/components/ui/badge';
import { DatePicker } from '@/shared/components/ui/date-picker';
import { Filter, X, Check, ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { eventExplorerService, type Company } from '../services/eventExplorerService';

interface AdvancedFiltersProps {
  filters: {
    startDate: string;
    endDate: string;
    companies: string[];
  };
  onFiltersChange: (filters: { startDate: string; endDate: string; companies: string[] }) => void;
  onReset: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ filters, onFiltersChange, onReset }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(filters.companies || []);
  
  // Date picker states
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.endDate ? new Date(filters.endDate) : undefined
  );

  // Company multi-select states
  const [companySelectOpen, setCompanySelectOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState('');

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
    setSelectedCompanies(filters.companies || []);
    setStartDate(filters.startDate ? new Date(filters.startDate) : undefined);
    setEndDate(filters.endDate ? new Date(filters.endDate) : undefined);
  }, [filters]);

  // Fetch companies on component mount (only once)
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const response = await eventExplorerService.getCompanies();
      setCompanies(response.data || []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...localFilters,
      [key]: value,
    };
    setLocalFilters(newFilters);
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    const dateString = date ? format(date, 'yyyy-MM-dd') : '';
    handleFilterChange('startDate', dateString);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    const dateString = date ? format(date, 'yyyy-MM-dd') : '';
    handleFilterChange('endDate', dateString);
  };

  const handleCompanyToggle = (companyName: string) => {
    const newSelectedCompanies = selectedCompanies.includes(companyName)
      ? selectedCompanies.filter(c => c !== companyName)
      : [...selectedCompanies, companyName];
    
    setSelectedCompanies(newSelectedCompanies);
    setLocalFilters({
      ...localFilters,
      companies: newSelectedCompanies,
    });
  };

  const handleSelectAllCompanies = () => {
    const allCompanyNames = companies.map(c => c.name);
    setSelectedCompanies(allCompanyNames);
    setLocalFilters({
      ...localFilters,
      companies: allCompanyNames,
    });
  };

  const handleClearAllCompanies = () => {
    setSelectedCompanies([]);
    setLocalFilters({
      ...localFilters,
      companies: [],
    });
  };

  const handleApplyFilters = () => {
    const filtersToApply = {
      ...localFilters,
      companies: selectedCompanies,
    };
    onFiltersChange(filtersToApply);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      startDate: '',
      endDate: '',
      companies: [],
    };
    setLocalFilters(emptyFilters);
    setSelectedCompanies([]);
    setStartDate(undefined);
    setEndDate(undefined);
    setCompanySearch('');
    onFiltersChange(emptyFilters);
    onReset();
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  const hasActiveFilters = localFilters.startDate || localFilters.endDate || selectedCompanies.length > 0;
  const hasFilterChanges = localFilters.startDate !== filters.startDate || 
                          localFilters.endDate !== filters.endDate || 
                          JSON.stringify(selectedCompanies) !== JSON.stringify(filters.companies);
  const isApplyDisabled = !hasFilterChanges;

  const getCompanyDisplayText = () => {
    if (selectedCompanies.length === 0) {
      return "Select companies";
    }
    if (selectedCompanies.length === 1) {
      return selectedCompanies[0];
    }
    if (selectedCompanies.length === companies.length) {
      return "All companies";
    }
    return `${selectedCompanies.length} companies selected`;
  };

  return (
    <div className="space-y-4">
      {/* Filters Heading */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companies">Companies</Label>
          <Popover open={companySelectOpen} onOpenChange={setCompanySelectOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={companySelectOpen}
                className="w-full justify-between text-base"
              >
                <span className="truncate">{getCompanyDisplayText()}</span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <div className="space-y-2 p-3">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search companies..."
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAllCompanies}
                    className="h-7 px-2 text-xs"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAllCompanies}
                    className="h-7 px-2 text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto border-t">
                {loadingCompanies ? (
                  <div className="p-3 text-sm text-muted-foreground">Loading companies...</div>
                ) : filteredCompanies.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">
                    {companySearch ? "No companies found" : "No companies available"}
                  </div>
                ) : (
                  <div className="p-1">
                    {filteredCompanies.map((company) => (
                      <div
                        key={company.id}
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        onClick={() => handleCompanyToggle(company.name)}
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <div className={`h-4 w-4 rounded border ${
                            selectedCompanies.includes(company.name)
                              ? 'bg-primary border-primary'
                              : 'border-input'
                          }`}>
                            {selectedCompanies.includes(company.name) && (
                              <Check className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                          <span className="flex-1">{company.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {company.eventCount}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          {selectedCompanies.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedCompanies.map((companyName) => (
                <Badge
                  key={companyName}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => handleCompanyToggle(companyName)}
                >
                  {companyName}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <DatePicker
          date={startDate}
          onDateChange={handleStartDateChange}
          placeholder="Select start date"
          label="Start Date"
        />
        
        <DatePicker
          date={endDate}
          onDateChange={handleEndDateChange}
          placeholder="Select end date"
          label="End Date"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-end gap-2">
        {hasActiveFilters && (
          <Button variant="outline" onClick={handleClearFilters} className="gap-2 text-base order-2 sm:order-1">
            <X className="h-5 w-5" />
            Clear Filters
          </Button>
        )}
        <Button 
          onClick={handleApplyFilters} 
          disabled={isApplyDisabled}
          className="gap-2 text-base order-1 sm:order-2"
        >
          <Filter className="h-5 w-5" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default AdvancedFilters;
