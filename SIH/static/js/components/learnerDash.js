/**
 * Learner Dashboard Component
 * Dedicated personalized dashboard for Ananya Sharma (Statistical Officer).
 * Features: 5 KPI Cards with trends, Competency Radar Chart (Current vs Required), Prioritized Skill Gaps list with direct action buttons.
 */

function renderLearnerDashboard(state) {
    const user = state.user || MOCK_DATA.currentUser || {};
    const lang = state.currentLanguage || 'en';
    const overallScore = state.overallScore || 68;

    const userDesig = (typeof user.designation === 'object' && user.designation) 
        ? (user.designation.title || user.designation.name || 'Senior Statistical Officer (SSO)')
        : (String(user.designation || user.role || '').trim() === '[object Object]' || !(user.designation || user.role) ? 'Senior Statistical Officer (SSO)' : String(user.designation || user.role));

    // Filter skill gaps from all competencies
    const allComps = [];
    (state.competencyFramework || []).forEach(domain => {
        (domain.competencies || []).forEach(comp => {
            if (comp.gap > 0) {
                allComps.push(comp);
            }
        });
    });

    // Sort by critical, high, moderate
    const priorityOrder = { "Critical": 1, "High": 2, "Moderate": 3, "None": 4 };
    allComps.sort((a, b) => (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4));

    return `
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <!-- Top Personalized Greeting Banner -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-orange-500">
            <div>
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full uppercase">Official Cadre</span>
                    <span class="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">${userDesig}</span>
                    <span class="text-xs text-slate-500 font-medium">Employee ID: ${user.employeeId || 'ISS/2026/84920'}</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-black text-navy-900 mt-1" style="color: #0B2545;">
                    Good morning, ${(lang === 'hi' && user.hindiName) ? user.hindiName : ((lang === 'te' && user.teluguName) ? user.teluguName : (user.name || 'Officer'))}
                </h1>
                <p class="text-xs sm:text-sm text-slate-600">
                    Here's your competency and learning overview for the <span class="font-semibold text-navy-900">${user.department || user.ministry || 'Ministry of Statistics & Programme Implementation'}</span>.
                </p>
            </div>

            <!-- Quick Action Buttons -->
            <div class="flex items-center gap-3 flex-wrap">
                <button onclick="store.navigate('assessment')" class="btn btn-primary text-xs sm:text-sm py-2 px-4 shadow-sm">
                    <i class="fa-solid fa-clipboard-check text-orange-400"></i>
                    Take Skill Assessment
                </button>
                <button onclick="store.navigate('recommendations')" class="btn btn-saffron text-xs sm:text-sm py-2 px-4 shadow-sm">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    AI Learning Advisor
                </button>
            </div>
        </div>

        <!-- Block 1: Digital Competency Profile Summary Banner -->
        <div class="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-blue-800/40">
            <div class="space-y-1.5">
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="bg-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                        Block 1 — Official Digital Profile
                    </span>
                    <span class="text-xs text-blue-200 font-semibold">
                        <i class="fa-solid fa-graduation-cap text-orange-400"></i> ${user.degree || 'M.Sc. Statistics'} • ${user.experienceYears || user.experience_years || 4} Years Experience in Cadre
                    </span>
                </div>
                <h2 class="text-base sm:text-lg font-bold text-white">
                    ${user.currentAssignment || user.current_assignment || 'Periodic Labour Force Survey (PLFS) & Price Statistics Compilation'}
                </h2>
                <p class="text-xs text-slate-300">
                    Posting: <strong class="text-white">${user.location || 'Sankhyiki Bhawan, New Delhi'}</strong> • Domains: <strong class="text-white">${user.statisticalDomains || user.statistical_domains || 'Survey Design, Sampling, National Accounts, Price Statistics'}</strong>
                </p>
            </div>

            <div class="flex items-center gap-2.5 flex-shrink-0">
                <button onclick="store.navigate('profile')" class="btn btn-secondary text-xs py-2 px-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl">
                    <i class="fa-solid fa-id-card"></i> View Profile
                </button>
                <button onclick="store.navigate('assessment')" class="btn btn-saffron text-xs py-2 px-4 shadow-md rounded-xl">
                    <i class="fa-solid fa-sliders"></i> Skill Gap Assessment
                </button>
            </div>
        </div>

        <!-- 5 KPI Cards Row -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <!-- Overall Competency -->
            <div class="stat-card p-5 stat-card-highlight flex flex-col justify-between">
                <div>
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Competency</span>
                    <div class="text-3xl font-black text-navy-900 mt-1" style="color: #0B2545;">${overallScore}%</div>
                </div>
                <div class="mt-3 flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit">
                    <i class="fa-solid fa-arrow-trend-up mr-1"></i> ↑ 8% from last assessment
                </div>
            </div>

            <!-- Skill Gaps -->
            <div class="stat-card p-5 stat-card-saffron flex flex-col justify-between">
                <div>
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Skill Gaps</span>
                    <div class="text-3xl font-black text-orange-600 mt-1">${allComps.length}</div>
                </div>
                <div class="mt-3 flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded w-fit">
                    <i class="fa-solid fa-triangle-exclamation mr-1"></i> ${allComps.filter(c => c.priority === 'Critical').length} Critical Priority
                </div>
            </div>

            <!-- Learning Progress -->
            <div class="stat-card p-5 stat-card-green flex flex-col justify-between">
                <div>
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Learning Progress</span>
                    <div class="text-3xl font-black text-emerald-600 mt-1">${user.learningProgressPercent}%</div>
                </div>
                <div class="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div class="bg-emerald-500 h-full rounded-full" style="width: ${user.learningProgressPercent}%;"></div>
                </div>
            </div>

            <!-- Learning Hours -->
            <div class="stat-card p-5 flex flex-col justify-between border-top-navy">
                <div>
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Learning Hours</span>
                    <div class="text-3xl font-black text-navy-900 mt-1" style="color: #0B2545;">${user.learningHours} hrs</div>
                </div>
                <div class="mt-3 text-xs font-semibold text-slate-500">
                    <i class="fa-solid fa-clock text-orange-500"></i> Target: 50 hrs / year
                </div>
            </div>

            <!-- Assessments Completed -->
            <div class="stat-card p-5 flex flex-col justify-between">
                <div>
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Assessments</span>
                    <div class="text-3xl font-black text-purple-700 mt-1">${user.assessmentsCompleted}</div>
                </div>
                <div class="mt-3 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded w-fit">
                    <i class="fa-solid fa-circle-check mr-1"></i> 100% Validated
                </div>
            </div>
        </div>

        <!-- Middle Section: Radar Chart & Prioritized Skill Gap List -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left: Competency Radar Chart (Current vs Required) -->
            <div class="lg:col-span-5 stat-card p-6 space-y-4 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">
                            Competency Radar Profile
                        </h2>
                        <span class="text-xs text-slate-500 font-medium">Role: Statistical Officer</span>
                    </div>
                    <p class="text-xs text-slate-600">
                        Comparing your <strong>Current Capability</strong> against the <strong>Mandated Target Level</strong> across 5 core dimensions.
                    </p>
                </div>

                <!-- Radar Canvas Container -->
                <div class="relative h-64 w-full flex items-center justify-center py-2">
                    <canvas id="competencyRadarChart"></canvas>
                </div>

                <!-- Legend & Summary -->
                <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
                        <span class="text-slate-700">Current Level</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
                        <span class="text-slate-700">Required Target</span>
                    </div>
                    <button onclick="store.navigate('framework')" class="text-blue-600 hover:underline text-[11px]">
                        Full Matrix <i class="fa-solid fa-chevron-right text-[9px]"></i>
                    </button>
                </div>
            </div>

            <!-- Right: Prioritized Skill Gaps List -->
            <div class="lg:col-span-7 stat-card p-6 space-y-4 flex flex-col justify-between">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">
                            Identified Competency Gaps
                        </h2>
                        <p class="text-xs text-slate-600">
                            Ranked by urgency and MoSPI departmental transformation priority.
                        </p>
                    </div>
                    <button onclick="store.navigate('recommendations')" class="btn btn-secondary text-xs py-1.5 px-3">
                        <i class="fa-solid fa-sparkles text-orange-500"></i> Auto-Bridge All Gaps
                    </button>
                </div>

                <!-- Gaps List -->
                <div class="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    ${allComps.map(comp => {
                        let badgeClass = "gap-moderate";
                        let priorityIcon = "fa-circle-info";
                        if (comp.priority === "Critical") {
                            badgeClass = "gap-critical";
                            priorityIcon = "fa-circle-xmark";
                        } else if (comp.priority === "High") {
                            badgeClass = "gap-high";
                            priorityIcon = "fa-triangle-exclamation";
                        }

                        const levelLabels = { 1: "L1 Awareness", 2: "L2 Foundation", 3: "L3 Working", 4: "L4 Advanced", 5: "L5 Expert" };

                        return `
                        <div class="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                            <div class="space-y-1">
                                <div class="flex items-center gap-2">
                                    <span class="${badgeClass}">
                                        <i class="fa-solid ${priorityIcon}"></i> ${comp.priority}
                                    </span>
                                    <span class="text-xs font-bold text-navy-900" style="color: #0B2545;">${comp.name}</span>
                                    <span class="text-[10px] text-slate-500">(${comp.domain})</span>
                                </div>
                                <div class="text-xs text-slate-600 flex items-center gap-3 flex-wrap">
                                    <span>Current: <strong class="text-slate-800">${levelLabels[comp.currentLevel] || 'L2 Basic'}</strong></span>
                                    <span class="text-slate-400">→</span>
                                    <span>FRAC Cadre Target: <strong class="text-orange-700">${levelLabels[comp.requiredLevel] || 'L4 Advanced'}</strong></span>
                                    <span class="text-slate-400">|</span>
                                    <span>Gap: <strong class="text-red-600">${comp.gap} Levels</strong></span>
                                </div>
                            </div>

                            <button onclick="store.navigate('recommendations')" class="btn btn-secondary text-xs py-1.5 px-3 whitespace-nowrap hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200">
                                <i class="fa-solid fa-route text-orange-500"></i> View Learning Path
                            </button>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>

        <!-- Bottom Section: Active Learning Path & Recent Assessment Summary -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Active Learning Path Progress -->
            <div class="lg:col-span-7 stat-card p-6 space-y-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">
                            Your Recommended Learning Path
                        </h2>
                        <p class="text-xs text-slate-600">
                            Sequenced milestone modules to bridge your identified skill gaps.
                        </p>
                    </div>
                    <button onclick="store.navigate('learning-path')" class="text-xs font-bold text-blue-600 hover:underline">
                        View Full Roadmap <i class="fa-solid fa-chevron-right text-[9px]"></i>
                    </button>
                </div>

                <div class="space-y-3">
                    ${state.learningPath.slice(0, 3).map((item, idx) => `
                        <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white flex items-center justify-between gap-4 transition-all">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-navy-900 text-white font-bold text-xs flex items-center justify-center" style="background: #0B2545;">
                                    0${idx + 1}
                                </div>
                                <div>
                                    <div class="text-xs font-bold text-navy-900">${item.title}</div>
                                    <div class="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                        <span><i class="fa-regular fa-clock text-slate-400"></i> ${item.duration}</span>
                                        <span>•</span>
                                        <span class="text-orange-600 font-semibold">${item.source}</span>
                                        <span>•</span>
                                        <span class="bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded text-[10px]">${item.competency}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                ${item.progress > 0 ? `
                                    <div class="text-right">
                                        <div class="text-xs font-bold text-emerald-600">${item.progress}%</div>
                                        <div class="text-[10px] text-slate-400">In Progress</div>
                                    </div>
                                ` : `
                                    <span class="text-xs text-slate-500 font-medium">Not Started</span>
                                `}
                                <button onclick="store.navigate('learning-path')" class="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center text-slate-600 text-xs">
                                    <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Recent Assessment Result Card -->
            <div class="lg:col-span-5 stat-card p-6 space-y-4 bg-gradient-to-br from-white via-slate-50 to-blue-50/40">
                <div class="flex justify-between items-center">
                    <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">
                        Latest Assessment Insight
                    </h2>
                    <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        +6% Improvement
                    </span>
                </div>

                <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div class="flex justify-between items-center text-xs">
                        <span class="text-slate-600">Sampling & Survey Methodologies Quiz</span>
                        <strong class="text-navy-900 font-bold text-sm">82% Score</strong>
                    </div>

                    <div class="space-y-1.5 text-xs">
                        <div class="text-emerald-700 font-semibold flex items-center gap-1.5">
                            <i class="fa-solid fa-circle-check text-emerald-600"></i>
                            Strong: Multi-Stage Stratified Sampling, Price Indices
                        </div>
                        <div class="text-amber-700 font-semibold flex items-center gap-1.5">
                            <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
                            Areas to Improve: Non-response Imputation, SDC
                        </div>
                    </div>
                </div>

                <!-- Ministry Cadre Assessment Card Powered by Groq LPU -->
                <div class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200 rounded-2xl text-xs text-blue-950 space-y-3 shadow-xs">
                    <div class="flex items-center justify-between">
                        <span class="font-black text-[10px] text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                            <i class="fa-solid fa-bolt text-amber-500"></i> Groq LPU AI
                        </span>
                        <span class="text-[10px] text-blue-700 font-bold">${user.ministry ? user.ministry.split('(')[0] : 'MoSPI'}</span>
                    </div>

                    <div>
                        <h4 class="font-bold text-navy-900 text-xs">Official Ministry Cadre Quiz</h4>
                        <p class="text-[11px] text-slate-600 mt-0.5">
                            Targeted for <strong>${user.department || 'National Statistical Office'}</strong> officers (${typeof window.getOfficerRoleGrade === 'function' ? window.getOfficerRoleGrade(user.designation || user.role, user.experience || 4) : 'R3'}).
                        </p>
                    </div>

                    <div class="grid grid-cols-2 gap-2 pt-1">
                        <button onclick="quickLaunchMinistryQuiz()" id="quickQuizBtn" class="btn btn-saffron text-xs py-2 px-2.5 font-bold shadow-xs flex items-center justify-center gap-1.5">
                            <i class="fa-solid fa-play text-[10px]"></i> Quick Check (5 Qs)
                        </button>
                        <button onclick="store.navigate('ai-generator')" class="btn btn-secondary text-xs py-2 px-2.5 font-bold flex items-center justify-center gap-1.5">
                            <i class="fa-solid fa-sliders text-[10px]"></i> Configure Exam
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

// Chart.js Radar Initialization Function
function initCompetencyRadarChart() {
    const ctx = document.getElementById('competencyRadarChart');
    if (!ctx) return;

    if (window.radarChartInstance) {
        window.radarChartInstance.destroy();
    }

    window.radarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Statistical Methods',
                'Technical / Python / AI',
                'Digital Governance',
                'Behavioural & Ethics',
                'Managerial & Strategy'
            ],
            datasets: [
                {
                    label: 'Current Level',
                    data: [3.8, 2.0, 2.5, 3.5, 3.0],
                    fill: true,
                    backgroundColor: 'rgba(11, 37, 69, 0.2)',
                    borderColor: '#0B2545',
                    pointBackgroundColor: '#0B2545',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#0B2545',
                    borderWidth: 2
                },
                {
                    label: 'Required Target',
                    data: [4.0, 3.8, 3.5, 4.0, 3.5],
                    fill: true,
                    backgroundColor: 'rgba(234, 88, 12, 0.15)',
                    borderColor: '#EA580C',
                    pointBackgroundColor: '#EA580C',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#EA580C',
                    borderWidth: 2,
                    borderDash: [4, 4]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: { tension: 0.2 }
            },
            scales: {
                r: {
                    angleLines: { color: 'rgba(0, 0, 0, 0.08)' },
                    grid: { color: 'rgba(0, 0, 0, 0.08)' },
                    suggestedMin: 0,
                    suggestedMax: 5,
                    ticks: {
                        stepSize: 1,
                        display: false
                    },
                    pointLabels: {
                        font: {
                            size: 11,
                            weight: '600',
                            family: 'Inter'
                        },
                        color: '#334155'
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

window.renderLearnerDashboard = renderLearnerDashboard;
window.initCompetencyRadarChart = initCompetencyRadarChart;

window.quickLaunchMinistryQuiz = function() {
    const btn = document.getElementById('quickQuizBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-[10px]"></i> Generating...`;
    }

    const user = window.store.state.user || {};
    const ministry = user.ministry || "Ministry of Statistics and Programme Implementation (MoSPI)";
    const dept = user.department || "National Statistical Office (NSO - NAD)";
    const deptMap = window.DEPARTMENT_FRAMEWORK_MAP || {};
    const config = deptMap[dept] || { sectorTag: "Official Statistics", d6Competencies: ["Statistical Standards"] };
    const roleGrade = (typeof window.getOfficerRoleGrade === 'function') 
        ? window.getOfficerRoleGrade(user.designation || user.role, user.experience || 4) 
        : "R3";

    fetch('/api/ai/generate-ministry-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ministry: ministry,
            department: dept,
            sectorTag: config.sectorTag || "Official Statistics",
            d6Competencies: config.d6Competencies || [],
            roleGrade: roleGrade,
            numQuestions: 5,
            difficulty: "Medium",
            bloomLevel: "Apply"
        })
    })
    .then(res => res.json())
    .then(data => {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-play text-[10px]"></i> Quick Check (5 Qs)`;
        }
        if (data.questions && data.questions.length > 0) {
            window.store.startQuiz(data.questions, `${dept || ministry} (${roleGrade}) Competency Assessment`);
        } else {
            window.store.navigate('ai-generator');
        }
    })
    .catch(() => {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-play text-[10px]"></i> Quick Check (5 Qs)`;
        }
        window.store.navigate('ai-generator');
    });
};

