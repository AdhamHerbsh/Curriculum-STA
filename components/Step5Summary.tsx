import React, { useState } from 'react';
import { Activity } from '../types';
import { FileDown, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, BorderStyle, WidthType } from 'docx';
import FileSaver from 'file-saver';

interface Step5Props {
  activities: Activity[];
  specializationName: string;
  generalSummary: string;
  jobDescription: string;
}

const Step5Summary: React.FC<Step5Props> = ({ 
  activities, 
  specializationName, 
  generalSummary,
  jobDescription
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const selectedActivities = activities.filter(a => a.isSelected);

  const generateWordDocument = async () => {
    setIsGenerating(true);
    try {
      // Helper for Arabic Text with RTL
      const createRtlParagraph = (text: string, style: string = "Normal") => {
        return new Paragraph({
            text: text,
            bidirectional: true,
            heading: style === "Title" ? HeadingLevel.TITLE : style === "Heading1" ? HeadingLevel.HEADING_1 : style === "Heading2" ? HeadingLevel.HEADING_2 : undefined,
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
        });
      };

      const children = [
        // Title Page
        new Paragraph({
            text: "تصميم منهج التعليم المزدوج (3 سنوات)",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            spacing: { after: 400 },
        }),
        new Paragraph({
            text: `التخصص: ${specializationName}`,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            spacing: { after: 600 },
        }),

        // General Info Section
        createRtlParagraph("1. الملخص العام للمهنة", "Heading2"),
        createRtlParagraph(generalSummary),
        
        createRtlParagraph("2. الوصف الوظيفي", "Heading2"),
        createRtlParagraph(jobDescription),

        createRtlParagraph("3. هيكل الأنشطة والجدارات", "Heading2"),
      ];

      // Loop through activities and add details
      selectedActivities.forEach((activity, index) => {
        children.push(
            createRtlParagraph(`النشاط المهني ${index + 1}: ${activity.text}`, "Heading3")
        );

        const selectedCompetencies = activity.competencies.filter(c => c.selected);
        
        if (selectedCompetencies.length > 0) {
            selectedCompetencies.forEach((comp, cIdx) => {
                // Competency Title
                children.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: `الجدارة ${index + 1}.${cIdx + 1}: ${comp.name}`, bold: true, size: 28 }),
                        ],
                        bidirectional: true,
                        alignment: AlignmentType.RIGHT,
                        spacing: { before: 200, after: 100 },
                    })
                );

                // Unit Description
                children.push(
                    new Paragraph({
                        children: [
                             new TextRun({ text: "وصف الوحدة: ", bold: true }),
                             new TextRun({ text: comp.details.unitDescription })
                        ],
                        bidirectional: true,
                        alignment: AlignmentType.RIGHT,
                    })
                );

                // Knowledge & Skills Table
                const table = new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "المهارات العملية", alignment: AlignmentType.CENTER, bidirectional: true })],
                                    shading: { fill: "E8F5E9" }, // Light Green
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: "المعارف النظرية", alignment: AlignmentType.CENTER, bidirectional: true })],
                                    shading: { fill: "E3F2FD" }, // Light Blue
                                }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                // Skills Column
                                new TableCell({
                                    children: comp.details.skill.map(s => new Paragraph({ 
                                        text: `• ${s}`, 
                                        bidirectional: true,
                                        alignment: AlignmentType.RIGHT
                                    })),
                                }),
                                // Knowledge Column
                                new TableCell({
                                    children: comp.details.knowledge.map(k => new Paragraph({ 
                                        text: `• ${k}`, 
                                        bidirectional: true,
                                        alignment: AlignmentType.RIGHT
                                    })),
                                }),
                            ],
                        }),
                    ],
                });
                children.push(table);
                children.push(new Paragraph({ text: "" })); // Spacer

                // Criteria List
                 children.push(
                    new Paragraph({
                        children: [new TextRun({ text: "معايير الأداء:", bold: true, underline: {} })],
                        bidirectional: true,
                        alignment: AlignmentType.RIGHT,
                    })
                );
                comp.details.criteria.forEach(crit => {
                     children.push(new Paragraph({ text: `- ${crit}`, bidirectional: true, alignment: AlignmentType.RIGHT }));
                });
                
                children.push(new Paragraph({ text: "--------------------------------------------------", alignment: AlignmentType.CENTER }));
            });
        } else {
             children.push(createRtlParagraph("لم يتم اختيار جدارات لهذا النشاط."));
        }
      });

      const doc = new Document({
        sections: [{
            properties: {},
            children: children,
        }],
      });

      const blob = await Packer.toBlob(doc);
      FileSaver.saveAs(blob, `منهج_${specializationName.replace(/\s+/g, '_')}.docx`);
      
    } catch (e) {
      console.error("Error generating doc:", e);
      alert("حدث خطأ أثناء إنشاء الملف.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900">الخطوة 5: الملخص النهائي وتصدير المنهج</h2>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Preview */}
        <div className="bg-gray-800 text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{specializationName}</h1>
            <p className="text-gray-300 text-lg">نظام التعليم المزدوج - 3 سنوات</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse border-b border-gray-200 bg-gray-50">
            <div className="p-6 text-center">
                <span className="block text-3xl font-bold text-blue-600 mb-1">{selectedActivities.length}</span>
                <span className="text-gray-600">نشاط مهني</span>
            </div>
            <div className="p-6 text-center">
                 <span className="block text-3xl font-bold text-indigo-600 mb-1">
                    {selectedActivities.reduce((acc, curr) => acc + curr.competencies.filter(c => c.selected).length, 0)}
                 </span>
                <span className="text-gray-600">جدارة فنية</span>
            </div>
             <div className="p-6 text-center">
                 <span className="block text-3xl font-bold text-green-600 mb-1">
                    {selectedActivities.reduce((acc, curr) => acc + curr.competencies.filter(c => c.selected).reduce((sum, c) => sum + c.details.skill.length, 0), 0)}
                 </span>
                <span className="text-gray-600">مهارة عملية</span>
            </div>
        </div>

        {/* Action Area */}
        <div className="p-8 text-center space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-green-50 text-green-800 rounded-lg flex items-center max-w-lg">
                    <CheckCircle className="w-6 h-6 ml-3 flex-shrink-0" />
                    <p className="text-right">تم تجميع كافة البيانات بنجاح. يمكنك الآن تحميل الملف الكامل بصيغة Word للتعديل أو الطباعة.</p>
                </div>
                
                {selectedActivities.length === 0 && (
                     <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-center max-w-lg">
                        <AlertTriangle className="w-6 h-6 ml-3 flex-shrink-0" />
                        <p className="text-right">تنبيه: لم يتم اختيار أي أنشطة. الملف سيكون فارغاً.</p>
                    </div>
                )}
            </div>

            <button
                onClick={generateWordDocument}
                disabled={isGenerating}
                className={`
                    inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold text-white shadow-xl transition-all
                    ${isGenerating ? 'bg-gray-500 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-2xl hover:-translate-y-1'}
                `}
            >
                {isGenerating ? (
                    "جاري إنشاء الملف..."
                ) : (
                    <>
                        <FileDown className="w-6 h-6 ml-2" />
                        تحميل ملف Word (.docx)
                    </>
                )}
            </button>
            <p className="text-gray-500 text-sm">يحتوي الملف على: الوصف الوظيفي، الأنشطة، الجدارات التفصيلية، المعارف، المهارات، ومعايير الأداء.</p>
        </div>
      </div>
    </div>
  );
};

export default Step5Summary;