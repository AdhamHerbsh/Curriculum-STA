// ==================================================
// AI-Powered Curriculum Framework Designer - Rebuilt main.js
// ==================================================

// --- API Integration --}

/**
 * Calls the Gemini API with the given prompt.
 * @param {string} prompt The prompt to send to the API.
 * @returns {Promise<string>} The API response text.
 */
async function callGeminiAPI(prompt) {
  try {
    const apiKey = localStorage.getItem("geminiApiKey");
    if (!apiKey) {
      throw new Error("API key not found");
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "API request failed");
    }

    // Extract text from the new response format
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      throw new Error("No content generated");
    }

    return generatedText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

// Global state for curriculum data
const curriculumData = {
  step1: {
    specializationInfo: "",
    jobDescription: { source: "", text: "", jobRoles: [] },
  },
  step2: {
    // rawActivities: [], // Store raw generated activities if needed
    selectedActivities: [], // Activities chosen by the user
  },
  step3: {
    selectedCompetencies: [], // Competencies chosen/edited by the user
  },
  step4: {
    finalFramework: {}, // The final compiled framework
  },
};

// --- DOM Elements ---
const apiWarning = document.getElementById("apiWarning");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");
const toggleApiKeyVisibility = document.getElementById(
  "toggleApiKeyVisibility"
);
const apiKeyStatus = document.getElementById("apiKeyStatus");

const progressWrapper = document.getElementById("progressWrapper");
const progressBar = document.querySelector("#progressBar .progress-bar");
const currentStepName = document.getElementById("currentStepName");
const progressStepsLabels = document.querySelector(".progress-steps-labels");

const step1 = document.getElementById("step1");
const specializationInfoInput = document.getElementById("specializationInfo");
const generateJobDescriptionBtn = document.getElementById(
  "generateJobDescriptionBtn"
);
const jobDescriptionOutput = document.getElementById("jobDescriptionOutput");
const choiceGeminiRadio = document.getElementById("choiceGemini");
const choiceUserRadio = document.getElementById("choiceUser");
const step1NextBtn = document.getElementById("step1NextBtn");

const step2 = document.getElementById("step2");
const jobDescriptionDisplayStep2 = document.getElementById(
  "jobDescriptionDisplayStep2"
);
const generateActivitiesBtn = document.getElementById("generateActivitiesBtn");
const activitiesListContainer = document.getElementById(
  "activitiesListContainer"
);
const customActivityInput = document.getElementById("customActivityInput");
const addCustomActivityBtn = document.getElementById("addCustomActivityBtn");
const step2PrevBtn = document.getElementById("step2PrevBtn");
const step2NextBtn = document.getElementById("step2NextBtn");

const step3 = document.getElementById("step3");
const generateCompetenciesBtn = document.getElementById(
  "generateCompetenciesBtn"
);
const competenciesListContainer = document.getElementById(
  "competenciesListContainer"
);
const customCompetencyInput = document.getElementById("customCompetencyInput");
const addCustomCompetencyBtn = document.getElementById(
  "addCustomCompetencyBtn"
);
const step3PrevBtn = document.getElementById("step3PrevBtn");
const step3NextBtn = document.getElementById("step3NextBtn");

const step4 = document.getElementById("step4");
const compileFrameworkBtn = document.getElementById("compileFrameworkBtn");
const finalFrameworkOutput = document.getElementById("finalFrameworkOutput");
const downloadFrameworkBtn = document.getElementById("downloadFrameworkBtn");
const printFrameworkBtn = document.getElementById("printFrameworkBtn");
const startOverBtn = document.getElementById("startOverBtn");
const step4PrevBtn = document.getElementById("step4PrevBtn");

// --- Data Management Functions ---

/**
 * Saves the current curriculum data to local storage.
 */
function saveProgress() {
  localStorage.setItem("curriculumData", JSON.stringify(curriculumData));
  console.log("Progress saved:", curriculumData);
}

/**
 * Loads curriculum data from local storage.
 */
function loadProgress() {
  const savedData = localStorage.getItem("curriculumData");
  if (savedData) {
    Object.assign(curriculumData, JSON.parse(savedData));
    console.log("Progress loaded:", curriculumData);
  } else {
    console.log("No saved progress found.");
  }
}

// --- UI / Step Management Functions ---

let currentStep = 1;
const stepNames = [
  "وصف الوظيفة",
  "الأنشطة الرئيسية",
  "الجدارات والمهارات",
  "تجميع الإطار",
];
const stepElements = [step1, step2, step3, step4];

/**
 * Updates the progress bar and step name display.
 * @param {number} step The current step number (1-4).
 */
function updateProgressBar(step) {
  const progressPercentage = (step - 1) * (100 / (stepElements.length - 1));
  progressBar.style.width = `${progressPercentage}%`;
  progressBar.setAttribute("aria-valuenow", progressPercentage);
  currentStepName.textContent = stepNames[step - 1];

  // Update step labels visual state
  const labels = document.querySelector(
    ".d-flex.justify-content-between"
  ).children;
  Array.from(labels).forEach((label, index) => {
    if (index < step - 1) {
      label.classList.add("text-primary", "fw-bold");
      label.classList.remove("text-muted");
    } else if (index === step - 1) {
      label.classList.add("text-primary", "fw-bold");
      label.classList.remove("text-muted");
    } else {
      label.classList.add("text-muted");
      label.classList.remove("text-primary", "fw-bold");
    }
  });
}

/**
 * Shows a specific step and hides others, updating progress and UI.
 * @param {number} stepNum The step number to show (1-4).
 * @param {boolean} validate - If true, validates current step before proceeding.
 */
function showStep(stepNum, validate = false) {
  // Check API Key first for all steps
  if (!checkApiKey()) {
    apiWarning.style.display = "block";
    showCustomAlert(
      "مفتاح API مطلوب",
      "الرجاء إدخال وحفظ مفتاح API الخاص بك للمتابعة.",
      "warning"
    );
    return;
  } else {
    apiWarning.style.display = "none";
  }

  // If validation is requested, perform it for the current step before moving
  if (validate && !validateCurrentStep(currentStep)) {
    return; // Stop if validation fails
  }

  currentStep = stepNum;

  // Show/hide steps
  stepElements.forEach((stepEl, index) => {
    if (index + 1 === currentStep) {
      stepEl.style.display = "block";
    } else {
      stepEl.style.display = "none";
    }
  });

  updateProgressBar(currentStep);
  progressWrapper.style.display = "block";

  // Populate data for the current step
  if (currentStep === 1) {
    specializationInfoInput.value =
      curriculumData.step1.specializationInfo || "";
    jobDescriptionOutput.innerHTML =
      curriculumData.step1.jobDescription.formattedHtml ||
      "سيظهر وصف الوظيفة المُنشأ بواسطة GEMINI هنا.";

    if (curriculumData.step1.jobDescription.source === "user") {
      choiceUserRadio.checked = true;
    } else {
      choiceGeminiRadio.checked = true;
    }
  } else if (currentStep === 2) {
    jobDescriptionDisplayStep2.value =
      curriculumData.step1.jobDescription.text || "";
    renderActivitiesTable();
  } else if (currentStep === 3) {
    renderCompetenciesTable();
  } else if (currentStep === 4) {
    compileFramework();
    downloadFrameworkBtn.style.display = "inline-block";
    printFrameworkBtn.style.display = "inline-block";
    startOverBtn.style.display = "inline-block";
  }

  saveProgress();
}

