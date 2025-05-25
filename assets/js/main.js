// ==================================================
// AI-Powered Curriculum Framework Designer - Merged JS
// ==================================================

// ==================================================
// API Interaction Layer
// ==================================================

/**
 * Calls the actual Gemini API with the given prompt content and type.
 * This function simulates an API call and returns mock responses.
 * In a real application, this would make a fetch request to the Gemini API endpoint.
 *
 * @param {string} promptContent - The text prompt to send to the API.
 * @param {string} type - The type of content being requested (e.g., 'job-description', 'activities').
 * @returns {Promise<string>} A promise that resolves with the API response text.
 */
async function callActualGeminiAPI(promptContent, type) {
  const apiKey = localStorage.getItem("userApiKey"); // Using 'userApiKey'

  if (!apiKey) {
    // Immediately return a Promise that rejects if API key is missing
    return Promise.reject({
      error: "NO_API_KEY",
      message: "الرجاء إدخال مفتاح API أولاً في الإعدادات بالأسفل.",
    });
  }

  console.log(
    "Attempting to call actual Gemini API for type:",
    type,
    "with prompt:",
    promptContent
  );

  // Simulate API delay to mimic network latency
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Increased delay for better loading indicator visibility

  // Mock responses based on type (reusing logic from old simulateGeminiResponse)
  // Added (API) to responses to distinguish them during testing.
  switch (type) {
    case "job-description":
      return `
وصف المهنة: أخصائي الإلكترونيات والتصنيع (من API)

نظرة عامة:
يقوم أخصائي الإلكترونيات والتصنيع بتصميم وتطوير وصيانة الأنظمة الإلكترونية والمعدات الصناعية. يجمع هذا التخصص بين المعرفة النظرية في الهندسة الإلكترونية والمهارات العملية في التصنيع والإنتاج.

المسؤوليات الأساسية:
• تصميم وتطوير الدوائر الإلكترونية والأنظمة الرقمية (من API)
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

    case "activities":
      return `
1. تصميم وتطوير الدوائر الإلكترونية الأساسية والمتقدمة (من API)
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

    case "competencies":
      return `
النشاط: تصميم وتطوير الدوائر الإلكترونية الأساسية والمتقدمة (من API)
الجدارات:
- تحليل وتصميم الدوائر الإلكترونية التناظرية والرقمية
- استخدام برامج المحاكاة الإلكترونية والتصميم
- فهم خصائص المكونات الإلكترونية وتطبيقاتها
- تطبيق معايير السلامة في التصميم الإلكتروني

النشاط: برمجة المتحكمات الدقيقة وأنظمة التحكم المدمجة (من API)
الجدارات:
- برمجة المتحكمات الدقيقة بلغات مختلفة
- تصميم وتطوير البرمجيات المدمجة
- فهم معمارية المعالجات والأنظمة المدمجة
- تطبيق بروتوكولات الاتصال في الأنظمة المدمجة

النشاط: تشغيل وصيانة خطوط الإنتاج الآلية (من API)
الجدارات:
- تشغيل وإدارة خطوط الإنتاج الآلية
- تطبيق مبادئ الصيانة الوقائية والإصلاحية
- استخدام أدوات القياس والاختبار الصناعية
- إدارة وتحليل بيانات الإنتاج والأداء
      `;

    case "skills-knowledge":
      return `
المهارات العملية (من API):
- تطبيق قوانين الكهرباء في حل المسائل العملية
- استخدام أجهزة القياس الإلكترونية بدقة
- تجميع وتوصيل الدوائر الإلكترونية
- اختبار وفحص المكونات الإلكترونية
- قراءة وتفسير المخططات التقنية

المعارف النظرية (من API):
- قوانين الكهرباء والمغناطيسية الأساسية
- خصائص أشباه الموصلات والمكونات الإلكترونية
- مبادئ الدوائر التناظرية والرقمية
- معايير السلامة في الأعمال الكهربائية
- رموز ومصطلحات الهندسة الإلكترونية
      `;

    default:
      return "استجابة تجريبية من API";
  }
}

// Global Data Storage (Temporary Database)
let curriculumData = {
  step1: {
    specializationInfo: "",
    generatedJobDescription: "",
    userJobDescription: "",
    selectedChoice: "gemini",
    finalJobDescription: "",
    lastJobDescriptionPrompt: null,
  },
  step2: {
    generatedActivities: [],
    customActivities: [],
    selectedActivities: [],
    allActivities: [],
    lastActivitiesPrompt: null,
  },
  step3: {
    competencies: [],
    skills: [],
    knowledge: [],
    lastCompetenciesPrompt: null,
    lastSkillsKnowledgeAttempted: false,
  },
  step4: {
    finalFramework: {},
  },
};

// ==================================================
// UTILITY FUNCTIONS
// ==================================================

/**
 * Displays a custom alert message to the user.
 * This replaces native browser alert() for better UI integration.
 * @param {string} title - The title of the alert.
 * @param {string} message - The message content.
 * @param {string} type - 'success', 'error', 'info', or 'warning' to style the alert.
 * @param {function} [onConfirm] - Optional callback function to execute when the confirm button is clicked.
 * @param {boolean} [showCancel=false] - Whether to show a cancel button.
 * @param {boolean} [isPrompt=false] - If true, an input field will be shown, and its value passed to onConfirm.
 */
function showCustomAlert(
  title,
  message,
  type,
  onConfirm = null,
  showCancel = false,
  isPrompt = false
) {
  let overlay = document.getElementById("customAlertOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "customAlertOverlay";
    overlay.className = "custom-alert-overlay";
    document.body.appendChild(overlay);
  }

  let alertBox = document.getElementById("customAlertBox");
  if (!alertBox) {
    alertBox = document.createElement("div");
    alertBox.id = "customAlertBox";
    alertBox.className = "custom-alert-box";
    overlay.appendChild(alertBox);
  }

  let iconClass = "";
  let buttonClass = "btn-primary";
  switch (type) {
    case "success":
      iconClass = "bi bi-check-circle-fill text-success";
      buttonClass = "btn-success";
      break;
    case "error":
      iconClass = "bi bi-x-circle-fill text-danger";
      buttonClass = "btn-danger";
      break;
    case "info":
      iconClass = "bi bi-info-circle-fill text-info";
      buttonClass = "btn-info";
      break;
    case "warning":
      iconClass = "bi bi-exclamation-triangle-fill text-warning";
      buttonClass = "btn-warning";
      break;
    default:
      iconClass = "bi bi-info-circle-fill text-secondary";
      buttonClass = "btn-secondary";
  }

  alertBox.innerHTML = `
    <h5 class="mb-3"><i class="${iconClass} me-2"></i> ${title}</h5>
    <p>${message}</p>
    ${
      isPrompt
        ? `<input type="text" id="customAlertInput" class="form-control mb-3" placeholder="أدخل هنا..." aria-label="مدخل نص التنبيه">`
        : ""
    }
    <button id="customAlertConfirmBtn" class="btn ${buttonClass} me-2">موافق</button>
    ${
      showCancel
        ? `<button id="customAlertCancelBtn" class="btn btn-secondary">إلغاء</button>`
        : ""
    }
  `;

  overlay.style.display = "flex"; // Show the overlay

  document.getElementById("customAlertConfirmBtn").onclick = () => {
    hideCustomAlert();
    if (onConfirm) {
      if (isPrompt) {
        const inputValue = document
          .getElementById("customAlertInput")
          .value.trim();
        onConfirm(inputValue); // Pass the input value to the callback
      } else {
        onConfirm();
      }
    }
  };

  if (showCancel) {
    document.getElementById("customAlertCancelBtn").onclick = () => {
      hideCustomAlert();
      // If it's a prompt and cancelled, the onConfirm should not be called with a value
      if (isPrompt && onConfirm) {
        onConfirm(null); // Indicate cancellation for prompt by passing null
      }
    };
  }

  // Add event listener for Enter key on the input field if it's a prompt
  if (isPrompt) {
    const customAlertInput = document.getElementById("customAlertInput");
    customAlertInput.focus(); // Focus the input field
    customAlertInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("customAlertConfirmBtn").click(); // Simulate click on confirm button
      }
    });
  }
}

/**
 * Hides the custom alert message.
 */
function hideCustomAlert() {
  const overlay = document.getElementById("customAlertOverlay");
  if (overlay) {
    overlay.style.display = "none";
  }
}

/**
 * Shows a specific step in the multi-step form.
 * It also updates the global progress indicator.
 * @param {number} stepNumber - The number of the step to show (1-4).
 */
function showStep(stepNumber) {
  // Hide all steps
  document.querySelectorAll(".step-section").forEach((step) => {
    step.style.display = "none";
  });

  // Show selected step
  document.getElementById(`step${stepNumber}`).style.display = "block";

  // Update data or display when moving between steps
  if (stepNumber === 2) {
    updateStep2Display();
  } else if (stepNumber === 3) {
    updateStep3Display();
  } else if (stepNumber === 4) {
    updateStep4Display();
  }

  updateProgressIndicator(stepNumber); // Update progress bar
  saveProgress(); // Save progress on step change
}

/**
 * Shows a loader (spinner) within a button and disables the button.
 * @param {string} buttonId - The ID of the button element.
 */
