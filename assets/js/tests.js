// Test runner state
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResultsList = document.getElementById('test-results');
const totalTestsEl = document.getElementById('total-tests');
const passedTestsEl = document.getElementById('passed-tests');
const failedTestsEl = document.getElementById('failed-tests');

// Helper function for assertions
function assert(condition, message) {
    totalTests++;
    const li = document.createElement('li');
    if (condition) {
        passedTests++;
        li.className = 'pass';
        li.innerHTML = `<strong>PASS:</strong> ${message}`; // Use innerHTML to allow bold
    } else {
        failedTests++;
        li.className = 'fail';
        li.innerHTML = `<strong>FAIL:</strong> ${message}`; // Use innerHTML
        console.error(`Assertion Failed: ${message}`);
    }
    if (testResultsList) { // Check if element exists before appending
        testResultsList.appendChild(li);
    } else {
        console.error("Test results list element not found in tests.html.");
    }
}

function describe(suiteName, fn) {
    if (testResultsList) {
        const li = document.createElement('li');
        li.className = 'suite-title';
        li.textContent = suiteName;
        testResultsList.appendChild(li);
    } else {
        console.error("Test results list element not found for suite title.");
    }
    fn();
}

function updateSummary() {
    if (totalTestsEl) totalTestsEl.textContent = totalTests;
    if (passedTestsEl) passedTestsEl.textContent = passedTests;
    if (failedTestsEl) failedTestsEl.textContent = failedTests;
}

// Mock for window.fetch
let originalFetch;
let fetchMock;

function setupFetchMock(responseGenerator = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}), text: () => Promise.resolve("") })) {
    originalFetch = window.fetch;
    fetchMock = {
        calls: [],
        responseGenerator: responseGenerator,
        fn: (url, options) => {
            fetchMock.calls.push({ url, options });
            // console.log('Fetch mock called with:', url, options);
            return fetchMock.responseGenerator(url, options);
        }
    };
    window.fetch = fetchMock.fn;
}

function teardownFetchMock() {
    if (originalFetch) { // Ensure originalFetch was set
      window.fetch = originalFetch;
    }
    fetchMock = null;
}

// Global AIAPIHandler instance for tests - initialized before each suite/test if needed
let aiHandler; 

// --- Test Suites ---

function testSuite_ConstructorAndInitialization() {
    describe('AIAPIHandler Constructor & Initialization', () => {
        localStorage.removeItem('geminiApiKey'); // Clean slate
        const placeholderKey = "AIzaSyA8mpF39fAgbuQCLWzOjJ6Ute2O0ZOPPkU"; // Default placeholder

        aiHandler = new AIAPIHandler(); 
        assert(aiHandler.config.gemini.apiKey === placeholderKey, `Default key should be placeholder if no key in localStorage. Got: ${aiHandler.config.gemini.apiKey}`);
        
        const apiKey = 'test-gemini-key-123';
        localStorage.setItem('geminiApiKey', apiKey);
        aiHandler = new AIAPIHandler(); // Re-initialize to pick up localStorage
        assert(aiHandler.config.gemini.apiKey === apiKey, 'loadGeminiApiKey() should load key from localStorage.');
        
        localStorage.removeItem('geminiApiKey'); // Teardown
    });
}

