# Frontend Architecture - Usage Analytics Dashboard

**File Path:** /docs/05_frontend_architecture.md  
**Last Updated:** 2025-01-27  
**Author:** AI-Agent  

---

## Overview

This document defines the frontend architecture for the Usage Analytics Dashboard POC, including component structure, state management, and integration with shadcn/ui and Recharts libraries. The architecture follows a feature-based folder structure to improve maintainability, scalability, and team collaboration.

---

## Feature-Based Architecture Benefits

### Structure Overview
The frontend follows a feature-based architecture with two main directories:

1. **`/features`** - Contains feature-specific code organized by business domain
   - Each feature has its own components, hooks, services, and types
   - Features are self-contained and can be developed independently
   - Clear separation of concerns and responsibilities

2. **`/shared`** - Contains reusable code across multiple features
   - UI components, utilities, and common services
   - Shared hooks and context providers
   - Base types and interfaces

### Benefits
- **Maintainability**: Related code is co-located, making it easier to find and modify
- **Scalability**: New features can be added without affecting existing code
- **Team Collaboration**: Multiple developers can work on different features simultaneously
- **Code Reusability**: Shared components and utilities reduce duplication
- **Testing**: Feature-specific code can be tested in isolation
- **Bundle Splitting**: Features can be lazy-loaded for better performance

---

## Technology Stack

### Core Technologies
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui components
- **Charts**: Recharts library
- **State Management**: React Context + useState
- **HTTP Client**: Axios or fetch API
- **Styling**: Tailwind CSS (via shadcn/ui)

### shadcn/ui Installation

**Important**: To install shadcn/ui, you must follow the official documentation for Vite. Run the CLI command `npx shadcn-ui@latest init` and follow the prompts. Do not attempt to set up the library manually.

**Official Guide**: https://ui.shadcn.com/docs/installation/vite

**Installation Steps**:
1. Run `npx shadcn-ui@latest init`
2. Follow the CLI prompts to configure:
   - TypeScript support
   - Tailwind CSS configuration
   - CSS variables setup
   - Component location (recommended: `src/shared/components/ui`)
   - Import aliases
3. Install individual components as needed: `npx shadcn-ui@latest add button card select input`

### Key Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.0",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-dialog": "^1.0.0",
  "@radix-ui/react-dropdown-menu": "^2.0.0",
  "recharts": "^2.8.0",
  "date-fns": "^2.30.0",
  "axios": "^1.6.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

---

## Project Structure

```
src/
├── features/                    # Feature-specific code
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── MetricsGrid.tsx
│   │   │   ├── MetricsCard.tsx
│   │   │   └── DashboardHeader.tsx
│   │   ├── hooks/
│   │   │   ├── useDashboardData.ts
│   │   │   └── useMetrics.ts
│   │   ├── services/
│   │   │   └── dashboardService.ts
│   │   └── types/
│   │       └── dashboard.ts
│   ├── analytics/
│   │   ├── components/
│   │   │   ├── TrendsChart.tsx
│   │   │   ├── EventTypeChart.tsx
│   │   │   ├── CompanyChart.tsx
│   │   │   └── ChartContainer.tsx
│   │   ├── hooks/
│   │   │   ├── useAnalytics.ts
│   │   │   └── useTrends.ts
│   │   ├── services/
│   │   │   └── analyticsService.ts
│   │   └── types/
│   │       └── analytics.ts
│   └── search/
│       ├── components/
│       │   ├── DataTable.tsx
│       │   ├── SearchBar.tsx
│       │   ├── Pagination.tsx
│       │   └── ExportButton.tsx
│       ├── hooks/
│       │   ├── useSearch.ts
│       │   └── useFilters.ts
│       ├── services/
│       │   └── searchService.ts
│       └── types/
│           └── search.ts
├── shared/                      # Reusable components, hooks, and utils
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── select.tsx
│   │   │   ├── input.tsx
│   │   │   ├── date-picker.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── alert.tsx
│   │   │   └── badge.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── Navigation.tsx
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── EmptyState.tsx
│   │       └── Tooltip.tsx
│   ├── hooks/
│   │   ├── useApi.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── dataService.ts
│   │   └── exportService.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── data.ts
│   │   └── ui.ts
│   ├── utils/
│   │   ├── dateUtils.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   └── context/
│       ├── DataContext.tsx
│       ├── FilterContext.tsx
│       └── ThemeContext.tsx
├── pages/                       # Page components
│   ├── Dashboard.tsx
│   ├── Analytics.tsx
│   └── Search.tsx
└── App.tsx
```

