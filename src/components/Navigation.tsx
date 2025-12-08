
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, MapPin, QrCode, Gift, Users, Sparkles, User, MoreHorizontal, ArrowLeft } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  
  const primaryNavItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/locate", icon: MapPin, label: "Find Bins" },
    { href: "/scan", icon: QrCode, label: "Scan" },
    { href: "/rewards", icon: Gift, label: "Rewards" },
  ];

  const secondaryNavItems = [
    { href: "/", icon: ArrowLeft, label: "Landing" },
    { href: "/community", icon: Users, label: "Community" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/ai-assistant", icon: Sparkles, label: "AI Help" },
  ];

  const visibleItems = showMore ? [...primaryNavItems, ...secondaryNavItems] : primaryNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="max-w-md mx-auto px-2 py-1">
        <div className="grid grid-cols-5 gap-1">
          {visibleItems.slice(0, 4).map(({ href, icon: Icon, label }) => (
            <Link key={href} to={href} className="flex justify-center">
              <Button
                variant={location.pathname === href ? "default" : "ghost"}
                size="sm"
                className={`flex flex-col items-center gap-0.5 h-14 w-full px-1 ${
                  location.pathname === href 
                    ? "bg-green-600 text-white hover:bg-green-700" 
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                <Icon size={18} />
                <span className="text-xs leading-tight">{label}</span>
              </Button>
            </Link>
          ))}
          
          {/* More/Menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMore(!showMore)}
            className="flex flex-col items-center gap-0.5 h-14 w-full px-1 text-gray-600 hover:text-green-600 hover:bg-green-50"
          >
            <MoreHorizontal size={18} />
            <span className="text-xs leading-tight">More</span>
          </Button>
        </div>
        
        {/* Extended menu when "More" is active */}
        {showMore && (
          <div className="border-t border-gray-100 pt-2 pb-1">
            <div className="grid grid-cols-4 gap-1">
              {secondaryNavItems.map(({ href, icon: Icon, label }) => (
                <Link key={href} to={href} className="flex justify-center">
                  <Button
                    variant={location.pathname === href ? "default" : "ghost"}
                    size="sm"
                    className={`flex flex-col items-center gap-0.5 h-12 w-full px-1 ${
                      location.pathname === href 
                        ? "bg-green-600 text-white hover:bg-green-700" 
                        : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-xs leading-tight">{label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
