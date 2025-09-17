import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Upload, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import api from "@/service/api";

interface GoogleCalendarImportProps {
  doctorId: string;
}

const GoogleCalendarImport: React.FC<GoogleCalendarImportProps> = ({ doctorId: propDoctorId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });
  const [selectedDate, setSelectedDate] = useState("");
  
  // Get doctor ID from props or localStorage
  const doctorId = propDoctorId || localStorage.getItem("userId") || "783dc7c6-11a2-4262-94f4-4dfe5ce05340";

  const importWorkingHours = async () => {
    if (!doctorId) {
      toast.error("Doctor ID is required");
      return;
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post("/google-calendar/import/working-hours", {
        doctorId,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });

      if (response.data.success) {
        setImportResults(response.data.data);
        const { workingHoursCreated, workingHoursUpdated, schedulesGenerated, slotsGenerated } = response.data.data;
        toast.success(
          `Import completed! ${workingHoursCreated} created, ${workingHoursUpdated} updated working hours. Generated ${schedulesGenerated} schedules and ${slotsGenerated} slots.`
        );
      } else {
        toast.error(response.data.message || "Failed to import working hours");
      }
    } catch (error: any) {
      console.error("Error importing working hours:", error);
      toast.error("Failed to import working hours");
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableSlots = async () => {
    if (!doctorId) {
      toast.error("Doctor ID is required");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get(`/google-calendar/import/available-slots?doctorId=${doctorId}&date=${selectedDate}`);

      if (response.data.success) {
        setAvailableSlots(response.data.data.slots);
        toast.success(`Found ${response.data.data.slots.length} available slots`);
      } else {
        toast.error(response.data.message || "Failed to get available slots");
      }
    } catch (error: any) {
      console.error("Error getting available slots:", error);
      toast.error("Failed to get available slots");
    } finally {
      setIsLoading(false);
    }
  };

  const syncCalendar = async () => {
    if (!doctorId) {
      toast.error("Doctor ID is required");
      return;
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post("/google-calendar/import/sync-calendar", {
        doctorId,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        direction: "both"
      });

      if (response.data.success) {
        toast.success("Calendar sync completed successfully");
      } else {
        toast.error(response.data.message || "Calendar sync failed");
      }
    } catch (error: any) {
      console.error("Error syncing calendar:", error);
      toast.error("Failed to sync calendar");
    } finally {
      setIsLoading(false);
    }
  };

  if (!doctorId) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p>Doctor ID is required to import from Google Calendar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Google Calendar Import</h1>
          <p className="text-gray-400 text-lg">
            Import working hours and available slots from your Google Calendar events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Import Working Hours */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Download className="h-5 w-5" />
                Import Working Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="startDate" className="text-gray-300">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    className="bg-gray-600 border-gray-500 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-gray-300">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    className="bg-gray-600 border-gray-500 text-white"
                  />
                </div>
              </div>
              
              <Button
                onClick={importWorkingHours}
                disabled={isLoading || !dateRange.startDate || !dateRange.endDate}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Import Working Hours
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Get Available Slots */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Available Slots
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="selectedDate" className="text-gray-300">Select Date</Label>
                <Input
                  id="selectedDate"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-gray-600 border-gray-500 text-white"
                />
              </div>
              
              <Button
                onClick={getAvailableSlots}
                disabled={isLoading || !selectedDate}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Get Available Slots
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sync Calendar */}
        <Card className="bg-gray-800 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Two-Way Sync
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Sync working hours between Google Calendar and the system in both directions.
              </p>
              
              <Button
                onClick={syncCalendar}
                disabled={isLoading || !dateRange.startDate || !dateRange.endDate}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Calendar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Import Results */}
        {importResults && (
          <Card className="bg-gray-800 border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Import Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{importResults.workingHoursCreated}</div>
                    <div className="text-sm text-gray-400">Working Hours Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{importResults.workingHoursUpdated}</div>
                    <div className="text-sm text-gray-400">Working Hours Updated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{importResults.schedulesGenerated}</div>
                    <div className="text-sm text-gray-400">Schedules Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{importResults.slotsGenerated}</div>
                    <div className="text-sm text-gray-400">Slots Generated</div>
                  </div>
                </div>
                
                {importResults.errors && importResults.errors.length > 0 && (
                  <div>
                    <h4 className="text-red-400 font-semibold mb-2">Errors:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {importResults.errors.map((error: string, index: number) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Slots */}
        {availableSlots.length > 0 && (
          <Card className="bg-gray-800 border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Available Slots for {selectedDate}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="p-2 bg-gray-700 rounded text-center text-sm"
                  >
                    <div className="text-white font-medium">
                      {slot.startTime} - {slot.endTime}
                    </div>
                    <div className="text-green-400 text-xs">
                      Available
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-gray-800 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">How to Use Google Calendar Import</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-white">Create Working Hours Events</h4>
                  <p className="text-sm">In your Google Calendar, create events with titles like "Working Hours", "Availability", or "Office Hours"</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-white">Set Event Times</h4>
                  <p className="text-sm">Set the start and end times for your working hours. The system will automatically detect these times.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-white">Add Slot Information (Optional)</h4>
                  <p className="text-sm">In the event description, add "Slot: 20" and "Break: 10" to specify slot and break durations.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-white">Import to System</h4>
                  <p className="text-sm">Use the import function above to bring your Google Calendar working hours into the system.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleCalendarImport;
