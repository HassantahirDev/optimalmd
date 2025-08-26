// components/MyAppointments.tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { getUserId } from "@/lib/utils";
import { fetchPatientAppointments } from "@/redux/slice/appointmentSlice";
import { Calendar, Clock, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MyAppointmentsProps {
  patientName?: string;
}

const MyAppointments: React.FC<MyAppointmentsProps> = ({
  patientName = localStorage.getItem("name") || "",
}) => {
  const dispatch = useAppDispatch();
  const { patientAppointments, appointmentsLoading } = useAppSelector(
    (state) => state.appointment
  );

  const userId = getUserId();

  useEffect(() => {
    if (userId) {
      dispatch(fetchPatientAppointments({ patientId: userId }));
    }
  }, [userId, dispatch]);

  // Pick the next appointment
  const nextAppointment = patientAppointments
    ?.filter((a) => a.status !== "cancelled")
    ?.sort(
      (a, b) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime()
    )?.[0];

  // Formatters
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // helpers
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayAppointments = patientAppointments?.filter(
    (a) =>
      new Date(a.appointmentDate).setHours(0, 0, 0, 0) === today.getTime() &&
      a.status !== "cancelled"
  );

  const upcomingAppointments = patientAppointments?.filter(
    (a) => new Date(a.appointmentDate) > today && a.status !== "cancelled"
  );

  const pastAppointments = patientAppointments?.filter(
    (a) => new Date(a.appointmentDate) < today && a.status !== "cancelled"
  );

  return (
    <div className="flex-1 p-8 text-white">
      {/* Greeting */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hello, {patientName}! 👋</h1>
          <p className="text-gray-400">Here’s what’s next for your health.</p>
        </div>
        <Button className="bg-red-500 hover:bg-red-600 rounded-full px-6">
          + Book a New Appointment
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="mb-6 grid grid-cols-4 bg-neutral-800 rounded-lg">
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        {/* Current */}
        <TabsContent value="current">
          <div className="bg-neutral-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-6">Current Appointment</h2>
            {appointmentsLoading ? (
              <p className="text-gray-400">Loading appointment...</p>
            ) : !nextAppointment ? (
              <p className="text-gray-400">No upcoming appointments.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Date */}
                <div className="bg-black rounded-lg p-4 flex items-center gap-3">
                  <Calendar className="text-red-500" />
                  <div>
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="font-medium">
                      {formatDate(nextAppointment.appointmentDate)}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="bg-black rounded-lg p-4 flex items-center gap-3">
                  <Clock className="text-red-500" />
                  <div>
                    <p className="text-sm text-gray-400">Time</p>
                    <p className="font-medium">
                      {formatTime(nextAppointment.appointmentTime)} CST
                    </p>
                  </div>
                </div>

                {/* Provider */}
                <div className="bg-black rounded-lg p-4 flex items-center gap-3">
                  <User className="text-red-500" />
                  <div>
                    <p className="text-sm text-gray-400">Provider</p>
                    <p className="font-medium">
                      Dr. {nextAppointment.doctor?.firstName}{" "}
                      {nextAppointment.doctor?.lastName}
                    </p>
                  </div>
                </div>

                {/* Location */}
                {/* {nextAppointment.slot?.location || nextAppointment.slot?.type ? (
                  <div className="bg-black rounded-lg p-4 flex items-center gap-3">
                    <MapPin className="text-red-500" />
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="font-medium">
                        {nextAppointment.slot?.location
                          ? nextAppointment.slot.location
                          : nextAppointment.slot?.type?.toLowerCase() ===
                            "telemedicine"
                          ? "Online"
                          : "In-Person"}
                      </p>
                    </div>
                  </div>
                ) : null} */}
              </div>
            )}

            {nextAppointment && (
              <div className="flex gap-4">
                <Button className="bg-gray-700 hover:bg-gray-600">
                  Reschedule
                </Button>
                <Button className="bg-red-500 hover:bg-red-600">
                  Cancel Appointment
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Today */}
        <TabsContent value="today">
          <div className="bg-neutral-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-6">Today’s Appointments</h2>
            {todayAppointments?.length ? (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-black rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="text-red-500" />
                      <div>
                        <p className="font-medium">
                          {formatTime(appointment.appointmentTime)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Dr. {appointment.doctor?.firstName}{" "}
                          {appointment.doctor?.lastName}
                        </p>
                      </div>
                    </div>
                    <Button className="bg-gray-700 hover:bg-gray-600">
                      Join
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No appointments today.</p>
            )}
          </div>
        </TabsContent>

        {/* Upcoming */}
        <TabsContent value="upcoming">
          <div className="bg-neutral-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-6">
              Upcoming Appointments
            </h2>
            {upcomingAppointments?.length ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-black rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="text-red-500" />
                      <div>
                        <p className="font-medium">
                          {formatDate(appointment.appointmentDate)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Dr. {appointment.doctor?.firstName}{" "}
                          {appointment.doctor?.lastName}
                        </p>
                      </div>
                    </div>
                    <Button className="bg-gray-700 hover:bg-gray-600">
                      Details
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No upcoming appointments.</p>
            )}
          </div>
        </TabsContent>

        {/* Past */}
        <TabsContent value="past">
          <div className="bg-neutral-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-6">Past Appointments</h2>
            {pastAppointments?.length ? (
              <div className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-black rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="text-red-500" />
                      <div>
                        <p className="font-medium">
                          {formatDate(appointment.appointmentDate)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Dr. {appointment.doctor?.firstName}{" "}
                          {appointment.doctor?.lastName}
                        </p>
                      </div>
                    </div>
                    <Button className="bg-gray-700 hover:bg-gray-600">
                      Rebook
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No past appointments.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyAppointments;
