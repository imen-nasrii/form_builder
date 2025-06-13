import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { CheckCircle, XCircle, Clock, Play, User } from 'lucide-react';

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState('');

  const { data: programs, isLoading: programsLoading } = useQuery({
    queryKey: ['/api/programs'],
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ programId, status, assignedTo }: { programId: number; status: string; assignedTo?: string }) => {
      return apiRequest(`/api/programs/${programId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, assignedTo })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/programs'] });
      toast({
        title: "Success",
        description: "Program status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update program status",
        variant: "destructive",
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-emerald-500';
      case 'stopped': return 'bg-gray-600';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'in_progress': return <Play className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleStatusUpdate = (programId: number, newStatus: string) => {
    const assignedTo = newStatus === 'in_progress' ? selectedUser : undefined;
    updateStatusMutation.mutate({ programId, status: newStatus, assignedTo });
  };

  if (programsLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage programs and user assignments</p>
        </div>

        <div className="grid gap-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-600">
                  {programs?.filter((p: any) => p.status === 'pending').length || 0}
                </div>
                <p className="text-sm text-gray-600">Pending Programs</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600">
                  {programs?.filter((p: any) => p.status === 'accepted').length || 0}
                </div>
                <p className="text-sm text-gray-600">Accepted Programs</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-500">
                  {programs?.filter((p: any) => p.status === 'in_progress').length || 0}
                </div>
                <p className="text-sm text-gray-600">In Progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-emerald-600">
                  {programs?.filter((p: any) => p.status === 'completed').length || 0}
                </div>
                <p className="text-sm text-gray-600">Completed</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {programs?.map((program: any) => (
                <div key={program.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{program.label}</h3>
                      <p className="text-sm text-gray-500">ID: {program.menuId}</p>
                      <p className="text-sm text-gray-500">Created: {new Date(program.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge className={`${getStatusColor(program.status)} text-white`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(program.status)}
                        <span>{program.status}</span>
                      </div>
                    </Badge>
                    {program.assignedTo && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>Assigned to: {program.assignedTo}</span>
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Select
                      value={selectedUser}
                      onValueChange={setSelectedUser}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Assign to user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users?.filter((u: any) => u.role === 'user').map((user: any) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(program.id, 'accepted')}
                        disabled={updateStatusMutation.isPending}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(program.id, 'rejected')}
                        disabled={updateStatusMutation.isPending}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(program.id, 'in_progress')}
                        disabled={updateStatusMutation.isPending || !selectedUser}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        Start
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}