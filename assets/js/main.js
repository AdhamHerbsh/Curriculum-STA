// ==================================================
// AI-Powered Curriculum Framework Designer - Main JS
// ==================================================

// Global Data Storage (Temporary Database)
let curriculumData = {
  step1: {
    specializationInfo: '',
    generatedJobDescription: '',
    userJobDescription: '',
    selectedChoice: 'gemini',
    finalJobDescription: ''
  },
  step2: {
    generatedActivities: [],
    customActivities: [],
    selectedActivities: [],
    allActivities: []
  },
  step3: {
    competencies: [],
    skills: [],
    knowledge: []
  },
  step4: {
    finalFramework: {}
  }
};

// ==================================================
// UTILITY FUNCTIONS
// ==================================================

// Show/Hide Steps
function showStep(stepNumber) {
  // Hide all steps
  document.querySelectorAll('.step-section').forEach(step => {
    step.style.display = 'none';
  });
  
  // Show selected step
  document.getElementById(`step${stepNumber}`).style.display = 'block';
  
  // Update data when moving between steps
  if (stepNumber === 2) {
    updateStep2Display();
  } else if (stepNumber === 3) {
    updateStep3Display();
  } else if (stepNumber === 4) {
    updateStep4Display();
  }
}

// Loader Functions
function showLoader(buttonId) {
  const button = document.getElementById(buttonId);
  const loader = button.querySelector('.loader');
  if (loader) {
    loader.style.display = 'inline-block';
  }
  button.disabled = true;
}

function hideLoader(buttonId) {
  const button = document.getElementById(buttonId);
  const loader = button.querySelector('.loader');
  if (loader) {
    loader.style.display = 'none';
  }
  button.disabled = false;
}

