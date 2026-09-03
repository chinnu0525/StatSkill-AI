/**
 * Trainer & Faculty Dashboard Component
 * For NSSTA faculty and training coordinators to manage question banks, review AI questions, and analyze learner bottlenecks.
 */

function renderTrainerDashboard(state) {
    return `
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <!-- Header -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-purple-600">
            <div>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1 rounded-full uppercase">
                        Faculty & Trainer Console
                    </span>
                    <span class="text-xs text-slate-500">NSSTA Greater Noida</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-black text-navy-900 mt-2" style="color: #0B2545;">
                    Trainer Hub & Assessment Quality Control
                </h1>
                <p class="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
                    Review and approve AI-generated questions, manage the central official question repository, and monitor learner performance bottlenecks across training cohorts.
                </p>
            </div>

            <div class="flex items-center gap-3">
                <button onclick="store.navigate('ai-generator')" class="btn btn-saffron text-xs py-2.5 px-4 shadow-sm">
                    <i class="fa-solid fa-plus"></i> Generate New Assessment
                </button>
            </div>
        </div>

        <!-- 4 Top KPIs for Trainer -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="stat-card p-5">
                <span class="text-xs font-bold text-slate-500 uppercase">Question Bank Size</span>
                <div class="text-3xl font-black text-navy-900 mt-1" style="color: #0B2545;">1,420</div>
                <span class="text-[10px] text-emerald-600 font-bold block mt-1">100% Bloom's Mapped</span>
            </div>
            <div class="stat-card p-5">
                <span class="text-xs font-bold text-slate-500 uppercase">Pending AI Review</span>
                <div class="text-3xl font-black text-orange-600 mt-1">28</div>
                <span class="text-[10px] text-orange-700 font-bold block mt-1">Requires Faculty Check</span>
            </div>
            <div class="stat-card p-5">
                <span class="text-xs font-bold text-slate-500 uppercase">Active Trainees</span>
                <div class="text-3xl font-black text-blue-600 mt-1">340</div>
                <span class="text-[10px] text-slate-500 block mt-1">Across 4 NSSTA Batches</span>
            </div>
            <div class="stat-card p-5">
                <span class="text-xs font-bold text-slate-500 uppercase">Average Pass Rate</span>
                <div class="text-3xl font-black text-emerald-600 mt-1">84.6%</div>
                <span class="text-[10px] text-emerald-600 font-bold block mt-1">↑ 3.2% this quarter</span>
            </div>
        </div>

        <!-- Question Bank Approval Queue & Weak Topics Analytics -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left 8 Cols: Question Bank Review Table -->
            <div class="lg:col-span-8 stat-card p-6 space-y-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-base font-bold text-navy-900" style="color: #0B2545;">
                            AI Question Quality Review Queue
                        </h2>
                        <p class="text-xs text-slate-500">Draft → Review → Approved → Published workflow</p>
                    </div>
                    <span class="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold">5 Items in Queue</span>
                </div>

                <div class="space-y-3 text-xs" id="trainerQuestionsQueue">
                    <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                        <div class="flex justify-between items-start">
                            <span class="font-bold text-navy-900">Which sampling method is most appropriate when the population is divided into homogeneous subgroups?</span>
                            <span class="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold text-[10px]">Under Review</span>
                        </div>
                        <div class="flex items-center justify-between text-slate-500 text-[11px]">
                            <span>Topic: Multi-Stage Stratified Sampling • Bloom: Apply</span>
                            <div class="flex items-center gap-2">
                                <button onclick="alert('Question verified against source and published to national bank!')" class="btn btn-primary text-[10px] py-1 px-2.5">
                                    <i class="fa-solid fa-check"></i> Approve & Publish
                                </button>
                                <button onclick="alert('Sent back for AI regeneration.')" class="btn btn-secondary text-[10px] py-1 px-2.5">
                                    <i class="fa-solid fa-rotate"></i> Regenerate
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                        <div class="flex justify-between items-start">
                            <span class="font-bold text-navy-900">In CPI compilation, which formula aggregates elementary indices with base-year weights?</span>
                            <span class="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold text-[10px]">Under Review</span>
                        </div>
                        <div class="flex items-center justify-between text-slate-500 text-[11px]">
                            <span>Topic: Price Indices • Bloom: Understand</span>
                            <div class="flex items-center gap-2">
                                <button onclick="alert('Question approved!')" class="btn btn-primary text-[10px] py-1 px-2.5">
                                    <i class="fa-solid fa-check"></i> Approve & Publish
                                </button>
                                <button class="btn btn-secondary text-[10px] py-1 px-2.5">
                                    <i class="fa-solid fa-rotate"></i> Regenerate
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                        <div class="flex justify-between items-start">
                            <span class="font-bold text-navy-900">Which Pandas function optimizes vectorized group-by aggregations for weighted GDP?</span>
                            <span class="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold text-[10px]">Under Review</span>
                        </div>
                        <div class="flex items-center justify-between text-slate-500 text-[11px]">
                            <span>Topic: Python for Statistics • Bloom: Apply</span>
                            <div class="flex items-center gap-2">
                                <button onclick="alert('Question approved!')" class="btn btn-primary text-[10px] py-1 px-2.5">
                                    <i class="fa-solid fa-check"></i> Approve & Publish
                                </button>
                                <button class="btn btn-secondary text-[10px] py-1 px-2.5">
                                    <i class="fa-solid fa-rotate"></i> Regenerate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right 4 Cols: Weak-Topic Heatmap Diagnostics -->
            <div class="lg:col-span-4 stat-card p-6 space-y-4">
                <div>
                    <h2 class="text-base font-bold text-navy-900" style="color: #0B2545;">
                        Trainee Bottlenecks (Weak Topics)
                    </h2>
                    <p class="text-xs text-slate-500">Based on recent 420 assessment attempts</p>
                </div>

                <div class="space-y-3 text-xs">
                    <div class="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
                        <div class="flex justify-between font-bold text-red-900">
                            <span>Non-response Calibration Raking</span>
                            <span>42% Accuracy</span>
                        </div>
                        <p class="text-[11px] text-red-700">Trainees struggle with auxiliary benchmark weighting adjustments.</p>
                    </div>

                    <div class="p-3 bg-orange-50 border border-orange-200 rounded-xl space-y-1">
                        <div class="flex justify-between font-bold text-orange-900">
                            <span>Statistical Disclosure Control (k-Anonymity)</span>
                            <span>54% Accuracy</span>
                        </div>
                        <p class="text-[11px] text-orange-700">Confusion regarding quasi-identifier masking rules under DPDP.</p>
                    </div>

                    <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                        <div class="flex justify-between font-bold text-amber-900">
                            <span>Jackknife Variance for Complex Surveys</span>
                            <span>61% Accuracy</span>
                        </div>
                        <p class="text-[11px] text-amber-700">Replication multiplier logic needs reinforcement module.</p>
                    </div>
                </div>

                <button onclick="alert('Diagnostic report generated for NSSTA Academic Board.')" class="btn btn-secondary text-xs py-2 px-3 w-full">
                    <i class="fa-solid fa-file-export"></i> Export Cohort Diagnostic Report
                </button>
            </div>
        </div>
    </div>
    `;
}

window.renderTrainerDashboard = renderTrainerDashboard;
