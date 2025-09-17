import React from 'react';
import MedicalConsultationForm from '@/components/Patient/MedicalConsultationForm';
import ProtectedRoute from '@/components/ProtectedRoute';

const MedicalFormPage: React.FC = () => {
  return (
    <ProtectedRoute requiredUserType="user">
      <div className="min-h-screen py-8" style={{ backgroundColor: "#151515" }}>
        <MedicalConsultationForm />
      </div>
    </ProtectedRoute>
  );
};

export default MedicalFormPage;
