import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempted with:", { email, password, rememberMe });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row rounded-lg overflow-hidden">
      {/* Left Side */}
      <div className="flex-1 bg-[#0F0F0F] flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-10">
            Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-base sm:text-lg font-medium text-white mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter Your Email"
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
              <a href="#" className="hover:underline text-center sm:text-right">
                Forget Password
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 sm:py-4 rounded-full bg-[#ff4757] hover:bg-[#e63b4d] text-white font-medium text-base sm:text-lg"
            >
              Login
            </button>
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
            Welcome to the OptimaleMD Patient Portal — your secure, personalized
            space to manage your care. Log in to schedule appointments, message
            your care team, view lab results, and access your treatment plans —
            all in one place.
          </p>

          {/* Register */}
          <p>
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold underline hover:no-underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