---

## Component Architecture

### 1. Layout Components

#### MainLayout
```typescript
interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};
```

#### Header
- **Location**: `shared/components/layout/Header.tsx`
- **Purpose**: Application header with navigation and user controls
- **Components**: shadcn/ui Button, DropdownMenu
- **Features**: Navigation menu, theme toggle, user menu

#### Sidebar
- **Location**: `shared/components/layout/Sidebar.tsx`
- **Purpose**: Navigation sidebar with menu items
- **Components**: shadcn/ui NavigationMenu
- **Features**: Dashboard, Analytics, Search navigation

### 2. Dashboard Components

#### Dashboard
- **Location**: `features/dashboard/components/Dashboard.tsx`
```typescript
const Dashboard: React.FC = () => {
  const { metrics, trends, loading, error } = useDashboardData();
  
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <MetricsGrid metrics={metrics} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendsChart data={trends} />
        <EventTypeChart data={metrics.eventTypes} />
      </div>
    </div>
  );
};
```

#### MetricsGrid
- **Location**: `features/dashboard/components/MetricsGrid.tsx`
- **Purpose**: Display key metrics in card format
- **Components**: shadcn/ui Card, Badge, Typography
- **Features**: Total events, active companies, top event types

#### MetricsCard
- **Location**: `features/dashboard/components/MetricsCard.tsx`
```typescript
interface MetricsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, subtitle, trend }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {trend && (
          <Badge variant={trend.isPositive ? "default" : "destructive"}>
            {trend.isPositive ? "+" : "-"}{trend.value}%
          </Badge>
        )}
      </div>
    </Card>
  );
};
```

### 3. Chart Components

#### TrendsChart
- **Location**: `features/analytics/components/TrendsChart.tsx`
```typescript
interface TrendsChartProps {
  data: TimeSeriesData[];
  timeframe: 'daily' | 'weekly' | 'monthly';
  loading?: boolean;
}

const TrendsChart: React.FC<TrendsChartProps> = ({ data, timeframe, loading }) => {
  if (loading) return <ChartSkeleton />;
  
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Usage Trends ({timeframe})</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => format(new Date(value), 'MMM dd')}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
```

#### EventTypeChart
- **Location**: `features/analytics/components/EventTypeChart.tsx`
- **Purpose**: Display event type distribution
- **Components**: Recharts PieChart, Pie, Cell
- **Features**: Interactive pie chart with tooltips

#### CompanyChart
- **Location**: `features/analytics/components/CompanyChart.tsx`
- **Purpose**: Display company usage comparison
- **Components**: Recharts BarChart, Bar, XAxis, YAxis
- **Features**: Horizontal bar chart with company names

### 4. Filter Components

#### FilterPanel
- **Location**: `features/search/components/FilterPanel.tsx`
```typescript
const FilterPanel: React.FC = () => {
  const { filters, updateFilters, resetFilters } = useFilters();
  
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Filters
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DateRangePicker 
          value={filters.dateRange}
          onChange={(range) => updateFilters({ dateRange: range })}
        />
        <CompanyFilter 
          value={filters.companies}
          onChange={(companies) => updateFilters({ companies })}
        />
        <EventTypeFilter 
          value={filters.eventTypes}
          onChange={(types) => updateFilters({ eventTypes: types })}
        />
      </CardContent>
    </Card>
  );
};
```

