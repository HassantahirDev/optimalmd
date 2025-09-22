import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/service/api';

interface IntakeFormProps {
  appointmentId: string;
  onComplete: () => void;
}

const IntakeForm: React.FC<IntakeFormProps> = ({ appointmentId, onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Screen 3 - Your Goals
    goalMoreEnergy: false,
    goalBetterSexualPerformance: false,
    goalLoseWeight: false,
    goalHairRestoration: false,
    goalImproveMood: false,
    goalLongevity: false,
    goalOther: false,
    goalOtherDescription: '',

    // Screen 4 - Medical Background
    chronicConditions: '',
    pastSurgeriesHospitalizations: '',
    currentMedications: '',
    allergies: '',

    // Screen 5 - Lifestyle & Habits
    sleepHoursPerNight: '',
    sleepQuality: '',
    exerciseFrequency: '',
    dietType: '',
    alcoholUse: '',
    tobaccoUse: '',
    cannabisOtherSubstances: '',
    cannabisOtherSubstancesList: '',
    stressLevel: '',

    // Screen 6 - Symptom Check
    symptomFatigue: false,
    symptomLowLibido: false,
    symptomMuscleLoss: false,
    symptomWeightGain: false,
    symptomGynecomastia: false,
    symptomBrainFog: false,
    symptomMoodSwings: false,
    symptomPoorSleep: false,
    symptomHairThinning: false,

    // Screen 7 - Safety Check
    historyProstateBreastCancer: false,
    historyBloodClotsMIStroke: false,
    currentlyUsingHormonesPeptides: false,
    planningChildrenNext12Months: false,

    // Screen 8 - Labs & Uploads
    labUploads: '',
    labSchedulingNeeded: false,

    // Screen 9 - Consent & Finalize
    consentTelemedicineCare: false,
    consentElectiveOptimizationTreatment: false,
    consentRequiredLabMonitoring: false,
    digitalSignature: '',
    consentDate: new Date().toISOString().split('T')[0],
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentScreen < 9) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handlePrevious = () => {
    if (currentScreen > 3) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleTabClick = (screenId: number) => {
    setCurrentScreen(screenId);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      await api.post(`/intake/form/${appointmentId}`, formData);
      onComplete();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit intake form');
    } finally {
      setLoading(false);
    }
  };

  const renderScreen3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-600">Your Goals</h3>
      <p className="text-gray-600">What are your main goals? (check all that apply)</p>
      
      <div className="space-y-6">
        {[
          { key: 'goalMoreEnergy', label: 'More energy & motivation' },
          { key: 'goalBetterSexualPerformance', label: 'Better sexual performance' },
          { key: 'goalLoseWeight', label: 'Lose weight' },
          { key: 'goalHairRestoration', label: 'Hair restoration' },
          { key: 'goalImproveMood', label: 'Improve mood & mental clarity' },
          { key: 'goalLongevity', label: 'Longevity & disease prevention' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              id={key}
              checked={formData[key as keyof typeof formData] as boolean}
              onCheckedChange={(checked) => handleInputChange(key, checked)}
            />
            <Label htmlFor={key}>{label}</Label>
          </div>
        ))}
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="goalOther"
              checked={formData.goalOther}
              onCheckedChange={(checked) => handleInputChange('goalOther', checked)}
            />
            <Label htmlFor="goalOther">Other:</Label>
          </div>
          {formData.goalOther && (
            <Input
              placeholder="Please specify"
              value={formData.goalOtherDescription}
              onChange={(e) => handleInputChange('goalOtherDescription', e.target.value)}
              className="bg-white border-gray-300 text-black focus:outline-none focus:border-gray-300 focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-300"
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderScreen4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-600">Medical Background</h3>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="chronicConditions">Chronic conditions</Label>
          <Textarea
            id="chronicConditions"
            placeholder="List any chronic conditions you have"
            value={formData.chronicConditions}
            onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
            className="bg-white border-gray-300 text-black focus:outline-none focus:border-gray-300 focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-300"
          />
        </div>

        <div>
          <Label htmlFor="pastSurgeries">Past surgeries/hospitalizations</Label>
          <Textarea
            id="pastSurgeries"
            placeholder="Describe any past surgeries or hospitalizations"
            value={formData.pastSurgeriesHospitalizations}
            onChange={(e) => handleInputChange('pastSurgeriesHospitalizations', e.target.value)}
            className="bg-white border-gray-300 text-black focus:outline-none focus:border-gray-300 focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-300"
          />
        </div>

        <div>
          <Label htmlFor="currentMedications">Current medications</Label>
          <Input
            id="currentMedications"
            placeholder="List your current medications"
            value={formData.currentMedications}
            onChange={(e) => handleInputChange('currentMedications', e.target.value)}
            className="bg-white border-gray-300 text-black focus:outline-none focus:border-gray-300 focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-300"
          />
        </div>

        <div>
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea
            id="allergies"
            placeholder="List any allergies you have"
            value={formData.allergies}
            onChange={(e) => handleInputChange('allergies', e.target.value)}
            className="bg-white border-gray-300 text-black focus:outline-none focus:border-gray-300 focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-300"
          />
        </div>
      </div>
    </div>
  );

  const renderScreen5 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-600">Lifestyle & Habits</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="sleepHours">Sleep: Hours/night</Label>
            <Input
              id="sleepHours"
              placeholder="e.g., 7-8"
              value={formData.sleepHoursPerNight}
              onChange={(e) => handleInputChange('sleepHoursPerNight', e.target.value)}
              className="bg-white border-gray-300 text-black focus:outline-none focus:border-gray-300 focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-300"
            />
          </div>

          <div>
            <Label>Sleep Quality:</Label>
            <RadioGroup
              value={formData.sleepQuality}
              onValueChange={(value) => handleInputChange('sleepQuality', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Poor" id="sleep-poor" />
                <Label htmlFor="sleep-poor">Poor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Fair" id="sleep-fair" />
                <Label htmlFor="sleep-fair">Fair</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Good" id="sleep-good" />
                <Label htmlFor="sleep-good">Good</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Exercise:</Label>
            <RadioGroup
              value={formData.exerciseFrequency}
              onValueChange={(value) => handleInputChange('exerciseFrequency', value)}
            >
              {['None', '1-2x/week', '3-5x/week', 'Daily'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`exercise-${option}`} />
                  <Label htmlFor={`exercise-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          <div>
            <Label>Diet:</Label>
            <RadioGroup
              value={formData.dietType}
              onValueChange={(value) => handleInputChange('dietType', value)}
            >
              {['Balanced', 'High protein', 'Low-carb', 'Plant-based', 'Other'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`diet-${option}`} />
                  <Label htmlFor={`diet-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label>Alcohol use:</Label>
            <RadioGroup
              value={formData.alcoholUse}
              onValueChange={(value) => handleInputChange('alcoholUse', value)}
            >
              {['None', 'Social', 'Regular'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`alcohol-${option}`} />
                  <Label htmlFor={`alcohol-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label>Tobacco:</Label>
            <RadioGroup
              value={formData.tobaccoUse}
              onValueChange={(value) => handleInputChange('tobaccoUse', value)}
            >
              {['Never', 'Current', 'Former'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`tobacco-${option}`} />
                  <Label htmlFor={`tobacco-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* Column 3 */}
        <div className="space-y-6">
          <div>
            <Label>Cannabis/Other substances:</Label>
            <RadioGroup
              value={formData.cannabisOtherSubstances}
              onValueChange={(value) => handleInputChange('cannabisOtherSubstances', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="None" id="substances-none" />
                <Label htmlFor="substances-none">None</Label>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="substances-yes" />
                  <Label htmlFor="substances-yes">Yes – List:</Label>
                </div>
                {formData.cannabisOtherSubstances === 'Yes' && (
                  <Input
                    placeholder="Please specify"
                    value={formData.cannabisOtherSubstancesList}
                    onChange={(e) => handleInputChange('cannabisOtherSubstancesList', e.target.value)}
                    className="bg-white border-gray-300 text-black focus:outline-none focus:border-gray-300 focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-300"
                  />
                )}
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Stress level:</Label>
            <RadioGroup
              value={formData.stressLevel}
              onValueChange={(value) => handleInputChange('stressLevel', value)}
            >
              {['Low', 'Medium', 'High'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`stress-${option}`} />
                  <Label htmlFor={`stress-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScreen6 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-600">Symptom Check</h3>
      <p className="text-gray-600">How are you feeling lately?</p>
      
      <div className="space-y-6">
        {[
          { key: 'symptomFatigue', label: 'Fatigue / low energy' },
          { key: 'symptomLowLibido', label: 'Low libido / ED' },
          { key: 'symptomMuscleLoss', label: 'Muscle loss' },
          { key: 'symptomWeightGain', label: 'Weight gain' },
          { key: 'symptomGynecomastia', label: 'Gynecomastia' },
          { key: 'symptomBrainFog', label: 'Brain fog / poor memory' },
          { key: 'symptomMoodSwings', label: 'Mood swings' },
          { key: 'symptomPoorSleep', label: 'Poor sleep' },
          { key: 'symptomHairThinning', label: 'Hair thinning' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              id={key}
              checked={formData[key as keyof typeof formData] as boolean}
              onCheckedChange={(checked) => handleInputChange(key, checked)}
            />
            <Label htmlFor={key}>{label}</Label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderScreen7 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-600">Safety Check</h3>
      
      <div className="space-y-6">
        {[
          { key: 'historyProstateBreastCancer', label: 'History of prostate/breast cancer' },
          { key: 'historyBloodClotsMIStroke', label: 'History of blood clots/MI/stroke' },
          { key: 'currentlyUsingHormonesPeptides', label: 'Currently using hormones/peptides' },
          { key: 'planningChildrenNext12Months', label: 'Planning children in next 12 months' },
        ].map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <Label>{label}:</Label>
            <RadioGroup
              value={formData[key as keyof typeof formData] ? 'Yes' : 'No'}
              onValueChange={(value) => handleInputChange(key, value === 'Yes')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id={`${key}-yes`} />
                <Label htmlFor={`${key}-yes`}>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id={`${key}-no`} />
                <Label htmlFor={`${key}-no`}>No</Label>
              </div>
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  );

  const renderScreen8 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-600">Labs & Uploads</h3>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="labUploads">Upload your latest labs:</Label>
          <Input
            id="labUploads"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleInputChange('labUploads', file.name);
              }
            }}
            className="bg-white border-gray-300 text-black focus:outline-none focus:border-gray-300 focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-300"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="labSchedulingNeeded"
            checked={formData.labSchedulingNeeded}
            onCheckedChange={(checked) => handleInputChange('labSchedulingNeeded', checked)}
          />
          <Label htmlFor="labSchedulingNeeded">No labs? We'll help you schedule a draw.</Label>
        </div>
      </div>
    </div>
  );

  const renderScreen9 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-600">Consent & Finalize</h3>
      <p className="text-gray-600">Please review and agree:</p>
      
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="consentTelemedicineCare"
            checked={formData.consentTelemedicineCare}
            onCheckedChange={(checked) => handleInputChange('consentTelemedicineCare', checked)}
          />
          <Label htmlFor="consentTelemedicineCare">I consent to telemedicine care</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="consentElectiveOptimizationTreatment"
            checked={formData.consentElectiveOptimizationTreatment}
            onCheckedChange={(checked) => handleInputChange('consentElectiveOptimizationTreatment', checked)}
          />
          <Label htmlFor="consentElectiveOptimizationTreatment">I understand this is elective optimization treatment</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="consentRequiredLabMonitoring"
            checked={formData.consentRequiredLabMonitoring}
            onCheckedChange={(checked) => handleInputChange('consentRequiredLabMonitoring', checked)}
          />
          <Label htmlFor="consentRequiredLabMonitoring">I agree to required lab monitoring</Label>
        </div>

        <div>
          <Label htmlFor="digitalSignature">Digital Signature:</Label>
          <Input
            id="digitalSignature"
            placeholder="Type your full name"
            value={formData.digitalSignature}
            onChange={(e) => handleInputChange('digitalSignature', e.target.value)}
            className="bg-white border-gray-300 text-black focus:outline-none focus:border-gray-300 focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-300"
            required
          />
        </div>

        <div>
          <Label htmlFor="consentDate">Date:</Label>
          <Input
            id="consentDate"
            type="date"
            value={formData.consentDate}
            onChange={(e) => handleInputChange('consentDate', e.target.value)}
            className="bg-white border-gray-300 text-black focus:outline-none focus:border-gray-300 focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-300"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 3: return renderScreen3();
      case 4: return renderScreen4();
      case 5: return renderScreen5();
      case 6: return renderScreen6();
      case 7: return renderScreen7();
      case 8: return renderScreen8();
      case 9: return renderScreen9();
      default: return renderScreen3();
    }
  };

  const isLastScreen = currentScreen === 9;
  const canProceed = isLastScreen ? 
    formData.consentTelemedicineCare && 
    formData.consentElectiveOptimizationTreatment && 
    formData.consentRequiredLabMonitoring && 
    formData.digitalSignature && 
    formData.consentDate : true;

  const screens = [
    { id: 3, title: 'Your Goals' },
    { id: 4, title: 'Medical Background' },
    { id: 5, title: 'Lifestyle & Habits' },
    { id: 6, title: 'Symptom Check' },
    { id: 7, title: 'Safety Check' },
    { id: 8, title: 'Labs & Uploads' },
    { id: 9, title: 'Consent & Finalize' },
  ];

  return (
    <div className="flex-1 text-white overflow-x-hidden">
      {/* Header Section */}
      <div className="p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
            Medical Intake Form
          </h1>
        </div>
        <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-1 sm:mt-2 leading-relaxed">
          Complete your medical information to proceed with your appointment.
        </p>
      </div>

      {/* Tabs */}
      <div className="mx-4 sm:mx-6 lg:mx-8 mb-4">
        <div className="flex space-x-2 overflow-x-auto">
          {screens.map((screen) => (
            <button
              key={screen.id}
              onClick={() => handleTabClick(screen.id)}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                currentScreen === screen.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {screen.title}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="mx-4 sm:mx-6 lg:mx-8 overflow-x-hidden">
        <div className="bg-white rounded-b-2xl p-6 sm:p-8 lg:p-10 border border-gray-200 text-black overflow-hidden">
          {error && (
            <div className="text-red-600 text-sm text-center mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="overflow-x-hidden">
            {renderCurrentScreen()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentScreen === 3}
              className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {isLastScreen ? (
              <Button
                onClick={handleSubmit}
                disabled={loading || !canProceed}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Intake'
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                className="bg-red-600 hover:bg-red-700"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntakeForm;