function testSuite_ApiKeyManagement() {
    describe('API Key Management', () => {
        // Setup: ensure a clean state before each test in this suite
        localStorage.removeItem('geminiApiKey');
        aiHandler = new AIAPIHandler(); 

        // Test: Saving API Key
        aiHandler.geminiApiKeyInput.value = 'new-test-key-save';
        aiHandler.saveGeminiApiKeyBtn.click(); 
        assert(localStorage.getItem('geminiApiKey') === 'new-test-key-save', 'Saving API key should store it in localStorage.');
        assert(aiHandler.config.gemini.apiKey === 'new-test-key-save', 'Saving API key should update runtime config.');
        assert(aiHandler.geminiApiKeyInput.value === '', 'API key input should be cleared after saving.');
        localStorage.removeItem('geminiApiKey');

        // Test: Clearing API Key
        localStorage.setItem('geminiApiKey', 'key-to-clear');
        aiHandler = new AIAPIHandler(); // Re-init to load the key
        aiHandler.clearGeminiApiKeyBtn.click(); 
        assert(localStorage.getItem('geminiApiKey') === null, 'Clearing API key should remove it from localStorage.');
        assert(aiHandler.config.gemini.apiKey === 'AIzaSyA8mpF39fAgbuQCLWzOjJ6Ute2O0ZOPPkU', 'Clearing API key should reset runtime config to placeholder.');
        
        // Test: callGeminiAPI uses localStorage key
        setupFetchMock(() => Promise.resolve({ 
            ok: true, 
            json: () => Promise.resolve({ candidates: [{ content: { parts: [{ text: "Mock response" }] } }] }) 
        }));
        localStorage.setItem('geminiApiKey', 'key-for-fetch-test-async');
        aiHandler = new AIAPIHandler(); // Re-init to load key

        aiHandler.callGeminiAPI("prompt for fetch test").then(() => {
            assert(fetchMock.calls.length >= 1, 'callGeminiAPI with key should call fetch.');
            const lastCall = fetchMock.calls[fetchMock.calls.length -1];
            assert(lastCall.url.includes('key-for-fetch-test-async'), 'callGeminiAPI should use API key from localStorage in URL.');
        }).catch(err => {
            assert(false, `callGeminiAPI with key failed: ${err.message}`);
        }).finally(() => {
            localStorage.removeItem('geminiApiKey');
            teardownFetchMock();
        });


        // Test: callGeminiAPI rejects if key is missing
        localStorage.removeItem('geminiApiKey');
        aiHandler = new AIAPIHandler(); // Re-init
        // Mock showError to check if it's called
        let showErrorCalled = false;
        let showErrorMessage = "";
        aiHandler.showError = (message) => { 
            showErrorCalled = true; 
            showErrorMessage = message;
        };

        aiHandler.callGeminiAPI("prompt with no key")
            .then(() => {
                assert(false, 'callGeminiAPI should reject if API key is missing.');
            })
            .catch(err => {
                assert(err.message.includes("Gemini API Key missing or invalid"), 'callGeminiAPI rejected with correct error object for missing key.');
                assert(showErrorCalled, 'showError should be called when API key is missing.');
                assert(showErrorMessage.includes("مفتاح Gemini API غير موجود أو غير صالح"), 'showError was called with the correct missing key message.');
            });
    });
}

function testSuite_BuildPrompt() {
    describe('buildPrompt(input, queryType)', () => {
        aiHandler = new AIAPIHandler(); 

        const jobAnalysisPrompt = aiHandler.buildPrompt("إلكترونيات الطيران", "Job Analysis");
        assert(jobAnalysisPrompt.includes("في سياق إلكترونيات الطيران"), "Job Analysis prompt should include context.");
        assert(jobAnalysisPrompt.includes("عنوان الوظيفة 1"), "Job Analysis prompt should list job titles.");
        assert(jobAnalysisPrompt.includes("- طبيعة العمل والمسؤوليات الأساسية."), "Job Analysis prompt should ask for job nature.");

        const activitiesPrompt = aiHandler.buildPrompt("صيانة الأجهزة الطبية", "Activities");
        assert(activitiesPrompt.includes("بناءً على صيانة الأجهزة الطبية"), "Activities prompt should include context.");
        assert(activitiesPrompt.includes("واقتراح وتوصيف ما لا يقل عن 18 نشاطًا"), "Activities prompt should ask for 18+ activities.");
        assert(activitiesPrompt.includes("- اسم النشاط."), "Activities prompt should ask for activity name.");

        const curriculumPrompt = aiHandler.buildPrompt("منهج الشبكات الحاسوبية", "Curriculum Review");
        assert(curriculumPrompt.includes("بناءً على المعلومات التالية عن التخصص (منهج الشبكات الحاسوبية)"), "Curriculum Review prompt should include specific context.");
        assert(curriculumPrompt.includes("1. طبيعة العمل والمهام الأساسية"), "Curriculum Review prompt should ask for job nature.");
        assert(curriculumPrompt.includes("معلومات التخصص:\nمنهج الشبكات الحاسوبية"), "Curriculum Review prompt should include the input.");

        const defaultPrompt = aiHandler.buildPrompt("الذكاء الاصطناعي"); 
        assert(defaultPrompt.includes("بناءً على المعلومات التالية عن التخصص (الذكاء الاصطناعي)"), "Default prompt should be Curriculum Review type.");
    });
}


