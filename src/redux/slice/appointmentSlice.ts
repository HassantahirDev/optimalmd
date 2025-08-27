import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchDoctorsApi,
  fetchDoctorServicesApi,
  fetchAvailableSlotsApi,
  fetchDoctorAvailabilityApi,
  bookAppointmentApi,
  fetchDoctorWithServicesApi,
  fetchPatientAppointmentsApi,
  cancelAppointmentApi,
  rescheduleAppointmentApi,
  Doctor,
  Service,
  PrimaryService,
  AvailableSlot,
  DoctorService,
  CreateAppointmentDto,
  PatientAppointment
} from '../api/appointmentApi';

// Types
export interface AppointmentState {
  doctors: Doctor[];
  services: Service[];
  primaryServices: PrimaryService[];
  availableSlots: AvailableSlot[];
  selectedDoctor: Doctor | null;
  selectedService: Service | null;
  selectedPrimaryService: PrimaryService | null;
  selectedSlot: AvailableSlot | null;
  selectedDate: string;
  selectedTime: string;
  loading: boolean;
  error: string | null;
  bookingLoading: boolean;
  bookingError: string | null;
  bookingSuccess: boolean;
  // Patient appointments
  patientAppointments: PatientAppointment[];
  appointmentsLoading: boolean;
  appointmentsError: string | null;
  // Cancel and reschedule
  cancelLoading: boolean;
  cancelError: string | null;
  cancelSuccess: boolean;
  rescheduleLoading: boolean;
  rescheduleError: string | null;
  rescheduleSuccess: boolean;
}

const initialState: AppointmentState = {
  doctors: [],
  services: [],
  primaryServices: [],
  availableSlots: [],
  selectedDoctor: null,
  selectedService: null,
  selectedPrimaryService: null,
  selectedSlot: null,
  selectedDate: '',
  selectedTime: '',
  loading: false,
  error: null,
  bookingLoading: false,
  bookingError: null,
  bookingSuccess: false,
  // Patient appointments
  patientAppointments: [],
  appointmentsLoading: false,
  appointmentsError: null,
  // Cancel and reschedule
  cancelLoading: false,
  cancelError: null,
  cancelSuccess: false,
  rescheduleLoading: false,
  rescheduleError: null,
  rescheduleSuccess: false,
};

// Async thunks
export const fetchDoctors = createAsyncThunk<
  Doctor[],
  void,
  { rejectValue: string }
>('appointment/fetchDoctors', async (_, thunkAPI) => {
  try {
    console.log("Fetching doctors...");
    const doctors = await fetchDoctorsApi();
    console.log("Doctors fetched successfully:", doctors);
    return doctors;
  } catch (err: any) {
    console.error("Error in fetchDoctors thunk:", err);
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to fetch doctors'
    );
  }
});

export const fetchDoctorServices = createAsyncThunk<
  Service[],
  string,
  { rejectValue: string }
>('appointment/fetchDoctorServices', async (doctorId, thunkAPI) => {
  try {
    console.log("Fetching services for doctor:", doctorId);
    const services = await fetchDoctorServicesApi(doctorId);
    console.log("Services fetched successfully:", services);
    return services;
  } catch (err: any) {
    console.error("Error in fetchDoctorServices thunk:", err);
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to fetch doctor services'
    );
  }
});

export const fetchAvailableSlots = createAsyncThunk<
  AvailableSlot[],
  { doctorId: string; date: string; serviceId?: string },
  { rejectValue: string }
>('appointment/fetchAvailableSlots', async ({ doctorId, date, serviceId }, thunkAPI) => {
  try {
    console.log("Fetching available slots for doctor:", doctorId, "date:", date, "service:", serviceId);
    const slots = await fetchAvailableSlotsApi(doctorId, date, serviceId);
    console.log("Available slots fetched successfully:", slots);
    return slots;
  } catch (err: any) {
    console.error("Error in fetchAvailableSlots thunk:", err);
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to fetch available slots'
    );
  }
});

export const fetchPrimaryServices = createAsyncThunk<
  PrimaryService[],
  void,
  { rejectValue: string }
>('appointment/fetchPrimaryServices', async (_, thunkAPI) => {
  try {
    const { fetchPrimaryServicesApi } = await import('../api/appointmentApi');
    const services = await fetchPrimaryServicesApi();
    return services;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to fetch primary services'
    );
  }
});

