import { ReactNode, useEffect, useState } from 'react';

import { ActionIcon, Box, Card, Center, Group, Menu } from '@mantine/core';
import { IconDatabaseOff, IconDotsVertical } from '@tabler/icons-react';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';

import { EmptyState } from '@/components/display/EmptyState';

import classes from './ListTable.module.css';
import { TablePagination } from './TablePagination';

import './ListTable.fix.css';

interface RowAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (record: T) => void;
  color?: string;
  hidden?: (record: T) => boolean;
}

interface ListTableProps<T extends Record<string, any>> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  error?: Error | null;
  onRowClick?: (record: T) => void;
  emptyState?: {
    title: string;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  page: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  storeColumnsKey?: string;
  rowActions?: RowAction<T>[];
  selectedRecords?: T[];
  onSelectedRecordsChange?: (records: T[]) => void;
  highlightOnHover?: boolean;
  withBorder?: boolean;
  withColumnBorders?: boolean;
  striped?: boolean;
  minHeight?: number | string;
  sortStatus?: DataTableSortStatus<T>;
  onSortStatusChange?: (status: DataTableSortStatus<T>) => void;
  pinnedFirstColumn?: boolean;
  pinnedLastColumn?: boolean;
  scrollAreaProps?: any;
  stickyHeader?: boolean;
}

const PAGE_SIZES = [10, 25, 50, 100];

export function ListTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error = null,
  onRowClick,
  emptyState,
  page,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  storeColumnsKey = 'gm-aicg-table',
  rowActions,
  selectedRecords,
  onSelectedRecordsChange,
  highlightOnHover = true,
  withBorder = true,
  withColumnBorders = true,
  striped = true,
  minHeight = 400,
  sortStatus,
  onSortStatusChange,
  pinnedFirstColumn = true,
  pinnedLastColumn = true,
  scrollAreaProps,
  stickyHeader = true,
}: ListTableProps<T>) {
  const [isHeaderStuck, setIsHeaderStuck] = useState(false);
  const [tableHeight, setTableHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const calculateHeight = () => {
      // Calculate available height for the table
      const tableCard = document.querySelector('[data-list-table-card]');
      if (!tableCard) return;

      const rect = tableCard.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much space is available from table top to bottom of viewport
      // Account for pagination height (approximately 60px) and some padding
      const paginationHeight = 60;
      const padding = 16;
      const availableHeight = windowHeight - rect.top - paginationHeight - padding;

      // Set a minimum height of 400px and maximum based on viewport
      const finalHeight = Math.max(400, Math.min(availableHeight, windowHeight - 200));
      setTableHeight(finalHeight);
    };

    // Calculate on mount and resize
    calculateHeight();
    window.addEventListener('resize', calculateHeight);

    // Recalculate after a short delay to ensure DOM is ready
    setTimeout(calculateHeight, 100);

    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, [data.length]); // Recalculate when data changes
  // Add actions column if rowActions are provided
  const enhancedColumns = [...columns];
  if (rowActions && rowActions.length > 0) {
    enhancedColumns.push({
      accessor: '_actions',
      title: '',
      width: 50,
      resizable: false,
      sortable: false,
      cellsStyle: () => ({ padding: '8px' }),
      render: (record) => (
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <IconDotsVertical size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {rowActions
              .filter((action) => !action.hidden || !action.hidden(record))
              .map((action, index) => (
                <Menu.Item
                  key={index}
                  leftSection={action.icon}
                  color={action.color}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(record);
                  }}
                >
                  {action.label}
                </Menu.Item>
              ))}
          </Menu.Dropdown>
        </Menu>
      ),
    });
  }

  if (error) {
    return (
      <Card withBorder={withBorder}>
        <EmptyState icon={<IconDatabaseOff size={48} />} title="Error loading data" description={error.message} />
      </Card>
    );
  }

  // Determine CSS classes
  const tableClasses = [
    classes.dataTable,
    stickyHeader && classes.fixedHeader,
    isHeaderStuck && classes.headerStuck,
    pinnedFirstColumn && classes.pinnedFirst,
    pinnedLastColumn && classes.pinnedLast,
  ]
    .filter(Boolean)
    .join(' ');

  // Build base props
  const dataTableProps: any = {
    records: data,
    columns: enhancedColumns,
    idAccessor: 'id',
    fetching: loading,
    highlightOnHover,
    striped,
    // Use calculated height for proper sticky headers
    height: tableHeight || minHeight,
    // Force empty state to never show by providing a non-renderable element
    emptyState: <></>,
    noRecordsText: '',
    // Add pinned columns configuration
    pinFirstColumn: pinnedFirstColumn,
    // pinLastColumn: pinnedLastColumn,
    onRowClick: onRowClick
      ? ({ record, event }: any) => {
          if (event && event.target instanceof HTMLElement) {
            const isActionClick = event.target.closest('button') || event.target.closest('[role="menu"]');
            if (!isActionClick) {
              onRowClick(record);
            }
          }
        }
      : undefined,
    selectedRecords,
    onSelectedRecordsChange,
    styles: {
      root: {
        border: 'none',
      },
      table: {
        fontSize: 'var(--mantine-font-size-sm)',
        tableLayout: 'fixed', // Required for ellipsis to work with column widths
      },
    },
    rowStyle: () => ({
      cursor: onRowClick ? 'pointer' : 'default',
    }),
    className: tableClasses,
    storeColumnsKey,
    withColumnBorders,
    withTableBorder: false,
    // Custom scroll area props if provided
    scrollAreaProps: scrollAreaProps || {
      type: 'hover' as const,
      scrollbarSize: 8,
      scrollHideDelay: 1000,
    },
  };

  // Add sorting props only if both are provided
  if (sortStatus && onSortStatusChange) {
    dataTableProps.sortStatus = sortStatus;
    dataTableProps.onSortStatusChange = onSortStatusChange;
  }

  return (
    <Card data-component="list-table" withBorder={withBorder} p={0} data-list-table-card>
      <Box>
        {data.length === 0 && !loading ? (
          // Show our custom empty state when there's no data
          <EmptyState
            icon={<IconDatabaseOff size={48} />}
            title={emptyState?.title || 'No records found'}
            description={emptyState?.description}
            action={emptyState?.action}
          />
        ) : (
          // Show the data table when there's data (or loading)
          <>
            <DataTable {...dataTableProps} />
            {!loading && data.length > 0 && (
              <TablePagination
                page={page}
                totalRecords={totalRecords}
                recordsPerPage={pageSize}
                onPageChange={onPageChange}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={onPageSizeChange}
                loading={loading}
              />
            )}
          </>
        )}
      </Box>
    </Card>
  );
}
