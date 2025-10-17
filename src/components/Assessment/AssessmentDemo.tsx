import React, { useState } from 'react';
import { CheckboxAssessmentForm, CheckboxAssessmentDisplay } from './index';

const AssessmentDemo: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [appointmentId] = useState('demo-appointment-id');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Assessment Demo</h1>
        <p className="text-gray-600">Checkbox-based assessment with Markdown support</p>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Hide Form' : 'Show Form'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Assessment Form</h2>
          <CheckboxAssessmentForm
            appointmentId={appointmentId}
            onSave={(data) => {
              console.log('Assessment saved:', data);
              setShowForm(false);
            }}
          />
        </div>
      )}

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Assessment Display</h2>
        <CheckboxAssessmentDisplay
          appointmentId={appointmentId}
          onEdit={() => setShowForm(true)}
          showEditButton={true}
          compact={false}
        />
      </div>

      <div className="bg-gray-50 border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">How it works:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Checkboxes:</strong> Select one assessment at a time from available options</li>
          <li>• <strong>Markdown Editor:</strong> Rich text editing with bullet points, headers, and formatting</li>
          <li>• <strong>Auto-save:</strong> Content is saved as you type</li>
          <li>• <strong>Expandable Display:</strong> Click to expand/collapse assessment details</li>
          <li>• <strong>Formatted Output:</strong> Markdown is rendered with proper styling</li>
        </ul>
      </div>
    </div>
  );
};

export default AssessmentDemo;
