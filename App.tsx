import React, { useState, useEffect } from 'react';
import StepTracker from './components/StepTracker';
import Step1Activities from './components/Step1Activities';
import Step2Competencies from './components/Step2Competencies';
import Step3KnowledgeSkills from './components/Step3KnowledgeSkills';
import Step4Performance from './components/Step4Performance';
import Step5Summary from './components/Step5Summary';
import NavigationButtons from './components/NavigationButtons';
import { 
  Activity, 
  fullCompetencyData, 
  sampleActivitiesText, 
  sampleJobDescription, 
  MIN_COMPETENCIES_REQUIRED 
} from './types';
import { generateSpecializationData, generateActivitiesList, generateCompetenciesForActivities } from './services/geminiService';

const App: React.FC = () => {
  // --- State ---
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // Step 1 Data
  const [jobDescription, setJobDescription] = useState(sampleJobDescription);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("فني تصميم وتصنيع ذكي");
  const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
  const [generalSummary, setGeneralSummary] = useState("");
  
  // API State
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Finish State
  const [isFinished, setIsFinished] = useState(false);

  // --- Helpers ---
  
  // Map raw text activities to Activity objects with competency selections
  const mapActivities = (texts: string[]): Activity[] => {
    return texts.map((text, index) => {
      const id = index + 1;
      const competencies = fullCompetencyData.map(comp => ({
        id: crypto.randomUUID(),
        name: comp.name,
        // Random selection logic to mimic the original prototype behavior
        selected: Math.random() > 0.3, 
        details: comp
      }));
      
      // Ensure at least 3 are selected initially for better UX (as per original logic)
      let selectedCount = competencies.filter(c => c.selected).length;
      while (selectedCount < 3) {
        const unselected = competencies.find(c => !c.selected);
        if (!unselected) break;
        unselected.selected = true;
        selectedCount++;
      }

      // Default isSelected to true so they are all initially active unless unchecked
      return { id, text, competencies, isSelected: true };
    });
  };

  // Initialize Sample Data
  useEffect(() => {
    setActivities(mapActivities(sampleActivitiesText));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Handlers ---

  const handleGenerateNames = async () => {
    setIsGenerating(true);
    setApiError(null);
    try {
      const data = await generateSpecializationData(jobDescription);
      setSuggestedNames(data.suggestedNames);
      setGeneralSummary(data.generalSummary);
      if (data.suggestedNames.length > 0) {
        setSelectedSpecialization(data.suggestedNames[0]);
      }
    } catch (e) {
      setApiError("فشل في توليد الأسماء أو الملخص. يرجى التأكد من مفتاح API والمحاولة مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateActivities = async () => {
    setIsGenerating(true);
    setApiError(null);
    try {
      const newTexts = await generateActivitiesList(jobDescription);
      setActivities(mapActivities(newTexts));
    } catch (e) {
      setApiError("فشل في توليد الأنشطة. يرجى التأكد من مفتاح API والمحاولة مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetActivities = () => {
    setActivities(mapActivities(sampleActivitiesText));
    setApiError(null);
  };

  const handleAddManualActivity = (text: string) => {
    const newId = activities.length + 1;
    const newActivity = mapActivities([text])[0];
    newActivity.id = newId;
    setActivities([...activities, newActivity]);
  };

  const handleToggleActivitySelection = (id: number) => {
    setActivities(prev => prev.map(a => 
      a.id === id ? { ...a, isSelected: !a.isSelected } : a
    ));
  };

  const handleToggleCompetency = (activityId: number, competencyId: string) => {
    setActivities(prev => prev.map(act => {
      if (act.id !== activityId) return act;
      return {
        ...act,
        competencies: act.competencies.map(comp => 
          comp.id === competencyId ? { ...comp, selected: !comp.selected } : comp
        )
      };
    }));
  };

  // Step 2 Logic: Generate specific competencies for selected activities
  const handleGenerateSmartCompetencies = async () => {
    const selectedActivities = getSelectedActivities();
    if (selectedActivities.length === 0) return;

    setIsGenerating(true);
    setApiError(null);

    try {
      const activityTexts = selectedActivities.map(a => a.text);
      const generatedData = await generateCompetenciesForActivities(activityTexts);

      // Map generated data back to activities
      const updatedActivities = [...activities];

      generatedData.forEach((item: any) => {
        // Find the activity in the main array that corresponds to this generated item
        // The service returns data in the same order as passed, so we use the index relative to selected list
        if (item.activityIndex >= 0 && item.activityIndex < selectedActivities.length) {
           const targetActivity = selectedActivities[item.activityIndex];
           const mainIndex = updatedActivities.findIndex(a => a.id === targetActivity.id);

           if (mainIndex !== -1) {
             const newCompetencies = item.competencies.map((c: any) => ({
               id: crypto.randomUUID(),
               name: c.name,
               selected: true, // Auto-select AI generated competencies
               details: {
                 name: c.name,
                 knowledge: c.knowledge,
                 skill: c.skill,
                 unitDescription: c.unitDescription,
                 criteria: c.criteria
               }
             }));
             updatedActivities[mainIndex].competencies = newCompetencies;
           }
        }
      });

      setActivities(updatedActivities);

    } catch (e) {
      console.error(e);
      setApiError("حدث خطأ أثناء توليد الجدارات. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  };


  const handleStepClick = (step: number) => {
      if (step > currentStep) return; // Prevent jumping forward
      setValidationError(null);
      setCurrentStep(step);
      setIsFinished(false);
  };

  const handleNext = () => {
    setValidationError(null);
    
    // Step 1 Validation
    if (currentStep === 1) {
        const selectedActivities = activities.filter(a => a.isSelected);
        if (selectedActivities.length === 0) {
            setValidationError("يجب اختيار نشاط واحد على الأقل للمتابعة.");
            return;
        }
    }

    // Step 2 Validation
    if (currentStep === 2) {
        // Only validate selected activities
        const selectedActivities = activities.filter(a => a.isSelected);
        // Relaxed validation: ensure at least 1 competency is selected per activity
        // (Previously it was 5, but with dynamic AI generation, 1-2 highly specific ones are better than 5 generic ones)
        const hasInsufficient = selectedActivities.some(
            a => a.competencies.filter(c => c.selected).length < 1
        );
        if (hasInsufficient) {
            setValidationError(`يجب التأكد من وجود جدارة واحدة على الأقل لكل نشاط (يمكنك استخدام التوليد الذكي).`);
            return;
        }
    }

    if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
    } else {
        // Just completion logic, maybe show a toast or stay on step 5
    }
  };

  const handlePrev = () => {
      setValidationError(null);
      if (currentStep > 1) {
          setCurrentStep(prev => prev - 1);
      }
      setIsFinished(false);
  };

  // Helper to get only selected activities for steps 2, 3, 4, 5
  const getSelectedActivities = () => activities.filter(a => a.isSelected);

  // --- Render ---

  return (
    <div className="min-h-screen bg-[#f7f9fb] p-4 md:p-10 font-sans text-right" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
             <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                أداة تصميم التخصصات الفنية المزدوجة (3 سنوات)
             </h1>
             <p className="text-gray-500 mt-2">نظام ذكي لتطوير المناهج المهنية</p>
        </header>

        <StepTracker currentStep={currentStep} onStepClick={handleStepClick} />

        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg border border-gray-100 min-h-[500px] flex flex-col justify-between">
          <div className="flex-1">
            {currentStep === 1 && (
                <Step1Activities
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                    activities={activities}
                    setActivities={setActivities}
                    selectedSpecialization={selectedSpecialization}
                    setSelectedSpecialization={setSelectedSpecialization}
                    suggestedNames={suggestedNames}
                    setSuggestedNames={setSuggestedNames}
                    generalSummary={generalSummary}
                    setGeneralSummary={setGeneralSummary}
                    onGenerateNames={handleGenerateNames}
                    onGenerateActivities={handleGenerateActivities}
                    onResetActivities={handleResetActivities}
                    isGenerating={isGenerating}
                    error={apiError || validationError}
                    onAddManualActivity={handleAddManualActivity}
                    onToggleActivitySelection={handleToggleActivitySelection}
                />
            )}
            {currentStep === 2 && (
                <Step2Competencies 
                    activities={getSelectedActivities()}
                    onToggleCompetency={handleToggleCompetency}
                    error={validationError}
                    onGenerateSmartCompetencies={handleGenerateSmartCompetencies}
                    isGenerating={isGenerating}
                />
            )}
            {currentStep === 3 && (
                <Step3KnowledgeSkills activities={getSelectedActivities()} />
            )}
            {currentStep === 4 && (
                <Step4Performance activities={getSelectedActivities()} />
            )}
            {currentStep === 5 && (
                <Step5Summary 
                    activities={getSelectedActivities()}
                    specializationName={selectedSpecialization}
                    generalSummary={generalSummary}
                    jobDescription={jobDescription}
                />
            )}
          </div>

          <NavigationButtons 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
            onNext={handleNext} 
            onPrev={handlePrev}
            canProceed={!isGenerating}
          />
        </div>
      </div>
    </div>
  );
};

export default App;