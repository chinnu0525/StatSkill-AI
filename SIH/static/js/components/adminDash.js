/**
 * Administrator Dashboard & Workforce Analytics Component
 * Enterprise capacity building intelligence: Competency Heatmap Matrix, Skill Gap Trends & 3-Year Future Skills Forecasting.
 */

function renderAdminDashboard(state) {
    const heatmap = MOCK_DATA.workforceHeatmap;
    const forecast = MOCK_DATA.futureSkillsForecast;

    return `
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <!-- Header -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-navy-900">
            <div>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-navy-900 bg-slate-100 px-3 py-1 rounded-full uppercase" style="color: #0B2545;">
                        <i class="fa-solid fa-chart-line"></i> Enterprise Workforce Intelligence
                    </span>
                    <span class="text-xs text-slate-500">Ministry of Statistics & Programme Implementation</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-black text-navy-900 mt-2" style="color: #0B2545;">
                    National Workforce Competency Analytics
                </h1>
                <p class="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
                    Real-time competency mapping, departmental skill gap heatmaps, and AI predictive workforce forecasting across India's Official Statistical Cadres.
                </p>
            </div>

            <div class="flex items-center gap-3">
                <button onclick="store.navigate('reports')" class="btn btn-secondary text-xs py-2 px-3.5">
                    <i class="fa-solid fa-file-pdf text-red-600"></i> Export Executive Brief
                </button>
                <button onclick="alert('Workforce parameters updated from MoSPI HRMIS Database.')" class="btn btn-primary text-xs py-2 px-3.5">
                    <i class="fa-solid fa-arrows-rotate"></i> Refresh HRMIS Data
                </button>
            </div>
        </div>

        <!-- 6 Enterprise Top KPIs -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div class="stat-card p-4 text-center stat-card-highlight">
                <span class="text-[11px] font-bold text-slate-500 uppercase">Total Cadre</span>
                <div class="text-2xl font-black text-navy-900 mt-1" style="color: #0B2545;">12,480</div>
                <span class="text-[10px] text-slate-400 font-medium">ISS & SSS Officers</span>
            </div>
            <div class="stat-card p-4 text-center stat-card-green">
                <span class="text-[11px] font-bold text-slate-500 uppercase">Active Learners</span>
                <div class="text-2xl font-black text-emerald-600 mt-1">8,920</div>
                <span class="text-[10px] text-emerald-700 font-bold">71.4% Coverage</span>
            </div>
            <div class="stat-card p-4 text-center stat-card-highlight">
                <span class="text-[11px] font-bold text-slate-500 uppercase">Avg. Maturity</span>
                <div class="text-2xl font-black text-blue-600 mt-1">71.8%</div>
                <span class="text-[10px] text-blue-700 font-bold">↑ 4.1% Year-on-Year</span>
            </div>
            <div class="stat-card p-4 text-center stat-card-saffron">
                <span class="text-[11px] font-bold text-slate-500 uppercase">Critical Gaps</span>
                <div class="text-2xl font-black text-red-600 mt-1">340</div>
                <span class="text-[10px] text-red-700 font-bold">Mainly in AI/ML & SDC</span>
            </div>
            <div class="stat-card p-4 text-center stat-card-highlight">
                <span class="text-[11px] font-bold text-slate-500 uppercase">iGOT Completion</span>
                <div class="text-2xl font-black text-purple-600 mt-1">88.2%</div>
                <span class="text-[10px] text-purple-700 font-bold">Mandated Modules</span>
            </div>
            <div class="stat-card p-4 text-center stat-card-green">
                <span class="text-[11px] font-bold text-slate-500 uppercase">Avg Learning</span>
                <div class="text-2xl font-black text-emerald-700 mt-1">46.2 hrs</div>
                <span class="text-[10px] text-slate-400 font-medium">Target: 50 hrs/yr</span>
            </div>
        </div>

        <!-- Workforce Competency Heatmap Matrix -->
        <div class="stat-card p-6 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">
                        Workforce Competency Heatmap Matrix
                    </h2>
                    <p class="text-xs text-slate-500">
                        Matrix mapping mandated target requirements vs actual assessed levels across key divisions.
                    </p>
                </div>

                <!-- Matrix Legend -->
                <div class="flex items-center gap-2 text-[11px] font-bold">
                    <span class="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">● Good (Gap &lt; 0.5)</span>
                    <span class="px-2.5 py-1 rounded bg-amber-100 text-amber-800">● Moderate (0.5 - 1.0)</span>
                    <span class="px-2.5 py-1 rounded bg-orange-100 text-orange-800">● High (1.0 - 1.5)</span>
                    <span class="px-2.5 py-1 rounded bg-red-100 text-red-800">● Critical (&gt; 1.5)</span>
                </div>
            </div>

            <!-- Heatmap Table -->
            <div class="overflow-x-auto">
                <table class="w-full text-xs text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-100 text-navy-900 font-bold border-b border-slate-200" style="color: #0B2545;">
                            <th class="p-3">Department / Division</th>
                            <th class="p-3 text-center">Officials</th>
                            <th class="p-3 text-center">Overall Maturity</th>
                            <th class="p-3 text-center">Survey / Methods</th>
                            <th class="p-3 text-center">Price / Accounts</th>
                            <th class="p-3 text-center">Python Programming</th>
                            <th class="p-3 text-center">AI / Machine Learning</th>
                            <th class="p-3 text-center">Data Viz / Dashboards</th>
                            <th class="p-3 text-center">Cyber / DPDP</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${heatmap.map(dept => `
                            <tr class="hover:bg-slate-50/80 transition-all font-medium text-slate-800">
                                <td class="p-3 font-bold text-navy-900">${dept.department}</td>
                                <td class="p-3 text-center">${dept.officialsCount}</td>
                                <td class="p-3 text-center font-bold text-navy-900">${dept.avgCompetency}%</td>
                                <td class="p-3"><div class="heatmap-cell heatmap-good">Req 4.5 / Curr 4.3<br><span class="text-[10px]">Gap 0.2</span></div></td>
                                <td class="p-3"><div class="heatmap-cell heatmap-good">Req 4.2 / Curr 3.9<br><span class="text-[10px]">Gap 0.3</span></div></td>
                                <td class="p-3"><div class="heatmap-cell heatmap-critical">Req 3.8 / Curr 2.2<br><span class="text-[10px]">Gap 1.6</span></div></td>
                                <td class="p-3"><div class="heatmap-cell heatmap-critical">Req 3.5 / Curr 1.8<br><span class="text-[10px]">Gap 1.7</span></div></td>
                                <td class="p-3"><div class="heatmap-cell heatmap-high">Req 4.0 / Curr 2.8<br><span class="text-[10px]">Gap 1.2</span></div></td>
                                <td class="p-3"><div class="heatmap-cell heatmap-moderate">Req 3.0 / Curr 2.4<br><span class="text-[10px]">Gap 0.6</span></div></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 3-Year Future Skills Forecasting Section -->
        <div class="stat-card p-6 sm:p-8 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase">
                            Predictive Workforce Intelligence
                        </span>
                    </div>
                    <h2 class="text-xl font-bold text-navy-900 mt-1" style="color: #0B2545;">
                        Future Skills Forecast (2026 – 2029)
                    </h2>
                    <p class="text-xs text-slate-500">
                        AI projection of emerging competencies based on technology trends, India Data Platform adoption, and National Statistical Commission priorities.
                    </p>
                </div>
            </div>

            <div class="space-y-4 text-xs">
                ${forecast.map(item => `
                    <div class="p-5 rounded-2xl border border-slate-200 bg-white hover:border-navy-900 transition-all space-y-3">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                            <div class="flex items-center gap-2">
                                <h3 class="text-sm font-bold text-navy-900" style="color: #0B2545;">${item.skill}</h3>
                                <span class="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                    Priority: ${item.priority}
                                </span>
                            </div>
                            <div class="flex items-center gap-4 text-xs">
                                <span>Current Demand: <strong class="text-slate-700">${item.currentDemandScore}</strong></span>
                                <span>1-Year Projection: <strong class="text-blue-700">${item.year1Forecast}</strong></span>
                                <span>3-Year Projection: <strong class="text-orange-600 font-bold">${item.year3Forecast}</strong></span>
                                <span class="text-emerald-700 font-bold">${item.trend}</span>
                            </div>
                        </div>

                        <!-- Progress Trend Bar -->
                        <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                            <div class="bg-blue-600 h-full" style="width: ${item.currentDemandScore * 0.6}%;"></div>
                            <div class="bg-orange-500 h-full" style="width: ${(item.year3Forecast - item.currentDemandScore) * 0.6}%;"></div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] pt-1">
                            <div>
                                <strong class="text-slate-700 block">Key Transformation Drivers:</strong>
                                <p class="text-slate-500">${item.keyDrivers}</p>
                            </div>
                            <div>
                                <strong class="text-navy-900 block">Recommended Capacity Building Policy:</strong>
                                <p class="text-navy-900 font-semibold">${item.recommendedAction}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
    `;
}

window.renderAdminDashboard = renderAdminDashboard;
