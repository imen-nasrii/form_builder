import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, CheckCircle, Clock, TrendingUp, Activity } from 'lucide-react';

interface Program {
  id: number;
  fields: any[];
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface Notification {
  id: string;
  read: boolean;
  type: 'assignment' | 'completion' | 'reminder';
  createdAt: string;
}

export default function RealTimeStats() {
  // Fetch data with real-time updates
  const { data: users = [] } = useQuery({
    queryKey: ['/api/admin/users'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: programs = [] } = useQuery({
    queryKey: ['/api/forms'],
    refetchInterval: 10000,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications'],
    refetchInterval: 5000, // More frequent for notifications
  });

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u: User) => u.role === 'user').length,
    adminUsers: users.filter((u: User) => u.role === 'admin').length,
    totalPrograms: programs.length,
    completedPrograms: programs.filter((p: Program) => {
      const completion = p.fields ? (p.fields.length / 10) * 100 : 0;
      return completion >= 100 || p.status === 'completed';
    }).length,
    inProgressPrograms: programs.filter((p: Program) => {
      const completion = p.fields ? (p.fields.length / 10) * 100 : 0;
      return completion < 100 && (p.status === 'in_progress' || p.status === 'review');
    }).length,
    assignedPrograms: programs.filter((p: Program) => p.assignedTo).length,
    unreadNotifications: notifications.filter((n: Notification) => !n.read).length,
    totalNotifications: notifications.length,
    recentActivity: notifications.filter((n: Notification) => {
      const today = new Date();
      const notificationDate = new Date(n.createdAt);
      return today.getTime() - notificationDate.getTime() < 24 * 60 * 60 * 1000; // Last 24 hours
    }).length,
  };

  // Calculate completion rate
  const completionRate = stats.totalPrograms > 0 
    ? Math.round((stats.completedPrograms / stats.totalPrograms) * 100) 
    : 0;

  // Calculate assignment rate
  const assignmentRate = stats.totalPrograms > 0
    ? Math.round((stats.assignedPrograms / stats.totalPrograms) * 100)
    : 0;

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: `${stats.activeUsers} active`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Programs',
      value: stats.totalPrograms,
      change: `${stats.inProgressPrograms} in progress`,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      change: `${stats.completedPrograms} completed`,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Assignment Rate',
      value: `${assignmentRate}%`,
      change: `${stats.assignedPrograms} assigned`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Notifications',
      value: stats.unreadNotifications,
      change: `${stats.totalNotifications} total`,
      icon: Activity,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Recent Activity',
      value: stats.recentActivity,
      change: 'Last 24 hours',
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  {stat.title === 'Notifications' && stat.value > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}