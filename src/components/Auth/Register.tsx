import { useState } from "react";
import { Eye, EyeOff, Upload, Camera } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { registerUser } from "@/redux/slice/authSlice";
import { ThreeDots } from "react-loader-spinner";
import { patientRegistrationSchema } from "@/validation/validate";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInsurance, setShowInsurance] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [activeSection, setActiveSection] = useState(1); // Track active section
  const [showHIPAA, setShowHIPAA] = useState(false);

  const formik = useFormik({
    initialValues: {
      // Section 1: Patient Information
      medicalRecordNo: "",
      photo: null,
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      email: "",
      altEmail: "",
      phone: "",
      altPhone: "",
      careProviderPhone: "",
      ssnLastFour: "",
      languagePreference: "",
      ethnicity: "",

      // Section 2: Emergency Contact & Insurance
      emergencyName: "",
      emergencyRelationship: "",
      emergencyPhone: "",
      primaryCarePhysician: "",
      insuranceProvider: "",
      insurancePolicyNo: "",
      insuranceGroupNo: "",
      insurancePhone: "",
      guarantor: "",
      registrationDate: new Date().toISOString().split("T")[0],
      firstVisitDate: "",
      referringSource: "",

      // Section 3: Consent & Legal
      consentTreatment: false,
      hipaa: false,
      releaseRecords: false,
      preferredCommunication: "",
      disabilityNeeds: "",
      interpreterRequired: false,
      advanceDirectives: false,

      // Authentication fields
      password: "",
      confirmPassword: "",
    },
    validationSchema: patientRegistrationSchema,
    onSubmit: async (data) => {
      // Check if Section 3 is completed
      if (
        !data.consentTreatment ||
        !data.hipaa ||
        !data.releaseRecords ||
        !data.preferredCommunication ||
        !data.disabilityNeeds
      ) {
        toast(
          "Please complete all mandatory fields in Section 3 (Consent & Legal) to finish registration.",
          { type: "error" }
        );
        setActiveSection(3); // Jump to incomplete section
        return;
      }

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

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("photo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatMedicalRecordNo = (value) => {
    // Only allow numbers and limit to 10 digits
    const numbers = value.replace(/\D/g, "");
    return numbers.slice(0, 10);
  };

  const formatDateOfBirth = (value) => {
    // Format as MM/DD/YYYY
    const numbers = value.replace(/\D/g, "");
    if (numbers.length >= 5) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(
        4,
        8
      )}`;
    } else if (numbers.length >= 3) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    }
    return numbers;
  };

  const isSection3Complete = () => {
    return (
      formik.values.consentTreatment &&
      formik.values.hipaa &&
      formik.values.releaseRecords &&
      formik.values.preferredCommunication &&
      formik.values.disabilityNeeds
    );
  };

  // Navigation functions
  const nextSection = () => {
    if (activeSection < 3) {
      setActiveSection(activeSection + 1);
    }
  };

  const prevSection = () => {
    if (activeSection > 1) {
      setActiveSection(activeSection - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row rounded-lg">
      {/* Left Side - Form */}
      <div className="flex-1 bg-[#0F0F0F] flex items-start justify-center p-6 sm:p-10">
        <div className="w-full max-w-4xl py-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-10">
            Patient Registration
          </h1>

          {/* Section Navigation Tabs */}
          <div className="flex mb-6 border-b border-gray-700">
            <button
              className={`px-6 py-3 font-medium text-lg ${
                activeSection === 1
                  ? "text-white border-b-2 border-[#ff4757]"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveSection(1)}
            >
              Patient Info
            </button>
            <button
              className={`px-6 py-3 font-medium text-lg ${
                activeSection === 2
                  ? "text-white border-b-2 border-[#ff4757]"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveSection(2)}
            >
              Emergency & Insurance
            </button>
            <button
              className={`px-6 py-3 font-medium text-lg ${
                activeSection === 3
                  ? "text-white border-b-2 border-[#ff4757]"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveSection(3)}
            >
              Consent & Legal
            </button>
          </div>
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* SECTION 1: PATIENT INFORMATION */}
            <div
              className={`bg-[#1A1A1A] p-6 rounded-lg ${
                activeSection !== 1 ? "hidden" : ""
              }`}
            >
              <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-600 pb-2">
                Section 1: Patient Information
              </h2>

              {/* Medical Record No */}
              <div className="mb-4">
                <label className="block text-base text-white mb-2">
                  Medical Record No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="medicalRecordNo"
                  value={formik.values.medicalRecordNo}
                  onChange={(e) => {
                    const formatted = formatMedicalRecordNo(e.target.value);
                    formik.setFieldValue("medicalRecordNo", formatted);
                  }}
                  onBlur={formik.handleBlur}
                  placeholder="10 digit record no"
                  className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                />
                {formik.touched.medicalRecordNo &&
                  formik.errors.medicalRecordNo && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.medicalRecordNo}
                    </p>
                  )}
              </div>

              {/* Photo Upload */}
              <div className="mb-4">
                <label className="block text-base text-white mb-2">
                  Photo Upload <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-[#1E1E1E] border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="photo"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo"
                      className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Title and Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-base text-white mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  >
                    <option value="">Select...</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                    <option value="Other">Other</option>
                  </select>
                  {formik.touched.title && formik.errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-base text-white mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-base text-white mb-2">
                    Middle Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={formik.values.middleName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.middleName && formik.errors.middleName && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.middleName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-base text-white mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Date of Birth and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-base text-white mb-2">
                    Date of Birth (MM/DD/YYYY){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="dateOfBirth"
                    value={formik.values.dateOfBirth}
                    onChange={(e) => {
                      const formatted = formatDateOfBirth(e.target.value);
                      formik.setFieldValue("dateOfBirth", formatted);
                    }}
                    onBlur={formik.handleBlur}
                    placeholder="MM/DD/YYYY"
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-base text-white mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {formik.touched.gender && formik.errors.gender && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.gender}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-base text-white mb-2">
                  Complete Address (House/Apt, Street){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                />
                {formik.touched.address && formik.errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.address}
                  </p>
                )}
              </div>

              {/* City, State, Zipcode */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-base text-white mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.city && formik.errors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-base text-white mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.state && formik.errors.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-base text-white mb-2">
                    Zipcode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zipcode"
                    value={formik.values.zipcode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.zipcode && formik.errors.zipcode && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.zipcode}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-base text-white mb-2">
                    Primary Email Address{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-base text-white mb-2">
                    Alternative Email Address{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="altEmail"
                    value={formik.values.altEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.altEmail && formik.errors.altEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.altEmail}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-base text-white mb-2">
                    Primary Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-base text-white mb-2">
                    Alternative Phone Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="altPhone"
                    value={formik.values.altPhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.altPhone && formik.errors.altPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.altPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Future Required Fields */}
              <div className="bg-[#2A2A2A] p-4 rounded border-l-4 border-yellow-500 mb-4">
                <h3 className="text-yellow-400 font-semibold mb-3">
                  Future Required Fields
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base text-gray-300 mb-2">
                      Care Provider Phone Number
                    </label>
                    <input
                      type="tel"
                      name="careProviderPhone"
                      value={formik.values.careProviderPhone}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-base text-gray-300 mb-2">
                      Last 4 Digits of SSN
                    </label>
                    <input
                      type="text"
                      name="ssnLastFour"
                      value={formik.values.ssnLastFour}
                      onChange={formik.handleChange}
                      maxLength={4}
                      className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-base text-gray-300 mb-2">
                      Language Preference
                    </label>
                    <input
                      type="text"
                      name="languagePreference"
                      value={formik.values.languagePreference}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-base text-gray-300 mb-2">
                      Ethnicity / Race
                    </label>
                    <input
                      type="text"
                      name="ethnicity"
                      value={formik.values.ethnicity}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={nextSection}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Next: Emergency & Insurance
                </button>
              </div>
            </div>

            {/* SECTION 2: EMERGENCY CONTACT & INSURANCE */}
            <div
              className={`bg-[#1A1A1A] p-6 rounded-lg ${
                activeSection !== 2 ? "hidden" : ""
              }`}
            >
              <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-600 pb-2">
                Section 2: Emergency Contact & Insurance
              </h2>

              {/* Emergency Contact */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-base text-white mb-2">
                    Emergency Contact Name{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="emergencyName"
                    value={formik.values.emergencyName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.emergencyName &&
                    formik.errors.emergencyName && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.emergencyName}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-base text-white mb-2">
                    Emergency Contact Relationship{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="emergencyRelationship"
                    value={formik.values.emergencyRelationship}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.emergencyRelationship &&
                    formik.errors.emergencyRelationship && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.emergencyRelationship}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-base text-white mb-2">
                    Emergency Contact Phone Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formik.values.emergencyPhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.emergencyPhone &&
                    formik.errors.emergencyPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.emergencyPhone}
                      </p>
                    )}
                </div>
              </div>

              {/* Insurance Details Button */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setShowInsurance(!showInsurance)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  {showInsurance
                    ? "Hide Insurance Details"
                    : "Insurance Details"}
                </button>

                {showInsurance && (
                  <div className="mt-4 bg-[#2A2A2A] p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base text-gray-300 mb-2">
                          Insurance Provider Name
                        </label>
                        <input
                          type="text"
                          name="insuranceProvider"
                          value={formik.values.insuranceProvider}
                          onChange={formik.handleChange}
                          className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-base text-gray-300 mb-2">
                          Insurance Policy Number
                        </label>
                        <input
                          type="text"
                          name="insurancePolicyNo"
                          value={formik.values.insurancePolicyNo}
                          onChange={formik.handleChange}
                          className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-base text-gray-300 mb-2">
                          Insurance Group Number
                        </label>
                        <input
                          type="text"
                          name="insuranceGroupNo"
                          value={formik.values.insuranceGroupNo}
                          onChange={formik.handleChange}
                          className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-base text-gray-300 mb-2">
                          Insurance Phone Number
                        </label>
                        <input
                          type="tel"
                          name="insurancePhone"
                          value={formik.values.insurancePhone}
                          onChange={formik.handleChange}
                          className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-base text-gray-300 mb-2">
                          Guarantor / Responsible Party
                        </label>
                        <input
                          type="text"
                          name="guarantor"
                          value={formik.values.guarantor}
                          onChange={formik.handleChange}
                          className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Registration and Visit Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-base text-white mb-2">
                    Date of Registration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="registrationDate"
                    value={formik.values.registrationDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.registrationDate &&
                    formik.errors.registrationDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.registrationDate}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-base text-white mb-2">
                    Referring Source <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="referringSource"
                    value={formik.values.referringSource}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  >
                    <option value="">Select...</option>
                    <option value="Self">Self</option>
                    <option value="Physician">Physician</option>
                    <option value="Other">Other</option>
                  </select>
                  {formik.touched.referringSource &&
                    formik.errors.referringSource && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.referringSource}
                      </p>
                    )}
                </div>
              </div>

              {/* Future Required Fields for Section 2 */}
              <div className="bg-[#2A2A2A] p-4 rounded border-l-4 border-yellow-500">
                <h3 className="text-yellow-400 font-semibold mb-3">
                  Future Required Fields
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base text-gray-300 mb-2">
                      Primary Care Physician
                    </label>
                    <input
                      type="text"
                      name="primaryCarePhysician"
                      value={formik.values.primaryCarePhysician}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-base text-gray-300 mb-2">
                      Date of First Visit Planned
                    </label>
                    <input
                      type="date"
                      name="firstVisitDate"
                      value={formik.values.firstVisitDate}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={prevSection}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Back: Patient Info
                </button>
                <button
                  type="button"
                  onClick={nextSection}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Next: Consent & Legal
                </button>
              </div>
            </div>

            {/* SECTION 3: CONSENT & LEGAL (MANDATORY FOR COMPLETION) */}
            <div
              className={`bg-[#1A1A1A] p-6 rounded-lg border-2 border-red-500 ${
                activeSection !== 3 ? "hidden" : ""
              }`}
            >
              <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-600 pb-2">
                Section 3: Consent & Legal
                <span className="text-red-500 text-sm block mt-1">
                  * Registration cannot be completed unless this section is
                  finished
                </span>
              </h2>

              {!isSection3Complete() && (
                <div className="bg-red-900/20 border border-red-500 text-red-200 p-3 rounded mb-4">
                  Please complete all fields in this section to finish
                  registration.
                </div>
              )}

              {/* Consent Checkboxes */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="consentTreatment"
                    name="consentTreatment"
                    checked={formik.values.consentTreatment}
                    onChange={formik.handleChange}
                    className="mt-1 w-4 h-4"
                  />
                  <label htmlFor="consentTreatment" className="text-white">
                    <span className="text-red-500">*</span> Consent for
                    Treatment
                    <p className="text-gray-400 text-sm mt-1">
                      I consent to medical treatment and procedures as deemed
                      necessary by my healthcare provider.
                    </p>
                  </label>
                </div>
                {formik.touched.consentTreatment &&
                  formik.errors.consentTreatment && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.consentTreatment}
                    </p>
                  )}

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="hipaa"
                    name="hipaa"
                    checked={formik.values.hipaa}
                    onChange={formik.handleChange}
                    className="mt-1 w-4 h-4"
                  />
                  <label htmlFor="hipaa" className="text-white">
                    <span className="text-red-500">*</span> HIPAA Privacy Notice
                    Acknowledgment
                    <p className="text-gray-400 text-sm mt-1">
                      I acknowledge that I have received and understand the
                      HIPAA Privacy Notice.
                    </p>
                  </label>
                </div>
                {formik.touched.hipaa && formik.errors.hipaa && (
                  <p className="text-red-500 text-sm">{formik.errors.hipaa}</p>
                )}

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="releaseRecords"
                    name="releaseRecords"
                    checked={formik.values.releaseRecords}
                    onChange={formik.handleChange}
                    className="mt-1 w-4 h-4"
                  />
                  <label htmlFor="releaseRecords" className="text-white">
                    <span className="text-red-500">*</span> Release of Medical
                    Records Consent
                    <p className="text-gray-400 text-sm mt-1">
                      I consent to the release of my medical records as
                      necessary for treatment, payment, and healthcare
                      operations.
                    </p>
                  </label>
                </div>
                {formik.touched.releaseRecords &&
                  formik.errors.releaseRecords && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.releaseRecords}
                    </p>
                  )}
              </div>

              {/* Preferred Communication Method */}
              <div className="mb-4">
                <label className="block text-base text-white mb-2">
                  Preferred Method of Communication{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="preferredCommunication"
                  value={formik.values.preferredCommunication}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                >
                  <option value="">Select...</option>
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                  <option value="Mail">Mail</option>
                </select>
                {formik.touched.preferredCommunication &&
                  formik.errors.preferredCommunication && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.preferredCommunication}
                    </p>
                  )}
              </div>

              {/* Disability / Accessibility Needs */}
              <div className="mb-6">
                <label className="block text-base text-white mb-2">
                  Disability / Accessibility Needs{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="disabilityNeeds"
                  value={formik.values.disabilityNeeds}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Please describe any disability or accessibility needs, or write 'None' if not applicable"
                  rows={3}
                  className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                />
                {formik.touched.disabilityNeeds &&
                  formik.errors.disabilityNeeds && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.disabilityNeeds}
                    </p>
                  )}
              </div>

              {/* Future Required Fields for Section 3 */}
              <div className="bg-[#2A2A2A] p-4 rounded border-l-4 border-yellow-500">
                <h3 className="text-yellow-400 font-semibold mb-3">
                  Future Required Fields
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="interpreterRequired"
                      name="interpreterRequired"
                      checked={formik.values.interpreterRequired}
                      onChange={formik.handleChange}
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor="interpreterRequired"
                      className="text-gray-300"
                    >
                      Interpreter Required
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="advanceDirectives"
                      name="advanceDirectives"
                      checked={formik.values.advanceDirectives}
                      onChange={formik.handleChange}
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor="advanceDirectives"
                      className="text-gray-300"
                    >
                      Advance Directives
                    </label>
                  </div>
                </div>
              </div>

              {/* Password Fields (for account creation) */}
              <div className="bg-[#1A1A1A] p-6 rounded-lg mt-6">
                <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-600 pb-2">
                  Account Security
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base text-white mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-4 py-3 pr-12 rounded bg-[#1E1E1E] text-white border border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-base text-white mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-4 py-3 pr-12 rounded bg-[#1E1E1E] text-white border border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.confirmPassword}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={prevSection}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Back: Emergency & Insurance
                </button>
                <button
                  type="submit"
                  disabled={loading || !isSection3Complete()}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    loading || !isSection3Complete()
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-[#ff4757] hover:bg-[#e63b4d] text-white"
                  }`}
                >
                  {loading ? (
                    <ThreeDots height="24" width="40" color="#fff" visible />
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-[#1A1A1A] p-4 rounded-lg mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">
                  Registration Progress
                </span>
                <span className="text-white text-sm">
                  {isSection3Complete() ? "100%" : "Incomplete"}
                </span>
              </div>
              <div className="w-full bg-[#2A2A2A] rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isSection3Complete()
                      ? "bg-green-500 w-full"
                      : "bg-red-500 w-3/4"
                  }`}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Section 1: Patient Info</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">
                    Section 2: Emergency & Insurance
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isSection3Complete() ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-gray-300">
                    Section 3: Consent & Legal
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 bg-[#ff4757] text-white flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="max-w-md text-center">
          <img
            src="/Illustration.svg"
            alt="Medical illustration"
            className="mx-auto w-40 sm:w-64 h-auto mb-6"
          />
          <h2 className="text-2xl sm:text-4xl font-bold mb-3">
            Patient Portal
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-6">
            Welcome to the OptimaleMD Patient Portal — your secure, personalized
            space to manage your care. Fill out the registration form to get
            started with scheduling appointments, messaging your care team, and
            more.
          </p>
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold underline hover:no-underline"
            >
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