function showLoader(buttonId) {
  const button = document.getElementById(buttonId);
  if (button) {
    const loader = button.querySelector(".loader");
    if (loader) {
      loader.style.display = "inline-block";
    }
    button.disabled = true;
  }
}

/**
 * Hides the loader (spinner) within a button and enables the button.
 * @param {string} buttonId - The ID of the button element.
 */
function hideLoader(buttonId) {
  const button = document.getElementById(buttonId); // Corrected: use buttonId directly
  if (button) {
    const loader = button.querySelector(".loader");
    if (loader) {
      loader.style.display = "none";
    }
    button.disabled = false;
  }
}

/**
 * Formats the AI response based on its type for display in the UI.
 * @param {string} response - The raw response string from the AI.
 * @param {string} type - The type of response ('job-description', 'activities', 'general').
 * @returns {string|Array<Object>} Formatted HTML string or an array of activity objects.
 */
function formatAIResponse(response, type = "general") {
  if (type === "job-description") {
    return `
      <div class="ai-response-container">
        <div class="response-header">
          <i class="bi bi-robot" aria-hidden="true"></i> وصف المهنة المُنشأ بواسطة GEMINI
        </div>
        <div class="response-content">
          ${response.replace(/\n/g, "<br>")}
        </div>
      </div>
    `;
  } else if (type === "activities") {
    // Split by newline, filter out empty lines, and map to activity objects
    return response
      .split("\n")
      .filter((line) => line.trim())
      .map((activity, index) => ({
        id: Date.now() + index + Math.random(), // Ensure unique ID
        text: activity.replace(/^\d+[\.\-\*]?\s*/, "").trim(), // Remove leading numbers/bullets
        source: "gemini",
        selected: true,
      }));
  }
  return response;
}

/**
 * Updates the global progress indicator (progress bar and label).
 * @param {number} currentStep - The current step number (1-4).
 */
function updateProgressIndicator(currentStep) {
  const steps = [
    "تعريف المهنة",
    "الأنشطة الرئيسية",
    "الجدارات والمهارات",
    "الإطار النهائي",
  ];
  const progress = (currentStep / 4) * 100;

  let progressWrapper = document.getElementById("progressWrapper");
  let progressBarDiv = document.getElementById("progressBar");
  let progressLabel = document.getElementById("progressLabel");
  let currentStepNameSpan = document.getElementById("currentStepName");

  if (!progressWrapper) {
    // This block should ideally not be hit if HTML is loaded correctly,
    // but acts as a fallback or for initial setup if not defined in HTML
    progressWrapper = document.createElement("div");
    progressWrapper.id = "progressWrapper";
    progressWrapper.className = "mb-4";
    document
      .querySelector(".container")
      .insertBefore(
        progressWrapper,
        document.querySelector(".container").firstChild
      );

    progressLabel = document.createElement("p");
    progressLabel.id = "progressLabel";
    progressLabel.className = "text-muted mb-1";
    progressLabel.textContent = "الخطوة الحالية: ";
    currentStepNameSpan = document.createElement("span");
    currentStepNameSpan.id = "currentStepName";
    progressLabel.appendChild(currentStepNameSpan);
    progressWrapper.appendChild(progressLabel);

    progressBarDiv = document.createElement("div");
    progressBarDiv.id = "progressBar";
    progressBarDiv.className = "progress";
    progressBarDiv.innerHTML = `
      <div class="progress-bar progress-bar-striped progress-bar-animated"
           role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
      </div>
    `;
    progressWrapper.appendChild(progressBarDiv);
  }

  // Update the progress bar and label
  const bar = progressBarDiv.querySelector(".progress-bar");
  if (bar) {
    bar.style.width = progress + "%";
    bar.setAttribute("aria-valuenow", progress);
    bar.textContent = steps[currentStep - 1]; // Display current step name inside the bar
  }
  if (currentStepNameSpan) {
    currentStepNameSpan.textContent = steps[currentStep - 1]; // Display current step name in the label
  }

  // Ensure the progress wrapper is visible
  progressWrapper.style.display = "block";
}

/**
 * Validates data for the given step before allowing navigation.
 * @param {number} stepNumber - The step number to validate.
 * @returns {boolean} True if data is valid, false otherwise.
 */
function validateStepData(stepNumber) {
  switch (stepNumber) {
    case 1:
      if (!curriculumData.step1.finalJobDescription.trim()) {
        showCustomAlert(
          "خطأ في البيانات",
          "يرجى التأكد من وجود وصف للمهنة قبل المتابعة.",
          "error"
        );
        return false;
      }
      return true;
    case 2:
      updateSelectedActivities(); // Ensure selected activities are up-to-date
      if (curriculumData.step2.selectedActivities.length === 0) {
        showCustomAlert(
          "خطأ في البيانات",
          "يرجى اختيار نشاط واحد على الأقل للمتابعة.",
          "error"
        );
        return false;
      }
      return true;
    case 3:
      if (
        curriculumData.step3.competencies.length === 0 ||
        curriculumData.step3.competencies.some(
          (ac) => ac.competencies.length === 0
        )
      ) {
        showCustomAlert(
          "خطأ في البيانات",
          "يجب توليد الجدارات والمهارات والمعارف لكل نشاط قبل المتابعة.",
          "error"
        );
        return false;
      }
      // Also ensure skills and knowledge are generated for all competencies
      const allSkillsKnowledgeGenerated =
        curriculumData.step3.competencies.every((activityComp) =>
          activityComp.competencies.every(
            (comp) => comp.skills.length > 0 && comp.knowledge.length > 0
          )
        );
      if (!allSkillsKnowledgeGenerated) {
        showCustomAlert(
          "خطأ في البيانات",
          "يرجى توليد المهارات والمعارف لجميع الجدارات قبل المتابعة.",
          "error"
        );
        return false;
      }
      return true;
    case 4:
      return Object.keys(curriculumData.step4.finalFramework).length > 0;
    default:
      return false;
  }
}

/**
 * Enhanced function to show a step, including validation for the current step.
 * @param {number} stepNumber - The number of the step to navigate to.
 */
function showStepWithValidation(stepNumber) {
  const currentStepElement = document.querySelector(
    '.step-section[style*="block"]'
  );
  const currentStep = currentStepElement
    ? parseInt(currentStepElement.id.replace("step", ""))
    : 1;

  // Only validate if trying to move forward
  if (stepNumber > currentStep) {
    if (!validateStepData(currentStep)) {
      return; // Stop if validation fails
    }
  }
  showStep(stepNumber);
}

// ==================================================
// STEP 1: JOB DESCRIPTION FUNCTIONS
// ==================================================

/**
 * Generates a job description using the GEMINI API based on specialization info.
 */
async function generateJobDescription() {
  const specializationInfo = document
    .getElementById("specializationInfo")
    .value.trim();

  if (!specializationInfo) {
    showCustomAlert(
      "خطأ في الإدخال",
      "يرجى إدخال معلومات عن التخصص أولاً.",
      "warning"
    );
    return;
  }

  showLoader("generateJobDescriptionBtn");
  // Hide retry button if it was visible
  const retryBtn = document.getElementById("retryJobDescriptionBtn");
  if (retryBtn) retryBtn.style.display = "none";

  try {
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

    curriculumData.step1.lastJobDescriptionPrompt = prompt;

    const mockResponse = await callActualGeminiAPI(prompt, "job-description");

    curriculumData.step1.specializationInfo = specializationInfo;
    curriculumData.step1.generatedJobDescription = mockResponse;

    const formattedResponse = formatAIResponse(mockResponse, "job-description");
    document.getElementById("jobDescriptionOutput").innerHTML =
      formattedResponse;

    hideLoader("generateJobDescriptionBtn");
    showCustomAlert("نجاح", "تم توليد وصف الوظيفة بنجاح!", "success");
  } catch (error) {
    console.error("خطأ في توليد وصف الوظيفة:", error);
    if (error && error.error === "NO_API_KEY") {
      showCustomAlert("خطأ في مفتاح API", error.message, "error");
    } else {
      showCustomAlert(
        "خطأ",
        "حدث خطأ أثناء توليد وصف المهنة. يرجى المحاولة مرة أخرى.",
        "error"
      );
      showRetryButton("jobDescription"); // Show retry button on other errors
    }
    hideLoader("generateJobDescriptionBtn");
  }
}

/**
 * Handles the logic for the "Next" button in Step 1.
 */
function handleStep1Next() {
  const choice = document.querySelector(
    'input[name="descriptionChoice"]:checked'
  ).value;
  let finalDescription = "";

  if (choice === "gemini") {
    finalDescription = curriculumData.step1.generatedJobDescription;
  } else {
    // If user chooses their own, take from the specializationInfo input field
    finalDescription = document
      .getElementById("specializationInfo")
      .value.trim();
  }

  if (!finalDescription.trim()) {
    showCustomAlert(
      "خطأ في البيانات",
      "يرجى التأكد من وجود وصف للمهنة قبل المتابعة.",
      "warning"
    );
    return;
  }

  curriculumData.step1.selectedChoice = choice;
  curriculumData.step1.finalJobDescription = finalDescription;

  showStepWithValidation(2);
}

// ==================================================
// STEP 2: MAIN ACTIVITIES FUNCTIONS
// ==================================================

/**
 * Updates the display for Step 2 with the selected job description.
 */
