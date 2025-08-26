import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchDoctorsApi,
  fetchDoctorServicesApi,
  fetchAvailableSlotsApi,
  fetchDoctorAvailabilityApi,
  bookAppointmentApi,
  fetchDoctorWithServicesApi,
  fetchPatientAppointmentsApi,
  Doctor,
  Service,
  AvailableSlot,
  DoctorService,
  CreateAppointmentDto,
  PatientAppointment
} from '../api/appointmentApi';

// Types
export interface AppointmentState {
  doctors: Doctor[];
  services: Service[];
  availableSlots: AvailableSlot[];
  selectedDoctor: Doctor | null;
  selectedService: Service | null;
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
}

const initialState: AppointmentState = {
  doctors: [],
  services: [],
  availableSlots: [],
  selectedDoctor: null,
  selectedService: null,
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
    resetForm: (state) => {
      console.log("Resetting form");
      state.selectedDoctor = null;
      state.selectedService = null;
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
      });
  },
});

export const {
  setSelectedDoctor,
  setSelectedService,
  setSelectedSlot,
  setSelectedDate,
  setSelectedTime,
  clearBookingState,
  resetForm,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
