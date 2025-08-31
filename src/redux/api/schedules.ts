import api from "@/service/api";

// Create a single schedule
export async function createSchedule(data: {
  doctorId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  maxAppointments: number;
}) {
  const res = await api.post("/schedules", data);
  return res.data;
}

// Create multiple schedules
export async function createMultipleSchedules(data: {
  doctorId: string;
  startDate: string;
  endDate: string;
  workingDays: number[];
  startTime: string;
  endTime: string;
  maxAppointments: number;
  breakTime?: number;
}) {
  const res = await api.post("/schedules/multiple", data);
  return res.data;
}

// Create a single slot
export async function createSlot(data: {
  scheduleId: string;
  startTime: string;
  endTime: string;
}) {
  const res = await api.post("/schedules/slots", data);
  return res.data;
}

// Create multiple slots
export async function createMultipleSlots(data: {
  scheduleId: string;
  slotDuration: number;
  breakTime?: number;
}) {
  const res = await api.post("/schedules/slots/multiple", data);
  return res.data;
}

// Get available slots
export async function getAvailableSlots(params: {
  doctorId: string;
  date: string; // YYYY-MM-DD
  serviceId?: string;
}) {
  const res = await api.get("/schedules/available-slots", { params });
  return res.data;
}
