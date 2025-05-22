import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import PageTemplate from '@/components/PageTemplate';
import DataTable, { Column } from '@/components/DataTable';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Report as ReportType, getReports } from '@/services/transportationService';
import FilterDropdown from '@/components/FilterDropdown';
import usePagination from '@/hooks/usePagination';

const Report = () => {
  const [filters, setFilters] = useState({
    date: '',
    route_id: '',
    vehicle_id: '',
    driver_id: '',
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const pagination = usePagination();
  const { page, pageSize, setTotal } = pagination;

  const { data: reportsData, isLoading, refetch } = useQuery({
    queryKey: ['reports', filters, page, pageSize],
    queryFn: async () => {
      const result = await getReports({
        ...filters,
        page,
        pageSize,
      });
      setTotal(result.count);
      return result.data;
    },
  });

  const reports = reportsData || [];

  const applyFilters = () => {
    const active: string[] = [];
    if (filters.date) active.push('date');
    if (filters.route_id) active.push('route');
    if (filters.vehicle_id) active.push('vehicle');
    if (filters.driver_id) active.push('driver');
    setActiveFilters(active);
    refetch();
  };

  const clearFilters = () => {
    setFilters({
      date: '',
      route_id: '',
      vehicle_id: '',
      driver_id: '',
    });
    setActiveFilters([]);
    refetch();
  };

  return (
    <PageTemplate title="Transportation Reports" subtitle="View and manage transportation reports">
      <PageHeader
        title="Reports"
        description="View transportation reports"
        actions={[
          <FilterDropdown
            key="filter"
            filters={
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date-filter">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={
                          "w-[240px] justify-start text-left font-normal" +
                          (filters.date ? " text-foreground" : " text-muted-foreground")
                        }
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.date ? (
                          format(new Date(filters.date), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.date ? new Date(filters.date) : undefined}
                        onSelect={(date) =>
                          setFilters({
                            ...filters,
                            date: date ? date.toISOString() : "",
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="route-filter">Route</Label>
                  <Input
                    id="route-filter"
                    placeholder="Search by route"
                    value={filters.route_id}
                    onChange={(e) => setFilters({ ...filters, route_id: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle-filter">Vehicle</Label>
                  <Input
                    id="vehicle-filter"
                    placeholder="Search by vehicle"
                    value={filters.vehicle_id}
                    onChange={(e) => setFilters({ ...filters, vehicle_id: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="driver-filter">Driver</Label>
                  <Input
                    id="driver-filter"
                    placeholder="Search by driver"
                    value={filters.driver_id}
                    onChange={(e) => setFilters({ ...filters, driver_id: e.target.value })}
                  />
                </div>
              </div>
            }
            onClear={clearFilters}
            onApply={applyFilters}
            activeFiltersCount={activeFilters.length}
          />,
        ]}
      />

      <DataTable
        data={reports}
        columns={[
          {
            id: 'date',
            header: 'Date',
            cell: (report) => <div>{format(new Date(report.date), 'PP')}</div>,
            isSortable: true,
            sortKey: 'date',
          },
          {
            id: 'route',
            header: 'Route',
            cell: (report) => <div>{report.route_name}</div>,
            isSortable: true,
          },
          {
            id: 'vehicle',
            header: 'Vehicle',
            cell: (report) => <div>{report.vehicle_details}</div>,
            isSortable: true,
            size: "md" as const,
          },
          {
            id: 'driver',
            header: 'Driver',
            cell: (report) => <div>{report.driver_name}</div>,
            isSortable: true,
          },
          {
            id: 'students_present',
            header: 'Students Present',
            cell: (report) => <div>{report.students_present}</div>,
            isSortable: true,
          },
          {
            id: 'incidents',
            header: 'Incidents',
            cell: (report) => <div>{report.incidents || '-'}</div>,
            isSortable: false,
          },
        ]}
        keyField="id"
        isLoading={isLoading}
        paginationState={pagination}
      />
    </PageTemplate>
  );
};

export default Report;
