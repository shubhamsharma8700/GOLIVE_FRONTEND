import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EventList } from '@/components/admin/EventList';
import { AnalyticsView } from '@/components/admin/AnalyticsView';
import { VodLibrary } from '@/components/admin/VodLibrary';
import { useUser } from '@/context/UserContext';
import { LogOut, LayoutDashboard, Calendar, BarChart3, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

type MenuItem = 'events' | 'analytics' | 'vod';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useUser();
  const [activeMenu, setActiveMenu] = useState<MenuItem>('events');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'events' as MenuItem, label: 'Events', icon: Calendar },
    { id: 'analytics' as MenuItem, label: 'Analytics', icon: BarChart3 },
    { id: 'vod' as MenuItem, label: 'VOD Library', icon: Film },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold">GoLive Admin</h1>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                  activeMenu === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-3 px-4">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user?.name || 'Admin User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {user?.email}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {menuItems.find((item) => item.id === activeMenu)?.label || 'Dashboard'}
          </h2>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeMenu === 'events' && <EventList />}
          {activeMenu === 'analytics' && <AnalyticsView />}
          {activeMenu === 'vod' && <VodLibrary />}
        </main>
      </div>
    </div>
  );
};
