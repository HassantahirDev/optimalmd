import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row rounded-lg overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 bg-[#0F0F0F] flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-10">
            Create an Account
          </h1>

          <form className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-base sm:text-lg font-medium text-white mb-2">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter your first name"
                className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white placeholder-gray-400 border border-transparent focus:border-[#ff4757] focus:ring-0 outline-none"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-base sm:text-lg font-medium text-white mb-2">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter your last name"
                className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white placeholder-gray-400 border border-transparent focus:border-[#ff4757] focus:ring-0 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-base sm:text-lg font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white placeholder-gray-400 border border-transparent focus:border-[#ff4757] focus:ring-0 outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-base sm:text-lg font-medium text-white mb-2">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white placeholder-gray-400 border border-transparent focus:border-[#ff4757] focus:ring-0 outline-none"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-base sm:text-lg font-medium text-white mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white placeholder-gray-400 border border-transparent focus:border-[#ff4757] focus:ring-0 outline-none"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-base sm:text-lg font-medium text-white mb-2">
                City
              </label>
              <input
                type="text"
                placeholder="Enter your city"
                className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white placeholder-gray-400 border border-transparent focus:border-[#ff4757] focus:ring-0 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-base sm:text-lg font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-base sm:text-lg font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white placeholder-gray-400 border border-transparent focus:border-[#ff4757] focus:ring-0 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-500 bg-transparent"
              />
              <span>I agree to the Terms & Privacy Policy</span>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 sm:py-4 rounded-full bg-[#ff4757] hover:bg-[#e63b4d] text-white font-medium text-base sm:text-lg"
            >
              Register Account
            </button>
          </form>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 bg-[#ff4757] text-white flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="max-w-md text-center">
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
            space to manage your care. Create an account to schedule appointments, message your care team, view lab results, and access treatment plans — all in one place.
          </p>
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold underline hover:no-underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
