import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, Users, FileText, Bell, CheckCircle, AlertCircle, UserPlus } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'user_created' | 'program_created' | 'program_assigned' | 'program_completed' | 'notification_sent';
  message: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  programId?: string;
  programName?: string;
}

export default function ActivityFeed() {
  const { data: users = [] } = useQuery({
    queryKey: ['/api/admin/users'],
    refetchInterval: 30000,
  });

  const { data: programs = [] } = useQuery({
    queryKey: ['/api/forms'],
    refetchInterval: 30000,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications'],
    refetchInterval: 10000,
  });

  // Generate activity feed from various data sources
  const generateActivityFeed = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];

    // Add program creation activities
    programs.forEach((program: any) => {
      const user = users.find((u: any) => u.id === program.createdBy);
      activities.push({
        id: `program-${program.id}`,
        type: 'program_created',
        message: `Program "${program.label}" was created`,
        timestamp: program.createdAt,
        userId: program.createdBy,
        userName: user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email,
        programId: program.id.toString(),
        programName: program.label,
      });

      // Add assignment activities
      if (program.assignedTo) {
        const assignee = users.find((u: any) => u.id === program.assignedTo);
        activities.push({
          id: `assignment-${program.id}`,
          type: 'program_assigned',
          message: `Program "${program.label}" was assigned to ${assignee?.firstName ? `${assignee.firstName} ${assignee.lastName}` : assignee?.email}`,
          timestamp: program.updatedAt,
          userId: program.assignedTo,
          userName: assignee?.firstName ? `${assignee.firstName} ${assignee.lastName}` : assignee?.email,
          programId: program.id.toString(),
          programName: program.label,
        });
      }

      // Add completion activities
      if (program.fields && program.fields.length >= 10) {
        activities.push({
          id: `completion-${program.id}`,
          type: 'program_completed',
          message: `Program "${program.label}" was completed`,
          timestamp: program.updatedAt,
          programId: program.id.toString(),
          programName: program.label,
        });
      }
    });

    // Add user creation activities
    users.forEach((user: any) => {
      if (user.role === 'user') {
        activities.push({
          id: `user-${user.id}`,
          type: 'user_created',
          message: `New user ${user.firstName ? `${user.firstName} ${user.lastName}` : user.email} joined`,
          timestamp: user.createdAt,
          userId: user.id,
          userName: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
        });
      }
    });

    // Add notification activities
    notifications.forEach((notification: any) => {
      const user = users.find((u: any) => u.id === notification.userId);
      activities.push({
        id: `notification-${notification.id}`,
        type: 'notification_sent',
        message: notification.message,
        timestamp: notification.createdAt,
        userId: notification.userId,
        userName: user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email,
        programId: notification.programId,
        programName: notification.programLabel,
      });
    });

    // Sort by timestamp (most recent first) and take latest 20
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);
  };

  const activities = generateActivityFeed();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_created':
        return UserPlus;
      case 'program_created':
        return FileText;
      case 'program_assigned':
        return Users;
      case 'program_completed':
        return CheckCircle;
      case 'notification_sent':
        return Bell;
      default:
        return AlertCircle;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_created':
        return 'text-blue-600 bg-blue-50';
      case 'program_created':
        return 'text-green-600 bg-green-50';
      case 'program_assigned':
        return 'text-purple-600 bg-purple-50';
      case 'program_completed':
        return 'text-emerald-600 bg-emerald-50';
      case 'notification_sent':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - then.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="space-y-4 overflow-y-auto h-full">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);

              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-full ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {activity.message}
                    </p>
                    {activity.userName && (
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="w-4 h-4">
                          <AvatarFallback className="text-xs">
                            {activity.userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">{activity.userName}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}