/**
 * Performs client-side validation for the current step's required fields.
 * @param {number} step The step number to validate.
 * @returns {boolean} True if validation passes, false otherwise.
 */
function validateCurrentStep(step) {
  let isValid = true;
  let message = "";

  if (step === 1) {
    if (!specializationInfoInput.value.trim()) {
      specializationInfoInput.classList.add("is-invalid");
      message = "الرجاء إدخال معلومات عامة عن التخصص للمتابعة.";
      isValid = false;
    } else {
      specializationInfoInput.classList.remove("is-invalid");
    }
    if (!curriculumData.step1.jobDescription.text) {
      message =
        message ||
        "الرجاء توليد أو اختيار وصف وظيفة للمتابعة إلى الخطوة التالية.";
      isValid = false;
    }
  } else if (step === 2) {
    if (curriculumData.step2.selectedActivities.length === 0) {
      message = "الرجاء إضافة أو اختيار نشاط واحد على الأقل.";
      activitiesListContainer.classList.add("is-invalid-list");
      isValid = false;
    } else {
      activitiesListContainer.classList.remove("is-invalid-list");
    }
  } else if (step === 3) {
    if (curriculumData.step3.selectedCompetencies.length === 0) {
      message = "الرجاء إضافة أو اختيار جدارة واحدة على الأقل.";
      competenciesListContainer.classList.add("is-invalid-list");
      isValid = false;
    } else {
      competenciesListContainer.classList.remove("is-invalid-list");
    }
  }

  if (!isValid) {
    showCustomAlert("خطأ في الإدخال", message, "error");
  }
  return isValid;
}

// --- API Key Management ---

/**
 * Checks if an API key is present in local storage.
 * @returns {boolean} True if API key exists, false otherwise.
 */
function checkApiKey() {
  const apiKey = localStorage.getItem("geminiApiKey");
  if (apiKey) {
    apiKeyInput.value = apiKey;
    apiKeyStatus.textContent = "مفتاح API محفوظ.";
    apiKeyStatus.classList.remove("text-danger");
    apiKeyStatus.classList.add("text-success");
    return true;
  } else {
    apiKeyInput.value = "";
    apiKeyStatus.textContent = "لا يوجد مفتاح API محفوظ.";
    apiKeyStatus.classList.remove("text-success");
    apiKeyStatus.classList.add("text-danger");
    return false;
  }
}

/**
 * Displays a custom alert message.
 * @param {string} title - The title of the alert.
 * @param {string} message - The message content.
 * @param {'success'|'error'|'warning'|'info'} type - The type of alert for styling.
 * @param {function} [onConfirm] - Optional callback function for confirm button.
 * @param {boolean} [showCancel=false] - Optional: if true, shows a cancel button.
 */
function showCustomAlert(
  title,
  message,
  type,
  onConfirm = null,
  showCancel = false
) {
  const alertModal = document.getElementById("alertModal");
  const alertModalTitle = document.getElementById("alertModalTitle");
  const alertModalBody = document.getElementById("alertModalBody");
  const alertConfirmBtn = document.getElementById("alertConfirmBtn");
  const alertCancelBtn = document.getElementById("alertCancelBtn");

  alertModalTitle.textContent = title;
  alertModalBody.innerHTML = `<p>${message}</p>`; // Use innerHTML to allow basic formatting if needed

  // Set button and header colors based on type
  alertConfirmBtn.className = "btn"; // Reset classes
  alertConfirmBtn.classList.add(
    type === "success"
      ? "btn-success"
      : type === "error"
      ? "btn-danger"
      : type === "warning"
      ? "btn-warning"
      : "btn-primary"
  );

  if (onConfirm) {
    alertConfirmBtn.onclick = () => {
      onConfirm();
      bootstrap.Modal.getInstance(alertModal).hide();
    };
    alertConfirmBtn.style.display = "inline-block";
  } else {
    alertConfirmBtn.onclick = () => {
      bootstrap.Modal.getInstance(alertModal).hide();
    };
    alertConfirmBtn.style.display = "inline-block"; // Always show confirm button
  }

  if (showCancel) {
    alertCancelBtn.style.display = "inline-block";
    alertCancelBtn.onclick = () => {
      bootstrap.Modal.getInstance(alertModal).hide();
    };
  } else {
    alertCancelBtn.style.display = "none";
  }

  const modal = new bootstrap.Modal(alertModal);
  modal.show();
}

// --- Step 1: Job Description Logic ---

/**
 * Formats the raw Gemini response into a readable job description.
 * @param {string} rawText - The raw text received from Gemini.
 * @returns {object} An object containing formatted HTML and extracted job roles.
 */
function formatJobDescription(rawText) {
  let html = "";
  const lines = rawText.split("\n").filter((line) => line.trim() !== "");
  let jobRoles = [];

  lines.forEach((line) => {
    if (line.startsWith("Job Description:")) {
      html += `<h4>${line.replace("Job Description:", "الوصف الوظيفي:")}</h4>`;
    } else if (line.startsWith("Role Overview:")) {
      html += `<h4>${line.replace(
        "Role Overview:",
        "نظرة عامة عن الدور:"
      )}</h4>`;
    } else if (line.startsWith("Key Responsibilities:")) {
      html += `<h4>${line.replace(
        "Key Responsibilities:",
        "المسؤوليات الرئيسية:"
      )}</h4><ul>`;
      let i = lines.indexOf(line) + 1;
      while (i < lines.length && lines[i].startsWith("- ")) {
        html += `<li>${lines[i].substring(2).trim()}</li>`;
        i++;
      }
      html += `</ul>`;
    } else if (line.startsWith("Work Environment:")) {
      html += `<h4>${line.replace("Work Environment:", "بيئة العمل:")}</h4>`;
    } else if (line.startsWith("Required Qualifications:")) {
      html += `<h4>${line.replace(
        "Required Qualifications:",
        "المؤهلات المطلوبة:"
      )}</h4><ul>`;
      let i = lines.indexOf(line) + 1;
      while (i < lines.length && lines[i].startsWith("- ")) {
        html += `<li>${lines[i].substring(2).trim()}</li>`;
        i++;
      }
      html += `</ul>`;
    } else if (line.startsWith("Career Path:")) {
      html += `<h4>${line.replace("Career Path:", "المسار الوظيفي:")}</h4>`;
      const pathText = line.replace("Career Path:", "").trim();
      const roles = pathText
        .split(",")
        .map((role) => role.trim().replace(/\.$/, "")); // Remove trailing periods
      jobRoles = roles.filter((role) => role !== "");
    } else if (line.startsWith("- ")) {
      // Already handled by parent headings
    } else if (line.includes(":")) {
      // Catch-all for other headings if not explicitly formatted above
      const [key, value] = line.split(":", 2);
      html += `<h4>${key.trim()}:</h4><p>${value.trim()}</p>`;
    } else {
      html += `<p>${line}</p>`; // Default paragraph
    }
  });

  return { html, jobRoles };
}

/**
 * Handles the generation of job description using Gemini.
 */
