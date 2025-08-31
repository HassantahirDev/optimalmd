import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createSchedule } from "../api/schedules";
import { createMultipleSchedules } from "../api/schedules";
import { createSlot } from "../api/schedules";
import { createMultipleSlots } from "../api/schedules";
import { getAvailableSlots } from "../api/schedules";

export const createScheduleThunk = createAsyncThunk(
  "schedules/createSchedule",
  async (
    payload: {
      doctorId: string;
      date: string;
      startTime: string;
      endTime: string;
      maxAppointments: number;
    },
    { rejectWithValue }
  ) => {
    try {
      return await createSchedule(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create multiple schedules
export const createMultipleSchedulesThunk = createAsyncThunk(
  "schedules/createMultipleSchedules",
  async (
    payload: {
      doctorId: string;
      startDate: string;
      endDate: string;
      workingDays: number[];
      startTime: string;
      endTime: string;
      maxAppointments: number;
      breakTime?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      return await createMultipleSchedules(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create single slot
export const createSlotThunk = createAsyncThunk(
  "schedules/createSlot",
  async (
    payload: {
      scheduleId: string;
      startTime: string;
      endTime: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await createSlot(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create multiple slots
export const createMultipleSlotsThunk = createAsyncThunk(
  "schedules/createMultipleSlots",
  async (
    payload: {
      scheduleId: string;
      slotDuration: number;
      breakTime?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      return await createMultipleSlots(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get available slots
export const getAvailableSlotsThunk = createAsyncThunk(
  "schedules/getAvailableSlots",
  async (
    params: { doctorId: string; date: string; serviceId?: string },
    { rejectWithValue }
  ) => {
    try {
      return await getAvailableSlots(params);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

type SchedulesState = {
  loading: boolean;
  error: string | null;
  schedules: any[];
  slots: any[];
  availableSlots: any[];
};

const initialState: SchedulesState = {
  loading: false,
  error: null,
  schedules: [],
  slots: [],
  availableSlots: [],
};

const schedulesSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create schedule
      .addCase(createScheduleThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createScheduleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules.push(action.payload.data);
      })
      .addCase(createScheduleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create multiple schedules
      .addCase(createMultipleSchedulesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = [...state.schedules, ...action.payload.data];
      })

      // Create slot
      .addCase(createSlotThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.slots.push(action.payload.data);
      })

      // Create multiple slots
      .addCase(createMultipleSlotsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = [...state.slots, ...action.payload.data];
      })

      // Get available slots
      .addCase(getAvailableSlotsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = action.payload.data;
      });
  },
});

export const { clearError } = schedulesSlice.actions;
export default schedulesSlice.reducer;
