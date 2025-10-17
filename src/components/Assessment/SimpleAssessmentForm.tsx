import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, Plus, Edit, Eye } from 'lucide-react';
import { 
  AssessmentOption, 
  fetchAssessmentOptions,
  fetchAppointmentAssessmentData
} from '@/services/assessmentApi';
import api from '@/service/api';

interface SimpleAssessmentFormProps {
  appointmentId: string;
  onSave?: (assessmentData: any) => void;
  readonly?: boolean;
}

const SimpleAssessmentForm: React.FC<SimpleAssessmentFormProps> = ({
  appointmentId,
  onSave,
  readonly = false
}) => {
  const [assessmentOptions, setAssessmentOptions] = useState<AssessmentOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [assessmentData, setAssessmentData] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadAssessmentData();
  }, [appointmentId]);

  const loadAssessmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load assessment options
      const options = await fetchAssessmentOptions();
      setAssessmentOptions(options);

      // Load existing assessment data
      const existingData = await fetchAppointmentAssessmentData(appointmentId);
      if (existingData) {
        setAssessmentData(JSON.stringify(existingData, null, 2));
      }
    } catch (err) {
      console.error('Error loading assessment data:', err);
      setError('Failed to load assessment data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validate JSON
      let parsedData;
      try {
        parsedData = JSON.parse(assessmentData);
      } catch (e) {
        setError('Invalid JSON format. Please check your syntax.');
        return;
      }

      // Save to appointment
      const response = await api.put(`/appointments/${appointmentId}`, {
        assessmentData: parsedData
      });

      if (response.data.success) {
        setIsEditing(false);
        if (onSave) {
          onSave(parsedData);
        }
      }
    } catch (err) {
      console.error('Error saving assessment:', err);
      setError('Failed to save assessment data');
    } finally {
      setSaving(false);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    const option = assessmentOptions.find(opt => opt.id === optionId);
    if (option) {
      setSelectedOption(optionId);
      
      // Create a sample JSON structure for the selected option
      const sampleData = {
        [option.name]: {
          value: '',
          notes: '',
          category: option.category,
          dataType: option.dataType,
          unit: option.unit || null,
          timestamp: new Date().toISOString()
        }
      };
      
      setAssessmentData(JSON.stringify(sampleData, null, 2));
    }
  };

  const addToExistingData = () => {
    if (!selectedOption) return;
    
    const option = assessmentOptions.find(opt => opt.id === selectedOption);
    if (!option) return;

    try {
      let existingData = {};
      if (assessmentData.trim()) {
        existingData = JSON.parse(assessmentData);
      }

      const newEntry = {
        [option.name]: {
          value: '',
          notes: '',
          category: option.category,
          dataType: option.dataType,
          unit: option.unit || null,
          timestamp: new Date().toISOString()
        }
      };

      const updatedData = { ...existingData, ...newEntry };
      setAssessmentData(JSON.stringify(updatedData, null, 2));
    } catch (e) {
      setError('Invalid JSON format. Please fix the current data first.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading assessment options...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Assessment Options Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-900">
            Select Assessment Option
          </Label>
          {selectedOption && !readonly && (
            <Button
              variant="outline"
              size="sm"
              onClick={addToExistingData}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add to Assessment
            </Button>
          )}
        </div>

        <Select
          value={selectedOption}
          onValueChange={handleOptionSelect}
          disabled={readonly}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose an assessment option..." />
          </SelectTrigger>
          <SelectContent>
            {assessmentOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{option.name}</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {option.category}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Assessment Data Editor */}
      {assessmentData && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-900">
              Assessment Data (JSON)
            </Label>
            {!readonly && (
              <div className="flex space-x-2">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      className="text-gray-600 border-gray-200 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          <Textarea
            value={assessmentData}
            onChange={(e) => setAssessmentData(e.target.value)}
            placeholder="Assessment data will appear here as JSON..."
            rows={8}
            disabled={!isEditing || readonly}
            className="font-mono text-sm"
          />

          <div className="text-xs text-gray-500">
            <p>💡 <strong>Tip:</strong> This JSON data will be linked to the appointment. You can add multiple assessment entries by selecting different options and clicking "Add to Assessment".</p>
          </div>
        </div>
      )}

      {assessmentOptions.length === 0 && (
        <div className="text-center py-6">
          <p className="text-gray-500">No assessment options available.</p>
          <p className="text-gray-400 text-sm mt-1">
            Assessment options need to be added to the database first.
          </p>
        </div>
      )}
    </div>
  );
};

export default SimpleAssessmentForm;