function updateStep2Display() {
  const displayArea = document.getElementById("jobDescriptionDisplayStep2");
  displayArea.value = curriculumData.step1.finalJobDescription;
  displayActivitiesList(); // Refresh activities list when entering step 2
}

/**
 * Generates main activities using the GEMINI API based on the final job description.
 */
async function generateMainActivities() {
  if (!curriculumData.step1.finalJobDescription) {
    showCustomAlert(
      "خطأ",
      "لا يوجد وصف مهنة من الخطوة السابقة. يرجى العودة للخطوة 1.",
      "warning"
    );
    return;
  }

  showLoader("generateActivitiesBtn");
  const retryBtn = document.getElementById("retryActivitiesBtn");
  if (retryBtn) retryBtn.style.display = "none";

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
    curriculumData.step2.lastActivitiesPrompt = prompt;

    const response = await callActualGeminiAPI(prompt, "activities");
    const activities = formatAIResponse(response, "activities");

    curriculumData.step2.generatedActivities = activities;
    // Merge generated activities with existing custom activities, ensuring no duplicates by ID
    const existingCustomActivities = curriculumData.step2.allActivities.filter(
      (a) => a.source === "user"
    );
    curriculumData.step2.allActivities = [
      ...activities,
      ...existingCustomActivities,
    ];

    displayActivitiesList();
    hideLoader("generateActivitiesBtn");
    showCustomAlert("نجاح", "تم توليد الأنشطة الرئيسية بنجاح!", "success");
  } catch (error) {
    console.error("خطأ في توليد الأنشطة:", error);
    if (error && error.error === "NO_API_KEY") {
      showCustomAlert("خطأ في مفتاح API", error.message, "error");
    } else {
      showCustomAlert(
        "خطأ",
        "حدث خطأ أثناء توليد الأنشطة. يرجى المحاولة مرة أخرى.",
        "error"
      );
      showRetryButton("activities");
    }
    hideLoader("generateActivitiesBtn");
  }
}

/**
 * Displays the list of activities (generated and custom) in Step 2.
 */
