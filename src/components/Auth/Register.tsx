import { useState } from "react";
import { Eye, EyeOff, Upload, Camera } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { registerUser } from "@/redux/slice/authSlice";
import { ThreeDots } from "react-loader-spinner";
import { patientRegistrationSchema } from "@/validation/validate";
import { HipaaModal } from "@/components/Modals/HipaaModal";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInsurance, setShowInsurance] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [activeSection, setActiveSection] = useState(1); // Track active section
  const [showHipaaModal, setShowHipaaModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      // Mandatory Fields (Green in image)
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      completeAddress: "",
      city: "",
      state: "",
      zipcode: "",
      primaryEmail: "",
      alternativeEmail: "",
      primaryPhone: "",
      alternativePhone: "",
      emergencyContactName: "",
      emergencyContactRelationship: "",
      emergencyContactPhone: "",
      referringSource: "",
      consentForTreatment: "",
      hipaaPrivacyNoticeAcknowledgment: "",
      releaseOfMedicalRecordsConsent: "",
      preferredMethodOfCommunication: "",
      disabilityAccessibilityNeeds: "",

      // Optional Fields (Yellow in image)
      careProviderPhone: "",
      lastFourDigitsSSN: "",
      languagePreference: "",
      ethnicityRace: "",
      primaryCarePhysician: "",
      insuranceProviderName: "",
      insurancePolicyNumber: "",
      insuranceGroupNumber: "",
      insurancePhoneNumber: "",
      guarantorResponsibleParty: "",
      dateOfFirstVisitPlanned: "",
      interpreterRequired: "",
      advanceDirectives: "",

      // Authentication fields
      password: "",
      confirmPassword: "",
    },
    validationSchema: patientRegistrationSchema,
    onSubmit: async (data) => {
      // Check if all mandatory fields are completed
      const mandatoryFields = [
        "firstName",
        "lastName",
        "dateOfBirth",
        "gender",
        "completeAddress",
        "city",
        "state",
        "zipcode",
        "primaryEmail",
        "primaryPhone",
        "emergencyContactName",
        "emergencyContactPhone",
        "referringSource",
        "consentForTreatment",
        "hipaaPrivacyNoticeAcknowledgment",
        "releaseOfMedicalRecordsConsent",
        "preferredMethodOfCommunication",
      ];

      const missingFields = mandatoryFields.filter((field) => !data[field]);

      if (missingFields.length > 0) {
        toast(
          `Please complete all mandatory fields: ${missingFields.join(", ")}`,
          { type: "error" }
        );
        return;
      }

      setLoading(true);

      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = data;

      // Clean up optional fields - remove empty strings for optional fields
      const cleanedData = {
        ...registrationData,
        careProviderPhone: registrationData.careProviderPhone || undefined,
        lastFourDigitsSSN: registrationData.lastFourDigitsSSN || undefined,
        languagePreference: registrationData.languagePreference || undefined,
        ethnicityRace: registrationData.ethnicityRace || undefined,
        primaryCarePhysician:
          registrationData.primaryCarePhysician || undefined,
        insuranceProviderName:
          registrationData.insuranceProviderName || undefined,
        insurancePolicyNumber:
          registrationData.insurancePolicyNumber || undefined,
        insuranceGroupNumber:
          registrationData.insuranceGroupNumber || undefined,
        insurancePhoneNumber:
          registrationData.insurancePhoneNumber || undefined,
        guarantorResponsibleParty:
          registrationData.guarantorResponsibleParty || undefined,
        dateOfFirstVisitPlanned:
          registrationData.dateOfFirstVisitPlanned || undefined,
        interpreterRequired: registrationData.interpreterRequired || undefined,
        advanceDirectives: registrationData.advanceDirectives || undefined,
      };

      dispatch(registerUser(cleanedData))
        .unwrap()
        .then(() => {
          setLoading(false);
          toast(
            "Registration successful! Please check your email to verify your account.",
            { type: "success" }
          );
          // Redirect to verification pending page instead of login
          navigate("/verify-email-pending");
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



  const formatSSN = (value) => {
    // Only allow numbers and limit to 4 digits
    const numbers = value.replace(/\D/g, "");
    return numbers.slice(0, 4);
  };

  const formatDateForBackend = (dateString) => {
    // Convert date to YYYY-MM-DD format for backend
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  // Navigation functions with validation
  const nextSection = () => {
    if (activeSection < 3) {
      // Validate current section before allowing to proceed
      if (validateCurrentSection()) {
        setActiveSection(activeSection + 1);
      }
    }
  };

  const prevSection = () => {
    if (activeSection > 1) {
      setActiveSection(activeSection - 1);
    }
  };

  // Validate current section before allowing navigation
  const validateCurrentSection = () => {
    const currentErrors: Record<string, string> = {};
    
    if (activeSection === 1) {
      // Validate Patient Information section
      const requiredFields = [
        'firstName', 'lastName', 'dateOfBirth', 'gender', 'completeAddress', 'city', 'state', 'zipcode',
        'primaryEmail', 'primaryPhone'
      ];
      
      requiredFields.forEach(field => {
        if (!formik.values[field] || formik.values[field].trim() === '') {
          currentErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
        }
      });
      
      // Validate email format
      if (formik.values.primaryEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formik.values.primaryEmail)) {
        currentErrors.primaryEmail = 'Please enter a valid email address';
      }
      
      if (formik.values.alternativeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formik.values.alternativeEmail)) {
        currentErrors.alternativeEmail = 'Please enter a valid email address';
      }
      
    } else if (activeSection === 2) {
      // Validate Emergency Contact section
      const requiredFields = [
        'emergencyContactName', 'emergencyContactPhone'
      ];
      
      requiredFields.forEach(field => {
        if (!formik.values[field] || formik.values[field].trim() === '') {
          currentErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
        }
      });
    } else if (activeSection === 3) {
      // Validate Consent & Legal section
      const requiredFields = [
        'referringSource', 'consentForTreatment', 'hipaaPrivacyNoticeAcknowledgment',
        'releaseOfMedicalRecordsConsent', 'preferredMethodOfCommunication'
      ];
      
      requiredFields.forEach(field => {
        if (!formik.values[field] || formik.values[field].trim() === '') {
          currentErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
        }
      });
    }
    
    // If there are errors, show them and prevent navigation
    if (Object.keys(currentErrors).length > 0) {
      // Set errors in formik
      Object.keys(currentErrors).forEach(field => {
        formik.setFieldError(field, currentErrors[field]);
        formik.setFieldTouched(field, true);
      });
      
      // Show error message
      toast.error('Please fill in all required fields before proceeding');
      return false;
    }
    
    return true;
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
              Emergency Contact
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

              {/* Title and Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                    Middle Name
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
                    type="date"
                    name="dateOfBirth"
                    value={formik.values.dateOfBirth}
                    onChange={(e) => {
                      const formattedDate = formatDateForBackend(
                        e.target.value
                      );
                      formik.setFieldValue("dateOfBirth", formattedDate);
                    }}
                    onBlur={formik.handleBlur}
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

              {/* Complete Address */}
              <div className="mb-4">
                <label className="block text-base text-white mb-2">
                  Complete Address (House/Apt, Street){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="completeAddress"
                  value={formik.values.completeAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                />
                {formik.touched.completeAddress &&
                  formik.errors.completeAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.completeAddress}
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
                    name="primaryEmail"
                    value={formik.values.primaryEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.primaryEmail &&
                    formik.errors.primaryEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.primaryEmail}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-base text-white mb-2">
                    Alternative Email Address
                  </label>
                  <input
                    type="email"
                    name="alternativeEmail"
                    value={formik.values.alternativeEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.alternativeEmail &&
                    formik.errors.alternativeEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.alternativeEmail}
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
                    name="primaryPhone"
                    value={formik.values.primaryPhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.primaryPhone &&
                    formik.errors.primaryPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.primaryPhone}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-base text-white mb-2">
                    Alternative Phone Number
                  </label>
                  <input
                    type="tel"
                    name="alternativePhone"
                    value={formik.values.alternativePhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  />
                  {formik.touched.alternativePhone &&
                    formik.errors.alternativePhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.alternativePhone}
                      </p>
                    )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={nextSection}
                  className="bg-[#ff4757] hover:bg-[#ff3742] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Next Section
                </button>
              </div>
            </div>

            {/* SECTION 2: EMERGENCY CONTACT */}
            <div
              className={`bg-[#1A1A1A] p-6 rounded-lg ${
                activeSection !== 2 ? "hidden" : ""
              }`}
            >
              <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-600 pb-2">
                Section 2: Emergency Contact
              </h2>

              {/* Emergency Contact Name */}
              <div className="mb-4">
                <label className="block text-base text-white mb-2">
                  Emergency Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formik.values.emergencyContactName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                />
                {formik.touched.emergencyContactName &&
                  formik.errors.emergencyContactName && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.emergencyContactName}
                    </p>
                  )}
              </div>

              {/* Emergency Contact Relationship */}
              <div className="mb-4">
                <label className="block text-base text-white mb-2">
                  Emergency Contact Relationship
                </label>
                <input
                  type="text"
                  name="emergencyContactRelationship"
                  value={formik.values.emergencyContactRelationship}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g., Spouse, Parent, Friend, etc."
                  className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                />
                {formik.touched.emergencyContactRelationship &&
                  formik.errors.emergencyContactRelationship && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.emergencyContactRelationship}
                    </p>
                  )}
              </div>

              {/* Emergency Contact Phone Number */}
              <div className="mb-4">
                <label className="block text-base text-white mb-2">
                  Emergency Contact Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formik.values.emergencyContactPhone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                />
                {formik.touched.emergencyContactPhone &&
                  formik.errors.emergencyContactPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.emergencyContactPhone}
                    </p>
                  )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between space-x-4 mt-6">
                <button
                  type="button"
                  onClick={prevSection}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Previous Section
                </button>
                <button
                  type="button"
                  onClick={nextSection}
                  className="bg-[#ff4757] hover:bg-[#ff3742] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Next Section
                </button>
              </div>
            </div>

            {/* SECTION 3: CONSENT & LEGAL */}
            <div
              className={`bg-[#1A1A1A] p-6 rounded-lg ${
                activeSection !== 3 ? "hidden" : ""
              }`}
            >
              <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-600 pb-2">
                Section 3: Consent & Legal
              </h2>

              {/* Referring Source */}
              <div className="mb-4">
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
                  <option value="Online">Online</option>
                  <option value="Friend">Friend</option>
                  <option value="Employee">Employee</option>
                </select>
                {formik.touched.referringSource &&
                  formik.errors.referringSource && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.referringSource}
                    </p>
                  )}
              </div>

              {/* Consent Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-base text-white mb-2">
                    Consent for Treatment{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="consentForTreatment"
                    value={formik.values.consentForTreatment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  >
                    <option value="">Select...</option>
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </select>
                  {formik.touched.consentForTreatment &&
                    formik.errors.consentForTreatment && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.consentForTreatment}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-base text-white mb-2">
                    <button
                      type="button"
                      onClick={() => setShowHipaaModal(true)}
                      className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                    >
                      HIPAA Privacy Notice Acknowledgment
                    </button>{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="hipaaPrivacyNoticeAcknowledgment"
                    value={formik.values.hipaaPrivacyNoticeAcknowledgment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  >
                    <option value="">Select...</option>
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </select>
                  {formik.touched.hipaaPrivacyNoticeAcknowledgment &&
                    formik.errors.hipaaPrivacyNoticeAcknowledgment && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.hipaaPrivacyNoticeAcknowledgment}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-base text-white mb-2">
                    Release of Medical Records Consent{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="releaseOfMedicalRecordsConsent"
                    value={formik.values.releaseOfMedicalRecordsConsent}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  >
                    <option value="">Select...</option>
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </select>
                  {formik.touched.releaseOfMedicalRecordsConsent &&
                    formik.errors.releaseOfMedicalRecordsConsent && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.releaseOfMedicalRecordsConsent}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-base text-white mb-2">
                    Preferred Method of Communication{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="preferredMethodOfCommunication"
                    value={formik.values.preferredMethodOfCommunication}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  >
                    <option value="">Select...</option>
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                    <option value="Mail">Mail</option>
                  </select>
                  {formik.touched.preferredMethodOfCommunication &&
                    formik.errors.preferredMethodOfCommunication && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.preferredMethodOfCommunication}
                      </p>
                    )}
                </div>
              </div>

              {/* Disability Needs */}
              <div className="mb-4">
                <label className="block text-base text-white mb-2">
                  Disability/Accessibility Needs
                </label>
                <input
                  type="text"
                  name="disabilityAccessibilityNeeds"
                  value={formik.values.disabilityAccessibilityNeeds}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g., None, Wheelchair access, etc."
                  className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                />
                {formik.touched.disabilityAccessibilityNeeds &&
                  formik.errors.disabilityAccessibilityNeeds && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.disabilityAccessibilityNeeds}
                    </p>
                  )}
              </div>

              {/* Additional Optional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-base text-gray-300 mb-2">
                    Interpreter Required
                  </label>
                  <select
                    name="interpreterRequired"
                    value={formik.values.interpreterRequired}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  >
                    <option value="">Select...</option>
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </select>
                  {formik.touched.interpreterRequired &&
                    formik.errors.interpreterRequired && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.interpreterRequired}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-base text-gray-300 mb-2">
                    Advance Directives
                  </label>
                  <select
                    name="advanceDirectives"
                    value={formik.values.advanceDirectives}
                    onChange={formik.handleChange}
                    className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600"
                  >
                    <option value="">Select...</option>
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </select>
                  {formik.touched.advanceDirectives &&
                    formik.errors.advanceDirectives && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.advanceDirectives}
                      </p>
                    )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between space-x-4 mt-6">
                <button
                  type="button"
                  onClick={prevSection}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Previous Section
                </button>
              </div>
            </div>

            {/* SECTION 4: AUTHENTICATION */}
            <div className="bg-[#1A1A1A] p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-600 pb-2">
                Section 4: Authentication
              </h2>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                      className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                      className="w-full px-4 py-3 rounded bg-[#1E1E1E] text-white border border-gray-600 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
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

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  onClick={() => {
                    // Validate all sections before submission
                    if (!validateCurrentSection()) {
                      return;
                    }
                  }}
                  className="bg-[#ff4757] hover:bg-[#ff3742] disabled:bg-gray-600 text-white px-12 py-4 rounded-lg font-medium text-lg transition-colors flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <ThreeDots color="white" height={20} width={20} />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <span>Complete Registration</span>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#ff4757] hover:text-[#ff3742] font-medium"
              >
                Sign In
              </Link>
            </p>
            <p className="text-gray-400 mt-2">
              Waiting for verification?{" "}
              <Link
                to="/verify-email-pending"
                className="text-[#ff4757] hover:text-[#ff3742] font-medium"
              >
                Check Verification Status
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#ff4757] to-[#ff3742] items-center justify-center p-8">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Welcome to OptimalMD</h2>
          <p className="text-lg opacity-90">
            Complete your patient registration to access our comprehensive
            healthcare services.
          </p>
        </div>
      </div>

      {/* HIPAA Modal */}
      <HipaaModal
        isOpen={showHipaaModal}
        onClose={() => setShowHipaaModal(false)}
        onAccept={() => {
          setShowHipaaModal(false);
          formik.setFieldValue("hipaaPrivacyNoticeAcknowledgment", "Y");
        }}
      />
    </div>
  );
}
