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
import { Bell, ChevronDown } from "lucide-react";

export default function Navigation() {
  const { user } = useAuth();
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
    <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Simple Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-6 h-6 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded"></div>
            <span className="text-lg font-bold text-black dark:text-white">FormBuilder Pro</span>
          </div>
        </Link>
        
        {/* Compact Navigation */}
        <div className="flex items-center gap-6 text-sm">
          <Link href="/dashboard">
            <button className={`transition-colors ${
              isActive("/dashboard") || isActive("/") 
                ? "text-black dark:text-white font-medium" 
                : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            }`}>
              Tableau de bord
            </button>
          </Link>
          
          <Link href="/form-builder">
            <button className={`transition-colors ${
              isActive("/form-builder") 
                ? "text-black dark:text-white font-medium" 
                : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            }`}>
              Concepteur
            </button>
          </Link>
          
          <button className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            Modules
          </button>
          
          {user?.role === 'admin' && (
            <Link href="/admin">
              <button className={`transition-colors ${
                isActive("/admin") 
                  ? "text-black dark:text-white font-medium" 
                  : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}>
                Analytique
              </button>
            </Link>
          )}
        </div>

        {/* Compact User Section */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-right">
            <div className="text-black dark:text-white font-medium">
              {user?.firstName || user?.email?.split('@')[0] || 'Utilisateur'}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
            </div>
          </div>
          
          {user?.profileImageUrl && (
            <img 
              src={user.profileImageUrl} 
              alt="Profile" 
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          
          <a 
            href="/api/logout" 
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            Déconnexion
          </a>
        </div>
      </div>
    </nav>
  );
}
