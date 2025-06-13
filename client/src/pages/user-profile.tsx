import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { User, Key, LogOut, Save, ArrowLeft } from 'lucide-react';

export default function UserProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize profile data when user data loads
  React.useEffect(() => {
    if (user) {
      setProfileData({
        firstName: (user as any).firstName || '',
        lastName: (user as any).lastName || '',
        email: (user as any).email || ''
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileData) => {
      return apiRequest('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setIsEditingProfile(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: typeof passwordData) => {
      return apiRequest('/api/auth/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        }),
      });
    },
    onSuccess: () => {
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    }
  });

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate(passwordData);
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setLocation('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Profile</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your account settings</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? 'bg-gray-50' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? 'bg-gray-50' : ''}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  disabled={true}
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div className="flex justify-end space-x-2">
                {isEditingProfile ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileData({
                          firstName: (user as any)?.firstName || '',
                          lastName: (user as any)?.lastName || '',
                          email: (user as any)?.email || ''
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={updateProfileMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditingProfile(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Role</Label>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {(user as any)?.role?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>Email Verified</Label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      (user as any)?.emailVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {(user as any)?.emailVerified ? 'VERIFIED' : 'NOT VERIFIED'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-5 h-5" />
                <span>Change Password</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isChangingPassword ? (
                <Button onClick={() => setIsChangingPassword(true)}>
                  Change Password
                </Button>
              ) : (
                <>
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleChangePassword}
                      disabled={changePasswordMutation.isPending}
                    >
                      {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}