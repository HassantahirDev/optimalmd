import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { loginUser } from "@/redux/slice/authSlice";
import { toast } from "react-toastify";

export default function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState<'user'>('user');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const dispatch = useAppDispatch();
  const { loading, error, user, token } = useAppSelector((state) => state.auth);

  // Check for URL parameters and show appropriate messages
  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true") {
      toast.success("Email verified successfully! Please login.");
    }
  }, [searchParams]);

  // Redirect to dashboard if user is already logged in or after successful login
  useEffect(() => {
    if (user && token) {
      // Check if this is a fresh login (token was just set)
      const wasJustLoggedIn = localStorage.getItem("authToken") === token;
      if (wasJustLoggedIn) {
        toast.success("Login successful! Redirecting to dashboard...");
      }
      // Redirect to patient dashboard
      navigate("/dashboard");
    }
  }, [user, token, navigate]);

  // Show error toast when login fails
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ userType, email, password }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row rounded-lg overflow-hidden">
      {/* Left Side */}
      <div className="flex-1 bg-[#0F0F0F] flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-10">
            Patient Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-base sm:text-lg font-medium text-white mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white placeholder-gray-400 border border-transparent focus:border-[#ff4757] focus:ring-0 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-base sm:text-lg font-medium text-white mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white placeholder-gray-400 border border-transparent focus:border-[#ff4757] focus:ring-0 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-300">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-500 bg-transparent"
                />
                Remember me
              </label>
              <div className="flex flex-col gap-1 text-center sm:text-right">
                <a href="#" className="hover:underline">
                  Forget Password
                </a>
                <Link
                  to="/verify-email-pending"
                  className="hover:underline text-[#ff4757]"
                >
                  Need Email Verification?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 rounded-full bg-[#ff4757] hover:bg-[#e63b4d] disabled:bg-gray-600 text-white font-medium text-base sm:text-lg transition-colors"
            >
              {loading ? "Logging in..." : "Secure Login"}
            </button>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 bg-[#ff4757] text-white flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="max-w-md text-center">
          {/* Illustration */}
          <div className="mb-6 sm:mb-8">
            <img
              src="/Illustration.svg"
              alt="Medical illustration"
              className="mx-auto w-40 sm:w-64 h-auto"
            />
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">
            Patient Portal
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-6">
            Welcome to the OptimaleMD Patient Portal — your secure, personalized space to manage your care. Log in to schedule appointments, message your care team, view lab results, and access your treatment plans — all in one place.
          </p>

          {/* Register */}
          <p className="text-lg font-medium">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="inline-block bg-white text-[#ff4757] font-bold text-lg px-6 py-3 rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
