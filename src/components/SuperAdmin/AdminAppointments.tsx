import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Clock,
  Phone,
  Mail,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatTime } from "@/utils/timeUtils";
import { adminApi, Appointment, Doctor, Service, Patient } from "@/services/adminApi";
import { toast } from "sonner";

// Using interfaces from adminApi

const AdminAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [primaryServices, setPrimaryServices] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "scheduled" | "confirmed" | "completed" | "cancelled">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Create form state
  const [formPatientId, setFormPatientId] = useState("");
  const [formDoctorId, setFormDoctorId] = useState("");
  const [formPrimaryServiceId, setFormPrimaryServiceId] = useState("");
  const [formServiceId, setFormServiceId] = useState("");
  const [formDate, setFormDate] = useState(""); // YYYY-MM-DD
  const [formSlotId, setFormSlotId] = useState("");
  const [formTime, setFormTime] = useState(""); // HH:MM
  const [formDuration, setFormDuration] = useState<number>(30);
  const [formNotes, setFormNotes] = useState("");
  const [availableSlots, setAvailableSlots] = useState<{ id: string; startTime: string; endTime: string }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Load data from APIs
  useEffect(() => {
    loadData();
  }, [searchTerm, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load appointments, doctors, and services in parallel
      const [appointmentsResponse, patientsResponse, doctorsResponse, servicesResponse, primaryServicesResp] = await Promise.all([
        adminApi.appointment.getAppointments({
          page: 1,
          limit: 50,
          search: searchTerm || undefined,
          status: statusFilter === 'all' ? undefined : statusFilter
        }),
        adminApi.patient.getPatients({ page: 1, limit: 200 }),
        adminApi.doctor.getDoctors({ page: 1, limit: 100 }),
        adminApi.service.getServices({ page: 1, limit: 100 }),
        adminApi.service.getPrimaryServices(),
      ]);

      setAppointments(appointmentsResponse.data);
      setPatients(patientsResponse.data);
      setDoctors(doctorsResponse.data);
      setServices(servicesResponse.data);
      setPrimaryServices((primaryServicesResp.data || []).map((p: any) => ({ id: p.id, name: p.name })));
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Failed to load appointments data');
    } finally {
      setLoading(false);
    }
  };

  // Hide appointments without assigned doctor or slot
  const filteredAppointments = appointments.filter(a => !!a.doctorId && !!a.slotId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-orange-500 text-white">Pending</Badge>;
      case "CONFIRMED":
        return <Badge className="bg-green-500 text-white">Confirmed</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500 text-white">In Progress</Badge>;
      case "COMPLETED":
        return <Badge className="bg-gray-500 text-white">Completed</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-500 text-white">Cancelled</Badge>;
      case "NO_SHOW":
        return <Badge className="bg-red-500 text-white">No Show</Badge>;
      case "RESCHEDULED":
        return <Badge className="bg-yellow-500 text-white">Rescheduled</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Unknown</Badge>;
    }
  };

  const handleCreateAppointment = () => {
    setEditingAppointment(null);
    setShowCreateModal(true);
    // reset form
    setFormPatientId("");
    setFormDoctorId("");
    setFormServiceId("");
    setFormDate("");
    setFormSlotId("");
    setFormTime("");
    setFormDuration(30);
    setFormNotes("");
    setAvailableSlots([]);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowCreateModal(true);
  };

  // Load available slots when doctor, date, or service changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!formDoctorId || !formDate) {
        setAvailableSlots([]);
        setFormSlotId("");
        return;
      }
      try {
        setLoadingSlots(true);
        const resp = await adminApi.schedule.getAvailableSlots({ doctorId: formDoctorId, date: formDate });
        const slots = (resp.data?.availableSlots || []).map((s: any) => ({ id: s.id, startTime: s.startTime, endTime: s.endTime }));
        setAvailableSlots(slots);
        // default select first slot
        if (slots.length > 0) {
          setFormSlotId(slots[0].id);
          setFormTime(slots[0].startTime);
          // compute duration from slot times if possible
          const [sh, sm] = slots[0].startTime.split(":").map((n: string) => parseInt(n, 10));
          const [eh, em] = slots[0].endTime.split(":").map((n: string) => parseInt(n, 10));
          const dur = (eh * 60 + em) - (sh * 60 + sm);
          setFormDuration(dur > 0 ? dur : (services.find(s => s.id === formServiceId)?.duration || 30));
        } else {
          setFormSlotId("");
        }
      } catch (e) {
        console.error('Failed to load slots', e);
        toast.error('Failed to load available slots');
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDoctorId, formDate, formServiceId]);

  const onSubmitCreate = async () => {
    if (!formPatientId || !formDoctorId || !formServiceId || !formDate || !formTime) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      const payload = {
        patientId: formPatientId,
        doctorId: formDoctorId,
        serviceId: formServiceId,
        primaryServiceId: formPrimaryServiceId || formServiceId,
        slotId: formSlotId || undefined,
        appointmentDate: formDate,
        appointmentTime: formTime,
        duration: formDuration || (services.find(s => s.id === formServiceId)?.duration || 30),
        patientNotes: formNotes || undefined,
      };
      await adminApi.appointment.adminCreateConfirmed(payload);
      toast.success('Appointment created');
      setShowCreateModal(false);
      loadData();
    } catch (e) {
      console.error('Create appointment failed', e);
      toast.error('Failed to create appointment');
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await adminApi.appointment.deleteAppointment(appointmentId);
        toast.success("Appointment deleted successfully");
        loadData();
      } catch (error: any) {
        console.error('Error deleting appointment:', error);
        toast.error('Failed to delete appointment');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading appointments...</p>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Appointments Management</h1>
            </div>
            <Button
              onClick={handleCreateAppointment}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Appointment
            </Button>
          </div>
          <p className="text-gray-400 text-lg">
            Manage all appointments, assign doctors, and schedule new appointments
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by patient, doctor, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-6">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No appointments found</p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-white flex items-center gap-3">
                        <User className="h-5 w-5" />
                        {appointment.patient.firstName} {appointment.patient.lastName}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {appointment.patient.primaryEmail}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {appointment.patient.primaryPhone}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(appointment.status)}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditAppointment(appointment)}
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Date</p>
                      <p className="text-white font-medium">
                        {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Time</p>
                      <p className="text-white font-medium">
                        {formatTime(appointment.appointmentTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Doctor</p>
                      <p className="text-white font-medium">{appointment.doctor.firstName} {appointment.doctor.lastName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Service</p>
                      <p className="text-white font-medium">{appointment.service.name}</p>
                    </div>
                  </div>
                  
                  {appointment.patientNotes && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-1">Notes</p>
                      <p className="text-white bg-gray-700 p-3 rounded-lg">{appointment.patientNotes}</p>
                    </div>
                  )}

                  {appointment.googleMeetLink && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-1">Google Meet Link</p>
                      <a
                        href={appointment.googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-300 underline"
                      >
                        Join Meeting
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Create/Edit Appointment Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingAppointment ? "Edit Appointment" : "Create New Appointment"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">Patient</label>
                  <select
                    value={formPatientId}
                    onChange={(e) => setFormPatientId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} - {p.primaryEmail}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Doctor</label>
                  <select
                    value={formDoctorId}
                    onChange={(e) => setFormDoctorId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.firstName} {doctor.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Service</label>
                  <select
                    value={formPrimaryServiceId}
                    onChange={(e) => setFormPrimaryServiceId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="">Select Service</option>
                    {primaryServices.map((ps) => (
                      <option key={ps.id} value={ps.id}>{ps.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Medical Service</label>
                  <select
                    value={formServiceId}
                    onChange={(e) => setFormServiceId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="">Select Medical Service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Available Slot</label>
                  <select
                    value={formSlotId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormSlotId(val);
                      const s = availableSlots.find(s => s.id === val);
                      if (s) {
                        setFormTime(s.startTime);
                        const [sh, sm] = s.startTime.split(":").map(n => parseInt(n, 10));
                        const [eh, em] = s.endTime.split(":").map(n => parseInt(n, 10));
                        const dur = (eh * 60 + em) - (sh * 60 + sm);
                        setFormDuration(dur > 0 ? dur : formDuration);
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    disabled={loadingSlots || !formDoctorId || !formDate}
                  >
                    <option value="">{loadingSlots ? 'Loading slots...' : 'Select Slot'}</option>
                    {availableSlots.map((s) => (
                      <option key={s.id} value={s.id}>{s.startTime} - {s.endTime}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Status</label>
                  <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500">
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Notes</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  rows={3}
                  placeholder="Enter appointment notes"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button onClick={onSubmitCreate} className="bg-red-600 hover:bg-red-700 text-white">
                  {editingAppointment ? "Update Appointment" : "Create Appointment"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminAppointments;
