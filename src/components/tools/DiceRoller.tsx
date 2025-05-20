import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dices, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const DiceRoller: React.FC = () => {
  const [diceType, setDiceType] = useState('6');
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [rollHistory, setRollHistory] = useState<{dice: string, result: number}[]>([]);
  const { toast } = useToast();

  const rollDice = () => {
    setRolling(true);

    // Simulate dice roll animation
    let rollCount = 0;
    const interval = setInterval(() => {
      const max = parseInt(diceType);
      const result = Math.floor(Math.random() * max) + 1;
      setDiceResult(result);

      rollCount++;
      if (rollCount >= 10) {
        clearInterval(interval);
        setRolling(false);

        // Add to history
        setRollHistory(prev => {
          const newHistory = [...prev, {dice: `d${diceType}`, result}];
          // Keep only last 5 rolls
          return newHistory.slice(-5);
        });

        toast({
          title: "Dice Rolled!",
          description: `You rolled a ${result} on a d${diceType}`,
        });
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Dice Roller</h2>
      <p className="text-muted-foreground">
        Roll virtual dice for your games, RPGs, or random number generation.
      </p>

      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Dice Type</label>
              <Select value={diceType} onValueChange={setDiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select dice type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">D4 (4-sided)</SelectItem>
                  <SelectItem value="6">D6 (6-sided)</SelectItem>
                  <SelectItem value="8">D8 (8-sided)</SelectItem>
                  <SelectItem value="10">D10 (10-sided)</SelectItem>
                  <SelectItem value="12">D12 (12-sided)</SelectItem>
                  <SelectItem value="20">D20 (20-sided)</SelectItem>
                  <SelectItem value="100">D100 (100-sided)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={rollDice}
              disabled={rolling}
              className="w-full"
              size="lg"
            >
              {rolling ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Rolling...
                </>
              ) : (
                <>
                  <Dices className="mr-2 h-5 w-5" />
                  Roll Dice
                </>
              )}
            </Button>
          </div>

          <div>
            {diceResult !== null && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className={cn(
                  "text-6xl md:text-8xl font-bold mb-4 transition-all",
                  rolling ? "animate-pulse" : "animate-scale-in"
                )}>
                  {diceResult}
                </div>
                <div className="text-muted-foreground">
                  d{diceType} result
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {rollHistory.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Roll History</h3>
          <div className="space-y-2">
            {rollHistory.map((roll, index) => (
              <div key={index} className="flex justify-between py-2 border-b last:border-0">
                <span>Roll #{rollHistory.length - index}</span>
                <span>{roll.dice}: <strong>{roll.result}</strong></span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DiceRoller;
