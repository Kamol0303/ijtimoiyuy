import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AppLayout } from "@/components/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Uylar from "./pages/Uylar";
import Fuqarolar from "./pages/Fuqarolar";
import Arizalar from "./pages/Arizalar";
import Shartnomalar from "./pages/Shartnomalar";
import Monitoring from "./pages/Monitoring";
import Xarita from "./pages/Xarita";
import YerUchastkalari from "./pages/YerUchastkalari";
import Navbat from "./pages/Navbat";
import AITahlil from "./pages/AITahlil";
import Hisobotlar from "./pages/Hisobotlar";
import Xabarnomalar from "./pages/Xabarnomalar";
import Sozlamalar from "./pages/Sozlamalar";
import AmallarTarixi from "./pages/AmallarTarixi";
import NazoratPaneli from "./pages/NazoratPaneli";
import YakunlanganIshlar from "./pages/YakunlanganIshlar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/uylar" element={<ProtectedRoute><Uylar /></ProtectedRoute>} />
      <Route path="/fuqarolar" element={<ProtectedRoute><Fuqarolar /></ProtectedRoute>} />
      <Route path="/arizalar" element={<ProtectedRoute><Arizalar /></ProtectedRoute>} />
      <Route path="/shartnomalar" element={<ProtectedRoute><Shartnomalar /></ProtectedRoute>} />
      <Route path="/monitoring" element={<ProtectedRoute><Monitoring /></ProtectedRoute>} />
      <Route path="/xarita" element={<ProtectedRoute><Xarita /></ProtectedRoute>} />
      <Route path="/yer-uchastkalari" element={<ProtectedRoute><YerUchastkalari /></ProtectedRoute>} />
      <Route path="/navbat" element={<ProtectedRoute><Navbat /></ProtectedRoute>} />
      <Route path="/ai" element={<ProtectedRoute><AITahlil /></ProtectedRoute>} />
      <Route path="/hisobotlar" element={<ProtectedRoute><Hisobotlar /></ProtectedRoute>} />
      <Route path="/xabarnomalar" element={<ProtectedRoute><Xabarnomalar /></ProtectedRoute>} />
      <Route path="/sozlamalar" element={<ProtectedRoute><Sozlamalar /></ProtectedRoute>} />
      <Route path="/amallar-tarixi" element={<ProtectedRoute><AmallarTarixi /></ProtectedRoute>} />
      <Route path="/nazorat-paneli" element={<ProtectedRoute><NazoratPaneli /></ProtectedRoute>} />
      <Route path="/yakunlangan" element={<ProtectedRoute><YakunlanganIshlar /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
