import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Badge } from '@/shared/components/ui/badge';
import { DatePicker } from '@/shared/components/ui/date-picker';
import { Filter, X, Check, ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { retentionService, type Company } from '../services/retentionService';

interface RetentionFiltersProps {
  filters: {
    company?: string;
    startDate?: string;
    endDate?: string;
    cohortPeriod?: 'daily' | 'weekly' | 'monthly';
    minCohortSize?: number;
  };
  onFiltersChange: (filters: {
    company?: string;
    startDate?: string;
    endDate?: string;
    cohortPeriod?: 'daily' | 'weekly' | 'monthly';
    minCohortSize?: number;
  }) => void;
  onReset?: () => void;
}

const RetentionFilters: React.FC<RetentionFiltersProps> = ({ filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [selectedCompany, setSelectedCompany] = useState<string>(filters.company || '');
  
  // Date picker states
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.endDate ? new Date(filters.endDate) : undefined
  );

  // Company select states
  const [companySelectOpen, setCompanySelectOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState('');

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
    setSelectedCompany(filters.company || '');
    setStartDate(filters.startDate ? new Date(filters.startDate) : undefined);
    setEndDate(filters.endDate ? new Date(filters.endDate) : undefined);
  }, [filters]);

  // Fetch companies on component mount (only once)
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await retentionService.getCompanies();
      setCompanies(response.data || []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  const handleFilterChange = (key: string, value: string | number) => {
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

  const handleCompanySelect = (companyName: string) => {
    setSelectedCompany(companyName);
    const updatedFilters = {
      ...localFilters,
      company: companyName,
    };
    setLocalFilters(updatedFilters);
    setCompanySelectOpen(false);
  };

  const handleClearCompany = () => {
    setSelectedCompany('');
    const updatedFilters = {
      ...localFilters,
      company: '',
    };
    setLocalFilters(updatedFilters);
  };

  const handleApplyFilters = () => {
    const filtersToApply = {
      ...localFilters,
      company: selectedCompany,
    };
    // Update local state to match what we're applying
    setLocalFilters(filtersToApply);
    onFiltersChange(filtersToApply);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      company: '',
      startDate: '',
      endDate: '',
      cohortPeriod: 'daily' as const,
      minCohortSize: 5,
    };
    // Update all local state
    setLocalFilters(emptyFilters);
    setSelectedCompany('');
    setStartDate(undefined);
    setEndDate(undefined);
    setCompanySearch('');
    // Only call onFiltersChange, not onReset to avoid conflicts
    onFiltersChange(emptyFilters);
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  const hasActiveFilters = localFilters.startDate || localFilters.endDate || selectedCompany || (localFilters.minCohortSize && localFilters.minCohortSize !== 5);
  
  // Compare current local state with the original filters prop
  const hasFilterChanges = 
    localFilters.startDate !== filters.startDate || 
    localFilters.endDate !== filters.endDate || 
    selectedCompany !== (filters.company || '') ||
    (localFilters.cohortPeriod || 'daily') !== (filters.cohortPeriod || 'daily') ||
    (localFilters.minCohortSize || 5) !== (filters.minCohortSize || 5);
  
  const isApplyDisabled = !hasFilterChanges;

  const getCompanyDisplayText = () => {
    if (!selectedCompany) {
      return "All companies";
    }
    return selectedCompany;
  };

  return (
    <div className="space-y-4">
      {/* Filters Heading */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Company Filter */}
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
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
                <div className="max-h-60 overflow-y-auto space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCompanySelect('')}
                    className="w-full justify-start h-8 px-2 text-sm"
                  >
                    <Check className={`mr-2 h-4 w-4 ${!selectedCompany ? 'opacity-100' : 'opacity-0'}`} />
                    All companies
                  </Button>
                  {filteredCompanies.map((company) => (
                    <Button
                      key={company.name}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCompanySelect(company.name)}
                      className="w-full justify-start h-8 px-2 text-sm"
                    >
                      <Check className={`mr-2 h-4 w-4 ${selectedCompany === company.name ? 'opacity-100' : 'opacity-0'}`} />
                      {company.name}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <DatePicker
            date={startDate}
            onDateChange={handleStartDateChange}
            placeholder="Select start date"
          />
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <DatePicker
            date={endDate}
            onDateChange={handleEndDateChange}
            placeholder="Select end date"
          />
        </div>

        {/* Cohort Period */}
        <div className="space-y-2">
          <Label htmlFor="cohortPeriod">Cohort Period</Label>
                      <Select
              value={localFilters.cohortPeriod || 'daily'}
              onValueChange={(value) => handleFilterChange('cohortPeriod', value)}
            >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Minimum Cohort Size */}
        <div className="space-y-2">
          <Label htmlFor="minCohortSize">Min Cohort Size</Label>
          <Input
            id="minCohortSize"
            type="number"
            min="1"
            value={localFilters.minCohortSize || 5}
            onChange={(e) => handleFilterChange('minCohortSize', parseInt(e.target.value) || 5)}
            placeholder="5"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCompany && (
            <Badge variant="secondary" className="gap-1">
              Company: {selectedCompany}
              <X className="h-3 w-3 cursor-pointer" onClick={handleClearCompany} />
            </Badge>
          )}
          {localFilters.startDate && (
            <Badge variant="secondary">
              From: {format(new Date(localFilters.startDate), 'MMM dd, yyyy')}
            </Badge>
          )}
          {localFilters.endDate && (
            <Badge variant="secondary">
              To: {format(new Date(localFilters.endDate), 'MMM dd, yyyy')}
            </Badge>
          )}
          {localFilters.cohortPeriod && localFilters.cohortPeriod !== 'daily' && (
            <Badge variant="secondary">
              Period: {localFilters.cohortPeriod}
            </Badge>
          )}
          {localFilters.minCohortSize && localFilters.minCohortSize !== 5 && (
            <Badge variant="secondary">
              Min Size: {localFilters.minCohortSize}
            </Badge>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleClearFilters} className="gap-2">
          <X className="h-4 w-4" />
          Clear All
        </Button>
        <Button onClick={handleApplyFilters} disabled={isApplyDisabled} className="gap-2">
          <Filter className="h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default RetentionFilters;