export const cancelAppointment = createAsyncThunk<
  any,
  { appointmentId: string; cancellationReason: string },
  { rejectValue: string }
>('appointment/cancelAppointment', async ({ appointmentId, cancellationReason }, thunkAPI) => {
  try {
    console.log("Cancelling appointment:", appointmentId);
    const result = await cancelAppointmentApi(appointmentId, cancellationReason);
    console.log("Appointment cancelled successfully:", result);
    return result;
  } catch (err: any) {
    console.error("Error in cancelAppointment thunk:", err);
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to cancel appointment'
    );
  }
});

export const rescheduleAppointment = createAsyncThunk<
  any,
  { appointmentId: string; newSlotId: string; reason?: string },
  { rejectValue: string }
>('appointment/rescheduleAppointment', async ({ appointmentId, newSlotId, reason }, thunkAPI) => {
  try {
    console.log("Rescheduling appointment:", appointmentId, "to slot:", newSlotId);
    const result = await rescheduleAppointmentApi(appointmentId, newSlotId, reason);
    console.log("Appointment rescheduled successfully:", result);
    return result;
  } catch (err: any) {
    console.error("Error in rescheduleAppointment thunk:", err);
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to reschedule appointment'
    );
  }
});

export const fetchPatientAppointments = createAsyncThunk<
  PatientAppointment[],
  { patientId: string; query?: { status?: string; startDate?: string; endDate?: string; page?: number; limit?: number } },
  { rejectValue: string }
>('appointment/fetchPatientAppointments', async ({ patientId, query }, thunkAPI) => {
  try {
    console.log("Fetching patient appointments for:", patientId, "query:", query);
    const response = await fetchPatientAppointmentsApi(patientId, query);
    console.log("Patient appointments fetched successfully:", response);
    return response.data || [];
  } catch (err: any) {
    console.error("Error in fetchPatientAppointments thunk:", err);
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to fetch patient appointments'
    );
  }
});

export const bookAppointment = createAsyncThunk<
  any,
  CreateAppointmentDto,
  { rejectValue: string }
