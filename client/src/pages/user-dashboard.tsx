import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Plus, Play, Square, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

export default function UserDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['/api/programs'],
  });

  const stopProgramMutation = useMutation({
    mutationFn: async (programId: number) => {
      return apiRequest(`/api/programs/${programId}/stop`, {
        method: 'PATCH',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/programs'] });
      toast({
        title: "Success",
        description: "Program stopped successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to stop program",
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
      case 'stopped': return <Square className="w-4 h-4" />;
      default: return null;
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'draft': return 10;
      case 'pending': return 25;
      case 'accepted': return 50;
      case 'in_progress': return 75;
      case 'completed': return 100;
      case 'rejected': return 0;
      case 'stopped': return 40;
      default: return 0;
    }
  };

  const canStopProgram = (status: string) => {
    return ['pending', 'accepted', 'in_progress'].includes(status);
  };

  const handleStopProgram = (programId: number) => {
    stopProgramMutation.mutate(programId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">Loading your programs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Programs</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and track your program progress</p>
          </div>
          <Button
            onClick={() => setLocation('/program-builder')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Program
          </Button>
        </div>

        <div className="grid gap-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-gray-600">
                  {(programs as any[]).filter((p: any) => p.status === 'draft').length || 0}
                </div>
                <p className="text-sm text-gray-600">Draft Programs</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-yellow-600">
                  {(programs as any[]).filter((p: any) => p.status === 'pending').length || 0}
                </div>
                <p className="text-sm text-gray-600">Pending Review</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-600">
                  {(programs as any[]).filter((p: any) => p.status === 'in_progress').length || 0}
                </div>
                <p className="text-sm text-gray-600">In Progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600">
                  {(programs as any[]).filter((p: any) => p.status === 'completed').length || 0}
                </div>
                <p className="text-sm text-gray-600">Completed</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Programs</CardTitle>
          </CardHeader>
          <CardContent>
            {(programs as any[]).length === 0 ? (
              <div className="text-center py-8">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No programs yet</h3>
                <p className="text-gray-500 mb-4">Create your first program to get started</p>
                <Button
                  onClick={() => setLocation('/program-builder')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create Program
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {Array.isArray(programs) ? programs.map((program: any) => (
                  <div key={program.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{program.label}</h3>
                          <p className="text-sm text-gray-500">ID: {program.menuId}</p>
                          <p className="text-sm text-gray-500">Created: {new Date(program.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Badge className={`${getStatusColor(program.status)} text-white`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(program.status)}
                            <span>{program.status.replace('_', ' ')}</span>
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setLocation(`/program-builder/${program.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        {canStopProgram(program.status) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStopProgram(program.id)}
                            disabled={stopProgramMutation.isPending}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Square className="w-4 h-4 mr-2" />
                            Stop
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{getProgressValue(program.status)}%</span>
                      </div>
                      <Progress value={getProgressValue(program.status)} className="h-2" />
                      <div className="text-xs text-gray-500">
                        {program.status === 'pending' && 'Waiting for admin approval'}
                        {program.status === 'accepted' && 'Approved, ready to start'}
                        {program.status === 'rejected' && 'Rejected by admin'}
                        {program.status === 'in_progress' && 'Currently being processed'}
                        {program.status === 'completed' && 'Successfully completed'}
                        {program.status === 'stopped' && 'Stopped by user'}
                        {program.status === 'draft' && 'Draft - not submitted yet'}
                      </div>
                    </div>
                  </div>
                )) : []}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}