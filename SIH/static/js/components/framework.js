/**
 * Competency Framework Component
 * Interactive catalog of 31+ official statistical competencies across 4 domains
 * Benchmarked against the Government FRAC (Framework of Roles, Activities and Competencies) Model (L1–L5).
 */

function renderCompetencyFramework(state) {
    const lang = state.currentLanguage;
    const framework = state.competencyFramework;
    const user = state.user || {};
    const officerTier = (typeof window.getOfficerRoleTier === 'function') ? window.getOfficerRoleTier(user) : (state.officerFracTier || 'Junior');
    const tierInfo = MOCK_DATA.fracRoleTiers ? MOCK_DATA.fracRoleTiers[officerTier] : { title: "Junior Cadre", experienceRange: "3–7 yrs" };

    return `
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <!-- Header & Official FRAC Benchmark Badge -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
                        Government FRAC Competency Matrix (iGOT Karmayogi)
                    </span>
                    <span class="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <i class="fa-solid fa-user-shield"></i> Your Cadre: <strong>${tierInfo.title}</strong>
                    </span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-black text-navy-900 mt-2" style="color: #0B2545;">
                    Indian Statistical Service & Cadre Competency Matrix
                </h1>
                <p class="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1 leading-relaxed">
                    Official 5-Proficiency-Level (L1–L5) standard defining mandated competencies across 3 designated officer tiers: <strong>Entry (0–2 yrs)</strong>, <strong>Junior (3–7 yrs)</strong>, and <strong>Senior (8+ yrs)</strong>.
                </p>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="store.navigate('assessment')" class="btn btn-saffron text-xs sm:text-sm py-2.5 px-4 shadow-sm whitespace-nowrap">
                    <i class="fa-solid fa-clipboard-check"></i> Evaluate My Competency
                </button>
            </div>
        </div>

        <!-- 5-Level FRAC Competency Maturity Model Reference Banner -->
        <div class="stat-card p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white rounded-2xl shadow-md" style="background: #0B2545;">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h2 class="text-base font-bold text-orange-400 flex items-center gap-2">
                    <i class="fa-solid fa-layer-group"></i> The 5-Level FRAC Proficiency Architecture
                </h2>
                <span class="text-[11px] text-slate-300">Framework of Roles, Activities and Competencies — MoSPI & CBC</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                <div class="p-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition-all">
                    <div class="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                        <span class="w-5 h-5 rounded-full bg-slate-700 text-white text-[10px] flex items-center justify-center font-bold">L1</span>
                        Beginner / Awareness
                    </div>
                    <p class="text-[11px] text-slate-300">Knows concept exists, basic terminology, assists seniors.</p>
                </div>
                <div class="p-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition-all">
                    <div class="font-bold text-blue-300 mb-1 flex items-center gap-1.5">
                        <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">L2</span>
                        Basic / Foundational
                    </div>
                    <p class="text-[11px] text-slate-300">Performs simple, well-defined routine tasks with guidance.</p>
                </div>
                <div class="p-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition-all">
                    <div class="font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                        <span class="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">L3</span>
                        Working / Intermediate
                    </div>
                    <p class="text-[11px] text-slate-300">Applies independently in standard situations, scripts pipelines.</p>
                </div>
                <div class="p-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition-all">
                    <div class="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                        <span class="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">L4</span>
                        Advanced
                    </div>
                    <p class="text-[11px] text-slate-300">Handles complex/non-standard challenges, guides teams.</p>
                </div>
                <div class="p-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition-all">
                    <div class="font-bold text-orange-300 mb-1 flex items-center gap-1.5">
                        <span class="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center font-bold">L5</span>
                        Expert / Strategic
                    </div>
                    <p class="text-[11px] text-slate-300">Sets direction, designs national frameworks & policy calls.</p>
                </div>
            </div>
        </div>

        <!-- Role-Tier Filter Tabs & Search Bar -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <!-- Role Cadre Benchmark Selector -->
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <i class="fa-solid fa-id-badge text-blue-600"></i> Benchmark Cadre:
                    </span>
                    <button onclick="filterRoleTier('All')" class="role-tier-btn active px-3 py-1.5 rounded-lg text-xs font-bold bg-navy-900 text-white shadow-sm" style="background: #0B2545;">
                        All Cadres (Reference)
                    </button>
                    <button onclick="filterRoleTier('Entry')" class="role-tier-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">
                        Entry Tier (Probationer / JSO)
                    </button>
                    <button onclick="filterRoleTier('Junior')" class="role-tier-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">
                        Junior Cadre (SO / AD)
                    </button>
                    <button onclick="filterRoleTier('Senior')" class="role-tier-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">
                        Senior Cadre (SSO / Director+)
                    </button>
                </div>

                <!-- View Switcher -->
                <div class="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                    <button id="viewCardsBtn" onclick="switchFrameworkView('cards')" class="px-3 py-1 rounded-lg text-xs font-bold bg-white text-navy-900 shadow-xs">
                        <i class="fa-solid fa-grip"></i> Card View
                    </button>
                    <button id="viewTableBtn" onclick="switchFrameworkView('table')" class="px-3 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-navy-900">
                        <i class="fa-solid fa-table-list"></i> Full FRAC Matrix Table
                    </button>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
                <div class="relative w-full sm:w-80">
                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs"></i>
                    <input type="text" id="compSearchInput" onkeyup="filterCompetencyCards()" placeholder="Search competencies, tools, frameworks..." class="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-navy-900">
                </div>

                <div class="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                    <span class="text-xs text-slate-500 font-semibold">Domain:</span>
                    <button onclick="filterDomain('all')" class="domain-btn active px-3 py-1.5 rounded-lg text-xs font-bold bg-navy-900 text-white" style="background: #0B2545;">All (4 Domains)</button>
                    <button onclick="filterDomain('stat')" class="domain-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">Statistical (10)</button>
                    <button onclick="filterDomain('tech')" class="domain-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">Technical (10)</button>
                    <button onclick="filterDomain('gov')" class="domain-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">Governance (5)</button>
                    <button onclick="filterDomain('mgmt')" class="domain-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">Managerial (6)</button>
                </div>
            </div>
        </div>

        <!-- 1. Card View Container -->
        <div class="space-y-10" id="competencyCardsView">
            ${framework.map(domain => `
                <div class="space-y-4 domain-section" data-domain="${domain.domainId}">
                    <div class="flex items-center justify-between border-b border-slate-200 pb-2">
                        <div class="flex items-center gap-2.5">
                            <span class="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center text-sm" style="background: #0B2545;">
                                <i class="fa-solid fa-${domain.icon}"></i>
                            </span>
                            <div>
                                <h2 class="text-xl font-bold text-navy-900" style="color: #0B2545;">${domain.domainName}</h2>
                                <span class="text-xs text-slate-500">${domain.competencies.length} Competencies calibrated against FRAC</span>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        ${domain.competencies.map(comp => {
                            const levelLabels = { 1: "L1 Awareness", 2: "L2 Foundation", 3: "L3 Working", 4: "L4 Advanced", 5: "L5 Expert" };
                            const levelColors = {
                                1: "bg-slate-100 text-slate-700 border-slate-300",
                                2: "bg-blue-50 text-blue-700 border-blue-200",
                                3: "bg-emerald-50 text-emerald-700 border-emerald-200",
                                4: "bg-amber-50 text-amber-800 border-amber-200",
                                5: "bg-orange-50 text-orange-800 border-orange-300"
                            };

                            let gapBadge = comp.gap > 0 ? (comp.priority === "Critical" ? "gap-critical" : "gap-high") : "gap-none";

                            return `
                            <div class="stat-card p-5 space-y-4 flex flex-col justify-between competency-card" data-name="${comp.name.toLowerCase()}" data-desc="${comp.description.toLowerCase()}">
                                <div class="space-y-2">
                                    <div class="flex justify-between items-start gap-2">
                                        <h3 class="text-base font-bold text-navy-900" style="color: #0B2545;">${comp.name}</h3>
                                        <span class="${gapBadge}">
                                            ${comp.gap > 0 ? `Gap: ${comp.gap} Levels` : 'Compliant'}
                                        </span>
                                    </div>
                                    <p class="text-xs text-slate-600 leading-relaxed">${comp.description}</p>
                                </div>

                                <!-- FRAC Role Tier Target Matrix Box -->
                                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                                    <div class="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <span>FRAC Role Expectations</span>
                                        <span class="text-blue-700">Official Standard</span>
                                    </div>
                                    <div class="grid grid-cols-3 gap-1.5 text-center">
                                        <div class="p-1.5 rounded-lg border ${officerTier === 'Entry' ? 'border-blue-500 bg-blue-100 font-bold ring-1 ring-blue-400' : 'border-slate-200 bg-white'}">
                                            <div class="text-[10px] text-slate-500">Entry (0-2y)</div>
                                            <div class="text-xs font-bold text-navy-900">L${comp.fracEntry || 2}</div>
                                        </div>
                                        <div class="p-1.5 rounded-lg border ${officerTier === 'Junior' ? 'border-emerald-500 bg-emerald-100 font-bold ring-1 ring-emerald-400' : 'border-slate-200 bg-white'}">
                                            <div class="text-[10px] text-slate-500">Junior (3-7y)</div>
                                            <div class="text-xs font-bold text-navy-900">L${comp.fracJunior || 3}</div>
                                        </div>
                                        <div class="p-1.5 rounded-lg border ${officerTier === 'Senior' ? 'border-orange-500 bg-orange-100 font-bold ring-1 ring-orange-400' : 'border-slate-200 bg-white'}">
                                            <div class="text-[10px] text-slate-500">Senior (8+y)</div>
                                            <div class="text-xs font-bold text-navy-900">L${comp.fracSenior || 4}</div>
                                        </div>
                                    </div>

                                    <!-- Current Official Progress -->
                                    <div class="pt-2 border-t border-slate-200 space-y-1">
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-600">Your Assessed Level:</span>
                                            <strong class="text-navy-900 font-bold">${levelLabels[comp.currentLevel] || 'L2 Basic'}</strong>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-600">Your Cadre Target (${officerTier}):</span>
                                            <strong class="text-orange-700 font-bold">${levelLabels[comp.requiredLevel] || 'L4 Advanced'}</strong>
                                        </div>
                                        <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                                            <div class="h-full rounded-full" style="width: ${(comp.currentLevel / (comp.requiredLevel || 5)) * 100}%; background: ${comp.gap > 0 ? '#ea580c' : '#16a34a'};"></div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                                    <button onclick="showCompetencyLevelModal('${comp.id}')" class="text-blue-700 hover:underline font-bold flex items-center gap-1">
                                        <i class="fa-solid fa-circle-info text-[11px]"></i> L1–L5 Rubric
                                    </button>
                                    <button onclick="store.navigate('recommendations')" class="btn btn-secondary text-[11px] py-1 px-2.5 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200">
                                        <i class="fa-solid fa-graduation-cap text-orange-500"></i> Bridging Courses
                                    </button>
                                </div>
                            </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `).join('')}
        </div>

        <!-- 2. Full FRAC Reference Matrix Table View -->
        <div id="competencyTableView" class="hidden bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <h3 class="font-bold text-navy-900 text-sm" style="color: #0B2545;">
                        Complete FRAC-Based Competency Benchmark Matrix
                    </h3>
                    <p class="text-xs text-slate-500">All 31 Official Competencies Mapped Across 3 Designated Role Tiers</p>
                </div>
                <span class="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full">Official Standard</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr class="bg-navy-900 text-white font-bold" style="background: #0B2545;">
                            <th class="p-3">#</th>
                            <th class="p-3">Domain</th>
                            <th class="p-3">Competency</th>
                            <th class="p-3 text-center bg-blue-950">Entry (0–2y)</th>
                            <th class="p-3 text-center bg-slate-800">Junior (3–7y)</th>
                            <th class="p-3 text-center bg-blue-900">Senior (8+y)</th>
                            <th class="p-3">Key Government Activities & Scope</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200 text-slate-700">
                        ${framework.flatMap((d, dIdx) => d.competencies.map((c, cIdx) => `
                            <tr class="hover:bg-slate-50">
                                <td class="p-3 font-semibold text-slate-400">${dIdx + 1}.${cIdx + 1}</td>
                                <td class="p-3 font-bold text-navy-900">${d.domainName.split(' ')[0]}</td>
                                <td class="p-3 font-bold text-slate-900">${c.name}</td>
                                <td class="p-3 text-center font-bold text-blue-700 bg-blue-50/50">L${c.fracEntry || 2}</td>
                                <td class="p-3 text-center font-bold text-emerald-700 bg-emerald-50/50">L${c.fracJunior || 3}</td>
                                <td class="p-3 text-center font-bold text-orange-700 bg-orange-50/50">L${c.fracSenior || 4}</td>
                                <td class="p-3 text-slate-600 text-[11px]">${c.description}</td>
                            </tr>
                        `)).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Competency Level Detail Modal -->
    <div id="compLevelModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                    <span class="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full uppercase">FRAC 5-Level Rubric</span>
                    <h3 class="text-lg font-bold text-navy-900 mt-1" id="modalCompTitle" style="color: #0B2545;">Competency Levels</h3>
                </div>
                <button onclick="document.getElementById('compLevelModal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700 text-lg">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <p class="text-xs text-slate-600" id="modalCompDesc"></p>
            <div class="space-y-2.5 text-xs" id="modalLevelsList"></div>
            <div class="pt-3 border-t border-slate-100 flex justify-end">
                <button onclick="document.getElementById('compLevelModal').classList.add('hidden')" class="btn btn-primary text-xs py-2 px-4">
                    Close
                </button>
            </div>
        </div>
    </div>
    `;
}

function filterRoleTier(tier) {
    document.querySelectorAll('.role-tier-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-navy-900', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-700');
    });
    event.target.classList.add('active', 'bg-navy-900', 'text-white');
    event.target.classList.remove('bg-slate-100', 'text-slate-700');

    if (tier === 'All') {
        // Reset to officer's own tier
        window.store.syncUserFRACCompetencies();
    } else {
        // Evaluate framework specifically for the selected tier
        window.store.state.competencyFramework.forEach(domain => {
            domain.competencies.forEach(comp => {
                comp.requiredLevel = comp[`frac${tier}`] || 3;
                comp.gap = Math.max(0, comp.requiredLevel - comp.currentLevel);
                comp.priority = comp.gap >= 2 ? "Critical" : (comp.gap === 1 ? "High" : "None");
            });
        });
    }
    window.store.notify();
}

function switchFrameworkView(view) {
    const cards = document.getElementById('competencyCardsView');
    const table = document.getElementById('competencyTableView');
    const cardsBtn = document.getElementById('viewCardsBtn');
    const tableBtn = document.getElementById('viewTableBtn');

    if (view === 'cards') {
        cards.classList.remove('hidden');
        table.classList.add('hidden');
        cardsBtn.className = "px-3 py-1 rounded-lg text-xs font-bold bg-white text-navy-900 shadow-xs";
        tableBtn.className = "px-3 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-navy-900";
    } else {
        cards.classList.add('hidden');
        table.classList.remove('hidden');
        tableBtn.className = "px-3 py-1 rounded-lg text-xs font-bold bg-white text-navy-900 shadow-xs";
        cardsBtn.className = "px-3 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-navy-900";
    }
}

function filterDomain(domainId) {
    document.querySelectorAll('.domain-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-navy-900', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-700');
    });
    event.target.classList.add('active', 'bg-navy-900', 'text-white');
    event.target.classList.remove('bg-slate-100', 'text-slate-700');

    document.querySelectorAll('.domain-section').forEach(sec => {
        if (domainId === 'all' || sec.dataset.domain === domainId) {
            sec.style.display = 'block';
        } else {
            sec.style.display = 'none';
        }
    });
}

function filterCompetencyCards() {
    const query = document.getElementById('compSearchInput').value.toLowerCase();
    document.querySelectorAll('.competency-card').forEach(card => {
        const name = card.dataset.name;
        const desc = card.dataset.desc;
        if (name.includes(query) || desc.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function showCompetencyLevelModal(compId) {
    let targetComp = null;
    window.store.state.competencyFramework.forEach(d => {
        d.competencies.forEach(c => {
            if (c.id === compId) targetComp = c;
        });
    });

    if (!targetComp) return;

    document.getElementById('modalCompTitle').innerText = `${targetComp.name} — FRAC Proficiency Standard`;
    document.getElementById('modalCompDesc').innerText = targetComp.description;

    const fracRubrics = {
        1: "Awareness & Concepts — Knows the concept exists, basic terminology, understands basic definitions, assists seniors.",
        2: "Foundational & Assisted Execution — Performs simple, well-defined tasks with guidance; executes standard data entry and basic scripts.",
        3: "Working & Independent Application — Applies independently in standard situations; scripts end-to-end data cleaning and computes survey weights.",
        4: "Advanced & Team Guidance — Handles complex/non-standard situations, audits methodologies, optimizes sample designs, and guides teams.",
        5: "Expert & Strategic Policy — Sets direction, designs frameworks, makes policy-level judgment calls, and leads national statistical revisions."
    };

    const html = [1, 2, 3, 4, 5].map(lvl => `
        <div class="p-3 rounded-xl border ${targetComp.currentLevel === lvl ? 'border-blue-500 bg-blue-50/70 shadow-xs' : (targetComp.requiredLevel === lvl ? 'border-orange-400 bg-orange-50/50' : 'border-slate-200 bg-slate-50')}">
            <div class="font-bold text-navy-900 flex justify-between items-center mb-1">
                <span>Level ${lvl} — ${["Awareness", "Foundational", "Working", "Advanced", "Expert"][lvl - 1]}</span>
                <div class="flex items-center gap-1.5">
                    ${targetComp.currentLevel === lvl ? '<span class="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">Your Current Assessed Level</span>' : ''}
                    ${targetComp.requiredLevel === lvl && targetComp.currentLevel !== lvl ? '<span class="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded-full font-bold">Cadre Required Target</span>' : ''}
                    ${lvl > targetComp.requiredLevel ? `<span class="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">Beyond Cadre Target (L${targetComp.requiredLevel} Max)</span>` : ''}
                </div>
            </div>
            <p class="text-[11px] text-slate-700">${fracRubrics[lvl]}</p>
        </div>
    `).join('');

    document.getElementById('modalLevelsList').innerHTML = html;
    document.getElementById('compLevelModal').classList.remove('hidden');
}

window.renderCompetencyFramework = renderCompetencyFramework;
window.filterRoleTier = filterRoleTier;
window.switchFrameworkView = switchFrameworkView;
window.filterDomain = filterDomain;
window.filterCompetencyCards = filterCompetencyCards;
window.showCompetencyLevelModal = showCompetencyLevelModal;