async function handleGenerateJobDescription() {
  const specialization = specializationInfoInput.value.trim();
  if (!specialization) {
    specializationInfoInput.classList.add("is-invalid");
    showCustomAlert(
      "خطأ في الإدخال",
      "الرجاء إدخال معلومات التخصص قبل التوليد.",
      "error"
    );
    return;
  }
  specializationInfoInput.classList.remove("is-invalid");

  generateJobDescriptionBtn.querySelector(".loader").style.display =
    "inline-block";
  generateJobDescriptionBtn.disabled = true;

  jobDescriptionOutput.innerHTML =
    '<p class="text-muted text-center">جاري توليد وصف الوظيفة...</p>';

  try {
    const prompt = `صمم وصف وظيفة مفصل وشامل بناءً على معلومات التخصص التالية: "${specialization}". يجب أن يتضمن وصف الوظيفة:
- Job Description: (اسم الوظيفة المقترح)
- Role Overview: (نظرة عامة موجزة عن الدور)
- Key Responsibilities: (قائمة نقطية من 3-5 مسؤوليات رئيسية)
- Work Environment: (نوع بيئة العمل)
- Required Qualifications: (قائمة نقطية من 2-3 مؤهلات أساسية)
- Career Path: (المسارات الوظيفية المحتملة المرتبطة بهذه الوظيفة، مفصولة بفواصل، مثل: مدير مشروع، مطور أول، مهندس معماري.)
اجعل اللغة واضحة وموجزة ومناسبة لإنشاء إطار المناهج.`;

    const response = await callGeminiAPI(prompt);
    const { html, jobRoles } = formatJobDescription(response);
    jobDescriptionOutput.innerHTML = html;

    curriculumData.step1.specializationInfo = specialization;
    curriculumData.step1.jobDescription = {
      source: "gemini",
      text: response, // Store raw Gemini text for internal use/prompts
      formattedHtml: html, // Store formatted HTML for display
      jobRoles: jobRoles,
    };
    choiceGeminiRadio.checked = true; // Auto-select Gemini choice

    showCustomAlert(
      "نجاح",
      "تم توليد وصف الوظيفة بنجاح بواسطة GEMINI.",
      "success"
    );
  } catch (error) {
    console.error("Error generating job description:", error);
    jobDescriptionOutput.innerHTML =
      '<p class="text-danger text-center">حدث خطأ أثناء توليد وصف الوظيفة. الرجاء المحاولة مرة أخرى.</p>';
    showCustomAlert(
      "خطأ",
      "فشل في توليد وصف الوظيفة. يرجى التحقق من مفتاح API والمحاولة مرة أخرى.",
      "error"
    );
  } finally {
    generateJobDescriptionBtn.querySelector(".loader").style.display = "none";
    generateJobDescriptionBtn.disabled = false;
  }
}

// --- Step 2: Main Activities Logic ---

/**
 * Renders the editable table of activities.
 */
function renderActivitiesTable() {
  activitiesListContainer.innerHTML = "";
  if (curriculumData.step2.selectedActivities.length === 0) {
    activitiesListContainer.innerHTML = `
            <p class="text-muted text-center py-3">
                الرجاء توليد الأنشطة أو إضافتها يدويًا.
            </p>
        `;
    return;
  }

  const table = document.createElement("table");
  table.className = "table table-bordered table-striped activities-table";
  table.innerHTML = `
        <thead>
            <tr>
                <th scope="col" class="text-end">وصف النشاط</th>
                <th scope="col" style="width: 150px;">المصدر</th>
                <th scope="col" style="width: 120px;" class="text-center">إجراءات</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
  const tbody = table.querySelector("tbody");

  curriculumData.step2.selectedActivities.forEach((activity, index) => {
    const row = tbody.insertRow();
    row.setAttribute("data-index", index);
    row.innerHTML = `
            <td>
                <input type="text" class="form-control activity-description-input" 
                    value="${activity.description}" 
                    data-original-value="${activity.description}">
            </td>
            <td>
                <span class="badge bg-${
                  activity.source === "Gemini" ? "info" : "secondary"
                }">
                    ${activity.source === "Gemini" ? "GEMINI" : "مستخدم"}
                </span>
            </td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-danger delete-activity-btn" 
                    data-index="${index}" aria-label="حذف النشاط">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
  });

  activitiesListContainer.appendChild(table);

  // Add event listeners for editing and deleting
  activitiesListContainer
    .querySelectorAll(".activity-description-input")
    .forEach((input) => {
      input.addEventListener("change", (e) => {
        const index = e.target.closest("tr").dataset.index;
        curriculumData.step2.selectedActivities[index].description =
          e.target.value;
        if (e.target.value !== e.target.dataset.originalValue) {
          curriculumData.step2.selectedActivities[index].source = "User"; // Mark as user-edited
          renderActivitiesTable(); // Re-render to update badge
        }
        saveProgress();
      });
    });

  activitiesListContainer
    .querySelectorAll(".delete-activity-btn")
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        showCustomAlert(
          "تأكيد الحذف",
          `هل أنت متأكد من حذف النشاط: "${curriculumData.step2.selectedActivities[index].description}"؟`,
          "warning",
          () => {
            curriculumData.step2.selectedActivities.splice(index, 1);
            renderActivitiesTable();
            saveProgress();
            // Re-validate list if it becomes empty
            if (curriculumData.step2.selectedActivities.length === 0) {
              activitiesListContainer.classList.add("is-invalid-list");
            }
          },
          true
        );
      });
    });

  // Ensure validation state is correct on render
  if (curriculumData.step2.selectedActivities.length === 0) {
    activitiesListContainer.classList.add("is-invalid-list");
  } else {
    activitiesListContainer.classList.remove("is-invalid-list");
  }
}

/**
 * Handles the generation of main activities using Gemini.
 */
async function handleGenerateActivities() {
  const jobDescriptionText = curriculumData.step1.jobDescription.text;
  if (!jobDescriptionText) {
    showCustomAlert(
      "خطأ",
      "الرجاء إدخال أو توليد وصف وظيفة في الخطوة 1 أولاً.",
      "error"
    );
    return;
  }

  generateActivitiesBtn.querySelector(".loader").style.display = "inline-block";
  generateActivitiesBtn.disabled = true;

  activitiesListContainer.innerHTML =
    '<p class="text-muted text-center py-3">جاري توليد الأنشطة الرئيسية...</p>';

  try {
    const prompt = `بناءً على وصف الوظيفة التالي:
${jobDescriptionText}

قم بتوليد قائمة من 15 نشاطًا رئيسيًا على الأقل مرتبطة بهذه الوظيفة. قدم كل نشاط كعنصر قائمة منفصل.
على سبيل المثال:
- نشاط 1
- نشاط 2
...`;

    const response = await callGeminiAPI(prompt);
    const activities = response
      .split("\n")
      .filter((line) => line.startsWith("- "))
      .map((line) => ({
        description: line.substring(2).trim(),
        source: "Gemini",
      }));

    if (activities.length > 0) {
      curriculumData.step2.selectedActivities = activities; // Overwrite previous activities
      renderActivitiesTable();
      showCustomAlert("نجاح", "تم توليد الأنشطة الرئيسية بنجاح.", "success");
    } else {
      activitiesListContainer.innerHTML = `<p class="text-danger text-center py-3">لم يتم توليد أي أنشطة. الرجاء المحاولة مرة أخرى.</p>`;
      showCustomAlert(
        "خطأ",
        "لم يتمكن Gemini من توليد أنشطة. حاول تعديل وصف الوظيفة.",
        "error"
      );
    }
  } catch (error) {
    console.error("Error generating activities:", error);
    activitiesListContainer.innerHTML =
      '<p class="text-danger text-center py-3">حدث خطأ أثناء توليد الأنشطة. الرجاء المحاولة مرة أخرى.</p>';
    showCustomAlert(
      "خطأ",
      "فشل في توليد الأنشطة. يرجى التحقق من مفتاح API والمحاولة مرة أخرى.",
      "error"
    );
  } finally {
    generateActivitiesBtn.querySelector(".loader").style.display = "none";
    generateActivitiesBtn.disabled = false;
  }
}

