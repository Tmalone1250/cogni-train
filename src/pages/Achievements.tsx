import React from 'react';
import { Trophy, Star, Target, Zap } from 'lucide-react';

const achievements = [
  {
    id: 'first-game',
    title: 'First Steps',
    description: 'Complete your first cognitive training game',
    icon: Trophy,
    progress: 100,
    earned: true,
  },
  {
    id: 'streak',
    title: 'Consistency Champion',
    description: 'Complete games for 5 days in a row',
    icon: Star,
    progress: 60,
    earned: false,
  },
  {
    id: 'master',
    title: 'Memory Master',
    description: 'Score perfect in Memory Match 3 times',
    icon: Target,
    progress: 33,
    earned: false,
  },
  {
    id: 'speed',
    title: 'Lightning Fast',
    description: 'Complete Quick React under 1 second',
    icon: Zap,
    progress: 0,
    earned: false,
  },
];

const Achievements = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Achievements</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <div
              key={achievement.id}
              className={`bg-white p-6 rounded-lg shadow-md ${
                achievement.earned ? 'border-2 border-yellow-400' : ''
              }`}
            >
              <div className="flex items-center mb-4">
                <Icon
                  className={`w-8 h-8 ${
                    achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                  }`}
                />
                <h2 className="text-xl font-bold ml-3">{achievement.title}</h2>
              </div>
              <p className="text-gray-600 mb-4">{achievement.description}</p>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {achievement.progress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div
                    style={{ width: `${achievement.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;