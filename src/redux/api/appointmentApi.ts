import api from "@/service/api";

// Types for the appointment flow
export interface Doctor {
  id: string;
  email: string;
  title: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  completeAddress: string;
  city: string;
  state: string;
  zipcode: string;
  alternativeEmail: string | null;
  primaryPhone: string;
  alternativePhone: string | null;
  licenseNumber: string;
  specialization: string;
  qualifications: string[];
  experience: number;
  bio: string | null;
  isAvailable: boolean;
  consultationFee: string;
  workingHours: any;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  duration: number;
  basePrice: string;
  doctorId?: string; // Made optional for global services
}

export interface PrimaryService {
  id: string;
  name: string;
  description: string | null;
  category: string;
  duration: number;
  basePrice: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AvailableSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  schedule: {
    date: string;
  };
}

export interface DoctorService {
  id: string;
  doctorId: string;
  serviceId: string;
  price: string;
  isAvailable: boolean;
  service: Service;
}

export interface CreateAppointmentDto {
  patientId: string;
  doctorId: string;
  serviceId: string;
  primaryServiceId: string;
  slotId: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  patientNotes?: string;
  symptoms?: string;
  amount: string;
}

export interface PatientAppointment {
  id: string;
  patientId: string;
  doctorId: string;
  serviceId: string;
  slotId: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  amount: string;
  status: string;
  patientNotes?: string;
  symptoms?: string;
  createdAt: string;
  updatedAt: string;
  doctor?: {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    specialization: string;
  };
  service?: {
    id: string;
    name: string;
    basePrice: string;
  };
  slot?: {
    id: string;
    startTime: string;
    endTime: string;
  };
}
export interface RescheduleAppointmentDto {
  newSlotId: string;
  newAppointmentDate: string;
  newAppointmentTime: string;
  reason?: string; // optional
}

