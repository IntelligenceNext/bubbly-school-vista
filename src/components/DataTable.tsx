
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  ArrowUpDown,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Column, Action, BulkAction, DataTableProps, PaginationState } from './DataTable.d';

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  keyField,
  isLoading = false,
  selectable = false,
  actions = [],
  bulkActions = [],
  emptyState,
  onSort,
  initialSortKey,
  initialSortDirection = 'asc',
  paginationState,
  onRowClick,
}: DataTableProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [sortKey, setSortKey] = useState<string | undefined>(initialSortKey);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);
  const [internalData, setInternalData] = useState<T[]>(data);
  const [allSelected, setAllSelected] = useState(false);

  // Update internal data when external data changes
  useEffect(() => {
    setInternalData(data);
  }, [data]);

  // Reset selection when data changes
  useEffect(() => {
    setSelectedItems([]);
    setAllSelected(false);
  }, [data]);

  const handleSelectItem = (item: T, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter(
        (selectedItem) => selectedItem[keyField] !== item[keyField]
      ));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems([...internalData]);
      setAllSelected(true);
    } else {
      setSelectedItems([]);
      setAllSelected(false);
    }
  };

  const isItemSelected = (item: T) => {
    return !!selectedItems.find(
      (selectedItem) => selectedItem[keyField] === item[keyField]
    );
  };

  const handleSort = (key: string) => {
    const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(direction);
    
    if (onSort) {
      onSort(key, direction);
    } else {
      // Sort locally if no external sort handler provided
      const newData = [...internalData].sort((a, b) => {
        const valueA = a[key];
        const valueB = b[key];
        
        if (valueA == null) return direction === 'asc' ? 1 : -1;
        if (valueB == null) return direction === 'asc' ? -1 : 1;
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return direction === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        
        return direction === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      });
      
      setInternalData(newData);
    }
  };

  const renderSortIndicator = (column: Column<T>) => {
    if (!column.isSortable) return null;
    
    if (sortKey === column.sortKey || sortKey === column.id) {
      return sortDirection === 'asc' ? (
        <ChevronUp className="ml-1 h-4 w-4" />
      ) : (
        <ChevronDown className="ml-1 h-4 w-4" />
      );
    }
    
    return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground/50" />;
  };
  
  const getColumnClass = (column: Column<T>) => {
    const sizeClasses = {
      sm: 'w-[100px]',
      md: 'w-[180px]',
      lg: 'w-[300px]',
      xl: 'w-[450px]',
    };
    return column.size ? sizeClasses[column.size] : '';
  };

  const handlePageChange = (newPage: number) => {
    if (paginationState) {
      paginationState.setPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    if (paginationState) {
      paginationState.setPageSize(newSize);
      paginationState.setPage(1); // Reset to first page when changing page size
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <div>{emptyState}</div>;
  }

  return (
    <div className="w-full">
      {selectable && selectedItems.length > 0 && bulkActions.length > 0 && (
        <div className="bg-muted p-2 flex items-center gap-x-2 rounded mb-2">
          <span className="text-sm">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </span>
          <div className="ml-auto flex gap-x-2">
            {bulkActions.map((action, i) => (
              <Button 
                key={i}
                variant={action.variant || 'default'}
                size="sm"
                onClick={() => action.onClick(selectedItems)}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              
              {columns.map((column) => (
                <TableHead 
                  key={column.id}
                  className={cn(
                    getColumnClass(column),
                    column.isSortable ? 'cursor-pointer select-none' : ''
                  )}
                  onClick={() => {
                    if (column.isSortable) {
                      handleSort(column.sortKey || column.id);
                    }
                  }}
                >
                  <div className="flex items-center">
                    {column.header}
                    {renderSortIndicator(column)}
                  </div>
                </TableHead>
              ))}
              
              {actions.length > 0 && (
                <TableHead className="w-[100px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {internalData.map((item) => (
              <TableRow 
                key={item[keyField]} 
                className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {selectable && (
                  <TableCell className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isItemSelected(item)}
                      onCheckedChange={(checked) => handleSelectItem(item, !!checked)}
                      aria-label="Select row"
                    />
                  </TableCell>
                )}
                
                {columns.map((column) => (
                  <TableCell key={column.id} className="px-4 py-2">
                    {column.cell(item)}
                  </TableCell>
                ))}
                
                {actions.length > 0 && (
                  <TableCell className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.filter(action => action.isVisible ? action.isVisible(item) : true).map((action, i) => (
                          <DropdownMenuItem
                            key={i}
                            onClick={() => action.onClick(item)}
                            className={cn(
                              action.variant === 'destructive' && "text-destructive"
                            )}
                          >
                            {action.icon}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {paginationState && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-medium">
                {(paginationState.page - 1) * paginationState.pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(
                  paginationState.page * paginationState.pageSize,
                  paginationState.total
                )}
              </span>{' '}
              of <span className="font-medium">{paginationState.total}</span> entries
            </p>
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <select
                className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 py-1 text-sm outline-none"
                value={paginationState.pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {paginationState.page} of{' '}
              {Math.max(1, Math.ceil(paginationState.total / paginationState.pageSize))}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={paginationState.page === 1}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(paginationState.page - 1)}
                disabled={paginationState.page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(paginationState.page + 1)}
                disabled={
                  paginationState.page >=
                  Math.ceil(paginationState.total / paginationState.pageSize)
                }
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handlePageChange(
                    Math.ceil(paginationState.total / paginationState.pageSize)
                  )
                }
                disabled={
                  paginationState.page >=
                  Math.ceil(paginationState.total / paginationState.pageSize)
                }
              >
                Last
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
