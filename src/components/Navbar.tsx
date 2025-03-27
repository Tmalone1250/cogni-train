import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Trophy, BarChart3, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuthStore();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Brain },
    { path: '/games', label: 'Games', icon: Brain },
    { path: '/achievements', label: 'Achievements', icon: Trophy },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <nav className="w-64 bg-white h-screen p-6 shadow-lg">
      <div className="flex items-center mb-8">
        <Brain className="w-8 h-8 text-blue-500" />
        <span className="ml-2 text-xl font-bold">CogniTrain</span>
      </div>

      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="ml-3">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="border-t pt-4">
          <div className="flex items-center mb-4">
            <div className="flex-1">
              <p className="font-medium">{user?.full_name}</p>
              <p className="text-sm text-gray-500">{user?.department}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3">Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;