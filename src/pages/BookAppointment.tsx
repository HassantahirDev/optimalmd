import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppointmentBooking from '@/components/AppointmentBooking';
import { getAuthToken, getUserType, getUserId } from '@/lib/utils';

const BookAppointment: React.FC = () => {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get patient ID from localStorage or auth context
    const token = getAuthToken();
    const storedUserType = getUserType();
    const storedUserId = getUserId();
    
    if (!token) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    if (storedUserType !== 'user') {
      toast.error('Only patients can book appointments');
      navigate('/dashboard');
      return;
    }

    if (storedUserId) {
      setPatientId(storedUserId);
    } else {
      toast.error('User information not found');
      navigate('/login');
      return;
    }

    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!patientId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only patients can book appointments.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppointmentBooking patientId={patientId} />
    </div>
  );
};

export default BookAppointment;
