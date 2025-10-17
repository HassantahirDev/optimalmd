import api from "@/service/api";

export interface Assessment {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentAssessment {
  id: string;
  appointmentId: string;
  assessmentId: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
  assessment?: Assessment;
}

// Assessment CRUD operations
export const fetchAllAssessments = async (): Promise<Assessment[]> => {
  const response = await api.get('/assessments');
  return response.data.data; // Extract data from nested response structure
};

export const fetchAssessmentById = async (id: string): Promise<Assessment> => {
  const response = await api.get(`/assessments/${id}`);
  return response.data.data;
};

export const createAssessment = async (data: { name: string; content: string }): Promise<Assessment> => {
  const response = await api.post('/assessments', data);
  return response.data.data;
};

export const updateAssessment = async (id: string, data: { name?: string; content?: string }): Promise<Assessment> => {
  const response = await api.patch(`/assessments/${id}`, data);
  return response.data.data;
};

export const deleteAssessment = async (id: string): Promise<void> => {
  await api.delete(`/assessments/${id}`);
};

// Appointment Assessment operations
export const createAppointmentAssessment = async (data: {
  appointmentId: string;
  assessmentId: string;
  content?: string;
}): Promise<AppointmentAssessment> => {
  const response = await api.post('/assessments/appointment', data);
  return response.data.data;
};

export const fetchAppointmentAssessments = async (appointmentId: string): Promise<AppointmentAssessment[]> => {
  const response = await api.get(`/assessments/appointment/${appointmentId}`);
  return response.data.data;
};

export const fetchAppointmentAssessmentData = async (appointmentId: string): Promise<Record<string, any>> => {
  const response = await api.get(`/assessments/appointment/${appointmentId}/data`);
  return response.data.data;
};

export const updateAppointmentAssessment = async (
  appointmentId: string,
  assessmentId: string,
  data: { content?: string }
): Promise<AppointmentAssessment> => {
  const response = await api.patch(`/assessments/appointment/${appointmentId}/${assessmentId}`, data);
  return response.data.data;
};

export const deleteAppointmentAssessment = async (appointmentId: string, assessmentId: string): Promise<void> => {
  await api.delete(`/assessments/appointment/${appointmentId}/${assessmentId}`);
};