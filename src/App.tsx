import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthGuard from "@/components/AuthGuard";
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
import PrivacyPage from "./pages/Privacy&Policy";
import TermsPage from "./pages/Terms&Service";
import ContactPage from "./pages/ContactUs";
import FAQsPage from "./pages/FAQs";
import AboutPage from "./pages/AboutUs";
import BlogPage from "./pages/OurBlogs";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./components/Appointment/MyAppointments";

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
        <AuthGuard>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/leadership" element={<FoundersPage />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/our-services" element={<OurServicesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route
              path="/verify-email-pending"
              element={<VerifyEmailPendingPage />}
            />

            {/* Static Pages */}
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            <Route path="/terms&service" element={<TermsPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/our-blog" element={<BlogPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredUserType="user">
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-appointment"
              element={
                <ProtectedRoute requiredUserType="user">
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-appointments"
              element={
                <ProtectedRoute requiredUserType="user">
                  <MyAppointments />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
