// components/MyAppointments.tsx
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { getUserId } from "@/lib/utils";
import { fetchPatientAppointments } from "@/redux/slice/appointmentSlice";
import { Calendar, Clock, User, Stethoscope, DollarSign, Loader2 } from "lucide-react";

interface MyAppointmentsProps {
  patientName?: string;
}

const MyAppointments: React.FC<MyAppointmentsProps> = ({
  patientName = localStorage.getItem('name') || '',
}) => {
  const dispatch = useAppDispatch();
  const {
    patientAppointments,
    appointmentsLoading,
    appointmentsError,
  } = useAppSelector((state) => state.appointment);

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'today'>('upcoming');

  // Get user ID directly from localStorage
  const userId = getUserId();

  useEffect(() => {
    if (userId) {
      // Fetch all appointments for the patient
      dispatch(fetchPatientAppointments({ patientId: userId }));
    }
  }, [userId, dispatch]);

  // Filter appointments based on active tab
  const getFilteredAppointments = () => {
    if (!patientAppointments || patientAppointments.length === 0) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return patientAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0);

      switch (activeTab) {
        case 'upcoming':
          return appointmentDate > today && appointment.status !== 'cancelled';
        case 'past':
          return appointmentDate < today && appointment.status !== 'cancelled';
        case 'today':
          return appointmentDate.getTime() === today.getTime() && appointment.status !== 'cancelled';
        default:
          return false;
      }
    });
  };

  const filteredAppointments = getFilteredAppointments();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'cancelled':
        return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'completed':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: getFilteredAppointments().filter(a => new Date(a.appointmentDate) > new Date() && a.status !== 'cancelled').length },
    { id: 'today', label: 'Today', count: getFilteredAppointments().filter(a => {
      const today = new Date();
      const appointmentDate = new Date(a.appointmentDate);
      return today.toDateString() === appointmentDate.toDateString() && a.status !== 'cancelled';
    }).length },
    { id: 'past', label: 'Past', count: getFilteredAppointments().filter(a => new Date(a.appointmentDate) < new Date() && a.status !== 'cancelled').length },
  ];

  return (
    <div className="flex-1 text-white">
      {/* Appointments Card */}
      <div className="mx-8 mt-8">
        <div
          className="bg-gray-800 rounded-3xl p-8"
          style={{ backgroundColor: "#2a2a2a" }}
        >
          <h2 className="text-2xl font-bold text-white mb-8">
            My Appointments
          </h2>

          {/* Error Display */}
          {appointmentsError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400">{appointmentsError}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-700 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'upcoming' | 'past' | 'today')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-red-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Loading State */}
          {appointmentsLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-red-500" size={32} />
              <span className="ml-3 text-gray-400 text-lg">Loading appointments...</span>
            </div>
          )}

          {/* Appointments List */}
          {!appointmentsLoading && (
            <>
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto text-gray-500" size={48} />
                  <p className="text-gray-400 text-lg mt-4">
                    No {activeTab} appointments found.
                  </p>
                  {activeTab === 'upcoming' && (
                    <p className="text-gray-500 mt-2">
                      Book an appointment to get started.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-gray-500 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <User className="text-red-500" size={20} />
                              <span className="font-medium text-white">
                                {appointment.doctor?.title} {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Stethoscope className="text-blue-500" size={20} />
                              <span className="text-gray-300">
                                {appointment.doctor?.specialization}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center gap-2">
                              <Calendar className="text-green-500" size={20} />
                              <span className="text-gray-300">
                                {formatDate(appointment.appointmentDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="text-purple-500" size={20} />
                              <span className="text-gray-300">
                                {formatTime(appointment.appointmentTime)} ({appointment.duration} min)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <DollarSign className="text-yellow-500" size={20} />
                              <span className="text-gray-300">
                                ${appointment.amount}
                              </span>
                            </div>
                            <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </div>
                          </div>

                          {appointment.patientNotes && (
                            <div className="mt-4 p-3 bg-gray-600 rounded-lg">
                              <p className="text-gray-300 text-sm">
                                <span className="font-medium">Notes:</span> {appointment.patientNotes}
                              </p>
                            </div>
                          )}

                          {appointment.symptoms && (
                            <div className="mt-3 p-3 bg-gray-600 rounded-lg">
                              <p className="text-gray-300 text-sm">
                                <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
