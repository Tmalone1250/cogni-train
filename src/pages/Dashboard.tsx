import React from 'react';
import { Brain, Trophy, Zap, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Level', value: user?.level || 1, icon: Brain },
    { label: 'Points', value: user?.points || 0, icon: Trophy },
    { label: 'Games Played', value: 0, icon: Zap },
    { label: 'Achievements', value: 0, icon: TrendingUp },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user?.full_name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-blue-500" />
                <span className="text-3xl font-bold">{stat.value}</span>
              </div>
              <h3 className="text-gray-500">{stat.label}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="text-gray-500">No recent activity</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Latest Achievements</h2>
          <div className="text-gray-500">No achievements yet</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;