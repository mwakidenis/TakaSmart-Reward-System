
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { FileText, Download, Calendar as CalendarIcon, MapPin, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const AdminReports = () => {
  const [date, setDate] = useState(new Date());
  const [reportType, setReportType] = useState("monthly");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const monthlyData = [
    { month: "Jan", waste: 12.5, users: 234, collections: 1456, points: 145600 },
    { month: "Feb", waste: 14.2, users: 298, collections: 1789, points: 178900 },
    { month: "Mar", waste: 16.8, users: 356, collections: 2134, points: 213400 },
    { month: "Apr", waste: 18.9, users: 423, collections: 2456, points: 245600 },
    { month: "May", waste: 21.3, users: 512, collections: 2789, points: 278900 },
    { month: "Jun", waste: 23.7, users: 634, collections: 3123, points: 312300 },
  ];

  const weeklyTrends = [
    { week: "Week 1", plastic: 4.2, paper: 2.8, metal: 1.5, glass: 0.8 },
    { week: "Week 2", plastic: 4.8, paper: 3.1, metal: 1.7, glass: 0.9 },
    { week: "Week 3", plastic: 5.1, paper: 3.4, metal: 1.8, glass: 1.1 },
    { week: "Week 4", plastic: 5.6, paper: 3.7, metal: 2.0, glass: 1.3 },
  ];

  const locationPerformance = [
    { location: "Westlands", collections: 445, waste: 6.8, users: 156, efficiency: 95 },
    { location: "Kilimani", collections: 389, waste: 5.9, users: 134, efficiency: 92 },
    { location: "Parklands", collections: 356, waste: 5.4, users: 123, efficiency: 89 },
    { location: "Eastleigh", collections: 298, waste: 4.5, users: 98, efficiency: 85 },
    { location: "Kasarani", collections: 234, waste: 3.6, users: 78, efficiency: 78 },
  ];

  const reportTemplates = [
    {
      name: "Monthly Waste Collection Report",
      description: "Comprehensive monthly summary of waste collection activities",
      format: "PDF",
      lastGenerated: "2 days ago"
    },
    {
      name: "User Engagement Analytics",
      description: "User participation metrics and engagement trends",
      format: "Excel",
      lastGenerated: "1 week ago"
    },
    {
      name: "Environmental Impact Assessment",
      description: "Environmental benefits and carbon footprint reduction",
      format: "PDF",
      lastGenerated: "3 days ago"
    },
    {
      name: "Financial Performance Report",
      description: "Points redemption and cost analysis",
      format: "Excel",
      lastGenerated: "5 days ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600">Generate and download comprehensive reports</p>
            </div>
            <div className="flex gap-3">
              <Link to="/admin">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              <Button className="flex items-center gap-2">
                <Download size={16} />
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Report Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="westlands">Westlands</SelectItem>
                    <SelectItem value="kilimani">Kilimani</SelectItem>
                    <SelectItem value="parklands">Parklands</SelectItem>
                    <SelectItem value="eastleigh">Eastleigh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.toLocaleDateString() || "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full">
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts and Analytics */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="waste" stroke="#10B981" strokeWidth={2} name="Waste (tons)" />
                  <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="Active Users" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Waste Type Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Waste Type Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="plastic" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="Plastic" />
                  <Area type="monotone" dataKey="paper" stackId="1" stroke="#10B981" fill="#10B981" name="Paper" />
                  <Area type="monotone" dataKey="metal" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" name="Metal" />
                  <Area type="monotone" dataKey="glass" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Glass" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Location Performance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Location Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locationPerformance.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <MapPin className="text-gray-500" size={20} />
                    <div>
                      <h3 className="font-semibold">{location.location}</h3>
                      <p className="text-sm text-gray-600">
                        {location.collections} collections • {location.waste} tons • {location.users} users
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Efficiency</p>
                      <p className="font-semibold">{location.efficiency}%</p>
                    </div>
                    <div className="w-20">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${location.efficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {reportTemplates.map((template, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="text-green-600" size={20} />
                      <h3 className="font-semibold">{template.name}</h3>
                    </div>
                    <Badge variant="outline">{template.format}</Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">Last generated: {template.lastGenerated}</p>
                    <Button variant="outline" size="sm">
                      <Download size={14} className="mr-2" />
                      Generate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