/**
 * Adds a custom activity from the input field to the list.
 */
function handleAddCustomActivity() {
  const customActivity = customActivityInput.value.trim();
  if (customActivity) {
    curriculumData.step2.selectedActivities.push({
      description: customActivity,
      source: "User",
    });
    customActivityInput.value = ""; // Clear input
    renderActivitiesTable();
    saveProgress();
  } else {
    showCustomAlert(
      "خطأ في الإدخال",
      "الرجاء إدخال وصف النشاط المخصص.",
      "warning"
    );
  }
}

// --- Step 3: Competencies and Skills Logic ---

/**
 * Handles the generation of competencies for a specific activity using Gemini.
 * @param {object} activity - The activity object to generate competencies for.
 */
async function handleGenerateCompetencyForActivity(activity) {
  const activityButton = document.querySelector(
    `button[data-activity-id="${activity.id}"]`
  );
  const loader = activityButton.querySelector(".loader");

  activityButton.disabled = true;
  loader.style.display = "inline-block";

  try {
    const prompt = `باستخدام النشاط التالي، قم بتحديد الجدارات والمهارات المطلوبة له.
قم بتحديد:
1. جدارة رئيسية
2. المهارات العملية (3-5 مهارات قابلة للقياس)
3. المعرفة النظرية (2-3 مفاهيم أساسية)

النشاط: ${activity.description}

أعطِ الإجابة بالتنسيق التالي:
Activity: [وصف النشاط]
Competency: [الجدارة المطلوبة]
Practical Skills:
- [مهارة عملية 1]
- [مهارة عملية 2]
- [مهارة عملية 3]
Theoretical Knowledge:
- [معرفة نظرية 1]
- [معرفة نظرية 2]

قم بإعطاء إجابات محددة وواضحة وقابلة للقياس.`;

    const response = await callGeminiAPI(prompt);
    const competencies = parseCompetenciesResponse(response);

    if (competencies && competencies.length > 0) {
      // Replace or add new competencies for this activity
      const existingIndex = curriculumData.step3.selectedCompetencies.findIndex(
        (comp) => comp.activity === activity.description
      );

      if (existingIndex !== -1) {
        curriculumData.step3.selectedCompetencies[existingIndex] =
          competencies[0];
      } else {
        curriculumData.step3.selectedCompetencies.push(competencies[0]);
      }

      renderCompetenciesTable();
      showCustomAlert(
        "نجاح",
        `تم توليد الجدارات والمهارات للنشاط بنجاح.`,
        "success"
      );
    } else {
      throw new Error("No valid competencies generated");
    }
  } catch (error) {
    console.error("Error generating competencies:", error);
    showCustomAlert(
      "خطأ",
      "فشل في توليد الجدارات. يرجى المحاولة مرة أخرى.",
      "error"
    );
  } finally {
    activityButton.disabled = false;
    loader.style.display = "none";
  }
}

/**
 * Renders the editable table of competencies and skills.
 */
function renderCompetenciesTable() {
  competenciesListContainer.innerHTML = "";

  // Show activities list first
  const activitiesList = document.createElement("div");
  activitiesList.className = "list-group mb-4";

  curriculumData.step2.selectedActivities.forEach((activity, index) => {
    const existingCompetency = curriculumData.step3.selectedCompetencies.find(
      (comp) => comp.activity === activity.description
    );

    const listItem = document.createElement("div");
    listItem.className =
      "list-group-item d-flex justify-content-between align-items-center p-3";
    activity.id = activity.id || `activity-${index}`; // Ensure each activity has an ID

    listItem.innerHTML = `
      <div class="flex-grow-1">
        <h6 class="mb-1">النشاط ${index + 1}</h6>
        <p class="mb-1 text-muted">${activity.description}</p>
        ${
          existingCompetency
            ? `
          <div class="mt-2">
            <span class="badge bg-success">تم توليد الجدارات</span>
          </div>
        `
            : ""
        }
      </div>
      <button type="button" class="btn btn-outline-primary generate-activity-btn ms-3" data-activity-id="${
        activity.id
      }">
        <span class="loader spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" style="display: none"></span>
        <i class="bi bi-robot me-1"></i>
        توليد الجدارات
      </button>
    `;

    activitiesList.appendChild(listItem);
  });

  competenciesListContainer.appendChild(activitiesList);

  // Show competencies table if any exist
  if (curriculumData.step3.selectedCompetencies.length > 0) {
    const table = document.createElement("table");
    table.className =
      "table table-bordered table-striped competencies-table mt-4";
    table.innerHTML = `
      <thead>
        <tr>
          <th scope="col" class="text-end" style="width: 25%;">النشاط</th>
          <th scope="col" class="text-end" style="width: 20%;">الجدارة</th>
          <th scope="col" class="text-end" style="width: 25%;">المهارات العملية</th>
          <th scope="col" class="text-end" style="width: 20%;">المعرفة النظرية</th>
          <th scope="col" style="width: 10%;">المصدر</th>
          <th scope="col" style="width: 80px;" class="text-center">إجراءات</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    curriculumData.step3.selectedCompetencies.forEach((comp, index) => {
      const row = tbody.insertRow();
      row.setAttribute("data-index", index);
      row.innerHTML = `
        <td><input type="text" class="form-control competency-activity-input" 
            value="${comp.activity}" data-original-value="${
        comp.activity
      }"></td>
        <td><input type="text" class="form-control competency-text-input" 
            value="${comp.competency}" data-original-value="${
        comp.competency
      }"></td>
        <td><textarea class="form-control practical-skills-input" rows="2" 
            data-original-value="${comp.practicalSkills}">${
        comp.practicalSkills
      }</textarea></td>
        <td><textarea class="form-control theoretical-knowledge-input" rows="2" 
            data-original-value="${comp.theoreticalKnowledge}">${
        comp.theoreticalKnowledge
      }</textarea></td>
        <td>
          <span class="badge bg-${
            comp.source === "Gemini" ? "info" : "secondary"
          }">
            ${comp.source === "Gemini" ? "GEMINI" : "مستخدم"}
          </span>
        </td>
        <td class="text-center">
          <button type="button" class="btn btn-sm btn-danger delete-competency-btn" 
              data-index="${index}" aria-label="حذف الجدارة">
              <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
    });

    competenciesListContainer.appendChild(table);
  }

  // Add event listeners for generate buttons
  competenciesListContainer
    .querySelectorAll(".generate-activity-btn")
    .forEach((btn) => {
      btn.addEventListener("click", async () => {
        const activityId = btn.dataset.activityId;
        const activity = curriculumData.step2.selectedActivities.find(
          (act) => act.id === activityId
        );
        if (activity) {
          await handleGenerateCompetencyForActivity(activity);
        }
      });
    });

  // Add event listeners for editing and deleting
  const inputs = competenciesListContainer.querySelectorAll(
    ".competency-activity-input, .competency-text-input, .practical-skills-input, .theoretical-knowledge-input"
  );

  inputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      const index = e.target.closest("tr").dataset.index;
      const comp = curriculumData.step3.selectedCompetencies[index];

      if (e.target.classList.contains("competency-activity-input")) {
        comp.activity = e.target.value;
      } else if (e.target.classList.contains("competency-text-input")) {
        comp.competency = e.target.value;
      } else if (e.target.classList.contains("practical-skills-input")) {
        comp.practicalSkills = e.target.value;
      } else if (e.target.classList.contains("theoretical-knowledge-input")) {
        comp.theoreticalKnowledge = e.target.value;
      }

      if (e.target.value !== e.target.dataset.originalValue) {
        comp.source = "User"; // Mark as user-edited
        renderCompetenciesTable(); // Re-render to update badge
      }
      saveProgress();
    });
  });

  competenciesListContainer
    .querySelectorAll(".delete-competency-btn")
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        showCustomAlert(
          "تأكيد الحذف",
          `هل أنت متأكد من حذف الجدارة: "${curriculumData.step3.selectedCompetencies[index].competency}"؟`,
          "warning",
          () => {
            curriculumData.step3.selectedCompetencies.splice(index, 1);
            renderCompetenciesTable();
            saveProgress();
            // Re-validate list if it becomes empty
            if (curriculumData.step3.selectedCompetencies.length === 0) {
              competenciesListContainer.classList.add("is-invalid-list");
            }
          },
          true
        );
      });
    });

  // Ensure validation state is correct on render
  if (curriculumData.step3.selectedCompetencies.length === 0) {
    competenciesListContainer.classList.add("is-invalid-list");
  } else {
    competenciesListContainer.classList.remove("is-invalid-list");
  }
}

