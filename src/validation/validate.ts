import * as Yup from "yup";

export const patientRegistrationSchema = Yup.object({
  // First Section
  medicalRecordNo: Yup.string()
    .length(10, "Medical Record No must be 10 digits")
    .required("Medical Record No is required"),
  title: Yup.string().required("Title is required"),
  firstName: Yup.string().required("First name is required"),
  middleName: Yup.string().required("Middle name is required"),
  lastName: Yup.string().required("Last name is required"),
  dateOfBirth: Yup.date().required("Date of Birth is required"),
  gender: Yup.string().required("Gender is required"),
  address: Yup.string().required("Complete Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipcode: Yup.string().required("Zipcode is required"),
  primaryEmail: Yup.string()
    .email("Invalid email")
    .required("Primary Email Address is required"),
  alternativeEmail: Yup.string().email("Invalid email"),
  primaryPhone: Yup.string().required("Primary Phone Number is required"),
  alternativePhone: Yup.string(),

  // Second Section
  emergencyContactName: Yup.string().required(
    "Emergency Contact Name is required"
  ),
  emergencyContactRelationship: Yup.string().required(
    "Emergency Contact Relationship is required"
  ),
  emergencyContactPhone: Yup.string().required(
    "Emergency Contact Phone Number is required"
  ),

  // Third Section
  dateOfRegistration: Yup.date().required("Date of Registration is required"),
  referringSource: Yup.string().required("Referring Source is required"),
  consentForTreatment: Yup.boolean().oneOf(
    [true],
    "Consent for Treatment is required"
  ),
  hipaaAcknowledgment: Yup.boolean().oneOf(
    [true],
    "HIPAA Acknowledgment is required"
  ),
  releaseOfRecords: Yup.boolean().oneOf(
    [true],
    "Release of Medical Records Consent is required"
  ),
  preferredCommunication: Yup.string().required(
    "Preferred Method of Communication is required"
  ),
  disabilityNeeds: Yup.string().required(
    "Disability / Accessibility Needs is required"
  ),
});
