/**
 * AI Learning Advisor & Recommendation Engine Component
 * Features: Transparent recommendation formula breakdown, explainable AI "Why this course?", 1-click Add to Learning Path.
 */

function renderRecommendations(state) {
    const courses = state.courses;
    const lang = state.currentLanguage;

    const user = state.user || {};
    const officerTier = (typeof window.getOfficerRoleTier === 'function') ? window.getOfficerRoleTier(user) : (state.officerFracTier || 'Junior');
    const tierInfo = MOCK_DATA.fracRoleTiers ? MOCK_DATA.fracRoleTiers[officerTier] : { title: "Junior Cadre", experienceRange: "3–7 yrs" };

    return `
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <!-- Header -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-orange-500">
            <div>
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> AI Learning Advisor
                    </span>
                    <span class="text-xs font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                        <i class="fa-solid fa-scale-balanced"></i> FRAC Benchmarked: <strong>${tierInfo.title}</strong>
                    </span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-black text-navy-900 mt-2" style="color: #0B2545;">
                    Personalized Course & Training Recommendations
                </h1>
                <p class="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1">
                    Calibrated against the <strong>Government FRAC 5-Level Competency Model</strong> for ${user.designation || 'Indian Statistical Officers'} to systematically bridge measured skill gaps.
                </p>
            </div>

            <button onclick="showFormulaModal()" class="btn btn-secondary text-xs py-2.5 px-4 whitespace-nowrap">
                <i class="fa-solid fa-calculator text-orange-500"></i> View FRAC Scoring Formula
            </button>
        </div>

        <!-- Transparent AI Formula Banner -->
        <div class="stat-card p-5 bg-gradient-to-r from-blue-50 via-slate-50 to-orange-50 rounded-2xl border border-blue-200">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div class="space-y-1">
                    <div class="font-bold text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                        <i class="fa-solid fa-brain-circuit text-orange-500"></i> Transparent FRAC-Aligned Scoring Algorithm
                    </div>
                    <p class="text-slate-600 text-[11px]">
                        Every recommendation compares your assessed competency level against official <strong>FRAC Cadre Targets (L1–L5)</strong> using an explainable decision model.
                    </p>
                </div>
                <div class="flex flex-wrap gap-2 text-[11px] font-bold">
                    <span class="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-red-700">35% FRAC Competency Gap</span>
                    <span class="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-blue-700">20% Role Relevance</span>
                    <span class="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-emerald-700">15% Cadre Progression</span>
                    <span class="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-amber-700">15% Dept Priority</span>
                    <span class="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-purple-700">8% Prior Learning</span>
                    <span class="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-indigo-700">7% Emerging Demand</span>
                </div>
            </div>
        </div>

        <!-- Course Filter Controls -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div class="flex items-center gap-2 flex-wrap text-xs">
                <span class="font-bold text-slate-600">Source:</span>
                <button onclick="filterCourseSource('all')" class="crs-filter-btn active px-3 py-1.5 rounded-lg font-bold bg-navy-900 text-white" style="background: #0B2545;">All Sources (${courses.length})</button>
                <button onclick="filterCourseSource('iGOT Karmayogi')" class="crs-filter-btn px-3 py-1.5 rounded-lg font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">iGOT Karmayogi</button>
                <button onclick="filterCourseSource('NSSTA')" class="crs-filter-btn px-3 py-1.5 rounded-lg font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">NSSTA Programmes</button>
                <button onclick="filterCourseSource('TPAC Recommended')" class="crs-filter-btn px-3 py-1.5 rounded-lg font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">TPAC Recommended</button>
            </div>
            <div class="text-xs text-slate-500 font-semibold">
                Showing <strong class="text-navy-900" id="crsCountDisplay">${courses.length}</strong> Curated Activities
            </div>
        </div>

        <!-- Recommended Courses Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="coursesGrid">
            ${courses.map(course => {
        const isAdded = state.learningPath.some(item => item.title === course.title);

        return `
                <div class="stat-card overflow-hidden flex flex-col justify-between course-card" data-source="${course.source}">
                    <div>
                        <!-- Thumbnail Header with Match Badge -->
                        <div class="relative h-44 overflow-hidden bg-slate-800">
                            <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-full object-cover opacity-90 hover:scale-105 transition-all duration-300">
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                            
                            <!-- AI Match Score Badge -->
                            <div class="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-navy-900 px-2.5 py-1 rounded-lg font-black text-xs shadow-md border border-slate-200 flex items-center gap-1.5">
                                <i class="fa-solid fa-sparkles text-orange-500"></i> ${course.matchScore}% Match
                            </div>

                            <!-- Source & Priority Badge -->
                            <div class="absolute bottom-3 left-3 flex items-center gap-2 text-[10px] font-bold">
                                <span class="bg-navy-900/90 text-white px-2 py-0.5 rounded-md border border-slate-700">${course.source}</span>
                                <span class="${course.priority === 'Critical' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'} px-2 py-0.5 rounded-md">${course.priority} Priority</span>
                            </div>
                        </div>

                        <!-- Card Body -->
                        <div class="p-5 space-y-3 text-xs">
                            <div>
                                <span class="text-[10px] font-semibold text-slate-400 block uppercase tracking-wide">${course.code} • ${course.provider}</span>
                                <h3 class="text-base font-bold text-navy-900 mt-1 leading-snug" style="color: #0B2545;">${course.title}</h3>
                            </div>

                            <p class="text-slate-600 line-clamp-2 text-[11px] leading-relaxed">
                                ${course.description}
                            </p>

                            <!-- Competencies Addressed -->
                            <div class="flex flex-wrap gap-1 pt-1">
                                ${course.competencies.map(c => `
                                    <span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200">${c}</span>
                                `).join('')}
                            </div>

                            <!-- Why Recommended Explanation Box -->
                            <div class="p-3 bg-orange-50/80 rounded-xl border border-orange-200/70 text-[11px] space-y-1">
                                <div class="font-bold text-orange-900 flex items-center justify-between">
                                    <span><i class="fa-solid fa-lightbulb text-orange-600 mr-1"></i> Why this course?</span>
                                    <button onclick="showCourseBreakdownModal('${course.id}')" class="text-orange-700 hover:underline text-[10px]">
                                        Score Breakdown <i class="fa-solid fa-chevron-right text-[8px]"></i>
                                    </button>
                                </div>
                                <p class="text-orange-950/80 leading-relaxed">${course.whyRecommended}</p>
                            </div>

                            <!-- Metadata info -->
                            <div class="flex items-center justify-between text-slate-500 text-[11px] pt-1">
                                <span><i class="fa-regular fa-clock text-slate-400"></i> ${course.duration}</span>
                                <span><i class="fa-solid fa-layer-group text-slate-400"></i> ${course.currentLevel} → ${course.targetLevel}</span>
                                <span><i class="fa-solid fa-star text-amber-500"></i> ${course.rating}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Card Actions -->
                    <div class="p-5 pt-0 flex items-center gap-2">
                        <button onclick="addCourseToPath('${course.id}')" class="btn ${isAdded ? 'btn-secondary text-emerald-700' : 'btn-saffron'} text-xs py-2 px-3 flex-1">
                            ${isAdded ? '<i class="fa-solid fa-check text-emerald-600"></i> In Learning Path' : '<i class="fa-solid fa-plus"></i> Add to Learning Path'}
                        </button>
                        <button onclick="enrolCourseDirect('${course.id}')" class="btn btn-primary text-xs py-2 px-3" title="Enrol on iGOT">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </button>
                    </div>
                </div>
                `;
    }).join('')}
        </div>
    </div>

    <!-- Recommendation Formula Detail Modal -->
    <div id="formulaModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 class="text-lg font-bold text-navy-900" style="color: #0B2545;">AI Recommendation Scoring Formula</h3>
                <button onclick="document.getElementById('formulaModal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700 text-lg">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="text-xs text-slate-700 space-y-3">
                <div class="p-3 bg-slate-900 text-white rounded-xl font-mono text-center text-xs">
                    Score = (0.30 × Gap) + (0.20 × Role) + (0.15 × Career) + (0.15 × Dept) + (0.10 × Prior) + (0.10 × Demand)
                </div>
                <p>
                    This mathematical model ensures that courses are ranked objectively based on verifiable official statistical needs rather than subjective popularity.
                </p>
                <div class="space-y-1.5 text-[11px]">
                    <div><strong>Competency Gap (30%):</strong> Magnitude of difference between mandated target level and current assessed level.</div>
                    <div><strong>Job Role Relevance (20%):</strong> Alignment with Subordinate Statistical Service (SSS) job specifications.</div>
                    <div><strong>Career Relevance (15%):</strong> Contribution toward promotional cadre benchmarks.</div>
                    <div><strong>Department Priority (15%):</strong> Directives from MoSPI, NSSTA, and National Statistical Commission (NSC).</div>
                </div>
            </div>
            <div class="pt-3 border-t border-slate-100 flex justify-end">
                <button onclick="document.getElementById('formulaModal').classList.add('hidden')" class="btn btn-primary text-xs py-2 px-4">
                    Close
                </button>
            </div>
        </div>
    </div>

    <!-- Course Score Breakdown Modal -->
    <div id="courseBreakdownModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 class="text-base font-bold text-navy-900" id="breakdownTitle" style="color: #0B2545;">Recommendation Breakdown</h3>
                <button onclick="document.getElementById('courseBreakdownModal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700 text-lg">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="space-y-2 text-xs" id="breakdownScoresList"></div>
            <div class="pt-3 border-t border-slate-100 flex justify-end">
                <button onclick="document.getElementById('courseBreakdownModal').classList.add('hidden')" class="btn btn-primary text-xs py-2 px-4">
                    Done
                </button>
            </div>
        </div>
    </div>
    `;
}

