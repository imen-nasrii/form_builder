import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors, DragOverEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Play, 
  MessageSquare,
  Calendar,
  User,
  Target,
  Plus,
  Upload,
  FileText,
  GripVertical
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Droppable Zone Component
function DroppableZone({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div className="min-h-[400px] p-4" data-droppable-id={id}>
      {children}
    </div>
  );
}

// Sortable Task Card Component
function SortableTaskCard({ task, onTaskClick }: { task: any; onTaskClick: (task: any) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <Play className="w-4 h-4" />;
      case 'review': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-3 cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <CardTitle className="text-sm font-medium truncate">{task.label}</CardTitle>
            </div>
            {getStatusIcon(task.status)}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>ID: {task.menuId}</span>
            <Badge className={`text-xs px-2 py-1 ${getPriorityColor(task.priority || 'medium')}`}>
              {task.priority || 'Medium'}
            </Badge>
          </div>
          {task.description && (
            <p className="text-xs text-gray-600 truncate mb-2">{task.description}</p>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-xs h-7"
            onClick={(e) => {
              e.stopPropagation();
              onTaskClick(task);
            }}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UserTaskBoard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [resultDescription, setResultDescription] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Fetch assigned programs for current user
  const { data: assignedPrograms = [] } = useQuery({
    queryKey: ['/api/forms', 'assigned', user?.id],
    queryFn: async () => {
      const response = await apiRequest('/api/forms');
      const allForms = response;
      return allForms.filter((form: any) => form.assignedTo === user?.id);
    },
    enabled: !!user?.id
  });

  // Group tasks by status
  const todoTasks = assignedPrograms.filter((task: any) => task.status === 'todo' || !task.status);
  const inProgressTasks = assignedPrograms.filter((task: any) => task.status === 'in_progress');
  const reviewTasks = assignedPrograms.filter((task: any) => task.status === 'review');
  const completedTasks = assignedPrograms.filter((task: any) => task.status === 'completed');

  // Update task status/priority mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status, priority, comment }: { 
      taskId: number; 
      status?: string; 
      priority?: string; 
      comment?: string 
    }) => {
      return await apiRequest(`/api/forms/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, priority, comment }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
      toast({
        title: "Task Updated",
        description: "Task has been updated successfully.",
      });
      setSelectedTask(null);
      setComment('');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task.",
        variant: "destructive",
      });
    },
  });

  // Submit task result mutation
  const submitResultMutation = useMutation({
    mutationFn: async ({ taskId, resultDescription, file }: { 
      taskId: number; 
      resultDescription: string; 
      file?: File 
    }) => {
      const formData = new FormData();
      formData.append('resultDescription', resultDescription);
      formData.append('status', 'review');
      if (file) {
        formData.append('resultFile', file);
      }
      
      return await apiRequest(`/api/forms/${taskId}/result`, {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
      toast({
        title: "Result Submitted",
        description: "Your work has been submitted for review.",
      });
      setSelectedTask(null);
      setResultDescription('');
      setResultFile(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit result.",
        variant: "destructive",
      });
    },
  });

  // Handle drag start
  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  // Handle drag end - update task status based on drop zone
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = String(over.id);

    // Map droppable zone IDs to status values
    const statusMap: { [key: string]: string } = {
      'todo-zone': 'todo',
      'in_progress-zone': 'in_progress', 
      'review-zone': 'review',
      'completed-zone': 'completed'
    };

    const mappedStatus = statusMap[newStatus] || newStatus;

    if (active.id !== over.id) {
      updateTaskMutation.mutate({
        taskId,
        status: mappedStatus,
      });
    }
  }

  // Get the dragged task for overlay
  const activeTask = activeId ? assignedPrograms.find(task => String(task.id) === activeId) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Task Board</h1>
            <p className="text-gray-600">Drag and drop tasks to update their status</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">To Do</p>
                    <p className="text-2xl font-bold text-gray-900">{todoTasks.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Play className="w-8 h-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{inProgressTasks.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Review</p>
                    <p className="text-2xl font-bold text-gray-900">{reviewTasks.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{completedTasks.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kanban Task Board */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* To Do Column */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-blue-50">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">To Do</h3>
                  <Badge variant="secondary" className="ml-auto">{todoTasks.length}</Badge>
                </div>
              </div>
              <SortableContext items={todoTasks.map(task => task.id.toString())} strategy={verticalListSortingStrategy}>
                <DroppableZone id="todo-zone">
                  {todoTasks.map(task => (
                    <SortableTaskCard 
                      key={task.id} 
                      task={task} 
                      onTaskClick={setSelectedTask}
                    />
                  ))}
                  {todoTasks.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                      <div className="text-center">
                        <Clock className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Drop tasks here</p>
                      </div>
                    </div>
                  )}
                </DroppableZone>
              </SortableContext>
            </div>

            {/* In Progress Column */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-yellow-50">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-900">In Progress</h3>
                  <Badge variant="secondary" className="ml-auto">{inProgressTasks.length}</Badge>
                </div>
              </div>
              <SortableContext items={inProgressTasks.map(task => task.id.toString())} strategy={verticalListSortingStrategy}>
                <DroppableZone id="in_progress-zone">
                  {inProgressTasks.map(task => (
                    <SortableTaskCard 
                      key={task.id} 
                      task={task} 
                      onTaskClick={setSelectedTask}
                    />
                  ))}
                  {inProgressTasks.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                      <div className="text-center">
                        <Play className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Drop tasks here</p>
                      </div>
                    </div>
                  )}
                </DroppableZone>
              </SortableContext>
            </div>

            {/* Review Column */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-orange-50">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-900">Review</h3>
                  <Badge variant="secondary" className="ml-auto">{reviewTasks.length}</Badge>
                </div>
              </div>
              <SortableContext items={reviewTasks.map(task => task.id.toString())} strategy={verticalListSortingStrategy}>
                <DroppableZone id="review-zone">
                  {reviewTasks.map(task => (
                    <SortableTaskCard 
                      key={task.id} 
                      task={task} 
                      onTaskClick={setSelectedTask}
                    />
                  ))}
                  {reviewTasks.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                      <div className="text-center">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Drop tasks here</p>
                      </div>
                    </div>
                  )}
                </DroppableZone>
              </SortableContext>
            </div>

            {/* Completed Column */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">Completed</h3>
                  <Badge variant="secondary" className="ml-auto">{completedTasks.length}</Badge>
                </div>
              </div>
              <SortableContext items={completedTasks.map(task => task.id.toString())} strategy={verticalListSortingStrategy}>
                <DroppableZone id="completed-zone">
                  {completedTasks.map(task => (
                    <SortableTaskCard 
                      key={task.id} 
                      task={task} 
                      onTaskClick={setSelectedTask}
                    />
                  ))}
                  {completedTasks.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                      <div className="text-center">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Drop tasks here</p>
                      </div>
                    </div>
                  )}
                </DroppableZone>
              </SortableContext>
            </div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeTask ? (
              <div className="opacity-90">
                <SortableTaskCard task={activeTask} onTaskClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>

          {/* Task Detail Modal */}
          {selectedTask && (
            <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {selectedTask.label}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Task Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Menu ID</label>
                      <p className="text-sm text-gray-900">{selectedTask.menuId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <Badge className={getStatusColor(selectedTask.status)}>
                        {selectedTask.status || 'To Do'}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Priority</label>
                      <Badge className={getPriorityColor(selectedTask.priority)}>
                        {selectedTask.priority || 'Medium'}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Created</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedTask.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedTask.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedTask.description}</p>
                    </div>
                  )}

                  {/* Submit Result Section */}
                  {(selectedTask.status === 'in_progress' || selectedTask.status === 'todo') && (
                    <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                      <h4 className="font-medium text-blue-900 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Submit Work Result
                      </h4>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Result Description</label>
                        <Textarea
                          value={resultDescription}
                          onChange={(e) => setResultDescription(e.target.value)}
                          placeholder="Describe your work and results..."
                          className="mt-1"
                          rows={4}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Attach File (Optional)</label>
                        <Input
                          type="file"
                          onChange={(e) => setResultFile(e.target.files?.[0] || null)}
                          className="mt-1"
                          accept=".pdf,.doc,.docx,.txt,.zip,.png,.jpg,.jpeg"
                        />
                        {resultFile && (
                          <p className="text-xs text-gray-600 mt-1">
                            Selected: {resultFile.name}
                          </p>
                        )}
                      </div>

                      <Button
                        onClick={() => submitResultMutation.mutate({
                          taskId: selectedTask.id,
                          resultDescription,
                          file: resultFile || undefined
                        })}
                        disabled={!resultDescription.trim() || submitResultMutation.isPending}
                        className="w-full"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Submit for Review
                      </Button>
                    </div>
                  )}

                  {/* Quick Status Update */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Quick Status Update</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateTaskMutation.mutate({ 
                            taskId: selectedTask.id, 
                            status: 'in_progress' 
                          })}
                          className="flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" />
                          Start Work
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateTaskMutation.mutate({ 
                            taskId: selectedTask.id, 
                            status: 'review' 
                          })}
                          className="flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          Send to Review
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Update Priority</label>
                      <Select 
                        value={selectedTask.priority || 'medium'} 
                        onValueChange={(value: 'low' | 'medium' | 'high') => {
                          updateTaskMutation.mutate({ 
                            taskId: selectedTask.id, 
                            priority: value 
                          });
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Add Comment */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Add Comment</label>
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment about this task..."
                        className="mt-1"
                        rows={3}
                      />
                      <Button 
                        onClick={() => updateTaskMutation.mutate({ 
                          taskId: selectedTask.id, 
                          comment 
                        })}
                        className="mt-2"
                        disabled={!comment.trim() || updateTaskMutation.isPending}
                        variant="outline"
                        size="sm"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </DndContext>
  );
}