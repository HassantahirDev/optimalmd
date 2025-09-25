import React, { useState, useEffect } from "react";
import { Clock, Calendar, Plus, Edit, Trash2, Save, X, AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { adminApi } from "@/services/adminApi";

interface WorkingHours {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  breakDuration: number;
  isActive: boolean;
}

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
}

const AdminWorkingHours: React.FC = () => {
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [savingStates, setSavingStates] = useState<{ [key: number]: boolean }>({});
  const [generateDateRange, setGenerateDateRange] = useState({
    startDate: "",
    endDate: ""
  });

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

  // Load doctors on component mount
  useEffect(() => {
    loadDoctors();
  }, []);

  // Load working hours when doctor is selected
  useEffect(() => {
    if (selectedDoctorId) {
      initializeWorkingHours();
      fetchWorkingHours();
    }
  }, [selectedDoctorId]);

  const loadDoctors = async () => {
    try {
      console.log('Loading doctors...');
      const response = await adminApi.doctor.getDoctors({ page: 1, limit: 100 });
      console.log('Doctors response:', response);
      if (response.success) {
        setDoctors(response.data);
        console.log('Doctors loaded:', response.data);
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
      toast.error('Failed to load doctors');
    }
  };

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

  const fetchWorkingHours = async () => {
    if (!selectedDoctorId) return;

    try {
      setLoading(true);
      const response = await adminApi.workingHoursApi.getWorkingHours({ doctorId: selectedDoctorId });
      
      if (response.success) {
        const fetchedHours = response.data;
        
        // Merge with initial hours to ensure all days are present
        const mergedHours = dayOptions.map(day => {
          const existing = fetchedHours.find((h: WorkingHours) => h.dayOfWeek === day.value);
          return existing || {
            dayOfWeek: day.value,
            startTime: "08:00",
            endTime: "16:00",
            slotDuration: 20,
            breakDuration: 10,
            isActive: false
          };
        });
        
        setWorkingHours(mergedHours);
      }
    } catch (error) {
      console.error('Error fetching working hours:', error);
      toast.error('Failed to load working hours');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (dayIndex: number) => {
    if (!selectedDoctorId) {
      toast.error('Please select a doctor first');
      return;
    }

    const workingHour = workingHours[dayIndex];
    
    try {
      setLoading(true);
      
      if (workingHour.id) {
        // Update existing - only send the fields that can be updated
        const updateData = {
          startTime: workingHour.startTime,
          endTime: workingHour.endTime,
          slotDuration: workingHour.slotDuration,
          breakDuration: workingHour.breakDuration,
          isActive: workingHour.isActive
        };
        await adminApi.workingHoursApi.updateWorkingHours(workingHour.id, updateData);
        toast.success(`${dayNames[workingHour.dayOfWeek]} working hours updated`);
      } else {
        // Create new
        const response = await adminApi.workingHoursApi.createWorkingHours({
          ...workingHour,
          doctorId: selectedDoctorId
        });
        
        // Update local state with the new ID
        const updatedHours = [...workingHours];
        updatedHours[dayIndex] = { ...workingHour, id: response.data.id };
        setWorkingHours(updatedHours);
        
        toast.success(`${dayNames[workingHour.dayOfWeek]} working hours created`);
      }
      
      setEditingId(null);
    } catch (error) {
      console.error('Error saving working hours:', error);
      toast.error('Failed to save working hours');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dayIndex: number) => {
    const workingHour = workingHours[dayIndex];
    
    if (!workingHour.id) {
      toast.error('No working hours to delete');
      return;
    }

    try {
      setLoading(true);
      await adminApi.workingHoursApi.deleteWorkingHours(workingHour.id);
      
      // Reset to default values
      const updatedHours = [...workingHours];
      updatedHours[dayIndex] = {
        dayOfWeek: workingHour.dayOfWeek,
        startTime: "08:00",
        endTime: "16:00",
        slotDuration: 20,
        breakDuration: 10,
        isActive: false
      };
      setWorkingHours(updatedHours);
      
      toast.success(`${dayNames[workingHour.dayOfWeek]} working hours deleted`);
    } catch (error) {
      console.error('Error deleting working hours:', error);
      toast.error('Failed to delete working hours');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSchedules = async () => {
    if (!selectedDoctorId) {
      toast.error('Please select a doctor first');
      return;
    }

    if (!generateDateRange.startDate || !generateDateRange.endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    try {
      setIsGenerating(true);
      const response = await adminApi.workingHoursApi.generateSchedules({
        doctorId: selectedDoctorId,
        startDate: generateDateRange.startDate,
        endDate: generateDateRange.endDate,
        regenerateExisting: false
      });

      if (response.success) {
        const totalGenerated = response.data.totalGenerated;
        if (totalGenerated === 0) {
          toast.warning('No schedules generated. Make sure working hours are active for the selected date range.');
        } else {
          toast.success(`Generated ${totalGenerated} schedules successfully`);
        }
        setGenerateDateRange({ startDate: "", endDate: "" });
      }
    } catch (error) {
      console.error('Error generating schedules:', error);
      toast.error('Failed to generate schedules');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (dayIndex: number, field: keyof WorkingHours, value: any) => {
    const updatedHours = [...workingHours];
    updatedHours[dayIndex] = { ...updatedHours[dayIndex], [field]: value };
    setWorkingHours(updatedHours);
    
    // Auto-save when toggling active status
    if (field === 'isActive') {
      handleAutoSave(dayIndex, updatedHours[dayIndex]);
    }
  };

  const handleAutoSave = async (dayIndex: number, workingHour: WorkingHours) => {
    if (!selectedDoctorId) {
      toast.error('Please select a doctor first');
      return;
    }

    // Set saving state
    setSavingStates(prev => ({ ...prev, [dayIndex]: true }));

    try {
      if (workingHour.id) {
        // Update existing
        const updateData = {
          startTime: workingHour.startTime,
          endTime: workingHour.endTime,
          slotDuration: workingHour.slotDuration,
          breakDuration: workingHour.breakDuration,
          isActive: workingHour.isActive
        };
        await adminApi.workingHoursApi.updateWorkingHours(workingHour.id, updateData);
        toast.success(`${dayNames[workingHour.dayOfWeek]} status updated`);
      } else {
        // Create new if it doesn't exist
        const response = await adminApi.workingHoursApi.createWorkingHours({
          ...workingHour,
          doctorId: selectedDoctorId
        });
        
        // Update local state with the new ID
        const updatedHours = [...workingHours];
        updatedHours[dayIndex] = { ...workingHour, id: response.data.id };
        setWorkingHours(updatedHours);
        
        toast.success(`${dayNames[workingHour.dayOfWeek]} working hours created`);
      }
    } catch (error) {
      console.error('Error auto-saving working hours:', error);
      toast.error('Failed to save changes');
      
      // Revert the change on error
      const revertedHours = [...workingHours];
      revertedHours[dayIndex] = { ...revertedHours[dayIndex], isActive: !workingHour.isActive };
      setWorkingHours(revertedHours);
    } finally {
      // Clear saving state
      setSavingStates(prev => ({ ...prev, [dayIndex]: false }));
    }
  };

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Work Schedule Management</h1>
      </div>

      {/* Doctor Selection */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5" />
            Select Doctor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="doctor-select" className="text-gray-300">Doctor</Label>
              <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedDoctor && (
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="text-white font-medium">
                  Managing schedule for: Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                </p>
                <p className="text-gray-400 text-sm">{selectedDoctor.specialization}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedDoctorId && (
        <>
          {/* Working Hours */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Working Hours</h2>
            {workingHours.map((workingHour, index) => (
              <Card key={workingHour.dayOfWeek} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      {dayNames[workingHour.dayOfWeek]}
                    </span>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={workingHour.isActive}
                        onCheckedChange={(checked) => handleInputChange(index, 'isActive', checked)}
                        disabled={editingId !== null && editingId !== workingHour.id || savingStates[index]}
                      />
                      <span className={`text-sm ${workingHour.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                        {savingStates[index] ? 'Saving...' : (workingHour.isActive ? 'Active' : 'Inactive')}
                      </span>
                      {savingStates[index] && (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editingId === workingHour.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`startTime-${index}`} className="text-gray-300">Start Time</Label>
                          <Input
                            id={`startTime-${index}`}
                            type="time"
                            value={workingHour.startTime}
                            onChange={(e) => handleInputChange(index, 'startTime', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`endTime-${index}`} className="text-gray-300">End Time</Label>
                          <Input
                            id={`endTime-${index}`}
                            type="time"
                            value={workingHour.endTime}
                            onChange={(e) => handleInputChange(index, 'endTime', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`slotDuration-${index}`} className="text-gray-300">Slot Duration (minutes)</Label>
                          <Input
                            id={`slotDuration-${index}`}
                            type="number"
                            min="15"
                            max="60"
                            value={workingHour.slotDuration}
                            onChange={(e) => handleInputChange(index, 'slotDuration', parseInt(e.target.value))}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`breakDuration-${index}`} className="text-gray-300">Break Duration (minutes)</Label>
                          <Input
                            id={`breakDuration-${index}`}
                            type="number"
                            min="5"
                            max="30"
                            value={workingHour.breakDuration}
                            onChange={(e) => handleInputChange(index, 'breakDuration', parseInt(e.target.value))}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSave(index)}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingId(null)}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Start Time</Label>
                          <p className="text-white font-medium">{workingHour.startTime}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">End Time</Label>
                          <p className="text-white font-medium">{workingHour.endTime}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Slot Duration</Label>
                          <p className="text-white font-medium">{workingHour.slotDuration} minutes</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Break Duration</Label>
                          <p className="text-white font-medium">{workingHour.breakDuration} minutes</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setEditingId(workingHour.id || `new-${index}`)}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        {workingHour.id && (
                          <Button
                            onClick={() => handleDelete(index)}
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Schedule Generation */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Generate Schedules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate" className="text-gray-300">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={generateDateRange.startDate}
                      onChange={(e) => setGenerateDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="text-gray-300">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={generateDateRange.endDate}
                      onChange={(e) => setGenerateDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleGenerateSchedules}
                  disabled={isGenerating || !generateDateRange.startDate || !generateDateRange.endDate}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Schedules'}
                </Button>
                <p className="text-gray-400 text-sm">
                  This will generate appointment schedules for the selected date range based on the working hours above.
                </p>
                <div className="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    <strong>Note:</strong> Only active working hours will generate schedules. Make sure to:
                  </p>
                  <ul className="text-yellow-300 text-xs mt-1 ml-4 list-disc">
                    <li>Set working hours to "Active" for the days you want</li>
                    <li>Select a date range that includes those working days</li>
                    <li>Ensure start/end times and durations are properly set</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminWorkingHours;
