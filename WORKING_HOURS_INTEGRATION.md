# Working Hours Integration - Testing Guide

## Overview
The new Working Hours system has been integrated into the doctor dashboard, providing a simplified way for doctors to manage their availability and automatically generate appointment schedules.

## What's New

### 1. New Sidebar Tab
- **"Working Hours"** tab added to the doctor dashboard sidebar
- Located between "Dashboard" and "My Schedule" for easy access
- Uses Settings icon with gray background to match the theme

### 2. Working Hours Management Component
- **Set availability** for each day of the week
- **Configure slot duration** (default: 20 minutes)
- **Set break duration** (default: 10 minutes)
- **Toggle active/inactive** for each day
- **Real-time slot calculation** showing how many slots per day
- **Bulk schedule generation** for date ranges

### 3. Google Calendar Integration
- **Automatic sync** when schedules are generated
- **Working hours events** created in Google Calendar
- **Color-coded events** (green for working hours)

## Testing Steps

### Prerequisites
1. **Backend server** running on `http://localhost:3000`
2. **Database migration** applied (WorkingHours table created)
3. **Google Calendar credentials** configured (optional)

### Step 1: Start the Frontend
```bash
cd optimalmd
npm run dev
```

### Step 2: Access Doctor Dashboard
1. Navigate to the doctor dashboard
2. Look for the new **"Working Hours"** tab in the sidebar
3. Click on it to access the working hours management interface

### Step 3: Test Working Hours Management
1. **Set Working Hours:**
   - Toggle days to active/inactive
   - Set start and end times for each day
   - Adjust slot and break durations
   - Save changes

2. **Generate Schedules:**
   - Select a date range
   - Click "Generate Schedules"
   - Check console for success messages

### Step 4: Test API Integration (Optional)
1. Go to **"Test Working Hours"** tab in the sidebar
2. Enter a valid doctor ID
3. Click "Test Working Hours API" to verify backend integration
4. Click "Test Google Calendar" to verify calendar integration

## Features

### Working Hours Interface
- **Day-by-day management** with toggle switches
- **Inline editing** with time pickers and number inputs
- **Real-time validation** and error handling
- **Visual feedback** with toast notifications
- **Responsive design** that works on all screen sizes

### Schedule Generation
- **Date range selection** with calendar inputs
- **Automatic slot creation** based on working hours
- **Conflict detection** and handling
- **Google Calendar sync** with progress feedback

### API Integration
- **RESTful endpoints** for all operations
- **Error handling** with user-friendly messages
- **Loading states** and progress indicators
- **Token-based authentication** using existing auth system

## API Endpoints Used

### Working Hours Management
- `POST /working-hours` - Create working hours
- `GET /working-hours?doctorId={id}` - Get working hours
- `PUT /working-hours/{id}` - Update working hours
- `DELETE /working-hours/{id}` - Delete working hours

### Schedule Generation
- `POST /working-hours/generate-schedules` - Generate schedules
- `GET /google-calendar/health` - Check Google Calendar status

## Troubleshooting

### Common Issues
1. **"Doctor not found" error:**
   - Ensure you have a valid doctor ID
   - Check if the doctor exists in the database

2. **"Google Calendar not configured" error:**
   - This is normal if Google Calendar credentials aren't set up
   - The system will still work without calendar sync

3. **"Network error" or "Connection refused":**
   - Ensure the backend server is running on port 3000
   - Check if the API base URL is correct

### Debug Mode
- Open browser developer tools
- Check the Console tab for detailed error messages
- Use the "Test Working Hours" tab to verify API connectivity

## Next Steps

1. **Test the complete workflow:**
   - Set working hours for multiple days
   - Generate schedules for a week
   - Verify slots are created correctly

2. **Test with real data:**
   - Create a doctor account
   - Set up working hours
   - Generate schedules
   - Book appointments (if appointment system is ready)

3. **Customize as needed:**
   - Adjust slot and break durations
   - Modify the UI styling
   - Add additional validation rules

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify the backend server is running and accessible
3. Ensure all required environment variables are set
4. Check the database migration was applied successfully

The integration follows the existing project theme and patterns, so it should feel natural and consistent with the rest of the application.
