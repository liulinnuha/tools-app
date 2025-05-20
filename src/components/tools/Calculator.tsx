import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator as CalculatorIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Calculator: React.FC = () => {
  const { toast } = useToast();
  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [operation, setOperation] = useState<string>('add');
  const [result, setResult] = useState<number | string>('');
  const [expression, setExpression] = useState<string>('');
  const [scientificResult, setScientificResult] = useState<number | string>('');

  const calculate = () => {
    if (!num1 || !num2) {
      toast({
        title: "Missing Input",
        description: "Please enter both numbers to calculate",
        variant: "destructive"
      });
      return;
    }

    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);

    if (isNaN(number1) || isNaN(number2)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers",
        variant: "destructive"
      });
      return;
    }

    let calculatedResult: number | string;

    switch (operation) {
      case 'add':
        calculatedResult = number1 + number2;
        break;
      case 'subtract':
        calculatedResult = number1 - number2;
        break;
      case 'multiply':
        calculatedResult = number1 * number2;
        break;
      case 'divide':
        if (number2 === 0) {
          toast({
            title: "Error",
            description: "Cannot divide by zero",
            variant: "destructive"
          });
          return;
        }
        calculatedResult = number1 / number2;
        break;
      case 'power':
        calculatedResult = Math.pow(number1, number2);
        break;
      default:
        calculatedResult = 0;
    }

    setResult(calculatedResult);
  };

  const handleExpressionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpression(e.target.value);
  };

  const evaluateExpression = () => {
    try {
      // This is a simple approach - in a real app, you'd want to use a proper math expression parser
       
      const result = eval(expression);
      setScientificResult(result);
    } catch (error) {
      toast({
        title: "Invalid Expression",
        description: "Please enter a valid mathematical expression",
        variant: "destructive"
      });
    }
  };

  const clearBasic = () => {
    setNum1('');
    setNum2('');
    setResult('');
  };

  const clearScientific = () => {
    setExpression('');
    setScientificResult('');
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Calculator</h2>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="basic">Basic Calculator</TabsTrigger>
          <TabsTrigger value="scientific">Scientific</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="num1">First Number</Label>
                  <Input
                    id="num1"
                    type="number"
                    placeholder="Enter first number"
                    value={num1}
                    onChange={(e) => setNum1(e.target.value)}
                  />
                </div>

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
                      <SelectItem value="add">Addition (+)</SelectItem>
                      <SelectItem value="subtract">Subtraction (-)</SelectItem>
                      <SelectItem value="multiply">Multiplication (×)</SelectItem>
                      <SelectItem value="divide">Division (÷)</SelectItem>
                      <SelectItem value="power">Power (^)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="num2">Second Number</Label>
                  <Input
                    id="num2"
                    type="number"
                    placeholder="Enter second number"
                    value={num2}
                    onChange={(e) => setNum2(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={calculate}>
                    <CalculatorIcon className="w-4 h-4 mr-2" />
                    Calculate
                  </Button>
                  <Button variant="outline" onClick={clearBasic}>
                    Clear
                  </Button>
                </div>

                {result !== '' && (
                  <div className="mt-6 p-4 bg-secondary/30 rounded-md">
                    <Label>Result</Label>
                    <div className="text-2xl font-bold mt-1">{result}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scientific">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="expression">Mathematical Expression</Label>
                  <Input
                    id="expression"
                    placeholder="e.g., (2 + 3) * 4"
                    value={expression}
                    onChange={handleExpressionChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports standard JavaScript operators: +, -, *, /, **, %, (), Math.sin(), Math.cos(), etc.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={evaluateExpression}>
                    <CalculatorIcon className="w-4 h-4 mr-2" />
                    Evaluate
                  </Button>
                  <Button variant="outline" onClick={clearScientific}>
                    Clear
                  </Button>
                </div>

                {scientificResult !== '' && (
                  <div className="mt-6 p-4 bg-secondary/30 rounded-md">
                    <Label>Result</Label>
                    <div className="text-2xl font-bold mt-1">{scientificResult}</div>
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

export default Calculator;
