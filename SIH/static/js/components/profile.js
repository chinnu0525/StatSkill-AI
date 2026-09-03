/**
 * User Profile Component — Block 1: Official Digital Competency Profile
 * Comprehensive profile displaying Personal/Professional, Educational, Experience, and Training records.
 */

function renderUserProfile(state) {
    const user = state.user || (window.MOCK_DATA && window.MOCK_DATA.currentUser) || {};
    const defaultAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";
    const avatar = user.avatar || defaultAvatar;
    const name = user.name || "Statistical Officer";
    const cadre = user.cadre || (user.employeeId && user.employeeId.startsWith('ISS') ? 'Indian Statistical Service (ISS)' : 'Subordinate Statistical Service (SSS)');
    const designation = (typeof user.designation === 'object' && user.designation)
        ? (user.designation.title || user.designation.name || 'Senior Statistical Officer (SSO)')
        : (String(user.designation || user.role || '').trim() === '[object Object]' || !(user.designation || user.role) ? 'Senior Statistical Officer (SSO)' : String(user.designation || user.role));
    const ministry = user.ministry || 'Ministry of Statistics & Programme Implementation (MoSPI)';
    const department = user.department || 'National Statistical Office (NSO - SDRD)';
    const employeeId = user.employeeId || 'ISS/2026/84920';
    const location = user.location || "";
    const email = user.email || 'ananya.sharma@nic.in';
    const mobile = user.mobile ? `+91 ${user.mobile}` : 'Not provided';
    const overallScore = user.overallScore || state.overallScore || 0;
    const exp = (user.experienceYears !== undefined && user.experienceYears !== null) ? user.experienceYears : ((user.experience_years !== undefined && user.experience_years !== null) ? user.experience_years : null);
    const degree = user.degree || "";
    const spec = user.specialization || "";
    const assignment = user.currentAssignment || user.current_assignment || "";
    const prevRoles = user.previousRoles || user.previous_roles || "";
    const domains = user.statisticalDomains || user.statistical_domains || "";
    const projects = user.projectsHandled || user.projects_handled || "";
    const tools = user.technicalQualifications || user.technical_qualifications || "";
    const training = user.trainingProgrammes || user.training_programmes || "";

    const toolList = typeof tools === 'string' ? tools.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(tools) ? tools : []);
    const domainList = typeof domains === 'string' ? domains.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(domains) ? domains : []);

    const certs = user.certifications || [];

    return `
    <div class="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <!-- Top Profile Banner Card -->
        <div class="stat-card p-6 sm:p-8 bg-white border border-slate-200 shadow-md rounded-3xl flex flex-col md:flex-row items-center gap-6 border-t-4 border-orange-500">
            <img src="${avatar}" alt="${name}" class="w-24 h-24 rounded-2xl border-2 border-orange-500 object-cover shadow-lg">
            
            <div class="space-y-2 text-center md:text-left flex-1">
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <h1 class="text-2xl font-black text-navy-900" style="color: #0B2545;">${name}</h1>
                    <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-0.5 rounded-full border border-blue-200">
                        ${cadre}
                    </span>
                    <span class="${user.profileCompleted ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'} text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1">
                        <i class="fa-solid ${user.profileCompleted ? 'fa-circle-check text-emerald-600' : 'fa-clock text-amber-600'}"></i> ${user.profileCompleted ? 'Profile Verified (Block 1)' : 'Profile Incomplete'}
                    </span>
                </div>
                <p class="text-xs sm:text-sm font-semibold text-slate-600">${designation} • ${department}</p>
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 pt-1">
                    <span><i class="fa-solid fa-id-badge text-orange-500"></i> ${employeeId}</span>
                    <span><i class="fa-solid fa-location-dot text-orange-500"></i> ${location || '<span class="text-slate-400 italic">Posting office not set</span>'}</span>
                    <span><i class="fa-solid fa-envelope text-orange-500"></i> ${email}</span>
                    <span><i class="fa-solid fa-phone text-orange-500"></i> ${mobile}</span>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center min-w-[140px]">
                    <span class="text-[10px] font-bold text-slate-500 uppercase block">Competency Score</span>
                    <span class="text-3xl font-black text-navy-900" style="color: #0B2545;">${overallScore > 0 ? overallScore + '%' : 'Pending'}</span>
                    <span class="text-[10px] text-emerald-600 font-bold block mt-0.5">${overallScore > 0 ? 'Verified Baseline' : 'Self-Assessment Needed'}</span>
                </div>
                <button onclick="openEditProfileModal()" class="btn btn-secondary text-xs py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 shadow-sm flex items-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-pen-to-square text-orange-600"></i> Edit Profile
                </button>
            </div>
        </div>

        <!-- 4 Grid Sections: Complete Block 1 Digital Competency Profile -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- Block 1.1: Personal / Professional Information -->
            <div class="stat-card p-6 space-y-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <h2 class="text-base font-bold text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                    <i class="fa-solid fa-building-columns text-orange-500"></i> 1. Personal & Professional Assignment
                </h2>

                <div class="space-y-3 text-xs">
                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-blue-700 uppercase">Ministry / Administration</span>
                        <div class="font-bold text-slate-800">${ministry || 'Ministry of Statistics & Programme Implementation'}</div>
                        <div class="text-slate-500">${department || 'National Statistical Office (NSO)'}</div>
                    </div>

                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-emerald-700 uppercase">Current Job Role & Cadre</span>
                        <div class="font-bold text-slate-800">${designation || 'Statistical Officer'}</div>
                        <div class="text-slate-500">Cadre: ${cadre} (${employeeId})</div>
                    </div>

                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-orange-700 uppercase">Current Survey / Analytical Assignment</span>
                        <div class="font-bold text-slate-800">${assignment || '<span class="text-slate-400 italic">Not yet specified (Click Edit Profile to add)</span>'}</div>
                        <div class="text-slate-500"><i class="fa-solid fa-location-dot"></i> Posting Location: ${location || '<span class="text-slate-400 italic">Not set</span>'}</div>
                    </div>
                </div>
            </div>

            <!-- Block 1.2: Educational & Technical Qualifications -->
            <div class="stat-card p-6 space-y-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <h2 class="text-base font-bold text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                    <i class="fa-solid fa-graduation-cap text-orange-500"></i> 2. Higher Education & Technical Qualifications
                </h2>

                <div class="space-y-3 text-xs">
                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-blue-700 uppercase">Higher Academic Degree & Specialization</span>
                        <div class="font-bold text-slate-800">${degree || '<span class="text-slate-400 italic">Not yet specified (Click Edit Profile)</span>'}</div>
                        <div class="text-slate-500">Specialization: ${spec || '<span class="text-slate-400 italic">General / Not specified</span>'}</div>
                    </div>

                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                        <span class="text-[10px] font-bold text-purple-700 uppercase">Technical Qualifications & Software Tools</span>
                        ${toolList.length > 0 ? `
                            <div class="flex flex-wrap gap-1.5 pt-1">
                                ${toolList.map(t => `<span class="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-md border border-purple-200">${t}</span>`).join('')}
                            </div>
                        ` : `
                            <div class="text-slate-400 italic">No tools recorded yet (Click Edit Profile to add)</div>
                        `}
                    </div>

                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-emerald-700 uppercase">Statistical Computing Competency</span>
                        <div class="text-slate-700 font-medium">Equipped for official survey microdata processing, multi-stage sampling weights, and tabulation.</div>
                    </div>
                </div>
            </div>

            <!-- Block 1.3: Experience & Statistical Domains -->
            <div class="stat-card p-6 space-y-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <h2 class="text-base font-bold text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                    <i class="fa-solid fa-briefcase text-orange-500"></i> 3. Experience & Statistical Domains
                </h2>

                <div class="space-y-3 text-xs">
                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-emerald-700 uppercase">Service Experience</span>
                        <div class="font-bold text-slate-800">${exp !== null ? exp + ' Years in Official Statistical System' : '<span class="text-slate-400 italic">Years of experience not set</span>'}</div>
                        <div class="text-slate-500">Previous Positions: ${prevRoles || '<span class="text-slate-400 italic">None recorded</span>'}</div>
                    </div>

                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                        <span class="text-[10px] font-bold text-blue-700 uppercase">Statistical Domains Worked In</span>
                        ${domainList.length > 0 ? `
                            <div class="flex flex-wrap gap-1.5 pt-1">
                                ${domainList.map(d => `<span class="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded-md border border-blue-200">${d}</span>`).join('')}
                            </div>
                        ` : `
                            <div class="text-slate-400 italic">No statistical domains recorded yet</div>
                        `}
                    </div>

                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-orange-700 uppercase">Key Surveys / Projects Handled</span>
                        <div class="font-bold text-slate-800">${projects || '<span class="text-slate-400 italic">No surveys/projects listed yet</span>'}</div>
                    </div>
                </div>
            </div>

            <!-- Block 1.4: Training History & Continuous Learning -->
            <div class="stat-card p-6 space-y-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <h2 class="text-base font-bold text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                    <i class="fa-solid fa-award text-orange-500"></i> 4. Prior Training History & Academies
                </h2>

                <div class="space-y-3 text-xs">
                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-blue-700 uppercase">Training Academies / Pre-Training Attended</span>
                        <div class="font-bold text-slate-800">${training || '<span class="text-slate-400 italic">No pre-training recorded (Click Edit Profile to add)</span>'}</div>
                        <div class="text-slate-500"><i class="fa-solid fa-clock"></i> Total Verified Training Hours: ${user.learningHours || 0} hrs</div>
                    </div>

                    <div class="space-y-2 pt-1">
                        <span class="text-[10px] font-bold text-slate-500 uppercase block">Verified Certifications:</span>
                        ${certs.length > 0 ? certs.map(c => `
                            <div class="p-2.5 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
                                <div>
                                    <div class="font-bold text-navy-900 text-xs">${c.title}</div>
                                    <div class="text-[10px] text-slate-500">${c.issuer} • ${c.year}</div>
                                </div>
                                <span class="badge badge-success text-[10px] px-2 py-0.5">Verified</span>
                            </div>
                        `).join('') : `
                            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-400 italic text-center">
                                No certifications completed yet. Complete competency assessments to earn verified badges.
                            </div>
                        `}
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Profile Modal Container -->
        <div id="editProfileModalContainer"></div>
    </div>
    `;
}

