console.log("curriculum_builder.js loaded");

// Global variable for temporary storage
let curriculumData = {
  step1: {},
  step2: {},
  step3: {},
  step4: {}
};

// Helper function to show loading state on a button
function showButtonLoading(button) {
  if (button) {
    button.disabled = true;
    const loader = button.querySelector('.loader');
    if (loader) {
      loader.style.display = 'inline-block';
    }
  }
}

// Helper function to hide loading state on a button
function hideButtonLoading(button) {
  if (button) {
    button.disabled = false;
    const loader = button.querySelector('.loader');
    if (loader) {
      loader.style.display = 'none';
    }
  }
}


function showStep(stepNumber) {
  // Hide all step sections
  document.querySelectorAll('.step-section').forEach(section => {
    section.style.display = 'none';
  });

  // Show the target step section
  const targetStep = document.getElementById('step' + stepNumber);
  if (targetStep) {
    targetStep.style.display = 'block';
  } else {
    console.error('Error: Step ' + stepNumber + ' not found.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showStep(1); // Initially show Step 1

  // Check if AIAPIHandler from api.js is available
  if (typeof AIAPIHandler === 'undefined' || !window.aiHandler) {
    console.error('AIAPIHandler is not loaded or aiHandler instance is not ready! Make sure api.js is included and initialized before curriculum_builder.js');
    // Optionally, display an error message to the user on the page
    alert("Error: Core AI functionalities are not loaded. Please refresh the page or contact support.");
    return; // Stop further execution if AI handler is not ready
  } else {
    console.log('AIAPIHandler and aiHandler instance are available.');
  }

  // DOM Elements for Step 1
  const specializationInfoEl = document.getElementById('specializationInfo');
  const generateJobDescriptionBtn = document.getElementById('generateJobDescriptionBtn');
  const jobDescriptionOutputEl = document.getElementById('jobDescriptionOutput');
  const step1NextBtn = document.getElementById('step1NextBtn');
  const choiceGeminiRadio = document.getElementById('choiceGemini');
  // const choiceUserRadio = document.getElementById('choiceUser'); // Not directly used in logic here but good to have if needed
  
  // DOM Elements for Step 2
  const jobDescriptionDisplayStep2El = document.getElementById('jobDescriptionDisplayStep2');
  const generateActivitiesBtn = document.getElementById('generateActivitiesBtn');
  const activitiesListContainerEl = document.getElementById('activitiesListContainer');
  const customActivityInputEl = document.getElementById('customActivityInput');
  const addCustomActivityBtn = document.getElementById('addCustomActivityBtn');
  const step2NextBtn = document.getElementById('step2NextBtn');
  const step2PrevBtn = document.getElementById('step2PrevBtn');


  // Event Listener for "Generate Job Description" Button
  if (generateJobDescriptionBtn) {
    generateJobDescriptionBtn.addEventListener('click', () => {
      const specializationText = specializationInfoEl.value.trim();
      if (!specializationText) {
        alert("يرجى إدخال معلومات عن التخصص أولاً.");
        return;
      }

      showButtonLoading(generateJobDescriptionBtn);
      jobDescriptionOutputEl.value = "جاري إنشاء وصف الوظيفة..."; // Placeholder while loading

      const prompt = `Based on the following information about an electronics specialization (Analog and Manufacturing): "${specializationText}", please generate a detailed and well-formatted job description suitable for the Egyptian market. The description should be easy for an average user to read and understand. Provide the job description only, without any introductory or concluding remarks.`;
      
      window.aiHandler.callGeminiAPI(prompt)
        .then(response => {
          // Assuming response is plain text. If it's Markdown, we can use formatResponse.
          // For a textarea, raw text is often fine.
          jobDescriptionOutputEl.value = response; 
          if(choiceGeminiRadio) choiceGeminiRadio.checked = true; 
        })
        .catch(error => {
          console.error("Error generating job description:", error);
          jobDescriptionOutputEl.value = "خطأ: لم يتمكن من إنشاء وصف الوظيفة. " + error.message;
          // Consider showing a more user-friendly error using a shared error display mechanism if available from api.js
          if(window.aiHandler && window.aiHandler.showError) {
            // window.aiHandler.showError("خطأ في إنشاء وصف الوظيفة: " + error.message); // This would use the main page's error display
          }
        })
        .finally(() => {
          hideButtonLoading(generateJobDescriptionBtn);
        });
    });
  }

  // Event Listener for "Next" Button (Step 1)
  if (step1NextBtn) {
    step1NextBtn.addEventListener('click', () => {
      const descriptionText = jobDescriptionOutputEl.value.trim();
      const selectedChoice = document.querySelector('input[name="descriptionChoice"]:checked');

      if (!descriptionText) {
        alert("يرجى إنشاء أو إدخال وصف للوظيفة للمتابعة.");
        return;
      }
      if (!selectedChoice) {
        alert("يرجى اختيار مصدر وصف الوظيفة."); // Should not happen if one is checked by default
        return;
      }

      curriculumData.step1.jobDescriptionText = descriptionText; // Corrected field name
      curriculumData.step1.descriptionSource = selectedChoice.value; // Corrected field name
      curriculumData.step1.specializationInfo = specializationInfoEl.value.trim(); 
      
      console.log("Step 1 Data Saved:", curriculumData.step1);
      // Populate job description in step 2 when moving from step 1
      if(jobDescriptionDisplayStep2El) {
        jobDescriptionDisplayStep2El.value = curriculumData.step1.jobDescriptionText || "No description provided from Step 1.";
      }
      showStep(2);
    });
  }

  // --- Step 2 Logic ---

  // Function to add an activity to the list
  function addActivityToList(activityText, source = "ai", isChecked = true) {
    if (!activityText.trim()) return;

    // Clear placeholder if it's the first activity
    if (activitiesListContainerEl.querySelector('p.text-muted')) {
        activitiesListContainerEl.innerHTML = '';
    }

    const activityId = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const listItem = document.createElement('div');
    listItem.className = 'list-group-item d-flex align-items-center';
    listItem.setAttribute('data-source', source);

    const checkbox = document.createElement('input');
    checkbox.className = 'form-check-input me-2';
    checkbox.type = 'checkbox';
    checkbox.value = activityText;
    checkbox.id = activityId;
    checkbox.checked = isChecked;

    const label = document.createElement('label');
    label.className = 'form-check-label flex-grow-1'; // Allow label to take space
    label.setAttribute('for', activityId);
    label.textContent = activityText;
    
    // Optional: Add a small delete button for custom entries or all entries
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-outline-danger bi bi-trash ms-2';
    deleteBtn.onclick = () => listItem.remove();
    
    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(deleteBtn); // Add delete button
    activitiesListContainerEl.appendChild(listItem);
  }

  // Event Listener for "Generate Main Activities" Button
  if (generateActivitiesBtn) {
    generateActivitiesBtn.addEventListener('click', () => {
      const jobDesc = curriculumData.step1.jobDescriptionText;
      if (!jobDesc) {
        alert("يرجى التأكد من وجود وصف وظيفي من الخطوة 1.");
        return;
      }

      showButtonLoading(generateActivitiesBtn);
      activitiesListContainerEl.innerHTML = '<p class="text-muted">جاري إنشاء قائمة الأنشطة...</p>';

      const prompt = `Based on the following job description: "${jobDesc}", please generate a list of at least 15 main work activities or tasks. These activities should be relevant to the Egyptian electronics curriculum context. Please provide the list as a clear, plain text, newline-separated list. For example: 
Activity 1
Activity 2
Activity 3`;

      window.aiHandler.callGeminiAPI(prompt)
        .then(response => {
          activitiesListContainerEl.innerHTML = ''; // Clear loading message
          const activities = response.split('\n').map(activity => activity.trim()).filter(activity => activity);
          if (activities.length === 0) {
            activitiesListContainerEl.innerHTML = '<p class="text-danger">لم يتمكن الذكاء الاصطناعي من إنشاء قائمة الأنشطة. حاول مرة أخرى أو قم بإضافتها يدويًا.</p>';
          } else {
            activities.forEach(activity => addActivityToList(activity, "ai", true)); // AI activities checked by default
          }
        })
        .catch(error => {
          console.error("Error generating activities:", error);
          activitiesListContainerEl.innerHTML = `<p class="text-danger">خطأ في إنشاء الأنشطة: ${error.message}</p>`;
        })
        .finally(() => {
          hideButtonLoading(generateActivitiesBtn);
        });
    });
  }

  // Event Listener for "Add Custom Activity" Button
  if (addCustomActivityBtn) {
    addCustomActivityBtn.addEventListener('click', () => {
      const customActivityText = customActivityInputEl.value.trim();
      if (customActivityText) {
        addActivityToList(customActivityText, "user", true); // Custom activities checked by default
        customActivityInputEl.value = ''; // Clear input
      } else {
        alert("يرجى كتابة نص النشاط المخصص.");
      }
    });
  }
  
  // Allow adding custom activity by pressing Enter in the input field
  if(customActivityInputEl) {
    customActivityInputEl.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission if it's part of a form
            addCustomActivityBtn.click();
        }
    });
  }


  // Event Listener for "Next" Button (Step 2)
  if (step2NextBtn) {
    step2NextBtn.addEventListener('click', () => {
      curriculumData.step2.activities = [];
      const selectedActivities = activitiesListContainerEl.querySelectorAll('input[type="checkbox"]:checked');
      
      selectedActivities.forEach(checkbox => {
        const listItem = checkbox.closest('.list-group-item');
        curriculumData.step2.activities.push({
          text: checkbox.value,
          source: listItem.getAttribute('data-source') || 'unknown', // Fallback for source
          selected: true 
        });
      });

      if (curriculumData.step2.activities.length === 0) {
        alert("يرجى تحديد أو إضافة نشاط واحد على الأقل للمتابعة.");
        return;
      }

      console.log("Step 2 Data Saved:", curriculumData.step2);
      // Populate data for Step 3 if needed before showing
      showStep(3);
    });
  }

  // Event Listener for "Previous" Button (Step 2)
  if (step2PrevBtn) {
    step2PrevBtn.addEventListener('click', () => {
      showStep(1);
    });
  }

});
