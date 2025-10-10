import React, { useState, useEffect, useCallback } from "react";
import {
  Clock,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/utils/timeUtils";
import { adminApi, AppointmentRequest, Appointment } from "@/services/adminApi";
import { toast } from "sonner";

// Using AppointmentRequest interface from adminApi

const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<(AppointmentRequest | Appointment)[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "assigned" | "rejected">("all");
  const [source, setSource] = useState<'bookings' | 'unassigned'>('unassigned');
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [assignDoctorId, setAssignDoctorId] = useState("");
  const [assignSlotId, setAssignSlotId] = useState("");
  const [availableDoctorOptions, setAvailableDoctorOptions] = useState<Array<{ id: string; firstName: string; lastName: string; slotId: string; slotStartTime: string; slotEndTime: string }>>([]);
  const [assignLoading, setAssignLoading] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load requests from API
  useEffect(() => {
    loadRequests();
  }, [debouncedSearchTerm, statusFilter]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      if (source === 'unassigned') {
        const response = await adminApi.appointment.getUnassignedAppointments({
          page: 1,
          limit: 50,
          status: statusFilter === 'all' ? undefined : statusFilter.toUpperCase()
        });
        setRequests(response.data);
      } else {
        const response = await adminApi.appointmentRequest.getRequests({
          page: 1,
          limit: 50,
          status: statusFilter === 'all' ? undefined : statusFilter as any,
          search: debouncedSearchTerm || undefined
        });
        setRequests(response.data);
      }
    } catch (error: any) {
      console.error('Error loading requests:', error);
      toast.error('Failed to load appointment requests');
    } finally {
      setLoading(false);
    }
  };

  // Filtering is now handled by the API
  const filteredRequests = requests;

  const getStatusBadge = (status: string) => {
    // Normalize to uppercase for safety
    const s = (status || '').toUpperCase();
    // Booking statuses
    if (s === 'PENDING') return <Badge className="bg-orange-500 text-white">Pending</Badge>;
    if (s === 'ASSIGNED') return <Badge className="bg-green-500 text-white">Assigned</Badge>;
    if (s === 'REJECTED') return <Badge className="bg-red-500 text-white">Rejected</Badge>;
    // Appointment statuses
    if (s === 'CONFIRMED') return <Badge className="bg-green-600 text-white">Confirmed</Badge>;
    if (s === 'IN_PROGRESS') return <Badge className="bg-blue-500 text-white">In Progress</Badge>;
    if (s === 'COMPLETED') return <Badge className="bg-gray-500 text-white">Completed</Badge>;
    if (s === 'CANCELLED') return <Badge className="bg-red-600 text-white">Cancelled</Badge>;
    if (s === 'NO_SHOW') return <Badge className="bg-red-500 text-white">No Show</Badge>;
    if (s === 'RESCHEDULED') return <Badge className="bg-yellow-600 text-white">Rescheduled</Badge>;
    return <Badge className="bg-gray-500 text-white">Unknown</Badge>;
  };

  const handleAssignDoctor = async (itemId: string) => {
    const item = requests.find((r: any) => r.id === itemId);
    setSelectedItem(item || null);
    setAssignDoctorId("");
    setAssignSlotId("");
    setAssignOpen(true);
    // Preload available doctors by appointment id
    try {
      setAssignLoading(true);
      const resp = await adminApi.appointment.getAvailableDoctorsForAppointment(itemId);
      const options = (resp.data || []).map((d: any) => ({ id: d.id, firstName: d.firstName, lastName: d.lastName, slotId: d.slotId, slotStartTime: d.slotStartTime, slotEndTime: d.slotEndTime }));
      setAvailableDoctorOptions(options);
      if (options.length > 0) {
        setAssignDoctorId(options[0].id);
        setAssignSlotId(options[0].slotId);
      }
    } catch (e) {
      console.error('Failed loading available doctors', e);
      setAvailableDoctorOptions([]);
    } finally {
      setAssignLoading(false);
    }
  };

  const submitAssign = async () => {
    if (!selectedItem) return;
    if (!assignDoctorId || !assignSlotId) {
      toast.error('Select doctor and slot');
      return;
    }
    try {
      const appointmentId = (selectedItem as any).id;
      await adminApi.appointment.assignDoctorToAppointment({ appointmentId, doctorId: assignDoctorId, slotId: assignSlotId });
      toast.success('Doctor assigned');
      setAssignOpen(false);
      loadRequests();
    } catch (e) {
      console.error('Assign failed', e);
      toast.error('Failed to assign doctor');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (window.confirm("Are you sure you want to reject this request?")) {
      try {
        await adminApi.appointmentRequest.rejectRequest(requestId, "Rejected by admin");
        toast.success("Request rejected successfully");
        loadRequests();
      } catch (error: any) {
        console.error('Error rejecting request:', error);
        toast.error('Failed to reject request');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-600 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Appointment Requests</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Review and assign doctors to patient appointment requests
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by patient name, email, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as any)}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="unassigned">Unassigned Appointments</option>
              <option value="bookings">Booking Requests</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No requests found</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-white flex items-center gap-3">
                        <User className="h-5 w-5" />
                        {request.patient.firstName} {request.patient.lastName}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {request.patient.primaryEmail}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {request.patient.primaryPhone}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge((request as any).status)}
                      <span className="text-sm text-gray-400">
                        {new Date((request as any).createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Requested Date</p>
                      <p className="text-white font-medium">
                        {source === 'unassigned'
                          ? new Date((request as any).appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                          : new Date((request as any).requestedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Requested Time</p>
                      <p className="text-white font-medium">
                        {source === 'unassigned'
                          ? formatTime((request as any).selectedSlotTime || (request as any).appointmentTime)
                          : formatTime((request as any).requestedTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Service</p>
                      <p className="text-white font-medium">{(request as any).service?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Status</p>
                      <p className="text-white font-medium capitalize">{(request as any).status}</p>
                    </div>
                  </div>
                  
                  {request.notes && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-1">Notes</p>
                      <p className="text-white bg-gray-700 p-3 rounded-lg">{request.notes}</p>
                    </div>
                  )}

                  {((request as any).status === "PENDING" || source === 'unassigned') && (
                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                      <div className="flex justify-end w-full">
                        <Button
                          onClick={() => handleAssignDoctor((request as any).id)}
                          className="ml-auto bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Assign Doctor
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      {/* Assign Modal */}
      <Dialog open={assignOpen} onOpenChange={(open) => { setAssignOpen(open); if (!open) { setAvailableDoctorOptions([]); setAssignDoctorId(""); setAssignSlotId(""); } }}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Assign Doctor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Available Doctors (auto-filtered by appointment time)</label>
                <select
                  value={assignDoctorId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAssignDoctorId(val);
                    const found = availableDoctorOptions.find(o => o.id === val);
                    if (found) setAssignSlotId(found.slotId);
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 disabled:opacity-60"
                  disabled={assignLoading}
                >
                  {assignLoading && <option value="">Loading available doctors...</option>}
                  {!assignLoading && availableDoctorOptions.length === 0 && <option value="">No doctors available</option>}
                  {!assignLoading && availableDoctorOptions.map(opt => (
                    <option key={`${opt.id}-${opt.slotId}`} value={opt.id}>
                      Dr. {opt.firstName} {opt.lastName} — {opt.slotStartTime} - {opt.slotEndTime}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAssignOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancel</Button>
              <Button onClick={submitAssign} disabled={assignLoading || !assignDoctorId || !assignSlotId} className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-60">
                {assignLoading ? 'Assigning...' : 'Assign'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRequests;
