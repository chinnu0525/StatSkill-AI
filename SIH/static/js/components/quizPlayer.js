/**
 * Quiz Player Component
 * Timed examination interface with question navigation palette, instant scoring, +6% competency boost, and personalized feedback.
 */

let activeQuestionIndex = 0;

function renderQuizPlayer(state) {
    const questions = state.quizQuestions;
    const result = state.lastQuizResult;

    // If quiz is completed, show the result screen
    if (!state.activeQuiz && result) {
        return renderQuizResultScreen(result, state);
    }

    if (!questions || questions.length === 0) {
        return `
        <div class="max-w-xl mx-auto py-16 text-center space-y-4">
            <h2 class="text-xl font-bold text-navy-900">No Active Assessment</h2>
            <p class="text-xs text-slate-600">Please choose or generate an assessment first.</p>
            <button onclick="store.navigate('ai-generator')" class="btn btn-saffron text-xs py-2 px-4">
                Go to Assessment Generator
            </button>
        </div>
        `;
    }

    const currentQ = questions[activeQuestionIndex];
    const selectedAnswer = state.quizAnswers[activeQuestionIndex];
    const isMarked = state.quizMarkedForReview[activeQuestionIndex];

    return `
    <div class="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        <!-- Top Exam Header Bar -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <span class="text-[10px] font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full uppercase">
                    Official Certification Exam
                </span>
                <h1 class="text-xl font-black text-navy-900 mt-1" style="color: #0B2545;">
                    ${state.activeQuiz ? state.activeQuiz.title : 'Official Statistics Competency Assessment'}
                </h1>
            </div>

            <!-- Timer and Finish Button -->
            <div class="flex items-center gap-4">
                <div class="p-2.5 bg-slate-900 text-white rounded-xl flex items-center gap-2 text-xs font-mono font-bold shadow-md">
                    <i class="fa-solid fa-clock text-orange-400"></i>
                    <span id="quizTimerDisplay">18:45</span>
                </div>
                <button onclick="confirmSubmitQuiz()" class="btn btn-saffron text-xs py-2.5 px-4 shadow-md shadow-orange-600/30">
                    <i class="fa-solid fa-flag-checkered"></i> Submit Assessment
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Main Question Area (8 Cols) -->
            <div class="lg:col-span-8 space-y-6">
                <div class="stat-card p-6 sm:p-8 space-y-6 bg-white rounded-2xl border border-slate-200 shadow-md">
                    <!-- Question Header Info -->
                    <div class="flex justify-between items-center border-b border-slate-100 pb-3 text-xs">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-navy-900">Question ${activeQuestionIndex + 1} of ${questions.length}</span>
                            <span class="text-slate-300">|</span>
                            <span class="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">${currentQ.competency}</span>
                        </div>
                        <button onclick="toggleMarkReview(${activeQuestionIndex})" class="flex items-center gap-1.5 font-bold ${isMarked ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'}">
                            <i class="fa-solid fa-bookmark"></i>
                            ${isMarked ? 'Marked for Review' : 'Mark for Review'}
                        </button>
                    </div>

                    <!-- Question Text -->
                    <div class="text-sm sm:text-base font-bold text-navy-900 leading-relaxed" style="color: #0B2545;">
                        ${currentQ.question}
                    </div>

                    <!-- Options Radio Group -->
                    <div class="space-y-3 pt-2 text-xs sm:text-sm">
                        ${currentQ.options.map((optionText, optIdx) => `
                            <label onclick="selectQuizAnswer(${activeQuestionIndex}, ${optIdx})" class="p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${selectedAnswer === optIdx ? 'border-orange-500 bg-orange-50/70 font-semibold text-navy-900 shadow-sm' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'}">
                                <div class="w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs ${selectedAnswer === optIdx ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-300 bg-white text-slate-600'}">
                                    ${String.fromCharCode(65 + optIdx)}
                                </div>
                                <span class="leading-snug">${optionText}</span>
                            </label>
                        `).join('')}
                    </div>

                    <!-- Bottom Nav Buttons -->
                    <div class="flex justify-between items-center pt-4 border-t border-slate-100 text-xs">
                        <button onclick="navigateQuizQ(${activeQuestionIndex - 1})" class="btn btn-secondary text-xs py-2 px-4 ${activeQuestionIndex === 0 ? 'invisible' : ''}">
                            <i class="fa-solid fa-chevron-left"></i> Previous
                        </button>

                        <div class="text-slate-400 text-[11px]">
                            Auto-saved to MoSPI Session
                        </div>

                        ${activeQuestionIndex < questions.length - 1 ? `
                            <button onclick="navigateQuizQ(${activeQuestionIndex + 1})" class="btn btn-primary text-xs py-2 px-5">
                                Next <i class="fa-solid fa-chevron-right"></i>
                            </button>
                        ` : `
                            <button onclick="confirmSubmitQuiz()" class="btn btn-saffron text-xs py-2 px-5 font-bold">
                                Finish & Submit <i class="fa-solid fa-check"></i>
                            </button>
                        `}
                    </div>
                </div>
            </div>

            <!-- Question Navigation Grid Palette (4 Cols) -->
            <div class="lg:col-span-4 space-y-6">
                <div class="stat-card p-6 space-y-4">
                    <h3 class="text-base font-bold text-navy-900" style="color: #0B2545;">Question Palette</h3>

                    <div class="grid grid-cols-5 gap-2 text-xs">
                        ${questions.map((q, idx) => {
                            const isAns = state.quizAnswers[idx] !== undefined;
                            const isCur = idx === activeQuestionIndex;
                            const isRev = state.quizMarkedForReview[idx];

                            let btnStyle = "bg-slate-100 text-slate-700 border-slate-200";
                            if (isCur) btnStyle = "ring-2 ring-orange-500 bg-navy-900 text-white font-bold";
                            else if (isRev) btnStyle = "bg-orange-100 text-orange-800 border-orange-300 font-bold";
                            else if (isAns) btnStyle = "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";

                            return `
                            <button onclick="navigateQuizQ(${idx})" class="w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs transition-all ${btnStyle}">
                                ${idx + 1}
                            </button>
                            `;
                        }).join('')}
                    </div>

                    <!-- Legend -->
                    <div class="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                        <div class="flex items-center gap-1.5">
                            <span class="w-3 h-3 rounded-full bg-emerald-500"></span> Answered
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="w-3 h-3 rounded-full bg-orange-500"></span> Marked Review
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="w-3 h-3 rounded-full bg-navy-900"></span> Current
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="w-3 h-3 rounded-full bg-slate-200"></span> Unvisited
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function renderQuizResultScreen(result, state) {
    return `
    <div class="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <div class="stat-card p-6 sm:p-10 space-y-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center">
            <!-- Score Badge -->
            <div class="space-y-3">
                <div class="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-black mx-auto shadow-inner border-2 border-emerald-300">
                    <i class="fa-solid fa-award"></i>
                </div>
                <h1 class="text-3xl font-black text-navy-900" style="color: #0B2545;">Assessment Completed!</h1>
                <p class="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Your assessment has been evaluated against National Statistical System scoring standards.
                </p>
            </div>

            <!-- 4 Metrics Row -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div class="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                    <span class="text-[11px] font-bold text-blue-700 uppercase">Score Obtained</span>
                    <div class="text-3xl font-black text-blue-900 mt-1">${result.scorePercent}%</div>
                </div>
                <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span class="text-[11px] font-bold text-emerald-700 uppercase">Correct Answers</span>
                    <div class="text-3xl font-black text-emerald-800 mt-1">${result.correctCount} / ${result.totalCount}</div>
                </div>
                <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                    <span class="text-[11px] font-bold text-purple-700 uppercase">Time Spent</span>
                    <div class="text-3xl font-black text-purple-900 mt-1">${result.timeSpentMin} min</div>
                </div>
                <div class="p-4 rounded-2xl bg-orange-50 border border-orange-300">
                    <span class="text-[11px] font-bold text-orange-700 uppercase">Competency Gain</span>
                    <div class="text-3xl font-black text-orange-600 mt-1">${result.competencyImprovement}</div>
                </div>
            </div>

            <!-- Personalized AI Feedback Breakdown -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left text-xs">
                <!-- Strong Areas -->
                <div class="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <div class="font-bold text-emerald-900 flex items-center gap-1.5 text-sm">
                        <i class="fa-solid fa-circle-check text-emerald-600"></i> Strong Areas
                    </div>
                    <ul class="space-y-1 text-emerald-800">
                        ${result.strongAreas.map(a => `<li>✓ ${a}</li>`).join('')}
                    </ul>
                </div>

                <!-- Areas to Improve -->
                <div class="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <div class="font-bold text-amber-900 flex items-center gap-1.5 text-sm">
                        <i class="fa-solid fa-triangle-exclamation text-amber-600"></i> Areas to Improve
                    </div>
                    <ul class="space-y-1 text-amber-800">
                        ${result.areasToImprove.map(a => `<li>⚠ ${a}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <!-- Recommendations Loop Back Button -->
            <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onclick="store.navigate('learner-dash')" class="btn btn-primary text-xs py-3 px-6 shadow-md">
                    <i class="fa-solid fa-chart-pie mr-1"></i> Return to Learner Dashboard
                </button>
                <button onclick="store.navigate('recommendations')" class="btn btn-saffron text-xs py-3 px-6 shadow-md shadow-orange-600/30">
                    <i class="fa-solid fa-graduation-cap mr-1"></i> Start Recommended Learning
                </button>
            </div>
        </div>
    </div>
    `;
}

function navigateQuizQ(newIndex) {
    if (newIndex >= 0 && newIndex < window.store.state.quizQuestions.length) {
        activeQuestionIndex = newIndex;
        window.store.notify();
    }
}

function selectQuizAnswer(qIndex, optIndex) {
    window.store.state.quizAnswers[qIndex] = optIndex;
    window.store.notify();
}

function toggleMarkReview(qIndex) {
    window.store.state.quizMarkedForReview[qIndex] = !window.store.state.quizMarkedForReview[qIndex];
    window.store.notify();
}

function confirmSubmitQuiz() {
    if (confirm("Are you sure you want to submit your assessment? Your competency scores will be updated immediately.")) {
        window.store.submitQuiz();
    }
}

window.renderQuizPlayer = renderQuizPlayer;
window.navigateQuizQ = navigateQuizQ;
window.selectQuizAnswer = selectQuizAnswer;
window.toggleMarkReview = toggleMarkReview;
window.confirmSubmitQuiz = confirmSubmitQuiz;
