import { useState, useEffect } from 'react';
import api from '@/service/api';

interface IntakeStatus {
  hasCompletedIntake: boolean;
  needsScreen2: boolean;
}

export const useIntakeStatus = () => {
  const [intakeStatus, setIntakeStatus] = useState<IntakeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkIntakeStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/intake/status');
      setIntakeStatus(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to check intake status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      checkIntakeStatus();
    } else {
      setLoading(false);
    }
  }, []);

  return {
    intakeStatus,
    loading,
    error,
    refetch: checkIntakeStatus,
  };
};