function testSuite_HandleAPICall() {
    describe('handleAPICall(provider, queryType)', () => {
        aiHandler = new AIAPIHandler();
        aiHandler.textarea.value = "Test input"; 

        // Mock dependencies of handleAPICall
        let callAPICalledWith = {};
        aiHandler.callAPI = async (provider, input, queryType) => {
            callAPICalledWith = { provider, input, queryType };
            return "mock api response";
        };
        // Prevent actual DOM manipulation during these specific tests
        aiHandler.showLoading = () => {}; aiHandler.hideLoading = () => {};
        aiHandler.hideMessages = () => {}; aiHandler.updateStatusIndicators = () => {};
        aiHandler.showSuccess = () => {}; aiHandler.showError = () => {};
        aiHandler.displayResponse = () => {};

        // Test: Defaults queryType to "Curriculum Review"
        aiHandler.handleAPICall("gemini").finally(() => { // Use finally to ensure assert runs after async
            assert(callAPICalledWith.queryType === "Curriculum Review", 'handleAPICall should default queryType to "Curriculum Review".');
        });

        // Test: Forces provider to "gemini" for "Job Analysis"
        aiHandler.handleAPICall("deepseek", "Job Analysis").finally(() => {
            assert(callAPICalledWith.provider === "gemini", 'handleAPICall should force provider to "gemini" for "Job Analysis".');
            assert(callAPICalledWith.queryType === "Job Analysis", 'handleAPICall should pass "Job Analysis" as queryType.');
        });
        
        // Test: Forces provider to "gemini" for "Activities"
        aiHandler.handleAPICall("deepseek", "Activities").finally(() => {
            assert(callAPICalledWith.provider === "gemini", 'handleAPICall should force provider to "gemini" for "Activities".');
            assert(callAPICalledWith.queryType === "Activities", 'handleAPICall should pass "Activities" as queryType.');
        });

        // Test: Uses default context if textarea is empty for "Job Analysis"
        aiHandler.textarea.value = ""; 
        let promptInputForJobAnalysis;
        const originalBuildPrompt = aiHandler.buildPrompt; // Save original
        aiHandler.buildPrompt = (input, queryType) => { // Mock buildPrompt
            if (queryType === "Job Analysis") promptInputForJobAnalysis = input;
            return originalBuildPrompt.call(aiHandler, input, queryType); // Call original to get a valid prompt string
        };
        aiHandler.handleAPICall("gemini", "Job Analysis").finally(() => {
            assert(promptInputForJobAnalysis === "منهج الإلكترونيات المصري", 'handleAPICall should use default context for Job Analysis if textarea is empty.');
            aiHandler.buildPrompt = originalBuildPrompt; // Restore original
            aiHandler.textarea.value = "Test input"; // Reset textarea
        });
    });
}