/**
 * Handles the generation of competencies and skills using Gemini.
 */
async function handleGenerateCompetencies() {
  const selectedActivities = curriculumData.step2.selectedActivities;
  if (selectedActivities.length === 0) {
    showCustomAlert(
      "خطأ",
      "الرجاء توليد أو اختيار أنشطة في الخطوة 2 أولاً.",
      "error"
    );
    return;
  }

  generateCompetenciesBtn.querySelector(".loader").style.display =
    "inline-block";
  generateCompetenciesBtn.disabled = true;
  competenciesListContainer.innerHTML =
    '<p class="text-muted text-center py-3">جاري توليد الجدارات والمهارات...</p>';

  try {
    // Generate for all activities in sequence
    curriculumData.step3.selectedCompetencies = []; // Clear existing competencies

    for (const activity of selectedActivities) {
      const prompt = `باستخدام النشاط التالي، قم بتحديد الجدارات والمهارات المطلوبة له.
قم بتحديد:
1. جدارة رئيسية
2. المهارات العملية (3-5 مهارات قابلة للقياس)
3. المعرفة النظرية (2-3 مفاهيم أساسية)

النشاط: ${activity.description}

أعطِ الإجابة بالتنسيق التالي:
Activity: [وصف النشاط]
Competency: [الجدارة المطلوبة]
Practical Skills:
- [مهارة عملية 1]
- [مهارة عملية 2]
- [مهارة عملية 3]
Theoretical Knowledge:
- [معرفة نظرية 1]
- [معرفة نظرية 2]`;

      const response = await callGeminiAPI(prompt);
      const competencies = parseCompetenciesResponse(response);

      if (competencies && competencies.length > 0) {
        curriculumData.step3.selectedCompetencies.push(competencies[0]);
      }
    }

    if (curriculumData.step3.selectedCompetencies.length > 0) {
      renderCompetenciesTable();
      showCustomAlert("نجاح", "تم توليد الجدارات والمهارات بنجاح.", "success");
    } else {
      throw new Error("No valid competencies generated");
    }
  } catch (error) {
    console.error("Error generating competencies:", error);
    competenciesListContainer.innerHTML =
      '<p class="text-danger text-center py-3">حدث خطأ أثناء توليد الجدارات. الرجاء المحاولة مرة أخرى.</p>';
    showCustomAlert(
      "خطأ",
      "فشل في توليد الجدارات. يرجى التحقق من المدخلات والمحاولة مرة أخرى.",
      "error"
    );
  } finally {
    generateCompetenciesBtn.querySelector(".loader").style.display = "none";
    generateCompetenciesBtn.disabled = false;
  }
}

/**
 * Parses the Gemini API response for competencies into a structured array.
 * @param {string} rawResponse - The raw text response from Gemini.
 * @returns {Array<object>} An array of competency objects.
 */
function parseCompetenciesResponse(rawResponse) {
  try {
    const competencies = [];
    const sections = rawResponse
      .split(/\nActivity:|\nالنشاط \d+:/i)
      .filter((s) => s.trim());

    sections.forEach((section) => {
      const lines = section
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);

      let currentCompetency = {
        activity: "",
        competency: "",
        practicalSkills: [],
        theoreticalKnowledge: [],
        source: "Gemini",
      };

      let currentSection = "";

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (
          !currentCompetency.activity &&
          !line.toLowerCase().startsWith("competency:")
        ) {
          currentCompetency.activity = line;
        } else if (line.toLowerCase().startsWith("competency:")) {
          currentCompetency.competency = line
            .replace(/^competency:/i, "")
            .trim();
        } else if (line.toLowerCase().includes("practical skills:")) {
          currentSection = "practical";
        } else if (line.toLowerCase().includes("theoretical knowledge:")) {
          currentSection = "theoretical";
        } else if (line.startsWith("-")) {
          const skill = line.substring(1).trim();
          if (currentSection === "practical") {
            currentCompetency.practicalSkills.push(skill);
          } else if (currentSection === "theoretical") {
            currentCompetency.theoreticalKnowledge.push(skill);
          }
        }
      }

      // Only add if we have the minimum required fields
      if (
        currentCompetency.activity &&
        currentCompetency.competency &&
        (currentCompetency.practicalSkills.length > 0 ||
          currentCompetency.theoreticalKnowledge.length > 0)
      ) {
        // Convert arrays to strings for display
        currentCompetency.practicalSkills =
          currentCompetency.practicalSkills.join("\n");
        currentCompetency.theoreticalKnowledge =
          currentCompetency.theoreticalKnowledge.join("\n");
        competencies.push(currentCompetency);
      }
    });

    console.log("Parsed competencies:", competencies); // For debugging
    return competencies;
  } catch (error) {
    console.error("Error parsing competencies:", error);
    return [];
  }
}

/**
 * Adds a custom competency from the input fields to the list.
 */
function handleAddCustomCompetency() {
  const customCompetency = customCompetencyInput.value.trim();
  if (!customCompetency) {
    showCustomAlert(
      "خطأ في الإدخال",
      "الرجاء إدخال الجدارة المخصصة.",
      "warning"
    );
    return;
  }

  // Use modals for gathering additional information
  const modalBody = document.querySelector("#alertModalBody");
  const modalTitle = document.querySelector("#alertModalTitle");
  const confirmBtn = document.querySelector("#alertConfirmBtn");
  const modal = new bootstrap.Modal(document.querySelector("#alertModal"));

  let formData = {
    activity: "",
    competency: customCompetency,
    practicalSkills: "",
    theoreticalKnowledge: "",
  };

  // Create a form for the modal
  modalTitle.textContent = "إضافة جدارة جديدة";
  modalBody.innerHTML = `
    <form id="competencyForm">
      <div class="mb-3">
        <label class="form-label">النشاط المرتبط:</label>
        <input type="text" class="form-control" id="customActivity" required>
      </div>
      <div class="mb-3">
        <label class="form-label">المهارات العملية (افصل بين المهارات بسطر جديد):</label>
        <textarea class="form-control" id="customPracticalSkills" rows="3" required></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">المعرفة النظرية (افصل بين المعارف بسطر جديد):</label>
        <textarea class="form-control" id="customTheoreticalKnowledge" rows="3" required></textarea>
      </div>
    </form>
  `;

  // Handle form submission
  confirmBtn.onclick = () => {
    const form = document.getElementById("competencyForm");
    const activity = document.getElementById("customActivity").value.trim();
    const practicalSkills = document
      .getElementById("customPracticalSkills")
      .value.trim();
    const theoreticalKnowledge = document
      .getElementById("customTheoreticalKnowledge")
      .value.trim();

    if (activity && (practicalSkills || theoreticalKnowledge)) {
      curriculumData.step3.selectedCompetencies.push({
        activity,
        competency: customCompetency,
        practicalSkills,
        theoreticalKnowledge,
        source: "User",
      });

      customCompetencyInput.value = ""; // Clear input
      modal.hide();
      renderCompetenciesTable();
      saveProgress();
    } else {
      showCustomAlert(
        "خطأ في الإدخال",
        "الرجاء ملء جميع الحقول المطلوبة.",
        "warning"
      );
    }
  };

  modal.show();
}

