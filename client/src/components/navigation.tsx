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
    <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Modern Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full opacity-90 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div>
              <span className="text-xl font-bold text-blue-600">
                FormBuilder
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1 font-medium">Enterprise</div>
            </div>
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
          
          <Link href="/components">
            <button className={`px-4 py-2 rounded-lg transition-all ${
              isActive("/components") 
                ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 font-medium" 
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
            }`}>
              Components
            </button>
          </Link>

          <Link href="/ai-bot">
            <button className={`px-4 py-2 rounded-lg transition-all ${
              isActive("/ai-bot") 
                ? "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 font-medium" 
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
            }`}>
              🤖 AI Bot
            </button>
          </Link>
          
          {user?.role === 'admin' && (
            <>
              <Link href="/admin">
                <button className={`px-4 py-2 rounded-lg transition-all ${
                  isActive("/admin") 
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-medium" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                }`}>
                  Analytics
                </button>
              </Link>

            </>
          )}
        </div>

        {/* User Progress & Profile */}
        <div className="flex items-center gap-4">


          
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
