import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors, Hand, FileText, RefreshCw, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

type Choice = 'rock' | 'paper' | 'scissors' | null;

const RockPaperScissors: React.FC = () => {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [score, setScore] = useState({ player: 0, computer: 0, draws: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const choices: Choice[] = ['rock', 'paper', 'scissors'];

  const getChoiceIcon = (choice: Choice) => {
    switch (choice) {
      case 'rock':
        return <Hand className="h-8 w-8" />;
      case 'paper':
        return <FileText className="h-8 w-8" />;
      case 'scissors':
        return <Scissors className="h-8 w-8" />;
      default:
        return <div className="h-8 w-8" />;
    }
  };

  const getWinner = (player: Choice, computer: Choice): 'win' | 'lose' | 'draw' => {
    if (player === computer) return 'draw';
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'win';
    }
    return 'lose';
  };

  const play = (choice: Choice) => {
    if (isPlaying) return;

    setPlayerChoice(choice);
    setIsPlaying(true);

    // Simulate computer "thinking"
    setTimeout(() => {
      const computerRandomChoice = choices[Math.floor(Math.random() * choices.length)];
      setComputerChoice(computerRandomChoice);

      const gameResult = getWinner(choice, computerRandomChoice);
      setResult(gameResult);

      // Update score
      setScore(prev => {
        const newScore = { ...prev };
        if (gameResult === 'win') newScore.player += 1;
        else if (gameResult === 'lose') newScore.computer += 1;
        else newScore.draws += 1;
        return newScore;
      });

      // Show toast with result
      toast({
        title: gameResult === 'win' ? 'You won!' : gameResult === 'lose' ? 'You lost!' : 'It\'s a draw!',
        description: `You chose ${choice}, computer chose ${computerRandomChoice}`,
        variant: gameResult === 'win' ? 'default' : gameResult === 'lose' ? 'destructive' : 'default',
      });

      setIsPlaying(false);
    }, 1000);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  const resetScore = () => {
    setScore({ player: 0, computer: 0, draws: 0 });
    resetGame();
    toast({
      title: "Score Reset",
      description: "The score has been reset to zero.",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Rock Paper Scissors</h2>
      <p className="text-muted-foreground">
        Play the classic game against the computer.
      </p>

      <Card className="p-6">
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-center font-medium text-lg">You</h3>
              <div className={cn(
                "aspect-square flex items-center justify-center rounded-full",
                "bg-primary/10 text-primary dark:bg-primary/20",
                "text-6xl font-bold",
                playerChoice ? "animate-scale-in" : ""
              )}>
                {playerChoice ? getChoiceIcon(playerChoice) : "?"}
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="text-2xl font-bold text-muted-foreground">VS</div>
            </div>

            <div className="space-y-2">
              <h3 className="text-center font-medium text-lg">Computer</h3>
              <div className={cn(
                "aspect-square flex items-center justify-center rounded-full",
                "bg-primary/10 text-primary dark:bg-primary/20",
                "text-6xl font-bold",
                isPlaying ? "animate-pulse" : computerChoice ? "animate-scale-in" : ""
              )}>
                {isPlaying ? <RefreshCw className="animate-spin h-8 w-8" /> :
                 computerChoice ? getChoiceIcon(computerChoice) : "?"}
              </div>
            </div>
          </div>

          {result && (
            <div className={cn(
              "text-center py-4 rounded-md font-bold text-lg animate-scale-in",
              result === 'win' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
              result === 'lose' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
              "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            )}>
              {result === 'win' ? 'You Win!' :
               result === 'lose' ? 'You Lose!' : 'It\'s a Draw!'}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <Button
              onClick={() => play('rock')}
              disabled={isPlaying}
              className="flex flex-col items-center py-6"
              variant="outline"
            >
              <Hand className="h-8 w-8 mb-2" />
              <span>Rock</span>
            </Button>

            <Button
              onClick={() => play('paper')}
              disabled={isPlaying}
              className="flex flex-col items-center py-6"
              variant="outline"
            >
              <FileText className="h-8 w-8 mb-2" />
              <span>Paper</span>
            </Button>

            <Button
              onClick={() => play('scissors')}
              disabled={isPlaying}
              className="flex flex-col items-center py-6"
              variant="outline"
            >
              <Scissors className="h-8 w-8 mb-2" />
              <span>Scissors</span>
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Score</h3>
          <Button variant="outline" size="sm" onClick={resetScore}>
            Reset Score
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{score.player}</div>
            <div className="text-sm text-muted-foreground">You</div>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{score.draws}</div>
            <div className="text-sm text-muted-foreground">Draws</div>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{score.computer}</div>
            <div className="text-sm text-muted-foreground">Computer</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RockPaperScissors;
