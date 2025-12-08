
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Minimize2,
  Maximize2
} from "lucide-react";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! 👋 Welcome to TakaSmart! How can I help you today?",
      sender: "bot",
      time: "just now"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const quickReplies = [
    "How does TakaSmart work? 🤔",
    "What rewards can I earn? 🎁",
    "How do I find bins? 📍",
    "Is it really free? 💸"
  ];

  const botResponses = {
    "How does TakaSmart work? 🤔": "Great question! 🌟 TakaSmart is super simple:\n\n1️⃣ Find smart bins near you using our map\n2️⃣ Scan the QR code on the bin\n3️⃣ Dispose your recyclables properly\n4️⃣ Take a photo and earn points instantly!\n5️⃣ Redeem points for airtime, data, and more! 🎁\n\nReady to start earning? 🚀",
    
    "What rewards can I earn? 🎁": "Amazing rewards await you! 💎\n\n📞 Airtime: Ksh 50+ (500+ points)\n📶 Data Bundles: 1GB+ (800+ points)\n🏷️ Discounts: 10-50% off (200+ points)\n💳 M-Pesa Cash: Direct transfer (1000+ points)\n\nThe more you recycle, the more you earn! ♻️💰",
    
    "How do I find bins? 📍": "Finding bins is easy with TakaSmart! 🗺️\n\n✨ Use our interactive map to see all smart bins near you\n📍 Real-time availability status\n🚶‍♀️ Walking directions included\n⏰ Operating hours displayed\n📊 Fill levels shown\n\nNever worry about finding a place to recycle again! 🌍",
    
    "Is it really free? 💸": "Yes, absolutely FREE! 🎉\n\n✅ No subscription fees\n✅ No hidden charges\n✅ Free to download and use\n✅ Earn rewards, don't pay them!\n\nWe make money through partnerships with waste management companies and reward sponsors. You just focus on recycling and earning! 💚🌱"
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user" as const,
      time: "just now"
    };

    setMessages(prev => [...prev, newMessage]);

    // Auto-respond
    setTimeout(() => {
      const response = botResponses[inputMessage as keyof typeof botResponses] || 
        "Thanks for your message! 😊 Our team will get back to you soon. In the meantime, feel free to explore our features or ask about:\n\n• How TakaSmart works 🔄\n• Available rewards 🎁\n• Finding bins 📍\n• Pricing info 💰\n\nHappy recycling! 🌱♻️";

      const botMessage = {
        id: messages.length + 2,
        text: response,
        sender: "bot" as const,
        time: "just now"
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputMessage("");
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
    handleSendMessage();
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        
        {/* Notification Badge */}
        <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
          💬
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-80 shadow-2xl transition-all duration-300 ${isMinimized ? 'h-16' : 'h-96'}`}>
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">TakaSmart Support 🤖</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs opacity-90">Online now</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 p-1"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-white border shadow-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && (
                        <Bot className="w-4 h-4 mt-0.5 text-green-600" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Quick Replies */}
              {messages.length === 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 text-center">Quick questions 👇</p>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-green-50 hover:border-green-300 text-xs"
                        onClick={() => handleQuickReply(reply)}
                      >
                        {reply}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message... 💬"
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default FloatingChat;