// Format AI Response
function formatAIResponse(response, type = 'general') {
  if (type === 'job-description') {
    return `
      <div class="ai-response-container">
        <div class="response-header">
          <i class="bi bi-robot"></i> وصف المهنة المُنشأ بواسطة GEMINI
        </div>
        <div class="response-content">
          ${response.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
  } else if (type === 'activities') {
    return response.split('\n').filter(line => line.trim()).map((activity, index) => ({
      id: Date.now() + index,
      text: activity.replace(/^\d+[\.\-\*]?\s*/, '').trim(),
      source: 'gemini',
      selected: true
    }));
  }
  return response;
}

// ==================================================
// STEP 1: JOB DESCRIPTION FUNCTIONS
// ==================================================

// Generate Job Description using GEMINI API
async function generateJobDescription() {
  const specializationInfo = document.getElementById('specializationInfo').value.trim();
  
  if (!specializationInfo) {
    alert('يرجى إدخال معلومات عن التخصص أولاً');
    return;
  }

  showLoader('generateJobDescriptionBtn');

  try {
    // Simulate GEMINI API call with formatted prompt
    const prompt = `
      بناءً على المعلومات التالية عن تخصص الإلكترونيات والتصنيع:
      "${specializationInfo}"
      
      قم بإنشاء وصف مهني شامل ومنسق يتضمن:
      
      1. نظرة عامة عن المهنة
      2. المسؤوليات الأساسية
      3. البيئة المهنية
      4. المتطلبات الأساسية
      5. فرص التطوير المهني
      
      اجعل الوصف مفصلاً وسهل القراءة للمستخدم العادي.
    `;

    // Simulate API response (replace with actual GEMINI API call)
    const mockResponse = await simulateGeminiResponse(prompt, 'job-description');
    
    curriculumData.step1.specializationInfo = specializationInfo;
    curriculumData.step1.generatedJobDescription = mockResponse;
    
    // Display formatted response
    const formattedResponse = formatAIResponse(mockResponse, 'job-description');
    document.getElementById('jobDescriptionOutput').innerHTML = formattedResponse;
    
    hideLoader('generateJobDescriptionBtn');
    
  } catch (error) {
    console.error('Error generating job description:', error);
    alert('حدث خطأ أثناء توليد وصف المهنة. يرجى المحاولة مرة أخرى.');
    hideLoader('generateJobDescriptionBtn');
  }
}

// Handle Step 1 Next Button
function handleStep1Next() {
  const choice = document.querySelector('input[name="descriptionChoice"]:checked').value;
  let finalDescription = '';
  
  if (choice === 'gemini') {
    finalDescription = curriculumData.step1.generatedJobDescription;
  } else {
    finalDescription = document.getElementById('jobDescriptionOutput').value || 
                     document.getElementById('specializationInfo').value;
  }
  
  if (!finalDescription.trim()) {
    alert('يرجى التأكد من وجود وصف للمهنة قبل المتابعة');
    return;
  }
  
  curriculumData.step1.selectedChoice = choice;
  curriculumData.step1.finalJobDescription = finalDescription;
  
  showStep(2);
}

// ==================================================
// STEP 2: MAIN ACTIVITIES FUNCTIONS
// ==================================================

// Update Step 2 Display
function updateStep2Display() {
  const displayArea = document.getElementById('jobDescriptionDisplayStep2');
  displayArea.value = curriculumData.step1.finalJobDescription;
}

// Generate Main Activities
async function generateMainActivities() {
  if (!curriculumData.step1.finalJobDescription) {
    alert('لا يوجد وصف مهنة من الخطوة السابقة');
    return;
  }

  showLoader('generateActivitiesBtn');

  try {
    const prompt = `
      بناءً على وصف المهنة التالي:
      "${curriculumData.step1.finalJobDescription}"
      
      قم بتوليد قائمة من الأنشطة الرئيسية للمهنة (لا تقل عن 15 نشاط).
      
      متطلبات القائمة:
      - كل نشاط في سطر منفصل
      - أنشطة عملية وقابلة للتطبيق
      - تغطي جميع جوانب المهنة
      - مرتبة حسب الأهمية
      
      اكتب كل نشاط بشكل واضح ومحدد.
    `;

    const response = await simulateGeminiResponse(prompt, 'activities');
    const activities = formatAIResponse(response, 'activities');
    
    curriculumData.step2.generatedActivities = activities;
    curriculumData.step2.allActivities = [...activities];
    
    displayActivitiesList();
    hideLoader('generateActivitiesBtn');
    
  } catch (error) {
    console.error('Error generating activities:', error);
    alert('حدث خطأ أثناء توليد الأنشطة. يرجى المحاولة مرة أخرى.');
    hideLoader('generateActivitiesBtn');
  }
}

// Display Activities List
function displayActivitiesList() {
  const container = document.getElementById('activitiesListContainer');
  
  if (curriculumData.step2.allActivities.length === 0) {
    container.innerHTML = '<p class="text-muted">سيتم عرض الأنشطة المقترحة هنا كقائمة اختيار.</p>';
    return;
  }
  
  let html = '<div class="activities-list">';
  
  curriculumData.step2.allActivities.forEach((activity, index) => {
    const sourceIcon = activity.source === 'gemini' ? 
      '<i class="bi bi-robot text-primary" title="مُنشأ بواسطة GEMINI"></i>' : 
      '<i class="bi bi-person text-success" title="مُضاف من المستخدم"></i>';
    
    html += `
      <div class="form-check activity-item p-3 border rounded mb-2">
        <div class="d-flex justify-content-between align-items-start">
          <div class="flex-grow-1">
            <input class="form-check-input me-2" type="checkbox" 
                   id="activity_${activity.id}" 
                   ${activity.selected ? 'checked' : ''}
                   onchange="toggleActivity(${activity.id})">
            <label class="form-check-label flex-grow-1" for="activity_${activity.id}">
              <textarea class="form-control border-0 p-0 activity-text" 
                        onchange="updateActivityText(${activity.id}, this.value)"
                        rows="2">${activity.text}</textarea>
            </label>
          </div>
          <div class="ms-2">
            ${sourceIcon}
            <button class="btn btn-sm btn-outline-danger ms-2" 
                    onclick="removeActivity(${activity.id})" title="حذف النشاط">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

// Toggle Activity Selection
function toggleActivity(activityId) {
  const activity = curriculumData.step2.allActivities.find(a => a.id === activityId);
  if (activity) {
    activity.selected = !activity.selected;
  }
  updateSelectedActivities();
}

// Update Activity Text
function updateActivityText(activityId, newText) {
  const activity = curriculumData.step2.allActivities.find(a => a.id === activityId);
  if (activity) {
    activity.text = newText;
  }
}

// Remove Activity
function removeActivity(activityId) {
  curriculumData.step2.allActivities = curriculumData.step2.allActivities.filter(a => a.id !== activityId);
  displayActivitiesList();
  updateSelectedActivities();
}

// Add Custom Activity
function addCustomActivity() {
  const input = document.getElementById('customActivityInput');
  const text = input.value.trim();
  
  if (!text) {
    alert('يرجى إدخال نص النشاط');
    return;
  }
  
  const newActivity = {
    id: Date.now(),
    text: text,
    source: 'user',
    selected: true
  };
  
  curriculumData.step2.allActivities.push(newActivity);
  curriculumData.step2.customActivities.push(newActivity);
  
  input.value = '';
  displayActivitiesList();
  updateSelectedActivities();
}

// Update Selected Activities
function updateSelectedActivities() {
  curriculumData.step2.selectedActivities = curriculumData.step2.allActivities.filter(a => a.selected);
}

// Handle Step 2 Next
function handleStep2Next() {
  updateSelectedActivities();
  
  if (curriculumData.step2.selectedActivities.length === 0) {
    alert('يرجى اختيار نشاط واحد على الأقل للمتابعة');
    return;
  }
  
  showStep(3);
}

// ==================================================
// STEP 3: COMPETENCIES AND SKILLS FUNCTIONS
// ==================================================

// Update Step 3 Display
function updateStep3Display() {
  const selectedCount = curriculumData.step2.selectedActivities.length;
  
  let html = `
    <div class="alert alert-info">
      <h5><i class="bi bi-info-circle"></i> معلومات الخطوة الثالثة</h5>
      <p>لديك <strong>${selectedCount}</strong> نشاط محدد. سيتم توليد الجدارات والمهارات لكل نشاط.</p>
    </div>
    
    <div class="mb-3">
      <button type="button" class="btn btn-primary" onclick="generateAllCompetencies()">
        <i class="bi bi-robot"></i> توليد جميع الجدارات باستخدام GEMINI
        <span class="loader" style="display: none"></span>
      </button>
      <button type="button" class="btn btn-success ms-2" onclick="generateSkillsAndKnowledge()">
        <i class="bi bi-gear"></i> توليد المهارات والمعارف
        <span class="loader" style="display: none"></span>
      </button>
    </div>
    
    <div id="competenciesContainer">
      <!-- Competencies will be displayed here -->
    </div>
    
    <div class="d-flex justify-content-between mt-4">
      <button type="button" class="btn btn-secondary" onclick="showStep(2)">
        <i class="bi bi-arrow-right-circle-fill"></i> السابق إلى الخطوة 2
      </button>
      <button type="button" class="btn btn-warning" onclick="handleStep3Next()">
        التالي إلى الخطوة 4 <i class="bi bi-arrow-left-circle-fill"></i>
      </button>
    </div>
  `;
  
  document.getElementById('step3').querySelector('.card-body').innerHTML = html;
}

// Generate All Competencies
async function generateAllCompetencies() {
  showLoader('generateAllCompetencies');
  
  try {
    const activities = curriculumData.step2.selectedActivities.map(a => a.text).join('\n- ');
    
    const prompt = `
      بناءً على الأنشطة التالية:
      - ${activities}
      
      قم بتوليد الجدارات (Competencies) المطلوبة لكل نشاط.
      
      لكل نشاط، حدد:
      1. الجدارات الأساسية المطلوبة (3-5 جدارات لكل نشاط)
      2. اجعل كل جدارة واضحة ومحددة
      3. اربط الجدارات بالأنشطة بشكل منطقي
      
      نسق الإجابة كالتالي:
      النشاط: [اسم النشاط]
      الجدارات:
      - جدارة 1
      - جدارة 2
      - جدارة 3
    `;
    
    const response = await simulateGeminiResponse(prompt, 'competencies');
    parseAndStoreCompetencies(response);
    displayCompetencies();
    
    hideLoader('generateAllCompetencies');
    
  } catch (error) {
    console.error('Error generating competencies:', error);
    alert('حدث خطأ أثناء توليد الجدارات. يرجى المحاولة مرة أخرى.');
    hideLoader('generateAllCompetencies');
  }
}

// Parse and Store Competencies
function parseAndStoreCompetencies(response) {
  const lines = response.split('\n');
  let currentActivity = null;
  let competencies = [];
  
  lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('النشاط:') || line.startsWith('Activity:')) {
      if (currentActivity && competencies.length > 0) {
        curriculumData.step3.competencies.push({
          activity: currentActivity,
          competencies: [...competencies]
        });
      }
      currentActivity = line.replace(/^(النشاط:|Activity:)\s*/, '');
      competencies = [];
    } else if (line.startsWith('-') || line.startsWith('•')) {
      const competency = line.replace(/^[-•]\s*/, '').trim();
      if (competency) {
        competencies.push({
          id: Date.now() + Math.random(),
          text: competency,
          skills: [],
          knowledge: []
        });
      }
    }
  });
  
  // Add the last activity
  if (currentActivity && competencies.length > 0) {
    curriculumData.step3.competencies.push({
      activity: currentActivity,
      competencies: [...competencies]
    });
  }
}

