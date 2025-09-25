import api from '../service/api';

// Types for API responses
export interface Patient {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  completeAddress: string;
  city: string;
  state: string;
  zipcode: string;
  primaryEmail: string;
  alternativeEmail?: string;
  primaryPhone: string;
  alternativePhone?: string;
  emergencyContactName: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone: string;
  referringSource: string;
  consentForTreatment: string;
  hipaaPrivacyNoticeAcknowledgment: string;
  releaseOfMedicalRecordsConsent: string;
  preferredMethodOfCommunication: string;
  disabilityAccessibilityNeeds: string;
  careProviderPhone?: string;
  lastFourDigitsSSN?: string;
  languagePreference?: string;
  ethnicityRace?: string;
  primaryCarePhysician?: string;
  insuranceProviderName?: string;
  insurancePolicyNumber?: string;
  insuranceGroupNumber?: string;
  insurancePhoneNumber?: string;
  guarantorResponsibleParty?: string;
  dateOfFirstVisitPlanned?: string;
  interpreterRequired?: string;
  advanceDirectives?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialties: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string | null;
  serviceId: string;
  slotId?: string | null;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  amount: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'RESCHEDULED';
  patientNotes?: string;
  symptoms?: string;
  googleMeetLink?: string;
  patient: Patient;
  doctor: Doctor;
  service: Service;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentRequest {
  id: string;
  patientId: string;
  serviceId: string;
  requestedDate: string;
  requestedTime: string;
  notes?: string;
  status: 'PENDING' | 'ASSIGNED' | 'REJECTED';
  patient: Patient;
  service: Service;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalForm {
  id: string;
  patientId: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  pastMedicalHistory: string;
  pastSurgicalHistory: string;
  allergies: string;
  tobaccoUse: string;
  alcoholUse: string;
  recreationalDrugs: string;
  otherSocialHistory?: string;
  familyHistory: string;
  workHistory: string;
  medications: string;
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
  bloodPressure?: string;
  heartRate?: string;
  respiratoryRate?: string;
  temperature?: string;
  oxygenSaturation?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  generalExam?: string;
  heentExam?: string;
  chestLungsExam?: string;
  heartExam?: string;
  abdomenExam?: string;
  neurologicalExam?: string;
  musculoskeletalExam?: string;
  investigationsLabs?: string;
  assessmentDiagnosis?: string;
  planTreatment?: string;
  referrals?: string;
  additionalNotes?: string;
  clinician?: string;
  pharmacy?: string;
  insurance?: string;
  primaryCareProvider?: string;
  referringPhysicians?: string;
  createdAt: string;
  updatedAt: string;
}

// Create Patient Data types
export interface CreatePatientData {
  title?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    completeAddress: string;
    city: string;
    state: string;
    zipcode: string;
    primaryEmail: string;
    alternativeEmail?: string;
    primaryPhone: string;
    alternativePhone?: string;
    emergencyContactName: string;
    emergencyContactRelationship?: string;
    emergencyContactPhone: string;
    referringSource: string;
    consentForTreatment: string;
    hipaaPrivacyNoticeAcknowledgment: string;
    releaseOfMedicalRecordsConsent: string;
    preferredMethodOfCommunication: string;
  disabilityAccessibilityNeeds?: string;
    careProviderPhone?: string;
    lastFourDigitsSSN?: string;
    languagePreference?: string;
    ethnicityRace?: string;
    primaryCarePhysician?: string;
    insuranceProviderName?: string;
    insurancePolicyNumber?: string;
    insuranceGroupNumber?: string;
    insurancePhoneNumber?: string;
    guarantorResponsibleParty?: string;
    dateOfFirstVisitPlanned?: string;
    interpreterRequired?: string;
    advanceDirectives?: string;
  sendWelcomeEmail?: boolean;
}

// Create Medical Form Data types
export interface CreateMedicalFormData {
  // Patient Goals
  goalMoreEnergy?: boolean;
  goalBetterSexualPerformance?: boolean;
  goalLoseWeight?: boolean;
  goalHairRestoration?: boolean;
  goalImproveMood?: boolean;
  goalLongevity?: boolean;
  goalOther?: boolean;
  goalOtherDescription?: string;

  // Physical measurements
  height?: string;
  weight?: string;
  waist?: string;
  bmi?: string;

  // Medical History
  chronicConditions?: string;
  pastSurgeriesHospitalizations?: string;
  currentMedications?: string;
  allergies?: string;

  // Lifestyle
  sleepHoursPerNight?: string;
  sleepQuality?: string;
  exerciseFrequency?: string;
  dietType?: string;
  alcoholUse?: string;
  tobaccoUse?: string;
  cannabisOtherSubstances?: string;
  cannabisOtherSubstancesList?: string;
  stressLevel?: string;

  // Symptoms
  symptomFatigue?: boolean;
  symptomLowLibido?: boolean;
  symptomMuscleLoss?: boolean;
  symptomWeightGain?: boolean;
  symptomGynecomastia?: boolean;
  symptomBrainFog?: boolean;
  symptomMoodSwings?: boolean;
  symptomPoorSleep?: boolean;
  symptomHairThinning?: boolean;

  // Safety Check
  historyProstateBreastCancer?: boolean;
  historyBloodClotsMIStroke?: boolean;
  currentlyUsingHormonesPeptides?: boolean;
  planningChildrenNext12Months?: boolean;

  // Labs & Uploads
  labSchedulingNeeded?: boolean;
  labUploads?: string;

  // Consent
  consentTelemedicineCare?: boolean;
  consentElectiveOptimizationTreatment?: boolean;
  consentRequiredLabMonitoring?: boolean;
  digitalSignature?: string;
  consentDate?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Patient Management APIs (Admin)
export const patientApi = {
  // Get all patients with pagination and filtering
  getPatients: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'inactive';
  }): Promise<{
    success: boolean;
    message: string;
    data: Patient[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const response = await api.get('/admin/patients', { params });
    return response.data;
  },

  // Get single patient by ID with medical form
  getPatient: async (id: string): Promise<ApiResponse<Patient & { medicalForm?: any }>> => {
    const response = await api.get(`/admin/patients/${id}`);
    return response.data;
  },

  // Create new patient (admin-created with auto-generated password)
  createPatient: async (patientData: CreatePatientData): Promise<ApiResponse<Patient>> => {
    const response = await api.post('/admin/patients', patientData);
    return response.data;
  },

  // Update patient (excluding medical form data)
  updatePatient: async (id: string, patientData: Partial<CreatePatientData>): Promise<ApiResponse<Patient>> => {
    const response = await api.put(`/admin/patients/${id}`, patientData);
    return response.data;
  },

  // Delete patient (soft delete)
  deletePatient: async (id: string): Promise<void> => {
    const response = await api.delete(`/admin/patients/${id}`);
    return response.data;
  },

  // Get patient's medical form
  getMedicalForm: async (patientId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/admin/patients/${patientId}`);
    return { 
      success: response.data.success,
      message: 'Medical form retrieved successfully',
      data: response.data.data.medicalForm 
    };
  },

  // Create medical form for patient
  createMedicalForm: async (patientId: string, formData: CreateMedicalFormData): Promise<ApiResponse<any>> => {
    const response = await api.post(`/admin/patients/${patientId}/medical-form`, formData);
    return response.data;
  },

  // Update medical form for patient
  updateMedicalForm: async (patientId: string, formData: Partial<CreateMedicalFormData>): Promise<ApiResponse<any>> => {
    const response = await api.put(`/admin/patients/${patientId}/medical-form`, formData);
    return response.data;
  }
};

// Doctor Management APIs
export const doctorApi = {
  // Get all doctors
  getDoctors: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    specialty?: string;
  }): Promise<PaginatedResponse<Doctor>> => {
    const response = await api.get('/doctors', { params });
    return response.data;
  },

  // Get single doctor by ID
  getDoctor: async (id: string): Promise<ApiResponse<Doctor>> => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  // Get available doctors for a specific time slot
  getAvailableDoctors: async (params: {
    date: string;
    time: string;
    serviceId?: string;
  }): Promise<ApiResponse<Doctor[]>> => {
    const response = await api.get('/doctors/available', { params });
    return response.data;
  }
};

// Service Management APIs
export const serviceApi = {
  // Get all services with filtering
  getServices: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Service>> => {
    const response = await api.get('/services', { params });
    return response.data;
  },

  // Get single service by ID
  getService: async (id: string): Promise<ApiResponse<Service>> => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Get primary services
  getPrimaryServices: async (): Promise<ApiResponse<{ id: string; name: string; description?: string; category: string; duration: number; basePrice: string; isActive: boolean; createdAt: string; updatedAt: string }[]>> => {
    const response = await api.get('/services/primary');
    return response.data;
  }
};

// Appointment Management APIs
export const appointmentApi = {
  // Get all appointments with filtering
  getAppointments: async (params?: {
    page?: number;
    limit?: number;
    patientId?: string;
    doctorId?: string;
    serviceId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<PaginatedResponse<Appointment>> => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  assignDoctorToAppointment: async (payload: { appointmentId: string; doctorId: string; slotId: string }): Promise<ApiResponse<Appointment>> => {
    const response = await api.post('/appointments/assign-doctor', payload);
    return response.data;
  },

  getAvailableDoctorsForAppointment: async (appointmentId: string): Promise<ApiResponse<Array<{ id: string; firstName: string; lastName: string; specialization: string; licenseNumber: string; slotId: string; slotStartTime: string; slotEndTime: string }>>> => {
    const response = await api.get(`/appointments/available-doctors/${appointmentId}`);
    return response.data;
  },

  // Get unassigned appointments (no doctor and no slot)
  getUnassignedAppointments: async (params?: { page?: number; limit?: number; status?: string }): Promise<PaginatedResponse<Appointment>> => {
    const response = await api.get('/appointments/unassigned', { params });
    return response.data;
  },

  // Get single appointment by ID
  getAppointment: async (id: string): Promise<ApiResponse<Appointment>> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Create new appointment
  createAppointment: async (appointmentData: {
    patientId: string;
    doctorId: string;
    serviceId: string;
    appointmentDate: string;
    appointmentTime: string;
    duration?: number;
    amount?: string;
    patientNotes?: string;
    symptoms?: string;
  }): Promise<ApiResponse<Appointment>> => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Admin create confirmed appointment
  adminCreateConfirmed: async (payload: {
    patientId: string;
    doctorId: string;
    serviceId: string; // medical service
    primaryServiceId: string; // primary service (billing)
    slotId?: string;
    appointmentDate: string; // YYYY-MM-DD
    appointmentTime: string; // HH:MM
    duration: number;
    patientNotes?: string;
  }): Promise<ApiResponse<Appointment>> => {
    const response = await api.post('/appointments/admin/create-confirmed', payload);
    return response.data;
  },

  // Update appointment
  updateAppointment: async (id: string, appointmentData: Partial<Appointment>): Promise<ApiResponse<Appointment>> => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (id: string, reason?: string): Promise<ApiResponse<Appointment>> => {
    const response = await api.patch(`/appointments/${id}/cancel`, { reason });
    return response.data;
  },

  // Delete appointment
  deleteAppointment: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  }
};

// Schedule/Slots APIs
export const scheduleApi = {
  getAvailableSlots: async (params: { doctorId: string; date: string }): Promise<ApiResponse<any>> => {
    const response = await api.get('/schedules/available-slots', { params });
    return response.data;
  }
};

// Working Hours APIs
export const workingHoursApi = {
  // Get all working hours
  getWorkingHours: async (params?: {
    doctorId?: string;
    dayOfWeek?: number;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> => {
    const response = await api.get('/working-hours', { params });
    return response.data;
  },

  // Create working hours
  createWorkingHours: async (data: {
    doctorId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
    breakDuration: number;
    isActive?: boolean;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/working-hours', data);
    return response.data;
  },

  // Create multiple working hours
  createMultipleWorkingHours: async (data: {
    doctorId: string;
    workingHours: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      slotDuration: number;
      breakDuration: number;
      isActive?: boolean;
    }>;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/working-hours/multiple', data);
    return response.data;
  },

  // Update working hours
  updateWorkingHours: async (id: string, data: {
    startTime?: string;
    endTime?: string;
    slotDuration?: number;
    breakDuration?: number;
    isActive?: boolean;
  }): Promise<ApiResponse<any>> => {
    const response = await api.put(`/working-hours/${id}`, data);
    return response.data;
  },

  // Delete working hours
  deleteWorkingHours: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/working-hours/${id}`);
    return response.data;
  },

  // Generate schedules from working hours
  generateSchedules: async (data: {
    doctorId: string;
    startDate: string;
    endDate: string;
    regenerateExisting?: boolean;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/working-hours/generate-schedules', data);
    return response.data;
  }
};

// Schedule Management APIs
export const scheduleManagementApi = {
  // Get all schedules
  getSchedules: async (params?: {
    doctorId?: string;
    startDate?: string;
    endDate?: string;
    isAvailable?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> => {
    const response = await api.get('/schedules', { params });
    return response.data;
  },

  // Create schedule
  createSchedule: async (data: {
    doctorId: string;
    date: string;
    startTime: string;
    endTime: string;
    maxAppointments: number;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/schedules', data);
    return response.data;
  },

  // Create multiple schedules
  createMultipleSchedules: async (data: {
    doctorId: string;
    startDate: string;
    endDate: string;
    workingDays: number[];
    startTime: string;
    endTime: string;
    maxAppointments: number;
    breakTime?: number;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/schedules/multiple', data);
    return response.data;
  },

  // Update schedule
  updateSchedule: async (id: string, data: {
    startTime?: string;
    endTime?: string;
    maxAppointments?: number;
    isAvailable?: boolean;
  }): Promise<ApiResponse<any>> => {
    const response = await api.put(`/schedules/${id}`, data);
    return response.data;
  },

  // Delete schedule
  deleteSchedule: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/schedules/${id}`);
    return response.data;
  },

  // Create slot
  createSlot: async (data: {
    scheduleId: string;
    startTime: string;
    endTime: string;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/schedules/slots', data);
    return response.data;
  },

  // Create multiple slots
  createMultipleSlots: async (data: {
    scheduleId: string;
    slotDuration: number;
    breakTime?: number;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/schedules/slots/multiple', data);
    return response.data;
  },

  // Update slot
  updateSlot: async (id: string, data: {
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
  }): Promise<ApiResponse<any>> => {
    const response = await api.put(`/schedules/slots/${id}`, data);
    return response.data;
  },

  // Delete slot
  deleteSlot: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/schedules/slots/${id}`);
    return response.data;
  }
};

// Appointment Request Management APIs
export const appointmentRequestApi = {
  // Get all appointment requests
  getRequests: async (params?: {
    page?: number;
    limit?: number;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
    search?: string;
  }): Promise<PaginatedResponse<AppointmentRequest>> => {
    const response = await api.get('/appointments/bookings', { params });
    return response.data;
  },

  // Get single request by ID
  getRequest: async (id: string): Promise<ApiResponse<AppointmentRequest>> => {
    const response = await api.get(`/appointments/bookings/${id}`);
    return response.data;
  },

  // Assign doctor to request (convert to appointment)
  assignDoctor: async (requestId: string, doctorId: string, slotId: string): Promise<ApiResponse<Appointment>> => {
    const response = await api.post(`/appointments/bookings/${requestId}/assign`, {
      doctorId,
      slotId
    });
    return response.data;
  },

  // Reject appointment request
  rejectRequest: async (requestId: string, reason?: string): Promise<ApiResponse<AppointmentRequest>> => {
    const response = await api.post(`/appointments/bookings/${requestId}/respond`, { 
      action: 'reject',
      doctorNotes: reason 
    });
    return response.data;
  },

  // Delete appointment request
  deleteRequest: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/appointments/bookings/${id}`);
    return response.data;
  }
};

// Dashboard Statistics APIs
export const dashboardApi = {
  // Get dashboard statistics
  getStats: async (): Promise<ApiResponse<{
    totalPatients: number;
    totalDoctors: number;
    totalAppointments: number;
    pendingRequests: number;
    todayAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
  }>> => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async (limit?: number): Promise<ApiResponse<{
    id: string;
    type: 'appointment_created' | 'appointment_cancelled' | 'patient_registered' | 'request_assigned';
    description: string;
    timestamp: string;
    userId?: string;
    userName?: string;
  }[]>> => {
    const response = await api.get('/admin/dashboard/activities', { params: { limit } });
    return response.data;
  }
};

// Export all APIs
export const adminApi = {
  patient: patientApi,
  doctor: doctorApi,
  service: serviceApi,
  appointment: appointmentApi,
  appointmentRequest: appointmentRequestApi,
  dashboard: dashboardApi,
  schedule: scheduleApi,
  workingHoursApi: workingHoursApi,
  scheduleManagementApi: scheduleManagementApi
};

export default adminApi;
