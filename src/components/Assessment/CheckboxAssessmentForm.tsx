import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, Edit, Eye, Info } from 'lucide-react';
import { 
  AssessmentOption, 
  fetchAssessmentOptions,
  fetchAppointmentAssessmentData
} from '@/services/assessmentApi';
import api from '@/service/api';

interface CheckboxAssessmentFormProps {
  appointmentId: string;
  onSave?: (assessmentData: any) => void;
  readonly?: boolean;
}

interface AssessmentData {
  [key: string]: {
    content: string; // Markdown content
    timestamp: string;
    category: string;
  };
}

const CheckboxAssessmentForm: React.FC<CheckboxAssessmentFormProps> = ({
  appointmentId,
  onSave,
  readonly = false
}) => {
  const [assessmentOptions, setAssessmentOptions] = useState<AssessmentOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({});
  const [currentContent, setCurrentContent] = useState<string>('');
  const [currentOption, setCurrentOption] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setAssessmentData(existingData);
        
        // Set selected options based on existing data
        const selected = new Set(Object.keys(existingData));
        setSelectedOptions(selected);
      }
    } catch (err) {
      console.error('Error loading assessment data:', err);
      setError('Failed to load assessment data');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionToggle = (optionId: string, checked: boolean) => {
    const newSelected = new Set(selectedOptions);
    
    if (checked) {
      // Only allow one selection at a time
      newSelected.clear();
      newSelected.add(optionId);
      setSelectedOptions(newSelected);
      
      // Load content for this option
      const option = assessmentOptions.find(opt => opt.id === optionId);
      if (option) {
        setCurrentOption(optionId);
        setCurrentContent(assessmentData[optionId]?.content || getDefaultContent(option));
      }
    } else {
      newSelected.delete(optionId);
      setSelectedOptions(newSelected);
      
      if (currentOption === optionId) {
        setCurrentOption('');
        setCurrentContent('');
      }
    }
  };

  const getDefaultContent = (option: AssessmentOption): string => {
    return `# ${option.name}

## Assessment Details
- **Category**: ${option.category}
- **Type**: ${option.dataType}
${option.unit ? `- **Unit**: ${option.unit}` : ''}

## Findings
• 

## Notes
• 

## Recommendations
• 

---
*Assessment completed on ${new Date().toLocaleDateString()}*`;
  };

  const handleContentChange = (content: string) => {
    setCurrentContent(content);
    
    // Update assessment data
    if (currentOption) {
      setAssessmentData(prev => ({
        ...prev,
        [currentOption]: {
          content,
          timestamp: new Date().toISOString(),
          category: assessmentOptions.find(opt => opt.id === currentOption)?.category || ''
        }
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Save to appointment
      const response = await api.put(`/appointments/${appointmentId}`, {
        assessmentData: assessmentData
      });

      if (response.data.success) {
        if (onSave) {
          onSave(assessmentData);
        }
      }
    } catch (err) {
      console.error('Error saving assessment:', err);
      setError('Failed to save assessment data');
    } finally {
      setSaving(false);
    }
  };

  // Group options by category
  const groupedOptions = assessmentOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, AssessmentOption[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading assessment options...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Assessment Options Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Info className="h-4 w-4 text-blue-600" />
          <Label className="text-sm font-medium text-gray-900">
            Select Assessment (choose one at a time)
          </Label>
        </div>

        {Object.entries(groupedOptions).map(([category, options]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900">{category}</h3>
              <Badge variant="secondary" className="text-xs">
                {options.length} options
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 gap-2 pl-4">
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50">
                  <Checkbox
                    id={option.id}
                    checked={selectedOptions.has(option.id)}
                    onCheckedChange={(checked) => handleOptionToggle(option.id, checked as boolean)}
                    disabled={readonly}
                  />
                  <Label 
                    htmlFor={option.id} 
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.name}</span>
                      <div className="flex items-center space-x-2">
                        {option.unit && (
                          <Badge variant="outline" className="text-xs">
                            {option.unit}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {option.dataType}
                        </Badge>
                      </div>
                    </div>
                    {option.description && (
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    )}
                  </Label>
                </div>
              ))}
            </div>
            
            {Object.keys(groupedOptions).indexOf(category) < Object.keys(groupedOptions).length - 1 && (
              <Separator className="my-4" />
            )}
          </div>
        ))}
      </div>

      {/* Assessment Content Editor */}
      {currentOption && currentContent && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-900">
              Assessment Content (Markdown)
            </Label>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {assessmentOptions.find(opt => opt.id === currentOption)?.category}
              </Badge>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving || readonly}
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
            </div>
          </div>

          <Textarea
            value={currentContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Enter assessment content in Markdown format..."
            rows={12}
            disabled={readonly}
            className="font-mono text-sm"
          />

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Markdown Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><code># Header</code> for main headings</li>
              <li><code>## Subheader</code> for subheadings</li>
              <li><code>• Bullet point</code> for lists</li>
              <li><code>**Bold text**</code> for emphasis</li>
              <li><code>*Italic text*</code> for emphasis</li>
              <li><code>---</code> for horizontal lines</li>
            </ul>
          </div>
        </div>
      )}

      {assessmentOptions.length === 0 && (
        <div className="text-center py-6">
          <Eye className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No assessment options available.</p>
          <p className="text-gray-400 text-sm mt-1">
            Assessment options need to be added to the database first.
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckboxAssessmentForm;
