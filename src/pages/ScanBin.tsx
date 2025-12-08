
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QrCode, Camera, Upload, CheckCircle, Coins, Zap, Trophy, Target } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ScanBin = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [scanStep, setScanStep] = useState("scan");
  const [scannedBin, setScannedBin] = useState(null);
  const [selectedWasteType, setSelectedWasteType] = useState("");
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Fetch bins for QR code simulation
  const { data: bins = [] } = useQuery({
    queryKey: ['bins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bins')
        .select('*')
        .eq('status', 'active');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch user profile for points display
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Create recycling session mutation
  const createSessionMutation = useMutation({
    mutationFn: async ({ binId, wasteType, points }: { binId: string, wasteType: string, points: number }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('recycling_sessions')
        .insert({
          user_id: user.id,
          bin_id: binId,
          waste_type: wasteType.toLowerCase().replace(/\s+/g, '_') as any,
          points_earned: points,
          verified: true
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['recent-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-count'] });
    }
  });

  const wasteTypes = [
    { type: "Plastic Bottles", points: 50, color: "bg-blue-100 text-blue-700 border-blue-200", dbType: "plastic", icon: "🍶", description: "PET bottles, containers" },
    { type: "Metal Cans", points: 30, color: "bg-gray-100 text-gray-700 border-gray-200", dbType: "metal", icon: "🥤", description: "Aluminum, steel cans" },
    { type: "Paper", points: 20, color: "bg-green-100 text-green-700 border-green-200", dbType: "paper", icon: "📄", description: "Newspapers, magazines" },
    { type: "Glass", points: 40, color: "bg-purple-100 text-purple-700 border-purple-200", dbType: "glass", icon: "🍾", description: "Bottles, jars" },
  ];

  const handleScanBin = () => {
    const activeBins = bins.filter(bin => bin.status === 'active' && bin.fill_level < 90);
    if (activeBins.length === 0) {
      toast.error("No available bins nearby");
      return;
    }
    
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          const randomBin = activeBins[Math.floor(Math.random() * activeBins.length)];
          setScannedBin(randomBin);
          setScanStep("photo");
          setIsScanning(false);
          toast.success("Bin scanned successfully!");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handlePhotoUpload = () => {
    setPhotoUploaded(true);
    setScanStep("confirm");
    toast.success("Photo uploaded successfully!");
  };

  const handleConfirmRecycling = async () => {
    if (!scannedBin || !selectedWasteType) return;
    
    const selectedWaste = wasteTypes.find(w => w.type === selectedWasteType);
    if (!selectedWaste) return;

    try {
      await createSessionMutation.mutateAsync({
        binId: scannedBin.id,
        wasteType: selectedWaste.dbType,
        points: selectedWaste.points
      });
      
      setScanStep("success");
      toast.success(`Awesome! You earned ${selectedWaste.points} points! 🎉`);
    } catch (error) {
      toast.error("Failed to record recycling session");
      console.error(error);
    }
  };

  if (scanStep === "success") {
    const selectedWaste = wasteTypes.find(w => w.type === selectedWasteType);
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Trophy className="text-white" size={48} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mission Accomplished!</h2>
            <p className="text-gray-600 mb-6">You're making a real difference for our planet 🌍</p>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6 border border-green-200">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Coins className="text-yellow-600" size={20} />
                </div>
                <span className="text-3xl font-bold text-green-600">+{selectedWaste?.points}</span>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Zap className="text-green-600" size={20} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">Points earned for {selectedWasteType}</p>
              <p className="text-xs text-gray-500">Current total: {(profile?.total_points || 0) + (selectedWaste?.points || 0)} points</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-3 border">
                <Target className="text-blue-500 mx-auto mb-1" size={20} />
                <p className="text-xs text-gray-600">Impact Score</p>
                <p className="font-bold text-blue-600">+5 🌱</p>
              </div>
              <div className="bg-white rounded-lg p-3 border">
                <Trophy className="text-purple-500 mx-auto mb-1" size={20} />
                <p className="text-xs text-gray-600">Streak</p>
                <p className="font-bold text-purple-600">3 days 🔥</p>
              </div>
            </div>

            <Button 
              onClick={() => {
                setScanStep("scan");
                setScannedBin(null);
                setSelectedWasteType("");
                setPhotoUploaded(false);
                setScanProgress(0);
              }}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              size="lg"
            >
              Scan Another Bin
            </Button>
          </CardContent>
        </Card>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Scan Smart Bin</h1>
            <p className="opacity-90">Earn points for recycling</p>
          </div>
          {profile && (
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Coins size={16} />
                <span className="font-bold">{profile.total_points}</span>
              </div>
              <p className="text-xs opacity-80">Your Points</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 bg-white/10 rounded-lg p-3">
          <div className="text-center">
            <p className="font-bold text-lg">50</p>
            <p className="text-xs opacity-80">Max Points</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{bins.length}</p>
            <p className="text-xs opacity-80">Active Bins</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">4</p>
            <p className="text-xs opacity-80">Waste Types</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {scanStep === "scan" && (
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <QrCode className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-lg">Scan Bin QR Code</p>
                  <p className="text-sm text-gray-600 font-normal">Position the QR code in the viewfinder</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Enhanced QR Scanner */}
              <div className="relative">
                <div className="aspect-square bg-gray-900 rounded-xl overflow-hidden border-4 border-green-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isScanning ? (
                      <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-sm">Scanning QR Code...</p>
                        <Progress value={scanProgress} className="w-32 mx-auto mt-2" />
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <QrCode className="mx-auto mb-4 animate-pulse" size={64} />
                        <p className="text-white/80">Position QR code here</p>
                        <p className="text-sm text-white/60 mt-2">Tap scan to start</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Scanning overlay */}
                  <div className="absolute inset-0 border-2 border-dashed border-white/30 m-8 rounded-lg"></div>
                  
                  {/* Corner indicators */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-l-4 border-t-4 border-green-400"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-r-4 border-t-4 border-green-400"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-l-4 border-b-4 border-green-400"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-r-4 border-b-4 border-green-400"></div>
                </div>
              </div>

              <Button 
                onClick={handleScanBin} 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800" 
                size="lg"
                disabled={bins.length === 0 || isScanning}
              >
                {isScanning ? "Scanning..." : bins.length === 0 ? "Loading bins..." : "Start Scanning"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  💡 <span className="font-medium">Pro Tip:</span> Hold your phone steady for best results
                </p>
                <p className="text-xs text-gray-500">
                  Can't scan? Find the bin ID and enter manually
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {scanStep === "photo" && scannedBin && (
          <div className="space-y-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="text-green-600" size={24} />
                  <div>
                    <span className="font-semibold text-lg">Bin Connected! ✅</span>
                    <p className="text-sm text-gray-600">{scannedBin.name}</p>
                    <p className="text-xs text-gray-500">{scannedBin.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Camera className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-lg">Upload Waste Photo</p>
                    <p className="text-sm text-gray-600 font-normal">Help us verify your recycling</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                  {photoUploaded ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="text-green-600" size={32} />
                      </div>
                      <p className="text-green-600 font-medium">Photo uploaded successfully! 📸</p>
                      <p className="text-sm text-gray-500 mt-1">AI verification in progress...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="mx-auto mb-4 text-gray-400" size={48} />
                      <p className="text-gray-600 font-medium">Take a photo of your recyclables</p>
                      <p className="text-sm text-gray-500 mt-1">Make sure items are clearly visible</p>
                    </div>
                  )}
                </div>

                {!photoUploaded && (
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={handlePhotoUpload} variant="outline" className="flex items-center gap-2 h-12">
                      <Camera size={18} />
                      Take Photo
                    </Button>
                    <Button onClick={handlePhotoUpload} variant="outline" className="flex items-center gap-2 h-12">
                      <Upload size={18} />
                      Upload File
                    </Button>
                  </div>
                )}

                {photoUploaded && (
                  <Button onClick={() => setScanStep("confirm")} className="w-full" size="lg">
                    Continue to Confirmation
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {scanStep === "confirm" && (
          <Card>
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-green-50">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Target className="text-yellow-600" size={20} />
                </div>
                <div>
                  <p className="text-lg">Select Waste Type</p>
                  <p className="text-sm text-gray-600 font-normal">Choose what you're recycling</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid gap-3">
                {wasteTypes.map((waste) => (
                  <button
                    key={waste.type}
                    onClick={() => setSelectedWasteType(waste.type)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedWasteType === waste.type
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{waste.icon}</span>
                        <span className="font-medium text-lg">{waste.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Coins size={16} className="text-yellow-600" />
                        <Badge className={`${waste.color} font-bold`}>
                          +{waste.points}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 ml-11">{waste.description}</p>
                  </button>
                ))}
              </div>

              <Button 
                onClick={handleConfirmRecycling}
                disabled={!selectedWasteType || createSessionMutation.isPending}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                size="lg"
              >
                {createSessionMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Recording...
                  </>
                ) : (
                  <>
                    <Trophy size={18} className="mr-2" />
                    Confirm & Earn Points
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default ScanBin;
