import React from 'react';
import { Activity } from '../types';
import { FileText, ListChecks, Activity as ActivityIcon } from 'lucide-react';

interface Step4Props {
  activities: Activity[];
}

const Step4Performance: React.FC<Step4Props> = ({ activities }) => {
  const selectedActivities = activities.filter(a => a.isSelected);

  return (
    <div className="space-y-6 animate-fadeIn">
       <h2 className="text-2xl font-bold text-gray-900">الخطوة 4: تحديد معايير الأداء والوصف العام للوحدة</h2>
       <p className="text-gray-600 leading-relaxed">
          توضح معايير الأداء ما يجب أن يكون الفني قادرًا على القيام به لإثبات إتقانه للجدارة، مرتبة حسب الأنشطة المهنية.
       </p>

       <div className="space-y-12">
         {selectedActivities.map((activity, index) => {
             const selectedCompetencies = activity.competencies.filter(c => c.selected);

             return (
                 <div key={activity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                     {/* Activity Header */}
                     <div className="bg-gray-100 px-6 py-5 border-b border-gray-200 flex items-start">
                         <div className="bg-indigo-600 p-2 rounded-lg text-white ml-4 shadow-sm">
                            <ActivityIcon className="w-6 h-6" />
                         </div>
                         <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1">
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-0.5 rounded-full">النشاط {index + 1}</span>
                             </div>
                             <h3 className="text-xl font-bold text-gray-900 leading-tight">{activity.text}</h3>
                         </div>
                     </div>

                     <div className="p-6 bg-gray-50/50 space-y-6">
                         {selectedCompetencies.length > 0 ? (
                            selectedCompetencies.map((comp, cIdx) => (
                                <div key={comp.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-3 flex items-center justify-between">
                                        <h4 className="text-white font-bold text-lg flex items-center">
                                            <span className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center ml-3 text-sm font-bold">
                                                {cIdx + 1}
                                            </span>
                                            {comp.name}
                                        </h4>
                                    </div>

                                    <div className="p-6 grid md:grid-cols-12 gap-6">
                                        {/* Unit Description */}
                                        <div className="md:col-span-5 bg-indigo-50 rounded-lg p-5 border border-indigo-100">
                                            <h5 className="flex items-center text-indigo-900 font-bold mb-3 border-b border-indigo-200 pb-2">
                                                <FileText className="w-5 h-5 ml-2" />
                                                وصف الوحدة
                                            </h5>
                                            <p className="text-gray-700 text-sm leading-relaxed text-justify">
                                                {comp.details.unitDescription}
                                            </p>
                                        </div>

                                        {/* Performance Criteria */}
                                        <div className="md:col-span-7">
                                            <h5 className="flex items-center text-gray-800 font-bold mb-4">
                                                <ListChecks className="w-5 h-5 ml-2 text-indigo-600" />
                                                معايير الأداء
                                            </h5>
                                            <ul className="space-y-3">
                                                {comp.details.criteria.map((crit, idx) => (
                                                    <li key={idx} className="flex items-start group">
                                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border-2 border-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center ml-3 mt-0.5 group-hover:border-indigo-400 group-hover:bg-indigo-50 transition-colors">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="text-gray-700 text-sm leading-relaxed pt-0.5">{crit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))
                         ) : (
                             <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500">لم يتم اختيار جدارات لهذا النشاط.</p>
                             </div>
                         )}
                     </div>
                 </div>
             );
         })}
       </div>
       
       {selectedActivities.length === 0 && (
          <div className="text-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">لم يتم اختيار أي أنشطة بعد.</p>
          </div>
       )}
    </div>
  );
};

export default Step4Performance;