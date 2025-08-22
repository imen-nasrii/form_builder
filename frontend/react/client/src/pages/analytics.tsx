import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/navigation";
import { useAuth } from "@/hooks/useAuth";
import { 
  FileText, 
  TrendingUp, 
  Clock,
  PieChart,
  UserCheck
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar,
  Pie
} from 'recharts';

export default function Analytics() {
  const { user, isAuthenticated } = useAuth();
  const [timeRange, setTimeRange] = useState("7d");

  // Fetch user-specific data
  const { data: forms = [] } = useQuery({
    queryKey: ["/api/forms"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <p className="text-gray-500">Please log in to view analytics</p>
        </div>
      </div>
    );
  }

  // Calculate user-specific metrics from data
  const userForms = Array.isArray(forms) ? forms.filter((form: any) => 
    form.assignedTo === user?.id || form.createdBy === user?.id
  ) : [];
  
  const myAssignedTasks = Array.isArray(forms) ? forms.filter((form: any) => 
    form.assignedTo === user?.id
  ) : [];
  
  const myCreatedPrograms = Array.isArray(forms) ? forms.filter((form: any) => 
    form.createdBy === user?.id
  ) : [];
  
  const completedTasks = myAssignedTasks.filter((task: any) => task.status === 'completed');
  const inProgressTasks = myAssignedTasks.filter((task: any) => task.status === 'in-progress');
  const totalMyForms = userForms.length;
  
  const recentActivity = Array.isArray(forms) ? forms.filter((form: any) => {
    const updated = new Date(form.updatedAt || "");
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const isMyForm = form.assignedTo === user?.id || form.createdBy === user?.id;
    return updated > weekAgo && isMyForm;
  }).length : 0;

  // Calculate user's form type distribution from real data
  const myFormUsageData = Array.isArray(userForms) && userForms.length > 0 ? [
    { 
      name: 'Process Programs', 
      value: userForms.filter((f: any) => f.layout === 'PROCESS').length, 
      color: '#3B82F6' 
    },
    { 
      name: 'Master Menu', 
      value: userForms.filter((f: any) => f.layout === 'MASTER_MENU').length, 
      color: '#10B981' 
    },
    { 
      name: 'Transaction', 
      value: userForms.filter((f: any) => f.layout === 'TRANSACTION').length, 
      color: '#F59E0B' 
    },
    { 
      name: 'Other', 
      value: userForms.filter((f: any) => !['PROCESS', 'MASTER_MENU', 'TRANSACTION'].includes(f.layout)).length, 
      color: '#EF4444' 
    }
  ].filter(item => item.value > 0) : [{ name: 'No Data', value: 1, color: '#9CA3AF' }];

  // Generate user activity data for charts
  const myActivityData = [
    { month: 'Jan', completed: 0, assigned: 0 },
    { month: 'Feb', completed: 0, assigned: 0 },
    { month: 'Mar', completed: 0, assigned: 0 },
    { month: 'Apr', completed: 0, assigned: 0 },
    { month: 'May', completed: 0, assigned: 0 },
    { month: 'Jun', completed: completedTasks.length, assigned: myAssignedTasks.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Your personal performance metrics and activity overview</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">My Programs</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalMyForms}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {myCreatedPrograms.length} created, {myAssignedTasks.length} assigned
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Assigned Tasks</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{myAssignedTasks.length}</div>
              <p className="text-xs text-green-600 dark:text-green-400">
                {completedTasks.length} completed, {inProgressTasks.length} in progress
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Completed Tasks</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{completedTasks.length}</div>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                {myAssignedTasks.length > 0 ? `${Math.round((completedTasks.length / myAssignedTasks.length) * 100)}% completion rate` : 'No tasks assigned yet'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Recent Activity</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{recentActivity}</div>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Programs updated this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                My Task Progress
              </CardTitle>
              <CardDescription>Your assigned and completed tasks over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={myActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="assigned" 
                    stackId="1"
                    stroke="#3B82F6" 
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    name="Assigned Tasks"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stackId="1"
                    stroke="#10B981" 
                    fill="#10B981"
                    fillOpacity={0.6}
                    name="Completed Tasks"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* My Program Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-green-600" />
                My Program Types
              </CardTitle>
              <CardDescription>Breakdown of your program types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={myFormUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {myFormUsageData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4">
                {myFormUsageData.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}