import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Right area */}
      <div className="flex-1 flex flex-col">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main Content */}
        <main className="p-6 overflow-y-auto h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
