import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import api from '@/service/api';

interface MedicalFormData {
  // Patient Information
  chiefComplaint: string;
  
  // History Sections
  historyOfPresentIllness: string;
  pastMedicalHistory: string;
  pastSurgicalHistory: string;
  
  // Allergies
  allergies: string;
  
  // Social History
  tobaccoUse: string;
  alcoholUse: string;
  recreationalDrugs: string;
  otherSocialHistory?: string;
  
  // Family History
  familyHistory: string;
  
  // Work History
  workHistory: string;
  
  // Medications
  medications: string;
  
  // Review of Systems (ROS) - Optional
  generalSymptoms?: string;
  cardiovascularSymptoms?: string;
  respiratorySymptoms?: string;
  gastrointestinalSymptoms?: string;
  genitourinarySymptoms?: string;
  neurologicalSymptoms?: string;
  musculoskeletalSymptoms?: string;
  skinSymptoms?: string;
  psychiatricSymptoms?: string;
  endocrineSymptoms?: string;
  otherSymptoms?: string;
  
  // Physical Exam - Optional
  bloodPressure?: string;
  heartRate?: string;
  respiratoryRate?: string;
  temperature?: string;
  oxygenSaturation?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  
  // System-based Examination - Optional
  generalExam?: string;
  heentExam?: string;
  chestLungsExam?: string;
  heartExam?: string;
  abdomenExam?: string;
  neurologicalExam?: string;
  musculoskeletalExam?: string;
  
  // Clinical Process - Optional
  investigationsLabs?: string;
  assessmentDiagnosis?: string;
  planTreatment?: string;
  referrals?: string;
  additionalNotes?: string;
  
  // Care Coordination - Optional
  clinician?: string;
  pharmacy?: string;
  insurance?: string;
  primaryCareProvider?: string;
  referringPhysicians?: string;
}

