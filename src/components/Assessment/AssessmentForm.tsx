import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { 
  AssessmentOption, 
  AssessmentValue, 
  CreateAssessmentValueDto,
  fetchAssessmentOptions,
  saveBulkAssessmentValues,
  fetchAssessmentValuesByAppointment
} from '@/services/assessmentApi';

interface AssessmentFormProps {
  appointmentId: string;
  onSave?: (values: AssessmentValue[]) => void;
  onCancel?: () => void;
  readonly?: boolean;
}

interface AssessmentFormData {
  [optionId: string]: {
    value: string;
    notes: string;
  };
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  appointmentId,
  onSave,
  onCancel,
  readonly = false
}) => {
  const [assessmentOptions, setAssessmentOptions] = useState<AssessmentOption[]>([]);
  const [formData, setFormData] = useState<AssessmentFormData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Group options by category
  const groupedOptions = assessmentOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, AssessmentOption[]>);

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

      // Load existing assessment values
      const existingValues = await fetchAssessmentValuesByAppointment(appointmentId);
      
      // Convert existing values to form data
      const initialFormData: AssessmentFormData = {};
      existingValues.forEach(value => {
        initialFormData[value.assessmentOptionId] = {
          value: value.value,
          notes: value.notes || ''
        };
      });

      setFormData(initialFormData);
    } catch (err) {
      console.error('Error loading assessment data:', err);
      setError('Failed to load assessment data');
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (optionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [optionId]: {
        ...prev[optionId],
        value
      }
    }));
  };

  const handleNotesChange = (optionId: string, notes: string) => {
    setFormData(prev => ({
      ...prev,
      [optionId]: {
        ...prev[optionId],
        notes
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Convert form data to API format
      const values: CreateAssessmentValueDto[] = Object.entries(formData)
        .filter(([_, data]) => data.value.trim() !== '')
        .map(([optionId, data]) => ({
          assessmentOptionId: optionId,
          value: data.value,
          notes: data.notes || undefined
        }));

      const savedValues = await saveBulkAssessmentValues(appointmentId, { values });
      
      if (onSave) {
        onSave(savedValues);
      }
    } catch (err) {
      console.error('Error saving assessment:', err);
      setError('Failed to save assessment data');
    } finally {
      setSaving(false);
    }
  };

  const renderInput = (option: AssessmentOption) => {
    const currentData = formData[option.id] || { value: '', notes: '' };

    switch (option.dataType) {
      case 'text':
        return (
          <Input
            value={currentData.value}
            onChange={(e) => handleValueChange(option.id, e.target.value)}
            placeholder={`Enter ${option.name.toLowerCase()}`}
            disabled={readonly}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={currentData.value}
            onChange={(e) => handleValueChange(option.id, e.target.value)}
            placeholder={`Enter ${option.name.toLowerCase()}`}
            disabled={readonly}
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${option.id}-checkbox`}
              checked={currentData.value === 'true'}
              onCheckedChange={(checked) => handleValueChange(option.id, checked ? 'true' : 'false')}
              disabled={readonly}
            />
            <Label htmlFor={`${option.id}-checkbox`}>
              {currentData.value === 'true' ? 'Yes' : 'No'}
            </Label>
          </div>
        );

      case 'select':
        return (
          <Select
            value={currentData.value}
            onValueChange={(value) => handleValueChange(option.id, value)}
            disabled={readonly}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${option.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {option.options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'textarea':
        return (
          <Textarea
            value={currentData.value}
            onChange={(e) => handleValueChange(option.id, e.target.value)}
            placeholder={`Enter ${option.name.toLowerCase()}`}
            rows={3}
            disabled={readonly}
          />
        );

      default:
        return (
          <Input
            value={currentData.value}
            onChange={(e) => handleValueChange(option.id, e.target.value)}
            placeholder={`Enter ${option.name.toLowerCase()}`}
            disabled={readonly}
          />
        );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading assessment options...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Patient Assessment</span>
          {!readonly && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Assessment
                  </>
                )}
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {Object.entries(groupedOptions).map(([category, options]) => (
            <div key={category}>
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                <Badge variant="secondary" className="ml-2">
                  {options.length} items
                </Badge>
              </div>
              
              <div className="grid gap-4">
                {options.map((option) => {
                  const currentData = formData[option.id] || { value: '', notes: '' };
                  const hasValue = currentData.value.trim() !== '';
                  
                  return (
                    <div key={option.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-gray-900">
                            {option.name}
                            {option.isRequired && <span className="text-red-500 ml-1">*</span>}
                            {option.unit && <span className="text-gray-500 ml-1">({option.unit})</span>}
                          </Label>
                          {option.description && (
                            <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                          )}
                        </div>
                        {hasValue && (
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            Completed
                          </Badge>
                        )}
                      </div>

                      <div className="mb-3">
                        {renderInput(option)}
                      </div>

                      {option.dataType !== 'textarea' && (
                        <div>
                          <Label className="text-xs text-gray-600">Notes (optional)</Label>
                          <Textarea
                            value={currentData.notes}
                            onChange={(e) => handleNotesChange(option.id, e.target.value)}
                            placeholder="Additional notes..."
                            rows={2}
                            className="mt-1"
                            disabled={readonly}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {Object.keys(groupedOptions).indexOf(category) < Object.keys(groupedOptions).length - 1 && (
                <Separator className="my-6" />
              )}
            </div>
          ))}
        </div>

        {assessmentOptions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No assessment options available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentForm;