#### DateRangePicker
- **Location**: `features/search/components/DateRangePicker.tsx`
- **Purpose**: Date range selection
- **Components**: shadcn/ui DatePicker, Popover, Calendar
- **Features**: Preset ranges, custom date selection

#### CompanyFilter
- **Location**: `features/search/components/CompanyFilter.tsx`
- **Purpose**: Multi-select company filter
- **Components**: shadcn/ui Select, Checkbox
- **Features**: Search within options, select all/none

#### EventTypeFilter
- **Location**: `features/search/components/EventTypeFilter.tsx`
- **Purpose**: Multi-select event type filter
- **Components**: shadcn/ui Select, Checkbox
- **Features**: Search within options, select all/none

### 5. Data Components

#### DataTable
- **Location**: `features/search/components/DataTable.tsx`
```typescript
interface DataTableProps {
  data: UsageEvent[];
  loading?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, loading, pagination, onPageChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-mono text-xs">{event.id}</TableCell>
                  <TableCell>{event.company_id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{event.content}</TableCell>
                  <TableCell>{format(new Date(event.created_at), 'MMM dd, yyyy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {pagination && (
          <Pagination 
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        )}
      </CardContent>
    </Card>
  );
};
```

#### SearchBar
- **Location**: `features/search/components/SearchBar.tsx`
- **Purpose**: Text search functionality
- **Components**: shadcn/ui Input, Button
- **Features**: Debounced search, search suggestions

#### Pagination
- **Location**: `features/search/components/Pagination.tsx`
- **Purpose**: Data pagination controls
- **Components**: shadcn/ui Button, Select
- **Features**: Page navigation, page size selection

---

## State Management

### 1. Context Providers

#### DataContext
- **Location**: `shared/context/DataContext.tsx`
```typescript
interface DataContextType {
  data: UsageEvent[];
  metrics: MetricsData;
  trends: TimeSeriesData[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<UsageEvent[]>([]);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [trends, setTrends] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [dataRes, metricsRes, trendsRes] = await Promise.all([
        searchService.getAllData(),
        dashboardService.getMetrics(),
        analyticsService.getTrends()
      ]);
      setData(dataRes.data);
      setMetrics(metricsRes);
      setTrends(trendsRes.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <DataContext.Provider value={{
      data,
      metrics,
      trends,
      loading,
      error,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};
```

#### FilterContext
- **Location**: `shared/context/FilterContext.tsx`
```typescript
interface FilterContextType {
  filters: FilterState;
  updateFilters: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);
```

### 2. Custom Hooks

#### Shared Hooks

##### useApi
- **Location**: `shared/hooks/useApi.ts`
```typescript
const useApi = <T>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('API request failed');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return { data, loading, error, fetchData };
};
```

##### useDebounce
- **Location**: `shared/hooks/useDebounce.ts`
```typescript
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

#### Feature-Specific Hooks

##### useDashboardData
- **Location**: `features/dashboard/hooks/useDashboardData.ts`
```typescript
import { dashboardService } from '../services/dashboardService';

const useDashboardData = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [metricsRes, companiesRes, distributionRes] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getTopCompanies(),
        dashboardService.getEventDistribution()
      ]);
      setMetrics({ ...metricsRes, companies: companiesRes, distribution: distributionRes });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { metrics, loading, error, refreshData: fetchData };
};
```

##### useFilters
- **Location**: `features/search/hooks/useFilters.ts`
```typescript
const useFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: null, end: null },
    companies: [],
    eventTypes: [],
    searchQuery: ''
  });

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      dateRange: { start: null, end: null },
      companies: [],
      eventTypes: [],
      searchQuery: ''
    });
  }, []);

  return { filters, updateFilters, resetFilters };
};
```

---

## API Integration

### 1. Service Layer

#### Base API Service
- **Location**: `shared/services/api.ts`
```typescript
class ApiService {
  private baseUrl = 'http://localhost:8080/api/v1';

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    
    const response = await fetch(`${this.baseUrl}${endpoint}?${queryParams}`);
    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

export const apiService = new ApiService();
```

#### Dashboard Service
- **Location**: `features/dashboard/services/dashboardService.ts`
```typescript
import { apiService } from '@/shared/services/api';

class DashboardService {
  async getMetrics(params?: MetricsParams): Promise<MetricsResponse> {
    return apiService.get('/metrics', params);
  }

