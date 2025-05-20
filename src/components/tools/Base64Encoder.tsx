import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Copy } from 'lucide-react';

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const { toast } = useToast();

  const calculateBMI = () => {
    try {
      const h = parseFloat(height);
      const w = parseFloat(weight);

      if (isNaN(h) || isNaN(w)) {
        throw new Error('Please enter valid numbers');
      }

      let bmi: number;
      if (unit === 'metric') {
        // Metric: weight (kg) / height (m)²
        const heightInMeters = h / 100; // Convert cm to m
        bmi = w / (heightInMeters * heightInMeters);
      } else {
        // Imperial: (weight (lbs) * 703) / height (inches)²
        bmi = (w * 703) / (h * h);
      }

      let category = '';
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 25) category = 'Normal weight';
      else if (bmi < 30) category = 'Overweight';
      else category = 'Obese';

      setResult(`Your BMI is ${bmi.toFixed(1)} (${category})`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to calculate BMI",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Result copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">BMI Calculator</h2>
      <p className="text-muted-foreground">
        Calculate your Body Mass Index (BMI) using either metric or imperial units.
      </p>

      <Card className="p-6">
        <Tabs defaultValue="metric" className="w-full" onValueChange={(value) => setUnit(value as 'metric' | 'imperial')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="metric">Metric</TabsTrigger>
            <TabsTrigger value="imperial">Imperial</TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Height ({unit === 'metric' ? 'cm' : 'inches'})
              </label>
              <Input
                type="number"
                placeholder={`Enter height in ${unit === 'metric' ? 'centimeters' : 'inches'}...`}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="font-mono"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Weight ({unit === 'metric' ? 'kg' : 'lbs'})
              </label>
              <Input
                type="number"
                placeholder={`Enter weight in ${unit === 'metric' ? 'kilograms' : 'pounds'}...`}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={calculateBMI}>
                <Calculator className="mr-2 h-4 w-4" />
                Calculate BMI
              </Button>
            </div>

            {result && (
              <div className="mt-6">
                <label className="text-sm font-medium mb-2 block">Result:</label>
                <div className="relative">
                  <div className="p-4 bg-muted rounded-md font-mono">
                    {result}
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(result)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default BMICalculator;
