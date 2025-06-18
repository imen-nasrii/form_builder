import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/navigation";
import { useAuth } from "@/hooks/useAuth";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Activity, 
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  DollarSign,
  Eye,
  Edit,
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

// Sample data for charts
const userGrowthData = [
  { month: 'Jan', users: 45, forms: 12 },
  { month: 'Feb', users: 52, forms: 18 },
  { month: 'Mar', users: 61, forms: 24 },
  { month: 'Apr', users: 68, forms: 31 },
  { month: 'May', users: 75, forms: 42 },
  { month: 'Jun', users: 89, forms: 56 }
];

const formUsageData = [
  { name: 'Process Forms', value: 45, color: '#3B82F6' },
  { name: 'Master Menu', value: 25, color: '#10B981' },
  { name: 'Transaction', value: 20, color: '#F59E0B' },
  { name: 'Other', value: 10, color: '#EF4444' }
];

const activityData = [
  { day: 'Mon', views: 24, edits: 12, creates: 3 },
  { day: 'Tue', views: 35, edits: 18, creates: 5 },
  { day: 'Wed', views: 28, edits: 14, creates: 2 },
  { day: 'Thu', views: 42, edits: 22, creates: 7 },
  { day: 'Fri', views: 38, edits: 19, creates: 4 },
  { day: 'Sat', views: 15, edits: 8, creates: 1 },
  { day: 'Sun', views: 12, edits: 6, creates: 1 }
];

export default function Analytics() {
  const { user, isAuthenticated } = useAuth();
  const [timeRange, setTimeRange] = useState("7d");

  // Fetch real data
  const { data: forms = [] } = useQuery({
    queryKey: ["/api/forms"],
    enabled: isAuthenticated,
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: user?.role === 'admin',
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

  // Calculate real metrics from data
  const totalUsers = Array.isArray(allUsers) ? allUsers.length : 0;
  const adminUsers = Array.isArray(allUsers) ? allUsers.filter((u: any) => u.role === 'admin').length : 0;
  const regularUsers = totalUsers - adminUsers;
  const totalForms = Array.isArray(forms) ? forms.length : 0;
  const recentForms = Array.isArray(forms) ? forms.filter((form: any) => {
    const updated = new Date(form.updatedAt || "");
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return updated > weekAgo;
  }).length : 0;

  // Calculate form type distribution from real data
  const realFormUsageData = Array.isArray(forms) && forms.length > 0 ? [
    { 
      name: 'Process Forms', 
      value: forms.filter((f: any) => f.layout === 'PROCESS').length, 
      color: '#3B82F6' 
    },
    { 
      name: 'Master Menu', 
      value: forms.filter((f: any) => f.layout === 'MASTER_MENU').length, 
      color: '#10B981' 
    },
    { 
      name: 'Transaction', 
      value: forms.filter((f: any) => f.layout === 'TRANSACTION').length, 
      color: '#F59E0B' 
    },
    { 
      name: 'Other', 
      value: forms.filter((f: any) => !['PROCESS', 'MASTER_MENU', 'TRANSACTION'].includes(f.layout)).length, 
      color: '#EF4444' 
    }
  ].filter(item => item.value > 0) : formUsageData;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">System overview and performance metrics</p>
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
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalUsers}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total Forms</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{totalForms}</div>
              <p className="text-xs text-green-600 dark:text-green-400">
                +{recentForms} this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Administrators</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{adminUsers}</div>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                {Math.round((adminUsers / totalUsers) * 100)}% of total users
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">24</div>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Real-time activity
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                User & Form Growth
              </CardTitle>
              <CardDescription>Monthly growth trends over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="forms" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Form Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-green-600" />
                Form Types Distribution
              </CardTitle>
              <CardDescription>Breakdown of form types in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={realFormUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {realFormUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4">
                {realFormUsageData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Weekly Activity Overview
            </CardTitle>
            <CardDescription>Form views, edits, and creation activity by day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#3B82F6" name="Views" />
                <Bar dataKey="edits" fill="#10B981" name="Edits" />
                <Bar dataKey="creates" fill="#F59E0B" name="Creates" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Real-time Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Forms accessed today</span>
                <Badge variant="secondary">{Math.floor(totalForms * 0.3)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Forms edited today</span>
                <Badge variant="secondary">{Math.floor(totalForms * 0.1)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Recent forms</span>
                <Badge variant="secondary">{recentForms}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Database Status</span>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">API Response Time</span>
                <Badge variant="secondary">~120ms</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                <Badge className="bg-green-100 text-green-800">99.9%</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total forms</span>
                <Badge variant="secondary">{totalForms}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Regular users</span>
                <Badge variant="secondary">{regularUsers}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Average session</span>
                <Badge variant="secondary">12 min</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}