import React, { useState } from 'react';
import { Activity } from '../types';
import { CheckSquare, ChevronDown, ChevronUp, AlertCircle, Wand2, Loader2 } from 'lucide-react';

interface Step2Props {
  activities: Activity[];
  onToggleCompetency: (activityId: number, competencyId: string) => void;
  error: string | null;
  onGenerateSmartCompetencies: () => Promise<void>;
  isGenerating: boolean;
}

const Step2Competencies: React.FC<Step2Props> = ({ 
  activities, 
  onToggleCompetency, 
  error,
  onGenerateSmartCompetencies,
  isGenerating
}) => {
  const [expandedActivityId, setExpandedActivityId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedActivityId(expandedActivityId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900">الخطوة 2: تحديد وربط الجدارات للأنشطة</h2>
      
      {/* AI Generation Call to Action */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-6 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <h3 className="text-lg font-bold text-indigo-900 mb-2">توليد الجدارات الذكية (AI)</h3>
                <p className="text-indigo-700 text-sm">
                    استخدم الذكاء الاصطناعي لتحليل الأنشطة التي اخترتها واستنتاج 
                    <strong> المعارف (7+ نقاط) </strong> و 
                    <strong> المهارات العملية </strong> 
                    بشكل تلقائي ودقيق.
                </p>
            </div>
            <button
                onClick={onGenerateSmartCompetencies}
                disabled={isGenerating}
                className={`
                    flex items-center justify-center px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all
                    ${isGenerating 
                        ? 'bg-indigo-300 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
                    }
                `}
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        جاري التحليل...
                    </>
                ) : (
                    <>
                        <Wand2 className="w-5 h-5 ml-2" />
                        توليد المعارف والمهارات
                    </>
                )}
            </button>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <p className="text-blue-800 text-sm">
             سيقوم النظام بتوليد 5 جدارات على الأقل لكل نشاط. تحتوي كل جدارة على أكثر من 7 معارف نظرية ومهارات عملية مقابلة.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 ml-2" />
            <span className="font-semibold">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {activities.map((activity) => {
            const selectedCount = activity.competencies.filter(c => c.selected).length;
            const hasCompetencies = activity.competencies.length > 0;
            const isExpanded = expandedActivityId === activity.id;

            return (
                <div key={activity.id} className={`border rounded-xl shadow-sm transition-all duration-300 overflow-hidden ${hasCompetencies ? 'border-gray-200 bg-white' : 'border-yellow-200 bg-yellow-50'}`}>
                    <div 
                        onClick={() => toggleExpand(activity.id)}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    >
                        <div className="flex-1 font-medium text-gray-800 text-lg ml-4">
                            <span className="font-bold text-gray-400 ml-2">{activity.id}.</span>
                            {activity.text}
                        </div>
                        
                        <div className="flex items-center mt-2 md:mt-0">
                            {hasCompetencies ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {selectedCount} جدارات مرتبطة
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    في انتظار التوليد...
                                </span>
                            )}
                            {isExpanded ? <ChevronUp className="w-5 h-5 mr-3 text-gray-400" /> : <ChevronDown className="w-5 h-5 mr-3 text-gray-400" />}
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="p-4 bg-gray-50 border-t border-gray-200 animate-slideDown">
                            {hasCompetencies ? (
                                <div className="space-y-4">
                                    {activity.competencies.map((comp) => (
                                        <div 
                                            key={comp.id}
                                            className={`
                                                p-4 rounded-lg border transition-all duration-200 bg-white border-blue-200 shadow-sm
                                            `}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); onToggleCompetency(activity.id, comp.id); }}
                                                        className={`w-5 h-5 rounded border flex items-center justify-center ml-3 transition-colors ${comp.selected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'}`}
                                                    >
                                                        {comp.selected && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                                                    </button>
                                                    <h4 className="font-bold text-blue-900">{comp.name}</h4>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pr-8">
                                                <div className="text-sm">
                                                    <span className="font-semibold text-gray-700 block mb-1">المعرفة (نظري) - {comp.details.knowledge.length} نقاط:</span>
                                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                                        {comp.details.knowledge.slice(0, 3).map((k, i) => (
                                                            <li key={i} className="truncate">{k}</li>
                                                        ))}
                                                        {comp.details.knowledge.length > 3 && <li className="text-xs text-gray-400">...و {comp.details.knowledge.length - 3} المزيد (انظر الخطوة التالية)</li>}
                                                    </ul>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="font-semibold text-green-700 block mb-1">المهارة (عملي) - {comp.details.skill.length} أفعال:</span>
                                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                                         {comp.details.skill.slice(0, 3).map((s, i) => (
                                                            <li key={i} className="truncate">{s}</li>
                                                        ))}
                                                        {comp.details.skill.length > 3 && <li className="text-xs text-gray-400">...و {comp.details.skill.length - 3} المزيد (انظر الخطوة التالية)</li>}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-500">
                                    <Wand2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                    <p>اضغط على زر "توليد الجدارات" بالأعلى لاستخراج المهارات والمعارف لهذا النشاط.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default Step2Competencies;