window.openEditProfileModal = function(overrideUser) {
    const storeUser = (window.store && window.store.state && window.store.state.user) || {};
    const user = overrideUser || storeUser;
    const desigVal = (typeof user.designation === 'object' && user.designation)
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
    if (desigVal && !allDesignations.some(d => d.includes(desigVal) || desigVal.includes(d.split('—')[0].trim()))) {
        allDesignations.unshift(desigVal);
    }

    const modalHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-base shadow">
                        <i class="fa-solid fa-user-pen"></i>
                    </div>
                    <div>
                        <h2 class="text-lg font-black text-navy-900" style="color: #0B2545;">Edit Digital Competency Profile</h2>
                        <p class="text-xs text-slate-500">Block 1 — Official Cadre Records & Experience</p>
                    </div>
                </div>
                <button onclick="closeEditProfileModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer">
                    ✕
                </button>
            </div>

            <div class="space-y-4 max-h-[65vh] overflow-y-auto pr-2 text-xs">
                <!-- Cadre Section with Unlock Toggle -->
                <div class="p-3.5 ${window.isModalCadreUnlocked ? 'bg-blue-50/50 border-blue-300' : 'bg-slate-50/80 border-slate-200'} rounded-2xl border space-y-3 transition-all">
                    <div class="flex items-center justify-between border-b ${window.isModalCadreUnlocked ? 'border-blue-200' : 'border-slate-200'} pb-2">
                        <div>
                            <h3 class="font-bold ${window.isModalCadreUnlocked ? 'text-blue-900' : 'text-slate-800'} text-xs flex items-center gap-2">
                                <i class="fa-solid fa-id-card text-blue-600"></i> Official Cadre Information
                            </h3>
                            <p class="text-[10px] text-slate-500">Ministry, Department, and Designation</p>
                        </div>
                        <button type="button" onclick="toggleModalCadreUnlock()" class="text-[11px] font-bold ${window.isModalCadreUnlocked ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-300' : 'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-300'} px-3 py-1.5 rounded-lg border transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm">
                            <i class="fa-solid ${window.isModalCadreUnlocked ? 'fa-check' : 'fa-user-pen'}"></i>
                            ${window.isModalCadreUnlocked ? 'Done Editing' : 'Edit Profile'}
                        </button>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="font-bold text-slate-700 block mb-1">Official Name</label>
                            <div class="relative">
                                <input type="text" id="modal_prof_name" value="${user.name || ''}" disabled class="w-full p-2.5 bg-slate-100/90 border border-slate-200 text-slate-800 font-semibold cursor-not-allowed select-none rounded-lg" placeholder="e.g. Dr. Rajesh Sharma">
                                <span class="absolute right-3 top-2.5 text-slate-400"><i class="fa-solid fa-lock text-xs"></i></span>
                            </div>
                        </div>
                        <div>
                            <label class="font-bold ${window.isModalCadreUnlocked ? 'text-blue-900' : 'text-slate-700'} block mb-1">Ministry / Administration</label>
                            ${window.isModalCadreUnlocked ? `
                                <select id="modal_prof_ministry" onchange="onModalMinistryChange()" class="w-full p-2.5 bg-white border-blue-400 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 border rounded-lg shadow-sm">
                                    ${allMinistries.map(m => `<option value="${m}" ${m.toLowerCase() === currentMinistry.toLowerCase() || (m.includes('Statistics') && currentMinistry.includes('Statistics')) ? 'selected' : ''}>${m}</option>`).join('')}
                                </select>
                            ` : `
                                <input type="text" id="modal_prof_ministry" value="${currentMinistry}" disabled class="w-full p-2.5 bg-slate-100/90 border border-slate-200 text-slate-700 font-semibold cursor-not-allowed select-none rounded-lg">
                            `}
                        </div>
                        <div>
                            <label class="font-bold ${window.isModalCadreUnlocked ? 'text-blue-900' : 'text-slate-700'} block mb-1">Department / Division</label>
                            ${window.isModalCadreUnlocked ? `
                                <select id="modal_prof_dept" class="w-full p-2.5 bg-white border-blue-400 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 border rounded-lg shadow-sm">
                                    ${allDepts.map(d => `<option value="${d}" ${d.toLowerCase() === String(user.department || '').toLowerCase() ? 'selected' : ''}>${d}</option>`).join('')}
                                </select>
                            ` : `
                                <input type="text" id="modal_prof_dept" value="${user.department || 'National Statistical Office (NSO - SDRD)'}" disabled class="w-full p-2.5 bg-slate-100/90 border border-slate-200 text-slate-700 font-semibold cursor-not-allowed select-none rounded-lg">
                            `}
                        </div>
                        <div>
                            <label class="font-bold ${window.isModalCadreUnlocked ? 'text-blue-900' : 'text-slate-700'} block mb-1">Designation / Role</label>
                            ${window.isModalCadreUnlocked ? `
                                <select id="modal_prof_desig" class="w-full p-2.5 bg-white border-blue-400 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 border rounded-lg shadow-sm">
                                    ${allDesignations.map(des => `<option value="${des}" ${des.toLowerCase().includes(desigVal.toLowerCase()) || desigVal.toLowerCase().includes(des.toLowerCase().split('—')[0].trim()) ? 'selected' : ''}>${des}</option>`).join('')}
                                </select>
                            ` : `
                                <input type="text" id="modal_prof_desig" value="${desigVal}" disabled class="w-full p-2.5 bg-slate-100/90 border border-slate-200 text-slate-700 font-semibold cursor-not-allowed select-none rounded-lg">
                            `}
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Location of Workplace / Posting Office <span class="text-red-500">*</span></label>
                        <input type="text" id="modal_prof_location" value="${location}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium" placeholder="e.g. Sankhyiki Bhawan, New Delhi or Regional Office">
                    </div>
                    <div class="sm:col-span-1">
                        <label class="font-bold text-slate-700 block mb-1">Current Survey & Statistical Assignment <span class="text-red-500">*</span></label>
                        <input type="text" id="modal_prof_assignment" value="${assignment}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium" placeholder="e.g. Periodic Labour Force Survey (PLFS), National Accounts">
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Higher Education / Academic Degree <span class="text-red-500">*</span></label>
                        <input type="text" id="modal_prof_degree" value="${degree}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium" placeholder="e.g. M.Sc. Statistics, M.A. Economics, Ph.D.">
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Specialization / Subject Area</label>
                        <input type="text" id="modal_prof_spec" value="${spec}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium" placeholder="e.g. Mathematical Statistics, Sampling, Econometrics">
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Years of Experience in Official Statistics <span class="text-red-500">*</span></label>
                        <input type="number" step="0.5" id="modal_prof_exp" value="${exp}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium" placeholder="e.g. 4">
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Previous Roles / Cadres</label>
                        <input type="text" id="modal_prof_prevRoles" value="${prevRoles}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium" placeholder="e.g. Statistical Investigator, Junior Statistical Officer">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-bold text-slate-700 block mb-1">Statistical Domains Worked In</label>
                        <input type="text" id="modal_prof_domains" value="${domains}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium" placeholder="e.g. Survey Design, Sampling, National Accounts, Price Indices">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-bold text-slate-700 block mb-1">Key Surveys / Projects Handled</label>
                        <input type="text" id="modal_prof_projects" value="${projects}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium" placeholder="e.g. Periodic Labour Force Survey (PLFS), Consumer Expenditure Survey">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-bold text-slate-700 block mb-1">Software & Analytical Tools Known</label>
                        <input type="text" id="modal_prof_tools" value="${tools}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium" placeholder="e.g. Python, R, SPSS, SQL, PowerBI, Excel">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-bold text-slate-700 block mb-1">Pre-Training / Academies Attended</label>
                        <input type="text" id="modal_prof_training" value="${training}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium" placeholder="e.g. NSSTA Greater Noida, ISI Kolkata, iGOT Karmayogi, or None">
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button onclick="closeEditProfileModal()" class="btn btn-secondary text-xs py-2.5 px-5">Cancel</button>
                <button onclick="saveModalProfile()" class="btn btn-primary text-xs py-2.5 px-6">
                    <i class="fa-solid fa-floppy-disk"></i> Save Profile
                </button>
            </div>
        </div>
    </div>
    `;

    const container = document.getElementById('editProfileModalContainer');
    if (container) container.innerHTML = modalHTML;
};

window.isModalCadreUnlocked = false;

window.toggleModalCadreUnlock = function() {
    const locVal = document.getElementById('modal_prof_location')?.value;
    const assignVal = document.getElementById('modal_prof_assignment')?.value;
    const degVal = document.getElementById('modal_prof_degree')?.value;
    const specVal = document.getElementById('modal_prof_spec')?.value;
    const toolsVal = document.getElementById('modal_prof_tools')?.value;
    const expVal = document.getElementById('modal_prof_exp')?.value;
    const prevRolesVal = document.getElementById('modal_prof_prevRoles')?.value;
    const domainsVal = document.getElementById('modal_prof_domains')?.value;
    const projVal = document.getElementById('modal_prof_projects')?.value;
    const trainVal = document.getElementById('modal_prof_training')?.value;

    const nameVal = document.getElementById('modal_prof_name')?.value;
    const minVal = document.getElementById('modal_prof_ministry')?.value;
    const deptVal = document.getElementById('modal_prof_dept')?.value;
    const desigVal = document.getElementById('modal_prof_desig')?.value;

    window.isModalCadreUnlocked = !window.isModalCadreUnlocked;

    const baseUser = (window.store && window.store.state && window.store.state.user) || {};
    const mergedUser = Object.assign({}, baseUser, {
        name: (nameVal !== undefined && nameVal !== '') ? nameVal : baseUser.name,
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

    window.openEditProfileModal(mergedUser);
};

window.closeEditProfileModal = function() {
    window.isModalCadreUnlocked = false;
    const container = document.getElementById('editProfileModalContainer');
    if (container) container.innerHTML = '';
};

window.onModalMinistryChange = function() {
    const minSelect = document.getElementById('modal_prof_ministry');
    const deptSelect = document.getElementById('modal_prof_dept');
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
};

window.saveModalProfile = function() {
    const activeUser = (window.store && window.store.state && window.store.state.user) || {};
    const desigClean = (typeof activeUser.designation === 'object' && activeUser.designation ? (activeUser.designation.title || activeUser.designation.name) : activeUser.designation) || 'Senior Statistical Officer (SSO)';
    
    const nameVal = document.getElementById('modal_prof_name')?.value?.trim();
    const minVal = document.getElementById('modal_prof_ministry')?.value?.trim();
    const deptVal = document.getElementById('modal_prof_dept')?.value?.trim();
    const desigVal = document.getElementById('modal_prof_desig')?.value?.trim();

    const locVal = document.getElementById('modal_prof_location')?.value?.trim();
    const assignVal = document.getElementById('modal_prof_assignment')?.value?.trim();
    const degreeVal = document.getElementById('modal_prof_degree')?.value?.trim();
    const expVal = document.getElementById('modal_prof_exp')?.value?.trim();
    const domainsVal = document.getElementById('modal_prof_domains')?.value?.trim();

    if (!locVal || !assignVal || !degreeVal || !expVal || !domainsVal) {
        alert("Please complete all required fields marked with * (Workplace Location, Current Assignment, Degree, Years of Experience, and Statistical Domains).");
        return;
    }

    const activeDept = deptVal || activeUser.department || 'National Statistical Office (NSO - SDRD)';
    const activeDesig = desigVal || desigClean;
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

    const updatedProfile = {
        email: activeUser.email || 'ananya.sharma@nic.in',
        mobile: activeUser.mobile || '',
        name: nameVal || activeUser.name || 'Statistical Officer',
        ministry: minVal || activeUser.ministry || 'Ministry of Statistics & Programme Implementation',
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
        location: locVal,
        currentAssignment: assignVal,
        degree: degreeVal,
        specialization: document.getElementById('modal_prof_spec')?.value?.trim() || '',
        experienceYears: parseFloat(expVal) || 0,
        previousRoles: document.getElementById('modal_prof_prevRoles')?.value?.trim() || '',
        statisticalDomains: domainsVal,
        projectsHandled: document.getElementById('modal_prof_projects')?.value?.trim() || '',
        technicalQualifications: document.getElementById('modal_prof_tools')?.value?.trim() || '',
        trainingProgrammes: document.getElementById('modal_prof_training')?.value?.trim() || '',
        profileCompleted: true
    };

    if (window.store) {
        window.store.state.user = Object.assign({}, window.store.state.user, updatedProfile);
        window.store.state.currentUser = window.store.state.user;
        if (typeof window.store.syncUserFRACCompetencies === 'function') {
            window.store.syncUserFRACCompetencies();
        }
    }

    fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
    })
    .then(res => res.json())
    .then(data => {
        window.closeEditProfileModal();
        if (window.store) window.store.notify();
    })
    .catch(err => {
        window.closeEditProfileModal();
        if (window.store) window.store.notify();
    });
};

window.renderUserProfile = renderUserProfile;
