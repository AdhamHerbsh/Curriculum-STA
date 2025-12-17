import React from 'react';
import { Check } from 'lucide-react';

interface StepTrackerProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const steps = [
  "1. تحديد الوصف والأنشطة",
  "2. ربط الجدارات",
  "3. المعارف والمهارات",
  "4. معايير الأداء والوصف",
  "5. الملخص والتحميل"
];

const StepTracker: React.FC<StepTrackerProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-10">
      {steps.map((title, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <button
            key={stepNum}
            onClick={() => {
               // Only allow navigating backwards or to current step
               if (stepNum <= currentStep) onStepClick(stepNum);
            }}
            className={`
              relative p-4 text-center transition-all duration-300 w-full sm:w-auto flex-1 max-w-xs rounded-xl shadow-sm
              ${isActive 
                ? 'bg-blue-600 text-white ring-2 ring-blue-300 shadow-md transform scale-105' 
                : isCompleted 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <div className="font-bold text-lg mb-1">{stepNum}</div>
            <div className="text-sm font-medium">{title}</div>
            {isCompleted && (
              <div className="absolute top-2 left-2">
                <Check className="w-5 h-5 text-white/90" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StepTracker;