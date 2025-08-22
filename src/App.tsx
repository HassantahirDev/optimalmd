import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FoundersPage from "./pages/Leadership";
import HowItWorks from "./pages/HowItWorks";
import OurServicesPage from "./pages/OurServices";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import VerifyEmailPage from "./pages/VerifyEmail";
import VerifyEmailPendingPage from "./pages/VerifyEmailPending";
import PatientDashboard from "./pages/Dashboard/Patient";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/leadership" element={<FoundersPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/our-services" element={<OurServicesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-email-pending" element={<VerifyEmailPendingPage />} />
          <Route path="/dashboard" element={<PatientDashboard />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
