import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminPatientCreationSchema } from '@/validation/validate';
import { adminApi } from '@/services/adminApi';
import { X, Plus, Minus } from 'lucide-react';

interface CreatePatientFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface PatientFormData {
  // Mandatory Fields
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  completeAddress: string;
  city: string;
  state: string;
  zipcode: string;
  primaryEmail: string;
  alternativeEmail: string;
  primaryPhone: string;
  alternativePhone: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  referringSource: string;
  consentForTreatment: string;
  hipaaPrivacyNoticeAcknowledgment: string;
  releaseOfMedicalRecordsConsent: string;
  preferredMethodOfCommunication: string;
  disabilityAccessibilityNeeds: string;

  // Optional Fields
  careProviderPhone: string;
  lastFourDigitsSSN: string;
  languagePreference: string;
  ethnicityRace: string;
  primaryCarePhysician: string;
  insuranceProviderName: string;
  insurancePolicyNumber: string;
  insuranceGroupNumber: string;
  insurancePhoneNumber: string;
  guarantorResponsibleParty: string;
  dateOfFirstVisitPlanned: string;
  interpreterRequired: string;
  advanceDirectives: string;

  // Admin options
  sendWelcomeEmail: boolean;
}

interface MedicalFormData {
  // Screen 2 - About You
  height: string;
  weight: string;
  waist: string;
  bmi: string;

  // Screen 3 - Your Goals
  goalMoreEnergy: boolean;
  goalBetterSexualPerformance: boolean;
  goalLoseWeight: boolean;
  goalHairRestoration: boolean;
  goalImproveMood: boolean;
  goalLongevity: boolean;
  goalOther: boolean;
  goalOtherDescription: string;

  // Screen 4 - Medical Background
  chronicConditions: string;
  pastSurgeriesHospitalizations: string;
  currentMedications: string;
  allergies: string;
  
  // Screen 5 - Lifestyle & Habits
  sleepHoursPerNight: string;
  sleepQuality: string;
  exerciseFrequency: string;
  dietType: string;
  alcoholUse: string;
  tobaccoUse: string;
  cannabisOtherSubstances: string;
  cannabisOtherSubstancesList: string;
  stressLevel: string;

  // Screen 6 - Symptom Check
  symptomFatigue: boolean;
  symptomLowLibido: boolean;
  symptomMuscleLoss: boolean;
  symptomWeightGain: boolean;
  symptomGynecomastia: boolean;
  symptomBrainFog: boolean;
  symptomMoodSwings: boolean;
  symptomPoorSleep: boolean;
  symptomHairThinning: boolean;

  // Screen 7 - Safety Check
  historyProstateBreastCancer: boolean;
  historyBloodClotsMIStroke: boolean;
  currentlyUsingHormonesPeptides: boolean;
  planningChildrenNext12Months: boolean;

  // Screen 8 - Labs & Uploads
  labUploads: string;
  labSchedulingNeeded: boolean;

  // Screen 9 - Consent & Finalize
  consentTelemedicineCare: boolean;
  consentElectiveOptimizationTreatment: boolean;
  consentRequiredLabMonitoring: boolean;
  digitalSignature: string;
  consentDate: string;
}