function testSuite_ResponseParsing() {
    describe('Response Parsing', () => {
        aiHandler = new AIAPIHandler(); 

        // Test parseAndDisplayJobAnalysis
        const mockJobResponse = `1. عنوان الوظيفة الأول\n- طبيعة العمل: عمل مكتبي وتحليلي\n- المهارات: تحليل بيانات, برمجة\n\n2. عنوان الوظيفة الثاني\n- طبيعة العمل: ميداني\n\n3. عنوان الوظيفة الثالث\n- وصف: هذا هو الوصف الوحيد`;
        aiHandler.parseAndDisplayJobAnalysis(mockJobResponse);
        assert(document.getElementById('job-title-1').textContent.trim() === "عنوان الوظيفة الأول", "Job Analysis parsing: title 1 correct.");
        assert(document.getElementById('job-desc-1').innerHTML.includes("عمل مكتبي وتحليلي"), "Job Analysis parsing: desc 1 correct.");
        assert(document.getElementById('job-title-2').textContent.trim() === "عنوان الوظيفة الثاني", "Job Analysis parsing: title 2 correct.");
        assert(document.getElementById('job-desc-2').innerHTML.includes("ميداني"), "Job Analysis parsing: desc 2 correct.");
        assert(document.getElementById('job-title-3').textContent.trim() === "عنوان الوظيفة الثالث", "Job Analysis parsing: title 3 correct.");
        assert(document.getElementById('job-desc-3').innerHTML.includes("هذا هو الوصف الوحيد"), "Job Analysis parsing: desc 3 correct.");


        aiHandler.parseAndDisplayJobAnalysis("نص غير متوقع بدون ترقيم.");
        const jobDesc1 = document.getElementById('job-desc-1');
        assert(jobDesc1.querySelector('em.card-error-message') !== null, "Job Analysis malformed response should show error using .card-error-message.");

        // Test parseAndDisplayActivities
        const mockActivityResponse = `1. تصميم الدوائر.\n- النشاط الثاني.\n* النشاط الثالث.`;
        aiHandler.parseAndDisplayActivities(mockActivityResponse);
        assert(document.getElementById('activity-text-1').textContent.includes("تصميم الدوائر."), "Activities parsing: activity 1 correct.");
        assert(document.getElementById('activity-text-2').textContent.includes("النشاط الثاني."), "Activities parsing: activity 2 correct.");
        assert(document.getElementById('activity-text-3').textContent.includes("النشاط الثالث."), "Activities parsing: activity 3 correct.");

        aiHandler.parseAndDisplayActivities(""); // Empty response
        const activityText1 = document.getElementById('activity-text-1');
        assert(activityText1.querySelector('em.card-error-message') !== null, "Activities empty response should show error using .card-error-message.");
    });
}


function testSuite_FormatResponse() {
    describe('formatResponse(text)', () => {
        aiHandler = new AIAPIHandler();

        assert(aiHandler.formatResponse("Hello\n\nWorld") === "<p>Hello</p><p>World</p>", "formatResponse: double newline to paragraph.");
        assert(aiHandler.formatResponse("Line1\nLine2") === "<p>Line1<br>Line2</p>", "formatResponse: single newline to <br>.");
        assert(aiHandler.formatResponse("**Bold Text**") === "<p><strong>Bold Text</strong></p>", "formatResponse: bold text.");
        assert(aiHandler.formatResponse("*Italic Text*") === "<p><em>Italic Text</em></p>", "formatResponse: italic text.");
        // Note: The current formatResponse wraps list items in <ul> individually, which is not ideal HTML, but testing its current behavior.
        assert(aiHandler.formatResponse("- Item 1\n- Item 2").includes("<li>Item 1</li>") && aiHandler.formatResponse("- Item 1\n- Item 2").includes("<li>Item 2</li>") , "formatResponse: list items (basic check).");
        assert(aiHandler.formatResponse("[Link](http://example.com)") === '<p><a href="http://example.com" target="_blank">Link</a></p>', "formatResponse: links.");
        assert(aiHandler.formatResponse("# Heading 1") === "<h1>Heading 1</h1>", "formatResponse: H1 heading.");
        assert(aiHandler.formatResponse("### Heading 3") === "<h3>Heading 3</h3>", "formatResponse: H3 heading.");
        assert(aiHandler.formatResponse("") === "<p><em>لا يوجد محتوى لعرضه.</em></p>", "formatResponse: empty input returns placeholder.");
        assert(aiHandler.formatResponse(null) === "<p><em>لا يوجد محتوى لعرضه.</em></p>", "formatResponse: null input returns placeholder.");
    });
}

// Main function to run all test suites
function runAllTests() {
    totalTests = 0;
    passedTests = 0;
    failedTests = 0;
    if (testResultsList) testResultsList.innerHTML = ''; 

    // Setup common mocks or state if needed before all suites
    // e.g., aiHandler = new AIAPIHandler(); if it's meant to be shared and reset carefully.
    // For now, suites re-initialize aiHandler as needed for isolation.

    testSuite_ConstructorAndInitialization();
    testSuite_ApiKeyManagement(); // Depends on DOM elements for buttons/inputs
    testSuite_BuildPrompt();
    testSuite_HandleAPICall(); 
    testSuite_ResponseParsing(); // Depends on DOM elements for output cards
    testSuite_FormatResponse();

    updateSummary();
    console.log(`Testing Complete. Passed: ${passedTests}, Failed: ${failedTests}, Total: ${totalTests}`);
}
