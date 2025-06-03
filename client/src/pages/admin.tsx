import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import UserManagement from "@/components/admin/user-management";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Key, AlertTriangle } from "lucide-react";

export default function AdminPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded mx-auto mb-4 animate-pulse"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (user as any)?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-6 py-16">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-6 h-6" />
                Access Denied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">
                You must be an administrator to access this page.
              </p>
              <p className="text-red-600 text-sm mt-2">
                Contact an administrator to obtain the necessary permissions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-slate-900">Administration</h1>
          </div>
          <p className="text-slate-600">
            Administration panel to manage users and permissions
          </p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm opacity-90 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <div className="text-sm opacity-90">Full Access</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm opacity-90 flex items-center gap-2">
                <Users className="w-4 h-4" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Available</div>
              <div className="text-sm opacity-90">Modify Roles</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm opacity-90 flex items-center gap-2">
                <Key className="w-4 h-4" />
                2FA Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(user as any)?.twoFactorEnabled ? 'Enabled' : 'Available'}
              </div>
              <div className="text-sm opacity-90">Advanced Protection</div>
            </CardContent>
          </Card>
        </div>

        {/* User Management Component */}
        <UserManagement />
      </div>
    </div>
  );
}