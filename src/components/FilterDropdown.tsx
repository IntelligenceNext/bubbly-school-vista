
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FilterDropdownProps {
  filterKey?: string;
  filterName?: string;
  options?: string[];
  selectedValue?: string;
  onFilterChange?: (filterKey: string, value: string) => void;
  filters?: React.ReactNode;
  onClear?: () => void;
  onApply?: () => void;
  activeFiltersCount?: number;
  title?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filterKey,
  filterName,
  options = [],
  selectedValue = "",
  onFilterChange,
  filters,
  onClear,
  onApply,
  activeFiltersCount = 0,
  title = "Filters",
}) => {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(selectedValue);

  // Handle both API styles - either direct filter options or custom filter content
  const hasDirectOptions = filterKey && filterName && options.length > 0 && onFilterChange;
  const hasCustomContent = filters && onClear && onApply;

  // For backward compatibility with previous API
  const handleApply = () => {
    if (hasDirectOptions && onFilterChange && filterKey) {
      onFilterChange(filterKey, localValue);
      setOpen(false);
    } else if (hasCustomContent && onApply) {
      onApply();
      setOpen(false);
    }
  };

  const handleClear = () => {
    if (hasDirectOptions && onFilterChange && filterKey) {
      setLocalValue("");
      onFilterChange(filterKey, "");
    } else if (hasCustomContent && onClear) {
      onClear();
    }
  };

  const handleOptionChange = (value: string) => {
    setLocalValue(value);
    if (hasDirectOptions && onFilterChange && filterKey) {
      onFilterChange(filterKey, value);
      setOpen(false);
    }
  };

  const displayActiveFiltersCount = hasDirectOptions 
    ? selectedValue ? 1 : 0
    : activeFiltersCount;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          {hasDirectOptions ? filterName : title}
          {displayActiveFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">{displayActiveFiltersCount}</Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>{hasDirectOptions ? filterName : title}</span>
              {displayActiveFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 px-2">
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasDirectOptions ? (
              <RadioGroup value={localValue} onValueChange={handleOptionChange}>
                {options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${filterKey}-${option}`} />
                    <Label htmlFor={`${filterKey}-${option}`}>{option.charAt(0).toUpperCase() + option.slice(1)}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              filters
            )}
          </CardContent>
          {hasCustomContent && (
            <CardFooter className="pt-2 border-t flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClear?.();
                  setOpen(false);
                }}
              >
                Reset
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onApply?.();
                  setOpen(false);
                }}
              >
                Apply Filters
              </Button>
            </CardFooter>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default FilterDropdown;
