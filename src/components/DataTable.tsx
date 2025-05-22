
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  MoreHorizontal,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

export type ColumnSize = "sm" | "md" | "lg";
export type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

export interface Column<T> {
  id: string;
  header: React.ReactNode;
  cell: (item: T) => React.ReactNode;
  isSortable?: boolean;
  sortKey?: string;
  size?: ColumnSize;
  visible?: boolean;
}

export interface RowAction<T> {
  label: string;
  onClick: (item: T) => void;
  condition?: (item: T) => boolean;
  variant?: ButtonVariant;
}

export interface BulkAction<T> {
  label: string;
  onClick: (items: T[]) => void;
  variant?: ButtonVariant;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  isLoading?: boolean;
  selectable?: boolean;
  onRowClick?: (item: T) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  onSelectionChange?: (selectedItems: T[]) => void;
  actions?: RowAction<T>[];
  bulkActions?: BulkAction<T>[];
  emptyState?: React.ReactNode;
}

// Named export for the DataTable component
export const DataTable = <T extends {}>({
  data,
  columns: initialColumns,
  keyField,
  isLoading = false,
  selectable = false,
  onRowClick,
  onSort,
  onSelectionChange,
  actions = [],
  bulkActions = [],
  emptyState,
}: DataTableProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [columns, setColumns] = useState(initialColumns);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  
  const visibleColumns = columns.filter((col) => col.visible !== false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(data);
    } else {
      setSelectedItems([]);
    }
    
    if (onSelectionChange) {
      onSelectionChange(checked ? data : []);
    }
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    let newSelectedItems;
    
    if (checked) {
      newSelectedItems = [...selectedItems, item];
    } else {
      newSelectedItems = selectedItems.filter(
        (selectedItem) => selectedItem[keyField] !== item[keyField]
      );
    }
    
    setSelectedItems(newSelectedItems);
    
    if (onSelectionChange) {
      onSelectionChange(newSelectedItems);
    }
  };

  const isSelected = (item: T) => {
    return selectedItems.some(
      (selectedItem) => selectedItem[keyField] === item[keyField]
    );
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    
    setSortConfig({ key, direction });
    
    if (onSort) {
      onSort(key, direction);
    }
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId
          ? { ...col, visible: col.visible === false ? true : false }
          : col
      )
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center text-center p-4">
        {emptyState || (
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">No data found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              There are no items to display at the moment.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      {(selectable && selectedItems.length > 0 && bulkActions.length > 0) && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded">
          <span className="text-sm font-medium">
            {selectedItems.length} {selectedItems.length === 1 ? "item" : "items"} selected
          </span>
          <div className="flex gap-2">
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "secondary"}
                size="sm"
                onClick={() => action.onClick(selectedItems)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-end mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map((column) => (
              <DropdownMenuItem
                key={column.id}
                onClick={() => toggleColumnVisibility(column.id)}
              >
                <div className="flex items-center">
                  <Checkbox
                    checked={column.visible !== false}
                    onCheckedChange={() => {}}
                    className="mr-2"
                  />
                  <span>{typeof column.header === 'string' ? column.header : column.id}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <ScrollArea className="h-full max-h-[600px]">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {selectable && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={data.length > 0 && selectedItems.length === data.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                
                {visibleColumns.map((column) => (
                  <TableHead
                    key={column.id}
                    className={
                      column.size === "sm"
                        ? "w-24"
                        : column.size === "lg"
                        ? "min-w-52"
                        : ""
                    }
                  >
                    {column.isSortable && column.sortKey ? (
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort(column.sortKey || "")}
                      >
                        <span>{column.header}</span>
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                ))}
                
                {actions.length > 0 && <TableHead className="w-16">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow
                  key={String(item[keyField])}
                  className={onRowClick ? "cursor-pointer" : ""}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                >
                  {selectable && (
                    <TableCell
                      onClick={(e) => e.stopPropagation()}
                      className="w-12"
                    >
                      <Checkbox
                        checked={isSelected(item)}
                        onCheckedChange={(checked) => handleSelectItem(item, !!checked)}
                      />
                    </TableCell>
                  )}
                  
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id}>{column.cell(item)}</TableCell>
                  ))}
                  
                  {actions.length > 0 && (
                    <TableCell
                      onClick={(e) => e.stopPropagation()}
                      className="w-16"
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions
                            .filter((action) =>
                              action.condition ? action.condition(item) : true
                            )
                            .map((action, index) => (
                              <DropdownMenuItem
                                key={index}
                                onClick={() => action.onClick(item)}
                              >
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
      </ScrollArea>
    </div>
  );
};

// Keep the default export for backward compatibility
export default DataTable;