// Display Competencies
function displayCompetencies() {
  const container = document.getElementById('competenciesContainer');
  
  if (curriculumData.step3.competencies.length === 0) {
    container.innerHTML = '<p class="text-muted">سيتم عرض الجدارات هنا بعد التوليد.</p>';
    return;
  }
  
  let html = '<div class="competencies-display">';
  
  curriculumData.step3.competencies.forEach((activityComp, actIndex) => {
    html += `
      <div class="activity-competencies mb-4 p-3 border rounded">
        <h5 class="text-primary"><i class="bi bi-target"></i> ${activityComp.activity}</h5>
        <div class="competencies-list">
    `;
    
    activityComp.competencies.forEach((comp, compIndex) => {
      html += `
        <div class="competency-item mb-3 p-2 bg-light rounded">
          <div class="d-flex justify-content-between align-items-start">
            <textarea class="form-control border-0 bg-transparent competency-text" 
                      onchange="updateCompetencyText(${actIndex}, ${compIndex}, this.value)"
                      rows="2">${comp.text}</textarea>
            <button class="btn btn-sm btn-outline-danger ms-2" 
                    onclick="removeCompetency(${actIndex}, ${compIndex})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          
          <div class="skills-knowledge mt-2" id="skillsKnowledge_${actIndex}_${compIndex}">
            <!-- Skills and knowledge will be populated here -->
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
        <button class="btn btn-sm btn-outline-primary" 
                onclick="addCustomCompetency(${actIndex})">
          <i class="bi bi-plus"></i> إضافة جدارة مخصصة
        </button>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

// Generate Skills and Knowledge
async function generateSkillsAndKnowledge() {
  if (curriculumData.step3.competencies.length === 0) {
    alert('يجب توليد الجدارات أولاً');
    return;
  }
  
  showLoader('generateSkillsAndKnowledge');
  
  try {
    for (const activityComp of curriculumData.step3.competencies) {
      for (const competency of activityComp.competencies) {
        const prompt = `
          للجدارة التالية: "${competency.text}"
          
          قم بتوليد:
          1. المهارات العملية (أفعال قابلة للقياس) - 3-5 مهارات
          2. المعارف النظرية (مصطلحات ومفاهيم) - 3-5 معارف
          
          نسق الإجابة:
          المهارات العملية:
          - مهارة 1
          - مهارة 2
          
          المعارف النظرية:
          - معرفة 1
          - معرفة 2
        `;
        
        const response = await simulateGeminiResponse(prompt, 'skills-knowledge');
        parseSkillsAndKnowledge(response, competency);
      }
    }
    
    displayCompetencies(); // Refresh display with skills and knowledge
    hideLoader('generateSkillsAndKnowledge');
    
  } catch (error) {
    console.error('Error generating skills and knowledge:', error);
    alert('حدث خطأ أثناء توليد المهارات والمعارف.');
    hideLoader('generateSkillsAndKnowledge');
  }
}

// Parse Skills and Knowledge
function parseSkillsAndKnowledge(response, competency) {
  const lines = response.split('\n');
  let currentSection = null;
  
  lines.forEach(line => {
    line = line.trim();
    if (line.includes('المهارات العملية') || line.includes('Skills')) {
      currentSection = 'skills';
    } else if (line.includes('المعارف النظرية') || line.includes('Knowledge')) {
      currentSection = 'knowledge';
    } else if (line.startsWith('-') || line.startsWith('•')) {
      const item = line.replace(/^[-•]\s*/, '').trim();
      if (item) {
        if (currentSection === 'skills') {
          competency.skills.push({
            id: Date.now() + Math.random(),
            text: item
          });
        } else if (currentSection === 'knowledge') {
          competency.knowledge.push({
            id: Date.now() + Math.random(),
            text: item
          });
        }
      }
    }
  });
}

// Handle Step 3 Next
function handleStep3Next() {
  if (curriculumData.step3.competencies.length === 0) {
    alert('يجب توليد الجدارات والمهارات قبل المتابعة');
    return;
  }
  
  showStep(4);
}

// ==================================================
// STEP 4: FINAL FRAMEWORK COMPILATION
// ==================================================

// Update Step 4 Display
function updateStep4Display() {
  generateFinalFramework();
  displayFinalFramework();
}

// Generate Final Framework
function generateFinalFramework() {
  curriculumData.step4.finalFramework = {
    jobDescription: curriculumData.step1.finalJobDescription,
    totalActivities: curriculumData.step2.selectedActivities.length,
    activities: curriculumData.step2.selectedActivities,
    competenciesData: curriculumData.step3.competencies,
    totalCompetencies: curriculumData.step3.competencies.reduce((total, ac) => total + ac.competencies.length, 0),
    totalSkills: curriculumData.step3.competencies.reduce((total, ac) => 
      total + ac.competencies.reduce((subTotal, comp) => subTotal + comp.skills.length, 0), 0),
    totalKnowledge: curriculumData.step3.competencies.reduce((total, ac) => 
      total + ac.competencies.reduce((subTotal, comp) => subTotal + comp.knowledge.length, 0), 0),
    generatedDate: new Date().toLocaleDateString('ar-SA')
  };
}

// Display Final Framework
function displayFinalFramework() {
  const framework = curriculumData.step4.finalFramework;
  
  let html = `
    <div class="final-framework">
      <div class="alert alert-success">
        <h4><i class="bi bi-check-circle"></i> تم إنشاء إطار المنهج بنجاح!</h4>
        <p class="mb-0">تم تجميع جميع المكونات في إطار عمل شامل للمنهج الدراسي.</p>
      </div>
      
      <div class="framework-summary mb-4">
        <h5><i class="bi bi-bar-chart"></i> ملخص الإطار</h5>
        <div class="row">
          <div class="col-md-3">
            <div class="stat-card text-center p-3 bg-primary text-white rounded">
              <h3>${framework.totalActivities}</h3>
              <p>الأنشطة</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card text-center p-3 bg-success text-white rounded">
              <h3>${framework.totalCompetencies}</h3>
              <p>الجدارات</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card text-center p-3 bg-warning text-white rounded">
              <h3>${framework.totalSkills}</h3>
              <p>المهارات</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card text-center p-3 bg-info text-white rounded">
              <h3>${framework.totalKnowledge}</h3>
              <p>المعارف</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="framework-details">
        <h5><i class="bi bi-file-text"></i> تفاصيل الإطار</h5>
        
        <div class="section mb-4">
          <h6 class="text-primary">1. وصف المهنة</h6>
          <div class="p-3 bg-light rounded">
            ${framework.jobDescription.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div class="section mb-4">
          <h6 class="text-success">2. الأنشطة الرئيسية (${framework.totalActivities})</h6>
          <div class="activities-summary">
  `;
  
  framework.activities.forEach((activity, index) => {
    html += `
      <div class="activity-summary-item mb-2 p-2 border rounded">
        <strong>${index + 1}.</strong> ${activity.text}
        <small class="text-muted">(${activity.source === 'gemini' ? 'GEMINI' : 'مخصص'})</small>
      </div>
    `;
  });
  
  html += `
          </div>
        </div>
        
        <div class="section mb-4">
          <h6 class="text-warning">3. الجدارات والمهارات والمعارف</h6>
  `;
  
  framework.competenciesData.forEach((activityComp, index) => {
    html += `
      <div class="competency-summary mb-3">
        <h6 class="text-dark"><i class="bi bi-target"></i> ${activityComp.activity}</h6>
    `;
    
    activityComp.competencies.forEach((comp, compIndex) => {
      html += `
        <div class="competency-detail mb-2 ms-3">
          <strong>الجدارة ${compIndex + 1}:</strong> ${comp.text}
          
          ${comp.skills.length > 0 ? `
            <div class="skills-list ms-3 mt-1">
              <small class="text-success"><strong>المهارات العملية:</strong></small>
              <ul class="small">
                ${comp.skills.map(skill => `<li>${skill.text}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${comp.knowledge.length > 0 ? `
            <div class="knowledge-list ms-3 mt-1">
              <small class="text-info"><strong>المعارف النظرية:</strong></small>
              <ul class="small">
                ${comp.knowledge.map(know => `<li>${know.text}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      `;
    });
    
    html += `</div>`;
  });
  
  html += `
        </div>
      </div>
      
      <div class="export-section mt-4 text-center">
        <button class="btn btn-primary me-2" onclick="exportFramework('json')">
          <i class="bi bi-download"></i> تصدير JSON
        </button>
        <button class="btn btn-secondary me-2" onclick="exportFramework('pdf')">
          <i class="bi bi-file-pdf"></i> تصدير PDF
        </button>
        <button class="btn btn-success" onclick="printFramework()">
          <i class="bi bi-printer"></i> طباعة
        </button>
      </div>
      
      <div class="d-flex justify-content-between mt-4">
        <button type="button" class="btn btn-secondary" onclick="showStep(3)">
          <i class="bi bi-arrow-right-circle-fill"></i> السابق إلى الخطوة 3
        </button>
        <button type="button" class="btn btn-success" onclick="resetFramework()">
          <i class="bi bi-arrow-clockwise"></i> إعادة تشغيل
        </button>
      </div>
    </div>
  `;
  
  document.getElementById('step4').querySelector('.card-body').innerHTML = html;
}

// ==================================================
// EXPORT AND UTILITY FUNCTIONS
// ==================================================

// Export Framework
function exportFramework(format) {
  const framework = curriculumData.step4.finalFramework;
  
  if (format === 'json') {
    const dataStr = JSON.stringify(curriculumData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `curriculum-framework-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  } else if (format === 'pdf') {
    // This would require a PDF library like jsPDF
    alert('ميزة تصدير PDF ستكون متاحة قريباً');
  }
}

// Print Framework
function printFramework() {
  const printContent = document.getElementById('step4').innerHTML;
  const printWindow = window.open('', '_blank');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>إطار المنهج الدراسي</title>
      <style>
        body { font-family: Arial, sans-serif; direction: rtl; }
        .btn, .alert { display: none !important; }
        .framework-summary .row { display: flex; gap: 10px; }
        .stat-card { flex: 1; }
        @media print {
          .btn, .export-section, .d-flex { display: none !important; }
        }
      </style>
    </head>
    <body>
      <h1>إطار المنهج الدراسي</h1>
      ${printContent}
    </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.print();
}

// Reset Framework
function resetFramework() {
  if (confirm('هل أنت متأكد من إعادة تشغيل التطبيق؟ ستفقد جميع البيانات المدخلة.')) {
    // Reset all data
    curriculumData = {
      step1: {
        specializationInfo: '',
        generatedJobDescription: '',
        userJobDescription: '',
        selectedChoice: 'gemini',
        finalJobDescription: ''
      },
      step2: {
        generatedActivities: [],
        customActivities: [],
        selectedActivities: [],
        allActivities: []
      },
      step3: {
        competencies: [],
        skills: [],
        knowledge: []
      },
      step4: {
        finalFramework: {}
      }
    };
    
    // Clear all form inputs
    document.getElementById('specializationInfo').value = '';
    document.getElementById('jobDescriptionOutput').innerHTML = '';
    document.getElementById('customActivityInput').value = '';
    
    // Reset radio buttons
    document.getElementById('choiceGemini').checked = true;
    
    // Go back to step 1
    showStep(1);
  }
}

// ==================================================
// GEMINI API SIMULATION (Replace with actual API calls)
// ==================================================

async function simulateGeminiResponse(prompt, type) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock responses based on type
  switch (type) {
    case 'job-description':
      return `
وصف المهنة: أخصائي الإلكترونيات والتصنيع

نظرة عامة:
يقوم أخصائي الإلكترونيات والتصنيع بتصميم وتطوير وصيانة الأنظمة الإلكترونية والمعدات الصناعية. يجمع هذا التخصص بين المعرفة النظرية في الهندسة الإلكترونية والمهارات العملية في التصنيع والإنتاج.

المسؤوليات الأساسية:
• تصميم وتطوير الدوائر الإلكترونية والأنظمة الرقمية
• برمجة وتشغيل المعدات الصناعية والروبوتات
• إجراء الصيانة الوقائية والإصلاحية للأجهزة الإلكترونية
• مراقبة جودة الإنتاج وضمان المعايير الفنية
• إعداد التقارير الفنية وتوثيق العمليات

البيئة المهنية:
يعمل في المصانع، ورش التصنيع، مختبرات البحث والتطوير، وشركات الأتمتة الصناعية.

المتطلبات الأساسية:
• درجة في الهندسة الإلكترونية أو تخصص ذات صلة
• خبرة في برمجة المتحكمات الدقيقة
• معرفة بأنظمة التحكم الصناعي
• مهارات حل المشاكل والتفكير التحليلي

فرص التطوير المهني:
مهندس أنظمة، مدير إنتاج، استشاري تقني، أو متخصص في الذكاء الاصطناعي الصناعي.
      `;
      
    case 'activities':
      return `
1. تصميم وتطوير الدوائر الإلكترونية الأساسية والمتقدمة
2. برمجة المتحكمات الدقيقة وأنظمة التحكم المدمجة
3. تشغيل وصيانة خطوط الإنتاج الآلية
4. إجراء اختبارات الجودة والتحليل الفني للمنتجات
5. تركيب وتكوين أنظمة الأتمتة الصناعية
6. صيانة وإصلاح المعدات الإلكترونية والصناعية
7. تطوير برامج التحكم في العمليات الصناعية
8. مراقبة وتحليل البيانات من أنظمة الإنتاج
9. إعداد التقارير الفنية وتوثيق العمليات
10. تدريب العاملين على استخدام المعدات الجديدة
11. إدارة المشاريع التقنية وتنسيق الفرق
12. تطبيق معايير السلامة والجودة في البيئة الصناعية
13. تحليل الأعطال وإيجاد الحلول التقنية
14. تطوير وتحسين العمليات الصناعية
15. التعامل مع أنظمة الشبكات الصناعية والاتصالات
16. إدارة المخزون التقني والقطع الغيار
17. التخطيط للصيانة الوقائية والدورية
18. تقييم وتحسين كفاءة الطاقة في الأنظمة
      `;
      
    case 'competencies':
      return `
النشاط: تصميم وتطوير الدوائر الإلكترونية الأساسية والمتقدمة
الجدارات:
- تحليل وتصميم الدوائر الإلكترونية التناظرية والرقمية
- استخدام برامج المحاكاة الإلكترونية والتصميم
- فهم خصائص المكونات الإلكترونية وتطبيقاتها
- تطبيق معايير السلامة في التصميم الإلكتروني

النشاط: برمجة المتحكمات الدقيقة وأنظمة التحكم المدمجة
الجدارات:
- برمجة المتحكمات الدقيقة بلغات مختلفة
- تصميم وتطوير البرمجيات المدمجة
- فهم معمارية المعالجات والأنظمة المدمجة
- تطبيق بروتوكولات الاتصال في الأنظمة المدمجة

النشاط: تشغيل وصيانة خطوط الإنتاج الآلية
الجدارات:
- تشغيل وإدارة خطوط الإنتاج الآلية
- تطبيق مبادئ الصيانة الوقائية والإصلاحية
- استخدام أدوات القياس والاختبار الصناعية
- إدارة وتحليل بيانات الإنتاج والأداء
      `;
      
    case 'skills-knowledge':
      return `
المهارات العملية:
- تطبيق قوانين الكهرباء في حل المسائل العملية
- استخدام أجهزة القياس الإلكترونية بدقة
- تجميع وتوصيل الدوائر الإلكترونية
- اختبار وفحص المكونات الإلكترونية
- قراءة وتفسير المخططات التقنية

المعارف النظرية:
- قوانين الكهرباء والمغناطيسية الأساسية
- خصائص أشباه الموصلات والمكونات الإلكترونية
- مبادئ الدوائر التناظرية والرقمية
- معايير السلامة في الأعمال الكهربائية
- رموز ومصطلحات الهندسة الإلكترونية
      `;
      
    default:
      return 'استجابة تجريبية من GEMINI';
  }
}

// ==================================================
// EVENT LISTENERS AND INITIALIZATION
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Step 1 event listeners
  const generateJobBtn = document.getElementById('generateJobDescriptionBtn');
  if (generateJobBtn) {
    generateJobBtn.addEventListener('click', generateJobDescription);
  }
  
  const step1NextBtn = document.getElementById('step1NextBtn');
  if (step1NextBtn) {
    step1NextBtn.addEventListener('click', handleStep1Next);
  }
  
  // Initialize Step 2 event listeners
  const generateActivitiesBtn = document.getElementById('generateActivitiesBtn');
  if (generateActivitiesBtn) {
    generateActivitiesBtn.addEventListener('click', generateMainActivities);
  }
  
  const addCustomActivityBtn = document.getElementById('addCustomActivityBtn');
  if (addCustomActivityBtn) {
    addCustomActivityBtn.addEventListener('click', addCustomActivity);
  }
  
  const step2NextBtn = document.getElementById('step2NextBtn');
  if (step2NextBtn) {
    step2NextBtn.addEventListener('click', handleStep2Next);
  }
  
  // Handle Enter key for custom activity input
  const customActivityInput = document.getElementById('customActivityInput');
  if (customActivityInput) {
    customActivityInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        addCustomActivity();
      }
    });
  }
  
  // Initialize choice radio buttons to update display
  const choiceRadios = document.querySelectorAll('input[name="descriptionChoice"]');
  choiceRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      // You can add logic here to preview the selected description
    });
  });
  
  // Initialize textarea auto-resize
  const textareas = document.querySelectorAll('textarea');
  textareas.forEach(textarea => {
    textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });
  });
});

