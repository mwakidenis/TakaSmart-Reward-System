
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, Settings, AlertTriangle, CheckCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";

const AdminBins = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const binsData = [
    {
      id: "BIN001",
      name: "Westlands Mall Bin #1",
      location: "Westlands Shopping Centre, Gate A",
      status: "active",
      fillLevel: 35,
      lastCollection: "2 hours ago",
      totalCollections: 245,
      wasteTypes: ["Plastic", "Paper", "Metal"],
      coordinates: { lat: -1.2641, lng: 36.8078 }
    },
    {
      id: "BIN002",
      name: "Sarit Centre Bin #1",
      location: "Sarit Centre, Main Entrance",
      status: "full",
      fillLevel: 95,
      lastCollection: "6 hours ago",
      totalCollections: 198,
      wasteTypes: ["Plastic", "Paper"],
      coordinates: { lat: -1.2615, lng: 36.8047 }
    },
    {
      id: "BIN003",
      name: "Village Market Bin #2",
      location: "Village Market, Food Court",
      status: "maintenance",
      fillLevel: 60,
      lastCollection: "1 day ago",
      totalCollections: 156,
      wasteTypes: ["Plastic", "Paper", "Metal", "Glass"],
      coordinates: { lat: -1.2505, lng: 36.8013 }
    },
    {
      id: "BIN004",
      name: "Junction Mall Bin #1",
      location: "Junction Mall, Parking Level 1",
      status: "active",
      fillLevel: 22,
      lastCollection: "4 hours ago",
      totalCollections: 134,
      wasteTypes: ["Plastic", "Metal"],
      coordinates: { lat: -1.2364, lng: 36.8847 }
    },
    {
      id: "BIN005",
      name: "Yaya Centre Bin #1",
      location: "Yaya Centre, Ground Floor",
      status: "offline",
      fillLevel: 0,
      lastCollection: "3 days ago",
      totalCollections: 89,
      wasteTypes: ["Plastic", "Paper"],
      coordinates: { lat: -1.2921, lng: 36.7856 }
    }
  ];

  const getStatusIcon = (status, fillLevel) => {
    if (status === "maintenance" || status === "offline") return <AlertTriangle className="text-orange-500" size={16} />;
    if (status === "full" || fillLevel > 90) return <AlertTriangle className="text-red-500" size={16} />;
    return <CheckCircle className="text-green-500" size={16} />;
  };

  const getStatusColor = (status, fillLevel) => {
    if (status === "maintenance") return "bg-orange-100 text-orange-700";
    if (status === "offline") return "bg-gray-100 text-gray-700";
    if (status === "full" || fillLevel > 90) return "bg-red-100 text-red-700";
    return "bg-green-100 text-green-700";
  };

  const getFillLevelColor = (fillLevel) => {
    if (fillLevel > 80) return 'bg-red-500';
    if (fillLevel > 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const filteredBins = binsData.filter(bin => {
    const matchesSearch = bin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bin.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bin.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || bin.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bin Management</h1>
              <p className="text-gray-600">Monitor and manage all TakaSmart bins</p>
            </div>
            <div className="flex gap-3">
              <Link to="/admin">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Add New Bin
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search bins by name, location, or ID..."
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
                  All ({binsData.length})
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  onClick={() => setFilterStatus("active")}
                  size="sm"
                >
                  Active ({binsData.filter(b => b.status === "active").length})
                </Button>
                <Button
                  variant={filterStatus === "full" ? "default" : "outline"}
                  onClick={() => setFilterStatus("full")}
                  size="sm"
                >
                  Full ({binsData.filter(b => b.status === "full").length})
                </Button>
                <Button
                  variant={filterStatus === "maintenance" ? "default" : "outline"}
                  onClick={() => setFilterStatus("maintenance")}
                  size="sm"
                >
                  Maintenance ({binsData.filter(b => b.status === "maintenance").length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bins Grid */}
        <div className="grid gap-6">
          {filteredBins.map((bin) => (
            <Card key={bin.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{bin.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {bin.id}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <MapPin size={14} />
                      <span className="text-sm">{bin.location}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Last collection: {bin.lastCollection} • Total: {bin.totalCollections} collections
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(bin.status, bin.fillLevel)}
                    <Badge className={getStatusColor(bin.status, bin.fillLevel)}>
                      {bin.status === "maintenance" ? "Maintenance" :
                       bin.status === "offline" ? "Offline" :
                       bin.status === "full" ? "Full" : "Active"}
                    </Badge>
                  </div>
                </div>

                {/* Fill Level */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Fill Level</span>
                    <span>{bin.fillLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${getFillLevelColor(bin.fillLevel)}`}
                      style={{ width: `${bin.fillLevel}%` }}
                    ></div>
                  </div>
                </div>

                {/* Waste Types */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Accepted Waste Types:</p>
                  <div className="flex flex-wrap gap-2">
                    {bin.wasteTypes.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Settings size={14} />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    View History
                  </Button>
                  <Button variant="outline" size="sm">
                    Schedule Maintenance
                  </Button>
                  {(bin.status === "full" || bin.fillLevel > 80) && (
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      Schedule Collection
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBins.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bins found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "No bins have been registered yet"
                }
              </p>
              <Button>
                <Plus size={16} className="mr-2" />
                Add First Bin
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminBins;
