/**
 * Format time string to 12-hour format with AM/PM
 * @param time - Time string in HH:MM format (24-hour)
 * @returns Formatted time string in 12-hour format (e.g., "2:30 PM")
 */
export const formatTime = (time: string): string => {
  if (!time) return "";
  
  try {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    
    if (isNaN(hour) || hour < 0 || hour > 23) {
      return time; // Return original if invalid
    }
    
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    
    return `${displayHour}:${minutes} ${ampm}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return time; // Return original if error
  }
};

/**
 * Format time range to 12-hour format with AM/PM
 * @param startTime - Start time string in HH:MM format (24-hour)
 * @param endTime - End time string in HH:MM format (24-hour)
 * @returns Formatted time range string (e.g., "2:30 PM - 3:00 PM")
 */
export const formatTimeRange = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return "";
  
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

