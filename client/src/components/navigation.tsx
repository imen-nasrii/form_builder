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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";
import { Bell, ChevronDown, User as UserIcon, LogOut, Plus, FileText, Upload, Download, FileJson, Settings } from "lucide-react";
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
              className="h-16 w-auto transition-all duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
        
        {/* Beautiful Simplified Navigation */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <button className={`px-6 py-2 rounded-full font-medium transition-all ${
              isActive("/dashboard") || isActive("/") 
                ? "bg-blue-500 text-white shadow-md" 
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}>
              Dashboard
            </button>
          </Link>
          
          {user?.role === 'admin' && (
            <Link href="/admin-management">
              <button className={`px-6 py-2 rounded-full font-medium transition-all ${
                isActive("/admin-management") 
                  ? "bg-red-500 text-white shadow-md" 
                  : "text-gray-600 hover:bg-red-50 hover:text-red-600"
              }`}>
                Admin Dashboard
              </button>
            </Link>
          )}

          <Link href="/analytics">
            <button className={`px-6 py-2 rounded-full font-medium transition-all ${
              isActive("/analytics") 
                ? "bg-orange-500 text-white shadow-md" 
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
            }`}>
              Analytics
            </button>
          </Link>

          <Link href="/json-validator">
            <button className={`px-6 py-2 rounded-full font-medium transition-all ${
              isActive("/json-validator") 
                ? "bg-green-500 text-white shadow-md" 
                : "text-gray-600 hover:bg-green-50 hover:text-green-600"
            }`}>
              JSON Validator
            </button>
          </Link>

          {user?.role === 'admin' && (
            <>
              <Link href="/ai-assistant">
                <button className={`px-6 py-2 rounded-full font-medium transition-all ${
                  isActive("/ai-assistant") 
                    ? "bg-purple-500 text-white shadow-md" 
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                }`}>
                  AI Assistant
                </button>
              </Link>

              <CreateProgramButton />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-6 py-2 rounded-full font-medium transition-all flex items-center gap-1 text-gray-600 hover:bg-teal-50 hover:text-teal-600">
                    Import/Export
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Import Programs
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Upload className="w-4 h-4 mr-2" />
                    Export Programs
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <FileJson className="w-4 h-4 mr-2" />
                    Bulk Import JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {user?.role !== 'admin' && (
            <Link href="/task-board">
              <button className={`px-6 py-2 rounded-full font-medium transition-all ${
                isActive("/task-board") 
                  ? "bg-purple-500 text-white shadow-md" 
                  : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              }`}>
                My Tasks
              </button>
            </Link>
          )}
          

        </div>

        {/* User Progress & Profile */}
        <div className="flex items-center gap-4">

          
          {/* Notification Bell */}
          <NotificationBell />


          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors">
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
                
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2 w-full">
                  <UserIcon className="w-4 h-4" />
                  Profile Settings
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
                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

// Create Program Button Component
function CreateProgramButton() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, navigate] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const createFormMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/forms/create', {
        method: 'POST',
        body: {
          menuId: `PROGRAM_${Date.now()}`,
          label: "New Program",
          formWidth: "700px",
          layout: "PROCESS"
        }
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
      navigate(`/form-builder/${data.id}`);
      toast({
        title: "Program Created",
        description: "New program created successfully!",
      });
    },
    onError: (error) => {
      console.error("Error creating program:", error);
      toast({
        title: "Error",
        description: "Failed to create program. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <button 
      onClick={() => createFormMutation.mutate()}
      disabled={createFormMutation.isPending}
      className={`px-6 py-2 rounded-full font-medium transition-all ${
        isActive("/form-builder") 
          ? "bg-indigo-500 text-white shadow-md" 
          : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
      } ${createFormMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {createFormMutation.isPending ? 'Creating...' : 'Create Program'}
    </button>
  );
}
