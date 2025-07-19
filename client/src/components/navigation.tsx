import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/schema";
import { Bell, ChevronDown } from "lucide-react";
import LanguageToggle from "@/components/language-toggle";
import NotificationBell from "@/components/notification-bell";
import formBuilderLogo from "@/assets/formbuilder-logo-3d.png";

export default function Navigation() {
  const { user } = useAuth() as { user: User | null };
  const [location] = useLocation();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-6 py-3 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* FormBuilder Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <img 
              src={formBuilderLogo}
              alt="FormBuilder Logo" 
              className="h-12 w-auto transition-all duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
        
        {/* Main Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard">
            <button className={`px-4 py-2 rounded-lg transition-all ${
              isActive("/dashboard") || isActive("/") 
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium" 
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
            }`}>
              Dashboard
            </button>
          </Link>
          
          {user?.role === 'admin' ? (
            <Link href="/admin-management">
              <button className={`px-4 py-2 rounded-lg transition-all ${
                isActive("/admin-management") 
                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-medium" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
              }`}>
                Admin Dashboard
              </button>
            </Link>
          ) : (
            <Link href="/task-board">
              <button className={`px-4 py-2 rounded-lg transition-all ${
                isActive("/task-board") 
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
              }`}>
                My Tasks
              </button>
            </Link>
          )}
          




          <Link href="/analytics">
            <button className={`px-4 py-2 rounded-lg transition-all ${
              isActive("/analytics") 
                ? "bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 text-orange-700 dark:text-orange-300 font-medium" 
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
            }`}>
              Analytics
            </button>
          </Link>

          {user?.role === 'admin' && (
            <>
              <Link href="/ai-assistant">
                <button className={`px-4 py-2 rounded-lg transition-all ${
                  isActive("/ai-assistant") 
                    ? "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 font-medium" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                }`}>
                  🤖 AI Assistant
                </button>
              </Link>
              

              
              <Link href="/json-validator">
                <button className={`px-4 py-2 rounded-lg transition-all ${
                  isActive("/json-validator") 
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                }`}>
                  ✅ Validateur JSON
                </button>
              </Link>
            </>
          )}
          

        </div>

        {/* User Progress & Profile */}
        <div className="flex items-center gap-4">

          
          {/* Notification Bell */}
          <NotificationBell />


          
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-black dark:text-white">
                {user?.firstName || user?.email?.split('@')[0] || 'User'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role === 'admin' ? 'Admin' : 'Creator'}
              </div>
            </div>
            
            <div className="relative">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-200 dark:ring-purple-800"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black"></div>
            </div>
            
            <button
              onClick={() => {
                fetch('/api/logout', { 
                  method: 'POST',
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                })
                .then(response => {
                  if (response.ok) {
                    window.location.href = '/';
                  } else {
                    window.location.href = '/api/logout';
                  }
                })
                .catch(() => {
                  window.location.href = '/api/logout';
                });
              }}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
