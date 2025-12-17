import React from 'react';
import { Activity } from '../types';
import { BookOpen, Wrench, Activity as ActivityIcon } from 'lucide-react';

interface Step3Props {
  activities: Activity[];
}

const Step3KnowledgeSkills: React.FC<Step3Props> = ({ activities }) => {
  // Ensure we are working with selected activities (though parent likely passes filtered list)
  const selectedActivities = activities.filter(a => a.isSelected);

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900">الخطوة 3: استعراض الأنشطة والجدارات المرتبطة</h2>
      <p className="text-gray-600 leading-relaxed">
         في هذه الخطوة، يتم عرض كل نشاط مهني تم اختياره مع الجدارات المحددة له، وتفاصيل المعارف والمهارات العملية المطلوبة لإتقان تلك الجدارات.
      </p>

      <div className="space-y-8">
        {selectedActivities.map((activity, index) => {
            const selectedCompetencies = activity.competencies.filter(c => c.selected);
            
            return (
                <div key={activity.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    {/* Activity Header */}
                    <div className="bg-gray-800 text-white px-6 py-4 flex items-start">
                        <ActivityIcon className="w-6 h-6 ml-3 mt-1 flex-shrink-0 text-blue-400" />
                        <div>
                            <span className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">النشاط المهني {index + 1}</span>
                            <h3 className="text-xl font-bold leading-snug">{activity.text}</h3>
                        </div>
                    </div>
                    
                    {/* Competencies List */}
                    <div className="p-6 bg-gray-50 space-y-6">
                        {selectedCompetencies.length > 0 ? (
                            selectedCompetencies.map((comp, compIndex) => (
                                <div key={comp.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                    <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold ml-3">
                                            {compIndex + 1}
                                        </div>
                                        <h4 className="font-bold text-blue-900">{comp.name}</h4>
                                    </div>

                                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-gray-100">
                                        {/* Knowledge Section */}
                                        <div className="p-5">
                                            <div className="flex items-center mb-3 text-blue-700">
                                                <BookOpen className="w-4 h-4 ml-2" />
                                                <h5 className="font-bold text-sm">المعارف النظرية ({comp.details.knowledge.length})</h5>
                                            </div>
                                            <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
                                                {comp.details.knowledge.map((k, i) => (
                                                    <li key={i} className="leading-relaxed">{k}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Skills Section */}
                                        <div className="p-5 bg-green-50/20">
                                            <div className="flex items-center mb-3 text-green-700">
                                                <Wrench className="w-4 h-4 ml-2" />
                                                <h5 className="font-bold text-sm">المهارات العملية ({comp.details.skill.length})</h5>
                                            </div>
                                            <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
                                                {comp.details.skill.map((s, i) => (
                                                    <li key={i} className="leading-relaxed">{s}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-400 italic bg-white rounded border border-dashed">
                                لم يتم ربط أي جدارات بهذا النشاط.
                            </div>
                        )}
                    </div>
                </div>
            );
        })}
      </div>
      
      {selectedActivities.length === 0 && (
          <div className="text-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">لم يتم اختيار أي أنشطة بعد. يرجى العودة للخطوة الأولى.</p>
          </div>
      )}
    </div>
  );
};

export default Step3KnowledgeSkills;
