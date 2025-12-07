import { useState } from "react";
import {
  Bell,
  HelpCircle,
  LogOut,
  ChevronDown
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { logout } from "../store/slices/authSlice";

// ⭐ Import logout mutation
import { useLogoutMutation } from "../store/services/auth.service";

interface TopbarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export default function Topbar({}: TopbarProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  console.log("Topbar user:", user);

  const [logoutApi] = useLogoutMutation(); // ⭐ RTK Query logout

  const [notificationCount] = useState(1);

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "AD";

  // ⭐ Updated Logout Handler (ONLY THIS CHANGED)
  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();     // backend logout: clears cookie
      dispatch(logout());             // clear redux auth state
      window.location.href = "/login"; // redirect
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="h-16 bg-black border-b border-gray-800 px-6 flex items-center justify-between shadow-sm">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4"></div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-[#B89B5E] hover:bg-gray-900 transition"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-400 hover:text-[#B89B5E] hover:bg-gray-900 transition"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
              {notificationCount}
            </Badge>
          )}
        </Button>

        <div className="w-px h-6 bg-gray-700 mx-1" />

        {/* PROFILE DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-gray-900 rounded-lg px-2 py-1.5 transition">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B89B5E] to-[#8B7547] flex items-center justify-center text-white text-sm">
                {initials}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#B89B5E]" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 bg-white border border-gray-200 shadow-lg"
          >
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-sm">{user?.name || "Admin User"}</p>
              <p className="text-xs text-[#6B6B6B]">{user?.email}</p>
            </div>

            {/* <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
              <User className="w-4 h-4 mr-2 text-[#6B6B6B]" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
              <Settings className="w-4 h-4 mr-2 text-[#6B6B6B]" />
              <span>Settings</span>
            </DropdownMenuItem> */}

            {/* <DropdownMenuSeparator /> */}

            {/* ⭐ LOGOUT BUTTON — Updated */}
            <DropdownMenuItem
              className="cursor-pointer hover:bg-red-50 text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
