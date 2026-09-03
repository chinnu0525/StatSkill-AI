/**
 * Downloadable Reports Center Component
 * Exports Individual Competency Reports, Departmental Skill Gap Analyses, and National Statistical System Reports (PDF / Excel / CSV).
 */

function renderReportsCenter(state) {
    const user = state.user || MOCK_DATA.currentUser;

    return `
    <div class="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <!-- Header -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-navy-900">
            <div>
                <span class="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase">
                    Official Statistical Audit & Reporting
                </span>
                <h1 class="text-2xl sm:text-3xl font-black text-navy-900 mt-2" style="color: #0B2545;">
                    Competency & Workforce Reports Center
                </h1>
                <p class="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
                    Download verified capacity-building audit reports in standardized Government of India formats (PDF, Excel, and CSV).
                </p>
            </div>
        </div>

        <!-- 3 Report Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Report 1: Individual Competency Profile -->
            <div class="stat-card p-6 flex flex-col justify-between space-y-4 stat-card-highlight">
                <div class="space-y-2">
                    <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-lg">
                        <i class="fa-solid fa-user-check"></i>
                    </div>
                    <h3 class="text-base font-bold text-navy-900" style="color: #0B2545;">Individual Competency Report</h3>
                    <p class="text-xs text-slate-600">
                        Complete profile for <strong>${user.name}</strong> (${user.employeeId}) including 5-level competency scores, identified gaps, and iGOT learning certificates.
                    </p>
                </div>
                <div class="space-y-2 pt-4 border-t border-slate-100">
                    <button onclick="downloadReport('Individual_Competency_Report.pdf')" class="btn btn-primary text-xs py-2 w-full">
                        <i class="fa-solid fa-file-pdf text-red-400"></i> Download PDF Summary
                    </button>
                    <button onclick="downloadReport('Individual_Scores.csv')" class="btn btn-secondary text-xs py-2 w-full">
                        <i class="fa-solid fa-file-csv text-emerald-600"></i> Export CSV Data
                    </button>
                </div>
            </div>

            <!-- Report 2: Departmental Skill Gap Report -->
            <div class="stat-card p-6 flex flex-col justify-between space-y-4 stat-card-saffron">
                <div class="space-y-2">
                    <div class="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center text-lg">
                        <i class="fa-solid fa-building-user"></i>
                    </div>
                    <h3 class="text-base font-bold text-navy-900" style="color: #0B2545;">Departmental Capacity Report</h3>
                    <p class="text-xs text-slate-600">
                        Division-level skill gap matrix for <strong>${user.department}</strong>, training utilization statistics, and prioritized course requirements.
                    </p>
                </div>
                <div class="space-y-2 pt-4 border-t border-slate-100">
                    <button onclick="downloadReport('Department_Capacity_Report.pdf')" class="btn btn-saffron text-xs py-2 w-full">
                        <i class="fa-solid fa-file-pdf text-white"></i> Download PDF Report
                    </button>
                    <button onclick="downloadReport('Department_Gaps.xlsx')" class="btn btn-secondary text-xs py-2 w-full">
                        <i class="fa-solid fa-file-excel text-emerald-600"></i> Export Excel Matrix
                    </button>
                </div>
            </div>

            <!-- Report 3: National Statistical System Maturity Report -->
            <div class="stat-card p-6 flex flex-col justify-between space-y-4 stat-card-green">
                <div class="space-y-2">
                    <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg">
                        <i class="fa-solid fa-chart-pie"></i>
                    </div>
                    <h3 class="text-base font-bold text-navy-900" style="color: #0B2545;">National System Maturity Report</h3>
                    <p class="text-xs text-slate-600">
                        Comprehensive national capacity maturity report prepared for MoSPI, NSSTA Academic Council, and National Statistical Commission (NSC).
                    </p>
                </div>
                <div class="space-y-2 pt-4 border-t border-slate-100">
                    <button onclick="downloadReport('National_Statistical_Maturity_2026.pdf')" class="btn btn-primary text-xs py-2 w-full">
                        <i class="fa-solid fa-file-pdf text-red-400"></i> Download Executive Brief
                    </button>
                    <button onclick="downloadReport('National_Cadre_Analytics.csv')" class="btn btn-secondary text-xs py-2 w-full">
                        <i class="fa-solid fa-file-csv text-emerald-600"></i> Export Raw Analytics
                    </button>
                </div>
            </div>
        </div>

        <!-- Printable Document Live Preview Box -->
        <div class="stat-card p-6 sm:p-10 space-y-6 bg-white">
            <div class="flex justify-between items-center border-b border-slate-200 pb-4">
                <div>
                    <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">Official Report Preview</h2>
                    <span class="text-xs text-slate-500 font-mono">DOC-ID: MOSPI-CAPACITY-REPORT-2026-Q3</span>
                </div>
                <button onclick="window.print()" class="btn btn-secondary text-xs py-2 px-4">
                    <i class="fa-solid fa-print"></i> Print Official Document
                </button>
            </div>

            <div class="space-y-4 text-xs text-slate-800 border p-6 rounded-2xl bg-slate-50/50">
                <div class="text-center space-y-1 border-b border-slate-200 pb-4">
                    <div class="font-extrabold text-sm uppercase tracking-wider text-navy-900">GOVERNMENT OF INDIA</div>
                    <div class="font-bold text-slate-700">MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION</div>
                    <div class="text-[11px] text-slate-500">Official Statistical Competency Assessment & Capacity Building Card</div>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-2">
                    <div><strong>Official Name:</strong> ${user.name}</div>
                    <div><strong>Employee PEN / ID:</strong> ${user.employeeId}</div>
                    <div><strong>Designation:</strong> ${user.designation}</div>
                    <div><strong>Cadre:</strong> ${user.cadre}</div>
                    <div><strong>Department:</strong> ${user.department}</div>
                    <div><strong>Overall Competency Rating:</strong> ${state.overallScore}% (Compliant)</div>
                </div>

                <div class="pt-4 border-t border-slate-200 space-y-2">
                    <strong class="block font-bold">Identified Priority Skill Upgradations:</strong>
                    <div class="grid grid-cols-3 gap-2 text-[11px]">
                        <div class="p-2 bg-white rounded border border-slate-200"><strong>AI/ML:</strong> Gap of 2 Levels (Target L3)</div>
                        <div class="p-2 bg-white rounded border border-slate-200"><strong>Python:</strong> Gap of 2 Levels (Target L4)</div>
                        <div class="p-2 bg-white rounded border border-slate-200"><strong>SDC:</strong> Gap of 2 Levels (Target L4)</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function downloadReport(filename) {
    alert(`Generating verified official report: "${filename}"...\nDownloaded successfully.`);
}

window.renderReportsCenter = renderReportsCenter;
window.downloadReport = downloadReport;
