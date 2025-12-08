
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, CheckCircle, AlertTriangle, Search, Filter, Navigation as NavigationIcon, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const BinLocator = () => {
  const [selectedBin, setSelectedBin] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  // Fetch bins from database
  const { data: bins = [], isLoading, refetch } = useQuery({
    queryKey: ['bins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bins')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Calculate distances (mock for now - in real app would use geolocation)
      return data.map((bin, index) => ({
        ...bin,
        distance: `${(0.2 + index * 0.3).toFixed(1)} km`,
        estimatedTime: `${Math.ceil((0.2 + index * 0.3) * 12)} min walk`
      }));
    }
  });

  const getStatusIcon = (status, fillLevel) => {
    if (status === "maintenance") return <AlertTriangle className="text-orange-500" size={16} />;
    if (fillLevel > 80) return <AlertTriangle className="text-red-500" size={16} />;
    return <CheckCircle className="text-green-500" size={16} />;
  };

  const getStatusColor = (status, fillLevel) => {
    if (status === "maintenance") return "bg-orange-100 text-orange-700 border-orange-200";
    if (fillLevel > 80) return "bg-red-100 text-red-700 border-red-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const getStatusText = (status, fillLevel) => {
    if (status === "maintenance") return "Maintenance";
    if (fillLevel > 90) return "Full";
    if (fillLevel > 80) return "Nearly Full";
    return "Available";
  };

  const filteredBins = bins.filter(bin => {
    const matchesSearch = bin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bin.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === "available") return matchesSearch && bin.status === "active" && bin.fill_level < 80;
    if (selectedFilter === "nearby") return matchesSearch && parseFloat(bin.distance) < 1.0;
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding nearby bins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Find Smart Bins</h1>
            <p className="opacity-90">Locate nearby TakaSmart bins</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => refetch()}
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            Refresh
          </Button>
        </div>
        
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search bins by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: "all", label: "All Bins" },
              { key: "available", label: "Available" },
              { key: "nearby", label: "Nearby" }
            ].map(filter => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.key)}
                className={`whitespace-nowrap ${
                  selectedFilter === filter.key 
                    ? "bg-white text-green-600" 
                    : "bg-transparent border-white/30 text-white hover:bg-white/20"
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Map Placeholder */}
      <div className="h-48 bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden border-b">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 text-green-600" size={32} />
            <p className="text-gray-700 font-medium">Interactive Map</p>
            <p className="text-sm text-gray-500">Showing {filteredBins.length} bins</p>
          </div>
        </div>
        
        {/* Animated map pins */}
        <div className="absolute top-8 left-8 animate-bounce">
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>
        <div className="absolute top-20 right-12">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>
        <div className="absolute bottom-8 left-16">
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>
      </div>

      {/* Enhanced Bins List */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Nearby Bins ({filteredBins.length})</h2>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm text-gray-500 capitalize">{selectedFilter}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredBins.map((bin) => (
            <Card key={bin.id} className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{bin.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{bin.distance} away</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{bin.estimatedTime}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{bin.location}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {getStatusIcon(bin.status, bin.fill_level)}
                    <Badge className={`${getStatusColor(bin.status, bin.fill_level)} text-xs`}>
                      {getStatusText(bin.status, bin.fill_level)}
                    </Badge>
                  </div>
                </div>

                {/* Fill Level with Enhanced Visualization */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Capacity</span>
                    <span className={`font-semibold ${
                      bin.fill_level > 80 ? 'text-red-600' : 
                      bin.fill_level > 50 ? 'text-yellow-600' : 'text-green-600'
                    }`}>{bin.fill_level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        bin.fill_level > 80 ? 'bg-gradient-to-r from-red-400 to-red-600' : 
                        bin.fill_level > 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                        'bg-gradient-to-r from-green-400 to-green-600'
                      }`}
                      style={{ width: `${bin.fill_level}%` }}
                    ></div>
                  </div>
                </div>

                {/* Waste Types */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Accepts:</p>
                  <div className="flex flex-wrap gap-1">
                    {bin.accepted_waste_types?.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs capitalize bg-gray-50">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    variant={bin.status === "maintenance" || bin.fill_level > 90 ? "secondary" : "default"}
                    disabled={bin.status === "maintenance" || bin.fill_level > 90}
                  >
                    <NavigationIcon size={16} className="mr-2" />
                    {bin.status === "maintenance" ? "Under Maintenance" :
                     bin.fill_level > 90 ? "Bin Full" : "Get Directions"}
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Phone size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredBins.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bins found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default BinLocator;
