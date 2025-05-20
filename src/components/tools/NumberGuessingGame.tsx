import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RefreshCw, ArrowUp, ArrowDown, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const NumberGuessingGame: React.FC = () => {
  const [minRange, setMinRange] = useState(1);
  const [maxRange, setMaxRange] = useState(100);
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<'too-high' | 'too-low' | 'correct' | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState([50]); // 1-100 scale
  const { toast } = useToast();

  // Initialize or reset the game
  const initGame = () => {
    const min = minRange;
    const max = maxRange;
    const newTarget = Math.floor(Math.random() * (max - min + 1)) + min;
    setTargetNumber(newTarget);
    setGuess('');
    setFeedback(null);
    setAttempts([]);
    setGameOver(false);

    console.log('New game started with target:', newTarget); // For debugging
  };

  // Start a new game when component mounts or when difficulty changes
  useEffect(() => {
    initGame();
  }, [difficultyLevel]);

  // Update range based on difficulty
  useEffect(() => {
    const difficulty = difficultyLevel[0];
    if (difficulty <= 25) { // Easy
      setMinRange(1);
      setMaxRange(50);
    } else if (difficulty <= 50) { // Medium
      setMinRange(1);
      setMaxRange(100);
    } else if (difficulty <= 75) { // Hard
      setMinRange(1);
      setMaxRange(500);
    } else { // Very Hard
      setMinRange(1);
      setMaxRange(1000);
    }
  }, [difficultyLevel]);

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setGuess(value);
  };

  const handleGuessSubmit = () => {
    if (!guess || !targetNumber) return;

    const guessNumber = parseInt(guess);

    // Add this guess to attempts
    setAttempts(prev => [...prev, guessNumber]);

    // Check the guess
    if (guessNumber === targetNumber) {
      setFeedback('correct');
      setGameOver(true);
      toast({
        title: "Congratulations!",
        description: `You guessed the correct number in ${attempts.length + 1} attempts!`,
      });
    } else if (guessNumber > targetNumber) {
      setFeedback('too-high');
    } else {
      setFeedback('too-low');
    }

    // Clear input for next guess
    setGuess('');
  };

  const getDifficultyLabel = () => {
    const difficulty = difficultyLevel[0];
    if (difficulty <= 25) return "Easy (1-50)";
    if (difficulty <= 50) return "Medium (1-100)";
    if (difficulty <= 75) return "Hard (1-500)";
    return "Very Hard (1-1000)";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Number Guessing Game</h2>
      <p className="text-muted-foreground">
        Try to guess the number within the given range. You'll get feedback after each guess.
      </p>

      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
              <div className="space-y-2">
                <Slider
                  value={difficultyLevel}
                  onValueChange={setDifficultyLevel}
                  min={1}
                  max={100}
                  step={1}
                  className="my-4"
                />
                <div className="text-sm text-center text-muted-foreground">
                  {getDifficultyLabel()}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                type="text"
                value={guess}
                onChange={handleGuessChange}
                placeholder={`Enter a number between ${minRange} and ${maxRange}`}
                className="flex-1"
                disabled={gameOver}
                onKeyDown={(e) => e.key === 'Enter' && handleGuessSubmit()}
              />
              <Button onClick={handleGuessSubmit} disabled={!guess || gameOver}>
                Guess
              </Button>
            </div>

            {feedback && (
              <div className={cn(
                "p-4 rounded-lg animate-scale-in flex items-center",
                feedback === 'correct' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                feedback === 'too-high' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              )}>
                {feedback === 'correct' ? (
                  <><CheckCircle2 className="h-5 w-5 mr-2" /> Correct! You guessed the number!</>
                ) : feedback === 'too-high' ? (
                  <><ArrowDown className="h-5 w-5 mr-2" /> Your guess is too high. Try lower.</>
                ) : (
                  <><ArrowUp className="h-5 w-5 mr-2" /> Your guess is too low. Try higher.</>
                )}
              </div>
            )}

            {gameOver && (
              <Button onClick={initGame} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Previous Guesses</h3>
            {attempts.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-2 px-4 text-left text-sm font-medium">Attempt</th>
                      <th className="py-2 px-4 text-left text-sm font-medium">Guess</th>
                      <th className="py-2 px-4 text-left text-sm font-medium">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((attemptValue, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2 px-4">{index + 1}</td>
                        <td className="py-2 px-4">{attemptValue}</td>
                        <td className="py-2 px-4">
                          {targetNumber !== null && (
                            attemptValue === targetNumber ? (
                              <span className="text-green-600 dark:text-green-400 flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-1" /> Correct
                              </span>
                            ) : attemptValue > targetNumber ? (
                              <span className="text-red-600 dark:text-red-400 flex items-center">
                                <ArrowDown className="h-4 w-4 mr-1" /> Too high
                              </span>
                            ) : (
                              <span className="text-amber-600 dark:text-amber-400 flex items-center">
                                <ArrowUp className="h-4 w-4 mr-1" /> Too low
                              </span>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No guesses yet. Start playing!
              </div>
            )}

            {gameOver && targetNumber && (
              <div className="mt-4 p-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg">
                <div className="font-semibold">Game Over!</div>
                <div>You found the number {targetNumber} in {attempts.length} attempts.</div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NumberGuessingGame;
