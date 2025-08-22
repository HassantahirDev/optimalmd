import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { resendVerification } from "@/redux/slice/authSlice";
import api from "@/service/api";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showResendForm, setShowResendForm] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token");
        
        if (!token) {
          setError("No verification token found in the URL");
          setLoading(false);
          return;
        }

        // Call the verify email API
        const response = await api.get(`/api/auth/verify-email?token=${token}`);
        
        if (response.data.success) {
          setSuccess(true);
          // Show success message and redirect to login after 3 seconds
          setTimeout(() => {
            toast.success("Email verified successfully! Please login.");
            navigate("/login");
          }, 3000);
        }
      } catch (err: any) {
        console.error("Email verification error:", err);
        setError(err.response?.data?.message || "Failed to verify email. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setResending(true);
    try {
      await dispatch(resendVerification(resendEmail)).unwrap();
      toast.success("Verification email sent successfully! Please check your inbox.");
      setShowResendForm(false);
      setResendEmail("");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <ThreeDots color="#ff4757" height={60} width={60} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Verifying Your Email...
          </h2>
          <p className="text-gray-400">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Email Verified Successfully!
          </h2>
          <p className="text-gray-300 text-lg mb-6">
            Your email has been verified. You will be redirected to the login page shortly.
          </p>
          <div className="flex justify-center mb-6">
            <ThreeDots color="#ff4757" height={30} width={30} />
          </div>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#ff4757] hover:bg-[#ff3742] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
      <div className="text-center max-w-md mx-auto px-6">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">
          Verification Failed
        </h2>
        <p className="text-gray-300 text-lg mb-6">
          {error}
        </p>
        
        {/* Resend Verification Form */}
        {!showResendForm ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowResendForm(true)}
              className="w-full bg-[#ff4757] hover:bg-[#ff3742] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Resend Verification Email
            </button>
            <button
              onClick={() => navigate("/verify-email-pending")}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Check Verification Status
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Registering Again
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleResendVerification} className="space-y-4">
            <div className="text-left">
              <label className="block text-white text-sm font-medium mb-2">
                Enter your email address
              </label>
              <input
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-lg bg-[#1E1E1E] text-white border border-gray-600 focus:border-[#ff4757] focus:ring-0 outline-none"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={resending}
                className="flex-1 bg-[#ff4757] hover:bg-[#ff3742] disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {resending ? (
                  <>
                    <ThreeDots color="white" height={20} width={20} />
                    <span className="ml-2">Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Verification
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResendForm(false);
                  setResendEmail("");
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
