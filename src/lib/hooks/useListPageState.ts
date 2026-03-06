import { useCallback, useEffect, useMemo, useState } from 'react';

import { useDebouncedValue, useLocalStorage } from '@mantine/hooks';
import { sortBy } from 'lodash';
import { DataTableSortStatus } from 'mantine-datatable';

import { ColumnDefinition } from '@/components/tables/ColumnSelector';

interface UseListPageStateProps<T extends Record<string, any>> {
  data: T[];
  pageSize?: number;
  // Allow dot-paths like 'manager.name' in addition to direct keys, and functions for computed fields
  searchFields?: (keyof T | string | ((item: T) => any))[];
  searchDebounce?: number;
  columns?: ColumnDefinition[];
  storageKey?: string;
  filterFn?: (item: T, filters: Record<string, any>) => boolean;
}

export function useListPageState<T extends Record<string, any>>({
  data,
  pageSize = 25,
  searchFields = [],
  searchDebounce = 300,
  columns = [],
  storageKey = 'list-page',
  filterFn,
  initialFilters = {} as Record<string, any>,
}: UseListPageStateProps<T> & { initialFilters?: Record<string, any> }) {
  // Validate data prop - provide helpful error message
  if (data !== undefined && data !== null && !Array.isArray(data)) {
    console.error('useListPageState: data prop must be an array. Received:', typeof data, data);
  }
  // Search
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, searchDebounce);

  // Filters
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [filterDrawerOpened, setFilterDrawerOpened] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  // Selected item for detail view
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [detailDrawerOpened, setDetailDrawerOpened] = useState(false);

  // Column visibility
  const defaultVisibleColumns = columns.filter((col) => col.defaultVisible !== false).map((col) => col.accessor);

  const [visibleColumns, setVisibleColumns] = useLocalStorage<string[]>({
    key: `${storageKey}-visible-columns`,
    defaultValue: defaultVisibleColumns,
  });

  // Column order
  const [columnOrder, setColumnOrder] = useLocalStorage<string[]>({
    key: `${storageKey}-column-order`,
    defaultValue: columns.map((col) => col.accessor),
  });

  // Selected rows for bulk actions
  const [selectedRecords, setSelectedRecords] = useState<T[]>([]);

  // Sorting
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
    columnAccessor: 'id',
    direction: 'asc',
  });

  // Process data following Mantine DataTable best practices
  const processedData = useMemo(() => {
    // Ensure data is always an array
    const safeData = Array.isArray(data) ? data : [];
    let result = [...safeData];

    // Step 1: Apply search filter
    if (debouncedSearch && searchFields.length > 0) {
      const searchLower = debouncedSearch.toLowerCase();

      const getByPath = (obj: any, path: string | number | symbol) => {
        if (typeof path === 'string' && path.includes('.')) {
          return path.split('.').reduce((o: any, key) => (o ? o[key] : undefined), obj);
        }
        // direct key lookup
        return obj[path as keyof typeof obj];
      };

      result = result.filter((item) =>
        searchFields.some((field) => {
          try {
            let raw: any;
            if (typeof field === 'function') {
              raw = (field as (item: T) => any)(item);
            } else {
              raw = getByPath(item, field as any);
            }

            // If it's a date-like string or Date, also include a human-friendly ISO/localized variant
            if (raw instanceof Date) {
              raw = raw.toISOString();
            }

            // If the value is an object (e.g., nested entity), try to stringify useful bits
            if (raw && typeof raw === 'object') {
              if (Array.isArray(raw)) {
                raw = raw.map((r) => (r && typeof r === 'object' ? JSON.stringify(r) : String(r))).join(' ');
              } else {
                // try to pick a few common name fields if present
                raw =
                  (raw.firstName || raw.lastName || raw.name || raw.partnerName || raw.customerName) ??
                  JSON.stringify(raw);
              }
            }

            return String(raw ?? '')
              .toLowerCase()
              .includes(searchLower);
          } catch (e) {
            return false;
          }
        })
      );
    }

    // Step 2: Apply other filters
    if (filterFn) {
      result = result.filter((item) => filterFn(item, filters));
    } else {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          result = result.filter((item) => item[key] === value);
        }
      });
    }

    // Step 3: Apply sorting (client-side)
    if (sortStatus.columnAccessor) {
      const sorted = sortBy(result, sortStatus.columnAccessor);
      result = sortStatus.direction === 'desc' ? sorted.reverse() : sorted;
    }

    return result;
  }, [data, debouncedSearch, searchFields, filters, sortStatus]);

  // Calculate pagination values
  const totalRecords = processedData.length;
  const totalPages = Math.ceil(totalRecords / currentPageSize);

  // Get paginated data for display
  const paginatedData = useMemo(() => {
    const start = (page - 1) * currentPageSize;
    const end = start + currentPageSize;
    return processedData.slice(start, end);
  }, [processedData, page, currentPageSize]);

  // Reset page when filters/search/sort changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters, sortStatus]);

  // Reset page if current page is out of bounds
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [page, totalPages]);

  // Update filters with page reset
  const updateFilters = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
  }, []);

  // Update sort status
  const updateSortStatus = useCallback((newSortStatus: DataTableSortStatus<T>) => {
    setSortStatus(newSortStatus);
  }, []);

  // Handle row click
  const handleRowClick = useCallback((item: T) => {
    setSelectedItem(item);
    setDetailDrawerOpened(true);
  }, []);

  // Filter count
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter((v) => {
      if (v === undefined || v === '' || v === null) return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    }).length;
  }, [filters]);

  // Clear selected records when data changes
  useEffect(() => {
    setSelectedRecords([]);
  }, [filters, search, sortStatus]);

  return {
    // Search
    search,
    setSearch,

    // Filters
    filters,
    setFilters: updateFilters,
    filterDrawerOpened,
    setFilterDrawerOpened,
    openFilterDrawer: () => setFilterDrawerOpened(true),
    closeFilterDrawer: () => setFilterDrawerOpened(false),
    activeFilterCount,

    // Pagination - For Mantine DataTable
    page,
    setPage,
    pageSize: currentPageSize,
    setPageSize: (size: number) => {
      setCurrentPageSize(size);
      setPage(1);
    },
    totalRecords,

    // Data
    processedData, // All filtered and sorted data
    paginatedData, // Data for current page
    filteredData: processedData, // Alias for backward compatibility

    // Detail view
    selectedItem,
    setSelectedItem,
    detailDrawerOpened,
    setDetailDrawerOpened,
    handleRowClick,

    // Column management
    visibleColumns,
    setVisibleColumns,
    columnOrder,
    setColumnOrder,

    // Selected records
    selectedRecords,
    setSelectedRecords,
    clearSelection: () => setSelectedRecords([]),

    // Sorting - For Mantine DataTable
    sortStatus,
    setSortStatus: updateSortStatus,

    // Utilities
    resetFilters: () => {
      setFilters(initialFilters || {});
      setSearch('');
      setPage(1);
    },
    resetAll: () => {
      setFilters({});
      setSearch('');
      setPage(1);
      setSelectedRecords([]);
      setVisibleColumns(defaultVisibleColumns);
      setColumnOrder(columns.map((col) => col.accessor));
      setSortStatus({ columnAccessor: 'id', direction: 'asc' });
    },
  };
}
