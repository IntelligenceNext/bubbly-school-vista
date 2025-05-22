
import { ReactNode } from 'react';

export type ColumnSize = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'warning';

export interface Column<T> {
  id: string;
  header: string;
  cell: (item: T) => ReactNode;
  isSortable?: boolean;
  sortKey?: string;
  size?: ColumnSize;
  isVisible?: boolean; // Changed from 'visible' to 'isVisible' to be consistent with naming
}

export interface Action<T> {
  label: string;
  onClick: (item: T) => void;
  variant?: ButtonVariant;
  icon?: ReactNode;
  isVisible?: (item: T) => boolean; // This is the correct property name to replace 'condition'
}

export interface BulkAction<T> {
  label: string;
  onClick: (items: T[]) => void;
  variant?: ButtonVariant;
  icon?: ReactNode;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setTotal: (total: number) => void;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: string;
  isLoading?: boolean;
  selectable?: boolean;
  actions?: Action<T>[];
  bulkActions?: BulkAction<T>[];
  emptyState?: ReactNode;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  initialSortKey?: string;
  initialSortDirection?: 'asc' | 'desc';
  paginationState?: PaginationState;
  onRowClick?: (item: T) => void;
}