function filterCourseSource(source) {
    document.querySelectorAll('.crs-filter-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-navy-900', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-700');
    });
    event.target.classList.add('active', 'bg-navy-900', 'text-white');
    event.target.classList.remove('bg-slate-100', 'text-slate-700');

    let visible = 0;
    document.querySelectorAll('.course-card').forEach(card => {
        if (source === 'all' || card.dataset.source === source) {
            card.style.display = 'flex';
            visible++;
        } else {
            card.style.display = 'none';
        }
    });
    const countDisplay = document.getElementById('crsCountDisplay');
    if (countDisplay) countDisplay.innerText = visible;
}

function addCourseToPath(courseId) {
    if (!window.store.state.user) {
        window.store.openAuthModal('register');
        return;
    }
    const course = window.store.state.courses.find(c => c.id === courseId);
    if (course) {
        const added = window.store.addCourseToLearningPath(course);
        if (added) {
            alert(`Success: "${course.title}" has been added to your Personalized Learning Roadmap.`);
        }
    }
}

function enrolCourseDirect(courseId) {
    if (!window.store.state.user) {
        window.store.openAuthModal('register');
        return;
    }
    const course = window.store.state.courses.find(c => c.id === courseId);
    if (course) {
        window.store.addCourseToLearningPath(course);
        window.store.navigate('igot-hub');
    }
}