const CreatePatientForm: React.FC<CreatePatientFormProps> = ({ onClose, onSuccess }) => {
  const [activeSection, setActiveSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [medicalFormData, setMedicalFormData] = useState<MedicalFormData>({
    // Screen 2 - About You
    height: '',
    weight: '',
    waist: '',
    bmi: '',

    // Screen 3 - Your Goals
    goalMoreEnergy: false,
    goalBetterSexualPerformance: false,
    goalLoseWeight: false,
    goalHairRestoration: false,
    goalImproveMood: false,
    goalLongevity: false,
    goalOther: false,
    goalOtherDescription: '',

    // Screen 4 - Medical Background
    chronicConditions: '',
    pastSurgeriesHospitalizations: '',
    currentMedications: '',
    allergies: '',

    // Screen 5 - Lifestyle & Habits
    sleepHoursPerNight: '',
    sleepQuality: '',
    exerciseFrequency: '',
    dietType: '',
    alcoholUse: '',
    tobaccoUse: '',
    cannabisOtherSubstances: '',
    cannabisOtherSubstancesList: '',
    stressLevel: '',

    // Screen 6 - Symptom Check
    symptomFatigue: false,
    symptomLowLibido: false,
    symptomMuscleLoss: false,
    symptomWeightGain: false,
    symptomGynecomastia: false,
    symptomBrainFog: false,
    symptomMoodSwings: false,
    symptomPoorSleep: false,
    symptomHairThinning: false,

    // Screen 7 - Safety Check
    historyProstateBreastCancer: false,
    historyBloodClotsMIStroke: false,
    currentlyUsingHormonesPeptides: false,
    planningChildrenNext12Months: false,

    // Screen 8 - Labs & Uploads
    labUploads: '',
    labSchedulingNeeded: false,

    // Screen 9 - Consent & Finalize
    consentTelemedicineCare: false,
    consentElectiveOptimizationTreatment: false,
    consentRequiredLabMonitoring: false,
    digitalSignature: '',
    consentDate: new Date().toISOString().split('T')[0],
  });

  const formik = useFormik<PatientFormData>({
    initialValues: {
      // Mandatory Fields
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

      // Optional Fields
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

      // Admin options
      sendWelcomeEmail: true,
    },
    validationSchema: adminPatientCreationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Clean up the form data - remove empty strings for optional fields
        const cleanedValues = Object.fromEntries(
          Object.entries(values).map(([key, value]) => [
            key,
            // Convert empty strings to undefined for optional fields, except for required fields
            value === '' && !['firstName', 'lastName', 'dateOfBirth', 'gender', 'completeAddress', 'city', 'state', 'zipcode', 'primaryEmail', 'primaryPhone', 'consentForTreatment', 'hipaaPrivacyNoticeAcknowledgment', 'releaseOfMedicalRecordsConsent', 'preferredMethodOfCommunication'].includes(key)
              ? undefined 
              : value
          ])
        ) as any;

        console.log('Cleaned form values:', cleanedValues);
        
        // Create patient
        const patientResponse = await adminApi.patient.createPatient(cleanedValues);

        if (patientResponse.success) {
          const patientId = patientResponse.data.id;

          // Create medical form if data exists
          if (showMedicalForm && hasMedicalFormData()) {
            // Convert old medical form data to new format
            const convertedFormData = {
              // Convert old format to new format - for now just pass as is
              // TODO: Implement proper conversion if needed
              ...medicalFormData
            };
            await adminApi.patient.createMedicalForm(patientId, convertedFormData);
          }

          toast.success('Patient created successfully!');
          onSuccess();
          onClose();
        }
      } catch (error: any) {
        console.error('Error creating patient:', error);
        toast.error(error.response?.data?.message || 'Failed to create patient');
      } finally {
        setLoading(false);
      }
    },
  });

  const hasMedicalFormData = () => {
    return Object.entries(medicalFormData).some(([key, value]) => {
      if (typeof value === 'boolean') {
        return value === true;
      }
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      return false;
    });
  };

  const calculateBMI = () => {
    const weight = parseFloat(medicalFormData.weight);
    const height = parseFloat(medicalFormData.height);
    
    if (weight && height) {
      const heightInMeters = height / 100; // Convert cm to meters
      const bmi = weight / (heightInMeters * heightInMeters);
      setMedicalFormData(prev => ({ ...prev, bmi: bmi.toFixed(1) }));
    }
  };

  useEffect(() => {
    if (medicalFormData.weight && medicalFormData.height) {
      calculateBMI();
    }
  }, [medicalFormData.weight, medicalFormData.height]);

  const renderPatientForm = () => (
    <div className="space-y-6">
      {/* Section 1: Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.firstName && formik.touched.firstName ? 'border-red-500' : ''}
              />
              {formik.errors.firstName && formik.touched.firstName && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.firstName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                name="middleName"
                value={formik.values.middleName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.lastName && formik.touched.lastName ? 'border-red-500' : ''}
              />
              {formik.errors.lastName && formik.touched.lastName && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.dateOfBirth && formik.touched.dateOfBirth ? 'border-red-500' : ''}
              />
              {formik.errors.dateOfBirth && formik.touched.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.dateOfBirth}</p>
              )}
            </div>
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formik.values.gender}
                onValueChange={(value) => formik.setFieldValue('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formik.errors.gender && formik.touched.gender && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="completeAddress">Complete Address *</Label>
            <Input
              id="completeAddress"
              name="completeAddress"
              value={formik.values.completeAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.errors.completeAddress && formik.touched.completeAddress ? 'border-red-500' : ''}
            />
            {formik.errors.completeAddress && formik.touched.completeAddress && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.completeAddress}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.city && formik.touched.city ? 'border-red-500' : ''}
              />
              {formik.errors.city && formik.touched.city && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.city}</p>
              )}
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.state && formik.touched.state ? 'border-red-500' : ''}
              />
              {formik.errors.state && formik.touched.state && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.state}</p>
              )}
            </div>
            <div>
              <Label htmlFor="zipcode">Zipcode *</Label>
              <Input
                id="zipcode"
                name="zipcode"
                value={formik.values.zipcode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.zipcode && formik.touched.zipcode ? 'border-red-500' : ''}
              />
              {formik.errors.zipcode && formik.touched.zipcode && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.zipcode}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryEmail">Primary Email *</Label>
              <Input
                id="primaryEmail"
                name="primaryEmail"
                type="email"
                value={formik.values.primaryEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.primaryEmail && formik.touched.primaryEmail ? 'border-red-500' : ''}
              />
              {formik.errors.primaryEmail && formik.touched.primaryEmail && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.primaryEmail}</p>
              )}
            </div>
            <div>
              <Label htmlFor="alternativeEmail">Alternative Email</Label>
              <Input
                id="alternativeEmail"
                name="alternativeEmail"
                type="email"
                value={formik.values.alternativeEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryPhone">Primary Phone *</Label>
              <Input
                id="primaryPhone"
                name="primaryPhone"
                value={formik.values.primaryPhone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.primaryPhone && formik.touched.primaryPhone ? 'border-red-500' : ''}
              />
              {formik.errors.primaryPhone && formik.touched.primaryPhone && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.primaryPhone}</p>
              )}
            </div>
            <div>
              <Label htmlFor="alternativePhone">Alternative Phone</Label>
              <Input
                id="alternativePhone"
                name="alternativePhone"
                value={formik.values.alternativePhone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
              <Input
                id="emergencyContactName"
                name="emergencyContactName"
                value={formik.values.emergencyContactName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.emergencyContactName && formik.touched.emergencyContactName ? 'border-red-500' : ''}
              />
              {formik.errors.emergencyContactName && formik.touched.emergencyContactName && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.emergencyContactName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="emergencyContactRelationship">Relationship</Label>
              <Input
                id="emergencyContactRelationship"
                name="emergencyContactRelationship"
                value={formik.values.emergencyContactRelationship}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div>
              <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
              <Input
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                value={formik.values.emergencyContactPhone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.emergencyContactPhone && formik.touched.emergencyContactPhone ? 'border-red-500' : ''}
              />
              {formik.errors.emergencyContactPhone && formik.touched.emergencyContactPhone && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.emergencyContactPhone}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="referringSource">Referring Source</Label>
              <Select
                value={formik.values.referringSource}
                onValueChange={(value) => formik.setFieldValue('referringSource', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select referring source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Friend">Friend</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                </SelectContent>
              </Select>
              {formik.errors.referringSource && formik.touched.referringSource && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.referringSource}</p>
              )}
            </div>
            <div>
              <Label htmlFor="preferredMethodOfCommunication">Preferred Communication *</Label>
              <Select
                value={formik.values.preferredMethodOfCommunication}
                onValueChange={(value) => formik.setFieldValue('preferredMethodOfCommunication', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select communication method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="Mail">Mail</SelectItem>
                </SelectContent>
              </Select>
              {formik.errors.preferredMethodOfCommunication && formik.touched.preferredMethodOfCommunication && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.preferredMethodOfCommunication}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="consentForTreatment">Consent for Treatment *</Label>
              <RadioGroup
                value={formik.values.consentForTreatment}
                onValueChange={(value) => formik.setFieldValue('consentForTreatment', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Y" id="consent-y" />
                  <Label htmlFor="consent-y">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="N" id="consent-n" />
                  <Label htmlFor="consent-n">No</Label>
                </div>
              </RadioGroup>
              {formik.errors.consentForTreatment && formik.touched.consentForTreatment && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.consentForTreatment}</p>
              )}
            </div>
            <div>
              <Label htmlFor="hipaaPrivacyNoticeAcknowledgment">HIPAA Privacy Notice *</Label>
              <RadioGroup
                value={formik.values.hipaaPrivacyNoticeAcknowledgment}
                onValueChange={(value) => formik.setFieldValue('hipaaPrivacyNoticeAcknowledgment', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Y" id="hipaa-y" />
                  <Label htmlFor="hipaa-y">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="N" id="hipaa-n" />
                  <Label htmlFor="hipaa-n">No</Label>
                </div>
              </RadioGroup>
              {formik.errors.hipaaPrivacyNoticeAcknowledgment && formik.touched.hipaaPrivacyNoticeAcknowledgment && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.hipaaPrivacyNoticeAcknowledgment}</p>
              )}
            </div>

            <div>
              <Label htmlFor="releaseOfMedicalRecordsConsent">Release of Medical Records Consent *</Label>
              <RadioGroup
                value={formik.values.releaseOfMedicalRecordsConsent}
                onValueChange={(value) => formik.setFieldValue('releaseOfMedicalRecordsConsent', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Y" id="release-y" />
                  <Label htmlFor="release-y">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="N" id="release-n" />
                  <Label htmlFor="release-n">No</Label>
                </div>
              </RadioGroup>
              {formik.errors.releaseOfMedicalRecordsConsent && formik.touched.releaseOfMedicalRecordsConsent && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.releaseOfMedicalRecordsConsent}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="disabilityAccessibilityNeeds">Disability/Accessibility Needs</Label>
            <Textarea
              id="disabilityAccessibilityNeeds"
              name="disabilityAccessibilityNeeds"
              value={formik.values.disabilityAccessibilityNeeds}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Describe any disability or accessibility needs"
              className={formik.errors.disabilityAccessibilityNeeds && formik.touched.disabilityAccessibilityNeeds ? 'border-red-500' : ''}
            />
            {formik.errors.disabilityAccessibilityNeeds && formik.touched.disabilityAccessibilityNeeds && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.disabilityAccessibilityNeeds}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendWelcomeEmail"
                checked={formik.values.sendWelcomeEmail}
                onCheckedChange={(checked) => formik.setFieldValue('sendWelcomeEmail', checked)}
              />
              <Label htmlFor="sendWelcomeEmail" className="text-sm font-medium">
                Send welcome email with login credentials
              </Label>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              If checked, the patient will receive an email with their auto-generated login credentials and a verification link.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Medical Form Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Medical Form</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showMedicalForm"
              checked={showMedicalForm}
              onCheckedChange={(checked) => setShowMedicalForm(checked as boolean)}
            />
            <Label htmlFor="showMedicalForm">Create medical form for this patient</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMedicalForm = () => {
    const handleInputChange = (field: string, value: any) => {
      setMedicalFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    return (
      <div className="space-y-6">
        {/* Screen 2 - About You */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">About You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  name="height"
                  value={medicalFormData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="e.g., 5'10&quot; or 178 cm"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  name="weight"
                  value={medicalFormData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="e.g., 180 lbs or 82 kg"
                />
              </div>
              <div>
                <Label htmlFor="waist">Waist</Label>
                <Input
                  id="waist"
                  name="waist"
                  value={medicalFormData.waist}
                  onChange={(e) => handleInputChange('waist', e.target.value)}
                  placeholder="e.g., 34 inches"
                />
              </div>
            </div>
            {medicalFormData.bmi && (
              <div>
                <Label>BMI</Label>
                <p className="text-sm text-gray-600">{medicalFormData.bmi}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Screen 3 - Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Your Goals</CardTitle>
            <p className="text-sm text-gray-600">What are your main goals? (check all that apply)</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-6">
              {[
                { key: 'goalMoreEnergy', label: 'More energy & motivation' },
                { key: 'goalBetterSexualPerformance', label: 'Better sexual performance' },
                { key: 'goalLoseWeight', label: 'Lose weight' },
                { key: 'goalHairRestoration', label: 'Hair restoration' },
                { key: 'goalImproveMood', label: 'Improve mood & mental clarity' },
                { key: 'goalLongevity', label: 'Longevity & disease prevention' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                <Checkbox
                    id={key}
                    checked={medicalFormData[key as keyof typeof medicalFormData] as boolean}
                    onCheckedChange={(checked) => handleInputChange(key, checked)}
                  />
                  <Label htmlFor={key}>{label}</Label>
              </div>
              ))}
              
              <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="goalOther"
                  checked={medicalFormData.goalOther}
                  onCheckedChange={(checked) => handleInputChange('goalOther', checked)}
                />
                  <Label htmlFor="goalOther">Other:</Label>
            </div>
            {medicalFormData.goalOther && (
                  <Input
                    placeholder="Please specify"
                  value={medicalFormData.goalOtherDescription}
                  onChange={(e) => handleInputChange('goalOtherDescription', e.target.value)}
                />
            )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Screen 4 - Medical Background */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Medical Background</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="chronicConditions">Chronic conditions</Label>
              <Textarea
                id="chronicConditions"
                name="chronicConditions"
                value={medicalFormData.chronicConditions}
                onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
                placeholder="List any chronic conditions you have"
              />
            </div>
            <div>
              <Label htmlFor="pastSurgeriesHospitalizations">Past surgeries/hospitalizations</Label>
              <Textarea
                id="pastSurgeriesHospitalizations"
                name="pastSurgeriesHospitalizations"
                value={medicalFormData.pastSurgeriesHospitalizations}
                onChange={(e) => handleInputChange('pastSurgeriesHospitalizations', e.target.value)}
                placeholder="Describe any past surgeries or hospitalizations"
              />
            </div>
            <div>
              <Label htmlFor="currentMedications">Current medications</Label>
              <Input
                id="currentMedications"
                name="currentMedications"
                value={medicalFormData.currentMedications}
                onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                placeholder="List your current medications"
              />
            </div>
            <div>
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                name="allergies"
                value={medicalFormData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                placeholder="List any allergies you have"
              />
            </div>
          </CardContent>
        </Card>

        {/* Screen 5 - Lifestyle & Habits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Lifestyle & Habits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1 */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="sleepHours">Sleep: Hours/night</Label>
                  <Input
                    id="sleepHours"
                    placeholder="e.g., 7-8"
                    value={medicalFormData.sleepHoursPerNight}
                    onChange={(e) => handleInputChange('sleepHoursPerNight', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Sleep Quality:</Label>
                  <RadioGroup
                    value={medicalFormData.sleepQuality}
                    onValueChange={(value) => handleInputChange('sleepQuality', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Poor" id="sleep-poor" />
                      <Label htmlFor="sleep-poor">Poor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Fair" id="sleep-fair" />
                      <Label htmlFor="sleep-fair">Fair</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Good" id="sleep-good" />
                      <Label htmlFor="sleep-good">Good</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Exercise:</Label>
                  <RadioGroup
                    value={medicalFormData.exerciseFrequency}
                    onValueChange={(value) => handleInputChange('exerciseFrequency', value)}
                  >
                    {['None', '1-2x/week', '3-5x/week', 'Daily'].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`exercise-${option}`} />
                        <Label htmlFor={`exercise-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-6">
              <div>
                  <Label>Diet:</Label>
                  <RadioGroup
                    value={medicalFormData.dietType}
                    onValueChange={(value) => handleInputChange('dietType', value)}
                  >
                    {['Balanced', 'High protein', 'Low-carb', 'Plant-based', 'Other'].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`diet-${option}`} />
                        <Label htmlFor={`diet-${option}`}>{option}</Label>
              </div>
                    ))}
                  </RadioGroup>
                </div>

              <div>
                  <Label>Alcohol use:</Label>
                  <RadioGroup
                  value={medicalFormData.alcoholUse}
                    onValueChange={(value) => handleInputChange('alcoholUse', value)}
                  >
                    {['None', 'Social', 'Regular'].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`alcohol-${option}`} />
                        <Label htmlFor={`alcohol-${option}`}>{option}</Label>
              </div>
                    ))}
                  </RadioGroup>
                </div>

              <div>
                  <Label>Tobacco:</Label>
                  <RadioGroup
                    value={medicalFormData.tobaccoUse}
                    onValueChange={(value) => handleInputChange('tobaccoUse', value)}
                  >
                    {['Never', 'Current', 'Former'].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`tobacco-${option}`} />
                        <Label htmlFor={`tobacco-${option}`}>{option}</Label>
              </div>
                    ))}
                  </RadioGroup>
            </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-6">
            <div>
                  <Label>Cannabis/Other substances:</Label>
                  <RadioGroup
                    value={medicalFormData.cannabisOtherSubstances}
                    onValueChange={(value) => handleInputChange('cannabisOtherSubstances', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="None" id="substances-none" />
                      <Label htmlFor="substances-none">None</Label>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="substances-yes" />
                        <Label htmlFor="substances-yes">Yes – List:</Label>
                      </div>
                      {medicalFormData.cannabisOtherSubstances === 'Yes' && (
                        <Input
                          placeholder="Please specify"
                          value={medicalFormData.cannabisOtherSubstancesList}
                          onChange={(e) => handleInputChange('cannabisOtherSubstancesList', e.target.value)}
                        />
                      )}
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Stress level:</Label>
                  <RadioGroup
                    value={medicalFormData.stressLevel}
                    onValueChange={(value) => handleInputChange('stressLevel', value)}
                  >
                    {['Low', 'Medium', 'High'].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`stress-${option}`} />
                        <Label htmlFor={`stress-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Screen 6 - Symptom Check */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Symptom Check</CardTitle>
            <p className="text-sm text-gray-600">How are you feeling lately?</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-6">
              {[
                { key: 'symptomFatigue', label: 'Fatigue / low energy' },
                { key: 'symptomLowLibido', label: 'Low libido / ED' },
                { key: 'symptomMuscleLoss', label: 'Muscle loss' },
                { key: 'symptomWeightGain', label: 'Weight gain' },
                { key: 'symptomGynecomastia', label: 'Gynecomastia' },
                { key: 'symptomBrainFog', label: 'Brain fog / poor memory' },
                { key: 'symptomMoodSwings', label: 'Mood swings' },
                { key: 'symptomPoorSleep', label: 'Poor sleep' },
                { key: 'symptomHairThinning', label: 'Hair thinning' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={medicalFormData[key as keyof typeof medicalFormData] as boolean}
                    onCheckedChange={(checked) => handleInputChange(key, checked)}
                  />
                  <Label htmlFor={key}>{label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Screen 7 - Safety Check */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Safety Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-6">
              {[
                { key: 'historyProstateBreastCancer', label: 'History of prostate/breast cancer' },
                { key: 'historyBloodClotsMIStroke', label: 'History of blood clots/MI/stroke' },
                { key: 'currentlyUsingHormonesPeptides', label: 'Currently using hormones/peptides' },
                { key: 'planningChildrenNext12Months', label: 'Planning children in next 12 months' },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <Label>{label}:</Label>
                  <RadioGroup
                    value={medicalFormData[key as keyof typeof medicalFormData] ? 'Yes' : 'No'}
                    onValueChange={(value) => handleInputChange(key, value === 'Yes')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id={`${key}-yes`} />
                      <Label htmlFor={`${key}-yes`}>Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id={`${key}-no`} />
                      <Label htmlFor={`${key}-no`}>No</Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Screen 8 - Labs & Uploads */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Labs & Uploads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div>
              <Label htmlFor="labUploads">Upload your latest labs:</Label>
                <Input
                id="labUploads"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleInputChange('labUploads', file.name);
                  }
                }}
                />
              </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="labSchedulingNeeded"
                checked={medicalFormData.labSchedulingNeeded}
                onCheckedChange={(checked) => handleInputChange('labSchedulingNeeded', checked)}
              />
              <Label htmlFor="labSchedulingNeeded">No labs? We'll help you schedule a draw.</Label>
              </div>
          </CardContent>
        </Card>

        {/* Screen 9 - Consent & Finalize */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Consent & Finalize</CardTitle>
            <p className="text-sm text-gray-600">Please review and agree:</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consentTelemedicineCare"
                  checked={medicalFormData.consentTelemedicineCare}
                  onCheckedChange={(checked) => handleInputChange('consentTelemedicineCare', checked)}
                />
                <Label htmlFor="consentTelemedicineCare">I consent to telemedicine care</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consentElectiveOptimizationTreatment"
                  checked={medicalFormData.consentElectiveOptimizationTreatment}
                  onCheckedChange={(checked) => handleInputChange('consentElectiveOptimizationTreatment', checked)}
                />
                <Label htmlFor="consentElectiveOptimizationTreatment">I understand this is elective optimization treatment</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consentRequiredLabMonitoring"
                  checked={medicalFormData.consentRequiredLabMonitoring}
                  onCheckedChange={(checked) => handleInputChange('consentRequiredLabMonitoring', checked)}
                />
                <Label htmlFor="consentRequiredLabMonitoring">I agree to required lab monitoring</Label>
              </div>

              <div>
                <Label htmlFor="digitalSignature">Digital Signature:</Label>
                <Input
                  id="digitalSignature"
                  placeholder="Type your full name"
                  value={medicalFormData.digitalSignature}
                  onChange={(e) => handleInputChange('digitalSignature', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="consentDate">Date:</Label>
                <Input
                  id="consentDate"
                  type="date"
                  value={medicalFormData.consentDate}
                  onChange={(e) => handleInputChange('consentDate', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-red-600 border-b border-red-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Create New Patient</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-red-700">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                activeSection >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${activeSection >= 2 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                activeSection >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
            </div>
          </div>

          {/* Form Content */}
          {activeSection === 1 && renderPatientForm()}
          {activeSection === 2 && showMedicalForm && renderMedicalForm()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => activeSection > 1 ? setActiveSection(activeSection - 1) : onClose()}
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            >
              {activeSection > 1 ? 'Previous' : 'Cancel'}
            </Button>
            
            <div className="flex space-x-2">
              {activeSection === 1 && (
                <Button
                  type="button"
                  onClick={async () => {
                    console.log('Button clicked, activeSection:', activeSection, 'showMedicalForm:', showMedicalForm);
                    console.log('Form values:', formik.values);
                    console.log('Form errors:', formik.errors);
                    
                    if (showMedicalForm) {
                      // Validate the current form before proceeding
                      const errors = await formik.validateForm();
                      console.log('Validation errors:', errors);
                      
                      if (Object.keys(errors).length === 0) {
                        setActiveSection(2);
                      } else {
                        // Mark all fields as touched to show validation errors
                        formik.setTouched(Object.keys(formik.values).reduce((acc, key) => {
                          acc[key] = true;
                          return acc;
                        }, {} as any));
                      }
                    } else {
                      console.log('Submitting form...');
                      formik.handleSubmit();
                    }
                  }}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {loading ? 'Creating...' : showMedicalForm ? 'Next' : 'Create Patient'}
                </Button>
              )}
              
              {activeSection === 2 && (
                <Button
                  type="button"
                  onClick={() => {
                    console.log('Final submit button clicked');
                    console.log('Form values:', formik.values);
                    console.log('Medical form data:', medicalFormData);
                    formik.handleSubmit();
                  }}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {loading ? 'Creating...' : 'Create Patient'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePatientForm;