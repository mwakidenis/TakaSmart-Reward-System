
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Search, MapPin, Trophy, Calendar, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const usersData = [
    {
      id: "USR001",
      name: "John Mwangi",
      phone: "+254 712 345 678",
      email: "john.mwangi@example.com",
      location: "Westlands, Nairobi",
      joinDate: "2024-01-15",
      totalPoints: 8750,
      pointsThisMonth: 2450,
      recyclingCount: 156,
      status: "active",
      lastActivity: "2 hours ago",
      rank: 7
    },
    {
      id: "USR002",
      name: "Mary Wanjiku",
      phone: "+254 723 456 789",
      email: "mary.wanjiku@example.com",
      location: "Kilimani, Nairobi",
      joinDate: "2024-02-20",
      totalPoints: 6420,
      pointsThisMonth: 1890,
      recyclingCount: 98,
      status: "active",
      lastActivity: "1 hour ago",
      rank: 12
    },
    {
      id: "USR003",
      name: "Peter Kamau",
      phone: "+254 734 567 890",
      email: "peter.kamau@example.com",
      location: "Parklands, Nairobi",
      joinDate: "2023-11-10",
      totalPoints: 12350,
      pointsThisMonth: 3200,
      recyclingCount: 234,
      status: "premium",
      lastActivity: "30 mins ago",
      rank: 3
    },
    {
      id: "USR004",
      name: "Grace Njeri",
      phone: "+254 745 678 901",
      email: "grace.njeri@example.com",
      location: "Eastleigh, Nairobi",
      joinDate: "2024-03-05",
      totalPoints: 4560,
      pointsThisMonth: 890,
      recyclingCount: 67,
      status: "active",
      lastActivity: "1 day ago",
      rank: 28
    },
    {
      id: "USR005",
      name: "David Ochieng",
      phone: "+254 756 789 012",
      email: "david.ochieng@example.com",
      location: "Kasarani, Nairobi",
      joinDate: "2024-01-30",
      totalPoints: 2340,
      pointsThisMonth: 120,
      recyclingCount: 23,
      status: "inactive",
      lastActivity: "2 weeks ago",
      rank: 89
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "premium": return "bg-purple-100 text-purple-700";
      case "active": return "bg-green-100 text-green-700";
      case "inactive": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRankBadgeColor = (rank) => {
    if (rank <= 5) return "bg-yellow-100 text-yellow-800";
    if (rank <= 20) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm) ||
                         user.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Monitor and manage TakaSmart users</p>
            </div>
            <div className="flex gap-3">
              <Link to="/admin">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              <Button>Export Data</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold">2,847</p>
                </div>
                <Users className="text-blue-600 w-8 h-8" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active This Month</p>
                  <p className="text-3xl font-bold">1,923</p>
                </div>
                <Users className="text-green-600 w-8 h-8" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New Users</p>
                  <p className="text-3xl font-bold">156</p>
                </div>
                <Users className="text-purple-600 w-8 h-8" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Premium Users</p>
                  <p className="text-3xl font-bold">89</p>
                </div>
                <Trophy className="text-orange-600 w-8 h-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search users by name, email, phone, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  onClick={() => setFilterStatus("active")}
                  size="sm"
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === "premium" ? "default" : "outline"}
                  onClick={() => setFilterStatus("premium")}
                  size="sm"
                >
                  Premium
                </Button>
                <Button
                  variant={filterStatus === "inactive" ? "default" : "outline"}
                  onClick={() => setFilterStatus("inactive")}
                  size="sm"
                >
                  Inactive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar and Basic Info */}
                  <Avatar className="w-12 h-12 bg-green-100 text-green-700">
                    <AvatarFallback className="font-bold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                      <Badge className={getRankBadgeColor(user.rank)} variant="outline">
                        Rank #{user.rank}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={14} />
                          <span>{user.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} />
                          <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Points:</span>
                          <span className="font-semibold text-green-600">{user.totalPoints.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">This Month:</span>
                          <span className="font-semibold">{user.pointsThisMonth.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Recycling Count:</span>
                          <span className="font-semibold">{user.recyclingCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Last Activity:</span>
                          <span className="text-gray-500">{user.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      Message User
                    </Button>
                    {user.status === "inactive" && (
                      <Button variant="outline" size="sm" className="text-orange-600">
                        Reactivate
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "No users have registered yet"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