>('appointment/bookAppointment', async (appointmentData, thunkAPI) => {
  try {
    console.log("Booking appointment with data:", appointmentData);
    const result = await bookAppointmentApi(appointmentData);
    console.log("Appointment booked successfully:", result);
    return result;
  } catch (err: any) {
    console.error("Error in bookAppointment thunk:", err);
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to book appointment'
    );
  }
});

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setSelectedDoctor: (state, action: PayloadAction<Doctor | null>) => {
      console.log("Setting selected doctor:", action.payload);
      state.selectedDoctor = action.payload;
      state.selectedService = null;
      state.selectedSlot = null;
      state.services = [];
      state.availableSlots = [];
    },
    setSelectedService: (state, action: PayloadAction<Service | null>) => {
      console.log("Setting selected service:", action.payload);
      state.selectedService = action.payload;
      state.selectedSlot = null;
      state.availableSlots = [];
    },
    setSelectedPrimaryService: (state, action: PayloadAction<PrimaryService | null>) => {
      console.log("Setting selected primary service:", action.payload);
      state.selectedPrimaryService = action.payload;
    },
    setSelectedSlot: (state, action: PayloadAction<AvailableSlot | null>) => {
      console.log("Setting selected slot:", action.payload);
      state.selectedSlot = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      console.log("Setting selected date:", action.payload);
      state.selectedDate = action.payload;
      state.selectedSlot = null;
      state.availableSlots = [];
    },
    setSelectedTime: (state, action: PayloadAction<string>) => {
      console.log("Setting selected time:", action.payload);
      state.selectedTime = action.payload;
    },
    clearBookingState: (state) => {
      console.log("Clearing booking state");
      state.bookingLoading = false;
      state.bookingError = null;
      state.bookingSuccess = false;
    },
    clearCancelState: (state) => {
      console.log("Clearing cancel state");
      state.cancelLoading = false;
      state.cancelError = null;
      state.cancelSuccess = false;
    },
    clearRescheduleState: (state) => {
      console.log("Clearing reschedule state");
      state.rescheduleLoading = false;
      state.rescheduleError = null;
      state.rescheduleSuccess = false;
    },
    resetForm: (state) => {
      console.log("Resetting form");
      state.selectedDoctor = null;
      state.selectedService = null;
      state.selectedPrimaryService = null;
      state.selectedSlot = null;
      state.selectedDate = '';
      state.selectedTime = '';
      state.services = [];
      state.availableSlots = [];
      state.bookingSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch doctors
      .addCase(fetchDoctors.pending, (state) => {
        console.log("Fetch doctors pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        console.log("Fetch doctors fulfilled:", action.payload);
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        console.log("Fetch doctors rejected:", action.payload);
        state.loading = false;
        state.error = action.payload || 'Failed to fetch doctors';
      })
      // Fetch doctor services
      .addCase(fetchDoctorServices.pending, (state) => {
        console.log("Fetch doctor services pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorServices.fulfilled, (state, action) => {
        console.log("Fetch doctor services fulfilled:", action.payload);
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchDoctorServices.rejected, (state, action) => {
        console.log("Fetch doctor services rejected:", action.payload);
        state.loading = false;
        state.error = action.payload || 'Failed to fetch doctor services';
      })
      // Fetch available slots
      .addCase(fetchAvailableSlots.pending, (state) => {
        console.log("Fetch available slots pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        console.log("Fetch available slots fulfilled:", action.payload);
        state.loading = false;
        state.availableSlots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        console.log("Fetch available slots rejected:", action.payload);
        state.loading = false;
        state.error = action.payload || 'Failed to fetch available slots';
      })
      // Fetch primary services
      .addCase(fetchPrimaryServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrimaryServices.fulfilled, (state, action) => {
        state.loading = false;
        state.primaryServices = action.payload;
      })
      .addCase(fetchPrimaryServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch primary services';
      })
      // Book appointment
      .addCase(bookAppointment.pending, (state) => {
        console.log("Book appointment pending");
        state.bookingLoading = true;
        state.bookingError = null;
        state.bookingSuccess = false;
      })
      .addCase(bookAppointment.fulfilled, (state) => {
        console.log("Book appointment fulfilled");
        state.bookingLoading = false;
        state.bookingSuccess = true;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        console.log("Book appointment rejected:", action.payload);
        state.bookingLoading = false;
        state.bookingError = action.payload || 'Failed to book appointment';
      })
      // Fetch patient appointments
      .addCase(fetchPatientAppointments.pending, (state) => {
        console.log("Fetch patient appointments pending");
        state.appointmentsLoading = true;
        state.appointmentsError = null;
      })
      .addCase(fetchPatientAppointments.fulfilled, (state, action) => {
        console.log("Fetch patient appointments fulfilled:", action.payload);
        state.appointmentsLoading = false;
        state.patientAppointments = action.payload;
      })
      .addCase(fetchPatientAppointments.rejected, (state, action) => {
        console.log("Fetch patient appointments rejected:", action.payload);
        state.appointmentsLoading = false;
        state.appointmentsError = action.payload || 'Failed to fetch patient appointments';
      })
      // Cancel appointment
      .addCase(cancelAppointment.pending, (state) => {
        console.log("Cancel appointment pending");
        state.cancelLoading = true;
        state.cancelError = null;
        state.cancelSuccess = false;
      })
      .addCase(cancelAppointment.fulfilled, (state) => {
        console.log("Cancel appointment fulfilled");
        state.cancelLoading = false;
        state.cancelSuccess = true;
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        console.log("Cancel appointment rejected:", action.payload);
        state.cancelLoading = false;
        state.cancelError = action.payload || 'Failed to cancel appointment';
      })
      // Reschedule appointment
      .addCase(rescheduleAppointment.pending, (state) => {
        console.log("Reschedule appointment pending");
        state.rescheduleLoading = true;
        state.rescheduleError = null;
        state.rescheduleSuccess = false;
      })
      .addCase(rescheduleAppointment.fulfilled, (state) => {
        console.log("Reschedule appointment fulfilled");
        state.rescheduleLoading = false;
        state.rescheduleSuccess = true;
      })
      .addCase(rescheduleAppointment.rejected, (state, action) => {
        console.log("Reschedule appointment rejected:", action.payload);
        state.rescheduleLoading = false;
        state.rescheduleError = action.payload || 'Failed to reschedule appointment';
      });
  },
});

export const {
  setSelectedDoctor,
  setSelectedService,
  setSelectedPrimaryService,
  setSelectedSlot,
  setSelectedDate,
  setSelectedTime,
  clearBookingState,
  clearCancelState,
  clearRescheduleState,
  resetForm,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