// --- Step 4: Compile Framework Logic ---

/**
 * Compiles all data from previous steps into the final framework summary.
 */
function compileFramework() {
  if (
    !curriculumData.step1.jobDescription.text ||
    curriculumData.step2.selectedActivities.length === 0 ||
    curriculumData.step3.selectedCompetencies.length === 0
  ) {
    showCustomAlert(
      "بيانات غير مكتملة",
      "يرجى إكمال جميع الخطوات السابقة قبل تجميع الإطار.",
      "warning"
    );
    finalFrameworkOutput.innerHTML = `
            <p class="text-muted text-center py-5">
                الرجاء إكمال جميع الخطوات السابقة لتجميع إطار المنهج النهائي.
            </p>
        `;
    curriculumData.step4.finalFramework = {};
    saveProgress();
    downloadFrameworkBtn.style.display = "none";
    printFrameworkBtn.style.display = "none";
    startOverBtn.style.display = "none";
    return;
  }

  compileFrameworkBtn.querySelector(".loader").style.display = "inline-block";
  compileFrameworkBtn.disabled = true;

  try {
    const jobDesc = curriculumData.step1.jobDescription;
    const activities = curriculumData.step2.selectedActivities;
    const competencies = curriculumData.step3.selectedCompetencies;

    let frameworkHtml = `
            <h3 class="text-center text-primary mb-4">إطار المنهج الدراسي النهائي</h3>
            <div class="framework-section">
                <h4>1. وصف الوظيفة:</h4>
                <p><strong>الدور:</strong> ${
                  jobDesc.jobRoles[0] || "غير محدد"
                }</p>
                <p><strong>المصدر:</strong> ${
                  jobDesc.source === "gemini" ? "GEMINI" : "مستخدم"
                }</p>
                <div class="job-description-summary">${
                  jobDesc.formattedHtml
                }</div>
            </div>

            <div class="framework-section">
                <h4>2. الأنشطة الرئيسية (${activities.length} نشاط):</h4>
                <ul class="activities-summary-list">
        `;

    activities.forEach((activity) => {
      frameworkHtml += `<li>${activity.description} (${
        activity.source === "Gemini" ? "GEMINI" : "مستخدم"
      })</li>`;
    });
    frameworkHtml += `</ul></div>`;

    frameworkHtml += `
            <div class="framework-section">
                <h4>3. الجدارات والمهارات (${competencies.length} جدارة):</h4>
                <div class="competencies-summary-grid">
        `;

    competencies.forEach((comp) => {
      frameworkHtml += `
                <div class="competency-summary-item">
                    <h5>النشاط: ${comp.activity}</h5>
                    <p><strong>الجدارة:</strong> ${comp.competency}</p>
                    <p><strong>المصدر:</strong> <span class="badge bg-${
                      comp.source === "Gemini" ? "info" : "secondary"
                    }">${
        comp.source === "Gemini" ? "GEMINI" : "مستخدم"
      }</span></p>
                    <div class="skills-list">
                        <strong>المهارات العملية:</strong>
                        <ul>
                            ${comp.practicalSkills
                              .split("\n")
                              .filter((s) => s.trim() !== "")
                              .map((skill) => `<li>${skill.trim()}</li>`)
                              .join("")}
                        </ul>
                    </div>
                    <div class="knowledge-list">
                        <strong>المعرفة النظرية:</strong>
                        <ul>
                            ${comp.theoreticalKnowledge
                              .split("\n")
                              .filter((s) => s.trim() !== "")
                              .map(
                                (knowledge) => `<li>${knowledge.trim()}</li>`
                              )
                              .join("")}
                        </ul>
                    </div>
                </div>
            `;
    });
    frameworkHtml += `</div></div>`;

    frameworkHtml += `
            <div class="framework-section summary-conclusion">
                <h4>4. ملخص الإطار:</h4>
                <p>تم تصميم إطار المنهج هذا ليُعد المتعلمين لدور <strong>${
                  jobDesc.jobRoles[0] || "غير محدد"
                }</strong> من خلال التركيز على المهارات العملية الأساسية، المعرفة النظرية الشاملة، والأنشطة الرئيسية للدور. الإطار قابل للتكيف ويمكن تخصيصه بناءً على متطلبات محددة.</p>
            </div>
        `;

    finalFrameworkOutput.innerHTML = frameworkHtml;

    curriculumData.step4.finalFramework = {
      jobDescription: jobDesc.formattedHtml, // Store formatted for PDF too
      activities: activities,
      competencies: competencies,
      summaryHtml: frameworkHtml,
    };
    saveProgress();
    showCustomAlert(
      "نجاح",
      "تم تجميع إطار المنهج النهائي بنجاح! يمكنك الآن تنزيله أو طباعته.",
      "success"
    );
    downloadFrameworkBtn.style.display = "inline-block";
    printFrameworkBtn.style.display = "inline-block";
    startOverBtn.style.display = "inline-block";
  } catch (error) {
    console.error("Error compiling framework:", error);
    finalFrameworkOutput.innerHTML =
      '<p class="text-danger text-center py-5">حدث خطأ أثناء تجميع الإطار. الرجاء المحاولة مرة أخرى.</p>';
    showCustomAlert(
      "خطأ",
      "فشل في تجميع الإطار. الرجاء التحقق من البيانات والمحاولة مرة أخرى.",
      "error"
    );
  } finally {
    compileFrameworkBtn.querySelector(".loader").style.display = "none";
    compileFrameworkBtn.disabled = false;
  }
}

// ==================================================
// PDF Export Functionality (Adjusted for new data structure)
// ==================================================

/**
 * Exports the final curriculum framework to a PDF.
 * Organizes the PDF with a cover page, followed by one page per activity.
 * Each activity page lists its competencies, with skills and knowledge under each competency.
 * Requires jsPDF and jspdf-autotable libraries, and an Arabic font (e.g., Amiri).
 * Assumes the following scripts are included in the HTML:
 * <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
 * <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js"></script>
 * And a font file or script for Arabic support, e.g., Amiri-Regular.ttf registered with jsPDF.
 */
