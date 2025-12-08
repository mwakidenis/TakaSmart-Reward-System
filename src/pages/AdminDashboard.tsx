
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, Recycle, MapPin, Trophy, TrendingUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const overviewStats = [
    { title: "Total Users", value: "2,847", change: "+12%", icon: Users, color: "text-blue-600" },
    { title: "Waste Collected", value: "15.6 tons", change: "+8%", icon: Recycle, color: "text-green-600" },
    { title: "Active Bins", value: "156", change: "+3%", icon: MapPin, color: "text-purple-600" },
    { title: "Points Redeemed", value: "1.2M", change: "+15%", icon: Trophy, color: "text-orange-600" },
  ];

  const weeklyData = [
    { day: "Mon", users: 120, waste: 2.1, points: 15000 },
    { day: "Tue", users: 145, waste: 2.8, points: 18500 },
    { day: "Wed", users: 138, waste: 2.4, points: 17200 },
    { day: "Thu", users: 162, waste: 3.2, points: 21000 },
    { day: "Fri", users: 180, waste: 3.8, points: 24500 },
    { day: "Sat", users: 195, waste: 4.1, points: 26800 },
    { day: "Sun", users: 165, waste: 3.5, points: 22300 },
  ];

  const wasteTypeData = [
    { name: "Plastic", value: 45, color: "#3B82F6" },
    { name: "Paper", value: 25, color: "#10B981" },
    { name: "Metal", value: 20, color: "#8B5CF6" },
    { name: "Glass", value: 10, color: "#F59E0B" },
  ];

  const topLocations = [
    { name: "Westlands Mall", collections: 245, users: 89, status: "Active" },
    { name: "Sarit Centre", collections: 198, users: 67, status: "Active" },
    { name: "Village Market", collections: 156, users: 52, status: "Maintenance" },
    { name: "Junction Mall", collections: 134, users: 45, status: "Active" },
    { name: "Yaya Centre", collections: 112, users: 38, status: "Full" },
  ];

  const recentActivity = [
    { time: "2 mins ago", action: "New user registered", user: "John Mwangi", location: "Westlands" },
    { time: "5 mins ago", action: "Bin maintenance completed", user: "System", location: "Village Market" },
    { time: "8 mins ago", action: "Waste collected", user: "Mary Wanjiku", location: "Sarit Centre" },
    { time: "12 mins ago", action: "Points redeemed", user: "Peter Kamau", location: "Junction Mall" },
    { time: "15 mins ago", action: "New bin registered", user: "Admin", location: "Yaya Centre" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TakaSmart Admin</h1>
              <p className="text-gray-600">Municipal waste management dashboard</p>
            </div>
            <div className="flex gap-3">
              <Link to="/admin/bins">
                <Button variant="outline">Manage Bins</Button>
              </Link>
              <Link to="/admin/users">
                <Button variant="outline">User Management</Button>
              </Link>
              <Link to="/admin/reports">
                <Button>Generate Reports</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} this week</p>
                  </div>
                  <stat.icon className={`${stat.color} w-12 h-12`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts and Data */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3B82F6" name="Active Users" />
                  <Bar dataKey="waste" fill="#10B981" name="Waste (tons)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Waste Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Waste Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={wasteTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {wasteTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {wasteTypeData.map((type, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: type.color }}
                      ></div>
                      <span className="text-sm">{type.name}</span>
                    </div>
                    <span className="text-sm font-medium">{type.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Locations and Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Locations */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLocations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{location.name}</p>
                      <p className="text-sm text-gray-600">
                        {location.collections} collections • {location.users} users
                      </p>
                    </div>
                    <Badge 
                      variant={
                        location.status === "Active" ? "default" :
                        location.status === "Maintenance" ? "secondary" : "destructive"
                      }
                    >
                      {location.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-600">
                        {activity.user} • {activity.location}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
