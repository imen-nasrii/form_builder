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
import { 
  Home, 
  BarChart3, 
  Settings, 
  CheckSquare, 
  Bot, 
  Shield, 
  Bell, 
  ChevronDown, 
  User as UserIcon, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import LanguageToggle from "@/components/language-toggle";
import NotificationBell from "@/components/notification-bell";
// Logo removed - using text instead

export default function Navigation() {
  const { user } = useAuth() as { user: User | null };
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <>
      {/* Styles pour les polices modernes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
      
      <nav className="bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 px-4 lg:px-6 py-2 fixed top-0 left-0 right-0 z-50 shadow-sm font-inter">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* FormBuilder Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FormBuilder Pro
                </span>
              </div>
            </div>
          </Link>
        
          {/* Navigation principale - Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/dashboard">
              <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm relative group ${
                isActive("/dashboard") || isActive("/") 
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
              }`}>
                <Home className="w-4 h-4" />
                Dashboard
                {(isActive("/dashboard") || isActive("/")) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                )}
              </button>
            </Link>
            
            {user?.role === 'admin' ? (
              <Link href="/admin-management">
                <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm relative group ${
                  isActive("/admin-management") 
                    ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
                }`}>
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                  {isActive("/admin-management") && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full"></div>
                  )}
                </button>
              </Link>
            ) : (
              <Link href="/task-board">
                <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm relative group ${
                  isActive("/task-board") 
                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
                }`}>
                  <CheckSquare className="w-4 h-4" />
                  My Tasks
                  {isActive("/task-board") && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full"></div>
                  )}
                </button>
              </Link>
            )}

            <Link href="/analytics">
              <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm relative group ${
                isActive("/analytics") 
                  ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
              }`}>
                <BarChart3 className="w-4 h-4" />
                Analytics
                {isActive("/analytics") && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full"></div>
                )}
              </button>
            </Link>

            {user?.role === 'admin' && (
              <>
                <Link href="/ai-assistant">
                  <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm relative group ${
                    isActive("/ai-assistant") 
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}>
                    <Bot className="w-4 h-4" />
                    AI Assistant
                    {isActive("/ai-assistant") && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                </Link>
                
                <Link href="/json-validator">
                  <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm relative group ${
                    isActive("/json-validator") 
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}>
                    <Settings className="w-4 h-4" />
                    JSON Validator
                    {isActive("/json-validator") && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full"></div>
                    )}
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Menu hamburger mobile */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Notification et Profil */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <NotificationBell />
            </div>
            
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg px-2 py-1.5 transition-all duration-200 group">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user?.firstName || user?.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                      {user?.role === 'admin' ? 'Admin' : 'Creator'}
                    </div>
                  </div>
                  
                  <div className="relative">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-300 dark:group-hover:ring-blue-600 transition-all duration-200"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-300 dark:group-hover:ring-blue-600 transition-all duration-200">
                        {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                  
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 shadow-lg border border-gray-200 dark:border-gray-700">
                <DropdownMenuLabel className="font-semibold">Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 w-full hover:bg-gray-50 dark:hover:bg-gray-800">
                    <UserIcon className="w-4 h-4" />
                    Paramètres du profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
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
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="flex flex-col p-4 space-y-2">
              <Link href="/dashboard">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                    isActive("/dashboard") || isActive("/") 
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  Dashboard
                </button>
              </Link>

              {user?.role === 'admin' ? (
                <Link href="/admin-management">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      isActive("/admin-management") 
                        ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300" 
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    Admin Dashboard
                  </button>
                </Link>
              ) : (
                <Link href="/task-board">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      isActive("/task-board") 
                        ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300" 
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <CheckSquare className="w-5 h-5" />
                    My Tasks
                  </button>
                </Link>
              )}

              <Link href="/analytics">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                    isActive("/analytics") 
                      ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  Analytics
                </button>
              </Link>

              {user?.role === 'admin' && (
                <>
                  <Link href="/ai-assistant">
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                        isActive("/ai-assistant") 
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" 
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Bot className="w-5 h-5" />
                      AI Assistant
                    </button>
                  </Link>
                  
                  <Link href="/json-validator">
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                        isActive("/json-validator") 
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" 
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Settings className="w-5 h-5" />
                      JSON Validator
                    </button>
                  </Link>
                </>
              )}

              {/* Profil mobile */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="relative">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user?.firstName || user?.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.role === 'admin' ? 'Admin' : 'Creator'}
                    </div>
                  </div>
                </div>
                
                <Link href="/profile">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <UserIcon className="w-5 h-5" />
                    Paramètres du profil
                  </button>
                </Link>
                
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
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
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}