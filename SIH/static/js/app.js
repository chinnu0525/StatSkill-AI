/**
 * StatSkill AI - Main Application Coordinator & View Router
 * Handles dynamic re-rendering, HTML5 neural network canvas animation, and global events.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    renderApp();

    // Subscribe to store updates
    window.store.subscribe((state) => {
        renderApp();
    });

    // Start background canvas animation if on landing
    initNeuralCanvasAnimation();
});

function renderApp() {
    const state = window.store.state;
    const appRoot = document.getElementById('app');
    if (!appRoot) return;

    let viewContent = "";

    try {
        switch (state.activeView) {
            case "landing":
                viewContent = window.renderLandingPage ? window.renderLandingPage(state) : '';
                break;
            case "learner-dash":
                viewContent = window.renderLearnerDashboard ? window.renderLearnerDashboard(state) : '';
                break;
            case "framework":
                viewContent = window.renderCompetencyFramework ? window.renderCompetencyFramework(state) : '';
                break;
            case "assessment":
                viewContent = window.renderCompetencyAssessment ? window.renderCompetencyAssessment(state) : '';
                break;
            case "learning-path":
                viewContent = window.renderLearningPath ? window.renderLearningPath(state) : '';
                break;
            case "recommendations":
                viewContent = window.renderRecommendations ? window.renderRecommendations(state) : '';
                break;
            case "igot-hub":
                viewContent = window.renderIgotHub ? window.renderIgotHub(state) : '';
                break;
            case "ai-generator":
                viewContent = window.renderAiGenerator ? window.renderAiGenerator(state) : '';
                break;
            case "quiz-player":
                viewContent = window.renderQuizPlayer ? window.renderQuizPlayer(state) : '';
                break;
            case "trainer-dash":
                viewContent = window.renderTrainerDashboard ? window.renderTrainerDashboard(state) : '';
                break;
            case "admin-dash":
                viewContent = window.renderAdminDashboard ? window.renderAdminDashboard(state) : '';
                break;
            case "reports":
                viewContent = window.renderReportsCenter ? window.renderReportsCenter(state) : '';
                break;
            case "profile":
                viewContent = window.renderUserProfile ? window.renderUserProfile(state) : '';
                break;
            default:
                viewContent = window.renderLandingPage ? window.renderLandingPage(state) : '';
        }
    } catch (err) {
        console.error("View rendering error:", err);
        viewContent = `<div class="p-8 max-w-xl mx-auto text-center space-y-3">
            <div class="text-lg font-bold text-red-600">Rendering Error</div>
            <p class="text-xs text-slate-600">${err.message}</p>
            <button onclick="store.navigate('landing')" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Return Home</button>
        </div>`;
    }

    appRoot.innerHTML = `
        ${window.renderNavbar(state)}
        <main class="flex-1">
            ${viewContent}
        </main>
        ${window.renderAiAssistant(state)}
        ${window.renderAuthModal ? window.renderAuthModal(state) : ''}
        ${renderFooter(state)}
    `;

    // Initialize Radar chart if on Learner Dashboard
    if (state.activeView === "learner-dash" && window.initCompetencyRadarChart) {
        setTimeout(window.initCompetencyRadarChart, 100);
    }

    // Re-init canvas animation if on Landing
    if (state.activeView === "landing") {
        setTimeout(initNeuralCanvasAnimation, 100);
    }
}

function renderFooter(state) {
    return `
    <footer class="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 py-10 px-4 sm:px-8 mt-auto no-print">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div class="space-y-3">
                <div class="flex items-center gap-2 font-black text-white text-base">
                    <span class="text-white">StatSkill</span>
                    <span class="text-orange-500">AI</span>
                </div>
                <p class="text-slate-400 text-[11px] leading-relaxed">
                    AI-Powered Competency & Learning Intelligence Platform for India's Official Statistical System.
                </p>
                <div class="text-[10px] text-slate-500">
                    Developed under the aegis of MoSPI & National Statistical Systems Training Academy (NSSTA).
                </div>
            </div>

            <div>
                <h4 class="font-bold text-white mb-2 uppercase text-[11px] tracking-wider">Platform Links</h4>
                <ul class="space-y-1 text-slate-400 text-[11px]">
                    <li><a href="javascript:store.navigate('framework')" class="hover:text-orange-400">Competency Framework</a></li>
                    <li><a href="javascript:store.navigate('recommendations')" class="hover:text-orange-400">AI Learning Advisor</a></li>
                    <li><a href="javascript:store.navigate('igot-hub')" class="hover:text-orange-400">iGOT Karmayogi Hub</a></li>
                    <li><a href="javascript:store.navigate('ai-generator')" class="hover:text-orange-400">AI MCQ Generator</a></li>
                </ul>
            </div>

            <div>
                <h4 class="font-bold text-white mb-2 uppercase text-[11px] tracking-wider">Institutions</h4>
                <ul class="space-y-1 text-slate-400 text-[11px]">
                    <li><a href="https://mospi.gov.in" target="_blank" class="hover:text-orange-400">Ministry of Statistics (MoSPI)</a></li>
                    <li><a href="javascript:void(0)" class="hover:text-orange-400">NSSTA Greater Noida</a></li>
                    <li><a href="javascript:void(0)" class="hover:text-orange-400">National Statistical Commission</a></li>
                    <li><a href="https://karmayogi.gov.in" target="_blank" class="hover:text-orange-400">iGOT Karmayogi Portal</a></li>
                </ul>
            </div>

            <div>
                <h4 class="font-bold text-white mb-2 uppercase text-[11px] tracking-wider">Compliance & Security</h4>
                <ul class="space-y-1 text-slate-400 text-[11px]">
                    <li><a href="javascript:void(0)" class="hover:text-orange-400">DPDP Act 2023 Compliance</a></li>
                    <li><a href="javascript:void(0)" class="hover:text-orange-400">CERT-In Security Framework</a></li>
                    <li><a href="javascript:void(0)" class="hover:text-orange-400">Microdata Dissemination Policy</a></li>
                    <li><a href="javascript:void(0)" onclick="window.toggleAccessibilityPanel()" class="hover:text-orange-400">WCAG 2.1 AA Accessibility</a></li>
                </ul>
            </div>
        </div>

        <div class="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div>
                © 2026 Ministry of Statistics and Programme Implementation (MoSPI), Government of India. All rights reserved.
            </div>
            <div class="flex items-center gap-4">
                <span>Demo Sandbox Environment (Simulated APIs)</span>
                <span>•</span>
                <span>Version 3.2.0-PROD</span>
            </div>
        </div>
    </footer>
    `;
}

// HTML5 Neural Network Background Canvas
function initNeuralCanvasAnimation() {
    const canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth || window.innerWidth;
    let height = canvas.height = canvas.offsetHeight || 500;

    const nodes = [];
    const nodeCount = Math.floor(width / 35);

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 2.5 + 1.5,
            color: Math.random() > 0.4 ? '#38bdf8' : (Math.random() > 0.5 ? '#f97316' : '#34d399')
        });
    }

    function animate() {
        if (!document.getElementById('neuralCanvas')) return;
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            n.x += n.vx;
            n.y += n.vy;

            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;

            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
            ctx.fillStyle = n.color;
            ctx.fill();

            // Connect nearby nodes
            for (let j = i + 1; j < nodes.length; j++) {
                const n2 = nodes[j];
                const dx = n.x - n2.x;
                const dy = n.y - n2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(n2.x, n2.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.18 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

window.renderApp = renderApp;
