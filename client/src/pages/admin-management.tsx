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
import { Users, Settings, Bell, Eye, UserPlus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

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
    enabled: user?.role === 'admin'
  });

  // Calculate program completion percentage
  const calculateCompletion = (fields: any[]) => {
    if (!fields || fields.length === 0) return 0;
    
    const maxComponents = 10; // Define what constitutes 100%
    const currentComponents = fields.length;
    const percentage = Math.min((currentComponents / maxComponents) * 100, 100);
    
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
      return apiRequest(`/api/forms/assign`, {
        method: 'POST',
        body: JSON.stringify({ programId, userId })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      setSelectedUser('');
      setSelectedProgram(null);
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

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
    }
  });

  const handleAssignProgram = () => {
    if (selectedUser && selectedProgram) {
      assignProgramMutation.mutate({ 
        programId: selectedProgram, 
        userId: selectedUser 
      });
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
            <p className="text-gray-600">Manage users, programs, and system notifications</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {users.length} Users
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {programs.length} Programs
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700">
              {notifications.filter(n => !n.read).length} Unread Notifications
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users Management
            </TabsTrigger>
            <TabsTrigger value="programs" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Programs Overview
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usersLoading ? (
                    <div className="text-center py-8">Loading users...</div>
                  ) : (
                    <div className="grid gap-4">
                      {users.map((user: User) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">
                                {user.firstName && user.lastName 
                                  ? `${user.firstName} ${user.lastName}` 
                                  : user.email}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {programs.filter(p => p.assignedTo === user.id).length} Programs Assigned
                            </Badge>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteUserMutation.mutate(user.id)}
                              disabled={user.role === 'admin'}
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
          </TabsContent>

          {/* Programs Overview */}
          <TabsContent value="programs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Programs Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {programsLoading ? (
                    <div className="text-center py-8">Loading programs...</div>
                  ) : (
                    programs.map((program: Program) => {
                      const completion = calculateCompletion(program.fields);
                      const creator = users.find(u => u.id === program.createdBy);
                      const assignee = users.find(u => u.id === program.assignedTo);
                      
                      return (
                        <div key={program.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{program.label}</h3>
                              <p className="text-sm text-gray-500">ID: {program.menuId}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getCompletionColor(completion)}>
                                {completion}% Complete
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Components Progress</span>
                                <span>{program.fields?.length || 0}/10 components</span>
                              </div>
                              <Progress value={completion} className="h-2" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Created by:</span>
                                <p>{creator?.firstName ? `${creator.firstName} ${creator.lastName}` : creator?.email || 'Unknown'}</p>
                              </div>
                              <div>
                                <span className="font-medium">Assigned to:</span>
                                <p>{assignee ? (assignee.firstName ? `${assignee.firstName} ${assignee.lastName}` : assignee.email) : 'Unassigned'}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>Width: {program.formWidth}</div>
                              <div>Layout: {program.layout}</div>
                              <div>Updated: {new Date(program.updatedAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignment Management */}
          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assign Programs to Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
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
                </div>
                
                <Button 
                  onClick={handleAssignProgram}
                  disabled={!selectedUser || !selectedProgram || assignProgramMutation.isPending}
                  className="w-full"
                >
                  {assignProgramMutation.isPending ? 'Assigning...' : 'Assign Program'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  System Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification: Notification) => (
                    <div key={notification.id} className={`p-4 border rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{notification.message}</div>
                          <div className="text-sm text-gray-500">
                            Program: {notification.programLabel} • {new Date(notification.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <Badge variant={notification.read ? 'secondary' : 'default'}>
                          {notification.read ? 'Read' : 'Unread'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {notifications.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No notifications yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}