// ==================================================
// ADDITIONAL UTILITY FUNCTIONS
// ==================================================

// Update Competency Text
function updateCompetencyText(actIndex, compIndex, newText) {
  if (curriculumData.step3.competencies[actIndex] && 
      curriculumData.step3.competencies[actIndex].competencies[compIndex]) {
    curriculumData.step3.competencies[actIndex].competencies[compIndex].text = newText;
  }
}

// Remove Competency
function removeCompetency(actIndex, compIndex) {
  if (confirm('هل أنت متأكد من حذف هذه الجدارة؟')) {
    curriculumData.step3.competencies[actIndex].competencies.splice(compIndex, 1);
    displayCompetencies();
  }
}

// Add Custom Competency
function addCustomCompetency(actIndex) {
  const text = prompt('أدخل نص الجدارة الجديدة:');
  if (text && text.trim()) {
    const newCompetency = {
      id: Date.now(),
      text: text.trim(),
      skills: [],
      knowledge: []
    };
    curriculumData.step3.competencies[actIndex].competencies.push(newCompetency);
    displayCompetencies();
  }
}

// Show Progress Indicator
function updateProgressIndicator(currentStep) {
  // You can add a progress bar here
  const steps = ['تعريف المهنة', 'الأنشطة الرئيسية', 'الجدارات والمهارات', 'الإطار النهائي'];
  const progress = (currentStep / 4) * 100;
  
  // Create or update progress bar if it exists
  let progressBar = document.getElementById('progressBar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'progressBar';
    progressBar.className = 'progress mb-4';
    progressBar.innerHTML = `
      <div class="progress-bar progress-bar-striped progress-bar-animated" 
           role="progressbar" style="width: ${progress}%">
        ${steps[currentStep - 1]}
      </div>
    `;
    document.querySelector('.container').insertBefore(progressBar, document.querySelector('.container').firstChild);
  } else {
    const bar = progressBar.querySelector('.progress-bar');
    bar.style.width = progress + '%';
    bar.textContent = steps[currentStep - 1];
  }
}

