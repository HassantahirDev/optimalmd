import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Edit, ChevronDown, ChevronRight } from 'lucide-react';
import { fetchAppointmentAssessmentData } from '@/services/assessmentApi';

interface SimpleAssessmentDisplayProps {
  appointmentId: string;
  onEdit?: () => void;
  showEditButton?: boolean;
  compact?: boolean;
}

const SimpleAssessmentDisplay: React.FC<SimpleAssessmentDisplayProps> = ({
  appointmentId,
  onEdit,
  showEditButton = true,
  compact = false
}) => {
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadAssessmentData();
  }, [appointmentId]);

  const loadAssessmentData = async () => {
    try {
      setLoading(true);
      const data = await fetchAppointmentAssessmentData(appointmentId);
      setAssessmentData(data);
    } catch (error) {
      console.error('Error loading assessment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: any): string => {
    if (typeof value === 'object' && value !== null) {
      if (value.value !== undefined) {
        return value.unit ? `${value.value} ${value.unit}` : value.value;
      }
      return JSON.stringify(value);
    }
    return String(value);
  };

  const formatTimestamp = (timestamp: string): string => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 text-sm">Loading assessment...</span>
      </div>
    );
  }

  if (!assessmentData || Object.keys(assessmentData).length === 0) {
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
              Add Assessment
            </Button>
          )}
        </div>
        <div className="text-center py-4">
          <Eye className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No assessment data available</p>
        </div>
      </div>
    );
  }

  const assessmentEntries = Object.entries(assessmentData);
  const hasMultipleEntries = assessmentEntries.length > 1;

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
        <div className="space-y-1">
          {assessmentEntries.slice(0, 3).map(([key, value]: [string, any]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-gray-600 truncate">{key}:</span>
              <span className="font-medium text-gray-900">{formatValue(value)}</span>
            </div>
          ))}
          {assessmentEntries.length > 3 && (
            <div className="text-xs text-gray-500">
              +{assessmentEntries.length - 3} more items
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
        <div className="space-y-3">
          {hasMultipleEntries && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {assessmentEntries.length} assessment entries
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="text-gray-600 hover:text-gray-900"
              >
                {expanded ? (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Expand All
                  </>
                )}
              </Button>
            </div>
          )}

          {assessmentEntries.map(([key, value]: [string, any]) => (
            <div key={key} className="border-l-2 border-blue-200 pl-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{key}</h4>
                    {value.category && (
                      <Badge variant="secondary" className="text-xs">
                        {value.category}
                      </Badge>
                    )}
                    {value.dataType && (
                      <Badge variant="outline" className="text-xs">
                        {value.dataType}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-700">
                    {formatValue(value)}
                  </p>
                  
                  {value.notes && (
                    <p className="text-xs text-gray-600 mt-1 italic">
                      Note: {value.notes}
                    </p>
                  )}
                  
                  {value.timestamp && (
                    <p className="text-xs text-gray-500 mt-1">
                      Recorded: {formatTimestamp(value.timestamp)}
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

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total assessments: {assessmentEntries.length}</span>
            <span>
              Last updated: {formatTimestamp(
                assessmentEntries[0]?.[1]?.timestamp || new Date().toISOString()
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleAssessmentDisplay;
