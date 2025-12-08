
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Recycle, 
  MapPin, 
  QrCode, 
  Gift, 
  Smartphone, 
  Leaf, 
  Trophy,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  MessageCircle,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import FloatingChat from "@/components/FloatingChat";

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <MapPin className="w-8 h-8 text-green-600" />,
      title: "Smart Bin Locator",
      description: "Find the nearest recycling bins using our interactive map with real-time availability.",
      emoji: "📍"
    },
    {
      icon: <QrCode className="w-8 h-8 text-blue-600" />,
      title: "QR Code Scanning",
      description: "Simply scan the bin's QR code to record your recycling activity instantly.",
      emoji: "📱"
    },
    {
      icon: <Gift className="w-8 h-8 text-purple-600" />,
      title: "Instant Rewards",
      description: "Earn points and redeem airtime, data bundles, and exclusive discounts.",
      emoji: "🎁"
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-600" />,
      title: "Leaderboard",
      description: "Compete with friends and climb the eco-warrior leaderboard.",
      emoji: "🏆"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Sign Up & Get Started",
      description: "Create your TakaSmart account in seconds and join the green revolution.",
      icon: <Users className="w-6 h-6" />,
      emoji: "✨"
    },
    {
      step: "2", 
      title: "Find Smart Bins",
      description: "Use our map to locate the nearest recycling bins in your area.",
      icon: <MapPin className="w-6 h-6" />,
      emoji: "🗺️"
    },
    {
      step: "3",
      title: "Scan & Recycle",
      description: "Scan the QR code, dispose your waste properly, and snap a photo.",
      icon: <QrCode className="w-6 h-6" />,
      emoji: "♻️"
    },
    {
      step: "4",
      title: "Earn & Redeem",
      description: "Get points instantly and redeem amazing rewards like airtime and data.",
      icon: <Gift className="w-6 h-6" />,
      emoji: "💰"
    }
  ];

  const rewards = [
    { type: "Airtime", value: "Ksh 50+", points: "500+", color: "bg-green-100 text-green-700", emoji: "📞" },
    { type: "Data Bundles", value: "1GB+", points: "800+", color: "bg-blue-100 text-blue-700", emoji: "📶" },
    { type: "Discounts", value: "10-50% off", points: "200+", color: "bg-purple-100 text-purple-700", emoji: "🏷️" },
    { type: "Cash Rewards", value: "M-Pesa", points: "1000+", color: "bg-yellow-100 text-yellow-700", emoji: "💳" }
  ];

  const stats = [
    { label: "Active Users", value: "10,000+", icon: <Users className="w-5 h-5" />, emoji: "👥" },
    { label: "Bins Monitored", value: "500+", icon: <Recycle className="w-5 h-5" />, emoji: "🗑️" },
    { label: "Points Earned", value: "2M+", icon: <TrendingUp className="w-5 h-5" />, emoji: "📈" },
    { label: "Waste Recycled", value: "50 Tons", icon: <Leaf className="w-5 h-5" />, emoji: "🌱" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-green-600 p-2 rounded-lg">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TakaSmart</span>
              <span className="text-lg">♻️</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-600 hover:text-green-600 transition-colors">How It Works</a>
              <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Features</a>
              <a href="#rewards" className="text-gray-600 hover:text-green-600 transition-colors">Rewards</a>
              <a href="#about" className="text-gray-600 hover:text-green-600 transition-colors">About</a>
            </div>
            <Link to="/auth">
              <Button className="bg-green-600 hover:bg-green-700">
                Get Started 🚀
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-green-100 text-green-700 px-4 py-2 text-sm font-medium">
                  🌍 Making Kenya Cleaner, One Bin at a Time
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Turn Your <span className="text-green-600">Waste</span> into 
                  <span className="text-blue-600"> Rewards</span> ♻️
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join thousands of Kenyans who are earning airtime, data bundles, and cash rewards 
                  while keeping our environment clean. Smart recycling made simple! 📱✨
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4">
                    🚀 Start Earning Now
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  📺 Watch Demo
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-gray-900">
                      <span>{stat.emoji}</span>
                      <span>{stat.value}</span>
                    </div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                      </div>
                      <div>
                        <p className="font-semibold">John Doe</p>
                        <p className="text-sm text-gray-600">Eco Warrior 🌟</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">2,450</p>
                      <p className="text-sm text-gray-600">Points 💎</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">♻️</span>
                        <span className="font-medium">Recycled Today</span>
                      </div>
                      <Badge className="bg-green-600">+50 pts</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📱</span>
                        <span className="font-medium">Ksh 100 Airtime</span>
                      </div>
                      <Badge variant="outline">Redeemed</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-3 animate-bounce">
                <span className="text-2xl">🎁</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-400 rounded-full p-3 animate-pulse">
                <span className="text-2xl">📍</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
              How TakaSmart Works 🔄
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting rewarded for recycling has never been easier! Follow these simple steps and start earning today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    <span className="text-3xl">{step.emoji}</span>
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-8 h-8 text-green-400">→</div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
              Powerful Features 💪
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to make recycling rewarding and fun, all in one smart app.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-300 ${
                    activeFeature === index ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center space-x-2">
                          {feature.icon}
                          <span className="text-2xl">{feature.emoji}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl p-8 text-white">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Smart Dashboard</h3>
                    <span className="text-3xl">📊</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span>Weekly Goal 🎯</span>
                        <span className="font-bold">75%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/20 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-sm opacity-90">This Week 📅</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">#3</div>
                        <div className="text-sm opacity-90">Leaderboard 🏆</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards */}
      <section id="rewards" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
              Amazing Rewards Await 🎁
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Turn your recycling efforts into real value with our exciting reward system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards.map((reward, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-3xl mb-4">
                    {reward.emoji}
                  </div>
                  <CardTitle className="text-xl">{reward.type}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900">{reward.value}</div>
                    <Badge className={reward.color}>From {reward.points} points</Badge>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-6">
              🌟 New rewards added every month! Join now and never miss out.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Start Earning Rewards 💎
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
                About TakaSmart 🌍
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                TakaSmart is Kenya's first smart recycling rewards platform, designed to make 
                environmental conservation profitable and fun for everyone.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">🎯 Our Mission</h3>
                    <p className="text-gray-600">To create a cleaner Kenya while rewarding citizens for their environmental efforts.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">🔬 Smart Technology</h3>
                    <p className="text-gray-600">IoT-enabled bins with real-time monitoring and AI-powered waste classification.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">🤝 Community Impact</h3>
                    <p className="text-gray-600">Building a sustainable future through community-driven environmental action.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Card className="bg-green-100">
                    <CardContent className="p-6 text-center">
                      <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">100%</div>
                      <div className="text-sm text-green-700">Eco-Friendly 🌱</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-100">
                    <CardContent className="p-6 text-center">
                      <Smartphone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">24/7</div>
                      <div className="text-sm text-blue-700">Smart Monitoring 📡</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-4 mt-8">
                  <Card className="bg-purple-100">
                    <CardContent className="p-6 text-center">
                      <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">Award</div>
                      <div className="text-sm text-purple-700">Winning App 🏆</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-yellow-100">
                    <CardContent className="p-6 text-center">
                      <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-600">4.9</div>
                      <div className="text-sm text-yellow-700">User Rating ⭐</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-white">
              Ready to Start Earning? 🚀
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Join thousands of Kenyans who are already earning rewards while keeping our country clean. 
              Download TakaSmart today and start your eco-friendly journey! 🌍✨
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4">
                  🎯 Get Started Free
                </Button>
              </Link>
              <div className="flex items-center space-x-4 text-white">
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>📱 Available on Mobile</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>🌐 Web App Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Recycle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">TakaSmart</span>
                <span className="text-lg">♻️</span>
              </div>
              <p className="text-gray-400">
                Making Kenya cleaner, one smart bin at a time. 🌍
              </p>
              <div className="flex space-x-4">
                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">📘</span>
                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">📱</span>
                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">📧</span>
                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">🐦</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features 🚀</h3>
              <ul className="space-y-2 text-gray-400">
                <li>🗺️ Smart Bin Locator</li>
                <li>📱 QR Code Scanning</li>
                <li>🎁 Rewards System</li>
                <li>🏆 Leaderboard</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Rewards 💎</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📞 Airtime Credits</li>
                <li>📶 Data Bundles</li>
                <li>🏷️ Shopping Discounts</li>
                <li>💳 M-Pesa Cash</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact 📞</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>hello@takasmart.co.ke</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+254 700 123 456</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Nairobi, Kenya 🇰🇪</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TakaSmart. All rights reserved. Made with 💚 in Kenya 🇰🇪</p>
          </div>
        </div>
      </footer>

      {/* Floating Chat Widget */}
      <FloatingChat />
    </div>
  );
};

export default LandingPage;
