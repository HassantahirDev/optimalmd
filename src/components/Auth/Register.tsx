import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { registerUser } from "@/redux/slice/authSlice";
import { ThreeDots } from "react-loader-spinner";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      city: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
      dateOfBirth: Yup.date().required("Date of Birth is required"),
      city: Yup.string().required("City is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 chars")
        .required("Password is required"),
      // confirmPassword: Yup.string()
      //   .oneOf([Yup.ref("password")], "Passwords must match")
      //   .required("Confirm password is required"),
    }),
    onSubmit: async (data) => {
      setLoading(true);
      dispatch(registerUser(data))
        .unwrap()
        .then(() => {
          setLoading(false);
          toast("Registered successfully!", { type: "success" });
          navigate("/login"); 
        })
        .catch((error) => {
          setLoading(false);
          toast(error?.message || "Failed to register", { type: "error" });
        });
    },
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row rounded-lg overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 bg-[#0F0F0F] flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-10">
            Create an Account
          </h1>

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* First Name */}
            <div>
              <label className="block text-base font-medium text-white mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your first name"
                className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white"
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="text-red-500 text-sm">
                  {formik.errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-base font-medium text-white mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your last name"
                className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white"
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="text-red-500 text-sm">{formik.errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-base font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-base font-medium text-white mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white"
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-sm">{formik.errors.phone}</p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label className="block text-base font-medium text-white mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white"
              />
              {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                <p className="text-red-500 text-sm">
                  {formik.errors.dateOfBirth}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-base font-medium text-white mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your city"
                className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white"
              />
              {formik.touched.city && formik.errors.city && (
                <p className="text-red-500 text-sm">{formik.errors.city}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-base font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            {/* <div>
              <label className="block text-base font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 rounded-full bg-[#1E1E1E] text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div> */}

            {/* Checkbox */}
            <div className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span>I agree to the Terms & Privacy Policy</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 rounded-full bg-[#ff4757] hover:bg-[#e63b4d] text-white font-medium text-base sm:text-lg flex justify-center items-center"
            >
              {loading ? (
                <ThreeDots height="24" width="40" color="#fff" visible />
              ) : (
                "Register Account"
              )}
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
            space to manage your care. Create an account to schedule
            appointments, message your care team, view lab results, and access
            treatment plans — all in one place.
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
