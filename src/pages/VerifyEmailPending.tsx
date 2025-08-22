import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { resendVerification } from "@/redux/slice/authSlice";

export default function VerifyEmailPending() {
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setResending(true);
    try {
      await dispatch(resendVerification(email)).unwrap();
      toast.success("Verification email resent! Please check your inbox.");
      setShowEmailForm(false);
      setEmail("");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
      <div className="max-w-md mx-auto text-center px-6">
        {/* Email Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#ff4757] rounded-full flex items-center justify-center">
            <Mail className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Success Message */}
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
          <h1 className="text-2xl font-bold text-white">
            Registration Successful!
          </h1>
        </div>

        {/* Instructions */}
        <p className="text-gray-300 text-lg mb-6">
          We've sent a verification email to your inbox. Please check your email and click the verification link to activate your account.
        </p>

        {/* Email Check Instructions */}
        <div className="bg-[#1A1A1A] p-4 rounded-lg mb-6 text-left">
          <h3 className="text-white font-semibold mb-2">What to do next:</h3>
          <ol className="text-gray-300 text-sm space-y-2">
            <li>1. Check your email inbox (and spam folder)</li>
            <li>2. Click the "Verify Email" button in the email</li>
            <li>3. You'll be redirected back to login</li>
            <li>4. Sign in with your credentials</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!showEmailForm ? (
            <button
              onClick={() => setShowEmailForm(true)}
              className="w-full bg-[#ff4757] hover:bg-[#ff3742] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Resend Verification Email
            </button>
          ) : (
            <form onSubmit={handleResendVerification} className="space-y-3">
              <div className="text-left">
                <label className="block text-white text-sm font-medium mb-2">
                  Enter your email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-[#1E1E1E] text-white border border-gray-600 focus:border-[#ff4757] focus:ring-0 outline-none"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={resending}
                  className="flex-1 bg-[#ff4757] hover:bg-[#ff3742] disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {resending ? "Sending..." : "Send Verification"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailForm(false);
                    setEmail("");
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Login
          </button>
        </div>

        {/* Back to Registration */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/register")}
            className="text-gray-400 hover:text-white transition-colors flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Registration
          </button>
        </div>

        {/* Help Text */}
        <p className="text-gray-500 text-sm mt-8">
          Didn't receive the email? Check your spam folder or contact support if the issue persists.
        </p>
      </div>
    </div>
  );
}
