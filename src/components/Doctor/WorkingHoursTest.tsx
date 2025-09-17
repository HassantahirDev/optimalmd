import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/service/api";

const WorkingHoursTest: React.FC = () => {
  const [testDoctorId, setTestDoctorId] = useState("");
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async (endpoint: string, method: string = 'GET', data?: any) => {
    try {
      console.log(`Testing ${method} ${endpoint}`, data);
      let response;
      
      if (method === 'GET') {
        response = await api.get(endpoint);
      } else if (method === 'POST') {
        response = await api.post(endpoint, data);
      } else if (method === 'PUT') {
        response = await api.put(endpoint, data);
      } else if (method === 'DELETE') {
        response = await api.delete(endpoint);
      }
      
      console.log(`✅ ${method} ${endpoint} success:`, response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error(`❌ ${method} ${endpoint} failed:`, error);
      return { 
        success: false, 
        error: error.response?.data || error.message,
        status: error.response?.status
      };
    }
  };

  const testWorkingHoursAPI = async () => {
    if (!testDoctorId) {
      toast.error("Please enter a doctor ID");
      return;
    }

    try {
      setLoading(true);
      setTestResults(null);

      const results: any = {};

      // Test 1: Health check
      results.health = await testAPI('/google-calendar/health');

      // Test 2: Create working hours for Monday
      const mondayHours = {
        doctorId: testDoctorId,
        dayOfWeek: 1, // Monday
        startTime: "08:00",
        endTime: "16:00",
        slotDuration: 20,
        breakDuration: 10,
        isActive: true
      };

      results.create = await testAPI('/working-hours', 'POST', mondayHours);

      // Test 3: Get working hours
      results.get = await testAPI(`/working-hours?doctorId=${testDoctorId}`);

      // Test 4: Update working hours (if create was successful)
      if (results.create.success && results.create.data?.data?.id) {
        const updateData = {
          startTime: "09:00",
          endTime: "17:00",
          slotDuration: 30,
          breakDuration: 15,
          isActive: true
        };
        results.update = await testAPI(`/working-hours/${results.create.data.data.id}`, 'PUT', updateData);
      }

      // Test 5: Generate schedules
      results.generate = await testAPI('/working-hours/generate-schedules', 'POST', {
        doctorId: testDoctorId,
        startDate: "2024-12-25",
        endDate: "2024-12-31",
        regenerateExisting: false
      });

      setTestResults(results);

      const successCount = Object.values(results).filter((r: any) => r.success).length;
      const totalTests = Object.keys(results).length;
      
      toast.success(`Tests completed: ${successCount}/${totalTests} passed`);
      
    } catch (error: any) {
      console.error("❌ Test failed:", error);
      toast.error(`Test failed: ${error.message}`);
      setTestResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testGoogleCalendar = async () => {
    try {
      const result = await testAPI('/google-calendar/health');
      if (result.success) {
        toast.success("Google Calendar is healthy!");
      } else {
        toast.error(`Google Calendar test failed: ${result.error}`);
      }
    } catch (error: any) {
      toast.error(`Google Calendar test failed: ${error.message}`);
    }
  };

  return (
    <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Working Hours API Test</h1>
          <p className="text-gray-400 text-lg">
            Test the new working hours API endpoints to ensure everything is working correctly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">API Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="doctorId" className="text-gray-300">Doctor ID</Label>
                <Input
                  id="doctorId"
                  value={testDoctorId}
                  onChange={(e) => setTestDoctorId(e.target.value)}
                  placeholder="Enter doctor ID to test"
                  className="bg-gray-600 border-gray-500 text-white"
                />
              </div>
              
              <Button
                onClick={testWorkingHoursAPI}
                disabled={loading || !testDoctorId}
                className="bg-red-500 hover:bg-red-600 w-full"
              >
                {loading ? "Testing..." : "Test Working Hours API"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Google Calendar Test</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={testGoogleCalendar}
                className="bg-blue-500 hover:bg-blue-600 w-full"
              >
                Test Google Calendar
              </Button>
            </CardContent>
          </Card>
        </div>

        {testResults && (
          <Card className="bg-gray-800 border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(testResults).map(([key, result]: [string, any]) => (
                  <div key={key} className="p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white capitalize">{key}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        result.success ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                      }`}>
                        {result.success ? 'SUCCESS' : 'FAILED'}
                      </span>
                    </div>
                    <pre className="text-xs text-gray-400 overflow-auto max-h-32">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <h3 className="text-yellow-400 font-semibold mb-2">Testing Instructions:</h3>
          <ol className="text-gray-300 space-y-1 text-sm">
            <li>1. Make sure the backend server is running on port 3000</li>
            <li>2. Get a valid doctor ID from your database or create a doctor account</li>
            <li>3. Enter the doctor ID and click "Test Working Hours API"</li>
            <li>4. Check the console and results for any errors</li>
            <li>5. Test Google Calendar integration separately</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default WorkingHoursTest;