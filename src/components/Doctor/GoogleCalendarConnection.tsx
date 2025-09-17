import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, XCircle, ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import api from "@/service/api";

interface GoogleCalendarConnectionProps {
  doctorId?: string;
}

const GoogleCalendarConnection: React.FC<GoogleCalendarConnectionProps> = ({ doctorId: propDoctorId }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  // Get doctor ID from props or localStorage
  // For testing, use the known doctor ID from the database
  const doctorId = propDoctorId || localStorage.getItem("userId") || "783dc7c6-11a2-4262-94f4-4dfe5ce05340";

  useEffect(() => {
    console.log("GoogleCalendarConnection - doctorId:", doctorId);
    console.log("GoogleCalendarConnection - localStorage userId:", localStorage.getItem("userId"));
    console.log("GoogleCalendarConnection - localStorage doctorId:", localStorage.getItem("doctorId"));
    
    if (doctorId) {
      checkConnectionStatus();
    }
  }, [doctorId]);

  const checkConnectionStatus = async () => {
    if (!doctorId) return;

    try {
      setIsChecking(true);
      const response = await api.get(`/google-calendar/oauth/status?doctorId=${doctorId}`);
      setIsConnected(response.data.isConnected);
    } catch (error: any) {
      console.error("Error checking connection status:", error);
      toast.error("Failed to check Google Calendar connection status");
    } finally {
      setIsChecking(false);
    }
  };

  const connectGoogleCalendar = async () => {
    if (!doctorId) {
      toast.error("Doctor ID is required");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get(`/google-calendar/oauth/auth-url?doctorId=${doctorId}`);
      
      if (response.data.success) {
        // Open Google OAuth in a new window
        const authWindow = window.open(
          response.data.authUrl,
          'google-calendar-auth',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        // Check if the window was closed (user completed auth)
        const checkClosed = setInterval(() => {
          if (authWindow?.closed) {
            clearInterval(checkClosed);
            // Check connection status after window closes
            setTimeout(() => {
              checkConnectionStatus();
            }, 1000);
          }
        }, 1000);

        toast.success("Please complete the Google Calendar authorization in the popup window");
      } else {
        toast.error("Failed to generate authorization URL");
      }
    } catch (error: any) {
      console.error("Error connecting Google Calendar:", error);
      toast.error("Failed to connect Google Calendar");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectGoogleCalendar = async () => {
    if (!doctorId) {
      toast.error("Doctor ID is required");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post("/google-calendar/oauth/disconnect", { doctorId });
      
      if (response.data.success) {
        setIsConnected(false);
        toast.success("Google Calendar disconnected successfully");
      } else {
        toast.error(response.data.message || "Failed to disconnect Google Calendar");
      }
    } catch (error: any) {
      console.error("Error disconnecting Google Calendar:", error);
      toast.error("Failed to disconnect Google Calendar");
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
            <p>Doctor ID is required to manage Google Calendar connection</p>
            <p className="text-sm mt-2 text-gray-500">
              Please ensure you're logged in as a doctor and the doctor ID is available in localStorage as 'userId'
            </p>
            <div className="mt-4 p-3 bg-gray-700 rounded text-left text-xs">
              <p><strong>Debug Info:</strong></p>
              <p>userId: {localStorage.getItem("userId") || "Not found"}</p>
              <p>doctorId: {localStorage.getItem("doctorId") || "Not found"}</p>
              <p>propDoctorId: {propDoctorId || "Not provided"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Google Calendar Integration</h1>
          <p className="text-gray-400 text-lg">
            Connect your Google Calendar to automatically sync your working hours and appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Connection Status Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Google Calendar</span>
                <div className="flex items-center gap-2">
                  {isChecking ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
                  ) : isConnected ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                  <Badge variant={isConnected ? "default" : "destructive"}>
                    {isConnected ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={checkConnectionStatus}
                  variant="outline"
                  size="sm"
                  disabled={isChecking}
                  className="flex-1"
                >
                  {isChecking ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isConnected ? (
                <div className="space-y-3">
                  <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm">
                      ✅ Your Google Calendar is connected and ready to sync working hours.
                    </p>
                  </div>
                  <Button
                    onClick={disconnectGoogleCalendar}
                    variant="destructive"
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Disconnecting..." : "Disconnect Google Calendar"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      Connect your Google Calendar to automatically sync your working hours and appointments.
                    </p>
                  </div>
                  <Button
                    onClick={connectGoogleCalendar}
                    disabled={isLoading}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    {isLoading ? (
                      "Connecting..."
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Connect Google Calendar
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Card */}
        <Card className="bg-gray-800 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-white">Connect Your Calendar</h4>
                  <p className="text-sm">Click "Connect Google Calendar" to authorize access to your Google Calendar.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-white">Set Working Hours</h4>
                  <p className="text-sm">Configure your weekly working hours in the Working Hours section.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-white">Automatic Sync</h4>
                  <p className="text-sm">Your working hours will automatically sync to your Google Calendar as events.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-white">Appointment Integration</h4>
                  <p className="text-sm">Appointments will also be created in your Google Calendar with Google Meet links.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-gray-800 border-gray-700 mt-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-black text-xs font-bold flex-shrink-0 mt-0.5">
                !
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400 mb-1">Privacy & Security</h4>
                <p className="text-sm text-gray-300">
                  We only access your Google Calendar to create and manage your working hours and appointments. 
                  We never read your existing calendar events or personal information. You can disconnect at any time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleCalendarConnection;
