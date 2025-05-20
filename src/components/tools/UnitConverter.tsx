import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';

type UnitCategory = 'length' | 'mass' | 'volume' | 'temperature' | 'area' | 'time';

interface UnitDefinition {
  name: string;
  conversion: number;
  offset?: number;
}

const lengthUnits: Record<string, UnitDefinition> = {
  'm': { name: 'Meters', conversion: 1 },
  'km': { name: 'Kilometers', conversion: 0.001 },
  'cm': { name: 'Centimeters', conversion: 100 },
  'mm': { name: 'Millimeters', conversion: 1000 },
  'in': { name: 'Inches', conversion: 39.3701 },
  'ft': { name: 'Feet', conversion: 3.28084 },
  'yd': { name: 'Yards', conversion: 1.09361 },
  'mi': { name: 'Miles', conversion: 0.000621371 }
};

const massUnits: Record<string, UnitDefinition> = {
  'kg': { name: 'Kilograms', conversion: 1 },
  'g': { name: 'Grams', conversion: 1000 },
  'mg': { name: 'Milligrams', conversion: 1000000 },
  'lb': { name: 'Pounds', conversion: 2.20462 },
  'oz': { name: 'Ounces', conversion: 35.274 },
  't': { name: 'Metric Tons', conversion: 0.001 }
};

const volumeUnits: Record<string, UnitDefinition> = {
  'l': { name: 'Liters', conversion: 1 },
  'ml': { name: 'Milliliters', conversion: 1000 },
  'gal': { name: 'Gallons (US)', conversion: 0.264172 },
  'qt': { name: 'Quarts (US)', conversion: 1.05669 },
  'pt': { name: 'Pints (US)', conversion: 2.11338 },
  'cup': { name: 'Cups (US)', conversion: 4.22675 },
  'oz': { name: 'Fluid Ounces (US)', conversion: 33.814 },
  'm3': { name: 'Cubic Meters', conversion: 0.001 }
};

const temperatureUnits: Record<string, UnitDefinition> = {
  'c': { name: 'Celsius', conversion: 1, offset: 0 },
  'f': { name: 'Fahrenheit', conversion: 1.8, offset: 32 },
  'k': { name: 'Kelvin', conversion: 1, offset: 273.15 }
};

const areaUnits: Record<string, UnitDefinition> = {
  'm2': { name: 'Square Meters', conversion: 1 },
  'km2': { name: 'Square Kilometers', conversion: 0.000001 },
  'cm2': { name: 'Square Centimeters', conversion: 10000 },
  'mm2': { name: 'Square Millimeters', conversion: 1000000 },
  'ft2': { name: 'Square Feet', conversion: 10.7639 },
  'in2': { name: 'Square Inches', conversion: 1550 },
  'acre': { name: 'Acres', conversion: 0.000247105 },
  'ha': { name: 'Hectares', conversion: 0.0001 }
};

const timeUnits: Record<string, UnitDefinition> = {
  's': { name: 'Seconds', conversion: 1 },
  'min': { name: 'Minutes', conversion: 1/60 },
  'hr': { name: 'Hours', conversion: 1/3600 },
  'day': { name: 'Days', conversion: 1/86400 },
  'wk': { name: 'Weeks', conversion: 1/604800 },
  'mo': { name: 'Months (30 days)', conversion: 1/2592000 },
  'yr': { name: 'Years (365 days)', conversion: 1/31536000 }
};

const unitCategories: Record<UnitCategory, Record<string, UnitDefinition>> = {
  'length': lengthUnits,
  'mass': massUnits,
  'volume': volumeUnits,
  'temperature': temperatureUnits,
  'area': areaUnits,
  'time': timeUnits
};

const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('cm');
  const [value, setValue] = useState<string>('1');
  const [result, setResult] = useState<string>('100');

  const convert = useCallback(() => {
    if (!value || isNaN(parseFloat(value))) {
      setResult('');
      return;
    }

    const numValue = parseFloat(value);
    const units = unitCategories[category];

    if (category === 'temperature') {
      let celsius: number;

      // Convert to Celsius first
      switch(fromUnit) {
        case 'c':
          celsius = numValue;
          break;
        case 'f':
          celsius = (numValue - 32) / 1.8;
          break;
        case 'k':
          celsius = numValue - 273.15;
          break;
        default:
          celsius = 0;
      }

      // Convert from Celsius to target
      let finalResult: number;
      switch(toUnit) {
        case 'c':
          finalResult = celsius;
          break;
        case 'f':
          finalResult = (celsius * 1.8) + 32;
          break;
        case 'k':
          finalResult = celsius + 273.15;
          break;
        default:
          finalResult = 0;
      }

      setResult(finalResult.toFixed(4));
    } else {
        if (!units[fromUnit] || !units[toUnit]) {
          setResult('Error: Invalid units');
          return;
        }
        const fromDef = units[fromUnit];
        const toDef = units[toUnit];
        const baseValue = numValue / fromDef.conversion;
        const targetValue = baseValue * toDef.conversion;
        setResult(targetValue.toFixed(6).replace(/\.?0+$/, ''));
    }
  }, [category, fromUnit, toUnit, value]);

  useEffect(() => {
    const unitKeys = Object.keys(unitCategories[category]);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1]);
  }, [category]);

  useEffect(() => {
    convert();
  }, [convert]);

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">Unit Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as UnitCategory)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="length">Length</SelectItem>
                  <SelectItem value="mass">Mass</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                  <SelectItem value="time">Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[2fr,auto,2fr] gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="from-value">Value</Label>
                <Input
                  id="from-value"
                  type="number"
                  placeholder="Enter value"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    convert();
                  }}
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 mt-2"
                onClick={handleSwapUnits}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

              <div className="space-y-2">
                <Label htmlFor="to-value">Result</Label>
                <Input
                  id="to-value"
                  readOnly
                  value={result}
                  className="bg-secondary/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from-unit">From Unit</Label>
                <Select
                  value={fromUnit}
                  onValueChange={setFromUnit}
                >
                  <SelectTrigger id="from-unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(unitCategories[category]).map(([key, unit]) => (
                      <SelectItem key={key} value={key}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to-unit">To Unit</Label>
                <Select
                  value={toUnit}
                  onValueChange={setToUnit}
                >
                  <SelectTrigger id="to-unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(unitCategories[category]).map(([key, unit]) => (
                      <SelectItem key={key} value={key}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-full" onClick={convert}>
              Convert
            </Button>

            <div className="text-xs text-muted-foreground">
              <p>Formula: {category === 'temperature' ? 'Special temperature conversion' : 'Value × Conversion Factor'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnitConverter;
