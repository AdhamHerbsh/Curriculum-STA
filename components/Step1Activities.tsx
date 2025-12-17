import React, { useState } from 'react';
import { Activity, defaultSpecializationNames, GenerationResult } from '../types';
import { Loader2, Plus, Sparkles, RefreshCw, RotateCcw, CheckSquare } from 'lucide-react';

interface Step1Props {
  jobDescription: string;
  setJobDescription: (val: string) => void;
  activities: Activity[];
  setActivities: (val: Activity[]) => void;
  selectedSpecialization: string;
  setSelectedSpecialization: (val: string) => void;
  suggestedNames: string[];
  setSuggestedNames: (val: string[]) => void;
  generalSummary: string;
  setGeneralSummary: (val: string) => void;
  onGenerateNames: () => Promise<void>;
  onGenerateActivities: () => Promise<void>;
  onResetActivities: () => void;
  isGenerating: boolean;
  error: string | null;
  onAddManualActivity: (text: string) => void;
  onToggleActivitySelection: (id: number) => void;
}

const Step1Activities: React.FC<Step1Props> = ({
  jobDescription,
  setJobDescription,
  activities,
  selectedSpecialization,
  setSelectedSpecialization,
  suggestedNames,
  generalSummary,
  onGenerateNames,
  onGenerateActivities,
  onResetActivities,
  isGenerating,
  error,
  onAddManualActivity,
  onToggleActivitySelection
}) => {
  const [manualInput, setManualInput] = useState("");

  const handleManualAdd = () => {
    if (manualInput.trim()) {
      onAddManualActivity(manualInput.trim());
      setManualInput("");
    }
  };

  const currentNames = suggestedNames.length > 0 ? suggestedNames : defaultSpecializationNames;
  const selectedCount = activities.filter(a => a.isSelected).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">الخطوة 1: تحديد الوصف والأنشطة المهنية واقتراح التسمية</h2>

      {/* Job Description Section */}
      <div className="bg-white rounded-lg p-1">
        <label htmlFor="job-description" className="block text-lg font-medium text-gray-700 mb-2">
          الوصف الوظيفي للمهنة (المصدر الأساسي للملخص والأنشطة):
        </label>
        <textarea
          id="job-description"
          rows={6}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 bg-gray-50 text-gray-800 text-base leading-relaxed"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="أدخل الوصف الوظيفي هنا..."
        />
      </div>

      {/* Error / Loading State */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center">
            <span className="font-semibold">{error}</span>
        </div>
      )}

      {isGenerating && (
         <div className="flex items-center justify-center p-6 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
            <Loader2 className="w-6 h-6 animate-spin ml-3" />
            <span className="font-medium">جاري التواصل مع نموذج Gemini لتوليد المحتوى...</span>
         </div>
      )}

      {/* Name Generation Button */}
      <button
        onClick={onGenerateNames}
        disabled={isGenerating || !jobDescription}
        className={`
          flex items-center justify-center px-6 py-3 rounded-lg text-white font-semibold shadow-md transition-all duration-300 w-full md:w-auto
          ${isGenerating || !jobDescription ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}
        `}
      >
        <Sparkles className="w-5 h-5 ml-2" />
        توليد أسماء التخصص والملخص العام (باستخدام Gemini)
      </button>

      <p className="text-sm text-gray-500">
        يُرجى توليد الملخص أولاً، ثم توليد الأنشطة، لضمان ارتباطها الوثيق بالوصف الذي أدخلته.
      </p>

      {/* Results Section (Names & Summary) */}
      <div className={`
        mt-6 p-6 rounded-lg border-l-4 shadow-sm transition-colors duration-500
        ${suggestedNames.length > 0 ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-500'}
      `}>
        {suggestedNames.length > 0 ? (
           <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
             <CheckCircleIcon className="w-6 h-6 ml-2 text-green-600" />
             نتائج اقتراحات Gemini:
           </h3>
        ) : (
          <p className="font-semibold text-blue-700 mb-2">الاسم المختار حالياً:</p>
        )}

        <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
                {suggestedNames.length > 0 ? "الأسماء المقترحة للتخصص:" : "قائمة التخصصات الافتراضية:"}
            </label>
            <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-2.5 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm bg-white shadow-sm"
            >
                {currentNames.map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                ))}
            </select>
        </div>

        {generalSummary && (
            <div className="bg-white/60 p-4 rounded-md border border-green-100">
                <h4 className="font-semibold text-green-800 mb-1">الملخص العام للمهنة:</h4>
                <p className="text-gray-700 leading-relaxed">{generalSummary}</p>
            </div>
        )}
      </div>

      <hr className="my-8 border-gray-200" />

      {/* Activities Management */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">إدارة الأنشطة المهنية</h3>
        <p className="text-gray-600 mb-4">قم بتوليد الأنشطة، ثم اختر (ضع علامة صح) أمام الأنشطة التي تريد اعتمادها في المنهج.</p>
        
        <div className="flex flex-wrap gap-3 mb-6">
            <button
                onClick={onGenerateActivities}
                disabled={isGenerating || !jobDescription}
                className={`flex items-center px-5 py-2.5 rounded-lg text-white font-medium transition-colors ${isGenerating || !jobDescription ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
                <RefreshCw className={`w-4 h-4 ml-2 ${isGenerating ? 'animate-spin' : ''}`} />
                توليد 15 نشاطاً جديداً
            </button>
            <button
                onClick={onResetActivities}
                className="flex items-center px-5 py-2.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
            >
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة تعيين الأنشطة الافتراضية
            </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-700">الأنشطة المهنية</h4>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        تم اختيار {selectedCount} من {activities.length}
                    </span>
                </div>
                <span className="text-xs text-gray-500 hidden sm:inline">الأنشطة المختارة فقط ستنتقل للمراحل التالية</span>
            </div>
            <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto p-2">
                {activities.map((activity) => (
                    <li 
                        key={activity.id} 
                        className={`p-3 rounded-md transition-all duration-200 flex items-start gap-3 ${activity.isSelected ? 'bg-indigo-50/70 border border-indigo-100' : 'hover:bg-gray-50 border border-transparent opacity-70'}`}
                    >
                        <div className="flex items-center h-6">
                            <input
                                id={`activity-${activity.id}`}
                                type="checkbox"
                                checked={activity.isSelected}
                                onChange={() => onToggleActivitySelection(activity.id)}
                                className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer transition-transform duration-200 hover:scale-110"
                            />
                        </div>
                        <label 
                            htmlFor={`activity-${activity.id}`} 
                            className={`block text-sm md:text-base cursor-pointer select-none flex-grow leading-relaxed ${activity.isSelected ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
                        >
                            <span className={`font-bold ml-2 ${activity.isSelected ? 'text-indigo-600' : 'text-gray-400'}`}>{activity.id}.</span>
                            {activity.text}
                        </label>
                    </li>
                ))}
                {activities.length === 0 && (
                    <li className="p-8 text-center text-gray-400 italic">لا توجد أنشطة حالياً. يرجى التوليد أو الإضافة يدوياً.</li>
                )}
            </ul>
        </div>

        <div className="mt-4 flex gap-2">
            <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualAdd()}
                placeholder="أدخل النشاط الجديد يدوياً هنا..."
                className="flex-grow rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
            />
            <button
                onClick={handleManualAdd}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center whitespace-nowrap"
            >
                <Plus className="w-5 h-5 ml-1" />
                إضافة
            </button>
        </div>
      </div>
    </div>
  );
};

// Helper icon
const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default Step1Activities;