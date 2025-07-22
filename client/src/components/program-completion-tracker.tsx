import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Users, Calendar, BarChart3 } from 'lucide-react';

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

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'user';
}

interface ProgramCompletionTrackerProps {
  programs: Program[];
  users: User[];
  onViewProgram: (programId: number) => void;
  onEditProgram: (programId: number) => void;
  onAssignProgram: (programId: number, userId: string) => void;
}

export default function ProgramCompletionTracker({ 
  programs, 
  users, 
  onViewProgram, 
  onEditProgram, 
  onAssignProgram 
}: ProgramCompletionTrackerProps) {
  const [sortBy, setSortBy] = useState<'completion' | 'date' | 'assigned'>('completion');

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

  // Get completion status
  const getCompletionStatus = (percentage: number) => {
    if (percentage >= 100) return { color: 'bg-green-500', text: 'Complete', textColor: 'text-green-700' };
    if (percentage >= 75) return { color: 'bg-blue-500', text: 'Near Complete', textColor: 'text-blue-700' };
    if (percentage >= 50) return { color: 'bg-yellow-500', text: 'In Progress', textColor: 'text-yellow-700' };
    if (percentage >= 25) return { color: 'bg-orange-500', text: 'Started', textColor: 'text-orange-700' };
    return { color: 'bg-red-500', text: 'Not Started', textColor: 'text-red-700' };
  };

  // Sort programs
  const sortedPrograms = [...programs].sort((a, b) => {
    switch (sortBy) {
      case 'completion':
        return calculateCompletion(b.fields) - calculateCompletion(a.fields);
      case 'date':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'assigned':
        if (a.assignedTo && !b.assignedTo) return -1;
        if (!a.assignedTo && b.assignedTo) return 1;
        return 0;
      default:
        return 0;
    }
  });

  // Get user display name
  const getUserDisplayName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return 'Unknown User';
    return user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user.email;
  };

  return (
    <div className="space-y-6">
      {/* Header with sorting options */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Program Completion Tracker</h2>
          <p className="text-gray-600">Monitor progress and completion status of all programs</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <Button
            variant={sortBy === 'completion' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('completion')}
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Completion
          </Button>
          <Button
            variant={sortBy === 'date' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('date')}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Date
          </Button>
          <Button
            variant={sortBy === 'assigned' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('assigned')}
          >
            <Users className="w-4 h-4 mr-1" />
            Assigned
          </Button>
        </div>
      </div>

      {/* Programs grid */}
      <div className="grid gap-4">
        {sortedPrograms.map((program) => {
          const completion = calculateCompletion(program.fields);
          const status = getCompletionStatus(completion);
          const creator = getUserDisplayName(program.createdBy);
          const assignee = program.assignedTo ? getUserDisplayName(program.assignedTo) : null;

          return (
            <Card key={program.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{program.label}</h3>
                      <Badge variant="outline" className="text-xs">
                        {program.menuId}
                      </Badge>
                      <Badge className={`${status.color} text-white`}>
                        {status.text}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Creator:</span>
                        <p className="text-gray-600">{creator}</p>
                      </div>
                      <div>
                        <span className="font-medium">Assigned to:</span>
                        <p className="text-gray-600">{assignee || 'Unassigned'}</p>
                      </div>
                      <div>
                        <span className="font-medium">Layout:</span>
                        <p className="text-gray-600">{program.layout}</p>
                      </div>
                      <div>
                        <span className="font-medium">Width:</span>
                        <p className="text-gray-600">{program.formWidth}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => onViewProgram(program.id)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onEditProgram(program.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Completion Progress</span>
                    <span className={`text-sm font-bold ${status.textColor}`}>
                      {completion}% ({program.fields?.length || 0}/10 components)
                    </span>
                  </div>
                  <Progress value={completion} className="h-3" />
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Created: {new Date(program.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(program.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {programs.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Programs Found</h3>
              <p>Programs will appear here once they are created.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}