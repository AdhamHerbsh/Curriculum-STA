import React from 'react';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrev, 
  canProceed 
}) => {
  return (
    <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
      <button
        onClick={onPrev}
        disabled={currentStep === 1}
        className={`
          flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300
          ${currentStep === 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-sm'
          }
        `}
      >
        <ChevronRight className="w-5 h-5 ml-2" />
        السابق
      </button>

      <button
        onClick={onNext}
        className={`
            flex items-center px-8 py-3 rounded-lg font-bold text-white transition-all duration-300 shadow-md
            ${canProceed 
                ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5' 
                : 'bg-blue-400 cursor-not-allowed opacity-70'
            }
        `}
      >
        {currentStep === totalSteps ? (
            <>
                إنهاء ومراجعة
                <CheckCircle className="w-5 h-5 mr-2" />
            </>
        ) : (
            <>
                التالي
                <ChevronLeft className="w-5 h-5 mr-2" />
            </>
        )}
      </button>
    </div>
  );
};

export default NavigationButtons;
