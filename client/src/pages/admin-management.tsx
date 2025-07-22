import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Users, Settings, Bell, Eye, UserPlus, Trash2, CheckCircle2, AlertCircle, BarChart3, Edit } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import ProgramCompletionTracker from '@/components/program-completion-tracker';

import ActivityFeed from '@/components/activity-feed';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'user';
  createdAt: string;
  assignedForms?: number;
}

interface Program {
  id: number;
  menuId: string;
  label: string;
  formWidth: string;
  layout: string;
  createdBy: string;
  assignedTo?: string;
  fields: any[];
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  id: string;
  userId: string;
  programId: number;
  programLabel: string;
  type: 'assignment' | 'completion' | 'reminder';
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminManagement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  
  // Add user state
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'user'>('user');

  // Fetch all users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: user?.role === 'admin'
  });

  // Fetch all programs
  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ['/api/forms'],
    enabled: user?.role === 'admin'
  });

  // Fetch notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications'],
    enabled: user?.role === 'admin',
    refetchInterval: 60000 // Refresh every 60 seconds (less aggressive)
  });

  // Fetch admin statistics
  const { data: adminStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: user?.role === 'admin',
    refetchInterval: 120000 // Refresh every 2 minutes (less aggressive)
  });

  // Calculate program completion percentage
  const calculateCompletion = (fields: any[]) => {
    if (!fields || fields.length === 0) return 0;
    
    // If program has 10 or more components, it's 100% complete
    const currentComponents = fields.length;
    if (currentComponents >= 10) return 100;
    
    // Calculate percentage based on 10 components = 100%
    const percentage = (currentComponents / 10) * 100;
    
    return Math.round(percentage);
  };

  // Get completion status color
  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Assign program mutation
  const assignProgramMutation = useMutation({
    mutationFn: async ({ programId, userId }: { programId: number; userId: string }) => {
      console.log('Mutation called with:', { programId, userId });
      const response = await apiRequest(`/api/forms/assign`, {
        method: 'POST',
        body: JSON.stringify({ programId, userId })
      });
      console.log('Assignment response:', response);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      setSelectedUser('');
      setSelectedProgram(null);
    },
    onError: (error) => {
      console.error('Assignment error:', error);
    }
  });

  // Send notification mutation
  const sendNotificationMutation = useMutation({
    mutationFn: async ({ userId, programId, message }: { userId: string; programId: number; message: string }) => {
      return apiRequest('/api/notifications', {
        method: 'POST',
        body: JSON.stringify({ userId, programId, message, type: 'reminder' })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    }
  });

  // Add user mutation
  const addUserMutation = useMutation({
    mutationFn: async (userData: { email: string; password: string; role: 'admin' | 'user' }) => {
      console.log('Adding user:', userData);
      return apiRequest('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setShowAddUser(false);
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('user');
    },
    onError: (error) => {
      console.error('Add user error:', error);
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    }
  });

  const handleAddUser = () => {
    console.log('handleAddUser called:', { newUserEmail, newUserPassword, newUserRole });
    if (newUserEmail && newUserPassword) {
      addUserMutation.mutate({
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole
      });
    }
  };

  const handleAssignProgram = () => {
    console.log('handleAssignProgram called', { selectedUser, selectedProgram });
    if (selectedUser && selectedProgram) {
      console.log('Executing assignment mutation...');
      assignProgramMutation.mutate({ 
        programId: selectedProgram, 
        userId: selectedUser 
      });
    } else {
      console.log('Missing data for assignment');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">You need administrator privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-3xl rounded-3xl"></div>
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/20 dark:border-gray-700/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  Admin Dashboard
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                  Advanced system management with real-time analytics
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold">{adminStats?.users?.total || users.length}</div>
                  <div className="text-xs opacity-90">Users</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white px-4 py-2 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold">{adminStats?.programs?.total || programs.length}</div>
                  <div className="text-xs opacity-90">Programs</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold">{adminStats?.notifications?.unread || notifications.filter(n => !n.read).length}</div>
                  <div className="text-xs opacity-90">Alerts</div>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Dashboard Overview Cards */}


        <Tabs defaultValue="users" className="w-full">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-2xl rounded-2xl"></div>
            <TabsList className="relative grid w-full grid-cols-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/30 dark:border-gray-700/30 shadow-2xl rounded-2xl p-2">
              <TabsTrigger 
                value="users" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
              >
                <Users className="w-5 h-5" />
                <span className="font-semibold">Users Management</span>
              </TabsTrigger>
              <TabsTrigger 
                value="programs" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
              >
                <Settings className="w-5 h-5" />
                <span className="font-semibold">Programs Tracker</span>
              </TabsTrigger>
              <TabsTrigger 
                value="assignments" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Assignment Center</span>
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
              >
                <Bell className="w-5 h-5" />
                <span className="font-semibold">Activity & Notifications</span>
              </TabsTrigger>
            </TabsList>
          </div>



          {/* Users Management */}
          <TabsContent value="users" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* User Management Panel */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 blur-2xl rounded-3xl"></div>
                  <Card className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20 shadow-2xl rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200/30">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                            <Users className="w-6 h-6" />
                          </div>
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Users Management
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg border-0 rounded-xl transition-all duration-300"
                          onClick={() => {
                            console.log('Add User button clicked');
                            setShowAddUser(true);
                          }}
                        >
                          <UserPlus className="w-4 h-4" />
                          Add User
                        </Button>
                      </CardTitle>
                    </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {usersLoading ? (
                        <div className="text-center py-8">Loading users...</div>
                      ) : (
                        <div className="space-y-4">
                          {users.map((user: User) => (
                            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                  {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {user.firstName && user.lastName 
                                      ? `${user.firstName} ${user.lastName}` 
                                      : user.email}
                                  </div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                      {user.role}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {programs.filter(p => p.assignedTo === user.id).length} assigned
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete user ${user.email}? This will also delete all their programs and cannot be undone.`)) {
                                      deleteUserMutation.mutate(user.id);
                                    }
                                  }}
                                  disabled={user.role === 'admin' || deleteUserMutation.isPending}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {statsLoading ? (
                      <div className="text-center py-4">Loading stats...</div>
                    ) : (
                      <>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">
                            {adminStats?.users?.total || users.length}
                          </div>
                          <div className="text-sm text-gray-500">Total Users</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              {adminStats?.users?.regular || users.filter(u => u.role === 'user').length}
                            </div>
                            <div className="text-xs text-gray-500">Regular Users</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              {adminStats?.users?.admins || users.filter(u => u.role === 'admin').length}
                            </div>
                            <div className="text-xs text-gray-500">Administrators</div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      {adminStats?.recentActivity ? (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{adminStats.recentActivity.users} new users this week</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{adminStats.recentActivity.programs} programs created</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span>{adminStats.recentActivity.notifications} notifications sent</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Real-time data loading...</span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Admin dashboard accessed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Real-time data refreshed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          </TabsContent>

          {/* Program Tracker */}
          <TabsContent value="programs" className="space-y-6">
            {programsLoading ? (
              <div className="text-center py-8">Loading programs...</div>
            ) : (
              <ProgramCompletionTracker
                programs={programs}
                users={users}
                onViewProgram={(programId) => {
                  window.open(`/form-builder/${programId}`, '_blank');
                }}
                onEditProgram={(programId) => {
                  window.open(`/form-builder/${programId}`, '_blank');
                }}
                onAssignProgram={(programId, userId) => {
                  assignProgramMutation.mutate({ programId, userId });
                }}
              />
            )}
          </TabsContent>

          {/* Assignment Management */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assignment Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Assign Programs to Users
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select User</label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.filter((u: User) => u.role === 'user').map((user: User) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName ? `${user.firstName} ${user.lastName}` : user.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Program</label>
                    <Select value={selectedProgram?.toString() || ''} onValueChange={(value) => setSelectedProgram(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((program: Program) => (
                          <SelectItem key={program.id} value={program.id.toString()}>
                            {program.label} ({calculateCompletion(program.fields)}% complete)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleAssignProgram}
                    disabled={!selectedUser || !selectedProgram || assignProgramMutation.isPending}
                    className="w-full"
                  >
                    {assignProgramMutation.isPending ? 'Assigning...' : 'Assign Program'}
                  </Button>

                  {assignProgramMutation.isSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                      Program assigned successfully!
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Current Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {programs.filter(p => p.assignedTo).map((program: Program) => {
                      const assignee = users.find(u => u.id === program.assignedTo);
                      return (
                        <div key={program.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{program.label}</div>
                            <div className="text-sm text-gray-500">
                              Assigned to: {assignee?.firstName ? `${assignee.firstName} ${assignee.lastName}` : assignee?.email}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{calculateCompletion(program.fields)}%</div>
                            <div className="text-xs text-gray-500">Complete</div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {programs.filter(p => p.assignedTo).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No programs assigned yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity & Notifications */}
          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real-time Activity Feed */}
              <div>
                <ActivityFeed />
              </div>
              
              {/* System Notifications */}
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    System Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <div className="space-y-4 overflow-y-auto h-full">
                    {notifications.map((notification: Notification) => {
                      const user = users.find(u => u.id === notification.userId);
                      const userName = user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email || 'Unknown User';
                      
                      return (
                        <div key={notification.id} className={`p-4 border rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{notification.message}</div>
                              <div className="text-sm text-gray-500">
                                User: {userName} • Program: {notification.programLabel} • {new Date(notification.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={notification.type === 'assignment' ? 'default' : notification.type === 'completion' ? 'secondary' : 'outline'}
                              >
                                {notification.type}
                              </Badge>
                              <Badge variant={notification.read ? 'secondary' : 'default'}>
                                {notification.read ? 'Read' : 'Unread'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {notifications.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No notifications found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-96">
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <Select value={newUserRole} onValueChange={(value: 'admin' | 'user') => setNewUserRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddUser}
                    disabled={!newUserEmail || !newUserPassword || addUserMutation.isPending}
                    className="flex-1"
                  >
                    {addUserMutation.isPending ? 'Adding...' : 'Add User'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      console.log('Cancel button clicked');
                      setShowAddUser(false);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>

                {addUserMutation.isSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    User added successfully!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}