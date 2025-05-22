
interface Column<T = any> {
  id: string;
  header: string;
  cell: (item: T) => React.ReactNode;
  isSortable?: boolean; 
  sortKey?: string;
  size?: 'sm' | 'md' | 'lg';
}

export type ButtonVariant = 
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'success'
  | 'warning'
  | ((item: any) => 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'warning');

export interface RowAction<T = any> {
  label: string;
  onClick: (item: T) => void;
  variant?: ButtonVariant;
  disabled?: boolean | ((item: T) => boolean);
  hidden?: boolean | ((item: T) => boolean);
}

interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  keyField: string;
  selectable?: boolean;
  actions?: RowAction<T>[];
  bulkActions?: RowAction<T[]>[];
  onRowClick?: (item: T) => void;
}
