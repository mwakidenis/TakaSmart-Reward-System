
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import BinLocator from "./pages/BinLocator";
import ScanBin from "./pages/ScanBin";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBins from "./pages/AdminBins";
import AdminUsers from "./pages/AdminUsers";
import AdminReports from "./pages/AdminReports";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";

// Create QueryClient outside of component to avoid recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<PublicRoute />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/locate" element={
                <ProtectedRoute>
                  <BinLocator />
                </ProtectedRoute>
              } />
              <Route path="/scan" element={
                <ProtectedRoute>
                  <ScanBin />
                </ProtectedRoute>
              } />
              <Route path="/community" element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } />
              <Route path="/rewards" element={
                <ProtectedRoute>
                  <Rewards />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/ai-assistant" element={
                <ProtectedRoute>
                  <AIAssistant />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/bins" element={
                <ProtectedRoute>
                  <AdminBins />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute>
                  <AdminReports />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
