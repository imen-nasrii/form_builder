import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Kanban, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  FileText, 
  User, 
  Calendar,
  MessageSquare,
  Edit,
  Eye
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

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
  status?: 'todo' | 'in_progress' | 'review' | 'completed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  description?: string;
  comments?: string[];
}

interface TaskUpdate {
  programId: number;
  status?: string;
  priority?: string;
  comment?: string;
}

export default function UserTaskBoard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Program | null>(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [taskComment, setTaskComment] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [taskPriority, setTaskPriority] = useState('');

  // Fetch user's assigned programs
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['/api/forms'],
    select: (data: Program[]) => data.filter(p => p.assignedTo === user?.id),
    refetchInterval: 30000
  });

  // Fetch notifications for updates
  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications'],
    refetchInterval: 10000
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async (update: TaskUpdate) => {
      return apiRequest(`/api/forms/${update.programId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: update.status,
          priority: update.priority,
          updatedAt: new Date()
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
      setShowTaskDialog(false);
      setTaskComment('');
    }
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ programId, comment }: { programId: number; comment: string }) => {
      return apiRequest('/api/notifications', {
        method: 'POST',
        body: JSON.stringify({
          userId: user?.id,
          programId,
          message: `Comment on "${selectedTask?.label}": ${comment}`,
          type: 'completion'
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      setTaskComment('');
    }
  });

  // Calculate completion percentage
  const calculateCompletion = (fields: any[]) => {
    if (!fields || fields.length === 0) return 0;
    const maxComponents = 10;
    const currentComponents = fields.length;
    return Math.min((currentComponents / maxComponents) * 100, 100);
  };

  // Get status info
  const getStatusInfo = (status: string, completion: number) => {
    if (completion >= 100) {
      return { 
        status: 'completed', 
        color: 'bg-green-500', 
        textColor: 'text-green-700', 
        bgColor: 'bg-green-50',
        label: 'Completed' 
      };
    }
    
    switch (status) {
      case 'in_progress':
        return { 
          status: 'in_progress', 
          color: 'bg-blue-500', 
          textColor: 'text-blue-700', 
          bgColor: 'bg-blue-50',
          label: 'In Progress' 
        };
      case 'review':
        return { 
          status: 'review', 
          color: 'bg-yellow-500', 
          textColor: 'text-yellow-700', 
          bgColor: 'bg-yellow-50',
          label: 'In Review' 
        };
      case 'completed':
        return { 
          status: 'completed', 
          color: 'bg-green-500', 
          textColor: 'text-green-700', 
          bgColor: 'bg-green-50',
          label: 'Completed' 
        };
      default:
        return { 
          status: 'todo', 
          color: 'bg-gray-500', 
          textColor: 'text-gray-700', 
          bgColor: 'bg-gray-50',
          label: 'To Do' 
        };
    }
  };

  // Get priority info
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return { color: 'bg-red-500', textColor: 'text-red-700', label: 'Urgent' };
      case 'high':
        return { color: 'bg-orange-500', textColor: 'text-orange-700', label: 'High' };
      case 'medium':
        return { color: 'bg-yellow-500', textColor: 'text-yellow-700', label: 'Medium' };
      default:
        return { color: 'bg-green-500', textColor: 'text-green-700', label: 'Low' };
    }
  };

  // Group programs by status
  const groupedPrograms = {
    todo: programs.filter(p => {
      const completion = calculateCompletion(p.fields);
      return completion < 100 && (!p.status || p.status === 'todo');
    }),
    in_progress: programs.filter(p => {
      const completion = calculateCompletion(p.fields);
      return completion < 100 && p.status === 'in_progress';
    }),
    review: programs.filter(p => {
      const completion = calculateCompletion(p.fields);
      return completion < 100 && p.status === 'review';
    }),
    completed: programs.filter(p => {
      const completion = calculateCompletion(p.fields);
      return completion >= 100 || p.status === 'completed';
    })
  };

  const handleTaskClick = (program: Program) => {
    setSelectedTask(program);
    const completion = calculateCompletion(program.fields);
    const statusInfo = getStatusInfo(program.status || 'todo', completion);
    setTaskStatus(statusInfo.status);
    setTaskPriority(program.priority || 'medium');
    setShowTaskDialog(true);
  };

  const handleUpdateTask = () => {
    if (selectedTask) {
      updateTaskMutation.mutate({
        programId: selectedTask.id,
        status: taskStatus,
        priority: taskPriority
      });

      if (taskComment.trim()) {
        addCommentMutation.mutate({
          programId: selectedTask.id,
          comment: taskComment
        });
      }
    }
  };

  if (user?.role === 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <Kanban className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Task Board Access</h2>
            <p className="text-gray-600">This board is for regular users to manage their assigned tasks. Administrators can manage assignments from the Admin Panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Kanban className="w-8 h-8 text-blue-600" />
              My Task Board
            </h1>
            <p className="text-gray-600">Manage your assigned programs and track progress</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {programs.length} Total Tasks
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {groupedPrograms.completed.length} Completed
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700">
              {notifications.filter(n => !n.read).length} Updates
            </Badge>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* To Do Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b">
              <Clock className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold">To Do</h2>
              <Badge variant="secondary">{groupedPrograms.todo.length}</Badge>
            </div>
            <div className="space-y-3">
              {groupedPrograms.todo.map((program) => (
                <TaskCard
                  key={program.id}
                  program={program}
                  onClick={() => handleTaskClick(program)}
                />
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b">
              <Play className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">In Progress</h2>
              <Badge variant="secondary">{groupedPrograms.in_progress.length}</Badge>
            </div>
            <div className="space-y-3">
              {groupedPrograms.in_progress.map((program) => (
                <TaskCard
                  key={program.id}
                  program={program}
                  onClick={() => handleTaskClick(program)}
                />
              ))}
            </div>
          </div>

          {/* Review Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b">
              <Eye className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg font-semibold">Review</h2>
              <Badge variant="secondary">{groupedPrograms.review.length}</Badge>
            </div>
            <div className="space-y-3">
              {groupedPrograms.review.map((program) => (
                <TaskCard
                  key={program.id}
                  program={program}
                  onClick={() => handleTaskClick(program)}
                />
              ))}
            </div>
          </div>

          {/* Completed Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold">Completed</h2>
              <Badge variant="secondary">{groupedPrograms.completed.length}</Badge>
            </div>
            <div className="space-y-3">
              {groupedPrograms.completed.map((program) => (
                <TaskCard
                  key={program.id}
                  program={program}
                  onClick={() => handleTaskClick(program)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {programs.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Kanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Tasks Assigned</h3>
            <p className="text-gray-500">You don't have any programs assigned yet. Check back later or contact your administrator.</p>
          </div>
        )}

        {/* Task Detail Dialog */}
        <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {selectedTask?.label}
              </DialogTitle>
            </DialogHeader>
            
            {selectedTask && (
              <div className="space-y-6">
                {/* Task Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Progress</Label>
                    <div className="mt-1">
                      <Progress value={calculateCompletion(selectedTask.fields)} className="h-3" />
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedTask.fields?.length || 0}/10 components ({calculateCompletion(selectedTask.fields)}%)
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label>Program ID</Label>
                    <p className="text-sm text-gray-600 mt-1">{selectedTask.menuId}</p>
                  </div>
                </div>

                {/* Status and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Select value={taskStatus} onValueChange={setTaskStatus}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={taskPriority} onValueChange={setTaskPriority}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Add Comment */}
                <div>
                  <Label>Add Update Comment</Label>
                  <Textarea
                    placeholder="Describe your progress, blockers, or questions..."
                    value={taskComment}
                    onChange={(e) => setTaskComment(e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/form-builder/${selectedTask.id}`, '_blank')}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Program
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateTask} disabled={updateTaskMutation.isPending}>
                      {updateTaskMutation.isPending ? 'Updating...' : 'Update Task'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Task Card Component
function TaskCard({ program, onClick }: { program: Program; onClick: () => void }) {
  const completion = calculateCompletion(program.fields);
  const statusInfo = getStatusInfo(program.status || 'todo', completion);
  const priorityInfo = getPriorityInfo(program.priority || 'medium');

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
      style={{ borderLeftColor: statusInfo.color.replace('bg-', '#') }}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm leading-tight">{program.label}</h3>
            <Badge 
              className={`${priorityInfo.color} text-white text-xs`}
            >
              {priorityInfo.label}
            </Badge>
          </div>

          {/* ID */}
          <p className="text-xs text-gray-500">{program.menuId}</p>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{completion}%</span>
            </div>
            <Progress value={completion} className="h-2" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={statusInfo.bgColor}>
              {statusInfo.label}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              {new Date(program.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateCompletion(fields: any[]) {
  if (!fields || fields.length === 0) return 0;
  const maxComponents = 10;
  const currentComponents = fields.length;
  return Math.round(Math.min((currentComponents / maxComponents) * 100, 100));
}

function getStatusInfo(status: string, completion: number) {
  if (completion >= 100) {
    return { 
      status: 'completed', 
      color: 'bg-green-500', 
      textColor: 'text-green-700', 
      bgColor: 'bg-green-50',
      label: 'Completed' 
    };
  }
  
  switch (status) {
    case 'in_progress':
      return { 
        status: 'in_progress', 
        color: 'bg-blue-500', 
        textColor: 'text-blue-700', 
        bgColor: 'bg-blue-50',
        label: 'In Progress' 
      };
    case 'review':
      return { 
        status: 'review', 
        color: 'bg-yellow-500', 
        textColor: 'text-yellow-700', 
        bgColor: 'bg-yellow-50',
        label: 'In Review' 
      };
    case 'completed':
      return { 
        status: 'completed', 
        color: 'bg-green-500', 
        textColor: 'text-green-700', 
        bgColor: 'bg-green-50',
        label: 'Completed' 
      };
    default:
      return { 
        status: 'todo', 
        color: 'bg-gray-500', 
        textColor: 'text-gray-700', 
        bgColor: 'bg-gray-50',
        label: 'To Do' 
      };
  }
}

function getPriorityInfo(priority: string) {
  switch (priority) {
    case 'urgent':
      return { color: 'bg-red-500', textColor: 'text-red-700', label: 'Urgent' };
    case 'high':
      return { color: 'bg-orange-500', textColor: 'text-orange-700', label: 'High' };
    case 'medium':
      return { color: 'bg-yellow-500', textColor: 'text-yellow-700', label: 'Medium' };
    default:
      return { color: 'bg-green-500', textColor: 'text-green-700', label: 'Low' };
  }
}