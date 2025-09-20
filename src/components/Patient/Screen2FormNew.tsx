import React, { useState } from 'react';
import api from '@/service/api';

interface Screen2FormProps {
  onComplete: () => void;
}

const Screen2FormNew: React.FC<Screen2FormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    waist: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put('/intake/screen2', formData);
      onComplete();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete Screen 2');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '28rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb', textAlign: 'center', marginBottom: '1rem' }}>
          Screen 2 - About You
        </h2>
        <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '1.5rem' }}>
          Please provide your physical measurements
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="height" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
              Height
            </label>
            <input
              id="height"
              type="text"
              placeholder={'e.g., 5\'10" or 178 cm'}
              value={formData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              required
            />
          </div>
          <div>
            <label htmlFor="weight" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
              Weight
            </label>
            <input
              id="weight"
              type="text"
              placeholder={'e.g., 70 kg or 154 lbs'}
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              required
            />
          </div>
          <div>
            <label htmlFor="waist" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
              Waist
            </label>
            <input
              id="waist"
              type="text"
              placeholder={'e.g., 32 inches or 81 cm'}
              value={formData.waist}
              onChange={(e) => handleInputChange('waist', e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              required
            />
          </div>
          
          {error && (
            <div style={{ color: '#dc2626', fontSize: '0.875rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              backgroundColor: loading ? '#9ca3af' : '#2563eb', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '0.375rem', 
              border: 'none', 
              cursor: loading ? 'not-allowed' : 'pointer' 
            }}
          >
            {loading ? 'Completing...' : 'Complete Screen 2'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Screen2FormNew;