async function exportFrameworkToPdf() {
  if (
    typeof window.jspdf === "undefined" ||
    typeof window.jspdf.jsPDF === "undefined"
  ) {
    showCustomAlert(
      "خطأ في التصدير",
      "مكتبة jsPDF غير موجودة. الرجاء التأكد من تضمينها في ملف HTML الخاص بك.",
      "error"
    );
    return;
  }

  if (
    !curriculumData.step4.finalFramework ||
    Object.keys(curriculumData.step4.finalFramework).length === 0
  ) {
    showCustomAlert(
      "خطأ في التصدير",
      "لا يوجد إطار عمل لإنشائه. الرجاء تجميع الإطار أولاً.",
      "warning"
    );
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set up Arabic font and RTL
  // You would need to ensure 'Amiri-Regular.ttf' is properly loaded or provided as a base64 string
  // For demonstration, we assume it's added via doc.addFont in a real scenario
  try {
    doc.addFont("assets/fonts/Amiri-Regular.ttf", "Amiri", "normal"); // Adjust path if necessary
    doc.setFont("Amiri");
    doc.setR2L(true);
  } catch (e) {
    console.warn(
      "Could not load Arabic font. PDF may not display Arabic text correctly.",
      e
    );
    showCustomAlert(
      "تحذير",
      "فشل تحميل الخط العربي، قد لا يظهر النص بشكل صحيح في PDF.",
      "warning"
    );
  }

  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yOffset = margin;

  // Helper function to add wrapped text with proper RTL alignment
  const addWrappedText = (
    text,
    x,
    y,
    maxWidth,
    fontSize = 12,
    lineHeight = 7,
    align = "right"
  ) => {
    doc.setFontSize(fontSize);
    const textLines = doc.splitTextToSize(text, maxWidth);
    doc.text(textLines, x, y, { align: align });
    return y + textLines.length * lineHeight;
  };

  // Helper function to add a page border
  const addPageBorder = () => {
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);
  };

  // Helper function to check for page breaks
  const checkPageBreak = (requiredHeight = 30) => {
    if (yOffset > pageHeight - margin - requiredHeight) {
      doc.addPage();
      addPageBorder();
      yOffset = margin;
      addFooter();
    }
  };

  // Helper function to add a footer
  const addFooter = () => {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "المملكة العربية السعودية - إطار المنهج الدراسي",
      pageWidth / 2,
      pageHeight - margin / 2,
      { align: "center" }
    );
    doc.setTextColor(0, 0, 0); // Reset color
  };

  // --- Cover Page ---
  addPageBorder();
  yOffset = margin + 20;

  // Main Title
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 100); // Dark blue for title
  yOffset = addWrappedText(
    "الإطار التفصيلي للمنهج الدراسي",
    pageWidth - margin,
    yOffset,
    pageWidth - 2 * margin,
    24,
    12
  );

  // Specialization Info
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  yOffset += 20;
  yOffset = addWrappedText(
    "التخصص: " + curriculumData.step1.specializationInfo,
    pageWidth - margin,
    yOffset,
    pageWidth - 2 * margin,
    16,
    10
  );

  // Job Description
  yOffset += 15;
  doc.setFontSize(14);
  yOffset = addWrappedText(
    "وصف المهنة:",
    pageWidth - margin,
    yOffset,
    pageWidth - 2 * margin,
    14,
    8
  );
  doc.setFontSize(12);
  // Using the original job description text for PDF as it's the raw content
  yOffset = addWrappedText(
    curriculumData.step1.jobDescription.text,
    pageWidth - margin - 5,
    yOffset + 5,
    pageWidth - 2 * margin - 5,
    12,
    7
  );

  addFooter();

  // --- Activities Pages ---
  const activities = curriculumData.step2.selectedActivities;
  const competencies = curriculumData.step3.selectedCompetencies;

  activities.forEach((activity, index) => {
    doc.addPage();
    yOffset = margin;
    addPageBorder();

    // Activity Title
    doc.setFontSize(16);
    doc.setTextColor(0, 100, 0); // Green for activity
    yOffset = addWrappedText(
      `النشاط ${index + 1}: ${activity.description}`,
      pageWidth - margin,
      yOffset,
      pageWidth - 2 * margin,
      16,
      8
    );
    doc.setTextColor(0, 0, 0);
    yOffset += 5;
    doc.setLineWidth(0.2);
    doc.line(margin, yOffset, pageWidth - margin, yOffset);
    yOffset += 10;

    // Filter competencies relevant to this activity
    const activityCompetencies = competencies.filter(
      (comp) => comp.activity === activity.description
    );

    if (activityCompetencies.length === 0) {
      checkPageBreak(20);
      yOffset = addWrappedText(
        "لا توجد جدارات محددة لهذا النشاط.",
        pageWidth - margin,
        yOffset,
        pageWidth - 2 * margin,
        12,
        7
      );
      addFooter();
      return; // Skip to next activity if no competencies
    }

    activityCompetencies.forEach((competency, compIndex) => {
      checkPageBreak(50); // Ensure enough space for competency block

      // Competency Heading
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 150); // Blue for competency
      yOffset = addWrappedText(
        `الجدارة ${compIndex + 1}: ${competency.competency} (${
          competency.source === "Gemini" ? "GEMINI" : "مستخدم"
        })`,
        pageWidth - margin - 5,
        yOffset,
        pageWidth - 2 * margin - 5,
        14,
        8
      );
      doc.setTextColor(0, 0, 0);

      // Practical Skills
      if (competency.practicalSkills.trim()) {
        checkPageBreak(25);
        doc.setFontSize(12);
        yOffset = addWrappedText(
          "المهارات العملية:",
          pageWidth - margin - 10,
          yOffset + 5,
          pageWidth - 2 * margin - 10,
          12,
          7
        );
        doc.setFontSize(11);
        competency.practicalSkills
          .split("\n")
          .filter((s) => s.trim() !== "")
          .forEach((skill, skillIndex) => {
            checkPageBreak(15);
            yOffset = addWrappedText(
              `• ${skill.trim()}`,
              pageWidth - margin - 15,
              yOffset + 5,
              pageWidth - 2 * margin - 15,
              11,
              6
            );
          });
      }

      // Theoretical Knowledge
      if (competency.theoreticalKnowledge.trim()) {
        checkPageBreak(25);
        doc.setFontSize(12);
        yOffset = addWrappedText(
          "المعرفة النظرية:",
          pageWidth - margin - 10,
          yOffset + 5,
          pageWidth - 2 * margin - 10,
          12,
          7
        );
        doc.setFontSize(11);
        competency.theoreticalKnowledge
          .split("\n")
          .filter((s) => s.trim() !== "")
          .forEach((knowledge, knowledgeIndex) => {
            checkPageBreak(15);
            yOffset = addWrappedText(
              `• ${knowledge.trim()}`,
              pageWidth - margin - 15,
              yOffset + 5,
              pageWidth - 2 * margin - 15,
              11,
              6
            );
          });
      }
      yOffset += 10; // Space after each competency
    });
    addFooter();
  });

  // Save the PDF
  doc.save("إطار-المنهج-الدراسي.pdf");
  showCustomAlert("نجاح", "تم إنشاء ملف PDF لإطار المنهج الدراسي.", "success");
}

// --- Event Listeners ---

