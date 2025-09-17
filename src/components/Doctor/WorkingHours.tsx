import React, { useState, useEffect } from "react";
import { Clock, Calendar, Plus, Edit, Trash2, Save, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import api from "@/service/api";

interface WorkingHours {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  breakDuration: number;
  isActive: boolean;
}

interface WorkingHoursProps {
  doctorId?: string;
}

const WorkingHours: React.FC<WorkingHoursProps> = ({ doctorId: propDoctorId }) => {
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateDateRange, setGenerateDateRange] = useState({
    startDate: "",
    endDate: ""
  });

  // Get doctor ID from props or localStorage
  // For testing, use the known doctor ID from the database
  const doctorId = propDoctorId || localStorage.getItem("userId") || localStorage.getItem("doctorId") || "783dc7c6-11a2-4262-94f4-4dfe5ce05340";
  
  console.log("WorkingHours - doctorId:", doctorId);
  console.log("WorkingHours - localStorage userId:", localStorage.getItem("userId"));
  console.log("WorkingHours - localStorage doctorId:", localStorage.getItem("doctorId"));
  console.log("WorkingHours - All localStorage keys:", Object.keys(localStorage));
  console.log("WorkingHours - All localStorage values:", Object.fromEntries(Object.entries(localStorage)));

  const dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  const dayOptions = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" }
  ];

  // Initialize working hours for all days
  useEffect(() => {
    const initializeWorkingHours = () => {
      const initialHours: WorkingHours[] = dayOptions.map(day => ({
        dayOfWeek: day.value,
        startTime: "08:00",
        endTime: "16:00",
        slotDuration: 20,
        breakDuration: 10,
        isActive: false
      }));
      setWorkingHours(initialHours);
    };

    initializeWorkingHours();
    if (doctorId) {
      fetchWorkingHours();
    }
  }, [doctorId]);

  const fetchWorkingHours = async () => {
    if (!doctorId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/working-hours?doctorId=${doctorId}`);
      const existingHours = response.data.data || [];
      
      // Create initial hours for all days
      const initialHours: WorkingHours[] = dayOptions.map(day => ({
        dayOfWeek: day.value,
        startTime: "08:00",
        endTime: "16:00",
        slotDuration: 20,
        breakDuration: 10,
        isActive: false
      }));
      
      // Merge with existing hours
      const mergedHours = initialHours.map(hour => {
        const existing = existingHours.find((eh: WorkingHours) => eh.dayOfWeek === hour.dayOfWeek);
        return existing || hour;
      });
      
      setWorkingHours(mergedHours);
    } catch (error) {
      console.error("Error fetching working hours:", error);
      toast.error("Failed to fetch working hours");
    } finally {
      setLoading(false);
    }
  };

  const saveWorkingHours = async (hours: WorkingHours) => {
    if (!doctorId) {
      toast.error("Doctor ID is required");
      return;
    }

    try {
      console.log("Saving working hours:", hours);
      
      if (hours.id && !hours.id.startsWith('temp-')) {
        // Update existing
        const response = await api.put(`/working-hours/${hours.id}`, {
          startTime: hours.startTime,
          endTime: hours.endTime,
          slotDuration: hours.slotDuration,
          breakDuration: hours.breakDuration,
          isActive: hours.isActive
        });
        console.log("Update response:", response.data);
        toast.success("Working hours updated successfully");
      } else {
        // Create new
        const response = await api.post("/working-hours", {
          doctorId,
          dayOfWeek: hours.dayOfWeek,
          startTime: hours.startTime,
          endTime: hours.endTime,
          slotDuration: hours.slotDuration,
          breakDuration: hours.breakDuration,
          isActive: hours.isActive
        });
        console.log("Create response:", response.data);
        toast.success("Working hours created successfully");
      }
      
      await fetchWorkingHours();
      setEditingId(null);
    } catch (error: any) {
      console.error("Error saving working hours:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to save working hours";
      toast.error(errorMessage);
    }
  };

  const deleteWorkingHours = async (id: string) => {
    if (!id) return;

    try {
      await api.delete(`/working-hours/${id}`);
      toast.success("Working hours deleted successfully");
      await fetchWorkingHours();
    } catch (error) {
      console.error("Error deleting working hours:", error);
      toast.error("Failed to delete working hours");
    }
  };

  const generateSchedules = async () => {
    console.log("generateSchedules called with:", { doctorId, generateDateRange });
    
    if (!doctorId) {
      toast.error("Doctor ID is required");
      return;
    }
    
    if (!generateDateRange.startDate || !generateDateRange.endDate) {
      console.log("Missing dates:", generateDateRange);
      toast.error("Please select both start and end dates");
      return;
    }

    // Validate date range
    const startDate = new Date(generateDateRange.startDate);
    const endDate = new Date(generateDateRange.endDate);
    
    console.log("Parsed dates:", { startDate, endDate, isValidStart: !isNaN(startDate.getTime()), isValidEnd: !isNaN(endDate.getTime()) });
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      toast.error("Invalid date format");
      return;
    }
    
    if (startDate >= endDate) {
      toast.error("End date must be after start date");
      return;
    }

    if (startDate < new Date()) {
      toast.error("Start date cannot be in the past");
      return;
    }

    try {
      setIsGenerating(true);
      
      // Check Google Calendar connection status first
      try {
        const statusResponse = await api.get(`/google-calendar/oauth/status?doctorId=${doctorId}`);
        const isConnected = statusResponse.data.isConnected;
        
        if (!isConnected) {
          toast.warning("Google Calendar is not connected. Schedules will be generated but not synced to your calendar. Connect your Google Calendar in the Google Calendar tab to enable sync.");
        }
      } catch (error) {
        console.warn("Could not check Google Calendar connection status:", error);
        // Continue with generation even if status check fails
      }
      
      const response = await api.post("/working-hours/generate-schedules", {
        doctorId,
        startDate: generateDateRange.startDate,
        endDate: generateDateRange.endDate,
        regenerateExisting: false
      });

      const result = response.data.data;
      let successMessage = `Generated ${result.totalGenerated} schedules successfully`;
      
      if (result.calendarSync && result.calendarSync.eventsCreated > 0) {
        successMessage += `. Synced ${result.calendarSync.eventsCreated} events to Google Calendar`;
        toast.success(successMessage);
      } else {
        successMessage += `. Connect your Google Calendar to sync events automatically`;
        toast.success(successMessage);
      }
    } catch (error) {
      console.error("Error generating schedules:", error);
      toast.error("Failed to generate schedules");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateWorkingHours = (index: number, field: keyof WorkingHours, value: any) => {
    const updated = [...workingHours];
    updated[index] = { ...updated[index], [field]: value };
    setWorkingHours(updated);
  };

  const handleToggleActive = async (index: number) => {
    const updated = [...workingHours];
    const currentHour = updated[index];
    
    // If toggling to active and no ID exists, create working hours first
    if (!currentHour.isActive && !currentHour.id) {
      // Open edit form for this day
      const editId = `temp-${index}`;
      setEditingId(editId);
      return;
    }
    
    updated[index] = { ...updated[index], isActive: !updated[index].isActive };
    setWorkingHours(updated);
    
    // Auto-save when toggling active status
    if (updated[index].id) {
      await saveWorkingHours(updated[index]);
    }
  };

  const getActiveDaysCount = () => {
    return workingHours.filter(hour => hour.isActive).length;
  };

  const getTotalSlotsPerDay = (hour: WorkingHours) => {
    if (!hour.isActive) return 0;
    
    const start = new Date(`2000-01-01T${hour.startTime}`);
    const end = new Date(`2000-01-01T${hour.endTime}`);
    const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const slotCycle = hour.slotDuration + hour.breakDuration;
    
    return Math.floor(totalMinutes / slotCycle);
  };

  // Debug info
  console.log("WorkingHours component - doctorId:", doctorId);
  console.log("WorkingHours component - workingHours:", workingHours);

  if (!doctorId) {
    return (
      <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Working Hours</h1>
            <p className="text-gray-400 text-lg mb-4">
              Doctor ID is required to manage working hours.
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Please ensure you're logged in as a doctor and the doctor ID is available.
            </p>
            <div className="bg-gray-800 p-4 rounded-lg text-left max-w-md mx-auto">
              <p className="text-sm text-gray-400 mb-2">Debug Info:</p>
              <p className="text-xs text-gray-500">userId: {localStorage.getItem("userId") || "Not found"}</p>
              <p className="text-xs text-gray-500">doctorId: {localStorage.getItem("doctorId") || "Not found"}</p>
              <p className="text-xs text-gray-500">propDoctorId: {propDoctorId || "Not provided"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Working Hours</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Set your availability for each day of the week. The system will automatically generate appointment slots.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Doctor ID: {doctorId}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Days</p>
                  <p className="text-2xl font-bold text-white">{getActiveDaysCount()}</p>
                </div>
                <Calendar className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Default Slot Duration</p>
                  <p className="text-2xl font-bold text-white">20 min</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Break Duration</p>
                  <p className="text-2xl font-bold text-white">10 min</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Working Hours List */}
        <div className="space-y-4 mb-8">
          {workingHours.map((hour, index) => (
            <Card 
              key={hour.dayOfWeek} 
              className={`bg-gray-800 border-gray-700 ${!hour.id ? 'cursor-pointer hover:bg-gray-750' : ''}`}
              onClick={() => {
                if (!hour.id) {
                  const editId = `temp-${index}`;
                  setEditingId(editId);
                }
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-semibold text-white">
                      {dayNames[hour.dayOfWeek]}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={hour.isActive}
                        onCheckedChange={() => handleToggleActive(index)}
                        disabled={!hour.id && !hour.isActive}
                      />
                      <span className="text-sm text-gray-400">
                        {hour.isActive ? 'Active' : hour.id ? 'Inactive' : 'Not Set'}
                      </span>
                    </div>
                    {!hour.id && (
                      <span className="text-xs text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded">
                        Click to set working hours
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {hour.isActive && hour.id && (
                      <span className="text-sm text-gray-400">
                        {getTotalSlotsPerDay(hour)} slots/day
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const editId = hour.id || `temp-${index}`;
                        setEditingId(editingId === editId ? null : editId);
                      }}
                    >
                      {editingId === (hour.id || `temp-${index}`) ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    </Button>
                    {hour.id && !hour.id.startsWith('temp-') && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteWorkingHours(hour.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {editingId === (hour.id || `temp-${index}`) && (
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {hour.id && !hour.id.startsWith('temp-') ? 'Edit Working Hours' : 'Set Working Hours'}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {hour.id && !hour.id.startsWith('temp-') 
                          ? 'Update your working hours for this day' 
                          : 'Configure your working hours for this day'
                        }
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`start-${index}`} className="text-gray-300">Start Time</Label>
                        <Input
                          id={`start-${index}`}
                          type="time"
                          value={hour.startTime}
                          onChange={(e) => updateWorkingHours(index, 'startTime', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`end-${index}`} className="text-gray-300">End Time</Label>
                        <Input
                          id={`end-${index}`}
                          type="time"
                          value={hour.endTime}
                          onChange={(e) => updateWorkingHours(index, 'endTime', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`slot-${index}`} className="text-gray-300">Slot Duration (min)</Label>
                        <Input
                          id={`slot-${index}`}
                          type="number"
                          min="15"
                          max="60"
                          value={hour.slotDuration}
                          onChange={(e) => updateWorkingHours(index, 'slotDuration', parseInt(e.target.value))}
                          className="bg-gray-600 border-gray-500 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`break-${index}`} className="text-gray-300">Break Duration (min)</Label>
                        <Input
                          id={`break-${index}`}
                          type="number"
                          min="5"
                          max="30"
                          value={hour.breakDuration}
                          onChange={(e) => updateWorkingHours(index, 'breakDuration', parseInt(e.target.value))}
                          className="bg-gray-600 border-gray-500 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={hour.isActive}
                          onCheckedChange={(checked) => updateWorkingHours(index, 'isActive', checked)}
                        />
                        <span className="text-sm text-gray-300">
                          {hour.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {hour.isActive && (
                        <span className="text-sm text-green-400">
                          Will generate {getTotalSlotsPerDay(hour)} slots per day
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => saveWorkingHours(hour)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {hour.id && !hour.id.startsWith('temp-') ? 'Update' : 'Create'}
                      </Button>
                    </div>
                  </div>
                )}

                {!editingId && hour.isActive && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                    <div>
                      <span className="font-medium">Start:</span> {hour.startTime}
                    </div>
                    <div>
                      <span className="font-medium">End:</span> {hour.endTime}
                    </div>
                    <div>
                      <span className="font-medium">Slots:</span> {hour.slotDuration}min
                    </div>
                    <div>
                      <span className="font-medium">Breaks:</span> {hour.breakDuration}min
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Debug Info */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-400 space-y-2">
              <p>Doctor ID: {doctorId || "Not available"}</p>
              <p>Working Hours Count: {workingHours.length}</p>
              <p>Active Days: {getActiveDaysCount()}</p>
              <p>Date Range: {generateDateRange.startDate} to {generateDateRange.endDate}</p>
              <p>Editing ID: {editingId || "None"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Generation */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Generate Schedules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Generate appointment schedules for a date range based on your working hours.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="startDate" className="text-gray-300">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={generateDateRange.startDate}
                  onChange={(e) => {
                    console.log("Start date changed:", e.target.value);
                    setGenerateDateRange(prev => ({ ...prev, startDate: e.target.value }));
                  }}
                  className="bg-gray-600 border-gray-500 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="endDate" className="text-gray-300">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={generateDateRange.endDate}
                  onChange={(e) => {
                    console.log("End date changed:", e.target.value);
                    setGenerateDateRange(prev => ({ ...prev, endDate: e.target.value }));
                  }}
                  className="bg-gray-600 border-gray-500 text-white"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={generateSchedules}
                  disabled={isGenerating}
                  className="bg-red-500 hover:bg-red-600 w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Schedules
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-400">
                <strong>Debug:</strong> Start: "{generateDateRange.startDate}", End: "{generateDateRange.endDate}"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkingHours;