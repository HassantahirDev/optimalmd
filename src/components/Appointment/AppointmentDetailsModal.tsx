import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/utils/timeUtils";

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  appointment: any | null;
  onClose: () => void;
}

export default function AppointmentDetailsModal({ isOpen, appointment, onClose }: AppointmentDetailsModalProps) {
  if (!isOpen || !appointment) return null;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getStatusBadge = (status: string) => {
    const base = "text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5";
    switch ((status || '').toLowerCase()) {
      case "confirmed":
        return <Badge className={`bg-green-100 text-green-800 border-green-200 ${base}`}>Confirmed</Badge>;
      case "pending":
        return <Badge className={`bg-yellow-100 text-yellow-800 border-yellow-200 ${base}`}>Pending</Badge>;
      case "completed":
        return <Badge className={`bg-blue-100 text-blue-800 border-blue-200 ${base}`}>Completed</Badge>;
      case "cancelled":
        return <Badge className={`bg-red-100 text-red-800 border-red-200 ${base}`}>Cancelled</Badge>;
      default:
        return <Badge className={`bg-gray-100 text-gray-800 border-gray-200 ${base}`}>{status}</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-black border border-gray-800 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">Appointment Details</h2>
          <button onClick={onClose} className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-white">Close</button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4 bg-transparent border-0 p-0 gap-2 w-full flex overflow-x-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-red-500 data-[state=active]:text-white bg-gray-700 text-gray-300 px-4 py-2 rounded-full">Overview</TabsTrigger>
            <TabsTrigger value="medications" className="data-[state=active]:bg-red-500 data-[state=active]:text-white bg-gray-700 text-gray-300 px-4 py-2 rounded-full">Medications</TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-red-500 data-[state=active]:text-white bg-gray-700 text-gray-300 px-4 py-2 rounded-full">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                <p className="text-gray-400 text-xs mb-1">Date</p>
                <p className="text-white font-medium">{formatDate(appointment.appointmentDate)} {appointment.appointmentTime && `• ${formatTime(appointment.appointmentTime)}`}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                <p className="text-gray-400 text-xs mb-1">Doctor</p>
                <p className="text-white font-medium">Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                <p className="text-gray-400 text-xs mb-1">Service</p>
                <p className="text-white font-medium">{appointment.service?.name}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                <p className="text-gray-400 text-xs mb-1">Status</p>
                <div>{getStatusBadge(appointment.status)}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="medications" className="mt-0">
            {appointment.medications ? (
              <div className="space-y-3">
                {Object.entries(appointment.medications as Record<string, string[]>)
                  .map(([service, meds]) => (
                    <div key={service} className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                      <p className="text-gray-300 text-sm mb-2">{service}</p>
                      <div className="flex flex-wrap gap-2">
                        {meds.map((m) => (
                          <span key={m} className="inline-block mr-2 mb-2 px-2 py-1 rounded-full bg-gray-950 border border-gray-700 text-gray-200">{m}</span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-400">No medications assigned.</p>
            )}
          </TabsContent>

          <TabsContent value="notes" className="mt-0">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                <p className="text-gray-400 text-xs mb-1">Patient Notes</p>
                <p className="text-white whitespace-pre-wrap">{appointment.patientNotes || '—'}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                <p className="text-gray-400 text-xs mb-1">Symptoms</p>
                <p className="text-white whitespace-pre-wrap">{appointment.symptoms || '—'}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