// Validate Step Data
function validateStepData(stepNumber) {
  switch (stepNumber) {
    case 1:
      return curriculumData.step1.finalJobDescription.trim() !== '';
    case 2:
      return curriculumData.step2.selectedActivities.length > 0;
    case 3:
      return curriculumData.step3.competencies.length > 0;
    case 4:
      return Object.keys(curriculumData.step4.finalFramework).length > 0;
    default:
      return false;
  }
}

// Enhanced Show Step with Validation
function showStepWithValidation(stepNumber) {
  const currentStep = parseInt(document.querySelector('.step-section[style*="block"]')?.id?.replace('step', '') || '1');
  
  if (stepNumber > currentStep && !validateStepData(currentStep)) {
    alert(`يجب إكمال الخطوة ${currentStep} قبل المتابعة`);
    return;
  }
  
  showStep(stepNumber);
  updateProgressIndicator(stepNumber);
}

// Export functionality for different formats
function exportToWord() {
  // This would require a library like docx.js
  alert('ميزة تصدير Word ستكون متاحة قريباً');
}

function exportToExcel() {
  // This would require a library like SheetJS
  alert('ميزة تصدير Excel ستكون متاحة قريباً');
}

// Save progress to localStorage (if needed for persistence)
function saveProgress() {
  try {
    localStorage.setItem('curriculumFrameworkData', JSON.stringify(curriculumData));
    console.log('Progress saved successfully');
  } catch (error) {
    console.warn('Could not save progress to localStorage:', error);
  }
}

// Load progress from localStorage
function loadProgress() {
  try {
    const saved = localStorage.getItem('curriculumFrameworkData');
    if (saved) {
      curriculumData = JSON.parse(saved);
      console.log('Progress loaded successfully');
      return true;
    }
  } catch (error) {
    console.warn('Could not load progress from localStorage:', error);
  }
  return false;
}

// Auto-save functionality
setInterval(() => {
  if (Object.keys(curriculumData.step1).some(key => curriculumData.step1[key])) {
    saveProgress();
  }
}, 30000); // Auto-save every 30 seconds

// Initialize the application
console.log('AI-Powered Curriculum Framework Designer Initialized');
console.log('Version: 1.0.0');
console.log('Ready for use!');