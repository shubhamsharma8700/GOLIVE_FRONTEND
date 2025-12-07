import { LayoutGrid, Calendar, Users, BarChart3, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ currentView, setCurrentView, collapsed, setCollapsed }: SidebarProps) {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutGrid, path: '/' },
    { id: 'events', label: 'Event Management', icon: Calendar, path: '/events' },
    { id: 'users', label: 'Admin Management', icon: Users, path: '/users' },
    { id: 'viewers', label: 'Viewers Management', icon: Eye, path: '/viewers' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, path: '/reports' },
  ];

  const handleNavigation = (item: (typeof menuItems)[0]) => {
    setCurrentView(item.id);
    navigate(item.path);
  };

  return (
    <aside className={`bg-black text-white transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-center border-b border-gray-800">
        {!collapsed ? (
          <div>
            <p className="text-[20px] leading-[28px] text-[#B89B5E] whitespace-nowrap">GoLive</p>
            <p className="text-[12px] leading-[16px] text-[#99A1AF] whitespace-nowrap">Admin Dashboard</p>
          </div>
        ) : (
          <div className="w-12 h-12 flex items-center justify-center">
            <p className="text-xl text-[#B89B5E]">GL</p>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center px-6 py-3 transition-all duration-200 relative group ${
                    isActive ? 'text-white bg-gray-900' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B89B5E]" />
                  )}
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-4 border-t border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-900 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </aside>
  );
}
