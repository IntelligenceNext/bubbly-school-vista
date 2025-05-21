
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FilterDropdownProps {
  filters: React.ReactNode;
  onClear: () => void;
  onApply: () => void;
  activeFiltersCount: number;
  title?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filters,
  onClear,
  onApply,
  activeFiltersCount,
  title = "Filters",
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          {title}
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">{activeFiltersCount}</Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>{title}</span>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={onClear} className="h-8 px-2">
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">{filters}</CardContent>
          <CardFooter className="pt-2 border-t flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClear();
                setOpen(false);
              }}
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onApply();
                setOpen(false);
              }}
            >
              Apply Filters
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default FilterDropdown;
