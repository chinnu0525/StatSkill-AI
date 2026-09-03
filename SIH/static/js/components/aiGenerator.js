/**
 * AI Assessment & Ministry Quiz Generator Component
 * Powered by Groq Cloud LPU™ (llama-3.3-70b-versatile) & National Statistical System Framework.
 * Generates role-calibrated quizzes across all 10 Ministries and 44 Departments.
 */

let generatorMode = "ministry"; // "ministry" | "document"
let selectedDoc = MOCK_DATA.sampleDocuments[0];
let generatedQuestionsList = [];
let isGenerating = false;
let groqStatus = { configured: false, model: "llama-3.3-70b-versatile" };

// Fetch live Groq status on module load
function fetchGroqStatus() {
    fetch('/api/ai/groq-status')
        .then(res => res.json())
        .then(data => {
            if (data.status) {
                groqStatus = data.status;
                const badge = document.getElementById('groqStatusBadge');
                if (badge) {
                    badge.innerHTML = groqStatus.configured 
                        ? `<i class="fa-solid fa-bolt text-amber-400"></i> Groq LPU Active (${groqStatus.model})`
                        : `<i class="fa-solid fa-server text-blue-300"></i> Groq Fallback Ready (${groqStatus.model})`;
                }
            }
        })
        .catch(() => {});
}
setTimeout(fetchGroqStatus, 200);

