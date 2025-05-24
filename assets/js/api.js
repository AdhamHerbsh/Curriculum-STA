class AIAPIHandler {
  constructor() {
    // Form elements
    this.form = document.querySelector(".php-email-form");
    this.textarea = document.querySelector('textarea[name="message"]');
    this.resetButton = document.querySelector('button[type="reset"]');
    this.deepSeekButton = document.querySelector(".btn-primary");
    this.geminiButton = document.querySelector(".btn-secondary");
    this.errorMessage = document.querySelector(".error-message");
    this.successMessage = document.querySelector(".sent-message");
    this.deepSeekOutput = document.getElementById("deepseek-response");
    this.geminiOutput = document.getElementById("gemini-response");

    // History elements
    this.saveCurrentBtn = document.getElementById("save-current-btn");
    this.historyList = document.getElementById("history-list");
    this.historyCount = document.getElementById("history-count");
    this.lastUpdate = document.getElementById("last-update");
    this.historySearch = document.getElementById("history-search");
    this.sortNewestBtn = document.getElementById("sort-newest");
    this.sortOldestBtn = document.getElementById("sort-oldest");
    this.exportJsonBtn = document.getElementById("export-json");
    this.exportTextBtn = document.getElementById("export-text");
    this.exportExcelBtn = document.getElementById("export-excel"); // Added for clarity
    this.clearHistoryBtn = document.getElementById("clear-history");
    this.deepSeekStatus = document.getElementById("deepseek-status");
    this.geminiStatus = document.getElementById("gemini-status");

    // Gemini API Key Elements
    this.geminiApiKeyInput = document.getElementById("gemini-api-key-input");
    this.saveGeminiApiKeyBtn = document.getElementById(
      "save-gemini-api-key-btn"
    );
    this.clearGeminiApiKeyBtn = document.getElementById(
      "clear-gemini-api-key-btn"
    );
    this.geminiApiKeyStatus = document.getElementById("gemini-api-key-status");
    this.toggleGeminiApiKeyVisibilityBtn = document.getElementById(
      "toggle-gemini-api-key-visibility"
    );

    // New Buttons for Job Analysis and Activities
    this.generateJobAnalysisBtn = document.getElementById("generate-job-analysis-btn");
    this.generateActivitiesBtn = document.getElementById("generate-activities-btn");


    // API Configuration
    this.config = {
      deepSeek: {
        url: "https://api.deepseek.com/v1/chat/completions",
        // IMPORTANT: Replace with your actual DeepSeek API key.
        // For production, never expose API keys on the client-side!
        apiKey: "YOUR_DEEPSEEK_API_KEY_HERE",
      },
      gemini: {
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        // IMPORTANT: Replace with your actual Gemini API key.
        // For production, never expose API keys on the client-side!
        apiKey: "AIzaSyA8mpF39fAgbuQCLWzOjJ6Ute2O0ZOPPkU",
      },
    };

    // History data
    this.history = this.loadHistory();
    this.filteredHistory = [...this.history];
    this.currentRequest = null;
    this.currentResponses = { deepseek: null, gemini: null, jobAnalysis: null, activities: null };

    this.init();
  }

  init() {
    this.loadGeminiApiKey(); // Load Gemini API key on init
    this.setupEventListeners();
    this.hideMessages();
    this.clearOutputs();
    this.renderHistory();
    this.updateHistoryStats();
    this.updateStatusIndicators(); // Reset all statuses on load
  }

  loadGeminiApiKey() {
    const savedKey = localStorage.getItem("geminiApiKey");
    if (savedKey) {
      this.config.gemini.apiKey = savedKey;
      if (this.geminiApiKeyStatus) { // Check if element exists
        this.geminiApiKeyStatus.textContent = "مفتاح Gemini API مُعَدّ.";
        setTimeout(() => {
          if (this.geminiApiKeyStatus) this.geminiApiKeyStatus.textContent = "";
        }, 3000);
      }
      // Optionally, you could update the input field, but it's type="password"
      // this.geminiApiKeyInput.value = savedKey; // Or show '********'
    } else {
       if (this.geminiApiKeyStatus) {
        this.geminiApiKeyStatus.textContent = "مفتاح Gemini API غير مُعَدّ.";
         setTimeout(() => {
          if (this.geminiApiKeyStatus) this.geminiApiKeyStatus.textContent = "";
        }, 3000);
       }
    }
  }

  setupEventListeners() {
    // Prevent default form submission
    this.form.addEventListener("submit", (e) => e.preventDefault());

    // Reset button functionality
    this.resetButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.clearAll();
    });

    // DeepSeek button
    this.deepSeekButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleAPICall("deepseek", "Curriculum Review");
    });

    // Gemini button
    this.geminiButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleAPICall("gemini", "Curriculum Review");
    });

    // Event listeners for new Job Analysis and Activities buttons
    if (this.generateJobAnalysisBtn) {
        this.generateJobAnalysisBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.handleAPICall("gemini", "Job Analysis");
        });
    }

    if (this.generateActivitiesBtn) {
        this.generateActivitiesBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.handleAPICall("gemini", "Activities");
        });
    }
    
    // History event listeners
    this.saveCurrentBtn.addEventListener("click", () =>
      this.saveCurrentToHistory()
    );
    this.historySearch.addEventListener("input", (e) =>
      this.searchHistory(e.target.value)
    );
    this.sortNewestBtn.addEventListener("click", () =>
      this.sortHistory("newest")
    );
    this.sortOldestBtn.addEventListener("click", () =>
      this.sortHistory("oldest")
    );
    this.exportJsonBtn.addEventListener("click", () =>
      this.exportHistory("json")
    );
    this.exportTextBtn.addEventListener("click", () =>
      this.exportHistory("text")
    );
    // Ensure export Excel button is explicitly handled if it exists
    if (this.exportExcelBtn) {
      this.exportExcelBtn.addEventListener("click", () =>
        this.exportHistory("excel")
      );
    }
    this.clearHistoryBtn.addEventListener("click", () =>
      this.clearHistoryConfirm()
    );

    // Auto-save current request from textarea input
    this.textarea.addEventListener("input", () => {
      this.currentRequest = this.textarea.value.trim();
    });

    // Gemini API Key Management Event Listeners
    if (this.saveGeminiApiKeyBtn) {
      this.saveGeminiApiKeyBtn.addEventListener("click", () => {
        const apiKey = this.geminiApiKeyInput.value.trim();
        if (apiKey) {
          localStorage.setItem("geminiApiKey", apiKey);
          this.config.gemini.apiKey = apiKey; // Update runtime config
          this.geminiApiKeyInput.value = ""; // Clear input for security
          this.showTemporaryStatus(
            this.geminiApiKeyStatus,
            "تم حفظ مفتاح Gemini API بنجاح!"
          );
        } else {
          this.showTemporaryStatus(
            this.geminiApiKeyStatus,
            "يرجى إدخال مفتاح API.",
            true
          );
        }
      });
    }

    if (this.clearGeminiApiKeyBtn) {
      this.clearGeminiApiKeyBtn.addEventListener("click", () => {
        localStorage.removeItem("geminiApiKey");
        this.config.gemini.apiKey = "AIzaSyA8mpF39fAgbuQCLWzOjJ6Ute2O0ZOPPkU"; // Reset to placeholder or empty
        this.geminiApiKeyInput.value = "";
        this.showTemporaryStatus(
          this.geminiApiKeyStatus,
          "تم مسح مفتاح Gemini API."
        );
      });
    }

    if (this.toggleGeminiApiKeyVisibilityBtn) {
      this.toggleGeminiApiKeyVisibilityBtn.addEventListener("click", () => {
        const icon = this.toggleGeminiApiKeyVisibilityBtn.querySelector("i");
        if (this.geminiApiKeyInput.type === "password") {
          this.geminiApiKeyInput.type = "text";
          if (icon) icon.classList.replace("bi-eye", "bi-eye-slash");
        } else {
          this.geminiApiKeyInput.type = "password";
          if (icon) icon.classList.replace("bi-eye-slash", "bi-eye");
        }
      });
    }
  }

  showTemporaryStatus(element, message, isError = false) {
    if (!element) return;
    element.textContent = message;
    element.style.color = isError ? "red" : "green";
    setTimeout(() => {
      element.textContent = "";
      element.style.color = ""; // Reset color
    }, 3000);
  }

  async handleAPICall(provider, queryType = "Curriculum Review") {
    const rawInput = this.textarea.value; // This is the general curriculum description
    let sanitizedInput = ValidationHelper.sanitizeInput(rawInput);
    
    // For Job Analysis and Activities, the main input might be less critical or predefined
    // For Curriculum Review, it's essential.
    if (queryType === "Curriculum Review") {
        const validation = ValidationHelper.validateInput(sanitizedInput);
        if (!validation.valid) {
          this.showError(validation.message);
          return;
        }
        // Update textarea with sanitized input if it changed
        if (rawInput !== sanitizedInput) {
          this.textarea.value = sanitizedInput;
        }
    } else {
        // For other types, we might not need input from the textarea or use a default.
        // If sanitizedInput is empty, we can pass a generic placeholder or specific context.
        if (!sanitizedInput && (queryType === "Job Analysis" || queryType === "Activities")) {
            sanitizedInput = "منهج الإلكترونيات المصري"; // Default context if textarea is empty
        }
    }


    // Store current request (might need adjustment based on queryType for history)
    this.currentRequest = sanitizedInput; // Or a more specific request string based on queryType

    // For new query types, force Gemini if DeepSeek is selected.
    if ((queryType === "Job Analysis" || queryType === "Activities") && provider === "deepseek") {
        console.warn(`DeepSeek is not supported for "${queryType}". Switching to Gemini.`);
        provider = "gemini"; 
        // Optionally, disable the DeepSeek button for these types in UI (handled in main.js)
    }
    
    try {
      this.showLoading(provider, queryType); // Pass queryType to showLoading
      this.hideMessages();
      this.updateStatusIndicators(provider, "pending", queryType);

      const response = await this.callAPI(provider, sanitizedInput, queryType);
      this.displayResponse(provider, response, queryType);
      
      // Store responses
      if (queryType === "Curriculum Review") {
        this.currentResponses[provider] = response;
      } else if (queryType === "Job Analysis") {
        // Storing separately for clarity, though Gemini is the only provider for now
        this.currentResponses.jobAnalysis = { [provider]: response }; 
      } else if (queryType === "Activities") {
        this.currentResponses.activities = { [provider]: response };
      } else {
         // Default to current provider if queryType is unknown, or handle as error
        this.currentResponses[provider] = response;
      }


      this.showSuccess(
        `تم توليد "${queryType}" بنجاح من ${provider.toUpperCase()}`
      );
      this.updateStatusIndicators(provider, "success", queryType);
    } catch (error) {
      console.error(`${provider} API Error for ${queryType}:`, error);
      this.showError(
        `حدث خطأ في الاتصال بـ ${provider.toUpperCase()} لـ "${queryType}": ${error.message}`
      );
      this.updateStatusIndicators(provider, "error", queryType);
    } finally {
      this.hideLoading(provider, queryType); // Pass queryType to hideLoading
    }
  }

  async callAPI(provider, input, queryType) {
    const prompt = this.buildPrompt(input, queryType);

    // If new types and provider is DeepSeek, we can prevent the call here too.
    if ((queryType === "Job Analysis" || queryType === "Activities") && provider === "deepseek") {
        // This case should ideally be handled in handleAPICall by switching provider to Gemini.
        // If it still reaches here, it means DeepSeek was forced for a new type.
        console.warn(`Skipping DeepSeek call for ${queryType} as it's handled by Gemini.`);
        return Promise.resolve("تم توجيه هذا الطلب إلى Gemini."); // Or throw error
    }

    switch (provider) {
      case "deepseek": // Only for Curriculum Review now
        if (queryType !== "Curriculum Review") {
            return Promise.reject(new Error("DeepSeek is only for Curriculum Review."));
        }
        return await this.callDeepSeekAPI(prompt);
      case "gemini":
        return await this.callGeminiAPI(prompt); // Gemini handles all types or new types
      default:
        throw new Error(`Unknown API provider: ${provider}`);
    }
  }

  buildPrompt(input, queryType = "Curriculum Review") {
    let prompt = "";
    const jobTitles = ["عنوان الوظيفة 1", "عنوان الوظيفة 2", "عنوان الوظيفة 3", "عنوان الوظيفة 4", "عنوان الوظيفة 5"];
    const context = input || "منهج الإلكترونيات في مصر"; // Use input if available, else default

    switch (queryType) {
      case "Job Analysis":
        prompt = `في سياق ${context}, يرجى تقديم وصف تفصيلي لكل من الوظائف الخمس التالية:
${jobTitles.map((title, index) => `${index + 1}. ${title}`).join("\n")}

لكل وظيفة، يرجى توضيح:
- طبيعة العمل والمسؤوليات الأساسية.
- المهارات والمعرفة المطلوبة.
- بيئة العمل النموذجية.

الرجاء تقديم الإجابة باللغة العربية وبأسلوب منظم وواضح لكل وظيفة على حدة.`;
        break;
      case "Activities":
        prompt = `بناءً على ${context} والوظائف المحتملة مثل (${jobTitles.join(", ")}), يرجى اقتراح وتوصيف ما لا يقل عن 18 نشاطًا تدريبيًا عمليًا وتطبيقيًا. 
هذه الأنشطة يجب أن تكون مصممة لطلاب يدرسون منهج الإلكترونيات وتهدف إلى إعدادهم لسوق العمل في المجالات ذات الصلة.

لكل نشاط، يرجى ذكر:
- اسم النشاط.
- وصف موجز للنشاط والغرض منه.
- المهارات التي يساعد النشاط على تطويرها.

الرجاء تقديم القائمة باللغة العربية في شكل نقاط مرقمة أو قائمة واضحة.`;
        break;
      case "Curriculum Review":
      default:
        prompt = `بناءً على المعلومات التالية عن التخصص (${context})، يرجى كتابة وصف شامل ومفصل للمهنة يتضمن:
1. طبيعة العمل والمهام الأساسية
2. المهارات المطلوبة
3. بيئة العمل
4. الفرص الوظيفية
5. التطور المهني المتوقع

معلومات التخصص:
${input} 

يرجى الكتابة باللغة العربية بأسلوب أكاديمي مهني.`;
        break;
    }
    return prompt;
  }

  async callDeepSeekAPI(prompt) { // This should now only be called for "Curriculum Review"
    const response = await fetch(this.config.deepSeek.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.deepSeek.apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "أنت خبير في التطوير المهني وتصميم المناهج التعليمية. مهمتك هي كتابة أوصاف مهنية شاملة ودقيقة باللغة العربية.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(
        `HTTP ${response.status}: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response format from DeepSeek API");
    }

    return data.choices[0].message.content;
  }

  async callGeminiAPI(prompt) {
    const apiKey = localStorage.getItem("geminiApiKey");
    const placeholderKey = "AIzaSyA8mpF39fAgbuQCLWzOjJ6Ute2O0ZOPPkU"; // Original placeholder

    if (!apiKey || apiKey === placeholderKey || apiKey.trim() === "") {
      this.showError(
        "خطأ: مفتاح Gemini API غير موجود أو غير صالح. يرجى إعداده في منطقة التكوين أسفل الصفحة."
      );
      return Promise.reject(
        new Error("Gemini API Key missing or invalid.")
      );
    }

    const url = `${this.config.gemini.url}?key=${apiKey}`;

    const response = await fetch(url, {
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
          maxOutputTokens: 2048, // Increased max tokens for potentially longer lists/descriptions
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: { message: response.statusText } }));
      throw new Error(
        `HTTP ${response.status}: ${
          errorData.error?.message || response.statusText
        }`
      );
    }

    const data = await response.json();

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      !data.candidates[0].content.parts[0]
    ) {
      throw new Error("Invalid response format from Gemini API");
    }

    return data.candidates[0].content.parts[0].text;
  }

  displayResponse(provider, response, queryType = "Curriculum Review") {
    const formattedResponse = this.formatResponse(response);

    // TODO: In a future step, create dedicated output elements for Job Analysis and Activities in index.html
    // The actual display in their specific HTML sections will be handled by new functions.
    
    if (queryType === "Job Analysis") {
      this.parseAndDisplayJobAnalysis(response); // Pass raw response
    } else if (queryType === "Activities") {
      this.parseAndDisplayActivities(response); // Pass raw response
    } else { // Curriculum Review
      if (provider === "deepseek") {
        this.deepSeekOutput.innerHTML = formattedResponse; // formattedResponse is fine here
      } else if (provider === "gemini") {
        this.geminiOutput.innerHTML = formattedResponse; // formattedResponse is fine here
      }
    }
  }

  parseAndDisplayJobAnalysis(rawResponse) {
    try {
      // Attempt to split by lines that start with a number and a dot (e.g., "1.", "2.")
      // This is a common way Gemini might structure lists.
      const jobSections = rawResponse.split(/\n(?=\d+\.\s)/).map(s => s.trim()).filter(s => s);

      if (jobSections.length === 0 && rawResponse.includes("عنوان الوظيفة")) {
          // Fallback: try splitting by "عنوان الوظيفة" if the numbered list fails
          // This is less robust as the title itself contains this phrase.
          // A better approach would be to look for markdown headers if that's expected.
          // For now, this is a simple fallback.
          const keyword = "عنوان الوظيفة";
          let parts = rawResponse.split(new RegExp(`(?=${keyword}\\s*\\d+)`, 'g'));
          if (parts.length > 1) {
              jobSections.length = 0; // Clear previous attempt
              for(let i=0; i < parts.length; i++) {
                  if (parts[i].trim().startsWith(keyword)) {
                      jobSections.push(parts[i] + (parts[i+1] || ""));
                      i++; // skip next part as it's consumed
                  } else if (jobSections.length > 0) { // Append to previous if not starting with keyword
                      jobSections[jobSections.length-1] += parts[i];
                  }
              }
          }
      }
      
      // Clear previous job analysis content
      for (let i = 1; i <= 5; i++) {
        const titleEl = document.getElementById(`job-title-${i}`);
        const descEl = document.getElementById(`job-desc-${i}`);
        if (titleEl) titleEl.textContent = `عنوان الوظيفة ${i}`;
        if (descEl) descEl.innerHTML = `وصف موجز للوظيفة ${i} يوضح طبيعتها والمهام الرئيسية. هذا النص هو مثال مؤقت.`;
      }

      if (jobSections.length < 1) {
        document.getElementById('job-desc-1').innerHTML = '<em class="card-error-message">تعذر تحليل استجابة تحليل الوظائف. الرجاء المحاولة مرة أخرى أو التحقق من تنسيق الاستجابة.</em>';
        return;
      }

      jobSections.slice(0, 5).forEach((section, index) => {
        const titleEl = document.getElementById(`job-title-${index + 1}`);
        const descEl = document.getElementById(`job-desc-${index + 1}`);

        if (titleEl && descEl) {
          // Extract title (first line, remove number if present)
          let lines = section.split('\n');
          let title = lines[0].replace(/^\d+\.\s*/, '').trim();
          
          // The rest is description
          let description = lines.slice(1).join('\n').trim();

          if (!description && lines.length > 1 && !lines[1].match(/^\d+\.\s*/)) {
             // If description is empty, maybe the title took more than one line or formatting is different.
             // Try to find a natural break or assume first line is title and rest is desc.
             // This part might need more sophisticated title vs description separation logic
             // based on actual API output format.
          }
          
          titleEl.textContent = title || `عنوان الوظيفة ${index + 1}`; // Fallback title
          descEl.innerHTML = this.formatResponse(description) || '<em class="text-muted">لا يوجد وصف متوفر.</em>';
        }
      });
    } catch (error) {
      console.error("Error parsing job analysis response:", error);
      const descEl = document.getElementById('job-desc-1');
      if(descEl) descEl.innerHTML = '<em class="card-error-message">حدث خطأ أثناء معالجة بيانات تحليل الوظائف.</em>';
    }
  }

  parseAndDisplayActivities(rawResponse) {
    try {
      // Split by newlines, then filter out empty lines.
      // Also try to handle lines starting with "-" or numbers as list items.
      const activities = rawResponse.split('\n')
                                  .map(line => line.replace(/^- \s*|^\d+\.\s*/, '').trim())
                                  .filter(line => line.length > 0);
      
      // Clear previous activities content
      for (let i = 1; i <= 18; i++) {
        const activityEl = document.getElementById(`activity-text-${i}`);
        if (activityEl) activityEl.innerHTML = `النشاط المقترح ${i}`;
      }

      if (activities.length === 0) {
        document.getElementById('activity-text-1').innerHTML = '<em class="card-error-message">تعذر تحليل استجابة الأنشطة. الرجاء المحاولة مرة أخرى.</em>';
        return;
      }
      
      activities.slice(0, 18).forEach((activityText, index) => {
        const activityEl = document.getElementById(`activity-text-${index + 1}`);
        if (activityEl) {
          activityEl.innerHTML = this.formatResponse(activityText); // Use formatResponse for potential markdown in activity text
        }
      });
    } catch (error) {
      console.error("Error parsing activities response:", error);
      const activityEl = document.getElementById('activity-text-1');
      if(activityEl) activityEl.innerHTML = '<em class="card-error-message">حدث خطأ أثناء معالجة بيانات الأنشطة.</em>';
    }
  }


  formatResponse(text) {
    if (!text) return "<p><em>لا يوجد محتوى لعرضه.</em></p>";
    // Enhanced markdown to HTML conversion
    let html = text
      .replace(/^(#{1,6})\s*(.*)$/gm, (match, hashes, content) => `<h${hashes.length}>${content}</h${hashes.length}>`) // Headers
      .replace(/\n\n/g, "</p><p>") // Double newline to paragraph
      .replace(/\n/g, "<br>")       // Single newline to line break
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>")         // Italic
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>') // Links
      .replace(/^- (.*)$/gm, "<li>$1</li>"); // List items (simple)

    // Wrap list items in <ul> if not already done by more complex logic
    if (html.includes("<li>") && !html.includes("<ul>")) {
        html = html.replace(/<li>/g, "<ul><li>").replace(/<\/li>(?!<li>)/g, "</li></ul>");
    }
    
    // Ensure the whole text is wrapped in a paragraph if no other block element starts it
    if (!html.match(/^<(p|h[1-6]|ul|ol|li|blockquote|pre|hr)/)) {
      html = "<p>" + html;
    }
    if (!html.match(/<\/(p|h[1-6]|ul|ol|li|blockquote|pre|hr)>$/)) {
      html = html + "</p>";
    }
    // Correct any <p><br></p> to just <br> or empty
    html = html.replace(/<p><br><\/p>/g, "<br>");
    return html;
  }

  showLoading(provider, queryType = "Curriculum Review") {
    let button;
    switch (queryType) {
        case "Job Analysis":
            button = this.generateJobAnalysisBtn;
            break;
        case "Activities":
            button = this.generateActivitiesBtn;
            break;
        case "Curriculum Review":
        default:
            button = (provider === "deepseek") ? this.deepSeekButton : this.geminiButton;
            break;
    }

    if (!button) return; // If no button matches, exit

    // Check if the button has a loader element
    let loader = button.querySelector(".loader");
    if (!loader) { // Should ideally exist, but good to check
      loader = document.createElement("span");
      loader.className = "loader";
      button.appendChild(loader);
    }

    button.disabled = true;
    button.style.opacity = "0.7";
    loader.style.display = "inline-block";
  }

  hideLoading(provider, queryType = "Curriculum Review") {
    let button;
    switch (queryType) {
        case "Job Analysis":
            button = this.generateJobAnalysisBtn;
            break;
        case "Activities":
            button = this.generateActivitiesBtn;
            break;
        case "Curriculum Review":
        default:
            button = (provider === "deepseek") ? this.deepSeekButton : this.geminiButton;
            break;
    }
    
    if (!button) return;

    const loader = button.querySelector(".loader");
    button.disabled = false;
    button.style.opacity = "1";
    if (loader) {
      loader.style.display = "none";
      // loader.innerHTML = ""; // Not strictly necessary to clear innerHTML
    }
  }

  updateStatusIndicators(provider = null, status = null, queryType = "Curriculum Review") {
    // TODO: Add status indicators for new sections if they are separate from main gemini/deepseek indicators
    if (provider && status) {
        let indicator;
        if (queryType === "Job Analysis") {
            // Example: indicator = document.getElementById('job-analysis-status-indicator');
            indicator = this.geminiStatus; // Placeholder
        } else if (queryType === "Activities") {
            // Example: indicator = document.getElementById('activities-status-indicator');
            indicator = this.geminiStatus; // Placeholder
        } else { // Curriculum Review
            indicator = provider === "deepseek" ? this.deepSeekStatus : this.geminiStatus;
        }
        if (indicator) {
            indicator.className = `status-indicator status-${status}`;
        }
    } else {
      // Reset all indicators if no specific provider/status is given
      this.deepSeekStatus.className = "status-indicator";
      this.geminiStatus.className = "status-indicator";
      // TODO: Reset new indicators when added
      // if (document.getElementById('job-analysis-status-indicator')) document.getElementById('job-analysis-status-indicator').className = 'status-indicator';
      // if (document.getElementById('activities-status-indicator')) document.getElementById('activities-status-indicator').className = 'status-indicator';
    }
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = "block";
    this.successMessage.style.display = "none";

    setTimeout(() => this.hideMessages(), 5000);
  }

  showSuccess(message) {
    this.successMessage.textContent = message;
    this.successMessage.style.display = "block";
    this.errorMessage.style.display = "none";

    setTimeout(() => this.hideMessages(), 3000);
  }

  hideMessages() {
    this.errorMessage.style.display = "none";
    this.successMessage.style.display = "none";
  }

  clearAll() {
    this.textarea.value = "";
    this.clearOutputs();
    this.currentRequest = null;
    this.currentResponses = { deepseek: null, gemini: null };
    this.hideMessages();
    this.updateStatusIndicators(); // Reset all statuses
    this.showSuccess("تم مسح جميع المحتويات بنجاح");
  }

  clearOutputs() {
    this.deepSeekOutput.innerHTML =
      '<em style="color: #666;">سيظهر وصف المهنة هنا بعد الضغط على زر التوليد...</em>';
    this.geminiOutput.innerHTML =
      '<em style="color: #666;">سيظهر وصف المهنة هنا بعد الضغط على زر التوليد...</em>';
    
    // Clear Job Analysis placeholders
    for (let i = 1; i <= 5; i++) {
        const titleEl = document.getElementById(`job-title-${i}`);
        const descEl = document.getElementById(`job-desc-${i}`);
        if (titleEl) titleEl.textContent = `عنوان الوظيفة ${i}`;
        if (descEl) descEl.innerHTML = `وصف موجز للوظيفة ${i} يوضح طبيعتها والمهام الرئيسية. هذا النص هو مثال مؤقت.`;
    }

    // Clear Activities placeholders
    for (let i = 1; i <= 18; i++) {
        const activityEl = document.getElementById(`activity-text-${i}`);
        if (activityEl) activityEl.innerHTML = `النشاط المقترح ${i}`;
    }
  }

  // ===== HISTORY MANAGEMENT METHODS =====

  loadHistory() {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem("aiCurriculumHistory") || "[]"
      );
      // Ensure that 'saved' is an array. If it's not (e.g., corrupted data), return an empty array.
      return Array.isArray(saved) ? saved : [];
    } catch {
      // If parsing fails (e.g., malformed JSON), return an empty array
      return [];
    }
  }

  saveHistory() {
    try {
      sessionStorage.setItem(
        "aiCurriculumHistory",
        JSON.stringify(this.history)
      );
    } catch (error) {
      console.warn("Could not save history to session storage:", error);
      this.showError("تعذر حفظ السجل في المتصفح. قد تكون المساحة ممتلئة.");
    }
  }

  saveCurrentToHistory() {
    if (
      !this.currentRequest &&
      !this.currentResponses.deepseek &&
      !this.currentResponses.gemini
    ) {
      this.showError("لا توجد بيانات حالية لحفظها في السجل.");
      return;
    }

    // Use the input from the textarea if currentRequest is null but textarea has content
    const requestToSave = this.currentRequest || this.textarea.value.trim();

    if (!requestToSave) {
      this.showError("لا توجد بيانات حالية لحفظها في السجل.");
      return;
    }

    const historyItem = {
      id: Date.now(), // Unique ID for each item
      timestamp: new Date().toISOString(), // ISO string for precise sorting
      request: requestToSave,
      responses: {
        deepseek: this.currentResponses.deepseek,
        gemini: this.currentResponses.gemini,
      },
      createdAt: new Date().toLocaleString("ar-SA", {
        // User-friendly localized date/time
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Add new item to the beginning of the history array
    this.history.unshift(historyItem);
    this.saveHistory();
    // Re-filter and re-render history to reflect changes
    this.filteredHistory = [...this.history];
    this.renderHistory();
    this.updateHistoryStats();
    this.showSuccess("تم حفظ النتيجة في السجل بنجاح");
  }

  renderHistory() {
    const container = this.historyList;

    if (this.filteredHistory.length === 0) {
      container.innerHTML = `
        <div class="no-history">
          <i class="bi bi-inbox" style="font-size: 3em; color: #dee2e6;"></i>
          <p>لا توجد طلبات محفوظة بعد</p>
          <small>ابدأ بإدخال معلومات التخصص وتوليد الوصف لإنشاء أول عنصر في السجل</small>
        </div>
      `;
      return;
    }

    container.innerHTML = this.filteredHistory
      .map((item, index) => this.createHistoryItemHTML(item, index))
      .join("");
    // this.attachHistoryEventListeners(); // Not strictly needed with onclick attributes
  }

  createHistoryItemHTML(item, index) {
    const hasDeepSeek = item.responses.deepseek;
    const hasGemini = item.responses.gemini;

    return `
      <div class="history-item" data-id="${item.id}">
        <div class="history-item-header" onclick="window.aiHandler.toggleHistoryItem(${
          item.id
        })">
          <div>
            <strong>طلب ${
              this.history.length - index
            }</strong> <div class="history-meta">
              <span><i class="bi bi-calendar3"></i> ${item.createdAt}</span>
              <span><i class="bi bi-chat-text"></i> ${item.request.substring(
                0,
                50
              )}${item.request.length > 50 ? "..." : ""}</span>
              <span>
                ${
                  hasDeepSeek
                    ? '<i class="bi bi-x-circle text-muted"></i> DeepSeek'
                    : '<i class="bi bi-check-circle-fill text-success"></i> DeepSeek'
                }
                ${
                  hasGemini
                    ? '<i class="bi bi-x-circle text-muted"></i> Gemini'
                    : '<i class="bi bi-check-circle-fill text-success"></i> Gemini'
                }
              </span>
            </div>
          </div>
          <i class="bi bi-chevron-down"></i>
        </div>
        <div class="history-item-body">
          <div class="request-text">
            <h6><i class="bi bi-question-circle"></i> النص المُدخل:</h6>
            <p>${item.request}</p>
          </div>
          <div class="response-grid">
            <div class="response-box">
              <div class="response-header deepseek-header">
                <i class="bi bi-robot"></i> DeepSeek Response
              </div>
              <div class="response-content">
                ${
                  hasDeepSeek
                    ? this.formatResponse(item.responses.deepseek)
                    : '<em class="text-muted">لم يتم توليد استجابة</em>'
                }
              </div>
            </div>
            <div class="response-box">
              <div class="response-header gemini-header">
                <i class="bi bi-stars"></i> Gemini Response
              </div>
              <div class="response-content">
                ${
                  hasGemini
                    ? this.formatResponse(item.responses.gemini)
                    : '<em class="text-muted">لم يتم توليد استجابة</em>'
                }
              </div>
            </div>
          </div>
          <div class="history-actions">
            <button class="btn btn-sm btn-outline-primary" onclick="window.aiHandler.loadHistoryItem(${
              item.id
            })">
              <i class="bi bi-arrow-up-circle"></i> تحميل
            </button>
            <button class="btn btn-sm btn-outline-success" onclick="window.aiHandler.exportSingleItem(${
              item.id
            }, 'text')">
              <i class="bi bi-file-text"></i> تصدير نص
            </button>
            <button class="btn btn-sm btn-outline-info" onclick="window.aiHandler.exportSingleItem(${
              item.id
            }, 'excel')">
              <i class="bi bi-file-earmark-excel"></i> تصدير Excel
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="window.aiHandler.deleteHistoryItem(${
              item.id
            })">
              <i class="bi bi-trash"></i> حذف
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // attachHistoryEventListeners() {
  //   // Event listeners are handled via onclick attributes for simplicity
  //   // This ensures they work even after dynamic content updates.
  //   // For complex interactions, consider delegating events or attaching after render.
  // }

  toggleHistoryItem(id) {
    const item = document.querySelector(`.history-item[data-id="${id}"]`);
    if (item) {
      item.classList.toggle("active");
      const icon = item.querySelector(".bi-chevron-down, .bi-chevron-up"); // Select either
      if (icon) {
        icon.classList.toggle("bi-chevron-down");
        icon.classList.toggle("bi-chevron-up");
      }
    }
  }

  loadHistoryItem(id) {
    const item = this.history.find((h) => h.id === id);
    if (item) {
      this.textarea.value = item.request;
      this.currentRequest = item.request; // Update currentRequest

      // Clear previous outputs before loading new ones
      this.clearOutputs();
      this.currentResponses = { deepseek: null, gemini: null }; // Reset current responses
      this.updateStatusIndicators(); // Reset status indicators

      if (item.responses.deepseek) {
        this.deepSeekOutput.innerHTML = this.formatResponse(
          item.responses.deepseek
        );
        this.currentResponses.deepseek = item.responses.deepseek;
        this.updateStatusIndicators("deepseek", "success");
      } else {
        this.updateStatusIndicators("deepseek", "error"); // Mark as error if no response
      }

      if (item.responses.gemini) {
        this.geminiOutput.innerHTML = this.formatResponse(
          item.responses.gemini
        );
        this.currentResponses.gemini = item.responses.gemini;
        this.updateStatusIndicators("gemini", "success");
      } else {
        this.updateStatusIndicators("gemini", "error"); // Mark as error if no response
      }

      this.showSuccess("تم تحميل العنصر بنجاح");

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      this.showError("العنصر المطلوب غير موجود في السجل.");
    }
  }

  deleteHistoryItem(id) {
    if (
      confirm(
        "هل أنت متأكد من حذف هذا العنصر؟\nهذا الإجراء لا يمكن التراجع عنه."
      )
    ) {
      this.history = this.history.filter((item) => item.id !== id);
      this.filteredHistory = this.filteredHistory.filter(
        (item) => item.id !== id
      ); // Also update filtered history
      this.saveHistory();
      this.renderHistory();
      this.updateHistoryStats();
      this.showSuccess("تم حذف العنصر بنجاح");
    }
  }

  searchHistory(query) {
    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) {
      this.filteredHistory = [...this.history]; // Reset to full history
    } else {
      this.filteredHistory = this.history.filter(
        (item) =>
          item.request.toLowerCase().includes(searchTerm) ||
          (item.responses.deepseek &&
            item.responses.deepseek.toLowerCase().includes(searchTerm)) ||
          (item.responses.gemini &&
            item.responses.gemini.toLowerCase().includes(searchTerm))
      );
    }
    this.renderHistory();
    this.updateHistoryStats(); // Update stats based on full history, not filtered
  }

  sortHistory(order) {
    // Sort the main history array first, then update filteredHistory
    if (order === "newest") {
      this.history.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      this.sortNewestBtn.classList.add("active");
      this.sortOldestBtn.classList.remove("active");
    } else {
      // 'oldest'
      this.history.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      this.sortOldestBtn.classList.add("active");
      this.sortNewestBtn.classList.remove("active");
    }
    // Re-apply current search query to sorted history
    this.searchHistory(this.historySearch.value);
    // this.renderHistory(); // searchHistory will call renderHistory
  }

  updateHistoryStats() {
    this.historyCount.textContent = this.history.length;
    if (this.history.length > 0) {
      const lastItem = this.history[0]; // Assuming history is sorted newest first
      this.lastUpdate.textContent = lastItem.createdAt;
    } else {
      this.lastUpdate.textContent = "-";
    }
  }

  clearHistoryConfirm() {
    if (
      confirm(
        "هل أنت متأكد من حذف جميع العناصر في السجل؟\nهذا الإجراء لا يمكن التراجع عنه."
      )
    ) {
      this.history = [];
      this.filteredHistory = [];
      this.saveHistory();
      this.renderHistory();
      this.updateHistoryStats();
      this.showSuccess("تم مسح السجل بالكامل");
    }
  }

  // ===== EXPORT METHODS =====

  exportHistory(format) {
    if (this.history.length === 0) {
      this.showError("لا توجد بيانات للتصدير");
      return;
    }

    switch (format) {
      case "json":
        this.exportAsJSON();
        break;
      case "text":
        this.exportAsText();
        break;
      case "excel":
        this.exportAsExcel();
        break;
      default:
        this.showError("صيغة التصدير غير مدعومة.");
    }
  }

  exportAsJSON() {
    const data = {
      exported_at: new Date().toISOString(),
      total_items: this.history.length,
      items: this.history,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    this.downloadFile(
      blob,
      `ai_curriculum_history_${this.getCurrentTimestamp()}.json`
    );
    this.showSuccess("تم تصدير السجل كملف JSON");
  }

  exportAsText() {
    let content = `سجل طلبات تصميم إطار المناهج بالذكاء الاصطناعي\n`;
    content += `تاريخ التصدير: ${new Date().toLocaleString("ar-SA")}\n`;
    content += `عدد العناصر: ${this.history.length}\n`;
    content += `${"=".repeat(80)}\n\n`;

    this.history.forEach((item, index) => {
      content += `${index + 1}. طلب رقم ${item.id}\n`;
      content += `التاريخ: ${item.createdAt}\n`;
      content += `النص المُدخل:\n${item.request}\n\n`;

      if (item.responses.deepseek) {
        content += `استجابة DeepSeek:\n${this.stripHTML(
          item.responses.deepseek
        )}\n\n`;
      }

      if (item.responses.gemini) {
        content += `استجابة Gemini:\n${this.stripHTML(
          item.responses.gemini
        )}\n\n`;
      }

      content += `${"-".repeat(60)}\n\n`;
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    this.downloadFile(
      blob,
      `ai_curriculum_history_${this.getCurrentTimestamp()}.txt`
    );
    this.showSuccess("تم تصدير السجل كملف نصي");
  }

  exportAsExcel() {
    // Create Excel-compatible CSV
    let csv = "\uFEFF"; // BOM for UTF-8 to ensure proper Arabic character display in Excel
    csv += "الرقم,التاريخ,النص المدخل,استجابة DeepSeek,استجابة Gemini\n";

    this.history.forEach((item, index) => {
      const row = [
        index + 1,
        item.createdAt,
        `"${this.escapeCSV(item.request)}"`,
        `"${this.escapeCSV(item.responses.deepseek || "لم يتم التوليد")}"`,
        `"${this.escapeCSV(item.responses.gemini || "لم يتم التوليد")}"`,
      ];
      csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    this.downloadFile(
      blob,
      `ai_curriculum_history_${this.getCurrentTimestamp()}.csv`
    );
    this.showSuccess("تم تصدير السجل كملف Excel");
  }

  exportSingleItem(id, format) {
    const item = this.history.find((h) => h.id === id);
    if (!item) {
      this.showError("العنصر المطلوب للتصدير غير موجود.");
      return;
    }

    const fileNameId = item.id; // Use item ID for single export filename

    if (format === "text") {
      let content = `طلب رقم ${item.id}\n`;
      content += `التاريخ: ${item.createdAt}\n`;
      content += `${"=".repeat(50)}\n\n`;
      content += `النص المُدخل:\n${item.request}\n\n`;

      if (item.responses.deepseek) {
        content += `استجابة DeepSeek:\n${this.stripHTML(
          item.responses.deepseek
        )}\n\n`;
      }

      if (item.responses.gemini) {
        content += `استجابة Gemini:\n${this.stripHTML(
          item.responses.gemini
        )}\n\n`;
      }

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      this.downloadFile(blob, `ai_request_${fileNameId}.txt`);
    } else if (format === "excel") {
      let csv = "\uFEFF"; // BOM for UTF-8
      csv += "الحقل,المحتوى\n";
      csv += `"رقم الطلب","${item.id}"\n`;
      csv += `"التاريخ","${item.createdAt}"\n`;
      csv += `"النص المدخل","${this.escapeCSV(item.request)}"\n`;
      csv += `"استجابة DeepSeek","${this.escapeCSV(
        item.responses.deepseek || "لم يتم التوليد"
      )}"\n`;
      csv += `"استجابة Gemini","${this.escapeCSV(
        item.responses.gemini || "لم يتم التوليد"
      )}"\n`;

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      this.downloadFile(blob, `ai_request_${fileNameId}.csv`);
    } else {
      this.showError("صيغة التصدير غير مدعومة لهذا العنصر.");
      return; // Don't show success if format is not supported
    }

    this.showSuccess("تم تصدير العنصر بنجاح");
  }

  // ===== UTILITY METHODS =====

  downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
  }

  getCurrentTimestamp() {
    return new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:-]/g, "")
      .replace("T", "_");
  }

  stripHTML(html) {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  escapeCSV(text) {
    if (!text) return "";
    // Escape double quotes by doubling them, then wrap the entire field in double quotes
    return this.stripHTML(text).replace(/"/g, '""');
  }

  // Utility method to update API keys (primarily for testing/dev, not production)
  updateAPIKeys(deepSeekKey, geminiKey) {
    if (deepSeekKey) this.config.deepSeek.apiKey = deepSeekKey;
    if (geminiKey) this.config.gemini.apiKey = geminiKey;
    this.showSuccess("تم تحديث مفاتيح الـ API بنجاح.");
  }
}

// Enhanced error handling and validation
class ValidationHelper {
  static validateInput(text) {
    if (!text || text.trim().length === 0) {
      return { valid: false, message: "يرجى إدخال معلومات عن التخصص أولاً." };
    }

    if (text.trim().length < 10) {
      return {
        valid: false,
        message: "يرجى إدخال معلومات أكثر تفصيلاً (على الأقل 10 أحرف).",
      };
    }

    if (text.length > 2000) {
      return {
        valid: false,
        message: "النص طويل جداً، يرجى تقليله إلى أقل من 2000 حرف.",
      };
    }

    return { valid: true };
  }

  static sanitizeInput(text) {
    // Basic sanitization: remove script tags and HTML tags
    // For robust sanitization, use a library like DOMPurify.
    if (!text) return "";
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
      .replace(/<[^>]*>/g, "") // Remove any remaining HTML tags
      .trim(); // Trim whitespace
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add custom CSS for loading animation and enhancements
  const style = document.createElement("style");
  style.textContent = `
    
    .loader {
      display: none;
      margin-left: 5px;
      vertical-align: middle; /* Align loader icon vertically */
    }

    .output p {
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .output em {
      font-style: italic;
      color: #666;
    }

    /* Status Indicators */
    .status-indicator {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-left: 5px;
        background-color: #ccc; /* Default grey */
    }

    .status-indicator.status-pending {
        background-color: #ffc107; /* Yellow for pending */
        animation: pulse 1s infinite alternate;
    }

    .status-indicator.status-success {
        background-color: #28a745; /* Green for success */
    }

    .status-indicator.status-error {
        background-color: #dc3545; /* Red for error */
    }

    @keyframes pulse {
        0% { transform: scale(0.9); opacity: 0.7; }
        100% { transform: scale(1.1); opacity: 1; }
    }

    /* History Item Styling */
    .history-item {
        background-color: #f8f9fa;
        border: 1px solid #e9ecef;
        margin-bottom: 10px;
        border-radius: 8px;
        overflow: hidden;
        transition: all 0.3s ease-in-out;
    }

    .history-item.active {
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        border-color: #007bff;
    }

    .history-item-header {
        padding: 15px 20px;
        background-color: #e9ecef;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #dee2e6;
    }

    .history-item-header:hover {
        background-color: #e2e6ea;
    }

    .history-item-header strong {
        color: #343a40;
    }

    .history-meta {
        font-size: 0.85em;
        color: #6c757d;
        margin-top: 5px;
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }

    .history-meta i {
        margin-right: 5px;
    }

    .history-item-body {
        padding: 0 20px;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.5s ease-out;
        background-color: #fff;
    }

    .history-item.active .history-item-body {
        max-height: 1000px; /* Adjust as needed, should be larger than content */
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .request-text {
        margin-bottom: 20px;
        border-bottom: 1px dashed #eee;
        padding-bottom: 15px;
    }

    .request-text h6 {
        color: #007bff;
        margin-bottom: 10px;
    }

    .response-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
    }
    @media (min-width: 768px) {
        .response-grid {
            grid-template-columns: 1fr 1fr;
        }
    }

    .response-box {
        border: 1px solid #ddd;
        border-radius: 5px;
        overflow: hidden;
    }

    .response-header {
        background-color: #f2f2f2;
        padding: 10px 15px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 1px solid #ddd;
    }

    .deepseek-header { color: #f5edfc; background-color: #5a2c8a; } /* DeepSeek inspired color */
    .gemini-header { color: #e6e9ff; background-color: #5a2c8a; } /* Gemini inspired color */

    .response-content {
        padding: 15px;
        max-height: 300px; /* Limit height of response content */
        overflow-y: auto; /* Enable scrolling for long responses */
        line-height: 1.6;
        color: #333;
    }

    .response-content p:last-child {
        margin-bottom: 0;
    }

    .history-actions {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px dashed #eee;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;
    }

    .no-history {
        text-align: center;
        padding: 50px 20px;
        color: #adb5bd;
    }

    .no-history p {
        margin-top: 15px;
        font-size: 1.2em;
        font-weight: 500;
    }

    .no-history small {
        display: block;
        color: #ced4da;
    }

    /* Active sort button styling */
    .history-controls .btn.active {
        background-color: #007bff;
        color: white;
        border-color: #007bff;
    }
  `;
  document.head.appendChild(style);

  // Initialize the AIAPIHandler class
  window.aiHandler = new AIAPIHandler();
});
