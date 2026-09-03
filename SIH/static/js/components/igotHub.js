/**
 * iGOT Karmayogi & NSSTA Integration Hub Component
 * Handles API synchronizations, course catalogue retrieval, official enrolments, and NSSTA/TPAC recommended programmes.
 */

function renderIgotHub(state) {
    const igot = state.igotSync;
    const courses = state.courses;
    const programmes = state.trainingProgrammes;

    return `
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <!-- Header & Sync Status Widget -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-l-4 border-emerald-600">
            <div>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                        Mission Karmayogi Integration
                    </span>
                    <span class="text-xs text-slate-500">Government of India Learning Ecosystem</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-black text-navy-900 mt-2" style="color: #0B2545;">
                    iGOT Karmayogi & NSSTA Integration Hub
                </h1>
                <p class="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
                    Unified bidirectional API bridge syncing competency metadata, course completions, learning hours, and NSSTA/TPAC recommended training programmes.
                </p>
            </div>

            <!-- Live Sync Monitor Card -->
            <div class="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-xs shadow-lg">
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <strong class="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">iGOT API Connected</strong>
                    </div>
                    <div class="text-[11px] text-slate-300">Last Sync: <strong class="text-white">${igot.lastSync}</strong></div>
                    <div class="text-[11px] text-slate-400">Courses: <strong class="text-white">${igot.coursesSynced.toLocaleString()}</strong> | Users: <strong class="text-white">${igot.activeUsers.toLocaleString()}</strong></div>
                </div>

                <button onclick="triggerIgotSync()" id="syncBtn" class="btn btn-saffron text-xs py-2 px-3.5 whitespace-nowrap">
                    <i class="fa-solid fa-rotate mr-1"></i> Sync Now
                </button>
            </div>
        </div>

        <!-- Two Tabs: 1. iGOT Course Catalogue | 2. NSSTA/TPAC Training Programmes -->
        <div class="space-y-6">
            <div class="flex items-center border-b border-slate-200 gap-4 text-sm font-bold">
                <button onclick="switchIgotTab('courses')" id="tabCoursesBtn" class="pb-3 border-b-2 border-navy-900 text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                    <i class="fa-solid fa-graduation-cap text-orange-500"></i> iGOT Courses Catalogue (${courses.length})
                </button>
                <button onclick="switchIgotTab('programmes')" id="tabProgrammesBtn" class="pb-3 text-slate-500 hover:text-navy-900 flex items-center gap-2">
                    <i class="fa-solid fa-building-columns text-slate-400"></i> NSSTA / TPAC Programmes (${programmes.length})
                </button>
            </div>

            <!-- Tab 1: iGOT Courses Grid -->
            <div id="igotCoursesTab" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${courses.map(course => `
                        <div class="stat-card p-5 flex flex-col justify-between space-y-4">
                            <div class="space-y-2">
                                <div class="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                                    <span>${course.code}</span>
                                    <span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">${course.source}</span>
                                </div>
                                <h3 class="text-base font-bold text-navy-900" style="color: #0B2545;">${course.title}</h3>
                                <p class="text-xs text-slate-600 line-clamp-2">${course.description}</p>
                                
                                <div class="pt-2 flex flex-wrap gap-1">
                                    ${course.competencies.map(c => `
                                        <span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">${c}</span>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span class="text-slate-500"><i class="fa-regular fa-clock"></i> ${course.duration}</span>
                                <button onclick="addCourseToPath('${course.id}')" class="btn btn-primary text-xs py-1.5 px-3">
                                    <i class="fa-solid fa-plus"></i> Enrol & Track
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Tab 2: NSSTA / TPAC Programmes -->
            <div id="igotProgrammesTab" class="hidden space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${programmes.map(prog => `
                        <div class="stat-card p-6 space-y-4 border-l-4 ${prog.recommendedForUser ? 'border-orange-500' : 'border-slate-300'}">
                            <div class="flex justify-between items-start gap-2">
                                <div>
                                    <span class="text-[10px] font-bold text-orange-600 uppercase tracking-wide bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                                        ${prog.programmeCode}
                                    </span>
                                    <h3 class="text-lg font-bold text-navy-900 mt-1" style="color: #0B2545;">${prog.name}</h3>
                                    <span class="text-xs text-slate-500 font-medium block mt-0.5">${prog.organizer}</span>
                                </div>
                                <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                                    ${prog.registrationStatus}
                                </span>
                            </div>

                            <div class="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700">
                                <div class="flex justify-between">
                                    <span class="text-slate-500">Mode:</span>
                                    <strong class="text-navy-900">${prog.mode}</strong>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-500">Duration & Dates:</span>
                                    <strong>${prog.duration} (${prog.startDate})</strong>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-500">Eligibility:</span>
                                    <span>${prog.eligibility}</span>
                                </div>
                            </div>

                            ${prog.recommendedForUser ? `
                                <div class="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-950 flex items-start gap-2">
                                    <i class="fa-solid fa-sparkles text-orange-600 mt-0.5"></i>
                                    <div>
                                        <strong>AI Match Recommendation:</strong>
                                        <p class="text-[11px] mt-0.5 text-orange-900">${prog.recommendationReason}</p>
                                    </div>
                                </div>
                            ` : ''}

                            <div class="space-y-1 text-xs">
                                <span class="font-bold text-slate-700 block">Curriculum Highlights:</span>
                                <ul class="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                                    ${prog.curriculumHighlights.map(h => `<li>${h}</li>`).join('')}
                                </ul>
                            </div>

                            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span class="text-slate-500 font-semibold">${prog.seatsAvailable} Seats Remaining</span>
                                <button onclick="alert('Nomination request forwarded to MoSPI Capacity Building Cell.')" class="btn btn-saffron text-xs py-2 px-4 shadow-sm">
                                    <i class="fa-solid fa-paper-plane"></i> Apply for Nomination
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>
    `;
}

function switchIgotTab(tab) {
    const coursesTab = document.getElementById('igotCoursesTab');
    const progTab = document.getElementById('igotProgrammesTab');
    const btnC = document.getElementById('tabCoursesBtn');
    const btnP = document.getElementById('tabProgrammesBtn');

    if (tab === 'courses') {
        coursesTab.classList.remove('hidden');
        progTab.classList.add('hidden');
        btnC.classList.add('border-b-2', 'border-navy-900', 'text-navy-900');
        btnC.classList.remove('text-slate-500');
        btnP.classList.remove('border-b-2', 'border-navy-900', 'text-navy-900');
        btnP.classList.add('text-slate-500');
    } else {
        coursesTab.classList.add('hidden');
        progTab.classList.remove('hidden');
        btnP.classList.add('border-b-2', 'border-navy-900', 'text-navy-900');
        btnP.classList.remove('text-slate-500');
        btnC.classList.remove('border-b-2', 'border-navy-900', 'text-navy-900');
        btnC.classList.add('text-slate-500');
    }
}

function triggerIgotSync() {
    const btn = document.getElementById('syncBtn');
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i> Syncing...`;
    btn.disabled = true;

    setTimeout(() => {
        const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ", " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        window.store.state.igotSync.lastSync = now;
        window.store.state.igotSync.coursesSynced += 3;
        window.store.notify();
        alert(`iGOT Karmayogi Synchronization Successful!\nUpdated: ${now}\nSynchronized 2,489 courses and learner records.`);
    }, 1000);
}

window.renderIgotHub = renderIgotHub;
window.switchIgotTab = switchIgotTab;
window.triggerIgotSync = triggerIgotSync;