function showFormulaModal() {
    document.getElementById('formulaModal').classList.remove('hidden');
}

function showCourseBreakdownModal(courseId) {
    const course = window.store.state.courses.find(c => c.id === courseId);
    if (!course || !course.breakdown) return;

    document.getElementById('breakdownTitle').innerText = `${course.title} — AI Sub-scores`;
    const b = course.breakdown;

    const html = `
        <div class="p-3 bg-slate-50 rounded-xl space-y-2">
            <div class="flex justify-between items-center font-semibold">
                <span>Competency Gap (30% weight)</span>
                <strong class="text-red-600">${b.gapWeight} / 100</strong>
            </div>
            <div class="flex justify-between items-center font-semibold">
                <span>Job Role Relevance (20% weight)</span>
                <strong class="text-blue-600">${b.roleRelevance} / 100</strong>
            </div>
            <div class="flex justify-between items-center font-semibold">
                <span>Career Impact (15% weight)</span>
                <strong class="text-emerald-600">${b.careerImpact} / 100</strong>
            </div>
            <div class="flex justify-between items-center font-semibold">
                <span>Department Priority (15% weight)</span>
                <strong class="text-amber-600">${b.deptPriority} / 100</strong>
            </div>
            <div class="flex justify-between items-center font-semibold">
                <span>Previous Learning Match (10%)</span>
                <strong class="text-purple-600">${b.priorLearning} / 100</strong>
            </div>
            <div class="flex justify-between items-center font-semibold">
                <span>Emerging Demand (10%)</span>
                <strong class="text-indigo-600">${b.emergingDemand} / 100</strong>
            </div>
            <div class="pt-2 border-t border-slate-200 flex justify-between items-center font-black text-sm text-navy-900">
                <span>Final Weighted Match Score:</span>
                <span class="text-orange-600">${course.matchScore}%</span>
            </div>
        </div>
    `;

    document.getElementById('breakdownScoresList').innerHTML = html;
    document.getElementById('courseBreakdownModal').classList.remove('hidden');
}

window.renderRecommendations = renderRecommendations;
window.filterCourseSource = filterCourseSource;
window.addCourseToPath = addCourseToPath;
window.enrolCourseDirect = enrolCourseDirect;
window.showFormulaModal = showFormulaModal;
window.showCourseBreakdownModal = showCourseBreakdownModal;