// Fetch all available doctors
export const fetchDoctorsApi = async (): Promise<Doctor[]> => {
  try {
    const response = await api.get("doctors");
    console.log("Doctors API response:", response.data);
    // The response structure is response.data.data (array of doctors)
    return response.data.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

// Fetch services by doctor
export const fetchDoctorServicesApi = async (
  doctorId: string
): Promise<Service[]> => {
  try {
    const response = await api.get(`services/doctor/${doctorId}`);
    console.log("Doctor services API response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching doctor services:", error);
    throw error;
  }
};

// Fetch available slots for a doctor on a specific date
// Two-step process: 1. Get schedules, 2. Get slots from schedules
export const fetchAvailableSlotsApi = async (
  doctorId: string,
  date: string,
  serviceId?: string
): Promise<AvailableSlot[]> => {
  try {
    // Step 1: Get doctor availability and schedules
    const params = new URLSearchParams({ date });
    if (serviceId) params.append("serviceId", serviceId);

    const availabilityResponse = await api.get(
      `doctors/${doctorId}/availability?${params}`
    );
    console.log("Doctor availability API response:", availabilityResponse.data);

    if (availabilityResponse.data.success && availabilityResponse.data.data) {
      const { availableSlots, schedules } = availabilityResponse.data.data;

      // If there are already available slots, return them
      if (
        availableSlots &&
        Array.isArray(availableSlots) &&
        availableSlots.length > 0
      ) {
        return availableSlots.map((slot: any) => ({
          id: slot.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: slot.isAvailable,
          schedule: {
            date: slot.schedule?.date || date,
          },
        }));
      }

      // If schedules exist but no slots, get slots from the schedule
      if (schedules && Array.isArray(schedules) && schedules.length > 0) {
        const schedule = schedules[0]; // Take the first schedule for the date
        const scheduleId = schedule.id;

        console.log("Found schedule ID:", scheduleId, "- Fetching slots...");

        // Step 2: Get slots from the schedule
        const slotsResponse = await api.get(`schedules/slots/multiple`, {
          params: { scheduleId },
        });

        console.log("Slots API response:", slotsResponse.data);

        if (slotsResponse.data.success && slotsResponse.data.data) {
          const slots = slotsResponse.data.data;

          return slots.map((slot: any) => ({
            id: slot.id,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: slot.isAvailable,
            schedule: {
              date: schedule.date,
            },
          }));
        }
      }

      // If no slots found, return empty array
      console.log("No schedules or slots found for the selected date");
      return [];
    }

    // Fallback to empty array if structure is unexpected
    console.warn(
      "Unexpected response structure for doctor availability:",
      availabilityResponse.data
    );
    return [];
  } catch (error) {
    console.error("Error fetching available slots:", error);
    throw error;
  }
};

// Get doctor availability for a specific date
export const fetchDoctorAvailabilityApi = async (
  doctorId: string,
  date: string,
  serviceId?: string
): Promise<{
  doctor: {
    id: string;
    specialization: string;
    consultationFee: string;
    workingHours: any;
    services: DoctorService[];
  };
  schedules: any[];
  availableSlots: AvailableSlot[];
}> => {
  try {
    const params = new URLSearchParams({ date });
    if (serviceId) params.append("serviceId", serviceId);

    const response = await api.get(
      `doctors/${doctorId}/availability?${params}`
    );
    console.log("Doctor availability API response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching doctor availability:", error);
    throw error;
  }
};

// Book an appointment
export const bookAppointmentApi = async (
  appointmentData: CreateAppointmentDto
): Promise<any> => {
  try {
    const response = await api.post("appointments", appointmentData);
    console.log("Book appointment API response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
};

// Get doctor with services and pricing
export const fetchDoctorWithServicesApi = async (
  doctorId: string
): Promise<{
  doctor: Doctor;
  services: DoctorService[];
}> => {
  try {
    const response = await api.get(`doctors/${doctorId}/services`);
    console.log("Doctor with services API response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching doctor with services:", error);
    throw error;
  }
};

// Get primary services
export const fetchPrimaryServicesApi = async (): Promise<PrimaryService[]> => {
  try {
    const response = await api.get(`services/primary`);
    console.log("Primary services API response:", response.data);
    // Expecting response.data.data to be an array
    return response.data.data;
  } catch (error) {
    console.error("Error fetching primary services:", error);
    throw error;
  }
};

// Get patient appointments
export const fetchPatientAppointmentsApi = async (
  patientId: string,
  query?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
): Promise<any> => {
  try {
    const params = new URLSearchParams();
    if (query?.status) params.append("status", query.status);
    if (query?.startDate) params.append("startDate", query.startDate);
    if (query?.endDate) params.append("endDate", query.endDate);
    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());

    const response = await api.get(
      `appointments/patient/${patientId}?${params}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    throw error;
  }
};

// Cancel appointment
export const cancelAppointmentApi = async (
  appointmentId: string,
  cancellationReason: string
): Promise<any> => {
  try {
    const response = await api.patch(`appointments/${appointmentId}/cancel`, {
      cancellationReason,
    });
    console.log("Cancel appointment API response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    throw error;
  }
};

// Reschedule appointment
export const rescheduleAppointmentApi = async (
  appointmentId: string,
  newSlotId: string,
  reason?: string
): Promise<any> => {
  try {
    const response = await api.patch(`appointments/${appointmentId}/reschedule`, {
      newSlotId,
      reason,
    });
    console.log("Reschedule appointment API response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    throw error;
  }
};

// Fetch global services (independent of doctors)
export const fetchGlobalServicesApi = async (): Promise<Service[]> => {
  try {
    const response = await api.get("services");
    console.log("Global services API response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching global services:", error);
    throw error;
  }
};

// Fetch global slots (from all doctors)
export const fetchGlobalSlotsApi = async (date: string): Promise<AvailableSlot[]> => {
  try {
    const response = await api.get(`appointments/slots/global?date=${date}`);
    console.log("Global slots API response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching global slots:", error);
    throw error;
  }
};
