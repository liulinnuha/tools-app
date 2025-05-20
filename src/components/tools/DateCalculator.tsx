import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Calculator } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, differenceInDays, differenceInMonths, differenceInYears, addDays, addMonths, addYears } from 'date-fns';
import { cn } from '@/lib/utils';

const DateCalculator: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [diffResult, setDiffResult] = useState<string>('');

  const [baseDate, setBaseDate] = useState<Date>(new Date());
  const [timeUnit, setTimeUnit] = useState<string>('days');
  const [timeValue, setTimeValue] = useState<string>('7');
  const [operation, setOperation] = useState<string>('add');
  const [addResult, setAddResult] = useState<Date | null>(null);

  const calculateDateDifference = () => {
    if (!startDate || !endDate) {
      return;
    }

    const days = Math.abs(differenceInDays(endDate, startDate));
    const months = Math.abs(differenceInMonths(endDate, startDate));
    const years = Math.abs(differenceInYears(endDate, startDate));

    setDiffResult(`${days} days, or approximately ${months} months and ${years} years`);
  };

  const calculateDateAddSubtract = () => {
    if (!baseDate || !timeValue || isNaN(parseInt(timeValue))) {
      return;
    }

    const value = parseInt(timeValue);
    let result: Date;

    if (operation === 'add') {
      if (timeUnit === 'days') {
        result = addDays(baseDate, value);
      } else if (timeUnit === 'months') {
        result = addMonths(baseDate, value);
      } else {
        result = addYears(baseDate, value);
      }
    } else {
      if (timeUnit === 'days') {
        result = addDays(baseDate, -value);
      } else if (timeUnit === 'months') {
        result = addMonths(baseDate, -value);
      } else {
        result = addYears(baseDate, -value);
      }
    }

    setAddResult(result);
  };

  return (
    <div className="max-w-xl mx-auto">
      <Tabs defaultValue="difference" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="difference">Date Difference</TabsTrigger>
          <TabsTrigger value="add-subtract">Add/Subtract Time</TabsTrigger>
        </TabsList>

        <TabsContent value="difference">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  className="w-full"
                  onClick={calculateDateDifference}
                  disabled={!startDate || !endDate}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Difference
                </Button>

                {diffResult && (
                  <div className="mt-4 p-4 bg-secondary/30 rounded-md">
                    <Label>Result</Label>
                    <div className="text-lg font-medium mt-1">{diffResult}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-subtract">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base-date">Base Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {baseDate ? format(baseDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={baseDate}
                        onSelect={setBaseDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-[1fr,1fr,1fr] gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="operation">Operation</Label>
                    <Select
                      value={operation}
                      onValueChange={setOperation}
                    >
                      <SelectTrigger id="operation">
                        <SelectValue placeholder="Select operation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add">Add</SelectItem>
                        <SelectItem value="subtract">Subtract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time-value">Value</Label>
                    <Input
                      id="time-value"
                      type="number"
                      placeholder="e.g., 7"
                      min="1"
                      value={timeValue}
                      onChange={(e) => setTimeValue(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time-unit">Unit</Label>
                    <Select
                      value={timeUnit}
                      onValueChange={setTimeUnit}
                    >
                      <SelectTrigger id="time-unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={calculateDateAddSubtract}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Result
                </Button>

                {addResult && (
                  <div className="mt-4 p-4 bg-secondary/30 rounded-md">
                    <Label>Result Date</Label>
                    <div className="text-lg font-medium mt-1">{format(addResult, 'PPP')}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DateCalculator;
