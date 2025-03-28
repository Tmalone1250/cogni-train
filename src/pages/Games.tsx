import { useState } from 'react';
import { Brain, Zap, Focus, Code } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import MemoryMatch from '../components/games/MemoryMatch';
import QuickReact from '../components/games/QuickReact';
import FocusFlow from '../components/games/FocusFlow';
import CodeReviewRace from '../components/games/CodeReviewRace';
import '../styles/shake.css';

const games = [
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Test and improve your memory by matching pairs of cards',
    icon: Brain,
    difficulty: 'Medium',
    duration: '5 min',
  },
  {
    id: 'reaction',
    title: 'Quick React',
    description: 'Measure and enhance your reaction time',
    icon: Zap,
    difficulty: 'Easy',
    duration: '2 min',
  },
  {
    id: 'focus',
    title: 'Focus Flow',
    description: 'Stay focused and complete pattern sequences',
    icon: Focus,
    difficulty: 'Hard',
    duration: '10 min',
  },
  {
    id: 'code-review',
    title: 'Code Review Race',
    description: 'Find and fix bugs in code snippets against the clock',
    icon: Code,
    difficulty: 'Medium',
    duration: '1.5 min',
  },
];

const Games = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameDifficulty, setGameDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const handleGameComplete = (score: number) => {
    // TODO: Save score to database
    console.log(`Game completed with score: ${score}`);
  };

  const handleGameSelect = (gameId: string) => {
    setActiveGame(gameId);
  };

  const handleBackToGames = () => {
    setActiveGame(null);
  };

  if (activeGame === 'memory') {
    return (
      <div className="container mx-auto px-4">
        <Toaster />
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Memory Match</h1>
          <div className="space-x-4">
            <button
              type="button"
              onClick={() => setGameDifficulty('easy')}
              className={`px-4 py-2 rounded ${
                gameDifficulty === 'easy'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              4x4 Grid
            </button>
            <button
              type="button"
              onClick={() => setGameDifficulty('hard')}
              className={`px-4 py-2 rounded ${
                gameDifficulty === 'hard'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              6x6 Grid
            </button>
            <button
              type="button"
              onClick={handleBackToGames}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Back to Games
            </button>
          </div>
        </div>
        <MemoryMatch
          difficulty={gameDifficulty === 'medium' ? 'easy' : gameDifficulty}
          onGameComplete={handleGameComplete}
        />
      </div>
    );
  }

  if (activeGame === 'reaction') {
    return (
      <div className="container mx-auto px-4">
        <Toaster />
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Quick React</h1>
          <div className="space-x-4">
            <button
              type="button"
              onClick={() => setGameDifficulty('easy')}
              className={`px-4 py-2 rounded ${
                gameDifficulty === 'easy'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Easy
            </button>
            <button
              type="button"
              onClick={() => setGameDifficulty('medium')}
              className={`px-4 py-2 rounded ${
                gameDifficulty === 'medium'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Medium
            </button>
            <button
              type="button"
              onClick={() => setGameDifficulty('hard')}
              className={`px-4 py-2 rounded ${
                gameDifficulty === 'hard'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Hard
            </button>
            <button
              type="button"
              onClick={handleBackToGames}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Back to Games
            </button>
          </div>
        </div>
        <div className="h-[calc(100vh-12rem)]">
          <QuickReact
            difficulty={gameDifficulty}
            onGameComplete={handleGameComplete}
          />
        </div>
      </div>
    );
  }

  if (activeGame === 'focus') {
    return (
      <div className="container mx-auto px-4">
        <Toaster />
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Focus Flow</h1>
          <div className="space-x-4">
            <button
              type="button"
              onClick={() => setGameDifficulty('easy')}
              className={`px-4 py-2 rounded ${
                gameDifficulty === 'easy'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Easy
            </button>
            <button
              type="button"
              onClick={() => setGameDifficulty('medium')}
              className={`px-4 py-2 rounded ${
                gameDifficulty === 'medium'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Medium
            </button>
            <button
              type="button"
              onClick={() => setGameDifficulty('hard')}
              className={`px-4 py-2 rounded ${
                gameDifficulty === 'hard'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Hard
            </button>
            <button
              type="button"
              onClick={handleBackToGames}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Back to Games
            </button>
          </div>
        </div>
        <div className="h-[calc(100vh-12rem)]">
          <FocusFlow
            difficulty={gameDifficulty}
            onGameComplete={handleGameComplete}
          />
        </div>
      </div>
    );
  }

  if (activeGame === 'code-review') {
    return (
      <div className="container mx-auto px-4">
        <Toaster />
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Code Review Race</h1>
          <div className="space-x-4">
            <button
              type="button"
              onClick={() => setGameDifficulty('easy')}
              className={`px-4 py-2 rounded ${
                gameDifficulty === 'easy'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Easy
            </button>
            <button
              type="button"
              onClick={() => setGameDifficulty('medium')}
              className={`px-4 py-2 rounded ${
                gameDifficulty === 'medium'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Medium
            </button>
            <button
              type="button"
              onClick={() => setGameDifficulty('hard')}
              className={`px-4 py-2 rounded ${
                gameDifficulty === 'hard'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Hard
            </button>
            <button
              type="button"
              onClick={handleBackToGames}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Back to Games
            </button>
          </div>
        </div>
        <div className="h-[calc(100vh-12rem)]">
          <CodeReviewRace
            difficulty={gameDifficulty}
            onGameComplete={handleGameComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Cognitive Games</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <button
              type="button"
              key={game.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
              onClick={() => handleGameSelect(game.id)}
            >
              <div className="flex items-center mb-4">
                <Icon className="w-8 h-8 text-blue-500" />
                <h2 className="text-xl font-bold ml-3">{game.title}</h2>
              </div>
              <p className="text-gray-600 mb-4">{game.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {game.difficulty}
                </span>
                <span className="text-gray-500">{game.duration}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Games;