const MedicalConsultationForm: React.FC = () => {
  const [formData, setFormData] = useState<MedicalFormData>({
    chiefComplaint: '',
    historyOfPresentIllness: '',
    pastMedicalHistory: '',
    pastSurgicalHistory: '',
    allergies: '',
    tobaccoUse: '',
    alcoholUse: '',
    recreationalDrugs: '',
    otherSocialHistory: '',
    familyHistory: '',
    workHistory: '',
    medications: '',
    generalSymptoms: '',
    cardiovascularSymptoms: '',
    respiratorySymptoms: '',
    gastrointestinalSymptoms: '',
    genitourinarySymptoms: '',
    neurologicalSymptoms: '',
    musculoskeletalSymptoms: '',
    skinSymptoms: '',
    psychiatricSymptoms: '',
    endocrineSymptoms: '',
    otherSymptoms: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    temperature: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    bmi: '',
    generalExam: '',
    heentExam: '',
    chestLungsExam: '',
    heartExam: '',
    abdomenExam: '',
    neurologicalExam: '',
    musculoskeletalExam: '',
    investigationsLabs: '',
    assessmentDiagnosis: '',
    planTreatment: '',
    referrals: '',
    additionalNotes: '',
    clinician: '',
    pharmacy: '',
    insurance: '',
    primaryCareProvider: '',
    referringPhysicians: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formExists, setFormExists] = useState(false);

  useEffect(() => {
    checkFormStatus();
  }, []);

  const checkFormStatus = async () => {
    try {
      const response = await api.get('/medical-form/completion-status');
      if (response.data.success) {
        setFormExists(response.data.data.hasCompletedForm);
        if (response.data.data.hasCompletedForm) {
          loadExistingForm();
        }
      }
    } catch (error) {
      console.error('Error checking form status:', error);
    }
  };

  const loadExistingForm = async () => {
    try {
      setLoading(true);
      const response = await api.get('/medical-form');
      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error loading existing form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof MedicalFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: keyof MedicalFormData, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked ? 'Yes' : 'No'
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof MedicalFormData)[] = [
      'chiefComplaint',
      'historyOfPresentIllness',
      'pastMedicalHistory',
      'pastSurgicalHistory',
      'allergies',
      'tobaccoUse',
      'alcoholUse',
      'recreationalDrugs',
      'familyHistory',
      'workHistory',
      'medications'
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field] === '') {
        toast.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      if (formExists) {
        await api.put('/medical-form', formData);
        toast.success('Medical form updated successfully!');
      } else {
        await api.post('/medical-form', formData);
        toast.success('Medical form submitted successfully!');
        setFormExists(true);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Medical Consultation Form (EMR Template)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Patient Information</h3>
              <div>
                <Label htmlFor="chiefComplaint">Chief Complaint / Reason for Visit *</Label>
                <Textarea
                  id="chiefComplaint"
                  value={formData.chiefComplaint}
                  onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
                  placeholder="Please describe your main concern or reason for this visit"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* History Sections */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Medical History</h3>
              
              <div>
                <Label htmlFor="historyOfPresentIllness">History of Present Illness (HPI) *</Label>
                <Textarea
                  id="historyOfPresentIllness"
                  value={formData.historyOfPresentIllness}
                  onChange={(e) => handleInputChange('historyOfPresentIllness', e.target.value)}
                  placeholder="Describe the current illness or condition in detail"
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="pastMedicalHistory">Past Medical History (PMH) *</Label>
                <Textarea
                  id="pastMedicalHistory"
                  value={formData.pastMedicalHistory}
                  onChange={(e) => handleInputChange('pastMedicalHistory', e.target.value)}
                  placeholder="List any previous medical conditions, illnesses, or hospitalizations"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="pastSurgicalHistory">Past Surgical History (PSH) *</Label>
                <Textarea
                  id="pastSurgicalHistory"
                  value={formData.pastSurgicalHistory}
                  onChange={(e) => handleInputChange('pastSurgicalHistory', e.target.value)}
                  placeholder="List any previous surgeries or procedures"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Allergies</h3>
              <div>
                <Label htmlFor="allergies">Allergies *</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="List any known allergies to medications, foods, or other substances"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Social History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social History</h3>
              
              <div className="space-y-3">
                <div>
                  <Label>Tobacco Use *</Label>
                  <RadioGroup
                    value={formData.tobaccoUse}
                    onValueChange={(value) => handleInputChange('tobaccoUse', value)}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="tobacco-yes" />
                      <Label htmlFor="tobacco-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="tobacco-no" />
                      <Label htmlFor="tobacco-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Alcohol Use *</Label>
                  <RadioGroup
                    value={formData.alcoholUse}
                    onValueChange={(value) => handleInputChange('alcoholUse', value)}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="alcohol-yes" />
                      <Label htmlFor="alcohol-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="alcohol-no" />
                      <Label htmlFor="alcohol-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Recreational Drugs *</Label>
                  <RadioGroup
                    value={formData.recreationalDrugs}
                    onValueChange={(value) => handleInputChange('recreationalDrugs', value)}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="drugs-yes" />
                      <Label htmlFor="drugs-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="drugs-no" />
                      <Label htmlFor="drugs-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="otherSocialHistory">Other Social History</Label>
                  <Textarea
                    id="otherSocialHistory"
                    value={formData.otherSocialHistory}
                    onChange={(e) => handleInputChange('otherSocialHistory', e.target.value)}
                    placeholder="Any other relevant social history information"
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Family History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Family History</h3>
              <div>
                <Label htmlFor="familyHistory">Family History *</Label>
                <Textarea
                  id="familyHistory"
                  value={formData.familyHistory}
                  onChange={(e) => handleInputChange('familyHistory', e.target.value)}
                  placeholder="List any relevant family medical history"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Work History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Work History</h3>
              <div>
                <Label htmlFor="workHistory">Work History *</Label>
                <Textarea
                  id="workHistory"
                  value={formData.workHistory}
                  onChange={(e) => handleInputChange('workHistory', e.target.value)}
                  placeholder="Describe your current and past work history"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Medications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Medications</h3>
              <div>
                <Label htmlFor="medications">Current Medications *</Label>
                <Textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => handleInputChange('medications', e.target.value)}
                  placeholder="List all current medications, including dosages and frequency"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Review of Systems */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review of Systems (ROS)</h3>
              <p className="text-sm text-gray-600">Check all applicable symptoms</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="generalSymptoms">General</Label>
                  <Textarea
                    id="generalSymptoms"
                    value={formData.generalSymptoms}
                    onChange={(e) => handleInputChange('generalSymptoms', e.target.value)}
                    placeholder="Fever, weight changes, fatigue, etc."
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="cardiovascularSymptoms">Cardiovascular</Label>
                  <Textarea
                    id="cardiovascularSymptoms"
                    value={formData.cardiovascularSymptoms}
                    onChange={(e) => handleInputChange('cardiovascularSymptoms', e.target.value)}
                    placeholder="Chest pain, palpitations, etc."
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="respiratorySymptoms">Respiratory</Label>
                  <Textarea
                    id="respiratorySymptoms"
                    value={formData.respiratorySymptoms}
                    onChange={(e) => handleInputChange('respiratorySymptoms', e.target.value)}
                    placeholder="Cough, shortness of breath, etc."
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="gastrointestinalSymptoms">GI</Label>
                  <Textarea
                    id="gastrointestinalSymptoms"
                    value={formData.gastrointestinalSymptoms}
                    onChange={(e) => handleInputChange('gastrointestinalSymptoms', e.target.value)}
                    placeholder="Nausea, vomiting, abdominal pain, etc."
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="genitourinarySymptoms">GU</Label>
                  <Textarea
                    id="genitourinarySymptoms"
                    value={formData.genitourinarySymptoms}
                    onChange={(e) => handleInputChange('genitourinarySymptoms', e.target.value)}
                    placeholder="Urinary symptoms, etc."
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="neurologicalSymptoms">Neuro</Label>
                  <Textarea
                    id="neurologicalSymptoms"
                    value={formData.neurologicalSymptoms}
                    onChange={(e) => handleInputChange('neurologicalSymptoms', e.target.value)}
                    placeholder="Headaches, dizziness, etc."
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="musculoskeletalSymptoms">MSK</Label>
                  <Textarea
                    id="musculoskeletalSymptoms"
                    value={formData.musculoskeletalSymptoms}
                    onChange={(e) => handleInputChange('musculoskeletalSymptoms', e.target.value)}
                    placeholder="Joint pain, muscle weakness, etc."
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="skinSymptoms">Skin</Label>
                  <Textarea
                    id="skinSymptoms"
                    value={formData.skinSymptoms}
                    onChange={(e) => handleInputChange('skinSymptoms', e.target.value)}
                    placeholder="Rashes, lesions, etc."
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="psychiatricSymptoms">Psych</Label>
                  <Textarea
                    id="psychiatricSymptoms"
                    value={formData.psychiatricSymptoms}
                    onChange={(e) => handleInputChange('psychiatricSymptoms', e.target.value)}
                    placeholder="Anxiety, depression, etc."
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="endocrineSymptoms">Endocrine</Label>
                  <Textarea
                    id="endocrineSymptoms"
                    value={formData.endocrineSymptoms}
                    onChange={(e) => handleInputChange('endocrineSymptoms', e.target.value)}
                    placeholder="Diabetes, thyroid issues, etc."
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="otherSymptoms">Other</Label>
                  <Textarea
                    id="otherSymptoms"
                    value={formData.otherSymptoms}
                    onChange={(e) => handleInputChange('otherSymptoms', e.target.value)}
                    placeholder="Any other symptoms not covered above"
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Physical Exam */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Physical Exam</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bloodPressure">BP</Label>
                  <Input
                    id="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                    placeholder="120/80"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="heartRate">HR</Label>
                  <Input
                    id="heartRate"
                    value={formData.heartRate}
                    onChange={(e) => handleInputChange('heartRate', e.target.value)}
                    placeholder="72 bpm"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="respiratoryRate">RR</Label>
                  <Input
                    id="respiratoryRate"
                    value={formData.respiratoryRate}
                    onChange={(e) => handleInputChange('respiratoryRate', e.target.value)}
                    placeholder="16/min"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="temperature">Temp</Label>
                  <Input
                    id="temperature"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                    placeholder="98.6°F"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="oxygenSaturation">SpO2</Label>
                  <Input
                    id="oxygenSaturation"
                    value={formData.oxygenSaturation}
                    onChange={(e) => handleInputChange('oxygenSaturation', e.target.value)}
                    placeholder="98%"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="70 kg"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="170 cm"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="bmi">BMI</Label>
                  <Input
                    id="bmi"
                    value={formData.bmi}
                    onChange={(e) => handleInputChange('bmi', e.target.value)}
                    placeholder="24.2"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">System-based Examination</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="generalExam">General</Label>
                    <Textarea
                      id="generalExam"
                      value={formData.generalExam}
                      onChange={(e) => handleInputChange('generalExam', e.target.value)}
                      placeholder="General appearance, vital signs, etc."
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="heentExam">HEENT</Label>
                    <Textarea
                      id="heentExam"
                      value={formData.heentExam}
                      onChange={(e) => handleInputChange('heentExam', e.target.value)}
                      placeholder="Head, eyes, ears, nose, throat"
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="chestLungsExam">Chest/Lungs</Label>
                    <Textarea
                      id="chestLungsExam"
                      value={formData.chestLungsExam}
                      onChange={(e) => handleInputChange('chestLungsExam', e.target.value)}
                      placeholder="Chest examination findings"
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="heartExam">Heart</Label>
                    <Textarea
                      id="heartExam"
                      value={formData.heartExam}
                      onChange={(e) => handleInputChange('heartExam', e.target.value)}
                      placeholder="Cardiovascular examination"
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="abdomenExam">Abdomen</Label>
                    <Textarea
                      id="abdomenExam"
                      value={formData.abdomenExam}
                      onChange={(e) => handleInputChange('abdomenExam', e.target.value)}
                      placeholder="Abdominal examination findings"
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="neurologicalExam">Neuro</Label>
                    <Textarea
                      id="neurologicalExam"
                      value={formData.neurologicalExam}
                      onChange={(e) => handleInputChange('neurologicalExam', e.target.value)}
                      placeholder="Neurological examination"
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="musculoskeletalExam">MSK</Label>
                    <Textarea
                      id="musculoskeletalExam"
                      value={formData.musculoskeletalExam}
                      onChange={(e) => handleInputChange('musculoskeletalExam', e.target.value)}
                      placeholder="Musculoskeletal examination"
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Process */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Clinical Process</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="investigationsLabs">Investigations / Labs</Label>
                  <Textarea
                    id="investigationsLabs"
                    value={formData.investigationsLabs}
                    onChange={(e) => handleInputChange('investigationsLabs', e.target.value)}
                    placeholder="Laboratory tests, imaging studies, etc."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="assessmentDiagnosis">Assessment (Diagnosis/Differential)</Label>
                  <Textarea
                    id="assessmentDiagnosis"
                    value={formData.assessmentDiagnosis}
                    onChange={(e) => handleInputChange('assessmentDiagnosis', e.target.value)}
                    placeholder="Clinical assessment and diagnosis"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="planTreatment">Plan (Treatment / Management)</Label>
                  <Textarea
                    id="planTreatment"
                    value={formData.planTreatment}
                    onChange={(e) => handleInputChange('planTreatment', e.target.value)}
                    placeholder="Treatment plan and management strategy"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="referrals">Referrals</Label>
                  <Textarea
                    id="referrals"
                    value={formData.referrals}
                    onChange={(e) => handleInputChange('referrals', e.target.value)}
                    placeholder="Referrals to specialists or other providers"
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="Any additional notes or observations"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Care Coordination */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Care Coordination Notes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clinician">Clinician</Label>
                  <Input
                    id="clinician"
                    value={formData.clinician}
                    onChange={(e) => handleInputChange('clinician', e.target.value)}
                    placeholder="Primary clinician name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="pharmacy">Pharmacy</Label>
                  <Input
                    id="pharmacy"
                    value={formData.pharmacy}
                    onChange={(e) => handleInputChange('pharmacy', e.target.value)}
                    placeholder="Preferred pharmacy"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="insurance">Insurance</Label>
                  <Input
                    id="insurance"
                    value={formData.insurance}
                    onChange={(e) => handleInputChange('insurance', e.target.value)}
                    placeholder="Insurance information"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="primaryCareProvider">Primary Care Provider</Label>
                  <Input
                    id="primaryCareProvider"
                    value={formData.primaryCareProvider}
                    onChange={(e) => handleInputChange('primaryCareProvider', e.target.value)}
                    placeholder="PCP name and contact"
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="referringPhysicians">CC: Referring Physician(s)</Label>
                  <Textarea
                    id="referringPhysicians"
                    value={formData.referringPhysicians}
                    onChange={(e) => handleInputChange('referringPhysicians', e.target.value)}
                    placeholder="Referring physicians and their contact information"
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
              >
                {submitting ? 'Submitting...' : formExists ? 'Update Form' : 'Submit Form'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalConsultationForm;