  async getTopCompanies(): Promise<TopCompaniesResponse> {
    return apiService.get('/analytics/companies');
  }

  async getEventDistribution(): Promise<EventDistributionResponse> {
    return apiService.get('/analytics/event-distribution');
  }
}

export const dashboardService = new DashboardService();
```

#### Analytics Service
- **Location**: `features/analytics/services/analyticsService.ts`
```typescript
import { apiService } from '@/shared/services/api';

class AnalyticsService {
  async getTrends(params: TrendsParams): Promise<TimeSeriesResponse> {
    return apiService.get('/trends', params);
  }

  async getEventTypes(): Promise<EventTypesResponse> {
    return apiService.get('/events');
  }
}

export const analyticsService = new AnalyticsService();
```

#### Search Service
- **Location**: `features/search/services/searchService.ts`
```typescript
import { apiService } from '@/shared/services/api';

class SearchService {
  async getAllData(params?: PaginationParams): Promise<ApiResponse<UsageEvent[]>> {
    return apiService.get('/events', params);
  }

  async searchData(request: SearchRequest): Promise<SearchResponse> {
    return apiService.post('/events/search', request);
  }

  async getCompanies(): Promise<CompaniesResponse> {
    return apiService.get('/companies');
  }
}

export const searchService = new SearchService();
```

### 2. Error Handling

#### ErrorBoundary
```typescript
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="text-destructive">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                An error occurred while loading the application.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Styling and Theming

### 1. Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
    },
  },
  plugins: [],
};
```

### 2. CSS Variables
```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
```

---

## Performance Optimization

### 1. Code Splitting
```typescript
// Lazy load components
const Analytics = lazy(() => import('./pages/Analytics'));
const Search = lazy(() => import('./pages/Search'));

// Route-based code splitting
const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Suspense>
  );
};
```

### 2. Memoization
```typescript
// Memoize expensive components
const TrendsChart = memo<TrendsChartProps>(({ data, timeframe, loading }) => {
  // Component implementation
});

// Memoize expensive calculations
const processedData = useMemo(() => {
  return data.map(item => ({
    ...item,
    formattedDate: format(new Date(item.created_at), 'MMM dd, yyyy')
  }));
}, [data]);
```

### 3. Debouncing
```typescript
// Debounce search input
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

---

## Testing Strategy

### 1. Component Testing
```typescript
// Example test for MetricsCard
import { render, screen } from '@testing-library/react';
import { MetricsCard } from './MetricsCard';

describe('MetricsCard', () => {
  it('renders with correct title and value', () => {
    render(
      <MetricsCard 
        title="Total Events" 
        value={1234} 
        subtitle="Last 30 days" 
      />
    );
    
    expect(screen.getByText('Total Events')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
  });
});
```

### 2. Integration Testing
```typescript
// Example test for API integration
import { render, screen, waitFor } from '@testing-library/react';
import { DataProvider } from './context/DataContext';
import { Dashboard } from './pages/Dashboard';

describe('Dashboard Integration', () => {
  it('loads and displays data', async () => {
    render(
      <DataProvider>
        <Dashboard />
      </DataProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Total Events')).toBeInTheDocument();
    });
  });
});
```

---

## Deployment Configuration

### 1. Build Configuration
```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['@radix-ui/react-select', '@radix-ui/react-dialog']
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
```

### 2. Environment Configuration
```typescript
// config/environment.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
};
```
