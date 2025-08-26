# Appointment Booking System Setup

## Overview

The appointment booking system has been successfully integrated into the `BookAppointment.tsx` component with full Redux state management and API integration.

## Features

- **Doctor Selection**: Dynamic dropdown populated from the backend API
- **Service Selection**: Services filtered by selected doctor
- **Date Picker**: Date selection with validation (no past dates)
- **Time Slot Selection**: Available time slots based on doctor, service, and date
- **Form Validation**: Complete form validation before submission
- **Loading States**: Loading indicators for all API calls
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Success Feedback**: Success messages and form reset after booking
- **Authentication Check**: Ensures user is logged in before booking

## API Integration

The system integrates with the following backend endpoints:

- `GET /api/doctors` - Fetch all available doctors
- `GET /api/services/doctor/{doctorId}` - Fetch services by doctor
- `GET /api/doctors/{doctorId}/availability` - Fetch available time slots
- `POST /api/appointments` - Book an appointment

## Redux State Management

### Appointment Slice (`appointmentSlice.ts`)

The appointment state is managed through Redux with the following features:

- **State**: Doctors, services, available slots, selections, loading states
- **Actions**: Set selections, reset form, clear booking state
- **Async Thunks**: API calls for fetching data and booking appointments

### State Structure

```typescript
interface AppointmentState {
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
}
```

## Component Flow

1. **Component Mount**: Automatically fetches available doctors
2. **Doctor Selection**: When a doctor is selected, fetches their services
3. **Service Selection**: When a service is selected, enables date picker
4. **Date Selection**: When a date is selected, fetches available time slots
5. **Time Selection**: User selects from available time slots
6. **Booking**: Form validation and appointment creation

## Usage

### Prerequisites

- User must be authenticated (logged in)
- Backend API must be running on `http://localhost:3000`
- User must have a valid JWT token stored in localStorage

### Component Props

```typescript
interface BookAppointmentProps {
  patientName?: string; // Optional patient name for display
}
```

### Example Usage

```tsx
import BookAppointment from "@/components/BookAppointment";

// In your component
<BookAppointment patientName="John Doe" />
```

## Error Handling

The system handles various error scenarios:

- **Network Errors**: API call failures
- **Validation Errors**: Missing required fields
- **Authentication Errors**: User not logged in
- **Business Logic Errors**: No available slots, conflicts, etc.

## Loading States

- **Initial Loading**: When fetching doctors
- **Service Loading**: When fetching doctor services
- **Slot Loading**: When fetching available time slots
- **Booking Loading**: When creating appointment

## Form Validation

The form validates:

- User authentication status
- Doctor selection
- Service selection
- Date selection (no past dates)
- Time slot selection
- All required fields completion

## Success Flow

1. Appointment data is validated
2. API call is made to create appointment
3. Success message is displayed
4. Form is reset to initial state
5. User can book another appointment

## Dependencies

- `@reduxjs/toolkit` - Redux state management
- `react-redux` - React Redux bindings
- `axios` - HTTP client for API calls
- `react-toastify` - Toast notifications
- `lucide-react` - Icons

## Configuration

### API Base URL

The API base URL is configured in `src/service/api.ts`:

```typescript
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});
```

### Authentication

JWT tokens are automatically included in API requests through axios interceptors.

## Troubleshooting

### Common Issues

1. **No doctors displayed**: Check if backend API is running and accessible
2. **Authentication errors**: Ensure user is logged in and token is valid
3. **No time slots**: Check if selected date has available slots
4. **Booking failures**: Verify all required fields are filled

### Debug Steps

1. Check browser console for errors
2. Verify Redux state in Redux DevTools
3. Check network tab for API call failures
4. Verify authentication token in localStorage

## Future Enhancements

- **Recurring Appointments**: Support for recurring appointment patterns
- **Appointment Management**: View, edit, and cancel existing appointments
- **Notifications**: Email/SMS reminders for appointments
- **Calendar Integration**: Sync with external calendar systems
- **Payment Integration**: Online payment processing
- **Video Consultations**: Support for virtual appointments
