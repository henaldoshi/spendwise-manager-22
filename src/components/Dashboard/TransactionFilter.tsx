
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, FilterIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useTransactions } from '@/context/TransactionContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TransactionFilterProps {
  onFilterChange: (transactions: any[]) => void;
}

type DateRange = 'all' | 'today' | 'week' | 'month' | 'custom';

const TransactionFilter: React.FC<TransactionFilterProps> = ({ onFilterChange }) => {
  const { transactions, categories, filterTransactionsByDate, filterTransactionsByCategory } = useTransactions();
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [category, setCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const applyFilters = () => {
    let filteredTransactions = [...transactions];

    // Filter by date
    if (dateRange !== 'all') {
      const now = new Date();
      let start: Date | undefined;
      let end: Date | undefined = new Date(now);

      if (dateRange === 'today') {
        start = new Date(now.setHours(0, 0, 0, 0));
      } else if (dateRange === 'week') {
        start = new Date(now);
        start.setDate(now.getDate() - 7);
      } else if (dateRange === 'month') {
        start = new Date(now);
        start.setMonth(now.getMonth() - 1);
      } else if (dateRange === 'custom') {
        start = startDate;
        end = endDate;
      }

      filteredTransactions = filterTransactionsByDate(start, end);
    }

    // Filter by category
    if (category !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.category === category);
    }

    onFilterChange(filteredTransactions);
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value as DateRange);
    if (value !== 'custom') {
      setStartDate(undefined);
      setEndDate(undefined);
      setIsCalendarOpen(false);
    } else {
      setIsCalendarOpen(true);
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  React.useEffect(() => {
    applyFilters();
  }, [dateRange, category, startDate, endDate]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="flex items-center gap-2">
        <FilterIcon size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium">Filter:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select value={dateRange} onValueChange={handleDateRangeChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
        
        {dateRange === 'custom' && (
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate && endDate ? (
                  <>
                    {format(startDate, "MMM d")} - {format(endDate, "MMM d")}
                  </>
                ) : (
                  <span>Pick dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: startDate || new Date(),
                  to: endDate || new Date(),
                }}
                onSelect={(range) => {
                  setStartDate(range?.from);
                  setEndDate(range?.to);
                }}
                initialFocus
                className="pointer-events-auto"
              />
              <div className="flex justify-end gap-2 p-3 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setStartDate(undefined);
                    setEndDate(undefined);
                  }}
                >
                  Clear
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setIsCalendarOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2 ml-auto">
        {dateRange !== 'all' && (
          <Badge 
            variant="outline" 
            className={cn(
              "rounded-full py-1 px-3",
              dateRange === 'custom' && startDate && endDate
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            )}
          >
            {dateRange === 'today' && "Today"}
            {dateRange === 'week' && "Last 7 Days"}
            {dateRange === 'month' && "Last 30 Days"}
            {dateRange === 'custom' && startDate && endDate && (
              <>
                {format(startDate, "MMM d")} - {format(endDate, "MMM d")}
              </>
            )}
          </Badge>
        )}
        
        {category !== 'all' && (
          <Badge 
            variant="outline" 
            className="rounded-full py-1 px-3 bg-secondary"
          >
            {categories.find(c => c.id === category)?.name}
          </Badge>
        )}
        
        {(dateRange !== 'all' || category !== 'all') && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2"
            onClick={() => {
              setDateRange('all');
              setCategory('all');
              setStartDate(undefined);
              setEndDate(undefined);
            }}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransactionFilter;
