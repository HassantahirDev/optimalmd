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
import { adminApi, Patient } from '@/services/adminApi';
import { X } from 'lucide-react';

interface EditPatientFormProps {
  patient: Patient;
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
}

const EditPatientForm: React.FC<EditPatientFormProps> = ({ patient, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik<PatientFormData>({
    initialValues: {
      // Mandatory Fields
      firstName: patient.firstName || "",
      middleName: patient.middleName || "",
      lastName: patient.lastName || "",
      dateOfBirth: patient.dateOfBirth || "",
      gender: patient.gender || "",
      completeAddress: patient.completeAddress || "",
      city: patient.city || "",
      state: patient.state || "",
      zipcode: patient.zipcode || "",
      primaryEmail: patient.primaryEmail || "",
      alternativeEmail: patient.alternativeEmail || "",
      primaryPhone: patient.primaryPhone || "",
      alternativePhone: patient.alternativePhone || "",
      emergencyContactName: patient.emergencyContactName || "",
      emergencyContactRelationship: patient.emergencyContactRelationship || "",
      emergencyContactPhone: patient.emergencyContactPhone || "",
      referringSource: patient.referringSource || "",
      consentForTreatment: patient.consentForTreatment || "",
      hipaaPrivacyNoticeAcknowledgment: patient.hipaaPrivacyNoticeAcknowledgment || "",
      releaseOfMedicalRecordsConsent: patient.releaseOfMedicalRecordsConsent || "",
      preferredMethodOfCommunication: patient.preferredMethodOfCommunication || "",
      disabilityAccessibilityNeeds: patient.disabilityAccessibilityNeeds || "",
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
        
        // Update patient
        const patientResponse = await adminApi.patient.updatePatient(patient.id, cleanedValues);

        if (patientResponse.success) {
          toast.success('Patient updated successfully!');
          onSuccess();
          onClose();
        }
      } catch (error: any) {
        console.error('Error updating patient:', error);
        toast.error(error.response?.data?.message || 'Failed to update patient');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-red-600 border-b border-red-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Edit Patient</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-red-700">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
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



            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? 'Updating...' : 'Update Patient'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPatientForm;
