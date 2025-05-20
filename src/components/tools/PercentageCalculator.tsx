import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Percent, Calculator, PercentIcon, ArrowRight } from 'lucide-react';

const PercentageCalculator: React.FC = () => {
  // Basic percentage calculation
  const [basicValue, setBasicValue] = useState<string>('100');
  const [basicPercent, setBasicPercent] = useState<string>('25');
  const [basicResult, setBasicResult] = useState<number | null>(null);

  // Percentage of value calculation
  const [percentValue, setPercentValue] = useState<string>('75');
  const [percentOf, setPercentOf] = useState<string>('200');
  const [percentResult, setPercentResult] = useState<number | null>(null);

  // Percentage change calculation
  const [oldValue, setOldValue] = useState<string>('100');
  const [newValue, setNewValue] = useState<string>('125');
  const [changeResult, setChangeResult] = useState<number | null>(null);
  const [changeType, setChangeType] = useState<'increase' | 'decrease' | null>(null);

  // Percentage point calculation
  const [originalPercent, setOriginalPercent] = useState<string>('10');
  const [newPercent, setNewPercent] = useState<string>('15');
  const [pointResult, setPointResult] = useState<number | null>(null);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);

  // Tip calculator
  const [billAmount, setBillAmount] = useState<string>('50');
  const [tipPercent, setTipPercent] = useState<string>('15');
  const [tipAmount, setTipAmount] = useState<number | null>(null);
  const [totalWithTip, setTotalWithTip] = useState<number | null>(null);

  // Calculate basic percentage
  useEffect(() => {
    if (basicValue && basicPercent) {
      const value = parseFloat(basicValue);
      const percent = parseFloat(basicPercent);

      if (!isNaN(value) && !isNaN(percent)) {
        setBasicResult((value * percent) / 100);
      } else {
        setBasicResult(null);
      }
    } else {
      setBasicResult(null);
    }
  }, [basicValue, basicPercent]);

  // Calculate percentage of value
  useEffect(() => {
    if (percentValue && percentOf) {
      const value = parseFloat(percentValue);
      const total = parseFloat(percentOf);

      if (!isNaN(value) && !isNaN(total) && total !== 0) {
        setPercentResult((value / total) * 100);
      } else {
        setPercentResult(null);
      }
    } else {
      setPercentResult(null);
    }
  }, [percentValue, percentOf]);

  // Calculate percentage change
  useEffect(() => {
    if (oldValue && newValue) {
      const original = parseFloat(oldValue);
      const current = parseFloat(newValue);

      if (!isNaN(original) && !isNaN(current) && original !== 0) {
        const change = ((current - original) / original) * 100;
        setChangeResult(Math.abs(change));
        setChangeType(current >= original ? 'increase' : 'decrease');
      } else {
        setChangeResult(null);
        setChangeType(null);
      }
    } else {
      setChangeResult(null);
      setChangeType(null);
    }
  }, [oldValue, newValue]);

  // Calculate percentage point difference and percentage change
  useEffect(() => {
    if (originalPercent && newPercent) {
      const original = parseFloat(originalPercent);
      const current = parseFloat(newPercent);

      if (!isNaN(original) && !isNaN(current)) {
        // Percentage point difference
        setPointResult(current - original);

        // Percentage change in the percentage
        if (original !== 0) {
          setPercentageChange(((current - original) / original) * 100);
        } else {
          setPercentageChange(null);
        }
      } else {
        setPointResult(null);
        setPercentageChange(null);
      }
    } else {
      setPointResult(null);
      setPercentageChange(null);
    }
  }, [originalPercent, newPercent]);

  // Calculate tip
  useEffect(() => {
    if (billAmount && tipPercent) {
      const bill = parseFloat(billAmount);
      const tip = parseFloat(tipPercent);

      if (!isNaN(bill) && !isNaN(tip)) {
        const tipAmt = (bill * tip) / 100;
        setTipAmount(tipAmt);
        setTotalWithTip(bill + tipAmt);
      } else {
        setTipAmount(null);
        setTotalWithTip(null);
      }
    } else {
      setTipAmount(null);
      setTotalWithTip(null);
    }
  }, [billAmount, tipPercent]);

  return (
    <div className="max-w-3xl mx-auto">
      <p className="text-muted-foreground mb-6">
        Calculate percentages, find what percent one number is of another, determine percentage change, and more.
      </p>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="percentage-of">Percent Of</TabsTrigger>
          <TabsTrigger value="change">Percent Change</TabsTrigger>
          <TabsTrigger value="points">Percentage Points</TabsTrigger>
          <TabsTrigger value="tip">Tip Calculator</TabsTrigger>
        </TabsList>

        {/* Basic Percentage Calculator */}
        <TabsContent value="basic">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="basic-value">What is</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="basic-percent"
                    type="number"
                    value={basicPercent}
                    onChange={(e) => setBasicPercent(e.target.value)}
                    className="w-24"
                  />
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  <span>of</span>
                  <Input
                    id="basic-value"
                    type="number"
                    value={basicValue}
                    onChange={(e) => setBasicValue(e.target.value)}
                  />
                  <span>?</span>
                </div>
              </div>

              <div className="p-4 bg-secondary/30 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Result:</span>
                  <div className="text-2xl font-semibold">
                    {basicResult !== null ? basicResult.toFixed(2) : '—'}
                  </div>
                </div>

                {basicResult !== null && basicValue && basicPercent && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {basicPercent}% of {basicValue} is {basicResult.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <PercentButton value="5" current={basicPercent} setCurrent={setBasicPercent} />
                <PercentButton value="10" current={basicPercent} setCurrent={setBasicPercent} />
                <PercentButton value="15" current={basicPercent} setCurrent={setBasicPercent} />
                <PercentButton value="20" current={basicPercent} setCurrent={setBasicPercent} />
                <PercentButton value="25" current={basicPercent} setCurrent={setBasicPercent} />
                <PercentButton value="50" current={basicPercent} setCurrent={setBasicPercent} />
                <PercentButton value="75" current={basicPercent} setCurrent={setBasicPercent} />
                <PercentButton value="100" current={basicPercent} setCurrent={setBasicPercent} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Percentage Of Calculator */}
        <TabsContent value="percentage-of">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="percent-value">What percent is</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="percent-value"
                    type="number"
                    value={percentValue}
                    onChange={(e) => setPercentValue(e.target.value)}
                  />
                  <span>of</span>
                  <Input
                    id="percent-of"
                    type="number"
                    value={percentOf}
                    onChange={(e) => setPercentOf(e.target.value)}
                  />
                  <span>?</span>
                </div>
              </div>

              <div className="p-4 bg-secondary/30 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Result:</span>
                  <div className="text-2xl font-semibold flex items-center">
                    {percentResult !== null ? percentResult.toFixed(2) : '—'}
                    <Percent className="h-5 w-5 ml-1" />
                  </div>
                </div>

                {percentResult !== null && percentValue && percentOf && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {percentValue} is {percentResult.toFixed(2)}% of {percentOf}
                  </p>
                )}
              </div>

              <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground">
                <strong>Formula:</strong> (Value ÷ Total) × 100 = Percentage
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Percentage Change Calculator */}
        <TabsContent value="change">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="old-value">Original Value</Label>
                  <Input
                    id="old-value"
                    type="number"
                    value={oldValue}
                    onChange={(e) => setOldValue(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-value">New Value</Label>
                  <Input
                    id="new-value"
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-4 bg-secondary/30 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {changeType === 'increase' ? 'Increase:' : changeType === 'decrease' ? 'Decrease:' : 'Change:'}
                  </span>
                  <div className="text-2xl font-semibold flex items-center">
                    {changeResult !== null ? changeResult.toFixed(2) : '—'}
                    <Percent className="h-5 w-5 ml-1" />
                  </div>
                </div>

                {changeResult !== null && oldValue && newValue && changeType && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {oldValue} to {newValue} is a {changeResult.toFixed(2)}% {changeType}
                  </p>
                )}
              </div>

              <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground">
                <strong>Formula:</strong> ((New Value - Original Value) ÷ Original Value) × 100 = Percentage Change
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Percentage Points Calculator */}
        <TabsContent value="points">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="original-percent">Original Percentage</Label>
                  <div className="flex items-center">
                    <Input
                      id="original-percent"
                      type="number"
                      value={originalPercent}
                      onChange={(e) => setOriginalPercent(e.target.value)}
                    />
                    <Percent className="h-4 w-4 ml-2 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-percent">New Percentage</Label>
                  <div className="flex items-center">
                    <Input
                      id="new-percent"
                      type="number"
                      value={newPercent}
                      onChange={(e) => setNewPercent(e.target.value)}
                    />
                    <Percent className="h-4 w-4 ml-2 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-secondary/30 rounded-md grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-muted-foreground mb-1">Percentage Points:</div>
                  <div className="text-xl font-semibold flex items-center">
                    {pointResult !== null ? (pointResult > 0 ? '+' : '') + pointResult.toFixed(2) : '—'}
                    <span className="text-sm ml-1">percentage points</span>
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground mb-1">Percentage Change:</div>
                  <div className="text-xl font-semibold flex items-center">
                    {percentageChange !== null ? (percentageChange > 0 ? '+' : '') + percentageChange.toFixed(2) : '—'}
                    <Percent className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground space-y-2">
                <div>
                  <strong>Percentage Points:</strong> New Percentage - Original Percentage
                </div>
                <div>
                  <strong>Percentage Change:</strong> ((New Percentage - Original Percentage) ÷ Original Percentage) × 100
                </div>
                <div className="pt-2 border-t border-muted">
                  <strong>Example:</strong> A change from 10% to 15% is a 5 percentage point increase, but a 50% increase in the percentage itself.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tip Calculator */}
        <TabsContent value="tip">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bill-amount">Bill Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-muted-foreground">$</span>
                    <Input
                      id="bill-amount"
                      type="number"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tip-percent">Tip Percentage</Label>
                  <div className="flex items-center">
                    <Input
                      id="tip-percent"
                      type="number"
                      value={tipPercent}
                      onChange={(e) => setTipPercent(e.target.value)}
                    />
                    <Percent className="h-4 w-4 ml-2 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setTipPercent('15')}
                >
                  15%
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setTipPercent('18')}
                >
                  18%
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setTipPercent('20')}
                >
                  20%
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setTipPercent('25')}
                >
                  25%
                </Button>
              </div>

              <div className="p-4 bg-secondary/30 rounded-md grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-muted-foreground mb-1">Tip Amount:</div>
                  <div className="text-xl font-semibold">
                    ${tipAmount !== null ? tipAmount.toFixed(2) : '—'}
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground mb-1">Total with Tip:</div>
                  <div className="text-xl font-semibold">
                    ${totalWithTip !== null ? totalWithTip.toFixed(2) : '—'}
                  </div>
                </div>
              </div>

              {tipAmount !== null && totalWithTip !== null && billAmount && (
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-muted/50 rounded-md">
                    <div className="text-muted-foreground text-xs mb-1">Split between 2</div>
                    <div className="font-medium">${(totalWithTip / 2).toFixed(2)}</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <div className="text-muted-foreground text-xs mb-1">Split between 4</div>
                    <div className="font-medium">${(totalWithTip / 4).toFixed(2)}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper component for percentage buttons
const PercentButton: React.FC<{
  value: string;
  current: string;
  setCurrent: (value: string) => void;
}> = ({ value, current, setCurrent }) => {
  const isActive = current === value;

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className="w-full"
      onClick={() => setCurrent(value)}
    >
      {value}%
    </Button>
  );
};

export default PercentageCalculator;
