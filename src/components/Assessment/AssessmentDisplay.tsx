import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, Edit, ChevronDown, ChevronRight } from 'lucide-react';
import { 
  AssessmentValue, 
  fetchAssessmentValuesByAppointment 
} from '@/services/assessmentApi';

interface AssessmentDisplayProps {
  appointmentId: string;
  onEdit?: () => void;
  showEditButton?: boolean;
  compact?: boolean;
}

const AssessmentDisplay: React.FC<AssessmentDisplayProps> = ({
  appointmentId,
  onEdit,
  showEditButton = true,
  compact = false
}) => {
  const [assessmentValues, setAssessmentValues] = useState<AssessmentValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAssessmentValues();
  }, [appointmentId]);

  const loadAssessmentValues = async () => {
    try {
      setLoading(true);
      const values = await fetchAssessmentValuesByAppointment(appointmentId);
      setAssessmentValues(values);
      
      // Auto-expand categories that have values
      const categoriesWithValues = new Set(values.map(v => v.assessmentOption.category));
      setExpandedCategories(categoriesWithValues);
    } catch (error) {
      console.error('Error loading assessment values:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Group values by category
  const groupedValues = assessmentValues.reduce((acc, value) => {
    const category = value.assessmentOption.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(value);
    return acc;
  }, {} as Record<string, AssessmentValue[]>);

  const formatValue = (value: AssessmentValue): string => {
    const { assessmentOption, value: val } = value;
    
    if (assessmentOption.dataType === 'boolean') {
      return val === 'true' ? 'Yes' : 'No';
    }
    
    if (assessmentOption.unit) {
      return `${val} ${assessmentOption.unit}`;
    }
    
    return val;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading assessment...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (assessmentValues.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Assessment</CardTitle>
            {showEditButton && onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Edit className="h-4 w-4 mr-1" />
                Add Assessment
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Eye className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No assessment data available</p>
            <p className="text-gray-400 text-xs mt-1">
              Click "Add Assessment" to start documenting patient assessment
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Assessment</h4>
          {showEditButton && onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {assessmentValues.slice(0, 4).map((value) => (
            <div key={value.id} className="flex justify-between">
              <span className="text-gray-600 truncate">{value.assessmentOption.name}:</span>
              <span className="font-medium text-gray-900">{formatValue(value)}</span>
            </div>
          ))}
          {assessmentValues.length > 4 && (
            <div className="col-span-2 text-xs text-gray-500">
              +{assessmentValues.length - 4} more items
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Patient Assessment</CardTitle>
          {showEditButton && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit Assessment
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedValues).map(([category, values]) => (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  {expandedCategories.has(category) ? (
                    <ChevronDown className="h-4 w-4 text-gray-500 mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500 mr-2" />
                  )}
                  <h3 className="font-medium text-gray-900">{category}</h3>
                  <Badge variant="secondary" className="ml-2">
                    {values.length}
                  </Badge>
                </div>
              </button>

              {expandedCategories.has(category) && (
                <div className="ml-6 mt-2 space-y-3">
                  {values.map((value) => (
                    <div key={value.id} className="border-l-2 border-gray-200 pl-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {value.assessmentOption.name}
                            </span>
                            {value.assessmentOption.unit && (
                              <span className="text-xs text-gray-500">
                                ({value.assessmentOption.unit})
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            {formatValue(value)}
                          </p>
                          {value.notes && (
                            <p className="text-xs text-gray-600 mt-1 italic">
                              Note: {value.notes}
                            </p>
                          )}
                        </div>
                        <Badge 
                          variant="outline" 
                          className="text-green-600 border-green-200 bg-green-50"
                        >
                          Recorded
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total assessments: {assessmentValues.length}</span>
            <span>Last updated: {new Date(assessmentValues[0]?.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentDisplay;