function displayActivitiesList() {
  const container = document.getElementById("activitiesListContainer");
  // Show content loader while rendering
  container.innerHTML =
    '<div class="content-loader"><div class="spinner"></div><p class="ms-2">جاري تحميل الأنشطة...</p></div>';

  setTimeout(() => {
    // Small delay to allow loader to show
    if (curriculumData.step2.allActivities.length === 0) {
      container.innerHTML =
        '<p class="text-muted">سيتم عرض الأنشطة المقترحة هنا كقائمة اختيار.</p>';
      return;
    }

    let html = '<div class="activities-list">';

    curriculumData.step2.allActivities.forEach((activity, index) => {
      const sourceIcon =
        activity.source === "gemini"
          ? '<i class="bi bi-robot text-primary" title="مُنشأ بواسطة GEMINI"></i>'
          : '<i class="bi bi-person text-success" title="مُضاف من المستخدم"></i>';

      html += `
        <div class="form-check activity-item p-3 border rounded mb-2">
          <div class="d-flex justify-content-between align-items-start w-100">
            <div>
              <input class="form-check-input me-2" type="checkbox"
                     id="activity_${activity.id}"
                     ${activity.selected ? "checked" : ""}
                     onchange="toggleActivity(${activity.id})"
                     aria-label="تحديد النشاط: ${activity.text}">
              <label class="form-check-label flex-grow-1" for="activity_${
                activity.id
              }">
                <textarea class="form-control border-0 p-0 activity-text"
                          onchange="updateActivityText(${
                            activity.id
                          }, this.value)"
                          rows="2" aria-label="نص النشاط">${
                            activity.text
                          }</textarea>
              </label>
            </div>
            <div class="ms-2">
              ${sourceIcon}
              <button class="btn btn-sm btn-outline-danger ms-2"
                      onclick="removeActivity(${
                        activity.id
                      })" title="حذف النشاط" aria-label="حذف النشاط">
                <i class="bi bi-trash" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    html += "</div>";
    container.innerHTML = html;
    updateSelectedActivities(); // Ensure selected activities are up-to-date after display
  }, 50); // 50ms delay to allow loader to render
}

/**
 * Toggles the selection status of an activity.
 * @param {number} activityId - The ID of the activity to toggle.
 */
function toggleActivity(activityId) {
  const activity = curriculumData.step2.allActivities.find(
    (a) => a.id === activityId
  );
  if (activity) {
    activity.selected = !activity.selected;
  }
  updateSelectedActivities();
  saveProgress(); // Save progress on activity toggle
}

/**
 * Updates the text content of an activity.
 * @param {number} activityId - The ID of the activity to update.
 * @param {string} newText - The new text for the activity.
 */
function updateActivityText(activityId, newText) {
  const activity = curriculumData.step2.allActivities.find(
    (a) => a.id === activityId
  );
  if (activity) {
    activity.text = newText.trim();
  }
  saveProgress(); // Save progress on activity text update
}

/**
 * Removes an activity from the list.
 * @param {number} activityId - The ID of the activity to remove.
 */
function removeActivity(activityId) {
  showCustomAlert(
    "تأكيد الحذف",
    "هل أنت متأكد من حذف هذا النشاط؟",
    "warning",
    () => {
      curriculumData.step2.allActivities =
        curriculumData.step2.allActivities.filter((a) => a.id !== activityId);
      displayActivitiesList();
      updateSelectedActivities();
      saveProgress(); // Save progress on activity removal
    },
    true
  ); // Show cancel button
}

/**
 * Adds a custom activity to the list.
 */
function addCustomActivity() {
  const input = document.getElementById("customActivityInput");
  const text = input.value.trim();

  if (!text) {
    showCustomAlert("خطأ في الإدخال", "يرجى إدخال نص النشاط.", "warning");
    return;
  }

  const newActivity = {
    id: Date.now(),
    text: text,
    source: "user",
    selected: true,
  };

  curriculumData.step2.allActivities.push(newActivity);
  curriculumData.step2.customActivities.push(newActivity); // Keep track of custom activities
  input.value = "";
  displayActivitiesList();
  updateSelectedActivities();
  saveProgress(); // Save progress on adding custom activity
}

/**
 * Updates the list of currently selected activities.
 */
function updateSelectedActivities() {
  curriculumData.step2.selectedActivities =
    curriculumData.step2.allActivities.filter((a) => a.selected);
}

/**
 * Handles the "Next" button click for Step 2.
 */
function handleStep2Next() {
  showStepWithValidation(3);
}

// ==================================================
// STEP 3: COMPETENCIES AND SKILLS FUNCTIONS
// ==================================================

/**
 * Updates the display for Step 3, including buttons for generating competencies and skills.
 */
function updateStep3Display() {
  const selectedCount = curriculumData.step2.selectedActivities.length;

  let html = `
    <div class="alert alert-info">
      <h5><i class="bi bi-info-circle" aria-hidden="true"></i> معلومات الخطوة الثالثة</h5>
      <p>لديك <strong>${selectedCount}</strong> نشاط محدد. سيتم توليد الجدارات والمهارات لكل نشاط.</p>
    </div>

    <div class="mb-3">
      <button type="button" class="btn btn-primary" id="generateAllCompetenciesBtn" aria-label="توليد جميع الجدارات باستخدام GEMINI">
        <i class="bi bi-robot" aria-hidden="true"></i> توليد جميع الجدارات باستخدام GEMINI
        <span class="loader" style="display: none" aria-hidden="true"></span>
      </button>
      <button type="button" class="btn btn-success ms-2" id="generateSkillsAndKnowledgeBtn" aria-label="توليد المهارات والمعارف">
        <i class="bi bi-gear" aria-hidden="true"></i> توليد المهارات والمعارف
        <span class="loader" style="display: none" aria-hidden="true"></span>
      </button>
    </div>

    <div id="competenciesContainer" aria-live="polite" aria-atomic="true" role="region">
      <p class="text-muted">سيتم عرض الجدارات هنا بعد التوليد.</p>
    </div>

    <div class="d-flex justify-content-between mt-4">
      <button type="button" class="btn btn-secondary" onclick="showStepWithValidation(2)" aria-label="السابق إلى الخطوة 2">
        <i class="bi bi-arrow-right-circle-fill" aria-hidden="true"></i> السابق إلى الخطوة 2
      </button>
      <button type="button" class="btn btn-warning" onclick="handleStep3Next()" aria-label="التالي إلى الخطوة 4">
        التالي إلى الخطوة 4 <i class="bi bi-arrow-left-circle-fill" aria-hidden="true"></i>
      </button>
    </div>
  `;

  document.getElementById("step3").querySelector(".card-body").innerHTML = html;

  // Re-attach event listeners for newly created buttons
  document
    .getElementById("generateAllCompetenciesBtn")
    .addEventListener("click", generateAllCompetencies);
  document
    .getElementById("generateSkillsAndKnowledgeBtn")
    .addEventListener("click", generateSkillsAndKnowledge);

  // Display existing competencies if any (e.g., after loading from localStorage)
  displayCompetencies();
}

/**
 * Generates all competencies for selected activities using the GEMINI API.
 */
async function generateAllCompetencies() {
  if (curriculumData.step2.selectedActivities.length === 0) {
    showCustomAlert(
      "خطأ",
      "يرجى اختيار الأنشطة في الخطوة السابقة أولاً.",
      "warning"
    );
    return;
  }

  showLoader("generateAllCompetenciesBtn");
  const retryBtn = document.getElementById("retryCompetenciesBtn");
  if (retryBtn) retryBtn.style.display = "none";

  try {
    const activities = curriculumData.step2.selectedActivities
      .map((a) => a.text)
      .join("\n- ");

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
    curriculumData.step3.lastCompetenciesPrompt = prompt;

    const response = await callActualGeminiAPI(prompt, "competencies");
    // Clear existing generated competencies to avoid duplication on re-generation
    curriculumData.step3.competencies = [];
    parseAndStoreCompetencies(response);
    displayCompetencies();

    hideLoader("generateAllCompetenciesBtn");
    showCustomAlert("نجاح", "تم توليد الجدارات بنجاح!", "success");
  } catch (error) {
    console.error("خطأ في توليد الجدارات:", error);
    if (error && error.error === "NO_API_KEY") {
      showCustomAlert("خطأ في مفتاح API", error.message, "error");
    } else {
      showCustomAlert(
        "خطأ",
        "حدث خطأ أثناء توليد الجدارات. يرجى المحاولة مرة أخرى.",
        "error"
      );
      showRetryButton("competencies");
    }
    hideLoader("generateAllCompetenciesBtn");
  }
}

/**
 * Parses the AI response for competencies and stores them in curriculumData.
 * @param {string} response - The raw response string from the AI.
 */
function parseAndStoreCompetencies(response) {
  const lines = response.split("\n");
  let currentActivity = null;
  let competenciesForActivity = []; // Renamed to avoid confusion with global competencies array

  lines.forEach((line) => {
    line = line.trim();
    if (line.startsWith("النشاط:") || line.startsWith("Activity:")) {
      if (currentActivity && competenciesForActivity.length > 0) {
        curriculumData.step3.competencies.push({
          activity: currentActivity,
          competencies: [...competenciesForActivity],
        });
      }
      currentActivity = line.replace(/^(النشاط:|Activity:)\s*/, "").trim();
      competenciesForActivity = [];
    } else if (line.startsWith("-") || line.startsWith("•")) {
      const competency = line.replace(/^[-•]\s*/, "").trim();
      if (competency) {
        competenciesForActivity.push({
          id: Date.now() + Math.random(), // Unique ID for each competency
          text: competency,
          skills: [],
          knowledge: [],
        });
      }
    }
  });

  // Add the last activity's competencies
  if (currentActivity && competenciesForActivity.length > 0) {
    curriculumData.step3.competencies.push({
      activity: currentActivity,
      competencies: [...competenciesForActivity],
    });
  }
  saveProgress(); // Save progress after storing competencies
}

/**
 * Displays the generated competencies in Step 3.
 */
function displayCompetencies() {
  const container = document.getElementById("competenciesContainer");
  container.innerHTML =
    '<div class="content-loader"><div class="spinner"></div><p class="ms-2">جاري تحميل الجدارات...</p></div>';

  setTimeout(() => {
    if (curriculumData.step3.competencies.length === 0) {
      container.innerHTML =
        '<p class="text-muted">سيتم عرض الجدارات هنا بعد التوليد.</p>';
      return;
    }

    let html = '<div class="competencies-display">';

    curriculumData.step3.competencies.forEach((activityComp, actIndex) => {
      html += `
        <div class="activity-competencies mb-4 p-3 border rounded">
          <h5 class="text-primary"><i class="bi bi-target" aria-hidden="true"></i> ${activityComp.activity}</h5>
          <div class="competencies-list">
      `;

      activityComp.competencies.forEach((comp, compIndex) => {
        // Generate unique IDs for skills and knowledge sections
        const skillsKnowledgeId = `skillsKnowledge_${actIndex}_${compIndex}`;
        html += `
          <div class="competency-item mb-3 p-2 bg-light rounded">
            <div class="d-flex justify-content-between align-items-start">
              <textarea class="form-control border-0 bg-transparent competency-text"
                        onchange="updateCompetencyText(${actIndex}, ${compIndex}, this.value)"
                        rows="2" aria-label="نص الجدارة">${comp.text}</textarea>
              <button class="btn btn-sm btn-outline-danger ms-2"
                      onclick="removeCompetency(${actIndex}, ${compIndex})" aria-label="حذف الجدارة">
                <i class="bi bi-trash" aria-hidden="true"></i>
              </button>
            </div>

            <div class="skills-knowledge mt-2" id="${skillsKnowledgeId}" aria-live="polite" aria-atomic="true">
              ${
                comp.skills.length > 0 || comp.knowledge.length > 0
                  ? `
                ${
                  comp.skills.length > 0
                    ? `
                  <div class="skills-list mt-1">
                    <small class="text-success"><strong>المهارات العملية:</strong></small>
                    <ul class="small">
                      ${comp.skills
                        .map(
                          (skill) =>
                            `<li><textarea class="form-control border-0 p-0" rows="1" onchange="updateSkillText(${actIndex}, ${compIndex}, ${skill.id}, this.value)" aria-label="نص المهارة">${skill.text}</textarea></li>`
                        )
                        .join("")}
                    </ul>
                  </div>
                `
                    : ""
                }

                ${
                  comp.knowledge.length > 0
                    ? `
                  <div class="knowledge-list mt-1">
                    <small class="text-info"><strong>المعارف النظرية:</strong></small>
                    <ul class="small">
                      ${comp.knowledge
                        .map(
                          (know) =>
                            `<li><textarea class="form-control border-0 p-0" rows="1" onchange="updateKnowledgeText(${actIndex}, ${compIndex}, ${know.id}, this.value)" aria-label="نص المعرفة">${know.text}</textarea></li>`
                        )
                        .join("")}
                    </ul>
                  </div>
                `
                    : ""
                }
                `
                  : '<p class="text-muted small">المهارات والمعارف غير متوفرة بعد.</p>'
              }
            </div>
          </div>
        `;
      });

      html += `
          </div>
          <button class="btn btn-sm btn-outline-primary"
                  onclick="addCustomCompetency(${actIndex})" aria-label="إضافة جدارة مخصصة">
            <i class="bi bi-plus" aria-hidden="true"></i> إضافة جدارة مخصصة
          </button>
        </div>
      `;
    });

    html += "</div>";
    container.innerHTML = html;
  }, 50); // 50ms delay
}

/**
 * Generates skills and knowledge for all competencies using the GEMINI API.
 */
async function generateSkillsAndKnowledge() {
  if (curriculumData.step3.competencies.length === 0) {
    showCustomAlert(
      "خطأ",
      "يجب توليد الجدارات أولاً قبل توليد المهارات والمعارف.",
      "warning"
    );
    return;
  }

  showLoader("generateSkillsAndKnowledgeBtn");
  curriculumData.step3.lastSkillsKnowledgeAttempted = true; // Mark that an attempt was made
  const retryBtn = document.getElementById("retrySkillsKnowledgeBtn");
  if (retryBtn) retryBtn.style.display = "none";

  try {
    for (const activityComp of curriculumData.step3.competencies) {
      for (const competency of activityComp.competencies) {
        // Clear previous skills/knowledge if any, to avoid duplication on retry
        competency.skills = [];
        competency.knowledge = [];

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

        const response = await callActualGeminiAPI(prompt, "skills-knowledge");
        parseSkillsAndKnowledge(response, competency);
      }
    }

    displayCompetencies(); // Refresh display with skills and knowledge
    curriculumData.step3.lastSkillsKnowledgeAttempted = false; // Clear flag on full success
    hideLoader("generateSkillsAndKnowledgeBtn");
    showCustomAlert(
      "نجاح",
      "تم توليد المهارات والمعارف لجميع الجدارات بنجاح!",
      "success"
    );
    saveProgress(); // Save progress after generating skills/knowledge
  } catch (error) {
    console.error("خطأ في توليد المهارات والمعارف:", error);
    if (error && error.error === "NO_API_KEY") {
      showCustomAlert("خطأ في مفتاح API", error.message, "error");
    } else {
      showCustomAlert(
        "خطأ",
        "حدث خطأ أثناء توليد المهارات والمعارف. يرجى المحاولة مرة أخرى.",
        "error"
      );
      showRetryButton("skillsKnowledge");
    }
    hideLoader("generateSkillsAndKnowledgeBtn");
  }
}

/**
 * Parses the AI response for skills and knowledge and stores them in the given competency.
 * @param {string} response - The raw response string from the AI.
 * @param {Object} competency - The competency object to update.
 */
function parseSkillsAndKnowledge(response, competency) {
  const lines = response.split("\n");
  let currentSection = null;

  lines.forEach((line) => {
    line = line.trim();
    if (line.includes("المهارات العملية") || line.includes("Skills")) {
      currentSection = "skills";
    } else if (line.includes("المعارف النظرية") || line.includes("Knowledge")) {
      currentSection = "knowledge";
    } else if (line.startsWith("-") || line.startsWith("•")) {
      const item = line.replace(/^[-•]\s*/, "").trim();
      if (item) {
        if (currentSection === "skills") {
          competency.skills.push({
            id: Date.now() + Math.random(),
            text: item,
          });
        } else if (currentSection === "knowledge") {
          competency.knowledge.push({
            id: Date.now() + Math.random(),
            text: item,
          });
        }
      }
    }
  });
}

/**
 * Updates the text of a specific competency.
 * @param {number} actIndex - Index of the activity.
 * @param {number} compIndex - Index of the competency within the activity.
 * @param {string} newText - The new text for the competency.
 */
function updateCompetencyText(actIndex, compIndex, newText) {
  if (
    curriculumData.step3.competencies[actIndex] &&
    curriculumData.step3.competencies[actIndex].competencies[compIndex]
  ) {
    curriculumData.step3.competencies[actIndex].competencies[compIndex].text =
      newText.trim();
    saveProgress();
  }
}

/**
 * Updates the text of a specific skill.
 * @param {number} actIndex - Index of the activity.
 * @param {number} compIndex - Index of the competency within the activity.
 * @param {number} skillId - ID of the skill to update.
 * @param {string} newText - The new text for the skill.
 */
function updateSkillText(actIndex, compIndex, skillId, newText) {
  const competency =
    curriculumData.step3.competencies[actIndex]?.competencies[compIndex];
  if (competency) {
    const skill = competency.skills.find((s) => s.id === skillId);
    if (skill) {
      skill.text = newText.trim();
      saveProgress();
    }
  }
}

/**
 * Updates the text of a specific knowledge item.
 * @param {number} actIndex - Index of the activity.
 *
 * @param {number} compIndex - Index of the competency within the activity.
 * @param {number} knowledgeId - ID of the knowledge item to update.
 * @param {string} newText - The new text for the knowledge item.
 */
function updateKnowledgeText(actIndex, compIndex, knowledgeId, newText) {
  const competency =
    curriculumData.step3.competencies[actIndex]?.competencies[compIndex];
  if (competency) {
    const knowledge = competency.knowledge.find((k) => k.id === knowledgeId);
    if (knowledge) {
      knowledge.text = newText.trim();
      saveProgress();
    }
  }
}

/**
 * Removes a competency from the list.
 * @param {number} actIndex - Index of the activity containing the competency.
 * @param {number} compIndex - Index of the competency to remove.
 */
function removeCompetency(actIndex, compIndex) {
  showCustomAlert(
    "تأكيد الحذف",
    "هل أنت متأكد من حذف هذه الجدارة؟",
    "warning",
    () => {
      if (curriculumData.step3.competencies[actIndex]) {
        curriculumData.step3.competencies[actIndex].competencies.splice(
          compIndex,
          1
        );
        // If an activity has no more competencies, consider removing it or handling it.
        if (
          curriculumData.step3.competencies[actIndex].competencies.length === 0
        ) {
          curriculumData.step3.competencies.splice(actIndex, 1);
        }
        displayCompetencies();
        saveProgress();
      }
    },
    true
  ); // Show cancel button
}

/**
 * Adds a custom competency to a specific activity.
 * @param {number} actIndex - Index of the activity to add the competency to.
 */
function addCustomCompetency(actIndex) {
  showCustomAlert(
    "إضافة جدارة",
    "أدخل نص الجدارة الجديدة:",
    "info",
    (text) => {
      if (text && text.trim()) {
        const newCompetency = {
          id: Date.now(),
          text: text.trim(),
          skills: [],
          knowledge: [],
        };
        if (curriculumData.step3.competencies[actIndex]) {
          curriculumData.step3.competencies[actIndex].competencies.push(
            newCompetency
          );
          displayCompetencies();
          saveProgress();
        }
      }
    },
    true,
    true
  ); // Title, Message, Type, onConfirm, showCancel, isPrompt
}

/**
 * Handles the "Next" button click for Step 3.
 */
function handleStep3Next() {
  showStepWithValidation(4);
}

// ==================================================
// STEP 4: FINAL FRAMEWORK COMPILATION
// ==================================================

/**
 * Updates the display for Step 4.
 */
function updateStep4Display() {
  generateFinalFramework();
  displayFinalFramework();
}

/**
 * Generates the final curriculum framework object.
 */
function generateFinalFramework() {
  curriculumData.step4.finalFramework = {
    jobDescription: curriculumData.step1.finalJobDescription,
    totalActivities: curriculumData.step2.selectedActivities.length,
    activities: curriculumData.step2.selectedActivities,
    competenciesData: curriculumData.step3.competencies,
    totalCompetencies: curriculumData.step3.competencies.reduce(
      (total, ac) => total + ac.competencies.length,
      0
    ),
    totalSkills: curriculumData.step3.competencies.reduce(
      (total, ac) =>
        total +
        ac.competencies.reduce(
          (subTotal, comp) => subTotal + comp.skills.length,
          0
        ),
      0
    ),
    totalKnowledge: curriculumData.step3.competencies.reduce(
      (total, ac) =>
        total +
        ac.competencies.reduce(
          (subTotal, comp) => subTotal + comp.knowledge.length,
          0
        ),
      0
    ),
    generatedDate: new Date().toLocaleDateString("ar-SA"),
  };
  saveProgress(); // Save progress after generating final framework
}

/**
 * Displays the final curriculum framework in Step 4.
 */
function displayFinalFramework() {
  const framework = curriculumData.step4.finalFramework;
  const container = document
    .getElementById("step4")
    .querySelector(".card-body");

  if (Object.keys(framework).length === 0) {
    container.innerHTML = `
      <p class="text-muted">محتوى الخطوة الرابعة الخاص بتجميع إطار المنهج النهائي سيظهر هنا.</p>
      <button class="btn btn-secondary" onclick="showStepWithValidation(3)" aria-label="السابق إلى الخطوة 3">
        <i class="bi bi-arrow-right-circle" aria-hidden="true"></i> السابق
      </button>
      <button
        class="btn btn-info float-end"
        onclick="compileFramework()"
        aria-label="تجميع الإطار النهائي"
      >
        تجميع <i class="bi bi-check-circle" aria-hidden="true"></i>
      </button>
    `;
    return;
  }

  let html = `
    <div class="final-framework">
      <div class="alert alert-success">
        <h4><i class="bi bi-check-circle" aria-hidden="true"></i> تم إنشاء إطار المنهج بنجاح!</h4>
        <p class="mb-0">تم تجميع جميع المكونات في إطار عمل شامل للمنهج الدراسي.</p>
      </div>

      <div class="framework-summary mb-4">
        <h5><i class="bi bi-bar-chart" aria-hidden="true"></i> ملخص الإطار</h5>
        <div class="row">
          <div class="col-md-3 col-6 mb-2">
            <div class="stat-card text-center p-3 bg-primary text-white rounded">
              <h3>${framework.totalActivities}</h3>
              <p>الأنشطة</p>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-2">
            <div class="stat-card text-center p-3 bg-success text-white rounded">
              <h3>${framework.totalCompetencies}</h3>
              <p>الجدارات</p>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-2">
            <div class="stat-card text-center p-3 bg-warning text-white rounded">
              <h3>${framework.totalSkills}</h3>
              <p>المهارات</p>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-2">
            <div class="stat-card text-center p-3 bg-info text-white rounded">
              <h3>${framework.totalKnowledge}</h3>
              <p>المعارف</p>
            </div>
          </div>
        </div>
      </div>

      <div class="framework-details">
        <h5><i class="bi bi-file-text" aria-hidden="true"></i> تفاصيل الإطار</h5>

        <div class="section mb-4">
          <h6 class="text-primary">1. وصف المهنة</h6>
          <div class="p-3 bg-light rounded">
            ${framework.jobDescription.replace(/\n/g, "<br>")}
          </div>
        </div>

        <div class="section mb-4">
          <h6 class="text-success">2. الأنشطة الرئيسية (${
            framework.totalActivities
          })</h6>
          <div class="activities-summary">
  `;

  framework.activities.forEach((activity, index) => {
    html += `
      <div class="activity-summary-item mb-2 p-2 border rounded">
        <strong>${index + 1}.</strong> ${activity.text}
        <small class="text-muted">(${
          activity.source === "gemini" ? "GEMINI" : "مخصص"
        })</small>
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
        <h6 class="text-dark"><i class="bi bi-target" aria-hidden="true"></i> ${activityComp.activity}</h6>
    `;

    activityComp.competencies.forEach((comp, compIndex) => {
      html += `
        <div class="competency-detail mb-2 ms-3">
          <strong>الجدارة ${compIndex + 1}:</strong> ${comp.text}

          ${
            comp.skills.length > 0
              ? `
            <div class="skills-list ms-3 mt-1">
              <small class="text-success"><strong>المهارات العملية:</strong></small>
              <ul class="small">
                ${comp.skills.map((skill) => `<li>${skill.text}</li>`).join("")}
              </ul>
            </div>
          `
              : ""
          }

          ${
            comp.knowledge.length > 0
              ? `
            <div class="knowledge-list ms-3 mt-1">
              <small class="text-info"><strong>المعارف النظرية:</strong></small>
              <ul class="small">
                ${comp.knowledge
                  .map((know) => `<li>${know.text}</li>`)
                  .join("")}
              </ul>
            </div>
          `
              : ""
          }
        </div>
      `;
    });

    html += `</div>`;
  });

  html += `
        </div>
      </div>

      <div class="export-section mt-4 text-center">
        <button class="btn btn-primary me-2" onclick="exportFramework('json')" aria-label="تصدير الإطار كملف JSON">
          <i class="bi bi-download" aria-hidden="true"></i> تصدير JSON
        </button>
        <button class="btn btn-secondary me-2" onclick="exportFramework('pdf')" aria-label="تصدير الإطار كملف PDF">
          <i class="bi bi-file-pdf" aria-hidden="true"></i> تصدير PDF
        </button>
        <button class="btn btn-success" onclick="printFramework()" aria-label="طباعة الإطار">
          <i class="bi bi-printer" aria-hidden="true"></i> طباعة
        </button>
      </div>

      <div class="d-flex justify-content-between mt-4">
        <button type="button" class="btn btn-secondary" onclick="showStepWithValidation(3)" aria-label="السابق إلى الخطوة 3">
          <i class="bi bi-arrow-right-circle-fill" aria-hidden="true"></i> السابق إلى الخطوة 3
        </button>
        <button type="button" class="btn btn-success" onclick="resetFramework()" title="إعادة تشغيل التطبيق بالكامل وفقدان جميع البيانات الحالية" aria-label="إعادة تشغيل التطبيق">
          <i class="bi bi-arrow-clockwise" aria-hidden="true"></i> إعادة تشغيل
        </button>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Function to be called when the "تجميع" button in Step 4 is clicked.
 */
function compileFramework() {
  generateFinalFramework(); // Ensure framework is generated
  displayFinalFramework(); // Display it
  showCustomAlert(
    "اكتمل التجميع!",
    "تم تجميع إطار المنهج الدراسي بنجاح.",
    "success"
  );
}

// ==================================================
// EXPORT AND UTILITY FUNCTIONS
// ==================================================

/**
 * Exports the final framework in a specified format.
 * @param {string} format - The desired export format ('json', 'pdf').
 */
function exportFramework(format) {
  const framework = curriculumData.step4.finalFramework;

  if (format === "json") {
    const dataStr = JSON.stringify(curriculumData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `framework-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
    showCustomAlert("نجاح", "تم تصدير الإطار كملف JSON بنجاح!", "success");
  } else if (format === "pdf") {
    // Generate content for PDF
    const printWindow = window.open("", "_blank");
    const today = new Date().toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Collect all unique skills and knowledge for the "Basic Framework"
    let allSkills = new Set();
    let allKnowledge = new Set();
    curriculumData.step3.competencies.forEach((activityComp) => {
      activityComp.competencies.forEach((comp) => {
        comp.skills.forEach((skill) => allSkills.add(skill.text));
        comp.knowledge.forEach((know) => allKnowledge.add(know.text));
      });
    });

    let basicProgramsHtml = "";
    if (allSkills.size > 0 || allKnowledge.size > 0) {
      basicProgramsHtml += "<ul>";
      Array.from(allSkills).forEach((skill) => {
        basicProgramsHtml += `<li>• ${skill}</li>`;
      });
      Array.from(allKnowledge).forEach((know) => {
        basicProgramsHtml += `<li>• ${know}</li>`;
      });
      basicProgramsHtml += "</ul>";
    } else {
      basicProgramsHtml += "<p>لا توجد برامج أساسية محددة.</p>";
    }

    let vocationalProgramsHtml = "";
    if (framework.activities.length > 0) {
      framework.activities.forEach((activity, activityIndex) => {
        const relatedCompetencies = curriculumData.step3.competencies.find(
          (ac) => ac.activity === activity.text
        );
        vocationalProgramsHtml += `<p><strong>النشاط ${
          activityIndex + 1
        }:</strong> ${activity.text}</p>`;
        if (
          relatedCompetencies &&
          relatedCompetencies.competencies.length > 0
        ) {
          vocationalProgramsHtml += "<ul>";
          relatedCompetencies.competencies.forEach((comp) => {
            vocationalProgramsHtml += `<li>• ${comp.text}</li>`;
          });
          vocationalProgramsHtml += "</ul>";
        }
      });
    } else {
      vocationalProgramsHtml += "<p>لا توجد برامج مهنية محددة.</p>";
    }

    const pdfContentHtml = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>إطار المنهج الدراسي</title>
        <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"/>
        <style>
          body {
            font-family: 'Traditional Arabic', 'Arial', sans-serif;
            direction: rtl;
            margin: 40px;
            font-size: 11pt;
            color: #333;
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Traditional Arabic', 'Arial', sans-serif;
            font-weight: bold;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
            text-align: right;
          }
          th, td {
            padding: 8px;
            border: 1px solid #ddd;
            vertical-align: top;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          ul {
            list-style: none; /* Remove default bullet */
            padding-right: 20px; /* Indent for custom bullet */
            margin: 0;
          }
          ul li:before {
            content: '• '; /* Custom Arabic bullet point */
            color: #000;
            font-weight: bold;
            display: inline-block;
            width: 1em;
            margin-right: -1em;
          }
          .header-section {
            text-align: center;
            margin-bottom: 30px;
          }
          .header-section h4 {
            font-size: 14pt;
            margin-bottom: 5px;
          }
          .header-section p {
            font-size: 11pt;
            margin-bottom: 5px;
          }
          .header-section h3 {
            font-size: 16pt;
            margin-top: 20px;
          }
          .footer-section {
            margin-top: 50px;
            text-align: left;
            font-size: 11pt;
          }
          /* Hide buttons and unnecessary elements for print */
          .btn, .alert, .export-section, .d-flex.justify-content-between {
            display: none !important;
          }
        </style>
      </head>
      <body>
        <div class="header-section">
          <h4>وزارة التربية والتعليم والتعليم الفني</h4>
          <p>قطاع الكفاية الإنتاجية - إدارة التعليم المزدوج</p>
          <h3>تقرير عن: (ب) تابع الوحدات الأساسية والمهنية</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>الإطار</th>
              <th>البرامج</th>
              <th>المدة</th>
              <th>المستوى (١)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="1" style="vertical-align: top;">الأساسي</td>
              <td>${basicProgramsHtml}</td>
              <td>٤ أسابيع (١٨٠ ساعة)</td>
              <td>الصف الأول، الثاني، الثالث</td>
            </tr>
            <tr>
              <td rowspan="1" style="vertical-align: top;">المهني</td>
              <td>${vocationalProgramsHtml}</td>
              <td>٤ أسابيع (١٨٠ ساعة)</td>
              <td>الصف الأول</td>
            </tr>
            <tr>
              <td rowspan="1" style="vertical-align: top;">المستوى الثالث</td>
              <td>
                <ul>
                  <li>• التأهيل المتقدم لسوق العمل</li>
                </ul>
              </td>
              <td>١-٧ أسابيع</td>
              <td>حسب التطبيق</td>
            </tr>
          </tbody>
        </table>

        <div class="footer-section">
          <p>التوقيع: ............................................</p>
          <p>التاريخ: ${today}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(pdfContentHtml);
    printWindow.document.close();
    printWindow.print();
    showCustomAlert(
      "طباعة PDF",
      'الرجاء اختيار "حفظ بتنسيق PDF" في نافذة الطباعة لحفظ الملف.',
      "info"
    );
  }
}

/**
 * Prints the final framework content.
 */
function printFramework() {
  const printContent = document.getElementById("step4").innerHTML;
  const printWindow = window.open("", "_blank");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>إطار المنهج الدراسي</title>
      <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"/>
      <link href="assets/css/style.css" rel="stylesheet"/>
      <style>
        body { font-family: Arial, sans-serif; direction: rtl; margin: 20px; }
        .btn, .alert, .export-section, .d-flex.justify-content-between { display: none !important; }
        .framework-summary .row { display: flex; gap: 10px; }
        .stat-card { flex: 1; }
        /* Ensure responsive columns work in print */
        .col-md-3 { flex: 0 0 25%; max-width: 25%; }
        .col-6 { flex: 0 0 50%; max-width: 50%; }
        /* Ensure textareas are visible and not just their content */
        textarea {
          overflow: visible !important;
          height: auto !important;
          min-height: unset !important;
          border: none !important;
          background-color: transparent !important;
          padding: 0 !important;
          resize: none !important;
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
  showCustomAlert("طباعة", "تم إرسال إطار المنهج للطابعة.", "info");
}

/**
 * Resets the entire application framework, clearing all data.
 */
function resetFramework() {
  showCustomAlert(
    "إعادة تشغيل التطبيق",
    "هل أنت متأكد من إعادة تشغيل التطبيق؟ ستفقد جميع البيانات المدخلة.",
    "warning",
    () => {
      // Reset all data
      curriculumData = {
        step1: {
          specializationInfo: "",
          generatedJobDescription: "",
          userJobDescription: "",
          selectedChoice: "gemini",
          finalJobDescription: "",
          lastJobDescriptionPrompt: null,
        },
        step2: {
          generatedActivities: [],
          customActivities: [],
          selectedActivities: [],
          allActivities: [],
          lastActivitiesPrompt: null,
        },
        step3: {
          competencies: [],
          skills: [],
          knowledge: [],
          lastCompetenciesPrompt: null,
          lastSkillsKnowledgeAttempted: false,
        },
        step4: {
          finalFramework: {},
        },
      };

      // Clear all form inputs
      document.getElementById("specializationInfo").value = "";
      document.getElementById("jobDescriptionOutput").innerHTML = "";
      document.getElementById("customActivityInput").value = "";
      document.getElementById("jobDescriptionDisplayStep2").value = ""; // Clear step 2 display

      // Reset radio buttons
      document.getElementById("choiceGemini").checked = true;

      // Clear dynamic content containers
      document.getElementById("activitiesListContainer").innerHTML =
        '<p class="text-muted">سيتم عرض الأنشطة المقترحة هنا كقائمة اختيار.</p>';
      if (document.getElementById("competenciesContainer")) {
        // Check if element exists before clearing
        document.getElementById("competenciesContainer").innerHTML =
          '<p class="text-muted">سيتم عرض الجدارات هنا بعد التوليد.</p>';
      }

      // Go back to step 1
      showStep(1);
      saveProgress(); // Save the reset state
      showCustomAlert(
        "تمت إعادة التشغيل",
        "تمت إعادة تشغيل التطبيق بنجاح. تم مسح جميع البيانات.",
        "success"
      );
    },
    true
  ); // Show cancel button
}

/**
 * Saves the current application progress to localStorage.
 */
function saveProgress() {
  try {
    localStorage.setItem(
      "curriculumFrameworkData",
      JSON.stringify(curriculumData)
    );
    console.log("تم حفظ التقدم بنجاح");
  } catch (error) {
    console.warn("لم يتم حفظ التقدم في التخزين المحلي:", error);
  }
}

/**
 * Loads application progress from localStorage.
 * @returns {boolean} True if data was loaded, false otherwise.
 */
function loadProgress() {
  try {
    const saved = localStorage.getItem("curriculumFrameworkData");
    if (saved) {
      curriculumData = JSON.parse(saved);
      console.log("تم تحميل التقدم بنجاح");
      return true;
    }
  } catch (error) {
    console.warn("لم يتم تحميل التقدم من التخزين المحلي:", error);
  }
  return false;
}

// Auto-save functionality
setInterval(() => {
  // Only auto-save if there's some data entered in step 1
  if (
    curriculumData.step1.specializationInfo ||
    curriculumData.step1.generatedJobDescription
  ) {
    saveProgress();
  }
}, 30000); // Auto-save every 30 seconds

// ==================================================
// API KEY HANDLING
// ==================================================
/**
 * Saves the API key entered by the user to localStorage.
 */
function saveApiKey() {
  const apiKey = document.getElementById("apiKeyInput").value;
  const apiKeyStatus = document.getElementById("apiKeyStatus");
  if (apiKey.trim()) {
    localStorage.setItem("userApiKey", apiKey);
    apiKeyStatus.textContent = "تم حفظ مفتاح API بنجاح!";
    apiKeyStatus.className = "text-center small text-success";
    // Optionally, clear the input after saving for security
    // document.getElementById('apiKeyInput').value = '';
  } else {
    apiKeyStatus.textContent = "الرجاء إدخال مفتاح API صالح.";
    apiKeyStatus.className = "text-center small text-danger";
  }
  setTimeout(() => {
    apiKeyStatus.textContent = "";
  }, 3000);
}

/**
 * Loads the saved API key from localStorage and displays its status.
 */
function loadApiKey() {
  const apiKey = localStorage.getItem("userApiKey");
  const apiKeyInput = document.getElementById("apiKeyInput");
  const apiKeyStatus = document.getElementById("apiKeyStatus");
  if (apiKey) {
    apiKeyInput.value = apiKey;
    apiKeyStatus.textContent = "تم تحميل مفتاح API المحفوظ.";
    apiKeyStatus.className = "text-center small text-info";
  } else {
    apiKeyStatus.textContent = "لم يتم العثور على مفتاح API محفوظ.";
    apiKeyStatus.className = "text-center small text-muted";
  }
  setTimeout(() => {
    apiKeyStatus.textContent = "";
  }, 3000);
}

// ==================================================
// RETRY FUNCTIONALITY
// ==================================================
/**
 * Displays a retry button next to the main generation button when an error occurs.
 * @param {string} actionType - The type of action that failed (e.g., 'jobDescription', 'activities').
 */
function showRetryButton(actionType) {
  let mainButton, retryBtnId, retryBtnText, retryFn;

  switch (actionType) {
    case "jobDescription":
      mainButton = document.getElementById("generateJobDescriptionBtn");
      retryBtnId = "retryJobDescriptionBtn";
      retryBtnText = "إعادة محاولة توليد وصف الوظيفة";
      retryFn = retryJobDescription;
      break;
    case "activities":
      mainButton = document.getElementById("generateActivitiesBtn");
      retryBtnId = "retryActivitiesBtn";
      retryBtnText = "إعادة محاولة توليد الأنشطة";
      retryFn = retryActivities;
      break;
    case "competencies":
      mainButton = document.getElementById("generateAllCompetenciesBtn");
      retryBtnId = "retryCompetenciesBtn";
      retryBtnText = "إعادة محاولة توليد الجدارات";
      retryFn = retryCompetencies;
      break;
    case "skillsKnowledge":
      mainButton = document.getElementById("generateSkillsAndKnowledgeBtn");
      retryBtnId = "retrySkillsKnowledgeBtn";
      retryBtnText = "إعادة محاولة توليد المهارات والمعارف";
      retryFn = retrySkillsKnowledge;
      break;
    default:
      return; // Unknown action type
  }

  if (!mainButton) return;

  let retryBtn = document.getElementById(retryBtnId);

  if (!retryBtn) {
    retryBtn = document.createElement("button");
    retryBtn.type = "button";
    retryBtn.className = "btn btn-warning mt-2 mb-3 ms-2"; // Common classes
    retryBtn.id = retryBtnId;
    retryBtn.innerHTML = `
      <i class="bi bi-arrow-clockwise" aria-hidden="true"></i> ${retryBtnText}
      <span class="loader" style="display: none;" aria-hidden="true"></span>
    `;
    // Insert retry button right after the main button
    mainButton.parentNode.insertBefore(retryBtn, mainButton.nextSibling);
    retryBtn.addEventListener("click", retryFn);
  }
  retryBtn.style.display = "inline-block";
  mainButton.style.display = "none"; // Hide the main button
}

/**
 * Retries the job description generation.
 */
async function retryJobDescription() {
  const mainButton = document.getElementById("generateJobDescriptionBtn");
  const retryBtn = document.getElementById("retryJobDescriptionBtn");
  const loader = retryBtn ? retryBtn.querySelector(".loader") : null;
  const storedPrompt = curriculumData.step1.lastJobDescriptionPrompt;

  if (!storedPrompt) {
    showCustomAlert(
      "لا توجد محاولة سابقة",
      "لا يوجد محاولة سابقة لإعادة المحاولة. يرجى البدء من جديد.",
      "info"
    );
    if (mainButton) mainButton.style.display = "inline-block";
    if (retryBtn) retryBtn.style.display = "none";
    return;
  }

  if (loader) loader.style.display = "inline-block";
  if (retryBtn) retryBtn.disabled = true;

  try {
    const response = await callActualGeminiAPI(storedPrompt, "job-description");
    curriculumData.step1.generatedJobDescription = response;
    const formattedResponse = formatAIResponse(response, "job-description");
    document.getElementById("jobDescriptionOutput").innerHTML =
      formattedResponse;

    if (retryBtn) retryBtn.style.display = "none";
    if (mainButton) mainButton.style.display = "inline-block";
    curriculumData.step1.lastJobDescriptionPrompt = null; // Clear prompt on success
    showCustomAlert(
      "نجاح",
      "تمت إعادة محاولة توليد وصف الوظيفة بنجاح!",
      "success"
    );
    saveProgress();
  } catch (error) {
    console.error("خطأ في إعادة محاولة توليد وصف الوظيفة:", error);
    if (error && error.error === "NO_API_KEY") {
      showCustomAlert("خطأ في مفتاح API", error.message, "error");
      if (mainButton) mainButton.style.display = "inline-block";
      if (retryBtn) retryBtn.style.display = "none";
    } else {
      showCustomAlert(
        "فشل",
        "فشلت إعادة محاولة توليد وصف الوظيفة. يرجى المحاولة مرة أخرى.",
        "error"
      );
      // Keep retry button visible, main button hidden
    }
  } finally {
    if (loader) loader.style.display = "none";
    if (retryBtn) retryBtn.disabled = false;
  }
}

/**
 * Retries the activities generation.
 */
async function retryActivities() {
  const mainButton = document.getElementById("generateActivitiesBtn");
  const retryBtn = document.getElementById("retryActivitiesBtn");
  const loader = retryBtn ? retryBtn.querySelector(".loader") : null;
  const storedPrompt = curriculumData.step2.lastActivitiesPrompt;

  if (!storedPrompt) {
    showCustomAlert(
      "لا توجد محاولة سابقة",
      "لا يوجد محاولة سابقة لإعادة المحاولة.",
      "info"
    );
    if (mainButton) mainButton.style.display = "inline-block";
    if (retryBtn) retryBtn.style.display = "none";
    return;
  }

  if (loader) loader.style.display = "inline-block";
  if (retryBtn) retryBtn.disabled = true;

  try {
    const response = await callActualGeminiAPI(storedPrompt, "activities");
    const activities = formatAIResponse(response, "activities");
    curriculumData.step2.generatedActivities = activities;
    const existingCustomActivities = curriculumData.step2.allActivities.filter(
      (a) => a.source === "user"
    );
    curriculumData.step2.allActivities = [
      ...activities,
      ...existingCustomActivities,
    ];
    displayActivitiesList();

    if (retryBtn) retryBtn.style.display = "none";
    if (mainButton) mainButton.style.display = "inline-block";
    curriculumData.step2.lastActivitiesPrompt = null; // Clear prompt on success
    showCustomAlert("نجاح", "تمت إعادة محاولة توليد الأنشطة بنجاح!", "success");
    saveProgress();
  } catch (error) {
    console.error("خطأ في إعادة محاولة توليد الأنشطة:", error);
    if (error && error.error === "NO_API_KEY") {
      showCustomAlert("خطأ في مفتاح API", error.message, "error");
      if (mainButton) mainButton.style.display = "inline-block";
      if (retryBtn) retryBtn.style.display = "none";
    } else {
      showCustomAlert(
        "فشل",
        "فشلت إعادة محاولة توليد الأنشطة. يرجى المحاولة مرة أخرى.",
        "error"
      );
    }
  } finally {
    if (loader) loader.style.display = "none";
    if (retryBtn) retryBtn.disabled = false;
  }
}

/**
 * Retries the competencies generation.
 */
async function retryCompetencies() {
  const mainButton = document.getElementById("generateAllCompetenciesBtn");
  const retryBtn = document.getElementById("retryCompetenciesBtn");
  const loader = retryBtn ? retryBtn.querySelector(".loader") : null;
  const storedPrompt = curriculumData.step3.lastCompetenciesPrompt;

  if (!storedPrompt) {
    showCustomAlert(
      "لا توجد محاولة سابقة",
      "لا يوجد محاولة سابقة لإعادة المحاولة.",
      "info"
    );
    if (mainButton) mainButton.style.display = "inline-block";
    if (retryBtn) retryBtn.style.display = "none";
    return;
  }

  if (loader) loader.style.display = "inline-block";
  if (retryBtn) retryBtn.disabled = true;

  try {
    const response = await callActualGeminiAPI(storedPrompt, "competencies");
    // Clear previous competencies for this prompt to avoid duplication
    curriculumData.step3.competencies = []; // Clear all competencies and re-parse
    parseAndStoreCompetencies(response);
    displayCompetencies();

    if (retryBtn) retryBtn.style.display = "none";
    if (mainButton) mainButton.style.display = "inline-block";
    curriculumData.step3.lastCompetenciesPrompt = null; // Clear prompt on success
    showCustomAlert(
      "نجاح",
      "تمت إعادة محاولة توليد الجدارات بنجاح!",
      "success"
    );
    saveProgress();
  } catch (error) {
    console.error("خطأ في إعادة محاولة توليد الجدارات:", error);
    if (error && error.error === "NO_API_KEY") {
      showCustomAlert("خطأ في مفتاح API", error.message, "error");
      if (mainButton) mainButton.style.display = "inline-block";
      if (retryBtn) retryBtn.style.display = "none";
    } else {
      showCustomAlert(
        "فشل",
        "فشلت إعادة محاولة توليد الجدارات. يرجى المحاولة مرة أخرى.",
        "error"
      );
    }
  } finally {
    if (loader) loader.style.display = "none";
    if (retryBtn) retryBtn.disabled = false;
  }
}

/**
 * Retries the skills and knowledge generation for all competencies.
 */
async function retrySkillsKnowledge() {
  const mainButton = document.getElementById("generateSkillsAndKnowledgeBtn");
  const retryBtn = document.getElementById("retrySkillsKnowledgeBtn");
  const loader = retryBtn ? retryBtn.querySelector(".loader") : null;

  // Check if there are competencies to process
  if (curriculumData.step3.competencies.length === 0) {
    showCustomAlert(
      "لا توجد جدارات",
      "لا توجد جدارات لتوليد المهارات والمعارف لها. يرجى توليد الجدارات أولاً.",
      "info"
    );
    if (mainButton) mainButton.style.display = "inline-block";
    if (retryBtn) retryBtn.style.display = "none";
    return;
  }

  if (loader) loader.style.display = "inline-block";
  if (retryBtn) retryBtn.disabled = true;
  if (mainButton) mainButton.style.display = "none"; // Keep main button hidden during retry

  try {
    // The generateSkillsAndKnowledge function handles its own UI updates (displayCompetencies)
    // and internal showLoader/hideLoader for the main button.
    await generateSkillsAndKnowledge();

    // If generateSkillsAndKnowledge completes successfully, it means all sub-calls were successful.
    if (retryBtn) retryBtn.style.display = "none";
    if (mainButton) mainButton.style.display = "inline-block";
    curriculumData.step3.lastSkillsKnowledgeAttempted = false; // Clear flag
    showCustomAlert(
      "نجاح",
      "تمت إعادة محاولة توليد المهارات والمعارف بنجاح!",
      "success"
    );
    saveProgress();
  } catch (error) {
    console.error("خطأ في إعادة محاولة توليد المهارات والمعارف:", error);
    if (error && error.error === "NO_API_KEY") {
      showCustomAlert("خطأ في مفتاح API", error.message, "error");
      if (mainButton) mainButton.style.display = "inline-block";
      if (retryBtn) retryBtn.style.display = "none";
    } else {
      showCustomAlert(
        "فشل",
        "فشلت إعادة محاولة توليد المهارات والمعارف. يرجى التحقق من وحدة التحكم للمزيد من التفاصيل.",
        "error"
      );
      // Keep retry button visible, main button hidden.
    }
  } finally {
    if (loader) loader.style.display = "none";
    if (retryBtn) retryBtn.disabled = false;
    // Do not show mainButton here, only on full success of the retry.
  }
}

// ==================================================
// EVENT LISTENERS AND INITIALIZATION
// ==================================================

document.addEventListener("DOMContentLoaded", function () {
  // Load API key and progress on page load
  loadApiKey();
  const progressLoaded = loadProgress();

  // Initialize Step 1 event listeners
  const generateJobBtn = document.getElementById("generateJobDescriptionBtn");
  if (generateJobBtn) {
    generateJobBtn.addEventListener("click", generateJobDescription);
  }

  const step1NextBtn = document.getElementById("step1NextBtn");
  if (step1NextBtn) {
    step1NextBtn.addEventListener("click", handleStep1Next);
  }

  // Add Enter key listener for specializationInfo
  const specializationInfoInput = document.getElementById("specializationInfo");
  if (specializationInfoInput) {
    specializationInfoInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        // Allow Shift+Enter for new line
        e.preventDefault(); // Prevent default Enter behavior (e.g., form submission)
        generateJobDescription();
      }
    });
  }

  // Initialize Step 2 event listeners
  const generateActivitiesBtn = document.getElementById(
    "generateActivitiesBtn"
  );
  if (generateActivitiesBtn) {
    generateActivitiesBtn.addEventListener("click", generateMainActivities);
  }

  const addCustomActivityBtn = document.getElementById("addCustomActivityBtn");
  if (addCustomActivityBtn) {
    addCustomActivityBtn.addEventListener("click", addCustomActivity);
  }

  const step2NextBtn = document.getElementById("step2NextBtn");
  if (step2NextBtn) {
    step2NextBtn.addEventListener("click", handleStep2Next);
  }

  // Handle Enter key for custom activity input
  const customActivityInput = document.getElementById("customActivityInput");
  if (customActivityInput) {
    customActivityInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent default Enter behavior
        addCustomActivity();
      }
    });
  }

  // Initialize Step 3 event listeners are handled in updateStep3Display()
  // as the buttons are dynamically created.

  // Initialize API key save button
  const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");
  if (saveApiKeyBtn) {
    saveApiKeyBtn.addEventListener("click", saveApiKey);
  }

  // Initialize textarea auto-resize for all textareas
  document.querySelectorAll("textarea").forEach((textarea) => {
    textarea.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });
    // Adjust height on load for pre-filled textareas
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // Determine initial step to show
  if (progressLoaded) {
    // If progress loaded, find the last completed step or current step
    let lastActiveStep = 1;
    if (
      curriculumData.step4.finalFramework &&
      Object.keys(curriculumData.step4.finalFramework).length > 0
    ) {
      lastActiveStep = 4;
    } else if (curriculumData.step3.competencies.length > 0) {
      lastActiveStep = 3;
    } else if (curriculumData.step2.allActivities.length > 0) {
      lastActiveStep = 2;
    }
    showStep(lastActiveStep);
  } else {
    showStep(1); // Start at step 1 if no saved progress
  }

  console.log("تم تهيئة مصمم إطار المناهج بالذكاء الاصطناعي");
  console.log("الإصدار: 1.0.0");
  console.log("جاهز للاستخدام!");
});

// Ensure textareas auto-resize when content is dynamically loaded (e.g., from API or localStorage)
function autoResizeTextareas() {
  document.querySelectorAll("textarea").forEach((textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });
}

// Call autoResizeTextareas whenever content is updated dynamically
const originalDisplayActivitiesList = displayActivitiesList;
displayActivitiesList = function () {
  originalDisplayActivitiesList();
  setTimeout(autoResizeTextareas, 100);
};

const originalDisplayCompetencies = displayCompetencies;
displayCompetencies = function () {
  originalDisplayCompetencies();
  setTimeout(autoResizeTextareas, 100);
};

const originalDisplayFinalFramework = displayFinalFramework;
displayFinalFramework = function () {
  originalDisplayFinalFramework();
  setTimeout(autoResizeTextareas, 100);
};
