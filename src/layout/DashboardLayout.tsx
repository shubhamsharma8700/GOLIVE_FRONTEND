import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import Topbar from "./Topbar";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { adminBaseApi } from "../store/services/adminBaseApi";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const path = location.pathname;
    const viewId =
      path === "/" || path === "/dashboard" ? "dashboard" :
      path === "/events" ? "events" :
      path === "/viewers" ? "viewers" :
      path === "/reports" ? "reports" :
      path === "/users" ? "users" : "dashboard";
    setCurrentView(viewId);
  }, [location.pathname]);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") {
      dispatch(adminBaseApi.util.invalidateTags(["Dashboard", "Events"]));
    } else if (path === "/events") {
      dispatch(adminBaseApi.util.invalidateTags(["Events"]));
    } else if (path === "/viewers") {
      dispatch(adminBaseApi.util.invalidateTags(["Viewers"]));
    } else if (path === "/reports") {
      dispatch(adminBaseApi.util.invalidateTags(["Reports", "Events"]));
    } else if (path === "/users") {
      dispatch(adminBaseApi.util.invalidateTags(["Admin", "Users"]));
    }
  }, [location.pathname, dispatch]);

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
