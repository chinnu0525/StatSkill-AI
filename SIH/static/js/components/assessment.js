/**
 * Competency Assessment Wizard Component — Block 1: Digital Competency Profile
 * Multi-step interactive self & knowledge evaluation benchmarking current capabilities and generating an AI profile.
 */

let currentAssessmentStep = 1;
let assessmentResponses = {
    selfRatings: {
        "Sampling": 3,
        "Survey Design": 3,
        "Python": 2,
        "AI/ML": 1,
        "Data Visualization": 2,
        "National Accounts": 3,
        "Cybersecurity": 2,
        "Ethics": 3
    },
    knowledgeAnswers: {}
};

function renderCompetencyAssessment(state) {
    const user = state.user || (window.MOCK_DATA && window.MOCK_DATA.currentUser) || {};

    return `
    <div class="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <!-- Assessment Card Wrapper -->
        <div class="stat-card p-6 sm:p-10 space-y-8 bg-white rounded-3xl border border-slate-200 shadow-md">
            <!-- Header & Stepper -->
            <div class="space-y-4 border-b border-slate-100 pb-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase">
                                Block 1 — Official Cadre Assessment
                            </span>
                            <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                MoSPI Digital Competency
                            </span>
                        </div>
                        <h1 class="text-2xl font-black text-navy-900 mt-2 font-sans" style="color: #0B2545;">
                            Digital Competency & Skill-Gap Assessment
                        </h1>
                    </div>
                    <span class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                        Step <span id="currentStepNumber">${currentAssessmentStep}</span> of 6
                    </span>
                </div>

                <!-- Step Progress Bar -->
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div id="assessmentProgressBar" class="bg-navy-900 h-full rounded-full transition-all duration-300" style="width: ${(currentAssessmentStep / 6) * 100}%; background: #0B2545;"></div>
                </div>

                <!-- Stepper Badges -->
                <div class="grid grid-cols-6 gap-1 text-center text-[10px] font-bold text-slate-400">
                    <span class="${currentAssessmentStep >= 1 ? 'text-navy-900 font-black' : ''}">1. Learner Profile</span>
                    <span class="${currentAssessmentStep >= 2 ? 'text-navy-900 font-black' : ''}">2. Self Rate</span>
                    <span class="${currentAssessmentStep >= 3 ? 'text-navy-900 font-black' : ''}">3. Methods</span>
                    <span class="${currentAssessmentStep >= 4 ? 'text-navy-900 font-black' : ''}">4. Technical</span>
                    <span class="${currentAssessmentStep >= 5 ? 'text-navy-900 font-black' : ''}">5. Governance</span>
                    <span class="${currentAssessmentStep >= 6 ? 'text-emerald-700 font-black' : ''}">6. AI Profile</span>
                </div>
            </div>

            <!-- Dynamic Step Content -->
            <div id="assessmentStepContainer">
                ${getAssessmentStepHTML(currentAssessmentStep, user, state)}
            </div>

            <!-- Navigation Controls -->
            <div class="flex items-center justify-between pt-6 border-t border-slate-100">
                <button onclick="prevAssessmentStep()" id="prevStepBtn" class="btn btn-secondary text-xs py-2 px-5 ${currentAssessmentStep === 1 ? 'invisible' : ''}">
                    <i class="fa-solid fa-arrow-left"></i> Previous
                </button>

                <div class="flex items-center gap-3">
                    ${currentAssessmentStep < 6 ? `
                        <button onclick="nextAssessmentStep()" class="btn btn-primary text-xs py-2 px-6">
                            ${currentAssessmentStep === 1 ? ((window.isProfileSaved || (user && user.profileCompleted)) && !window.isProfileEditing ? 'Proceed to Assessment →' : 'Save Profile & Proceed to Assessment →') : 'Next Step <i class="fa-solid fa-arrow-right"></i>'}
                        </button>
                    ` : `
                        <button onclick="finalizeAssessment()" class="btn btn-saffron text-xs py-2.5 px-6 shadow-md shadow-orange-600/30">
                            <i class="fa-solid fa-check-double"></i> Save Profile & View Learning Path
                        </button>
                    `}
                </div>
            </div>
        </div>
    </div>
    `;
}

