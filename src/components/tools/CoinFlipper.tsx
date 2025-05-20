import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const CoinFlipper: React.FC = () => {
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [flipCount, setFlipCount] = useState({ heads: 0, tails: 0 });
  const { toast } = useToast();

  const flipCoin = () => {
    if (flipping) return;

    setFlipping(true);

    // Simulate flipping animation
    let flipIterations = 0;
    const interval = setInterval(() => {
      setResult(prev => prev === 'heads' ? 'tails' : 'heads');

      flipIterations++;
      if (flipIterations >= 10) {
        clearInterval(interval);

        // Final flip result
        const finalResult: 'heads' | 'tails' = Math.random() > 0.5 ? 'heads' : 'tails';
        setResult(finalResult);

        // Update counts
        setFlipCount(prev => ({
          ...prev,
          [finalResult]: prev[finalResult] + 1
        }));

        setFlipping(false);

        toast({
          title: "Coin Flipped!",
          description: `The result is: ${finalResult.charAt(0).toUpperCase() + finalResult.slice(1)}`,
        });
      }
    }, 100);
  };

  const resetStats = () => {
    setFlipCount({ heads: 0, tails: 0 });
    setResult(null);
    toast({
      title: "Stats Reset",
      description: "Flip statistics have been reset to zero.",
    });
  };

  // Calculate percentages for statistics
  const totalFlips = flipCount.heads + flipCount.tails;
  const headsPercentage = totalFlips > 0 ? Math.round((flipCount.heads / totalFlips) * 100) : 0;
  const tailsPercentage = totalFlips > 0 ? Math.round((flipCount.tails / totalFlips) * 100) : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Coin Flipper</h2>
      <p className="text-muted-foreground">
        Flip a virtual coin for making decisions or playing games.
      </p>

      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center">
            <div
              className={cn(
                "w-40 h-40 md:w-48 md:h-48 rounded-full border-4 flex items-center justify-center",
                "bg-gradient-to-r from-amber-400 to-yellow-300",
                "text-black text-2xl font-bold shadow-xl",
                flipping ? "animate-spin" : "transform transition-all duration-500",
                result === 'heads' ? "bg-gradient-to-r from-amber-300 to-yellow-200" :
                result === 'tails' ? "bg-gradient-to-r from-amber-500 to-yellow-400" : "",
                result ? "animate-scale-in" : ""
              )}
            >
              {result ? (
                <span className="text-center uppercase">
                  {result}
                </span>
              ) : (
                <span className="text-center opacity-50">Ready</span>
              )}
            </div>

            <Button
              onClick={flipCoin}
              disabled={flipping}
              className="mt-8 px-8"
              size="lg"
            >
              {flipping ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Flipping...
                </>
              ) : (
                'Flip Coin'
              )}
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Heads: {flipCount.heads} ({headsPercentage}%)</span>
                  <span>{flipCount.heads} times</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${headsPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Tails: {flipCount.tails} ({tailsPercentage}%)</span>
                  <span>{flipCount.tails} times</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${tailsPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-muted-foreground mb-2">Total flips: {totalFlips}</p>
                <Button variant="outline" size="sm" onClick={resetStats}>
                  Reset Statistics
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CoinFlipper;
