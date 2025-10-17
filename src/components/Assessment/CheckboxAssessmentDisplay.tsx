import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Edit, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { fetchAppointmentAssessmentData } from '@/services/assessmentApi';

interface CheckboxAssessmentDisplayProps {
  appointmentId: string;
  onEdit?: () => void;
  showEditButton?: boolean;
  compact?: boolean;
}

interface AssessmentData {
  [key: string]: {
    content: string;
    timestamp: string;
    category: string;
  };
}

// Simple Markdown renderer for basic formatting
const renderMarkdown = (content: string): JSX.Element => {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-xl font-bold text-gray-900 mt-4 mb-2">
          {line.substring(2)}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-lg font-semibold text-gray-800 mt-3 mb-2">
          {line.substring(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-base font-medium text-gray-700 mt-2 mb-1">
          {line.substring(4)}
        </h3>
      );
    } else if (line.startsWith('• ')) {
      elements.push(
        <li key={key++} className="text-sm text-gray-700 ml-4 mb-1">
          {line.substring(2)}
        </li>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={key++} className="text-sm text-gray-700 ml-4 mb-1">
          {line.substring(2)}
        </li>
      );
    } else if (line.startsWith('---')) {
      elements.push(
        <hr key={key++} className="my-3 border-gray-300" />
      );
    } else if (line.trim() === '') {
      elements.push(<br key={key++} />);
    } else {
      // Handle inline formatting
      let formattedLine = line;
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
      formattedLine = formattedLine.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>');
      
      elements.push(
        <p 
          key={key++} 
          className="text-sm text-gray-700 mb-2"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    }
  }

  return <div>{elements}</div>;
};

const CheckboxAssessmentDisplay: React.FC<CheckboxAssessmentDisplayProps> = ({
  appointmentId,
  onEdit,
  showEditButton = true,
  compact = false
}) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({});
  const [loading, setLoading] = useState(true);
  const [expandedAssessments, setExpandedAssessments] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAssessmentData();
  }, [appointmentId]);

  const loadAssessmentData = async () => {
    try {
      setLoading(true);
      const data = await fetchAppointmentAssessmentData(appointmentId);
      setAssessmentData(data || {});
      
      // Auto-expand assessments that have content
      const assessmentsWithContent = Object.keys(data || {}).filter(
        key => data[key]?.content?.trim()
      );
      setExpandedAssessments(new Set(assessmentsWithContent));
    } catch (error) {
      console.error('Error loading assessment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAssessment = (assessmentKey: string) => {
    setExpandedAssessments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assessmentKey)) {
        newSet.delete(assessmentKey);
      } else {
        newSet.add(assessmentKey);
      }
      return newSet;
    });
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

  const assessmentEntries = Object.entries(assessmentData).filter(
    ([_, data]) => data?.content?.trim()
  );

  if (assessmentEntries.length === 0) {
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
          <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No assessment data available</p>
        </div>
      </div>
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
        <div className="space-y-1">
          {assessmentEntries.slice(0, 3).map(([key, data]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-gray-600 truncate">{key}:</span>
              <span className="font-medium text-gray-900">
                {data.content.split('\n')[0].substring(0, 30)}...
              </span>
            </div>
          ))}
          {assessmentEntries.length > 3 && (
            <div className="text-xs text-gray-500">
              +{assessmentEntries.length - 3} more assessments
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
          {assessmentEntries.map(([key, data]) => (
            <div key={key} className="border rounded-lg p-4">
              <button
                onClick={() => toggleAssessment(key)}
                className="flex items-center justify-between w-full text-left hover:bg-gray-50 rounded-md p-2 -m-2 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {expandedAssessments.has(key) ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{key}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {data.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(data.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className="text-green-600 border-green-200 bg-green-50"
                >
                  Completed
                </Badge>
              </button>

              {expandedAssessments.has(key) && (
                <div className="mt-4 pl-7">
                  <div className="prose prose-sm max-w-none">
                    {renderMarkdown(data.content)}
                  </div>
                </div>
              )}
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

export default CheckboxAssessmentDisplay;