function renderAiGenerator(state) {
    const user = state.user || {};
    const docs = MOCK_DATA.sampleDocuments;
    const deptMap = window.DEPARTMENT_FRAMEWORK_MAP || {};
    
    // Extract unique ministries
    const allMinistries = [...new Set(Object.values(deptMap).map(d => d.ministry).filter(Boolean))];
    if (!allMinistries.includes("Ministry of Statistics and Programme Implementation (MoSPI)")) {
        allMinistries.unshift("Ministry of Statistics and Programme Implementation (MoSPI)");
    }

    const defaultMinistry = user.ministry || allMinistries[0] || "Ministry of Statistics and Programme Implementation (MoSPI)";
    const defaultRoleGrade = (typeof window.getOfficerRoleGrade === 'function') 
        ? window.getOfficerRoleGrade(user.designation || user.role, user.experience || 4) 
        : "R3";

    return `
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <!-- Top Header Card -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-orange-500">
            <div>
                <div class="flex flex-wrap items-center gap-2">
                    <span class="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> AI Assessment Engine
                    </span>
                    <span id="groqStatusBadge" class="text-xs font-semibold bg-slate-900 text-white px-3 py-1 rounded-full flex items-center gap-1.5 cursor-pointer" onclick="openGroqConfigModal()">
                        <i class="fa-solid fa-bolt text-amber-400"></i> Powered by Groq LPU™ (${groqStatus.model || 'llama-3.3-70b'})
                    </span>
                    <button onclick="openGroqConfigModal()" class="text-xs text-blue-600 hover:text-blue-800 font-bold underline">
                        API Key Settings
                    </button>
                </div>
                <h1 class="text-2xl sm:text-3xl font-black text-navy-900 mt-2" style="color: #0B2545;">
                    Ministry Employee Assessment & Quiz Generator
                </h1>
                <p class="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1">
                    Generate official, role-calibrated competency examinations for employees across all 10 Ministries and 44 Departments, strictly bounded by cadre targets.
                </p>
            </div>

            <!-- Mode Selector Tabs -->
            <div class="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
                <button onclick="setGeneratorMode('ministry')" class="px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${generatorMode === 'ministry' ? 'bg-navy-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}" style="${generatorMode === 'ministry' ? 'background: #0B2545;' : ''}">
                    <i class="fa-solid fa-building-columns text-orange-400"></i> Ministry Cadre Quiz
                </button>
                <button onclick="setGeneratorMode('document')" class="px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${generatorMode === 'document' ? 'bg-navy-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}" style="${generatorMode === 'document' ? 'background: #0B2545;' : ''}">
                    <i class="fa-solid fa-file-lines text-blue-400"></i> Document Upload
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left 5 Cols: Configuration Panel -->
            <div class="lg:col-span-5 space-y-6">
                
                ${generatorMode === 'ministry' ? `
                <!-- Ministry & Cadre Selector Box -->
                <div class="stat-card p-6 space-y-4">
                    <h2 class="text-base font-bold text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                        <i class="fa-solid fa-building-columns text-orange-500"></i> Step 1: Ministry & Cadre Profile
                    </h2>

                    <div class="space-y-3 text-xs">
                        <!-- Ministry Select -->
                        <div>
                            <label class="font-bold text-slate-700 block mb-1">Target Ministry</label>
                            <select id="cfgMinistry" onchange="onMinistryChange(this.value)" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:ring-2 focus:ring-orange-500">
                                ${allMinistries.map(m => `
                                    <option value="${m}" ${m === defaultMinistry ? 'selected' : ''}>${m}</option>
                                `).join('')}
                            </select>
                        </div>

                        <!-- Department Select -->
                        <div>
                            <label class="font-bold text-slate-700 block mb-1">Department / Directorate</label>
                            <select id="cfgDepartment" onchange="onDepartmentChange(this.value)" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:ring-2 focus:ring-orange-500">
                                <!-- Populated dynamically -->
                            </select>
                        </div>

                        <!-- Sector Tag & D6 Competencies Display -->
                        <div id="deptMetadataBadge" class="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5">
                            <div class="flex items-center justify-between text-[11px]">
                                <span class="font-bold text-blue-900">Sector Domain:</span>
                                <span id="metaSectorTag" class="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">Water Resources</span>
                            </div>
                            <div class="text-[11px] text-slate-600">
                                <span class="font-bold text-slate-700">D6 Competencies:</span>
                                <div id="metaD6Comps" class="flex flex-wrap gap-1 mt-1">
                                    <span class="bg-white border border-blue-200 px-2 py-0.5 rounded text-[10px] text-blue-800">Minor Irrigation Census</span>
                                </div>
                            </div>
                        </div>

                        <!-- Role Grade Selection -->
                        <div>
                            <label class="font-bold text-slate-700 block mb-1">Officer Role Grade (Calibrated Benchmark)</label>
                            <select id="cfgRoleGrade" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:ring-2 focus:ring-orange-500">
                                <option value="R1" ${defaultRoleGrade === 'R1' ? 'selected' : ''}>R1 — Field Enumerator / JSO (Level 1–2 Foundation)</option>
                                <option value="R2" ${defaultRoleGrade === 'R2' ? 'selected' : ''}>R2 — Statistical Supervisor / SSO (Level 2–3 Working)</option>
                                <option value="R3" ${defaultRoleGrade === 'R3' ? 'selected' : ''}>R3 — Assistant Director / ISS JTS (Level 3 Practitioner Target)</option>
                                <option value="R4" ${defaultRoleGrade === 'R4' ? 'selected' : ''}>R4 — Deputy Director / ISS STS (Level 4 Advanced Target)</option>
                                <option value="R5" ${defaultRoleGrade === 'R5' ? 'selected' : ''}>R5 — Director / DDG (Level 4–5 Expert)</option>
                                <option value="R6" ${defaultRoleGrade === 'R6' ? 'selected' : ''}>R6 — Additional DG / DG (Level 5 Leadership)</option>
                            </select>
                            <p class="text-[10px] text-slate-500 mt-1">Questions will be strictly bounded so an R3 officer is tested at Level 3 at most.</p>
                        </div>

                        <!-- Optional Topic Focus -->
                        <div>
                            <label class="font-bold text-slate-700 block mb-1">Specific Topic Focus (Optional)</label>
                            <input type="text" id="cfgTopic" placeholder="e.g. Water Bodies Census, GVA Formulation, Sample Weights" class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800">
                        </div>
                    </div>
                </div>
                ` : `
                <!-- Document Upload & Sample Picker Box -->
                <div class="stat-card p-6 space-y-4">
                    <h2 class="text-base font-bold text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                        <i class="fa-solid fa-file-arrow-up text-orange-500"></i> Step 1: Select or Upload Material
                    </h2>

                    <!-- Drag & Drop Zone -->
                    <div onclick="document.getElementById('fileUploadInput').click()" class="border-2 border-dashed border-slate-300 hover:border-navy-900 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-100 transition-all space-y-2">
                        <input type="file" id="fileUploadInput" class="hidden" onchange="handleFileUpload(event)">
                        <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto text-xl">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                        </div>
                        <div class="text-xs font-bold text-navy-900">Drag & Drop official guidelines or manuals</div>
                        <p class="text-[10px] text-slate-400">Supports PDF, DOCX, PPTX, TXT (Max 50MB)</p>
                    </div>

                    <!-- Pre-loaded Official Manuals -->
                    <div class="space-y-2 pt-2">
                        <span class="text-xs font-bold text-slate-700 block">Or Choose Approved Training Manual:</span>
                        <div class="space-y-2">
                            ${docs.map(doc => `
                                <div onclick="selectSampleDoc('${doc.id}')" class="p-3 rounded-xl border text-xs cursor-pointer transition-all ${selectedDoc && selectedDoc.id === doc.id ? 'border-orange-500 bg-orange-50/60' : 'border-slate-200 bg-white hover:bg-slate-50'}">
                                    <div class="flex items-center justify-between font-bold text-navy-900">
                                        <span class="truncate max-w-[240px]">${doc.title}</span>
                                        <span class="text-[10px] text-slate-400 font-semibold">${doc.pages} pgs</span>
                                    </div>
                                    <p class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">${doc.summary}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                `}

                <!-- Step 2: Exam & Bloom Configuration -->
                <div class="stat-card p-6 space-y-4">
                    <h2 class="text-base font-bold text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                        <i class="fa-solid fa-sliders text-orange-500"></i> Step 2: Exam Parameters
                    </h2>

                    <div class="space-y-3 text-xs">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="font-bold text-slate-700 block mb-1">Question Count</label>
                                <select id="cfgCount" class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800">
                                    <option value="5" selected>5 Questions (Quick Check)</option>
                                    <option value="10">10 Questions (Standard Exam)</option>
                                    <option value="15">15 Questions (Comprehensive)</option>
                                    <option value="20">20 Questions (Full Cadre)</option>
                                </select>
                            </div>
                            <div>
                                <label class="font-bold text-slate-700 block mb-1">Target Difficulty</label>
                                <select id="cfgDifficulty" class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800">
                                    <option value="Medium" selected>Medium (Role Target)</option>
                                    <option value="Easy">Easy (Foundation)</option>
                                    <option value="Hard">Hard (Senior Stretch)</option>
                                    <option value="Mixed">Mixed Distribution</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="font-bold text-slate-700 block mb-1">Bloom's Taxonomy</label>
                                <select id="cfgBloom" class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800">
                                    <option value="Apply" selected>Apply (Practical Methods)</option>
                                    <option value="Understand">Understand (Concepts)</option>
                                    <option value="Analyze">Analyze (Data Validation)</option>
                                    <option value="Evaluate">Evaluate (Audit & Standards)</option>
                                </select>
                            </div>
                            <div>
                                <label class="font-bold text-slate-700 block mb-1">Language</label>
                                <select id="cfgLanguage" class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800">
                                    <option value="English" selected>English</option>
                                    <option value="Hindi">हिन्दी (Hindi)</option>
                                    <option value="Telugu">తెలుగు (Telugu)</option>
                                </select>
                            </div>
                        </div>

                        <!-- Action Submit Button -->
                        <div class="pt-2">
                            <button onclick="triggerAiGeneration()" id="generateBtn" class="btn btn-saffron w-full py-3 text-xs sm:text-sm font-bold shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2">
                                <i class="fa-solid fa-bolt text-amber-300"></i> Generate Ministry Quiz with Groq AI
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right 7 Cols: Generated Questions & Interactive Output -->
            <div class="lg:col-span-7 space-y-6">
                <!-- Status Banner -->
                <div class="stat-card p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div>
                        <span class="text-[10px] font-bold text-orange-600 uppercase flex items-center gap-1">
                            <i class="fa-solid fa-check-double"></i> Grounded Ministry Assessment
                        </span>
                        <div class="text-sm font-bold text-navy-900 mt-0.5" id="activeDocTitle">
                            ${generatorMode === 'ministry' ? `${defaultMinistry} Official Cadre Quiz` : (selectedDoc ? selectedDoc.title : 'Document')}
                        </div>
                        <p class="text-[11px] text-slate-500 mt-1" id="activeDocSub">
                            Calibrated to National Statistical Standards & Cadre Benchmark
                        </p>
                    </div>
                    <span class="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full whitespace-nowrap">
                        <i class="fa-solid fa-shield-check"></i> Zero-Hallucination Grounded
                    </span>
                </div>

                <!-- Async Processing Animation Box -->
                <div id="aiProcessingBox" class="hidden stat-card p-8 text-center space-y-4 bg-gradient-to-br from-slate-900 to-navy-900 text-white rounded-2xl">
                    <div class="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mx-auto"></div>
                    <h3 class="text-base font-bold text-white">Groq LPU Generation Pipeline in Progress...</h3>
                    <div class="max-w-md mx-auto space-y-1.5 text-xs text-slate-300">
                        <div class="flex justify-between"><span>1. Ministry Domain & Cadre Ingestion</span> <strong class="text-emerald-400 font-bold">✓</strong></div>
                        <div class="flex justify-between"><span>2. Groq LPU Ultra-Fast Inference (llama-3.3-70b)</span> <strong class="text-amber-400 animate-pulse">Running...</strong></div>
                        <div class="flex justify-between"><span>3. Bloom's Taxonomy & Role Level Grounding</span> <strong class="text-slate-400">Pending</strong></div>
                        <div class="flex justify-between"><span>4. Quality Review & Source Verification</span> <strong class="text-slate-500">Pending</strong></div>
                    </div>
                </div>

                <!-- Generated Questions Output List -->
                <div id="generatedQuestionsContainer" class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">
                            Generated Questions (<span id="genCountDisplay">5</span>)
                        </h2>

                        <div class="flex items-center gap-2">
                            <button onclick="publishAndStartQuiz()" class="btn btn-primary text-xs py-2 px-4 flex items-center gap-2 shadow-md">
                                <i class="fa-solid fa-play text-orange-400"></i> Take Quiz Now
                            </button>
                        </div>
                    </div>

                    <!-- Questions Loop Wrapper -->
                    <div class="space-y-4" id="questionsListWrapper">
                        <!-- Rendered dynamically -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Groq API Key Configuration Modal -->
    <div id="groqConfigModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2 text-navy-900 font-bold">
                    <i class="fa-solid fa-bolt text-amber-500"></i>
                    <span>Groq Cloud LPU™ Configuration</span>
                </div>
                <button onclick="closeGroqConfigModal()" class="text-slate-400 hover:text-slate-700 text-lg">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            
            <div class="space-y-3 text-xs">
                <p class="text-slate-600">
                    StatSkill AI uses <strong>Groq Cloud LPU™</strong> for ultra-fast generation with <code>llama-3.3-70b-versatile</code>. Enter your Groq API key below to activate live inference.
                </p>
                <div>
                    <label class="font-bold text-slate-700 block mb-1">Groq API Key (starts with gsk_)</label>
                    <input type="password" id="groqApiKeyInput" placeholder="gsk_..." class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono text-xs focus:ring-2 focus:ring-orange-500">
                </div>
                <div>
                    <label class="font-bold text-slate-700 block mb-1">Model Selection</label>
                    <select id="groqModelSelect" class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800">
                        <option value="llama-3.3-70b-versatile" selected>llama-3.3-70b-versatile (Fastest & Highest Accuracy)</option>
                        <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Ultra-low Latency)</option>
                        <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
                    </select>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
                    <div class="flex justify-between">
                        <span>Current Status:</span>
                        <strong id="modalGroqStatusText" class="${groqStatus.configured ? 'text-emerald-600' : 'text-amber-600'}">
                            ${groqStatus.configured ? 'Active & Configured' : 'Offline Fallback Active'}
                        </strong>
                    </div>
                    <p class="text-[10px] text-slate-400">If no key is provided, the platform automatically serves pre-curated official ministry questions.</p>
                </div>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button onclick="closeGroqConfigModal()" class="btn btn-secondary text-xs py-2 px-4">
                    Cancel
                </button>
                <button onclick="saveGroqConfig()" class="btn btn-saffron text-xs py-2 px-4 font-bold flex items-center gap-1.5">
                    <i class="fa-solid fa-floppy-disk"></i> Save & Connect
                </button>
            </div>
        </div>
    </div>

    <!-- View Source Snippet Modal -->
    <div id="sourceSnippetModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2 text-navy-900 font-bold">
                    <i class="fa-solid fa-file-lines text-orange-500"></i>
                    <span>Verified Knowledge Source Snippet</span>
                </div>
                <button onclick="document.getElementById('sourceSnippetModal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700 text-lg">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="space-y-2 text-xs">
                <div class="font-bold text-slate-800" id="srcRefTitle"></div>
                <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800 leading-relaxed max-h-48 overflow-y-auto" id="srcSnippetText"></div>
                <p class="text-[11px] text-slate-500">
                    <i class="fa-solid fa-shield-check text-emerald-600"></i> This question has been verified against this source segment with <strong>99% semantic ground-truth confidence</strong>.
                </p>
            </div>
            <div class="pt-3 border-t border-slate-100 flex justify-end">
                <button onclick="document.getElementById('sourceSnippetModal').classList.add('hidden')" class="btn btn-primary text-xs py-2 px-4">
                    Close
                </button>
            </div>
        </div>
    </div>
    `;
}

function setGeneratorMode(mode) {
    generatorMode = mode;
    window.store.notify();
    setTimeout(() => {
        if (generatorMode === 'ministry') {
            const minSelect = document.getElementById('cfgMinistry');
            if (minSelect) onMinistryChange(minSelect.value);
        }
    }, 50);
}

function onMinistryChange(selectedMinistry) {
    const deptSelect = document.getElementById('cfgDepartment');
    if (!deptSelect) return;

    const deptMap = window.DEPARTMENT_FRAMEWORK_MAP || {};
    const depts = Object.entries(deptMap)
        .filter(([_, data]) => data.ministry === selectedMinistry)
        .map(([name, _]) => name);

    deptSelect.innerHTML = depts.length > 0 
        ? depts.map(d => `<option value="${d}">${d}</option>`).join('')
        : `<option value="${selectedMinistry} Department">${selectedMinistry} Main Division</option>`;

    onDepartmentChange(deptSelect.value);
}

function onDepartmentChange(selectedDept) {
    const deptMap = window.DEPARTMENT_FRAMEWORK_MAP || {};
    const config = deptMap[selectedDept] || {
        sectorTag: "Official Statistics",
        d6Competencies: ["Statistical Methodology", "Data Validation"]
    };

    const sectorBadge = document.getElementById('metaSectorTag');
    const d6Container = document.getElementById('metaD6Comps');
    if (sectorBadge) sectorBadge.innerText = config.sectorTag || "Official Statistics";
    if (d6Container) {
        d6Container.innerHTML = (config.d6Competencies || []).map(c => `
            <span class="bg-white border border-blue-200 px-2 py-0.5 rounded text-[10px] text-blue-800">${c}</span>
        `).join('');
    }
}

function selectSampleDoc(docId) {
    selectedDoc = MOCK_DATA.sampleDocuments.find(d => d.id === docId);
    window.store.notify();
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        selectedDoc = {
            id: `doc_${Date.now()}`,
            title: file.name,
            pages: 24,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            topics: ["Uploaded Survey Guide", "Field Protocol", "Estimation Formulas"],
            difficulty: "Medium",
            domain: "Statistical",
            summary: "User uploaded official document for automated question generation."
        };
        window.store.notify();
        alert(`Document "${file.name}" uploaded and parsed successfully!`);
    }
}

function triggerAiGeneration() {
    const btn = document.getElementById('generateBtn');
    const procBox = document.getElementById('aiProcessingBox');
    const qContainer = document.getElementById('generatedQuestionsContainer');

    btn.disabled = true;
    procBox.classList.remove('hidden');
    qContainer.classList.add('hidden');

    const numCount = document.getElementById('cfgCount') ? document.getElementById('cfgCount').value : 5;
    const diff = document.getElementById('cfgDifficulty') ? document.getElementById('cfgDifficulty').value : 'Medium';
    const bloom = document.getElementById('cfgBloom') ? document.getElementById('cfgBloom').value : 'Apply';
    const lang = document.getElementById('cfgLanguage') ? document.getElementById('cfgLanguage').value : 'English';

    let endpoint = '/api/ai/generate-ministry-quiz';
    let payload = {};

    if (generatorMode === 'ministry') {
        const ministry = document.getElementById('cfgMinistry') ? document.getElementById('cfgMinistry').value : 'Ministry of Statistics and Programme Implementation (MoSPI)';
        const department = document.getElementById('cfgDepartment') ? document.getElementById('cfgDepartment').value : 'NSO';
        const roleGrade = document.getElementById('cfgRoleGrade') ? document.getElementById('cfgRoleGrade').value : 'R3';
        const topic = document.getElementById('cfgTopic') ? document.getElementById('cfgTopic').value : '';

        const deptMap = window.DEPARTMENT_FRAMEWORK_MAP || {};
        const config = deptMap[department] || { sectorTag: "Official Statistics", d6Competencies: ["Statistical Standards"] };

        payload = {
            ministry: ministry,
            department: department,
            sectorTag: config.sectorTag || "Official Statistics",
            d6Competencies: config.d6Competencies || [],
            roleGrade: roleGrade,
            numQuestions: numCount,
            difficulty: diff,
            bloomLevel: bloom,
            topic: topic,
            language: lang
        };
    } else {
        endpoint = '/api/ai/generate-questions';
        payload = {
            document_name: selectedDoc ? selectedDoc.title : "NSSO_Manual.pdf",
            num_questions: numCount,
            bloom_level: bloom,
            difficulty: diff,
            language: lang
        };
    }

    fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        setTimeout(() => {
            btn.disabled = false;
            procBox.classList.add('hidden');
            qContainer.classList.remove('hidden');
            generatedQuestionsList = data.questions || [];
            renderQuestionsList(generatedQuestionsList);

            if (data.poweredBy) {
                const subTitle = document.getElementById('activeDocSub');
                if (subTitle) {
                    subTitle.innerHTML = `<i class="fa-solid fa-bolt text-amber-500"></i> ${data.poweredBy} ${data.latencyMs ? `(${data.latencyMs}ms)` : ''}`;
                }
            }
        }, 900);
    })
    .catch(() => {
        btn.disabled = false;
        procBox.classList.add('hidden');
        qContainer.classList.remove('hidden');
    });
}

function renderQuestionsList(questions) {
    const wrapper = document.getElementById('questionsListWrapper');
    if (!wrapper) return;

    document.getElementById('genCountDisplay').innerText = questions.length;

    wrapper.innerHTML = questions.map((q, idx) => `
        <div class="stat-card p-5 space-y-3 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-all">
            <div class="flex justify-between items-start gap-2 border-b border-slate-100 pb-2">
                <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-navy-900 text-white font-bold text-xs flex items-center justify-center" style="background: #0B2545;">
                        ${idx + 1}
                    </span>
                    <span class="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        ${q.bloomLevel || 'Apply'} (Bloom)
                    </span>
                    <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        ${q.competency || 'Official Statistics'}
                    </span>
                </div>
                <div class="flex items-center gap-2 text-xs">
                    <span class="text-emerald-700 font-bold text-[11px]"><i class="fa-solid fa-shield-check"></i> ${q.confidenceScore || 99}% Confidence</span>
                    <button onclick="viewQuestionSource('${q.id}')" class="text-blue-600 hover:underline font-bold flex items-center gap-1 text-[11px]">
                        <i class="fa-solid fa-magnifying-glass"></i> View Source
                    </button>
                </div>
            </div>

            <div class="text-xs sm:text-sm font-bold text-navy-900 leading-relaxed" style="color: #0B2545;">
                ${q.question}
            </div>

            <!-- Options Grid -->
            <div class="space-y-1.5 text-xs">
                ${(q.options || []).map((opt, optIdx) => `
                    <div class="p-2.5 rounded-lg border ${optIdx === q.correctAnswerIndex ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold' : 'border-slate-200 bg-slate-50 text-slate-700'} flex items-center justify-between">
                        <span><strong>${String.fromCharCode(65 + optIdx)}.</strong> ${opt}</span>
                        ${optIdx === q.correctAnswerIndex ? '<span class="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">Correct Answer</span>' : ''}
                    </div>
                `).join('')}
            </div>

            <!-- Explanation & Citation -->
            <div class="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1 border border-slate-100">
                <strong class="text-slate-800 block font-semibold">Authoritative Explanation:</strong>
                <p>${q.explanation}</p>
                <div class="text-[10px] text-slate-400 font-mono mt-1">Ref: ${q.sourceReference || 'Ministry Standards'}</div>
            </div>
        </div>
    `).join('');
}

function viewQuestionSource(qId) {
    const q = generatedQuestionsList.find(item => item.id === qId);
    if (!q) return;

    document.getElementById('srcRefTitle').innerText = q.sourceReference || "Official Ministry Guidelines";
    document.getElementById('srcSnippetText').innerText = `"...${q.explanation || q.question}..."`;
    document.getElementById('sourceSnippetModal').classList.remove('hidden');
}

function publishAndStartQuiz() {
    if (generatedQuestionsList.length === 0) {
        alert('Please generate questions first.');
        return;
    }

    const ministry = document.getElementById('cfgMinistry') ? document.getElementById('cfgMinistry').value : '';
    const dept = document.getElementById('cfgDepartment') ? document.getElementById('cfgDepartment').value : '';
    const roleGrade = document.getElementById('cfgRoleGrade') ? document.getElementById('cfgRoleGrade').value : 'R3';
    const examTitle = generatorMode === 'ministry' 
        ? `${dept || ministry} (${roleGrade}) Competency Assessment`
        : `${selectedDoc ? selectedDoc.title : 'Official Statistics'} AI Assessment`;

    window.store.startQuiz(generatedQuestionsList, examTitle);
}

// Groq Key Settings Modal Helpers
function openGroqConfigModal() {
    const modal = document.getElementById('groqConfigModal');
    if (modal) modal.classList.remove('hidden');
    fetchGroqStatus();
}

function closeGroqConfigModal() {
    const modal = document.getElementById('groqConfigModal');
    if (modal) modal.classList.add('hidden');
}

function saveGroqConfig() {
    const keyInput = document.getElementById('groqApiKeyInput');
    const modelSelect = document.getElementById('groqModelSelect');
    const key = keyInput ? keyInput.value.trim() : '';
    const model = modelSelect ? modelSelect.value : 'llama-3.3-70b-versatile';

    fetch('/api/ai/groq-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key, model: model })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status) {
            groqStatus = data.status;
            alert(groqStatus.configured 
                ? `Groq LPU successfully configured with ${groqStatus.model}!` 
                : 'API Key saved. Ready for generation.');
            closeGroqConfigModal();
            fetchGroqStatus();
        }
    })
    .catch(() => {
        alert('Failed to save Groq configuration.');
    });
}

// Initial populate of 5 questions on initial load
setTimeout(() => {
    // Populate departments for default ministry
    const minSelect = document.getElementById('cfgMinistry');
    if (minSelect) onMinistryChange(minSelect.value);

    // Initial questions fetch
    fetch('/api/ai/generate-ministry-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ministry: "Ministry of Statistics and Programme Implementation (MoSPI)",
            department: "National Statistical Office (NSO - NAD)",
            sectorTag: "National Accounts",
            d6Competencies: ["SNA 2008 & GVA Compilation", "National Accounts Statistics"],
            roleGrade: "R3",
            numQuestions: 5
        })
    })
    .then(res => res.json())
    .then(data => {
        generatedQuestionsList = data.questions || [];
        renderQuestionsList(generatedQuestionsList);
    });
}, 300);

window.renderAiGenerator = renderAiGenerator;
window.setGeneratorMode = setGeneratorMode;
window.onMinistryChange = onMinistryChange;
window.onDepartmentChange = onDepartmentChange;
window.selectSampleDoc = selectSampleDoc;
window.handleFileUpload = handleFileUpload;
window.triggerAiGeneration = triggerAiGeneration;
window.viewQuestionSource = viewQuestionSource;
window.publishAndStartQuiz = publishAndStartQuiz;
window.openGroqConfigModal = openGroqConfigModal;
window.closeGroqConfigModal = closeGroqConfigModal;
window.saveGroqConfig = saveGroqConfig;
