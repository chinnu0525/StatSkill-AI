/**
 * Navbar & Header Component (DIKSHA & Notion-Inspired Structure)
 * 3-Column Header Layout:
 * LEFT: Official Emblem of India + GOVERNMENT OF INDIA + Ministry of Statistics and Programme Implementation
 * CENTER: StatSkill AI + National Workforce Intelligence (Mathematically Centered via 3-Column Grid)
 * RIGHT: MoSPI + Ministry of Statistics and Programme Implementation
 */

function renderNavbar(state) {
    const activeView = state.activeView;
    const lang = state.currentLanguage || 'en';

    // Navigation Labels Dictionary
    const navLabels = {
        en: { home: "Home", about: "About", dashboard: "Dashboard", quizzes: "Ministry Quizzes", userGuide: "User Guide", loginBtn: "Login / Register" },
        hi: { home: "होम", about: "हमारे बारे में", dashboard: "डैशबोर्ड", quizzes: "मंत्रालय प्रश्नोत्तरी", userGuide: "उपयोगकर्ता निर्देशिका", loginBtn: "लॉगिन / पंजीकरण" },
        te: { home: "హోమ్", about: "గురించి", dashboard: "డ్యాష్‌బోర్డ్", quizzes: "మంత్రిత్వ క్విజ్‌లు", userGuide: "యూజర్ గైడ్", loginBtn: "లాగిన్ / రిజిస్టర్" }
    };
    const labels = navLabels[lang] || navLabels.en;

    const navItems = [
        { id: "landing", label: labels.home, icon: "fa-house", action: () => store.navigate('landing') },
        { id: "about", label: labels.about, icon: "fa-circle-info", action: () => { store.navigate('landing'); setTimeout(() => { if (typeof scrollToSection === 'function') scrollToSection('whyChooseSection'); }, 100); } },
        { id: "learner-dash", label: labels.dashboard, icon: "fa-chart-pie", action: () => store.navigate('learner-dash') },
        { id: "ai-generator", label: labels.quizzes, icon: "fa-bolt", action: () => store.navigate('ai-generator') },
        { id: "user-guide", label: labels.userGuide, icon: "fa-book-open", action: () => { store.navigate('landing'); setTimeout(() => { if (typeof scrollToSection === 'function') scrollToSection('raiseQuerySection'); }, 100); } }
    ];

    return `
    <!-- Top Government Portal Header (Mathematical 3-Column Grid Layout) -->
    <div class="border-b border-slate-200 bg-white py-3.5 px-4 sm:px-8 no-print shadow-xs">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left">
            
            <!-- COLUMN 1 (LEFTMOST): Official Emblem + GOVERNMENT OF INDIA -->
            <div class="flex items-center justify-center md:justify-start gap-3.5 text-left">
                <img src="/emblem.svg" alt="Emblem of India" class="h-14 sm:h-16 w-auto object-contain flex-shrink-0 filter drop-shadow-xs" title="State Emblem of India (Satyameva Jayate)">
                <div class="leading-tight">
                    <span class="text-base sm:text-xl font-black uppercase tracking-wider text-slate-950 block">GOVERNMENT OF INDIA</span>
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-widest block mt-0.5">भारत सरकार</span>
                </div>
            </div>

            <!-- COLUMN 2 (EXACT MATHEMATICAL CENTER): StatSkill AI Branding -->
            <div class="flex items-center justify-center gap-3 cursor-pointer" onclick="store.navigate('landing')">
                <div class="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-white shadow-md border-t-2 border-blue-500 flex-shrink-0" style="background: #0B2545;">
                    <i class="fa-solid fa-chart-network text-xl text-blue-400"></i>
                </div>
                <div class="text-center md:text-left leading-tight">
                    <div class="flex items-center justify-center md:justify-start gap-2">
                        <span class="text-2xl font-black tracking-tight text-slate-950" style="color: #0B2545;">StatSkill <span class="text-blue-600">AI</span></span>
                    </div>
                    <p class="text-[11px] font-bold text-slate-500 tracking-wide uppercase mt-0.5">National Workforce Intelligence</p>
                </div>
            </div>

            <!-- COLUMN 3 (RIGHTMOST): MoSPI + Full Form -->
            <div class="flex items-center justify-center md:justify-end gap-3 text-right">
                <div class="leading-tight text-center md:text-right">
                    <span class="text-xl sm:text-2xl font-black tracking-tight text-slate-950 block" style="color: #0B2545;">MoSPI</span>
                    <span class="text-[10px] sm:text-[11px] font-semibold text-slate-500 block max-w-xs mt-0.5">
                        Ministry of Statistics and Programme Implementation
                    </span>
                </div>
                <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center font-black text-sm shadow-xs flex-shrink-0" title="MoSPI">
                    <i class="fa-solid fa-chart-simple text-xl text-blue-700"></i>
                </div>
            </div>

        </div>
    </div>

    <!-- Main Navigation Bar (Clean DIKSHA Structure) -->
    <header class="main-header border-b border-slate-200 bg-slate-50/90 px-4 sm:px-8 py-2.5 shadow-xs sticky top-0 z-40 backdrop-blur-md">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            <!-- Left: Navigation Links (Home, About, Dashboard, User Guide) -->
            <nav class="hidden md:flex items-center gap-1.5">
                ${navItems.map(item => `
                    <button onclick="(${item.action.toString()})()" class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${activeView === item.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70'}">
                        <i class="fa-solid ${item.icon} text-xs ${activeView === item.id ? 'text-white' : 'text-slate-500'}"></i>
                        <span>${item.label}</span>
                    </button>
                `).join('')}
            </nav>

            <!-- Right Side: Accessibility Quick Button, Functional Language Selector & Login Button -->
            <div class="flex items-center gap-2.5">
                <!-- Top Navbar Accessibility Control Button -->
                <button onclick="window.toggleAccessibilityPanel(event)" class="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400" title="Accessibility Options (CTRL+U or ALT+A)">
                    <i class="fa-solid fa-universal-access text-sm"></i>
                    <span class="hidden sm:inline">Accessibility</span>
                </button>

                <!-- Functional Language Selector -->
                <div class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-xs">
                    <i class="fa-solid fa-globe text-slate-500 text-xs"></i>
                    <select onchange="store.setLanguage(this.value)" class="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs">
                        <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
                        <option value="hi" ${lang === 'hi' ? 'selected' : ''}>हिन्दी (Hindi)</option>
                        <option value="te" ${lang === 'te' ? 'selected' : ''}>తెలుగు (Telugu)</option>
                    </select>
                </div>

                <!-- User Profile / Login Button -->
                ${state.user ? `
                    <div class="flex items-center gap-2">
                        <button onclick="store.navigate('profile')" class="flex items-center gap-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-900 transition-all cursor-pointer shadow-xs" title="View Profile">
                            <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                                ${(state.user.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <span class="max-w-[120px] truncate hidden sm:inline">${state.user.name}</span>
                        </button>
                        <button onclick="store.logout()" class="text-slate-400 hover:text-red-600 p-2 text-xs font-bold transition-all cursor-pointer" title="Sign Out">
                            <i class="fa-solid fa-right-from-bracket"></i>
                        </button>
                    </div>
                ` : `
                    <button onclick="store.openAuthModal('register')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2">
                        <i class="fa-solid fa-arrow-right-to-bracket text-xs"></i>
                        <span>${labels.loginBtn}</span>
                    </button>
                `}
            </div>

        </div>

        <!-- Mobile Navigation Bar -->
        <div class="md:hidden mt-2 pt-2 border-t border-slate-200 flex items-center justify-around text-xs">
            ${navItems.map(item => `
                <button onclick="(${item.action.toString()})()" class="px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${activeView === item.id ? 'bg-blue-600 text-white' : 'text-slate-700'}">
                    <i class="fa-solid ${item.icon} text-xs"></i>
                    <span>${item.label}</span>
                </button>
            `).join('')}
        </div>
    </header>
    `;
}

window.renderNavbar = renderNavbar;