document.addEventListener("DOMContentLoaded", () => {
  loadProgress(); // Load any saved progress

  // Initialize API Key section
  checkApiKey();

  // API Key Save Button
  saveApiKeyBtn.addEventListener("click", () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      localStorage.setItem("geminiApiKey", apiKey);
      showCustomAlert("نجاح", "تم حفظ مفتاح API بنجاح!", "success");
      checkApiKey(); // Update status
    } else {
      showCustomAlert("خطأ", "الرجاء إدخال مفتاح API.", "error");
    }
  });

  // API Key Visibility Toggle
  toggleApiKeyVisibility.addEventListener("click", () => {
    const type =
      apiKeyInput.getAttribute("type") === "password" ? "text" : "password";
    apiKeyInput.setAttribute("type", type);
    // Toggle eye icon
    const icon = toggleApiKeyVisibility.querySelector("i");
    if (type === "text") {
      icon.classList.remove("bi-eye");
      icon.classList.add("bi-eye-slash");
    } else {
      icon.classList.remove("bi-eye-slash");
      icon.classList.add("bi-eye");
    }
  });

  // Step 1 Buttons
  generateJobDescriptionBtn.addEventListener(
    "click",
    handleGenerateJobDescription
  );

  choiceGeminiRadio.addEventListener("change", () => {
    if (choiceGeminiRadio.checked) {
      specializationInfoInput.disabled = false; // Enable if Gemini is chosen for input
      jobDescriptionOutput.innerHTML =
        curriculumData.step1.jobDescription.formattedHtml ||
        '<p class="text-muted text-center">سيظهر وصف الوظيفة المُنشأ بواسطة GEMINI هنا.</p>';
      curriculumData.step1.jobDescription.source = "gemini";
      curriculumData.step1.jobDescription.text =
        curriculumData.step1.jobDescription.text || ""; // Keep raw text
    }
    saveProgress();
  });

  choiceUserRadio.addEventListener("change", () => {
    if (choiceUserRadio.checked) {
      specializationInfoInput.disabled = false;
      jobDescriptionOutput.innerHTML =
        specializationInfoInput.value ||
        '<p class="text-muted text-center">الرجاء إدخال وصف الوظيفة الخاص بك في حقل معلومات التخصص.</p>';
      curriculumData.step1.jobDescription.source = "user";
      curriculumData.step1.jobDescription.text = specializationInfoInput.value;
    }
    saveProgress();
  });

  specializationInfoInput.addEventListener("input", () => {
    if (choiceUserRadio.checked) {
      // If user choice is selected, update job description output with manual input
      jobDescriptionOutput.innerHTML = specializationInfoInput.value;
      curriculumData.step1.jobDescription.text = specializationInfoInput.value;
      curriculumData.step1.jobDescription.formattedHtml =
        specializationInfoInput.value; // Simple copy for consistency
      curriculumData.step1.specializationInfo = specializationInfoInput.value;
      saveProgress();
    }
  });

  step1NextBtn.addEventListener("click", () => showStep(2, true));

  // Step 2 Buttons
  generateActivitiesBtn.addEventListener("click", handleGenerateActivities);
  addCustomActivityBtn.addEventListener("click", handleAddCustomActivity);
  step2PrevBtn.addEventListener("click", () => showStep(1));
  step2NextBtn.addEventListener("click", () => showStep(3, true));

  // Step 3 Buttons
  generateCompetenciesBtn.addEventListener("click", handleGenerateCompetencies);
  addCustomCompetencyBtn.addEventListener("click", handleAddCustomCompetency);
  step3PrevBtn.addEventListener("click", () => showStep(2));
  step3NextBtn.addEventListener("click", () => showStep(4, true));

  // Step 4 Buttons
  compileFrameworkBtn.addEventListener("click", compileFramework);
  downloadFrameworkBtn.addEventListener("click", exportFrameworkToPdf);
  printFrameworkBtn.addEventListener("click", () => {
    if (
      curriculumData.step4.finalFramework &&
      Object.keys(curriculumData.step4.finalFramework).length > 0
    ) {
      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      printWindow.document.write(
        "<html><head><title>طباعة إطار المنهج</title>"
      );
      // Add Bootstrap CSS for styling in print
      printWindow.document.write(
        '<link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">'
      );
      // Add custom styles for framework output if needed
      printWindow.document.write("<style>");
      printWindow.document.write(`
            body { font-family: 'Amiri', serif; direction: rtl; text-align: right; margin: 20px; }
            h1, h2, h3, h4, h5 { font-family: 'Amiri', serif; text-align: right; }
            .framework-section { margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px dashed #eee; }
            .job-description-summary p, .job-description-summary ul, .job-description-summary h3, .job-description-summary h4 {
                text-align: right;
            }
            .activities-summary-list { list-style-type: disc; margin-right: 25px; padding-right: 0; }
            .competencies-summary-grid { display: block; } /* Remove grid layout for print */
            .competency-summary-item { border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
            .skills-list, .knowledge-list { background-color: #f7f7f7; padding: 10px; border-radius: 5px; margin-top: 10px; }
            .skills-list ul, .knowledge-list ul { list-style-type: disc; margin-right: 20px; padding-right: 0; }
            .skills-list ul li:before, .knowledge-list ul li:before { content: ''; } /* Remove custom bullet */
            .summary-conclusion { font-style: italic; color: #555; }
        `);
      printWindow.document.write("</style>");
      printWindow.document.write("</head><body>");
      printWindow.document.write('<div class="container py-4">');
      printWindow.document.write(
        curriculumData.step4.finalFramework.summaryHtml
      );
      printWindow.document.write("</div></body></html>");
      printWindow.document.close();
      printWindow.print();
    } else {
      showCustomAlert(
        "خطأ في الطباعة",
        "لا يوجد إطار عمل لطباعته. الرجاء تجميع الإطار أولاً.",
        "warning"
      );
    }
  });

  startOverBtn.addEventListener("click", () => {
    showCustomAlert(
      "تأكيد البدء من جديد",
      "هل أنت متأكد أنك تريد البدء من جديد؟ سيتم مسح كل التقدم المحفوظ.",
      "warning",
      () => {
        localStorage.removeItem("curriculumData");
        Object.assign(curriculumData, {
          // Reset to initial state
          step1: {
            specializationInfo: "",
            jobDescription: { source: "", text: "", jobRoles: [] },
          },
          step2: { selectedActivities: [] },
          step3: { selectedCompetencies: [] },
          step4: { finalFramework: {} },
        });
        showStep(1); // Go back to the first step
        showCustomAlert(
          "نجاح",
          "تم مسح التقدم بنجاح! يمكنك البدء من جديد.",
          "success"
        );
        // Hide step 4 specific buttons
        downloadFrameworkBtn.style.display = "none";
        printFrameworkBtn.style.display = "none";
        startOverBtn.style.display = "none";
        progressWrapper.style.display = "none"; // Hide progress bar
      },
      true
    );
  });

  step4PrevBtn.addEventListener("click", () => showStep(3));

  // Initial load and display
  // Determine the last active step with valid data to load the user back into their progress
  let lastActiveStep = 1;
  if (
    curriculumData.step4.finalFramework &&
    Object.keys(curriculumData.step4.finalFramework).length > 0
  ) {
    lastActiveStep = 4;
  } else if (
    curriculumData.step3.selectedCompetencies &&
    curriculumData.step3.selectedCompetencies.length > 0
  ) {
    lastActiveStep = 3;
  } else if (
    curriculumData.step2.selectedActivities &&
    curriculumData.step2.selectedActivities.length > 0
  ) {
    lastActiveStep = 2;
  }

  // If data is loaded, show the progress bar. Otherwise, keep it hidden until step 1 is engaged.
  if (
    lastActiveStep > 1 ||
    (lastActiveStep === 1 && curriculumData.step1.specializationInfo)
  ) {
    progressWrapper.style.display = "block";
  } else {
    progressWrapper.style.display = "none";
  }

  showStep(lastActiveStep);

  console.log("تم تهيئة مصمم إطار المناهج بالذكاء الاصطناعي");
  console.log("الإصدار: 2.0.0"); // Updated version number
  console.log("جاهز للاستخدام!");
});
