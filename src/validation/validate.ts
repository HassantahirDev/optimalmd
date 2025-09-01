import * as Yup from "yup";

export const patientRegistrationSchema = Yup.object({
  // Mandatory Fields (Green in image)
  title: Yup.string()
    .oneOf(['Mr', 'Mrs', 'Ms', 'Dr', 'Other'], "Please select a valid title")
    .optional(),
  
  firstName: Yup.string()
    .required("First name is required"),
  
  middleName: Yup.string()
    .optional(),
  
  lastName: Yup.string()
    .required("Last name is required"),
  
  dateOfBirth: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .required("Date of Birth is required"),
  
  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Other'], "Please select a valid gender")
    .required("Gender is required"),
  
  completeAddress: Yup.string()
    .required("Complete Address is required"),
  
  city: Yup.string()
    .required("City is required"),
  
  state: Yup.string()
    .required("State is required"),
  
  zipcode: Yup.string()
    .required("Zipcode is required"),
  
  primaryEmail: Yup.string()
    .email("Invalid email format")
    .required("Primary Email Address is required"),
  
  alternativeEmail: Yup.string()
    .email("Invalid email format")
    .optional(),
  
  primaryPhone: Yup.string()
    .required("Primary Phone Number is required"),
  
  alternativePhone: Yup.string()
    .optional(),
  
  emergencyContactName: Yup.string()
    .required("Emergency Contact Name is required"),
  
  emergencyContactRelationship: Yup.string()
    .optional(),
  
  emergencyContactPhone: Yup.string()
    .required("Emergency Contact Phone Number is required"),
  
  referringSource: Yup.string()
    .oneOf(['Online', 'Friend', 'Employee'], "Please select a valid referring source")
    .required("Referring Source is required"),
  
  consentForTreatment: Yup.string()
    .oneOf(['Y', 'N'], "Please select Y or N")
    .required("Consent for Treatment is required"),
  
  hipaaPrivacyNoticeAcknowledgment: Yup.string()
    .oneOf(['Y', 'N'], "Please select Y or N")
    .required("HIPAA Privacy Notice Acknowledgment is required"),
  
  releaseOfMedicalRecordsConsent: Yup.string()
    .oneOf(['Y', 'N'], "Please select Y or N")
    .required("Release of Medical Records Consent is required"),
  
  preferredMethodOfCommunication: Yup.string()
    .oneOf(['Phone', 'Email', 'Mail'], "Please select a valid communication method")
    .required("Preferred Method of Communication is required"),
  
  disabilityAccessibilityNeeds: Yup.string()
    .optional(),
  
  // Optional Fields (Yellow in image)
  careProviderPhone: Yup.string().optional(),
  
  lastFourDigitsSSN: Yup.string()
    .when('$lastFourDigitsSSN', {
      is: (val: string) => val && val.length > 0,
      then: (schema) => schema
        .length(4, "SSN must be exactly 4 digits")
        .matches(/^\d{4}$/, "SSN must contain only digits"),
      otherwise: (schema) => schema.optional()
    }),
  
  languagePreference: Yup.string().optional(),
  
  ethnicityRace: Yup.string().optional(),
  
  primaryCarePhysician: Yup.string().optional(),
  
  insuranceProviderName: Yup.string().optional(),
  
  insurancePolicyNumber: Yup.string().optional(),
  
  insuranceGroupNumber: Yup.string().optional(),
  
  insurancePhoneNumber: Yup.string().optional(),
  
  guarantorResponsibleParty: Yup.string().optional(),
  
  dateOfFirstVisitPlanned: Yup.string()
    .when('$dateOfFirstVisitPlanned', {
      is: (val: string) => val && val.length > 0,
      then: (schema) => schema
        .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
        .test('is-valid-date', 'Date must be a valid date', (value) => {
          if (!value) return true; // Allow empty values
          const date = new Date(value);
          return date instanceof Date && !isNaN(date.getTime());
        }),
      otherwise: (schema) => schema.optional()
    }),
  
  interpreterRequired: Yup.string()
    .oneOf(['Y', 'N'], "Please select Y or N")
    .optional(),
  
  advanceDirectives: Yup.string()
    .oneOf(['Y', 'N'], "Please select Y or N")
    .optional(),
  
  // Authentication fields
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Passwords must match")
    .required("Please confirm your password"),
});