function getAssessmentStepHTML(step, user, state) {
    if (step === 1) {
        const desig = (typeof user.designation === 'object' && user.designation)
            ? (user.designation.title || user.designation.name || 'Senior Statistical Officer (SSO)')
            : (String(user.designation || user.role || '').trim() === '[object Object]' || !(user.designation || user.role) ? 'Senior Statistical Officer (SSO)' : String(user.designation || user.role));
        const exp = (user.experienceYears !== undefined && user.experienceYears !== null) ? user.experienceYears : ((user.experience_years !== undefined && user.experience_years !== null) ? user.experience_years : '');
        const degree = user.degree || "";
        const spec = user.specialization || "";
        const domains = user.statisticalDomains || user.statistical_domains || "";
        const tools = user.technicalQualifications || user.technical_qualifications || "";
        const prevRoles = user.previousRoles || user.previous_roles || "";
        const training = user.trainingProgrammes || user.training_programmes || "";
        const assignment = user.currentAssignment || user.current_assignment || "";
        const location = user.location || "";
        const projects = user.projectsHandled || user.projects_handled || "";
        const empId = user.employeeId || user.employee_id || 'ISS/2026/84920';
        const contactInfo = user.mobile ? `+91 ${user.mobile} • ${user.email || ''}` : (user.email || 'officer@gov.nic.in');

        const currentMinistry = user.ministry || "Ministry of Statistics & Programme Implementation (MoSPI)";
        const allMinistries = typeof window.getAllMinistriesList === 'function' ? window.getAllMinistriesList() : [
            "Ministry of Statistics & Programme Implementation (MoSPI)",
            "Ministry of Finance",
            "Ministry of Agriculture & Farmers Welfare",
            "Ministry of Commerce & Industry",
            "Ministry of Health & Family Welfare",
            "Ministry of Jal Shakti",
            "Ministry of Labour & Employment",
            "Ministry of Rural Development",
            "Ministry of Education",
            "Ministry of Electronics & Information Technology (MeitY)",
            "NITI Aayog (National Institution for Transforming India)"
        ];
        if (!allMinistries.includes(currentMinistry) && currentMinistry) {
            allMinistries.unshift(currentMinistry);
        }

        const allDepts = typeof window.getDepartmentsForMinistry === 'function' ? window.getDepartmentsForMinistry(currentMinistry) : [
            "National Statistical Office (NSO - SDRD)",
            "National Statistical Office (NSO - FOD)",
            "National Statistical Office (NSO - NAD)",
            "National Statistical Office (NSO - ESD)",
            "National Statistical Office (NSO - PSD)",
            "National Statistical Office (NSO - SSD)",
            "National Statistical Systems Training Academy (NSSTA)"
        ];
        if (user.department && !allDepts.includes(user.department)) {
            allDepts.unshift(user.department);
        }

        const allDesignations = typeof window.getAllDesignationsList === 'function' ? window.getAllDesignationsList() : [
            "Senior Statistical Officer (SSO) — SSS Cadre",
            "Junior Statistical Officer (JSO) — SSS Cadre",
            "Assistant Director (Statistics / Data Analytics) — ISS Cadre",
            "Deputy Director (Survey Operations / National Accounts) — ISS Cadre",
            "Joint Director (Economic Statistics / Macroeconomics) — ISS Cadre",
            "Director (Survey Design / Official Statistics) — ISS Cadre",
            "Deputy Director General (DDG - Statistical Cadre)",
            "Additional Director General (ADG - Official Statistics)",
            "Director General (NSO / Central Statistical System)",
            "District Statistical Officer (DSO) — State DES",
            "Assistant Statistical Officer (ASO) — State Statistical Cadre",
            "Statistical Investigator / Survey Field Officer (FOD)"
        ];
        if (desig && !allDesignations.some(d => d.includes(desig) || desig.includes(d.split('—')[0].trim()))) {
            allDesignations.unshift(desig);
        }

        const isSaved = (window.isProfileSaved || (user && user.profileCompleted)) && !window.isProfileEditing;
        const isEditing = Boolean(window.isProfileEditing);
        const isCadreEditable = isEditing || (!isSaved && window.isCadreUnlocked);

        return `
        <div class="space-y-6">
            <!-- Dynamic Validation Alert Banner -->
            <div id="profileStepErrorBanner" class="hidden"></div>

            ${isSaved ? `
                <div class="p-4 bg-emerald-50/90 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <div class="text-xs space-y-0.5">
                            <div class="font-extrabold text-emerald-950 text-sm flex items-center gap-2">
                                <span>Official Digital Competency Profile Saved</span>
                                <span class="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Calibrated</span>
                            </div>
                            <p class="text-emerald-800">
                                Your baseline profile is securely stored in the system. Click "Edit Profile" if you need to update any posting, cadre, or academic records.
                            </p>
                        </div>
                    </div>
                    <button type="button" onclick="toggleEditSavedProfile()" class="text-xs font-bold text-blue-800 bg-white hover:bg-blue-50 border border-blue-300 px-3.5 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm self-start sm:self-auto flex-shrink-0">
                        <i class="fa-solid fa-pen-to-square text-blue-600"></i> Edit Profile
                    </button>
                </div>
            ` : isEditing ? `
                <div class="p-4 bg-blue-50/90 border border-blue-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow">
                            <i class="fa-solid fa-user-pen"></i>
                        </div>
                        <div class="text-xs space-y-0.5">
                            <span class="font-extrabold text-blue-950 text-sm">Profile Editing Mode Active</span>
                            <p class="text-blue-800">
                                Modify your posting, cadre, or qualifications below, then click "Done Editing" or "Proceed to Assessment" to save changes.
                            </p>
                        </div>
                    </div>
                    <button type="button" onclick="toggleEditSavedProfile()" class="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-3.5 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm self-start sm:self-auto flex-shrink-0">
                        <i class="fa-solid fa-check text-emerald-700"></i> Done Editing
                    </button>
                </div>
            ` : `
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
                    <div class="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow">
                        <i class="fa-solid fa-user-shield"></i>
                    </div>
                    <div class="text-xs space-y-1">
                        <span class="font-extrabold text-blue-900 text-sm">Block 1 — Official Digital Competency Profile</span>
                        <p class="text-slate-600 leading-relaxed">
                            Please provide your official posting, educational background, and domain experience below. All fields marked with <span class="text-red-500 font-bold">*</span> are mandatory for competency calibration and database profile creation.
                        </p>
                    </div>
                </div>
            `}

            <!-- 1. Official Cadre & Registration Record -->
            <div class="p-4 ${isCadreEditable ? 'bg-blue-50/40 border-blue-300' : 'bg-slate-50/80 border-slate-200'} rounded-2xl border space-y-3 transition-all">
                <div class="flex items-center justify-between border-b ${isCadreEditable ? 'border-blue-200' : 'border-slate-200'} pb-2">
                    <div class="flex items-center gap-2">
                        <h3 class="text-xs font-black uppercase tracking-wider ${isCadreEditable ? 'text-blue-900' : 'text-slate-700'} flex items-center gap-2">
                            <i class="fa-solid fa-id-card text-blue-600"></i> 1. Official Service Profile
                        </h3>
                    </div>
                    ${!isSaved ? `
                        <button type="button" onclick="toggleUnlockCadre()" class="text-[11px] font-bold ${isCadreEditable ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-300' : 'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-300'} px-3 py-1.5 rounded-lg border transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm">
                            <i class="fa-solid ${isCadreEditable ? 'fa-check' : 'fa-user-pen'}"></i>
                            ${isCadreEditable ? 'Done Editing' : 'Edit Cadre'}
                        </button>
                    ` : ''}
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                        <label class="font-bold text-slate-600 block mb-1">Official Name</label>
                        <div class="relative">
                            <input type="text" id="prof_name" value="${user.name || ''}" disabled class="w-full p-2.5 bg-slate-100/90 border border-slate-200 text-slate-800 font-semibold cursor-not-allowed select-none rounded-lg" placeholder="e.g. Dr. Rajesh Sharma">
                            <span class="absolute right-3 top-2.5 text-slate-400"><i class="fa-solid fa-lock text-xs"></i></span>
                        </div>
                    </div>
                    <div>
                        <label class="font-bold text-slate-600 block mb-1">Cadre Code / Government Employee ID</label>
                        <div class="relative">
                            <input type="text" id="prof_empId" value="${empId}" disabled class="w-full p-2.5 bg-slate-100/90 border border-slate-200 rounded-lg text-slate-800 font-semibold cursor-not-allowed select-none">
                            <span class="absolute right-3 top-2.5 text-slate-400"><i class="fa-solid fa-lock text-xs"></i></span>
                        </div>
                    </div>
                    <div>
                        <label class="font-bold ${isCadreEditable ? 'text-blue-900' : 'text-slate-600'} block mb-1">Ministry / Administration ${isCadreEditable ? '<span class="text-red-500">*</span>' : ''}</label>
                        <div class="relative">
                            ${isCadreEditable ? `
                                <select id="prof_ministry" onchange="onAssessmentMinistryChange()" class="w-full p-2.5 bg-white border-blue-400 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 border rounded-lg shadow-sm">
                                    ${allMinistries.map(m => `<option value="${m}" ${m.toLowerCase() === currentMinistry.toLowerCase() || (m.includes('Statistics') && currentMinistry.includes('Statistics')) ? 'selected' : ''}>${m}</option>`).join('')}
                                </select>
                            ` : `
                                <input type="text" id="prof_ministry" value="${currentMinistry}" disabled class="w-full p-2.5 bg-slate-100/90 border-slate-200 text-slate-800 font-semibold cursor-not-allowed select-none border rounded-lg">
                                <span class="absolute right-3 top-2.5 text-slate-400"><i class="fa-solid fa-lock text-xs"></i></span>
                            `}
                        </div>
                        <div id="err_prof_ministry" class="hidden text-red-600 text-[11px] font-bold mt-1 flex items-center gap-1"><i class="fa-solid fa-circle-exclamation"></i> Ministry is required.</div>
                    </div>
                    <div>
                        <label class="font-bold ${isCadreEditable ? 'text-blue-900' : 'text-slate-600'} block mb-1">Department / Division ${isCadreEditable ? '<span class="text-red-500">*</span>' : ''}</label>
                        <div class="relative">
                            ${isCadreEditable ? `
                                <select id="prof_dept" onchange="clearAssessmentFieldError('prof_dept')" class="w-full p-2.5 bg-white border-blue-400 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 border rounded-lg shadow-sm">
                                    ${allDepts.map(d => `<option value="${d}" ${d.toLowerCase() === String(user.department || '').toLowerCase() ? 'selected' : ''}>${d}</option>`).join('')}
                                </select>
                            ` : `
                                <input type="text" id="prof_dept" value="${user.department || 'National Statistical Office (NSO - SDRD)'}" disabled class="w-full p-2.5 bg-slate-100/90 border-slate-200 text-slate-800 font-semibold cursor-not-allowed select-none border rounded-lg">
                                <span class="absolute right-3 top-2.5 text-slate-400"><i class="fa-solid fa-lock text-xs"></i></span>
                            `}
                        </div>
                        <div id="err_prof_dept" class="hidden text-red-600 text-[11px] font-bold mt-1 flex items-center gap-1"><i class="fa-solid fa-circle-exclamation"></i> Department is required.</div>
                    </div>
                    <div>
                        <label class="font-bold ${isCadreEditable ? 'text-blue-900' : 'text-slate-600'} block mb-1">Designation / Role ${isCadreEditable ? '<span class="text-red-500">*</span>' : ''}</label>
                        <div class="relative">
                            ${isCadreEditable ? `
                                <select id="prof_desig" onchange="clearAssessmentFieldError('prof_desig')" class="w-full p-2.5 bg-white border-blue-400 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 border rounded-lg shadow-sm">
                                    ${allDesignations.map(des => `<option value="${des}" ${des.toLowerCase().includes(desig.toLowerCase()) || desig.toLowerCase().includes(des.toLowerCase().split('—')[0].trim()) ? 'selected' : ''}>${des}</option>`).join('')}
                                </select>
                            ` : `
                                <input type="text" id="prof_desig" value="${desig}" disabled class="w-full p-2.5 bg-slate-100/90 border-slate-200 text-slate-800 font-semibold cursor-not-allowed select-none border rounded-lg">
                                <span class="absolute right-3 top-2.5 text-slate-400"><i class="fa-solid fa-lock text-xs"></i></span>
                            `}
                        </div>
                        <div id="err_prof_desig" class="hidden text-red-600 text-[11px] font-bold mt-1 flex items-center gap-1"><i class="fa-solid fa-circle-exclamation"></i> Designation is required.</div>
                    </div>
                    <div>
                        <label class="font-bold text-slate-600 block mb-1">Authenticated Contact</label>
                        <div class="relative">
                            <input type="text" value="${contactInfo}" disabled class="w-full p-2.5 bg-slate-100/90 border border-slate-200 rounded-lg text-slate-800 font-semibold cursor-not-allowed select-none">
                            <span class="absolute right-3 top-2.5 text-emerald-600"><i class="fa-solid fa-circle-check text-xs"></i></span>
                        </div>
                    </div>
                </div>

                <!-- Framework Role Grade & D6 Competencies Tag -->
                <div class="mt-2 p-2.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200 rounded-xl text-xs space-y-1.5 shadow-xs">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-blue-900 flex items-center gap-1.5">
                            <i class="fa-solid fa-layer-group text-blue-600"></i>
                            Role Grade: <span class="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-extrabold uppercase">${user.roleGrade || user.role_grade || 'R3'}</span>
                        </span>
                        <span class="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                            Sector: <b class="text-blue-700">${user.sectorTag || user.sector_tag || 'Official Statistics'}</b>
                        </span>
                    </div>
                    <div class="text-[11px] text-slate-600">
                        <span class="font-semibold text-slate-700">D6 Sectoral Competencies:</span>
                        <span class="text-blue-950 font-bold ml-1">${user.d6Competencies || user.d6_competencies || 'Statistical Methodology & Data Validation'}</span>
                    </div>
                </div>
            </div>

            <!-- 2. Posting & Current Statistical Assignment -->
            <div class="space-y-3">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                    <i class="fa-solid fa-building-columns text-orange-500"></i> 2. Current Posting & Statistical Assignment
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Location of Workplace / Posting Office <span class="text-red-500 font-bold">*</span></label>
                        <input type="text" id="prof_location" value="${location}" ${isSaved ? 'disabled' : ''} oninput="clearAssessmentFieldError('prof_location')" class="w-full p-2.5 ${isSaved ? 'bg-slate-100/90 border-slate-200 text-slate-800 font-semibold cursor-not-allowed select-none' : 'bg-white border-slate-300 text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 shadow-sm'} border rounded-lg transition-all" placeholder="e.g. Sankhyiki Bhawan, New Delhi or Regional Office, Pune">
                        <div id="err_prof_location" class="hidden text-red-600 text-[11px] font-bold mt-1 flex items-center gap-1"><i class="fa-solid fa-circle-exclamation"></i> Please enter your workplace / posting office location.</div>
                    </div>
                    <div class="sm:col-span-1">
                        <label class="font-bold text-slate-700 block mb-1">Current Survey & Statistical Assignment <span class="text-red-500 font-bold">*</span></label>
                        <input type="text" id="prof_assignment" value="${assignment}" ${isSaved ? 'disabled' : ''} oninput="clearAssessmentFieldError('prof_assignment')" class="w-full p-2.5 ${isSaved ? 'bg-slate-100/90 border-slate-200 text-slate-800 font-semibold cursor-not-allowed select-none' : 'bg-white border-slate-300 text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 shadow-sm'} border rounded-lg transition-all" placeholder="e.g. Periodic Labour Force Survey (PLFS), National Accounts, Price Indices">
                        <div id="err_prof_assignment" class="hidden text-red-600 text-[11px] font-bold mt-1 flex items-center gap-1"><i class="fa-solid fa-circle-exclamation"></i> Please specify your current statistical assignment or survey.</div>
                    </div>
                </div>
            </div>

            <!-- 3. Educational & Technical Qualifications -->
            <div class="space-y-3 pt-1">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                    <i class="fa-solid fa-graduation-cap text-orange-500"></i> 3. Higher Education & Technical Qualifications
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Higher Education / Highest Degree <span class="text-red-500 font-bold">*</span></label>
                        <select id="prof_degree" ${isSaved ? 'disabled' : ''} onchange="clearAssessmentFieldError('prof_degree')" class="w-full p-2.5 ${isSaved ? 'bg-slate-100/90 border-slate-200 text-slate-800 font-semibold cursor-not-allowed select-none' : 'bg-white border-slate-300 text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 shadow-sm'} border rounded-lg transition-all">
                            <option value="" disabled ${!degree ? 'selected' : ''}>-- Select Highest Academic Degree --</option>
                            <option value="M.Sc. Statistics" ${degree === 'M.Sc. Statistics' ? 'selected' : ''}>M.Sc. Statistics</option>
                            <option value="M.A. Economics / Econometrics" ${degree.includes('Economics') || degree.includes('Econometrics') ? 'selected' : ''}>M.A. Economics / Econometrics</option>
                            <option value="B.Tech / B.E. (Computer Science / Data Science)" ${degree.includes('Tech') || degree.includes('B.E.') ? 'selected' : ''}>B.Tech / B.E. (Data Science / IT)</option>
                            <option value="Ph.D. Statistics / Economics" ${degree.includes('Ph.D') ? 'selected' : ''}>Ph.D. Statistics / Economics</option>
                            <option value="B.Sc. Mathematics / Statistics" ${degree.includes('B.Sc') ? 'selected' : ''}>B.Sc. Mathematics / Statistics</option>
                            <option value="MCA / Master in Data Analytics" ${degree.includes('MCA') || degree.includes('Analytics') ? 'selected' : ''}>MCA / Master in Data Analytics</option>
                            <option value="Other Post Graduate Degree" ${degree.includes('Other') ? 'selected' : ''}>Other Post Graduate / Master Degree</option>
                        </select>
                        <div id="err_prof_degree" class="hidden text-red-600 text-[11px] font-bold mt-1 flex items-center gap-1"><i class="fa-solid fa-circle-exclamation"></i> Please select your highest educational qualification.</div>
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Specialization / Subject Area</label>
                        <input type="text" id="prof_spec" value="${spec}" ${isSaved ? 'disabled' : ''} class="w-full p-2.5 ${isSaved ? 'bg-slate-100/90 border-slate-200 text-slate-800 font-semibold cursor-not-allowed select-none' : 'bg-white border-slate-300 text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 shadow-sm'} border rounded-lg" placeholder="e.g. Mathematical Statistics, Sampling, Econometrics, Data Science">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-bold text-slate-700 block mb-1">Statistical & Data Science Tools Known</label>
                        <input type="text" id="prof_tools" value="${tools}" ${isSaved ? 'disabled' : ''} class="w-full p-2.5 ${isSaved ? 'bg-slate-100/90 border-slate-200 text-slate-800 font-semibold cursor-not-allowed select-none' : 'bg-white border-slate-300 text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 shadow-sm'} border rounded-lg" placeholder="Type tools or click badges below (e.g. Python, R, SPSS, SQL, Excel)">
                        ${!isSaved ? `
                            <div class="flex flex-wrap gap-1.5 pt-1.5">
                                ${['Python', 'R', 'SPSS', 'Stata', 'SQL', 'Power BI', 'Advanced Excel', 'GIS / QGIS'].map(t => `
                                    <button type="button" onclick="toggleToolBadge('${t}')" class="text-[11px] font-bold px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 transition-all cursor-pointer">
                                        + ${t}
                                    </button>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>

            <!-- 4. Experience & Statistical Domains -->
            <div class="space-y-3 pt-1">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                    <i class="fa-solid fa-briefcase text-orange-500"></i> 4. Experience & Statistical Domains
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Years of Experience in Official Statistics <span class="text-red-500 font-bold">*</span></label>
                        <select id="prof_exp" ${isSaved ? 'disabled' : ''} onchange="clearAssessmentFieldError('prof_exp')" class="w-full p-2.5 ${isSaved ? 'bg-slate-100/90 border-slate-200 text-slate-800 font-semibold cursor-not-allowed select-none' : 'bg-white border-slate-300 text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 shadow-sm'} border rounded-lg transition-all">
                            <option value="" disabled ${exp === '' ? 'selected' : ''}>-- Select Total Years of Experience --</option>
                            <option value="1.5" ${exp !== '' && exp < 2 ? 'selected' : ''}>0 - 2 Years (Junior / Induction Level)</option>
                            <option value="4.0" ${exp !== '' && exp >= 2 && exp < 6 ? 'selected' : ''}>3 - 5 Years (Mid-Level Practitioner)</option>
                            <option value="8.0" ${exp !== '' && exp >= 6 && exp < 12 ? 'selected' : ''}>6 - 10 Years (Senior Cadre Specialist)</option>
                            <option value="15.0" ${exp !== '' && exp >= 12 ? 'selected' : ''}>10+ Years (Leadership / Directorate Level)</option>
                        </select>
                        <div id="err_prof_exp" class="hidden text-red-600 text-[11px] font-bold mt-1 flex items-center gap-1"><i class="fa-solid fa-circle-exclamation"></i> Please select your total years of experience.</div>
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Previous Cadres / Roles Worked In</label>
                        <input type="text" id="prof_prevRoles" value="${prevRoles}" ${isSaved ? 'disabled' : ''} class="w-full p-2.5 ${isSaved ? 'bg-slate-100/90 border-slate-200 text-slate-800 font-semibold cursor-not-allowed select-none' : 'bg-white border-slate-300 text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 shadow-sm'} border rounded-lg" placeholder="e.g. Statistical Investigator, Junior Statistical Officer, Research Fellow">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-bold text-slate-700 block mb-1">Statistical Domains Worked In <span class="text-red-500 font-bold">*</span></label>
                        <input type="text" id="prof_domains" value="${domains}" ${isSaved ? 'disabled' : ''} oninput="clearAssessmentFieldError('prof_domains')" class="w-full p-2.5 ${isSaved ? 'bg-slate-100/90 border-slate-200 text-slate-800 font-semibold cursor-not-allowed select-none' : 'bg-white border-slate-300 text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 shadow-sm'} border rounded-lg transition-all" placeholder="e.g. Survey Design, Sampling, National Accounts, Price Indices, Economic Census">
                        <div id="err_prof_domains" class="hidden text-red-600 text-[11px] font-bold mt-1 flex items-center gap-1"><i class="fa-solid fa-circle-exclamation"></i> Please specify the statistical domains you have worked in.</div>
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-bold text-slate-700 block mb-1">Key Surveys / Projects Handled</label>
                        <input type="text" id="prof_projects" value="${projects}" ${isSaved ? 'disabled' : ''} class="w-full p-2.5 ${isSaved ? 'bg-slate-100/90 border-slate-200 text-slate-800 font-semibold cursor-not-allowed select-none' : 'bg-white border-slate-300 text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 shadow-sm'} border rounded-lg" placeholder="e.g. Periodic Labour Force Survey (PLFS), Consumer Expenditure Survey (CES), Annual Survey of Industries (ASI)">
                    </div>
                </div>
            </div>

            <!-- 5. Pre-Training History -->
            <div class="space-y-3 pt-1">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                    <i class="fa-solid fa-award text-orange-500"></i> 5. Prior Training History & Academies Attended
                </h3>
                <div class="space-y-2 text-xs">
                    <label class="font-bold text-slate-700 block">Pre-Training / Courses Attended</label>
                    <input type="text" id="prof_training" value="${training}" ${isSaved ? 'disabled' : ''} class="w-full p-2.5 ${isSaved ? 'bg-slate-100/90 border-slate-200 text-slate-800 font-semibold cursor-not-allowed select-none' : 'bg-white border-slate-300 text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 shadow-sm'} border rounded-lg" placeholder="e.g. NSSTA Greater Noida (Survey Sampling), Indian Statistical Institute (ISI), iGOT Karmayogi, or None">
                </div>
            </div>
        </div>
        `;
    } else if (step === 2) {
        const activeUser = user || (window.store && window.store.state && window.store.state.user) || {};
        const roleGrade = (typeof window.getOfficerRoleGrade === 'function') 
            ? window.getOfficerRoleGrade(activeUser) 
            : (activeUser.roleGrade || activeUser.role_grade || 'R3');
        const desigTitle = activeUser.designation || 'Assistant Director (Statistics)';
        const levelNames = window.FRAMEWORK_LEVEL_NAMES || { 
            1: "Awareness", 
            2: "Working (Routine)", 
            3: "Practitioner", 
            4: "Advanced", 
            5: "Expert / Strategic" 
        };
        const levelDescs = window.FRAMEWORK_LEVEL_SUBTITLES || {};

        const statComps = [
            { key: "Survey Design", label: "Survey Design & Questionnaire Formulation" },
            { key: "Sampling", label: "Multi-Stage Probability Sampling & Weighting" },
            { key: "National Accounts", label: "National Accounts (SNA 2008) & GVA Compilation" }
        ];

        return `
        <div class="space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                    <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">Step 2 — Core Statistical Competencies Self-Rating</h2>
                    <p class="text-xs text-slate-600">Rate your current capability against your cadre's required proficiency scale.</p>
                </div>
                <div class="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-800 flex items-center gap-2 self-start sm:self-auto shadow-xs">
                    <i class="fa-solid fa-id-badge text-blue-600"></i>
                    <span>Cadre: <strong>${roleGrade}</strong> (${desigTitle})</span>
                </div>
            </div>

            <div class="space-y-4 text-xs">
                ${statComps.map(item => {
                    const roleReq = (typeof window.getCompetencyFrameworkBenchmark === 'function')
                        ? window.getCompetencyFrameworkBenchmark(item.key, activeUser)
                        : 3;
                    
                    // Clamp initial and stored rating strictly within [1, roleReq]
                    const currentVal = Math.min(Math.max(1, assessmentResponses.selfRatings[item.key] || Math.min(2, roleReq)), roleReq);
                    assessmentResponses.selfRatings[item.key] = currentVal;
                    
                    const isQualified = currentVal >= roleReq;

                    return `
                    <div class="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs transition-all hover:border-blue-300">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                            <div class="space-y-1">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="font-bold text-navy-900 text-sm" style="color: #0B2545;">${item.label}</span>
                                    <span class="px-2.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-md font-extrabold text-[10px] inline-flex items-center gap-1 shadow-2xs">
                                        <i class="fa-solid fa-bullseye text-blue-600"></i> ${roleGrade} Target: Level ${roleReq} (${levelNames[roleReq] || 'Target'})
                                    </span>
                                </div>
                                <p class="text-[11px] text-slate-500">
                                    ${levelDescs[roleReq] || 'Cadre benchmark standard for official statistical duties.'}
                                </p>
                            </div>
                            <div class="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                                <span class="text-xs font-black px-3 py-1 rounded-lg ${isQualified ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}" id="rate_val_${item.key}">
                                    Level ${currentVal} / ${roleReq} ${isQualified ? '✓ Meets Cadre Target' : `(Gap: -${roleReq - currentVal})`}
                                </span>
                            </div>
                        </div>

                        <div class="space-y-2 pt-1">
                            <div class="flex items-center justify-between text-[11px] font-bold text-slate-600 px-0.5">
                                <span>Current Rating: <strong class="text-blue-700" id="rate_label_${item.key}">Level ${currentVal} — ${levelNames[currentVal] || 'Level ' + currentVal}</strong></span>
                                <span class="text-[10px] text-slate-400">Scale: Level 1 to ${roleReq} (${roleGrade} Cadre Max)</span>
                            </div>

                            <input type="range" 
                                   min="1" 
                                   max="${roleReq}" 
                                   step="1"
                                   value="${currentVal}" 
                                   oninput="updateSelfRating('${item.key}', this.value, ${roleReq})" 
                                   class="w-full accent-blue-600 cursor-pointer h-2.5 bg-slate-200 rounded-lg">

                            <div class="flex justify-between text-[10px] font-semibold text-slate-500 pt-0.5 px-0.5">
                                ${Array.from({ length: roleReq }, (_, i) => i + 1).map(lvl => `
                                    <span class="${lvl === currentVal ? 'text-blue-700 font-extrabold' : (lvl === roleReq ? 'text-indigo-700 font-bold' : 'text-slate-400')}">
                                        ${lvl}. ${levelNames[lvl] || 'Level ' + lvl} ${lvl === roleReq ? '★ Cadre Target' : ''}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
        `;
    } else if (step === 3) {
        return `
        <div class="space-y-4">
            <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">Step 3 — Applied Methodology Evaluation</h2>
            <p class="text-xs text-slate-600">Answer this calibration question on official survey sampling and multiplier weights.</p>

            <div class="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3 text-xs">
                <span class="font-bold text-navy-900 block">
                    Q: In the Periodic Labour Force Survey (PLFS), why are First Stage Units (Census Villages / UFS Blocks) selected with Probability Proportional to Size with Replacement (PPSWR)?
                </span>
                <div class="space-y-2">
                    <label class="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="methodQ1" checked class="accent-orange-600">
                        <span>To ensure larger population clusters have higher selection probability, minimizing variance of national totals.</span>
                    </label>
                    <label class="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="methodQ1" class="accent-orange-600">
                        <span>To ensure all villages have an strictly identical probability of selection regardless of size.</span>
                    </label>
                    <label class="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="methodQ1" class="accent-orange-600">
                        <span>To eliminate the requirement for listing households inside the selected village.</span>
                    </label>
                </div>
            </div>
        </div>
        `;
    } else if (step === 4) {
        const activeUser = user || (window.store && window.store.state && window.store.state.user) || {};
        const roleGrade = (typeof window.getOfficerRoleGrade === 'function') 
            ? window.getOfficerRoleGrade(activeUser) 
            : (activeUser.roleGrade || activeUser.role_grade || 'R3');
        const desigTitle = activeUser.designation || 'Assistant Director (Statistics)';
        const levelNames = window.FRAMEWORK_LEVEL_NAMES || { 
            1: "Awareness", 
            2: "Working (Routine)", 
            3: "Practitioner", 
            4: "Advanced", 
            5: "Expert / Strategic" 
        };
        const levelDescs = window.FRAMEWORK_LEVEL_SUBTITLES || {};

        const techComps = [
            { key: "Python", label: "Python Programming (Pandas, NumPy, Multiplier Aggregations)" },
            { key: "AI/ML", label: "Machine Learning & AI (Imputation, NLP, Anomaly Detection)" },
            { key: "Data Visualization", label: "Data Visualization (Power BI, Dashboards, Infographics)" }
        ];

        return `
        <div class="space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                    <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">Step 4 — Technical & Data Science Proficiency</h2>
                    <p class="text-xs text-slate-600">Rate your current capability with programming and analytical tools against your cadre benchmark.</p>
                </div>
                <div class="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-800 flex items-center gap-2 self-start sm:self-auto shadow-xs">
                    <i class="fa-solid fa-id-badge text-blue-600"></i>
                    <span>Cadre: <strong>${roleGrade}</strong> (${desigTitle})</span>
                </div>
            </div>

            <div class="space-y-4 text-xs">
                ${techComps.map(item => {
                    const roleReq = (typeof window.getCompetencyFrameworkBenchmark === 'function')
                        ? window.getCompetencyFrameworkBenchmark(item.key, activeUser)
                        : 3;
                    
                    // Clamp initial and stored rating strictly within [1, roleReq]
                    const currentVal = Math.min(Math.max(1, assessmentResponses.selfRatings[item.key] || Math.min(2, roleReq)), roleReq);
                    assessmentResponses.selfRatings[item.key] = currentVal;
                    
                    const isQualified = currentVal >= roleReq;

                    return `
                    <div class="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs transition-all hover:border-blue-300">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                            <div class="space-y-1">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="font-bold text-navy-900 text-sm" style="color: #0B2545;">${item.label}</span>
                                    <span class="px-2.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-md font-extrabold text-[10px] inline-flex items-center gap-1 shadow-2xs">
                                        <i class="fa-solid fa-bullseye text-blue-600"></i> ${roleGrade} Target: Level ${roleReq} (${levelNames[roleReq] || 'Target'})
                                    </span>
                                </div>
                                <p class="text-[11px] text-slate-500">
                                    ${levelDescs[roleReq] || 'Cadre benchmark standard for official statistical duties.'}
                                </p>
                            </div>
                            <div class="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                                <span class="text-xs font-black px-3 py-1 rounded-lg ${isQualified ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}" id="rate_val_${item.key}">
                                    Level ${currentVal} / ${roleReq} ${isQualified ? '✓ Meets Cadre Target' : `(Gap: -${roleReq - currentVal})`}
                                </span>
                            </div>
                        </div>

                        <div class="space-y-2 pt-1">
                            <div class="flex items-center justify-between text-[11px] font-bold text-slate-600 px-0.5">
                                <span>Current Rating: <strong class="text-blue-700" id="rate_label_${item.key}">Level ${currentVal} — ${levelNames[currentVal] || 'Level ' + currentVal}</strong></span>
                                <span class="text-[10px] text-slate-400">Scale: Level 1 to ${roleReq} (${roleGrade} Cadre Max)</span>
                            </div>

                            <input type="range" 
                                   min="1" 
                                   max="${roleReq}" 
                                   step="1"
                                   value="${currentVal}" 
                                   oninput="updateSelfRating('${item.key}', this.value, ${roleReq})" 
                                   class="w-full accent-blue-600 cursor-pointer h-2.5 bg-slate-200 rounded-lg">

                            <div class="flex justify-between text-[10px] font-semibold text-slate-500 pt-0.5 px-0.5">
                                ${Array.from({ length: roleReq }, (_, i) => i + 1).map(lvl => `
                                    <span class="${lvl === currentVal ? 'text-blue-700 font-extrabold' : (lvl === roleReq ? 'text-indigo-700 font-bold' : 'text-slate-400')}">
                                        ${lvl}. ${levelNames[lvl] || 'Level ' + lvl} ${lvl === roleReq ? '★ Cadre Target' : ''}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
        `;
    } else if (step === 5) {
        return `
        <div class="space-y-4">
            <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">Step 5 — Data Governance & Privacy Compliance (DPDP Act)</h2>
            <p class="text-xs text-slate-600">Confirm your operational understanding of official microdata governance.</p>

            <div class="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3 text-xs">
                <span class="font-bold text-navy-900 block">
                    Q: Under the DPDP Act 2023 and official statistical microdata dissemination standards, what technique is mandatory to prevent re-identification of respondent households?
                </span>
                <div class="space-y-2">
                    <label class="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="govQ1" checked class="accent-orange-600">
                        <span>Anonymization via k-anonymity, top-coding outlier income fields, and suppressing micro-geographic identifiers.</span>
                    </label>
                    <label class="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="govQ1" class="accent-orange-600">
                        <span>Only encrypting the database file with a password before public website upload.</span>
                    </label>
                </div>
            </div>
        </div>
        `;
    } else {
        const activeUser = user || (window.store && window.store.state && window.store.state.user) || {};
        const roleGrade = (typeof window.getOfficerRoleGrade === 'function') 
            ? window.getOfficerRoleGrade(activeUser) 
            : (activeUser.roleGrade || activeUser.role_grade || 'R3');

        // Dynamically compute primary gap against role requirements
        let primaryGapName = "AI / ML";
        let primaryGapTarget = 2;
        let primaryGapCurrent = 1;
        let maxGap = 0;

        const evaluatedComps = ["Survey Design", "Sampling", "National Accounts", "Python", "AI/ML", "Data Visualization"];
        evaluatedComps.forEach(k => {
            const req = (typeof window.getCompetencyFrameworkBenchmark === 'function') 
                ? window.getCompetencyFrameworkBenchmark(k, activeUser) 
                : 3;
            const curr = assessmentResponses.selfRatings[k] || 1;
            const gap = Math.max(0, req - curr);
            if (gap > maxGap) {
                maxGap = gap;
                primaryGapName = k;
                primaryGapTarget = req;
                primaryGapCurrent = curr;
            }
        });

        const gapDisplay = maxGap > 0 
            ? `${primaryGapName} (L${primaryGapCurrent}→L${primaryGapTarget})` 
            : `Cadre Benchmark Met (L${primaryGapTarget})`;

        return `
        <div class="space-y-6 text-center">
            <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-md">
                <i class="fa-solid fa-chart-radar"></i>
            </div>
            <div>
                <h2 class="text-xl font-black text-navy-900" style="color: #0B2545;">AI Digital Competency Assessment Complete!</h2>
                <p class="text-xs text-slate-600 max-w-md mx-auto mt-1">
                    Your personalized competency radar has been calibrated against your <strong>${roleGrade} Cadre Benchmarks</strong> and aligned with iGOT Karmayogi learning pathways.
                </p>
            </div>

            <div class="grid grid-cols-3 gap-3 max-w-lg mx-auto text-xs">
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span class="text-slate-500 block text-[10px]">Competency Score</span>
                    <span class="text-2xl font-black text-navy-900">74%</span>
                    <span class="text-[10px] text-emerald-600 font-bold block mt-0.5">↑ +6% Gain</span>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span class="text-slate-500 block text-[10px]">Primary Cadre Gap</span>
                    <span class="text-sm font-black text-orange-600">${gapDisplay}</span>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span class="text-slate-500 block text-[10px]">Recommended</span>
                    <span class="text-base font-black text-blue-600">3 iGOT Courses</span>
                </div>
            </div>
        </div>
        `;
    }
}

window.isCadreUnlocked = false;
window.isProfileSaved = false;
window.isProfileEditing = false;

window.toggleEditSavedProfile = function() {
    // Preserve any existing form values entered so far
    const locVal = document.getElementById('prof_location')?.value;
    const assignVal = document.getElementById('prof_assignment')?.value;
    const degVal = document.getElementById('prof_degree')?.value;
    const specVal = document.getElementById('prof_spec')?.value;
    const toolsVal = document.getElementById('prof_tools')?.value;
    const expVal = document.getElementById('prof_exp')?.value;
    const prevRolesVal = document.getElementById('prof_prevRoles')?.value;
    const domainsVal = document.getElementById('prof_domains')?.value;
    const projVal = document.getElementById('prof_projects')?.value;
    const trainVal = document.getElementById('prof_training')?.value;

    const minVal = document.getElementById('prof_ministry')?.value;
    const deptVal = document.getElementById('prof_dept')?.value;
    const desigVal = document.getElementById('prof_desig')?.value;

    window.isProfileEditing = !window.isProfileEditing;
    window.isCadreUnlocked = window.isProfileEditing;

    const baseUser = (window.store && window.store.state && window.store.state.user) || {};
    const mergedUser = Object.assign({}, baseUser, {
        ministry: (minVal !== undefined && minVal !== '') ? minVal : baseUser.ministry,
        department: (deptVal !== undefined && deptVal !== '') ? deptVal : baseUser.department,
        designation: (desigVal !== undefined && desigVal !== '') ? desigVal : baseUser.designation,
        location: locVal !== undefined ? locVal : baseUser.location,
        currentAssignment: assignVal !== undefined ? assignVal : baseUser.currentAssignment,
        degree: degVal !== undefined ? degVal : baseUser.degree,
        specialization: specVal !== undefined ? specVal : baseUser.specialization,
        technicalQualifications: toolsVal !== undefined ? toolsVal : baseUser.technicalQualifications,
        experienceYears: expVal !== undefined ? expVal : baseUser.experienceYears,
        previousRoles: prevRolesVal !== undefined ? prevRolesVal : baseUser.previousRoles,
        statisticalDomains: domainsVal !== undefined ? domainsVal : baseUser.statisticalDomains,
        projectsHandled: projVal !== undefined ? projVal : baseUser.projectsHandled,
        trainingProgrammes: trainVal !== undefined ? trainVal : baseUser.trainingProgrammes
    });

    const container = document.getElementById('assessmentStepContainer');
    if (container) {
        container.innerHTML = getAssessmentStepHTML(1, mergedUser, window.store ? window.store.state : {});
    }
};

window.toggleUnlockCadre = function() {
    // Preserve any existing form values entered so far
    const locVal = document.getElementById('prof_location')?.value;
    const assignVal = document.getElementById('prof_assignment')?.value;
    const degVal = document.getElementById('prof_degree')?.value;
    const specVal = document.getElementById('prof_spec')?.value;
    const toolsVal = document.getElementById('prof_tools')?.value;
    const expVal = document.getElementById('prof_exp')?.value;
    const prevRolesVal = document.getElementById('prof_prevRoles')?.value;
    const domainsVal = document.getElementById('prof_domains')?.value;
    const projVal = document.getElementById('prof_projects')?.value;
    const trainVal = document.getElementById('prof_training')?.value;

    const minVal = document.getElementById('prof_ministry')?.value;
    const deptVal = document.getElementById('prof_dept')?.value;
    const desigVal = document.getElementById('prof_desig')?.value;

    window.isCadreUnlocked = !window.isCadreUnlocked;

    const baseUser = (window.store && window.store.state && window.store.state.user) || {};
    const mergedUser = Object.assign({}, baseUser, {
        ministry: (minVal !== undefined && minVal !== '') ? minVal : baseUser.ministry,
        department: (deptVal !== undefined && deptVal !== '') ? deptVal : baseUser.department,
        designation: (desigVal !== undefined && desigVal !== '') ? desigVal : baseUser.designation,
        location: locVal !== undefined ? locVal : baseUser.location,
        currentAssignment: assignVal !== undefined ? assignVal : baseUser.currentAssignment,
        degree: degVal !== undefined ? degVal : baseUser.degree,
        specialization: specVal !== undefined ? specVal : baseUser.specialization,
        technicalQualifications: toolsVal !== undefined ? toolsVal : baseUser.technicalQualifications,
        experienceYears: expVal !== undefined ? expVal : baseUser.experienceYears,
        previousRoles: prevRolesVal !== undefined ? prevRolesVal : baseUser.previousRoles,
        statisticalDomains: domainsVal !== undefined ? domainsVal : baseUser.statisticalDomains,
        projectsHandled: projVal !== undefined ? projVal : baseUser.projectsHandled,
        trainingProgrammes: trainVal !== undefined ? trainVal : baseUser.trainingProgrammes
    });

    const container = document.getElementById('assessmentStepContainer');
    if (container) {
        container.innerHTML = getAssessmentStepHTML(1, mergedUser, window.store ? window.store.state : {});
    }
};

window.onAssessmentMinistryChange = function() {
    const minSelect = document.getElementById('prof_ministry');
    const deptSelect = document.getElementById('prof_dept');
    if (!minSelect || !deptSelect) return;
    const selectedMin = minSelect.value;
    const depts = typeof window.getDepartmentsForMinistry === 'function' 
        ? window.getDepartmentsForMinistry(selectedMin) 
        : [];
    if (depts && depts.length > 0) {
        deptSelect.innerHTML = depts.map(d => `<option value="${d}">${d}</option>`).join('');
    } else {
        deptSelect.innerHTML = `
            <option value="General Administration & Statistics Division">General Administration & Statistics Division</option>
            <option value="Planning & Monitoring Wing">Planning & Monitoring Wing</option>
            <option value="Data Analytics & Survey Unit">Data Analytics & Survey Unit</option>
        `;
    }
    if (typeof window.clearAssessmentFieldError === 'function') {
        window.clearAssessmentFieldError('prof_ministry');
    }
};

window.toggleToolBadge = function(tool) {
    const toolsInput = document.getElementById('prof_tools');
    if (!toolsInput) return;
    let list = toolsInput.value.split(',').map(s => s.trim()).filter(Boolean);
    if (!list.includes(tool)) {
        list.push(tool);
        toolsInput.value = list.join(', ');
    }
};

window.updateSelfRating = function(key, val, maxReq) {
    const max = maxReq ? parseInt(maxReq, 10) : 3;
    const num = Math.min(Math.max(1, parseInt(val, 10)), max);
    assessmentResponses.selfRatings[key] = num;

    const label = document.getElementById(`rate_val_${key}`);
    const nameLabel = document.getElementById(`rate_label_${key}`);
    
    const isQualified = num >= max;
    if (label) {
        label.textContent = `Level ${num} / ${max} ${isQualified ? '✓ Meets Cadre Target' : `(Gap: -${max - num})`}`;
        label.className = `text-xs font-black px-3 py-1 rounded-lg ${isQualified ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`;
    }
    if (nameLabel) {
        const levelNames = window.FRAMEWORK_LEVEL_NAMES || { 
            1: "Awareness", 
            2: "Working (Routine)", 
            3: "Practitioner", 
            4: "Advanced", 
            5: "Expert / Strategic" 
        };
        nameLabel.textContent = `Level ${num} — ${levelNames[num] || 'Level ' + num}`;
    }
};

window.clearAssessmentFieldError = function(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('border-red-500', 'ring-2', 'ring-red-400', 'bg-red-50/50');
    }
    const errSpan = document.getElementById(`err_${id}`);
    if (errSpan) {
        errSpan.classList.add('hidden');
    }
    const banner = document.getElementById('profileStepErrorBanner');
    if (banner) {
        // If all errors are cleared, hide banner
        const visibleErrors = document.querySelectorAll('#assessmentStepContainer [id^="err_"]:not(.hidden)');
        if (visibleErrors.length === 0) {
            banner.classList.add('hidden');
        }
    }
};

window.nextAssessmentStep = function() {
    if (currentAssessmentStep === 1) {
        const activeUser = (window.store && window.store.state && window.store.state.user) || {};
        const desigClean = (typeof activeUser.designation === 'object' && activeUser.designation ? (activeUser.designation.title || activeUser.designation.name) : activeUser.designation) || 'Senior Statistical Officer (SSO)';
        
        const nameEl = document.getElementById('prof_name');
        const minEl = document.getElementById('prof_ministry');
        const deptEl = document.getElementById('prof_dept');
        const desigEl = document.getElementById('prof_desig');

        const locEl = document.getElementById('prof_location');
        const assignEl = document.getElementById('prof_assignment');
        const degEl = document.getElementById('prof_degree');
        const specEl = document.getElementById('prof_spec');
        const toolsEl = document.getElementById('prof_tools');
        const expEl = document.getElementById('prof_exp');
        const prevRolesEl = document.getElementById('prof_prevRoles');
        const domsEl = document.getElementById('prof_domains');
        const projEl = document.getElementById('prof_projects');
        const trainEl = document.getElementById('prof_training');

        const errors = [];
        const missingEls = [];

        // 1. Validate Location of Workplace
        if (!locEl || !locEl.value.trim()) {
            errors.push("Location of Workplace / Posting Office is required");
            if (locEl) {
                locEl.classList.add('border-red-500', 'ring-2', 'ring-red-400', 'bg-red-50/50');
                missingEls.push(locEl);
                const s = document.getElementById('err_prof_location');
                if (s) s.classList.remove('hidden');
            }
        }

        // 2. Validate Current Survey & Statistical Assignment
        if (!assignEl || !assignEl.value.trim()) {
            errors.push("Current Survey & Statistical Assignment is required");
            if (assignEl) {
                assignEl.classList.add('border-red-500', 'ring-2', 'ring-red-400', 'bg-red-50/50');
                missingEls.push(assignEl);
                const s = document.getElementById('err_prof_assignment');
                if (s) s.classList.remove('hidden');
            }
        }

        // 3. Validate Highest Education / Degree
        if (!degEl || !degEl.value.trim()) {
            errors.push("Higher Education / Highest Degree is required");
            if (degEl) {
                degEl.classList.add('border-red-500', 'ring-2', 'ring-red-400', 'bg-red-50/50');
                missingEls.push(degEl);
                const s = document.getElementById('err_prof_degree');
                if (s) s.classList.remove('hidden');
            }
        }

        // 4. Validate Years of Experience
        if (!expEl || !expEl.value.trim()) {
            errors.push("Years of Experience in Official Statistics is required");
            if (expEl) {
                expEl.classList.add('border-red-500', 'ring-2', 'ring-red-400', 'bg-red-50/50');
                missingEls.push(expEl);
                const s = document.getElementById('err_prof_exp');
                if (s) s.classList.remove('hidden');
            }
        }

        // 5. Validate Statistical Domains
        if (!domsEl || !domsEl.value.trim()) {
            errors.push("Statistical Domains Worked In is required");
            if (domsEl) {
                domsEl.classList.add('border-red-500', 'ring-2', 'ring-red-400', 'bg-red-50/50');
                missingEls.push(domsEl);
                const s = document.getElementById('err_prof_domains');
                if (s) s.classList.remove('hidden');
            }
        }

        // 6. Validate Cadre if Unlocked
        if (window.isCadreUnlocked) {
            if (!nameEl || !nameEl.value.trim()) {
                errors.push("Official Name is required");
                if (nameEl) {
                    nameEl.classList.add('border-red-500', 'ring-2', 'ring-red-400', 'bg-red-50/50');
                    missingEls.push(nameEl);
                    const s = document.getElementById('err_prof_name');
                    if (s) s.classList.remove('hidden');
                }
            }
            if (!minEl || !minEl.value.trim()) {
                errors.push("Ministry / Administration is required");
                if (minEl) {
                    minEl.classList.add('border-red-500', 'ring-2', 'ring-red-400', 'bg-red-50/50');
                    missingEls.push(minEl);
                    const s = document.getElementById('err_prof_ministry');
                    if (s) s.classList.remove('hidden');
                }
            }
            if (!deptEl || !deptEl.value.trim()) {
                errors.push("Department / Division is required");
                if (deptEl) {
                    deptEl.classList.add('border-red-500', 'ring-2', 'ring-red-400', 'bg-red-50/50');
                    missingEls.push(deptEl);
                    const s = document.getElementById('err_prof_dept');
                    if (s) s.classList.remove('hidden');
                }
            }
            if (!desigEl || !desigEl.value.trim()) {
                errors.push("Designation / Role is required");
                if (desigEl) {
                    desigEl.classList.add('border-red-500', 'ring-2', 'ring-red-400', 'bg-red-50/50');
                    missingEls.push(desigEl);
                    const s = document.getElementById('err_prof_desig');
                    if (s) s.classList.remove('hidden');
                }
            }
        }

        // If validation fails, display error banner and halt execution!
        if (errors.length > 0) {
            const errBanner = document.getElementById('profileStepErrorBanner');
            if (errBanner) {
                errBanner.innerHTML = `
                    <div class="p-4 bg-red-50 border-2 border-red-400 rounded-2xl text-red-900 text-xs flex items-start gap-3 shadow-md">
                        <i class="fa-solid fa-circle-exclamation text-red-600 text-lg mt-0.5 flex-shrink-0"></i>
                        <div class="space-y-1.5 flex-1">
                            <strong class="font-black text-sm text-red-900 block">Required Profile Information Incomplete</strong>
                            <p class="text-red-800">Please provide all mandatory official details marked with <span class="text-red-600 font-bold">*</span> before proceeding with the assessment:</p>
                            <ul class="list-disc list-inside space-y-0.5 font-bold text-red-700 pt-0.5">
                                ${errors.map(err => `<li>${err}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
                errBanner.classList.remove('hidden');
                errBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            if (missingEls[0]) missingEls[0].focus();
            return; // STRICTLY STOP: Do not move to step 2!
        }

        const activeDept = deptEl && deptEl.value.trim() ? deptEl.value.trim() : (activeUser.department || 'National Statistical Office (NSO - SDRD)');
        const activeDesig = desigEl && desigEl.value.trim() ? desigEl.value.trim() : desigClean;
        let roleGrade = activeUser.role_grade || activeUser.roleGrade || 'R3';
        let sectorTag = activeUser.sector_tag || activeUser.sectorTag || 'Official Statistics';
        let d6Competencies = activeUser.d6_competencies || activeUser.d6Competencies || '';

        if (typeof window.getDepartmentFrameworkConfig === 'function') {
            const cfg = window.getDepartmentFrameworkConfig(activeDept);
            if (cfg) {
                sectorTag = cfg.sectorTag || sectorTag;
                if (!d6Competencies || d6Competencies.length < 3) {
                    d6Competencies = (cfg.d6Competencies || []).join(', ');
                }
            }
        }
        const gradeMatch = activeDesig.match(/\b(R[1-6])\b/);
        if (gradeMatch) {
            roleGrade = gradeMatch[1];
        }

        // All required fields provided -> Build clean profile object
        const updatedProfile = {
            email: activeUser.email || 'ananya.sharma@nic.in',
            mobile: activeUser.mobile || '',
            name: nameEl && nameEl.value.trim() ? nameEl.value.trim() : (activeUser.name || 'Statistical Officer'),
            ministry: minEl && minEl.value.trim() ? minEl.value.trim() : (activeUser.ministry || 'Ministry of Statistics & Programme Implementation'),
            department: activeDept,
            designation: activeDesig,
            role: activeDesig,
            roleGrade: roleGrade,
            role_grade: roleGrade,
            sectorTag: sectorTag,
            sector_tag: sectorTag,
            d6Competencies: d6Competencies,
            d6_competencies: d6Competencies,
            employeeId: activeUser.employeeId || activeUser.employee_id || 'ISS/2026/84920',
            org_type: activeUser.org_type || 'Central Government',
            
            location: locEl ? locEl.value.trim() : '',
            currentAssignment: assignEl ? assignEl.value.trim() : '',
            degree: degEl ? degEl.value : '',
            specialization: specEl ? specEl.value.trim() : '',
            technicalQualifications: toolsEl ? toolsEl.value.trim() : '',
            experienceYears: expEl ? parseFloat(expEl.value) : 0,
            previousRoles: prevRolesEl ? prevRolesEl.value.trim() : '',
            statisticalDomains: domsEl ? domsEl.value.trim() : '',
            projectsHandled: projEl ? projEl.value.trim() : '',
            trainingProgrammes: trainEl ? trainEl.value.trim() : '',
            profileCompleted: true
        };

        window.isProfileSaved = true;
        window.isProfileEditing = false;
        window.isCadreUnlocked = false;

        // Sync with Store & Recalibrate FRAC targets
        if (window.store) {
            window.store.state.user = Object.assign({}, window.store.state.user, updatedProfile);
            window.store.state.currentUser = window.store.state.user;
            if (typeof window.store.syncUserFRACCompetencies === 'function') {
                window.store.syncUserFRACCompetencies();
            }
        }

        // Persist to SQLite Database via POST /api/profile/update
        fetch('/api/profile/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProfile)
        }).then(res => res.json())
          .then(data => console.log('[DB Sync] Profile saved to database:', data))
          .catch(err => console.log('[DB Sync Warning]:', err));
    }

    if (currentAssessmentStep < 6) {
        currentAssessmentStep++;
        if (window.store) window.store.notify();
    }
};

window.prevAssessmentStep = function() {
    if (currentAssessmentStep > 1) {
        currentAssessmentStep--;
        if (window.store) window.store.notify();
    }
};

window.finalizeAssessment = function() {
    fetch('/api/assessments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: 86, responses: assessmentResponses })
    })
    .then(res => res.json())
    .then(data => {
        if (window.store) {
            window.store.state.overallScore = data.new_overall_score || 74;
            if (window.store.state.user) window.store.state.user.overallScore = data.new_overall_score || 74;
            currentAssessmentStep = 1;
            window.store.navigate('learning-path');
        }
    })
    .catch(() => {
        if (window.store) {
            currentAssessmentStep = 1;
            window.store.navigate('learning-path');
        }
    });
};

window.renderCompetencyAssessment = renderCompetencyAssessment;
