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
    <nav className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-cube text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-semibold text-slate-900">FormBuilder Pro</h1>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6 ml-8">
            <Link href="/dashboard">
              <button className={`text-sm font-medium transition-colors ${
                isActive("/dashboard") || isActive("/") 
                  ? "text-primary-600" 
                  : "text-slate-600 hover:text-slate-900"
              }`}>
                Dashboard
              </button>
            </Link>
            
            <Link href="/form-builder">
              <button className={`text-sm font-medium transition-colors ${
                isActive("/form-builder") 
                  ? "text-primary-600" 
                  : "text-slate-600 hover:text-slate-900"
              }`}>
                Form Designer
              </button>
            </Link>
            
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Templates
            </button>
            
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Analytics
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 text-left">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImageUrl || ""} />
                  <AvatarFallback className="bg-primary-100 text-primary-600 text-sm font-medium">
                    {getInitials(user?.firstName, user?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-900">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.email?.split('@')[0] || "User"
                    }
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-slate-500">{user?.email}</p>
                    {user?.role === 'admin' && (
                      <Badge variant="secondary" className="text-xs">Admin</Badge>
                    )}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <i className="fas fa-user w-4 h-4 mr-2"></i>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <i className="fas fa-cog w-4 h-4 mr-2"></i>
                Preferences
              </DropdownMenuItem>
              {user?.role === 'admin' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="w-full flex items-center">
                      <i className="fas fa-shield-alt w-4 h-4 mr-2"></i>
                      Administration
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/api/logout" className="w-full">
                  <i className="fas fa-sign-out-alt w-4 h-4 mr-2"></i>
                  Sign Out
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
