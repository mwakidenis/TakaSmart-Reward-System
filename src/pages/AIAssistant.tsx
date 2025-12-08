
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, Sparkles, Recycle, MapPin, Lightbulb, MessageCircle, Send, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const AIAssistant = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [wasteClassification, setWasteClassification] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: 'Hi! I\'m your TakaSmart AI assistant. I can help you identify waste types, find the best recycling tips, and answer questions about earning more points!' }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const wasteTypes = [
    { type: 'plastic', color: 'bg-blue-100 text-blue-700', points: 50, tips: 'Remove caps, clean containers, separate by type' },
    { type: 'paper', color: 'bg-green-100 text-green-700', points: 30, tips: 'Keep dry, remove staples, separate white from colored paper' },
    { type: 'metal', color: 'bg-gray-100 text-gray-700', points: 75, tips: 'Clean cans, separate aluminum from steel, remove labels' },
    { type: 'glass', color: 'bg-purple-100 text-purple-700', points: 60, tips: 'Separate by color, remove caps, avoid broken glass' },
    { type: 'organic', color: 'bg-orange-100 text-orange-700', points: 25, tips: 'Compost at home, avoid meat and dairy in public bins' }
  ];

  const quickTips = [
    {
      title: "Maximize Your Points",
      content: "Clean containers before recycling to earn bonus points! Dirty items may be rejected.",
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      title: "Best Recycling Times",
      content: "Visit bins early morning or late evening when they're less likely to be full.",
      icon: <MapPin className="w-5 h-5" />
    },
    {
      title: "Weekly Challenges",
      content: "Recycle 5 different waste types in a week to unlock 50 bonus points!",
      icon: <Recycle className="w-5 h-5" />
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        // Simulate AI classification
        setTimeout(() => {
          const randomType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
          setWasteClassification(randomType.type);
          toast({
            title: "Waste Identified!",
            description: `This appears to be ${randomType.type}. Earn ${randomType.points} points!`,
          });
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    
    const newMessage = { role: 'user', content: currentMessage };
    setChatMessages(prev => [...prev, newMessage]);
    setLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      let response = "I'm here to help with your recycling questions!";
      
      const msg = currentMessage.toLowerCase();
      if (msg.includes('point') || msg.includes('reward')) {
        response = "Great question about points! You can earn more by recycling regularly, keeping items clean, and participating in weekly challenges. Plastic items give 50 points, metal gives 75 points, and glass gives 60 points!";
      } else if (msg.includes('bin') || msg.includes('location')) {
        response = "To find the nearest bins, use the 'Find Bins' feature! I recommend checking bin fill levels in the app - less full bins are more likely to accept your items and give you points faster.";
      } else if (msg.includes('clean') || msg.includes('wash')) {
        response = "Excellent! Cleaning your recyclables is key to earning maximum points. Rinse containers, remove labels when possible, and make sure items are dry. This can increase your points by up to 25%!";
      } else if (msg.includes('plastic')) {
        response = "Plastic recycling tips: Remove caps and lids, clean thoroughly, and separate different types. Look for recycling codes 1-7. Clean plastic bottles earn 50 points each!";
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 1500);
    
    setCurrentMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">AI Assistant</h1>
              <p className="opacity-90">Your smart recycling companion</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="classify" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="classify">Waste ID</TabsTrigger>
            <TabsTrigger value="tips">Smart Tips</TabsTrigger>
            <TabsTrigger value="chat">AI Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="classify" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  AI Waste Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {selectedImage ? (
                    <div className="space-y-4">
                      <img src={selectedImage} alt="Uploaded waste" className="mx-auto max-h-48 rounded-lg" />
                      {wasteClassification ? (
                        <div className="space-y-2">
                          <Badge className={wasteTypes.find(w => w.type === wasteClassification)?.color}>
                            {wasteClassification.toUpperCase()}
                          </Badge>
                          <p className="text-sm text-gray-600">
                            {wasteTypes.find(w => w.type === wasteClassification)?.tips}
                          </p>
                          <p className="font-semibold text-green-600">
                            Earn {wasteTypes.find(w => w.type === wasteClassification)?.points} points!
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                          <span>Analyzing...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Camera className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="text-gray-600">Upload a photo to identify waste type and get recycling tips</p>
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button className="w-full" asChild>
                    <span>Take Photo / Upload Image</span>
                  </Button>
                </label>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              <h3 className="font-semibold">Waste Type Guide</h3>
              {wasteTypes.map((waste) => (
                <Card key={waste.type}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <Badge className={waste.color}>{waste.type.toUpperCase()}</Badge>
                        <p className="text-sm text-gray-600">{waste.tips}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{waste.points} pts</div>
                        <div className="text-xs text-gray-500">per item</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <div className="grid gap-4">
              {quickTips.map((tip, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-lg text-green-600">
                        {tip.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{tip.title}</h3>
                        <p className="text-sm text-gray-600">{tip.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Daily Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700">Today's Challenge</h4>
                    <p className="text-sm text-gray-600 mt-1">Recycle 3 different types of waste to earn 100 bonus points!</p>
                    <div className="mt-2">
                      <div className="flex gap-2">
                        <Badge variant="outline">Plastic ✓</Badge>
                        <Badge variant="outline">Paper ✗</Badge>
                        <Badge variant="outline">Metal ✗</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Chat with TakaSmart AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-80 overflow-y-auto space-y-3 border rounded-lg p-4 bg-gray-50">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-green-600 text-white'
                            : 'bg-white border shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white border shadow-sm px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask me about recycling, points, bins, or anything eco-friendly!"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    rows={3}
                  />
                  <Button onClick={sendMessage} disabled={loading || !currentMessage.trim()}>
                    <Send size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
};

export default AIAssistant;
