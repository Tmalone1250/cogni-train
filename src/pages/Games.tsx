import React from 'react';
import { Brain, Zap, Focus } from 'lucide-react';

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
];

const Games = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Cognitive Games</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Games;