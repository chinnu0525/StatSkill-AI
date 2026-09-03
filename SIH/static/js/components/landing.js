/**
 * StatSkill AI - Official Landing Page Component
 * Built for Ministry of Statistics and Programme Implementation (MoSPI) & National Statistical System.
 * 
 * Rebuilt strictly adhering to the 9-Section Top-to-Bottom Structure:
 * 1. Identity Bar (Government of India / StatSkill AI / MoSPI)
 * 2. Main Navigation & Quick Action Bar (with Login/Register)
 * 3. Hero Section (Intent search bar, Notion-style rotating quote, Why Choose StatSkill AI, Watch Demo)
 * 4. Animated Stats Section (KPI counters & Chart.js animated bar/doughnut charts with credible numbers)
 * 5. Competency Domain Breakdown (4 core statistical & governance domains)
 * 6. Reviews Carousel (Illustrative cadre testimonials with dual-side arrows & auto-play)
 * 7. Footer (DIKSHA-inspired "Raise a Query" box, QR code & Play Store badge, sitemap & policies)
 * 8. Floating Accessibility Panel (Bottom-Left, multi-contrast, font sizing, dyslexia font, text spacing, link highlight, big cursor)
 * 9. Multilingual Support (English, Hindi, Telugu label switching)
 * 
 * NOTE ON ACCESSIBILITY ARCHITECTURE:
 * The accessibility panel below applies immediately and is scoped to the landing page DOM to preserve
 * single-file encapsulation for landing.js. Consolidating this panel with navbar.js's existing site-wide
 * font/contrast toggles into one unified, persistent global accessibility engine is a natural follow-up task.
 */

(function (window) {
    // -------------------------------------------------------------
    // MULTILINGUAL DICTIONARY (English, Hindi, Telugu)
    // -------------------------------------------------------------
    const I18N = {
        en: {
            govIndia: "Government of India",
            ministry: "Ministry of Statistics & Programme Implementation (MoSPI)",
            portalSubtitle: "National Statistical Systems Training Academy (NSSTA)",
            heroQuoteMain: "Where data and skills Think together.",
            heroSubtitle: "AI-mapped competency intelligence and capacity building for India's official statistical workforce.",
            searchPlaceholder: "What would you like to explore?",
            btnAssess: "Assess My Competencies",
            btnExplore: "Explore Learning Paths",
            btnDemo: "Watch Platform Walkthrough",
            btnRegister: "Register as Government Officer",
            btnLogin: "Official Login",
            whyChooseTitle: "Why India's Statistical Cadre Chooses StatSkill AI",
            domainSectionTitle: "The Four Pillars of Statistical Competency",
            domainSectionSub: "Standardized against the MoSPI Competency Framework 2026 & National Training Policy.",
            statsTitle: "Measurable Impact Across India's Statistical Cadre",
            statsSub: "Real-time workforce intelligence benchmarked with iGOT Karmayogi data standards.",
            reviewsTitle: "From Competency to Capability",
            reviewsSub: "Illustrative testimonials from Central & State statistical personnel.",
            queryTitle: "Raise a Query / Need Assistance?",
            querySub: "Submit your capacity-building questions directly to the MoSPI NSSTA Helpdesk.",
            btnSubmitQuery: "Submit Query to Helpdesk",
            accessibilityTitle: "Accessibility Preferences",
            resetA11y: "Reset All to Default"
        },
        hi: {
            govIndia: "भारत सरकार",
            ministry: "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)",
            portalSubtitle: "राष्ट्रीय सांख्यिकी प्रणाली प्रशिक्षण अकादमी (NSSTA)",
            heroQuoteMain: "Where data and skills Think together.",
            heroSubtitle: "भारत के आधिकारिक सांख्यिकी कार्यबल के लिए एआई-आधारित सक्षमता और क्षमता निर्माण।",
            searchPlaceholder: "आप क्या खोजना चाहते हैं?",
            btnAssess: "दक्षता का आकलन करें",
            btnExplore: "सीखने के मार्ग देखें",
            btnDemo: "डेमो वीडियो देखें",
            btnRegister: "अधिकारी के रूप में पंजीकरण करें",
            btnLogin: "आधिकारिक लॉगिन",
            whyChooseTitle: "सांख्यिकी संवर्ग StatSkill AI क्यों चुनता है",
            domainSectionTitle: "सांख्यिकीय क्षमता के चार मुख्य स्तंभ",
            domainSectionSub: "MoSPI सक्षमता ढांचा 2026 और राष्ट्रीय प्रशिक्षण नीति के अनुरूप।",
            statsTitle: "राष्ट्रीय सांख्यिकी संवर्ग में प्रत्यक्ष प्रभाव",
            statsSub: "iGOT कर्मयोगी मानकों के साथ वास्तविक समय कार्यबल विश्लेषण।",
            reviewsTitle: "राष्ट्रीय सांख्यिकी प्रणाली से अनुभव",
            reviewsSub: "केंद्रीय और राज्य सांख्यिकी संवर्ग के काल्पनिक/उदाहरणात्मक अनुभव।",
            queryTitle: "कोई प्रश्न है? / सहायता चाहिए?",
            querySub: "अपने प्रश्न सीधे MoSPI NSSTA हेल्पडेस्क को भेजें।",
            btnSubmitQuery: "हेल्पडेस्क को प्रश्न भेजें",
            accessibilityTitle: "पहुंच-योग्यता (एक्सेसिबिलिटी) सेटिंग्स",
            resetA11y: "सभी डिफ़ॉल्ट पर रीसेट करें"
        },
        te: {
            govIndia: "భారత ప్రభుత్వం",
            ministry: "గణాంకాలు మరియు కార్యక్రమ అమలు మంత్రిత్వ శాఖ (MoSPI)",
            portalSubtitle: "నేషనల్ స్టాటిస్టికల్ సిస్టమ్స్ ట్రైనింగ్ అకాడమీ (NSSTA)",
            heroQuoteMain: "Where data and skills Think together.",
            heroSubtitle: "భారతీయ గణాంక శ్రామిక శక్తి కోసం AI ఆధారిత నైపుణ్య మరియు సామర్థ్య నిర్మాణం.",
            searchPlaceholder: "మీరు ఏమి అన్వేషించాలనుకుంటున్నారు?",
            btnAssess: "నైపుణ్యాలను అంచనా వేయండి",
            btnExplore: "శిక్షణా మార్గాలను అన్వేషించండి",
            btnDemo: "డెమో చూడండి",
            btnRegister: "అధికారిగా నమోదు చేసుకోండి",
            btnLogin: "అధికారిక లాగిన్",
            whyChooseTitle: "గణాంక అధికారులు StatSkill AI ను ఎందుకు ఎంచుకుంటారు",
            domainSectionTitle: "గణాంక నైపుణ్యాల నాలుగు ముఖ్య స్తంభాలు",
            domainSectionSub: "MoSPI నైపుణ్య ఫ్రేమ్‌వర్క్ 2026 ప్రమాణాలకు అనుగుణంగా రూపొందించబడింది.",
            statsTitle: "గణాంక కేడర్ అంతటా కొలవగల ప్రభావం",
            statsSub: "iGOT కర్మయోగి ప్రమాణాల ఆధారంగా రూపొందించిన విశ్లేషణలు.",
            reviewsTitle: "జాతీయ గణాంక పర్యావరణ వ్యవస్థ నుండి అభిప్రాయాలు",
            reviewsSub: "కేంద్ర మరియు రాష్ట్ర గణాంక సిబ్బంది నమూనా సమీక్షలు.",
            queryTitle: "ప్రశ్న ఉందా? / సహాయం కావాలా?",
            querySub: "మీ ప్రశ్నలను నేరుగా MoSPI హెల్ప్‌డెస్క్‌కు పంపండి.",
            btnSubmitQuery: "హెల్ప్‌డెస్క్‌కు సమర్పించండి",
            accessibilityTitle: "యాక్సెసిబిలిటీ ప్రాధాన్యతలు",
            resetA11y: "అన్నీ రీసెట్ చేయండి"
        }
    };

    // -------------------------------------------------------------
    // ILLUSTRATIVE REVIEWS DATASET (4-6 Illustrative Reviews)
    // -------------------------------------------------------------
    const REVIEWS = [
        {
            id: 1,
            quote: "The automated skill gap diagnostic pinpointed exactly where our field team needed refresher training in Multi-Stage Stratified Sampling and CASI digital survey instruments. Transitioning to recommended iGOT modules was seamless.",
            role: "Senior Statistical Officer (SSO)",
            department: "Survey Design and Research Division (SDRD), Kolkata",
            cadre: "Subordinate Statistical Service (SSS)",
            avatarIcon: "fa-user-tie",
            badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
            verified: true,
            rating: 5
        },
        {
            id: 2,
            quote: "StatSkill AI's personalized learning pathway for GDP Base Year Revision and Supply-Use Tables saved our division weeks of manual curriculum curation. The explainable AI recommendations gave our officers genuine confidence.",
            role: "Joint Director (Macroeconomic Statistics)",
            department: "National Accounts Division (NAD), New Delhi",
            cadre: "Indian Statistical Service (ISS)",
            avatarIcon: "fa-chart-line",
            badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
            verified: true,
            rating: 5
        },
        {
            id: 3,
            quote: "As a State DES official, having both Central MoSPI survey guidelines and State-level economic indicators mapped into micro-assessments is invaluable. The offline practice quizzes helped prepare our district teams for agricultural census rounds.",
            role: "District Statistical Officer",
            department: "Directorate of Economics & Statistics (DES), Maharashtra",
            cadre: "State Directorate Cadre",
            avatarIcon: "fa-landmark-flag",
            badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
            verified: true,
            rating: 5
        },
        {
            id: 4,
            quote: "The AI MCQ Assessment Generator built from official NSSTA manuals produces rigorous, scenario-based questions in seconds. It transformed our internal capacity-building workshops and probationer assessments.",
            role: "Senior Faculty & Training Coordinator",
            department: "National Statistical Systems Training Academy (NSSTA), Greater Noida",
            cadre: "NSSTA Academic Faculty",
            avatarIcon: "fa-chalkboard-user",
            badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
            verified: true,
            rating: 5
        },
        {
            id: 5,
            quote: "The DPDP Act 2023 & Differential Privacy governance modules ensured our data processing teams understand both technological safeguards and legal compliance before releasing public microdata files.",
            role: "Data Privacy & Governance Lead",
            department: "Data Quality & Dissemination Division, New Delhi",
            cadre: "National Data Governance Unit",
            avatarIcon: "fa-shield-halved",
            badgeColor: "bg-red-100 text-red-800 border-red-200",
            verified: true,
            rating: 5
        }
    ];

    // Local Component State
    let currentReviewIndex = 0;
    let rotatingWordIndex = 0;
    let isDemoModalOpen = false;


    // -------------------------------------------------------------
    // MAIN RENDER FUNCTION
    // -------------------------------------------------------------
    function renderLandingPage(state) {
        const lang = state.currentLanguage || "en";
        const t = I18N[lang] || I18N.en;

        // Trigger asynchronous chart & interactive initialization after DOM insertion
        setTimeout(() => {
            initRotatingQuote(lang);
            initLandingCharts();
            initStatsCountUpObserver();
            initReviewCarouselTimer();
        }, 120);

        return `
        <!-- Scoped Component Styling for Landing Page -->
        <style id="landingScopedStyles">
        /* =========================================================
               STATSKILL AI CIRCULAR CAPABILITIES ORBIT CAROUSEL CSS
               ========================================================= */
            .circular-carousel-wrapper {
                position: relative;
                width: 100%;
                max-width: 680px;
                height: 520px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }

            .circular-center-hub {
                position: absolute;
                z-index: 10;
                width: 170px;
                height: 170px;
                border-radius: 50%;
                background: #0B2545;
                border: 3px solid #3B82F6;
                box-shadow: 0 0 35px rgba(59, 130, 246, 0.35);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
            }

            .circular-orbit-container {
                position: absolute;
                width: 480px;
                height: 480px;
                border-radius: 50%;
                border: 2px dashed rgba(59, 130, 246, 0.3);
                animation: circularOrbitRotate 42s linear infinite;
            }

            .circular-carousel-wrapper:hover .circular-orbit-container,
            .circular-carousel-wrapper:hover .orbit-card-inner {
                animation-play-state: paused;
            }

            @keyframes circularOrbitRotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @keyframes counterRotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(-360deg); }
            }

            .orbit-slot {
                position: absolute;
                width: 190px;
                height: 105px;
                top: 50%;
                left: 50%;
                margin-top: -52px;
                margin-left: -95px;
            }

            .slot-1 { transform: rotate(0deg) translate(220px) rotate(0deg); }
            .slot-2 { transform: rotate(60deg) translate(220px) rotate(-60deg); }
            .slot-3 { transform: rotate(120deg) translate(220px) rotate(-120deg); }
            .slot-4 { transform: rotate(180deg) translate(220px) rotate(-180deg); }
            .slot-5 { transform: rotate(240deg) translate(220px) rotate(-240deg); }
            .slot-6 { transform: rotate(300deg) translate(220px) rotate(-300deg); }

            .orbit-card-inner {
                width: 100%;
                height: 100%;
                animation: counterRotate 42s linear infinite;
            }

            @media (max-width: 640px) {
                .circular-carousel-wrapper {
                    height: 420px;
                }
                .circular-orbit-container {
                    width: 340px;
                    height: 340px;
                }
                .orbit-slot {
                    width: 140px;
                    height: 90px;
                    margin-top: -45px;
                    margin-left: -70px;
                }
                .slot-1 { transform: rotate(0deg) translate(150px) rotate(0deg); }
                .slot-2 { transform: rotate(60deg) translate(150px) rotate(-60deg); }
                .slot-3 { transform: rotate(120deg) translate(150px) rotate(-120deg); }
                .slot-4 { transform: rotate(180deg) translate(150px) rotate(-180deg); }
                .slot-5 { transform: rotate(240deg) translate(150px) rotate(-240deg); }
                .slot-6 { transform: rotate(300deg) translate(150px) rotate(-300deg); }
            }
        </style>

        <div id="landingRootContainer" class="landing-page-wrapper space-y-10 pb-16">

            <!-- =========================================================
                 1. HERO SECTION (Notion-Inspired Clean, Spacious Minimalism & Large Typography)
                 ========================================================= -->
            <section class="max-w-6xl mx-auto px-4 sm:px-8 pt-8 sm:pt-16 pb-12 text-center space-y-8 bg-white">
                <div class="max-w-5xl mx-auto space-y-6">

                    <!-- Notion-Style Very Large Bold Main Headline -->
                    <h1 class="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.035em] text-slate-950 leading-[1.08] text-center max-w-5xl mx-auto font-sans">
                        <span>Where data and skills</span>
                        <span id="rotatingWordPill" class="inline-flex items-center justify-center px-4 sm:px-6 py-1 mx-1.5 sm:mx-2.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-slate-950 shadow-xs align-middle transition-all duration-300">
                            <span id="rotatingDot" class="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-blue-600 inline-block mr-2 sm:mr-3 flex-shrink-0 animate-pulse transition-all duration-300"></span>
                            <span id="rotatingWord" class="inline-block min-w-[3.6ch] sm:min-w-[4.2ch] text-center transition-all duration-300 transform translate-y-0 opacity-100 font-black text-blue-600" style="color: #2563EB;">Think</span>
                        </span>
                        <span>together.</span>
                    </h1>

                    <!-- Supporting Text: Short & Concise -->
                    <p class="text-lg sm:text-2xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed pt-2">
                        ${t.heroSubtitle}
                    </p>

                    <!-- Minimal Search Bar (Underneath Hero Quote & Text) -->
                    <div class="max-w-2xl mx-auto pt-4">
                        <div class="relative flex items-center bg-white rounded-2xl shadow-md border border-slate-200 p-2 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                            <i class="fa-solid fa-magnifying-glass text-slate-400 pl-4 text-base"></i>
                            <input id="intentSearchInput" type="text" onkeydown="if(event.key==='Enter') window.handleIntentSearch(this.value)" placeholder="${t.searchPlaceholder}" class="w-full px-4 py-3 bg-transparent text-slate-900 text-sm sm:text-base font-medium focus:outline-none placeholder:text-slate-400">
                            <button onclick="window.handleIntentSearch(document.getElementById('intentSearchInput').value)" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2 flex-shrink-0">
                                <span>Explore</span>
                                <i class="fa-solid fa-arrow-right text-xs"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-wrap items-center justify-center gap-3 pt-6">
                        <button onclick="store.openAuthModal('register')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-xl text-sm shadow-sm transition-colors flex items-center gap-2">
                            <i class="fa-solid fa-clipboard-check text-base"></i>
                            <span>${t.btnAssess}</span>
                        </button>
                        <button onclick="store.navigate('recommendations')" class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3.5 rounded-xl text-sm border border-slate-200 transition-colors flex items-center gap-2">
                            <i class="fa-solid fa-graduation-cap text-blue-600"></i>
                            <span>${t.btnExplore}</span>
                        </button>
                        <button onclick="window.openDemoWalkthrough()" class="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-3.5 rounded-xl text-sm border border-slate-200 shadow-xs transition-colors flex items-center gap-2">
                            <i class="fa-solid fa-play text-blue-600 text-xs"></i>
                            <span>${t.btnDemo}</span>
                        </button>
                    </div>

                </div>

                <!-- Why Choose StatSkill AI? Section -->
                <div id="whyChooseSection" class="mt-10 pt-8 border-t border-slate-100 text-center space-y-6">
                    <div class="space-y-2 max-w-2xl mx-auto">
                        <h2 class="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-sans">Why Choose StatSkill AI?</h2>
                        <p class="text-sm sm:text-base font-normal text-slate-600">Built around the real needs of India's official statistical workforce.</p>
                    </div>

                    <!-- 4 Cards Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left pt-2">
                        
                        <!-- CARD 1 -->
                        <div class="pillar-card bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 hover:border-blue-300 transition-all cursor-pointer" style="transition-delay: 0s;">
                            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg font-bold">
                                <i class="fa-solid fa-user-check"></i>
                            </div>
                            <h3 class="text-base font-bold text-slate-950">Built for Your Role, Not the Crowd</h3>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                Every recommendation is mapped to the real competency framework for Official Statistics — so what you see is what actually matters for your work.
                            </p>
                        </div>

                        <!-- CARD 2 -->
                        <div class="pillar-card bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 hover:border-blue-300 transition-all cursor-pointer" style="transition-delay: 0.15s;">
                            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg font-bold">
                                <i class="fa-solid fa-layer-group"></i>
                            </div>
                            <h3 class="text-base font-bold text-slate-950">One Path, Every Source</h3>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                iGOT Karmayogi courses and NSSTA's TPAC programmes, brought together in a single learning journey — nothing falls through the cracks.
                            </p>
                        </div>

                        <!-- CARD 3 -->
                        <div class="pillar-card bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 hover:border-blue-300 transition-all cursor-pointer" style="transition-delay: 0.3s;">
                            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg font-bold">
                                <i class="fa-solid fa-bullseye"></i>
                            </div>
                            <h3 class="text-base font-bold text-slate-950">We Show You the Gap, Not Just the Catalogue</h3>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                No more scrolling through hundreds of courses. We identify exactly what's missing for your role, and guide you straight to what closes it.
                            </p>
                        </div>

                        <!-- CARD 4 -->
                        <div class="pillar-card bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 hover:border-blue-300 transition-all cursor-pointer" style="transition-delay: 0.45s;">
                            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg font-bold">
                                <i class="fa-solid fa-language"></i>
                            </div>
                            <h3 class="text-base font-bold text-slate-950">Learning That Speaks Your Language</h3>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                Available in Hindi, Telugu, and more — with accessibility built in, so it works for every official, not just some.
                            </p>
                        </div>

                    </div>
                </div>
            </section>


                        <!-- =========================================================
                 4. STATS SECTION (Animated Chart.js Charts & Meaningful Metrics)
                 ========================================================= -->
            <section id="statsMetricsSection" class="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
                <div class="text-center space-y-2">
                    <span class="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                        Workforce Intelligence & Metrics
                    </span>
                    <h2 class="text-2xl sm:text-4xl font-extrabold text-navy-900" style="color: #0B2545;">
                        Measurable Impact Across India's Statistical Cadre
                    </h2>
                    <p class="text-slate-600 text-sm max-w-2xl mx-auto">
                        Real-time workforce intelligence benchmarked with iGOT Karmayogi data standards.
                    </p>
                </div>

                <!-- Meaningful Statistics Counter Cards (6 KPIs) -->
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <!-- KPI 1: Active Users vs Eligible -->
                    <div class="stat-card p-4 text-center stat-card-highlight flex flex-col justify-between">
                        <div>
                            <div class="text-2xl sm:text-3xl font-black text-navy-900 mb-0.5 count-up-animated" data-target="14280" data-suffix="+" style="color: #0B2545;">14,280+</div>
                            <div class="text-xs font-bold text-slate-800 uppercase tracking-wide leading-tight">Active Platform Users</div>
                        </div>
                        <div class="text-[10px] font-semibold text-slate-500 mt-2 pt-1 border-t border-slate-200/60">out of 36,000+ Eligible Officials</div>
                    </div>

                    <!-- KPI 2: iGOT Synced Courses -->
                    <div class="stat-card p-4 text-center stat-card-saffron flex flex-col justify-between">
                        <div>
                            <div class="text-2xl sm:text-3xl font-black text-orange-600 mb-0.5 count-up-animated" data-target="2486">2,486</div>
                            <div class="text-xs font-bold text-slate-800 uppercase tracking-wide leading-tight">iGOT Synced Courses</div>
                        </div>
                        <div class="text-[10px] font-semibold text-slate-500 mt-2 pt-1 border-t border-slate-200/60">Aligned with NSSTA</div>
                    </div>

                    <!-- KPI 3: Official Competencies -->
                    <div class="stat-card p-4 text-center stat-card-green flex flex-col justify-between">
                        <div>
                            <div class="text-2xl sm:text-3xl font-black text-emerald-600 mb-0.5 count-up-animated" data-target="120" data-suffix="+">120+</div>
                            <div class="text-xs font-bold text-slate-800 uppercase tracking-wide leading-tight">Official Competencies</div>
                        </div>
                        <div class="text-[10px] font-semibold text-slate-500 mt-2 pt-1 border-t border-slate-200/60">MoSPI Cadre Mapped</div>
                    </div>

                    <!-- KPI 4: AI Question Accuracy -->
                    <div class="stat-card p-4 text-center stat-card-highlight flex flex-col justify-between">
                        <div>
                            <div class="text-2xl sm:text-3xl font-black text-blue-600 mb-0.5 count-up-animated" data-target="98.4" data-suffix="%" data-decimal="true">98.4%</div>
                            <div class="text-xs font-bold text-slate-800 uppercase tracking-wide leading-tight">AI Diagnostic Accuracy</div>
                        </div>
                        <div class="text-[10px] font-semibold text-slate-500 mt-2 pt-1 border-t border-slate-200/60">Validated Assessment Engine</div>
                    </div>

                    <!-- KPI 5: Avg. Competency Gain -->
                    <div class="stat-card p-4 text-center stat-card-saffron flex flex-col justify-between">
                        <div>
                            <div class="text-2xl sm:text-3xl font-black text-purple-600 mb-0.5 count-up-animated" data-target="6.2" data-prefix="+" data-suffix="%" data-decimal="true">+6.2%</div>
                            <div class="text-xs font-bold text-slate-800 uppercase tracking-wide leading-tight">Avg. Competency Gain</div>
                        </div>
                        <div class="text-[10px] font-semibold text-slate-500 mt-2 pt-1 border-t border-slate-200/60">Post-Training Assessment</div>
                    </div>

                    <!-- KPI 6: States & UTs Covered -->
                    <div class="stat-card p-4 text-center stat-card-green flex flex-col justify-between">
                        <div>
                            <div class="text-2xl sm:text-3xl font-black text-emerald-700 mb-0.5 count-up-animated" data-target="36">36</div>
                            <div class="text-xs font-bold text-slate-800 uppercase tracking-wide leading-tight">States & UTs Covered</div>
                        </div>
                        <div class="text-[10px] font-semibold text-slate-500 mt-2 pt-1 border-t border-slate-200/60">Pan-India Network</div>
                    </div>
                </div>

                <!-- Animated Charts Visual Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Chart 1: Bar Chart (Cadre Competency Growth) -->
                    <div class="lg:col-span-2 stat-card p-6 space-y-4">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 text-left">
                            <div>
                                <h3 class="font-bold text-navy-900 text-base" style="color: #0B2545;">Cadre Competency Growth: Baseline vs Post-Training</h3>
                                <p class="text-xs text-slate-500 mt-0.5">Average competency level before and after training, measured on a 1–5 scale.</p>
                            </div>
                            <div class="self-start sm:self-auto flex-shrink-0">
                                <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                                    <i class="fa-solid fa-chart-line text-emerald-600"></i>
                                    <span>Training impact: levels increase across all 5 areas</span>
                                </span>
                            </div>
                        </div>
                        <div class="relative h-64 w-full">
                            <canvas id="landingBarChart"></canvas>
                        </div>
                        <div class="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-center font-medium">
                            💡 Compares pre-assessment baseline competency (gray) against post-training proficiency (orange) across core statistical domains.
                        </div>
                    </div>

                    <!-- Chart 2: Doughnut/Pie Chart (Cadre Learner Distribution) -->
                    <div class="stat-card p-6 space-y-4 flex flex-col justify-between">
                        <div class="border-b border-slate-100 pb-3 text-left">
                            <h3 class="font-bold text-navy-900 text-base" style="color: #0B2545;">Learner Distribution by Cadre</h3>
                            <p class="text-xs text-slate-500 mt-0.5">Share of active learners across official cadres.</p>
                        </div>
                        <div class="relative h-52 w-full flex items-center justify-center my-auto">
                            <canvas id="landingPieChart"></canvas>
                        </div>
                        <div class="space-y-2 pt-2 border-t border-slate-100">
                            <div class="grid grid-cols-2 gap-2 text-xs text-slate-700 font-semibold">
                                <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-navy-900" style="background: #0B2545;"></span> SSS Cadre — 42%</div>
                                <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-orange-500"></span> State DES — 28%</div>
                                <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> ISS Cadre — 18%</div>
                                <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Central IT — 12%</div>
                            </div>
                            <div class="text-[11px] text-slate-500 text-center pt-1 font-medium">
                                📌 Shows which official cadres are actively using the learning platform.
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- =========================================================
                 5. COMPETENCY DOMAIN BREAKDOWN (4 Connected Progression Pillars)
                 ========================================================= -->
            <section class="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
                <div class="text-center space-y-2">
                    <span class="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-100 px-3.5 py-1 rounded-full border border-blue-200">
                        Standardized National Framework
                    </span>
                    <h2 class="text-2xl sm:text-4xl font-extrabold text-navy-900" style="color: #0B2545;">
                        ${t.domainSectionTitle}
                    </h2>
                    <p class="text-slate-600 text-sm max-w-2xl mx-auto">
                        ${t.domainSectionSub}
                    </p>
                </div>

                <!-- 4 Connected Progression Pillars Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch relative">
                    
                    <!-- Domain 1: UNDERSTAND -> Statistical Methodologies -->
                    <div class="stat-card p-6 space-y-4 hover:border-blue-600 transition-all flex flex-col justify-between stat-card-highlight hover:-translate-y-1 cursor-pointer">
                        <div class="space-y-3">
                            <div class="flex items-center justify-between border-b border-blue-100 pb-2.5">
                                <span class="text-[11px] font-black tracking-widest text-blue-800 bg-blue-100 px-2.5 py-1 rounded-md uppercase">
                                    01 UNDERSTAND
                                </span>
                                <span class="hidden lg:inline-flex items-center text-xs font-bold text-blue-500" title="Progress to Build">
                                    <i class="fa-solid fa-arrow-right"></i>
                                </span>
                                <span class="lg:hidden text-xs font-bold text-blue-500" title="Progress to Build">
                                    <i class="fa-solid fa-arrow-down"></i>
                                </span>
                            </div>
                            <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl border border-blue-200">
                                <i class="fa-solid fa-chart-pie"></i>
                            </div>
                            <h3 class="text-base font-bold text-navy-900" style="color: #0B2545;">1. Statistical Methodologies</h3>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                Core statistical science for nationwide surveys, administrative records, and national accounting frameworks.
                            </p>
                            <div class="flex flex-wrap gap-1.5 pt-2">
                                <span class="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Sampling Design</span>
                                <span class="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">National Accounts</span>
                                <span class="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">CPI / WPI Indices</span>
                                <span class="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">SDG Indicators</span>
                            </div>
                        </div>
                        <button onclick="store.navigate('framework')" class="text-xs font-bold text-blue-700 flex items-center gap-1.5 hover:underline pt-2 group">
                            <span>View 32 Skills</span>
                            <i class="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                        </button>
                    </div>

                    <!-- Domain 2: BUILD -> Technical & Computing -->
                    <div class="stat-card p-6 space-y-4 hover:border-orange-500 transition-all flex flex-col justify-between stat-card-saffron hover:-translate-y-1 cursor-pointer">
                        <div class="space-y-3">
                            <div class="flex items-center justify-between border-b border-orange-100 pb-2.5">
                                <span class="text-[11px] font-black tracking-widest text-orange-900 bg-orange-100 px-2.5 py-1 rounded-md uppercase">
                                    02 BUILD
                                </span>
                                <span class="hidden lg:inline-flex items-center text-xs font-bold text-orange-500" title="Progress to Govern">
                                    <i class="fa-solid fa-arrow-right"></i>
                                </span>
                                <span class="lg:hidden text-xs font-bold text-orange-500" title="Progress to Govern">
                                    <i class="fa-solid fa-arrow-down"></i>
                                </span>
                            </div>
                            <div class="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl border border-orange-200">
                                <i class="fa-solid fa-code"></i>
                            </div>
                            <h3 class="text-base font-bold text-navy-900" style="color: #0B2545;">2. Technical & Computing</h3>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                Modern computational workflows, automated pipelines, Big Data analytics, and Machine Learning models.
                            </p>
                            <div class="flex flex-wrap gap-1.5 pt-2">
                                <span class="bg-orange-50 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded">Python Analytics</span>
                                <span class="bg-orange-50 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded">R Programming</span>
                                <span class="bg-orange-50 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded">AI / Machine Learning</span>
                                <span class="bg-orange-50 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded">Data Visualization</span>
                            </div>
                        </div>
                        <button onclick="store.navigate('framework')" class="text-xs font-bold text-orange-600 flex items-center gap-1.5 hover:underline pt-2 group">
                            <span>View 28 Skills</span>
                            <i class="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                        </button>
                    </div>

                    <!-- Domain 3: GOVERN -> Digital Governance & Trust -->
                    <div class="stat-card p-6 space-y-4 hover:border-emerald-500 transition-all flex flex-col justify-between stat-card-green hover:-translate-y-1 cursor-pointer">
                        <div class="space-y-3">
                            <div class="flex items-center justify-between border-b border-emerald-100 pb-2.5">
                                <span class="text-[11px] font-black tracking-widest text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-md uppercase">
                                    03 GOVERN
                                </span>
                                <span class="hidden lg:inline-flex items-center text-xs font-bold text-emerald-600" title="Progress to Lead">
                                    <i class="fa-solid fa-arrow-right"></i>
                                </span>
                                <span class="lg:hidden text-xs font-bold text-emerald-600" title="Progress to Lead">
                                    <i class="fa-solid fa-arrow-down"></i>
                                </span>
                            </div>
                            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl border border-emerald-200">
                                <i class="fa-solid fa-shield-halved"></i>
                            </div>
                            <h3 class="text-base font-bold text-navy-900" style="color: #0B2545;">3. Digital Governance & Trust</h3>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                Legal compliance, microdata dissemination standards, differential privacy, and CERT-In cybersecurity hygiene.
                            </p>
                            <div class="flex flex-wrap gap-1.5 pt-2">
                                <span class="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">DPDP Act 2023</span>
                                <span class="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Microdata Sharing</span>
                                <span class="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Cyber Hygiene</span>
                                <span class="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">NDAP Standards</span>
                            </div>
                        </div>
                        <button onclick="store.navigate('framework')" class="text-xs font-bold text-emerald-700 flex items-center gap-1.5 hover:underline pt-2 group">
                            <span>View 24 Skills</span>
                            <i class="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                        </button>
                    </div>

                    <!-- Domain 4: LEAD -> Leadership & Management -->
                    <div class="stat-card p-6 space-y-4 hover:border-purple-500 transition-all flex flex-col justify-between hover:-translate-y-1 cursor-pointer" style="border-top: 4px solid #8B5CF6;">
                        <div class="space-y-3">
                            <div class="flex items-center justify-between border-b border-purple-100 pb-2.5">
                                <span class="text-[11px] font-black tracking-widest text-purple-900 bg-purple-100 px-2.5 py-1 rounded-md uppercase">
                                    04 LEAD
                                </span>
                                <span class="text-xs font-bold text-purple-600" title="Completed Journey">
                                    <i class="fa-solid fa-circle-check"></i>
                                </span>
                            </div>
                            <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-xl border border-purple-200">
                                <i class="fa-solid fa-people-roof"></i>
                            </div>
                            <h3 class="text-base font-bold text-navy-900" style="color: #0B2545;">4. Leadership & Management</h3>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                Field administration, megaproject monitoring (IPMD), evidence-based policy formulation, and stakeholder communication.
                            </p>
                            <div class="flex flex-wrap gap-1.5 pt-2">
                                <span class="bg-purple-50 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">Field Leadership</span>
                                <span class="bg-purple-50 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">IPMD Monitoring</span>
                                <span class="bg-purple-50 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">Public Finance</span>
                                <span class="bg-purple-50 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">Crisis Comms</span>
                            </div>
                        </div>
                        <button onclick="store.navigate('framework')" class="text-xs font-bold text-purple-700 flex items-center gap-1.5 hover:underline pt-2 group">
                            <span>View 20 Skills</span>
                            <i class="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                        </button>
                    </div>

                </div>
            </section>


            <!-- =========================================================
                 6. STATSKILL AI CIRCULAR CAPABILITIES CAROUSEL
                 ========================================================= -->
            <section class="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
                <div class="text-center space-y-2">
                    <span class="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                        Platform Capabilities & Architecture
                    </span>
                    <h2 class="text-2xl sm:text-4xl font-extrabold text-navy-900" style="color: #0B2545;">
                        Core Capabilities of StatSkill AI
                    </h2>
                    <p class="text-slate-600 text-sm max-w-2xl mx-auto">
                        Explore how AI-powered workforce intelligence transforms competency mapping for India's statistical ecosystem.
                    </p>
                </div>

                <!-- Circular Rotating Carousel Container -->
                <div class="circular-carousel-wrapper no-print">
                    
                    <!-- Center Core Hub -->
                    <div class="circular-center-hub p-4">
                        <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg mb-1.5 shadow-xs">
                            <i class="fa-solid fa-chart-network"></i>
                        </div>
                        <div class="text-base font-black tracking-tight text-white">StatSkill AI</div>
                        <div class="text-[10px] font-semibold text-slate-300 leading-tight mt-0.5 max-w-[130px]">
                            AI-Powered Workforce Intelligence
                        </div>
                    </div>

                    <!-- Orbit Container with 6 Rotating Capability Slots -->
                    <div class="circular-orbit-container">
                        
                        <!-- SLOT 1 -->
                        <div class="orbit-slot slot-1 cursor-pointer" onclick="store.navigate('assessment')" title="Click to Assess Competencies">
                            <div class="orbit-card-inner bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all text-left flex flex-col justify-between">
                                <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold mb-1">
                                    <i class="fa-solid fa-brain-circuit"></i>
                                </div>
                                <h4 class="text-xs font-bold text-slate-900 leading-tight">AI Skill Gap Analysis</h4>
                                <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">Identify competency gaps based on role frameworks.</p>
                            </div>
                        </div>

                        <!-- SLOT 2 -->
                        <div class="orbit-slot slot-2 cursor-pointer" onclick="store.navigate('learningPath')" title="Click to View Learning Paths">
                            <div class="orbit-card-inner bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all text-left flex flex-col justify-between">
                                <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold mb-1">
                                    <i class="fa-solid fa-route"></i>
                                </div>
                                <h4 class="text-xs font-bold text-slate-900 leading-tight">Personalized Learning Paths</h4>
                                <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">Targeted course recommendations for skill targets.</p>
                            </div>
                        </div>

                        <!-- SLOT 3 -->
                        <div class="orbit-slot slot-3 cursor-pointer" onclick="store.navigate('igot-hub')" title="Click to View iGOT Hub">
                            <div class="orbit-card-inner bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all text-left flex flex-col justify-between">
                                <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold mb-1">
                                    <i class="fa-solid fa-graduation-cap"></i>
                                </div>
                                <h4 class="text-xs font-bold text-slate-900 leading-tight">iGOT & NSSTA Integration</h4>
                                <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">2,480+ iGOT modules & NSSTA masterclasses.</p>
                            </div>
                        </div>

                        <!-- SLOT 4 -->
                        <div class="orbit-slot slot-4 cursor-pointer" onclick="store.navigate('recommendations')" title="Click to View Recommendations">
                            <div class="orbit-card-inner bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all text-left flex flex-col justify-between">
                                <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold mb-1">
                                    <i class="fa-solid fa-circle-nodes"></i>
                                </div>
                                <h4 class="text-xs font-bold text-slate-900 leading-tight">Explainable Recommendations</h4>
                                <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">Multi-factor scoring (30% Gap, 20% Cadre).</p>
                            </div>
                        </div>

                        <!-- SLOT 5 -->
                        <div class="orbit-slot slot-5 cursor-pointer" onclick="window.toggleAccessibilityPanel(event)" title="Click to Open Accessibility Options">
                            <div class="orbit-card-inner bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all text-left flex flex-col justify-between">
                                <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold mb-1">
                                    <i class="fa-solid fa-language"></i>
                                </div>
                                <h4 class="text-xs font-bold text-slate-900 leading-tight">Multilingual & Inclusive</h4>
                                <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">Hindi, Telugu & regional languages support.</p>
                            </div>
                        </div>

                        <!-- SLOT 6 -->
                        <div class="orbit-slot slot-6 cursor-pointer" onclick="store.navigate('reports')" title="Click to View Reports">
                            <div class="orbit-card-inner bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all text-left flex flex-col justify-between">
                                <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold mb-1">
                                    <i class="fa-solid fa-chart-network"></i>
                                </div>
                                <h4 class="text-xs font-bold text-slate-900 leading-tight">Workforce Intelligence</h4>
                                <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">Real-time analytics for MoSPI leadership.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


                        <!-- =========================================================
                 7. OFFICIAL TESTIMONIALS & REVIEWS CAROUSEL
                 ========================================================= -->
            <section class="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
                <div class="text-center space-y-2">
                    <span class="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                        Official Testimonials & Case Studies
                    </span>
                    <h2 class="text-2xl sm:text-4xl font-extrabold text-navy-900" style="color: #0B2545;">
                        ${t.reviewsTitle}
                    </h2>
                    <p class="text-slate-600 text-sm max-w-2xl mx-auto">
                        ${t.reviewsSub}
                    </p>
                </div>

                <!-- Carousel Card Container with Left and Right Controls on BOTH sides -->
                <div class="relative max-w-4xl mx-auto flex items-center gap-4">
                    <!-- Left Arrow Control -->
                    <button onclick="window.prevReview()" class="w-12 h-12 rounded-2xl bg-white border border-slate-300 text-navy-900 hover:bg-orange-50 hover:border-orange-500 shadow-md flex items-center justify-center flex-shrink-0 transition-all transform hover:scale-105 active:scale-95" title="Previous Review">
                        <i class="fa-solid fa-chevron-left text-base"></i>
                    </button>

                    <!-- Active Review Card Content -->
                    <div id="reviewCardContent" class="flex-1 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden transition-all duration-300 min-h-[240px] flex flex-col justify-between border-t-4 border-orange-500">
                        ${renderSingleReview(REVIEWS[currentReviewIndex])}
                    </div>

                    <!-- Right Arrow Control -->
                    <button onclick="window.nextReview()" class="w-12 h-12 rounded-2xl bg-white border border-slate-300 text-navy-900 hover:bg-orange-50 hover:border-orange-500 shadow-md flex items-center justify-center flex-shrink-0 transition-all transform hover:scale-105 active:scale-95" title="Next Review">
                        <i class="fa-solid fa-chevron-right text-base"></i>
                    </button>
                </div>

                <!-- Pagination Dots -->
                <div class="flex items-center justify-center gap-2">
                    ${REVIEWS.map((r, idx) => `
                        <button onclick="window.goToReview(${idx})" class="w-3 h-3 rounded-full transition-all ${idx === currentReviewIndex ? 'bg-orange-500 w-8' : 'bg-slate-300 hover:bg-slate-400'}" title="Go to testimonial ${idx + 1}"></button>
                    `).join('')}
                </div>
            </section>


            <!-- =========================================================
                 8. MOSPI NSSTA HELPDESK & SUPPORT DESK SECTION
                 ========================================================= -->
            <section id="raiseQuerySection" class="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
                
                <!-- Common FAQs Section (Above Form) -->
                <div class="space-y-4">
                    <div class="text-center sm:text-left space-y-1">
                        <span class="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            Frequently Asked Questions
                        </span>
                        <h3 class="text-xl sm:text-2xl font-extrabold text-navy-900" style="color: #0B2545;">
                            Common Helpdesk Answers
                        </h3>
                        <p class="text-slate-600 text-xs sm:text-sm">
                            Quick solutions to frequent capacity-building, certificate, and course access questions.
                        </p>
                    </div>

                    <!-- 4 FAQ Accordion Cards Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- FAQ 1 -->
                        <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-blue-400 transition-all cursor-pointer" onclick="window.toggleLandingFaq(1)">
                            <div class="flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-navy-900" style="color: #0B2545;">
                                <span class="flex items-center gap-2">
                                    <i class="fa-solid fa-circle-question text-blue-600"></i>
                                    <span>How do I verify or download my iGOT training certificate?</span>
                                </span>
                                <i id="faqIcon1" class="fa-solid fa-chevron-down text-slate-400 text-xs transition-transform"></i>
                            </div>
                            <div id="faqAns1" class="hidden text-xs text-slate-600 mt-2.5 pt-2 border-t border-slate-100 leading-relaxed">
                                Log into your iGOT Karmayogi profile, navigate to <strong>My Learning & Certificates</strong>, and click <strong>Download Verified PDF</strong>. Certificate hashes are cryptographically verified by MoSPI NSSTA.
                            </div>
                        </div>

                        <!-- FAQ 2 -->
                        <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-blue-400 transition-all cursor-pointer" onclick="window.toggleLandingFaq(2)">
                            <div class="flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-navy-900" style="color: #0B2545;">
                                <span class="flex items-center gap-2">
                                    <i class="fa-solid fa-circle-question text-blue-600"></i>
                                    <span>Why can't I see courses specific to my State DES cadre?</span>
                                </span>
                                <i id="faqIcon2" class="fa-solid fa-chevron-down text-slate-400 text-xs transition-transform"></i>
                            </div>
                            <div id="faqAns2" class="hidden text-xs text-slate-600 mt-2.5 pt-2 border-t border-slate-100 leading-relaxed">
                                State DES cadre courses require state nodal officer tagging. Ensure your profile has your State Directorate selected under <strong>Profile Settings &rarr; Cadre Info</strong>.
                            </div>
                        </div>

                        <!-- FAQ 3 -->
                        <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-blue-400 transition-all cursor-pointer" onclick="window.toggleLandingFaq(3)">
                            <div class="flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-navy-900" style="color: #0B2545;">
                                <span class="flex items-center gap-2">
                                    <i class="fa-solid fa-circle-question text-blue-600"></i>
                                    <span>How is my AI Skill Gap Diagnostic Score calculated?</span>
                                </span>
                                <i id="faqIcon3" class="fa-solid fa-chevron-down text-slate-400 text-xs transition-transform"></i>
                            </div>
                            <div id="faqAns3" class="hidden text-xs text-slate-600 mt-2.5 pt-2 border-t border-slate-100 leading-relaxed">
                                Our explainable AI algorithm combines your self-assessment score (30%), cadre benchmark targets (20%), and Ministry priority weightings (15%) against the 2026 MoSPI Competency Matrix.
                            </div>
                        </div>

                        <!-- FAQ 4 -->
                        <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-blue-400 transition-all cursor-pointer" onclick="window.toggleLandingFaq(4)">
                            <div class="flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-navy-900" style="color: #0B2545;">
                                <span class="flex items-center gap-2">
                                    <i class="fa-solid fa-circle-question text-blue-600"></i>
                                    <span>How do I nominate officers for NSSTA residential training?</span>
                                </span>
                                <i id="faqIcon4" class="fa-solid fa-chevron-down text-slate-400 text-xs transition-transform"></i>
                            </div>
                            <div id="faqAns4" class="hidden text-xs text-slate-600 mt-2.5 pt-2 border-t border-slate-100 leading-relaxed">
                                Departmental Head of Offices can submit nomination requests directly through the <strong>Nodal Officer Portal</strong> using employee CPIS / iGOT IDs before the monthly nomination deadline.
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Support & Query Card (Ultra Compact & Streamlined Height) -->
                <div class="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-xl border-t-4 border-emerald-500 space-y-3" style="background: #0B2545;">
                    
                    <!-- Compact Header & Navigation Tabs -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
                        <div class="space-y-0.5">
                            <div class="flex items-center gap-2">
                                <span class="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/40 uppercase">
                                    DIKSHA & iGOT Integrated Support
                                </span>
                                <span class="text-[10px] text-slate-300 flex items-center gap-1">
                                    <i class="fa-solid fa-clock text-orange-400"></i> SLA: 24–48 Hours
                                </span>
                            </div>
                            <h3 class="text-lg sm:text-xl font-black text-white leading-tight">
                                ${t.queryTitle}
                            </h3>
                        </div>

                        <!-- Navigation Tabs -->
                        <div class="flex items-center bg-slate-800/90 p-0.5 rounded-xl border border-slate-700 self-start sm:self-auto">
                            <button id="tabBtnSubmit" onclick="window.switchQueryTab('submit')" class="px-3 py-1 rounded-lg text-xs font-bold transition-all bg-orange-500 text-white shadow-xs">
                                <i class="fa-solid fa-pen-to-square mr-1"></i> Submit Query
                            </button>
                            <button id="tabBtnTrack" onclick="window.switchQueryTab('track')" class="px-3 py-1 rounded-lg text-xs font-bold transition-all text-slate-300 hover:text-white">
                                <i class="fa-solid fa-magnifying-glass mr-1"></i> Track Query
                            </button>
                        </div>
                    </div>

                    <!-- TAB 1: SUBMIT QUERY FORM -->
                    <div id="queryTabSubmit" class="space-y-3">
                        <div id="queryFormContainer" class="bg-white text-slate-900 rounded-2xl p-3.5 sm:p-4 shadow-md text-xs">
                            <form id="raiseQueryForm" onsubmit="event.preventDefault(); window.handleRaiseQuerySubmit();" class="space-y-2.5" novalidate>
                                
                                <!-- Compact Presets Bar -->
                                <div class="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-2">
                                    <span class="text-[9px] font-bold text-slate-500 uppercase mr-1">Quick Presets:</span>
                                    <button type="button" onclick="window.prefillQueryPreset('login')" class="px-2 py-0.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md text-[10px] font-bold border border-red-200 transition-all flex items-center gap-1">
                                        <i class="fa-solid fa-key text-[8px]"></i> <span>Can't Log In?</span>
                                    </button>
                                    <button type="button" onclick="window.prefillQueryPreset('certificate')" class="px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-[10px] font-bold border border-blue-200 transition-all flex items-center gap-1">
                                        <i class="fa-solid fa-certificate text-[8px]"></i> <span>Certificate Issue</span>
                                    </button>
                                    <button type="button" onclick="window.prefillQueryPreset('course')" class="px-2 py-0.5 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-md text-[10px] font-bold border border-orange-200 transition-all flex items-center gap-1">
                                        <i class="fa-solid fa-graduation-cap text-[8px]"></i> <span>Course Access</span>
                                    </button>
                                    <button type="button" onclick="window.prefillQueryPreset('department')" class="px-2 py-0.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-md text-[10px] font-bold border border-purple-200 transition-all flex items-center gap-1">
                                        <i class="fa-solid fa-building-flag text-[8px]"></i> <span>Unlisted Dept?</span>
                                    </button>
                                    <button type="button" onclick="window.prefillQueryPreset('nomination')" class="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md text-[10px] font-bold border border-emerald-200 transition-all flex items-center gap-1">
                                        <i class="fa-solid fa-user-plus text-[8px]"></i> <span>Nominate Officer</span>
                                    </button>
                                    <button type="button" onclick="window.prefillQueryPreset('score')" class="px-2 py-0.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-md text-[10px] font-bold border border-amber-200 transition-all flex items-center gap-1">
                                        <i class="fa-solid fa-chart-user text-[8px]"></i> <span>AI Score Check</span>
                                    </button>
                                </div>

                                <!-- 3 Fields Horizontal Row on Desktop -->
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                                    <div class="space-y-0.5">
                                        <label class="block font-bold text-slate-800 text-[10px] uppercase">Officer Name / Role <span class="text-red-500">*</span></label>
                                        <input id="queryNameInput" type="text" placeholder="e.g. Statistical Officer" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500">
                                        <div id="err_queryNameInput" class="hidden text-red-500 text-[10px] font-semibold flex items-center gap-1 mt-0.5"></div>
                                    </div>

                                    <div class="space-y-0.5">
                                        <label class="block font-bold text-slate-800 text-[10px] uppercase">Gov Email (.gov.in/.nic.in) <span class="text-red-500">*</span></label>
                                        <input id="queryEmailInput" type="email" placeholder="officer@nic.in or gov.in" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500">
                                        <div id="err_queryEmailInput" class="hidden text-red-500 text-[10px] font-semibold flex items-center gap-1 mt-0.5"></div>
                                    </div>

                                    <div class="space-y-0.5">
                                        <label class="block font-bold text-slate-800 text-[10px] uppercase">Category <span class="text-red-500">*</span></label>
                                        <select id="queryCategorySelect" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500">
                                            <option value="">-- Select Category --</option>
                                            <option value="Technical Support & Platform Issues">Technical Support & Login Issues</option>
                                            <option value="Certificate Verification & Status">Certificate Verification & Status</option>
                                            <option value="iGOT / NSSTA Course Access Problem">iGOT / NSSTA Course Access Problem</option>
                                            <option value="Cadre & Role Mapping Inquiry">Cadre & Role Mapping Inquiry</option>
                                            <option value="General Inquiry">General Inquiry</option>
                                        </select>
                                        <div id="err_queryCategorySelect" class="hidden text-red-500 text-[10px] font-semibold flex items-center gap-1 mt-0.5"></div>
                                    </div>
                                </div>

                                <!-- Details Box & Attachment Side-by-side -->
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 items-end">
                                    <div class="md:col-span-2 space-y-0.5">
                                        <div class="flex justify-between items-center">
                                            <label class="block font-bold text-slate-800 text-[10px] uppercase">Query Details <span class="text-red-500">*</span></label>
                                            <span id="queryCharCounter" class="text-[9px] font-bold text-slate-400">0/500</span>
                                        </div>
                                        <textarea id="queryDetailsInput" maxlength="500" oninput="window.updateQueryCharCount(this)" rows="2" placeholder="Describe your query or error details..." class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"></textarea>
                                        <div id="err_queryDetailsInput" class="hidden text-red-500 text-[10px] font-semibold flex items-center gap-1 mt-0.5"></div>
                                    </div>

                                    <div class="space-y-0.5">
                                        <label class="block font-bold text-slate-800 text-[10px] uppercase">Attachment (Optional)</label>
                                        <div class="relative">
                                            <input type="file" id="queryAttachmentInput" accept="image/*,.pdf" onchange="window.handleQueryFileSelect(this)" class="hidden">
                                            <label for="queryAttachmentInput" class="w-full px-2.5 py-1.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-all text-xs text-slate-600">
                                                <span id="queryAttachmentFileName" class="truncate flex items-center gap-1">
                                                    <i class="fa-solid fa-paperclip text-slate-400 text-[10px]"></i>
                                                    <span class="truncate">Image / PDF (Max 5MB)</span>
                                                </span>
                                                <span class="text-[9px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded flex-shrink-0">Browse</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Compact Action Row -->
                                <div class="pt-1.5 flex items-center justify-between border-t border-slate-100">
                                    <span class="text-[9px] text-slate-500 flex items-center gap-1">
                                        <i class="fa-solid fa-shield-halved text-emerald-600"></i> MoSPI CRM Secure
                                    </span>
                                    <button type="submit" class="btn btn-saffron px-5 py-1.5 text-xs font-bold shadow-xs flex items-center gap-1.5">
                                        <i class="fa-solid fa-paper-plane text-[10px]"></i>
                                        <span>Submit Query</span>
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>

                    <!-- TAB 2: TRACK QUERY -->
                    <div id="queryTabTrack" class="hidden bg-white text-slate-900 rounded-2xl p-3.5 sm:p-4 shadow-md space-y-3 text-xs">
                        <div class="space-y-0.5 text-left">
                            <h4 class="text-xs font-extrabold text-navy-900" style="color: #0B2545;">Track Query Status</h4>
                            <p class="text-[11px] text-slate-500">Enter your Query Reference ID (e.g. <strong>MOSPI-Q-2026-0472</strong>).</p>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-2">
                            <input id="trackQueryIdInput" type="text" placeholder="e.g. MOSPI-Q-2026-0472" class="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs focus:bg-white focus:outline-none uppercase">
                            <button onclick="window.handleTrackQuerySubmit()" class="btn btn-navy px-4 py-1.5 text-xs font-bold flex items-center justify-center gap-1">
                                <i class="fa-solid fa-magnifying-glass text-[10px]"></i>
                                <span>Track Query</span>
                            </button>
                        </div>

                        <div id="trackResultContainer"></div>
                    </div>

                </div>

                <!-- QR Code & App Download Banner -->
                <div class="bg-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="flex items-center gap-5">
                        <!-- Authentic Scannable QR Code Container -->
                        <div class="w-24 h-24 bg-white border-2 border-slate-300 rounded-2xl p-1.5 shadow-sm flex flex-col items-center justify-center flex-shrink-0 text-center relative group hover:border-blue-500 transition-all">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=0B2545&data=https://igotkarmayogi.gov.in" alt="iGOT Mobile App QR Code" class="w-16 h-16 object-contain rounded" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                            <!-- High Precision Vector Fallback -->
                            <svg class="w-16 h-16 hidden" viewBox="0 0 33 33" fill="#0B2545" xmlns="http://www.w3.org/2000/svg">
                                <rect width="33" height="33" fill="#FFFFFF"/>
                                <rect x="2" y="2" width="9" height="9" fill="#0B2545"/>
                                <rect x="3" y="3" width="7" height="7" fill="#FFFFFF"/>
                                <rect x="4" y="4" width="5" height="5" fill="#0B2545"/>
                                <rect x="22" y="2" width="9" height="9" fill="#0B2545"/>
                                <rect x="23" y="3" width="7" height="7" fill="#FFFFFF"/>
                                <rect x="24" y="4" width="5" height="5" fill="#0B2545"/>
                                <rect x="2" y="22" width="9" height="9" fill="#0B2545"/>
                                <rect x="3" y="23" width="7" height="7" fill="#FFFFFF"/>
                                <rect x="4" y="24" width="5" height="5" fill="#0B2545"/>
                                <rect x="13" y="2" width="2" height="2"/><rect x="17" y="3" width="3" height="1"/>
                                <rect x="12" y="9" width="4" height="2"/><rect x="18" y="9" width="2" height="2"/>
                                <rect x="13" y="12" width="3" height="3"/><rect x="17" y="13" width="2" height="2"/>
                                <rect x="14" y="16" width="2" height="3"/><rect x="18" y="17" width="3" height="2"/>
                            </svg>
                            <span class="text-[8px] font-bold text-slate-600 uppercase tracking-tighter leading-none mt-1">Scan to Install</span>
                        </div>
                        <div class="space-y-1">
                            <span class="text-xs font-bold text-orange-600 uppercase tracking-wider">Mobile Learning Experience</span>
                            <h4 class="text-lg font-black text-navy-900" style="color: #0B2545;">Learn on the Go with iGOT Karmayogi & StatSkill Mobile</h4>
                            <p class="text-xs text-slate-600">Access offline assessment quizzes, survey manuals, and video lectures on your Android & iOS devices.</p>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-3">
                        <button onclick="alert('StatSkill Mobile App is officially hosted on NIC e-Gov Mobile Store & Google Play.')" class="px-4 py-2.5 bg-navy-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-navy-950 transition-all shadow-md" style="background: #0B2545;">
                            <i class="fa-brands fa-google-play text-emerald-400 text-sm"></i>
                            <div class="text-left leading-tight">
                                <div class="text-[9px] text-slate-300 uppercase">Get it on</div>
                                <div>Google Play</div>
                            </div>
                        </button>
                        <button onclick="alert('iOS IPA package is distributed via MoSPI Apple Enterprise Certificate.')" class="px-4 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-900 transition-all shadow-md">
                            <i class="fa-brands fa-apple text-slate-200 text-sm"></i>
                            <div class="text-left leading-tight">
                                <div class="text-[9px] text-slate-300 uppercase">Download on</div>
                                <div>App Store</div>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Comprehensive Sitemap & Governance Links -->
                <div class="pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
                    <div>
                        <h5 class="font-bold text-navy-900 uppercase text-[11px] mb-3 tracking-wider" style="color: #0B2545;">Platform Modules</h5>
                        <ul class="space-y-1.5 text-slate-600">
                            <li><a href="javascript:store.navigate('framework')" class="hover:text-orange-600">Competency Framework</a></li>
                            <li><a href="javascript:store.navigate('recommendations')" class="hover:text-orange-600">AI Learning Advisor</a></li>
                            <li><a href="javascript:store.navigate('igot-hub')" class="hover:text-orange-600">iGOT Karmayogi Hub</a></li>
                            <li><a href="javascript:store.navigate('ai-generator')" class="hover:text-orange-600">AI Assessment Generator</a></li>
                            <li><a href="javascript:store.navigate('learning-path')" class="hover:text-orange-600">Individual Learning Roadmap</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 class="font-bold text-navy-900 uppercase text-[11px] mb-3 tracking-wider" style="color: #0B2545;">Official Cadres</h5>
                        <ul class="space-y-1.5 text-slate-600">
                            <li><a href="javascript:void(0)" class="hover:text-orange-600">Indian Statistical Service (ISS)</a></li>
                            <li><a href="javascript:void(0)" class="hover:text-orange-600">Subordinate Statistical Service (SSS)</a></li>
                            <li><a href="javascript:void(0)" class="hover:text-orange-600">State Directorate of Economics & Stats</a></li>
                            <li><a href="javascript:void(0)" class="hover:text-orange-600">National Accounts Division (NAD)</a></li>
                            <li><a href="javascript:void(0)" class="hover:text-orange-600">Survey Design & Research (SDRD)</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 class="font-bold text-navy-900 uppercase text-[11px] mb-3 tracking-wider" style="color: #0B2545;">Institutions & Policies</h5>
                        <ul class="space-y-1.5 text-slate-600">
                            <li><a href="https://mospi.gov.in" target="_blank" class="hover:text-orange-600">Ministry of Statistics (MoSPI)</a></li>
                            <li><a href="javascript:void(0)" class="hover:text-orange-600">NSSTA Greater Noida Campus</a></li>
                            <li><a href="https://karmayogi.gov.in" target="_blank" class="hover:text-orange-600">Karmayogi Bharat Portal</a></li>
                            <li><a href="javascript:void(0)" class="hover:text-orange-600">National Training Policy (NTPOS)</a></li>
                            <li><a href="javascript:void(0)" class="hover:text-orange-600">Microdata Dissemination Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 class="font-bold text-navy-900 uppercase text-[11px] mb-3 tracking-wider" style="color: #0B2545;">Compliance & Legal</h5>
                        <ul class="space-y-1.5 text-slate-600">
                            <li><a href="javascript:alert('DPDP Act 2023: StatSkill AI strictly processes officer competency data under official government mandates with end-to-end encryption.')" class="hover:text-orange-600">Privacy Policy (DPDP 2023)</a></li>
                            <li><a href="javascript:alert('Terms of Service: Standard Government of India digital platform usage rules.')" class="hover:text-orange-600">Terms & Conditions</a></li>
                            <li><a href="javascript:alert('Hyperlink Policy: Outbound links lead to verified GOI domains only.')" class="hover:text-orange-600">Hyperlink Policy</a></li>
                            <li><a href="javascript:void(0)" onclick="window.toggleAccessibilityPanel()" class="hover:text-orange-600">Accessibility Statement</a></li>
                            <li><a href="javascript:alert('Security Audit: Certified by CERT-In empaneled auditor.')" class="hover:text-orange-600">Security Guidelines</a></li>
                        </ul>
                    </div>
                </div>
            </section>


            <!-- Demo Preview Modal Overlay -->
            ${isDemoModalOpen ? renderDemoModal() : ''}
        </div>
        `;
    }

    // -------------------------------------------------------------
    // REVIEW CARD SUB-RENDERER
    // -------------------------------------------------------------
    function renderSingleReview(review) {
        return `
        <div class="space-y-4 animate-fadeIn">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-1 text-amber-400 text-sm">
                    ${'<i class="fa-solid fa-star"></i>'.repeat(review.rating)}
                </div>
                <span class="text-[11px] font-bold px-3 py-0.5 rounded-full border ${review.badgeColor}">
                    ${review.cadre}
                </span>
            </div>

            <p class="text-sm sm:text-base text-slate-700 italic leading-relaxed font-normal">
                "${review.quote}"
            </p>

            <div class="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div class="w-11 h-11 rounded-full bg-navy-900 text-orange-400 flex items-center justify-center text-lg shadow-sm" style="background: #0B2545;">
                    <i class="fa-solid ${review.avatarIcon}"></i>
                </div>
                <div>
                    <div class="font-bold text-navy-900 text-sm" style="color: #0B2545;">${review.role}</div>
                    <div class="text-xs text-slate-500">${review.department}</div>
                </div>
            </div>
        </div>
        `;
    }

    // -------------------------------------------------------------
    // DEMO MODAL SUB-RENDERER
    // -------------------------------------------------------------
    function renderDemoModal() {
        return `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
                <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                            <i class="fa-solid fa-play"></i>
                        </div>
                        <h4 class="font-black text-navy-900 text-base" style="color: #0B2545;">StatSkill AI Platform Interactive Walkthrough</h4>
                    </div>
                    <button onclick="window.closeDemoWalkthrough()" class="text-slate-400 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                <div class="aspect-video bg-navy-950 rounded-2xl flex flex-col items-center justify-center text-white p-6 text-center space-y-3 relative overflow-hidden" style="background: #07182C;">
                    <div class="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl shadow-xl shadow-orange-500/40">
                        <i class="fa-solid fa-laptop-code"></i>
                    </div>
                    <h5 class="text-lg font-bold text-white">Full Interactive Sandbox Active</h5>
                    <p class="text-xs text-slate-300 max-w-md">
                        Explore all live capabilities directly: AI Question Generator, Radar Gap Matrix, iGOT Sync Simulation, and Official Registration.
                    </p>
                </div>

                <div class="flex justify-end gap-3 pt-2">
                    <button onclick="window.closeDemoWalkthrough()" class="btn btn-secondary px-5 py-2.5 text-xs font-bold">
                        Close Preview
                    </button>
                    <button onclick="window.closeDemoWalkthrough(); store.openAuthModal('register');" class="btn btn-saffron px-6 py-2.5 text-xs font-bold flex items-center gap-1.5">
                        <i class="fa-solid fa-user-plus text-[11px]"></i>
                        <span>Start Official Onboarding</span>
                    </button>
                </div>
            </div>
        </div>
        `;
    }



    // -------------------------------------------------------------
    // ROTATING QUOTE LOGIC (Notion-Style)
    // -------------------------------------------------------------
    
    // -------------------------------------------------------------
    // DYNAMIC SEARCH PLACEHOLDER LOGIC
    // -------------------------------------------------------------
    let dynamicPlaceholderIndex = 0;

    
    // -------------------------------------------------------------
    // STAGGERED REVEAL ANIMATION FOR VALUE PILLAR CARDS
    // -------------------------------------------------------------
    
    // -------------------------------------------------------------
    // INTERSECTION OBSERVER ANIMATED KPI COUNT-UP
    // -------------------------------------------------------------
    function initStatsCountUpObserver() {
        const section = document.getElementById("statsMetricsSection");
        if (!section) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const runCountUp = () => {
            const counters = section.querySelectorAll(".count-up-animated");
            counters.forEach(counter => {
                if (counter.dataset.hasAnimated) return;
                counter.dataset.hasAnimated = "true";

                const target = parseFloat(counter.dataset.target) || 0;
                const prefix = counter.dataset.prefix || "";
                const suffix = counter.dataset.suffix || "";
                const isDecimal = counter.dataset.decimal === "true";

                if (prefersReducedMotion) {
                    counter.innerText = prefix + (isDecimal ? target.toFixed(1) : Math.round(target).toLocaleString("en-IN")) + suffix;
                    return;
                }

                const duration = 1200; // 1.2 seconds
                const startTime = performance.now();

                const updateValue = (now) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOutProgress = 1 - Math.pow(1 - progress, 3); // Smooth ease-out cubic

                    const currentValue = target * easeOutProgress;
                    if (isDecimal) {
                        counter.innerText = prefix + currentValue.toFixed(1) + suffix;
                    } else {
                        counter.innerText = prefix + Math.round(currentValue).toLocaleString("en-IN") + suffix;
                    }

                    if (progress < 1) {
                        requestAnimationFrame(updateValue);
                    } else {
                        counter.innerText = prefix + (isDecimal ? target.toFixed(1) : Math.round(target).toLocaleString("en-IN")) + suffix;
                    }
                };

                requestAnimationFrame(updateValue);
            });
        };

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        runCountUp();
                        if (typeof initLandingCharts === "function") initLandingCharts();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(section);
        } else {
            runCountUp();
            if (typeof initLandingCharts === "function") initLandingCharts();
        }
    }

    function initStaggeredPillarCards() {
        const cards = document.querySelectorAll(".pillar-card");
        if (!cards.length) return;

        // Guaranteed staggered animation on mount
        cards.forEach((card, idx) => {
            setTimeout(() => {
                card.classList.add("is-visible");
            }, idx * 100);
        });

        // Secondary fallback to ensure 100% visibility under any condition
        setTimeout(() => {
            cards.forEach(card => card.classList.add("is-visible"));
        }, 600);
    }

    function initDynamicSearchPlaceholder() {
        if (window._searchPlaceholderInterval) {
            clearInterval(window._searchPlaceholderInterval);
            window._searchPlaceholderInterval = null;
        }

        const inputEl = document.getElementById("intentSearchInput");
        if (!inputEl) return;

        // Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            inputEl.placeholder = "What would you like to explore?";
            return;
        }

        const prompts = [
            "What would you like to explore?",
            "Explore competency frameworks",
            "Find learning paths",
            "Assess your competencies",
            "Explore statistical skills",
            "Discover iGOT modules",
            "Build your learning journey"
        ];

        // Event handlers to pause placeholder animation during user typing/focus
        inputEl.onfocus = () => {
            if (window._searchPlaceholderInterval) {
                clearInterval(window._searchPlaceholderInterval);
                window._searchPlaceholderInterval = null;
            }
        };

        inputEl.onblur = () => {
            if (!inputEl.value.trim()) {
                initDynamicSearchPlaceholder();
            initStaggeredPillarCards();
            }
        };

        inputEl.oninput = () => {
            if (inputEl.value.length > 0) {
                if (window._searchPlaceholderInterval) {
                    clearInterval(window._searchPlaceholderInterval);
                    window._searchPlaceholderInterval = null;
                }
            } else {
                initDynamicSearchPlaceholder();
            initStaggeredPillarCards();
            }
        };

        if (!inputEl.value.trim() && document.activeElement !== inputEl) {
            inputEl.placeholder = prompts[dynamicPlaceholderIndex];

            window._searchPlaceholderInterval = setInterval(() => {
                const el = document.getElementById("intentSearchInput");
                if (!el || el.value.trim().length > 0 || document.activeElement === el) return;

                dynamicPlaceholderIndex = (dynamicPlaceholderIndex + 1) % prompts.length;
                el.placeholder = prompts[dynamicPlaceholderIndex];
            }, 1800);
        }
    }

    function initRotatingQuote(lang) {
        if (window._rotatingQuoteInterval) {
            clearInterval(window._rotatingQuoteInterval);
        }

        const schemes = [
            { word: "Think", color: "#2563EB", bgAlpha: "rgba(37, 99, 235, 0.08)", borderAlpha: "rgba(37, 99, 235, 0.3)" },
            { word: "Learn", color: "#16A34A", bgAlpha: "rgba(22, 163, 74, 0.08)", borderAlpha: "rgba(22, 163, 74, 0.3)" },
            { word: "Scale", color: "#9333EA", bgAlpha: "rgba(147, 51, 234, 0.08)", borderAlpha: "rgba(147, 51, 234, 0.3)" },
            { word: "Build", color: "#EA580C", bgAlpha: "rgba(234, 88, 12, 0.08)", borderAlpha: "rgba(234, 88, 12, 0.3)" },
            { word: "Grow", color: "#0D9488", bgAlpha: "rgba(13, 148, 136, 0.08)", borderAlpha: "rgba(13, 148, 136, 0.3)" }
        ];

        window._rotatingQuoteInterval = setInterval(() => {
            const elWord = document.getElementById("rotatingWord");
            const elDot = document.getElementById("rotatingDot");
            const elPill = document.getElementById("rotatingWordPill");
            if (!elWord) return;

            rotatingWordIndex = (rotatingWordIndex + 1) % schemes.length;
            const current = schemes[rotatingWordIndex];

            elWord.style.opacity = "0";
            elWord.style.transform = "translateY(10px) scale(0.95)";

            setTimeout(() => {
                elWord.innerText = current.word;
                elWord.style.color = current.color;

                if (elDot) {
                    elDot.style.backgroundColor = current.color;
                }
                if (elPill) {
                    elPill.style.backgroundColor = current.bgAlpha;
                    elPill.style.borderColor = current.borderAlpha;
                }

                elWord.style.opacity = "1";
                elWord.style.transform = "translateY(0) scale(1.05)";
            }, 200);
        }, 2400);
    }

    // -------------------------------------------------------------
    // CHART.JS ANIMATED KPIS & CHARTS
    // -------------------------------------------------------------
        function initLandingCharts() {
        if (typeof Chart === "undefined") return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const animDuration = prefersReducedMotion ? 0 : 1600;

        // 1. Bar Chart: Cadre Competency Growth (Baseline vs Post-Training)
        const barCanvas = document.getElementById("landingBarChart");
        if (barCanvas && !barCanvas.dataset.hasRendered) {
            barCanvas.dataset.hasRendered = "true";
            if (window._landingBarChart) window._landingBarChart.destroy();

            const ctx = barCanvas.getContext("2d");
            window._landingBarChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: ["Sampling Design", "National Accounts", "Python Analytics", "Price Indices", "DPDP Governance"],
                    datasets: [
                        {
                            label: "Baseline / Pre-Assessment (Level 1-5)",
                            data: [2.8, 2.4, 1.8, 2.7, 2.0],
                            backgroundColor: "rgba(11, 37, 69, 0.5)",
                            borderColor: "#0B2545",
                            borderWidth: 1.5,
                            borderRadius: 6
                        },
                        {
                            label: "Post-Training (Level 1-5)",
                            data: [4.1, 3.8, 3.2, 3.9, 3.5],
                            backgroundColor: "rgba(234, 88, 12, 0.85)",
                            borderColor: "#EA580C",
                            borderWidth: 1.5,
                            borderRadius: 6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: animDuration,
                        easing: "easeOutQuart"
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 5,
                            ticks: {
                                stepSize: 1,
                                font: { size: 10, family: "Inter" }
                            },
                            title: {
                                display: true,
                                text: "Competency Maturity Level (1 to 5)",
                                font: { size: 10, weight: "bold" }
                            }
                        },
                        x: {
                            ticks: { font: { size: 10, family: "Inter" } }
                        }
                    },
                    plugins: {
                        legend: {
                            position: "top",
                            labels: { boxWidth: 12, font: { size: 11, family: "Inter" } }
                        }
                    }
                }
            });

            // Trigger reset() and update() to physically animate bars rising from baseline
            if (!prefersReducedMotion && window._landingBarChart) {
                window._landingBarChart.reset();
                setTimeout(() => {
                    if (window._landingBarChart) window._landingBarChart.update();
                }, 50);
            }
        }

        // 2. Doughnut/Pie Chart: Learner Distribution by Cadre
        const pieCanvas = document.getElementById("landingPieChart");
        if (pieCanvas && !pieCanvas.dataset.hasRendered) {
            pieCanvas.dataset.hasRendered = "true";
            if (window._landingPieChart) window._landingPieChart.destroy();

            const ctx = pieCanvas.getContext("2d");
            window._landingPieChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: ["SSS Cadre (42%)", "State DES (28%)", "ISS Cadre (18%)", "Central IT (12%)"],
                    datasets: [
                        {
                            data: [42, 28, 18, 12],
                            backgroundColor: ["#0B2545", "#EA580C", "#059669", "#7C3AED"],
                            borderWidth: 2,
                            borderColor: "#FFFFFF"
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "68%",
                    animation: {
                        animateRotate: !prefersReducedMotion,
                        animateScale: !prefersReducedMotion,
                        duration: animDuration,
                        easing: "easeOutQuart"
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });

            // Trigger reset() and update() to physically draw doughnut arcs
            if (!prefersReducedMotion && window._landingPieChart) {
                window._landingPieChart.reset();
                setTimeout(() => {
                    if (window._landingPieChart) window._landingPieChart.update();
                }, 50);
            }
        }
    }

    // -------------------------------------------------------------
    // REVIEWS CAROUSEL CONTROLLER
    // -------------------------------------------------------------
    function initReviewCarouselTimer() {
        if (window._reviewCarouselInterval) {
            clearInterval(window._reviewCarouselInterval);
        }
        window._reviewCarouselInterval = setInterval(() => {
            window.nextReview(false);
        }, 6000);
    }

    window.nextReview = function (manual = true) {
        currentReviewIndex = (currentReviewIndex + 1) % REVIEWS.length;
        updateReviewDOM();
        if (manual) initReviewCarouselTimer();
    };

    window.prevReview = function () {
        currentReviewIndex = (currentReviewIndex - 1 + REVIEWS.length) % REVIEWS.length;
        updateReviewDOM();
        initReviewCarouselTimer();
    };

    window.goToReview = function (idx) {
        currentReviewIndex = idx;
        updateReviewDOM();
        initReviewCarouselTimer();
    };

    function updateReviewDOM() {
        const container = document.getElementById("reviewCardContent");
        if (container) {
            container.innerHTML = renderSingleReview(REVIEWS[currentReviewIndex]);
        }
        // Update dots
        const dots = document.querySelectorAll("#landingRootContainer button[title*='testimonial']");
        dots.forEach((dot, idx) => {
            if (idx === currentReviewIndex) {
                dot.className = "w-8 h-3 rounded-full transition-all bg-orange-500";
            } else {
                dot.className = "w-3 h-3 rounded-full transition-all bg-slate-300 hover:bg-slate-400";
            }
        });
    }


    // -------------------------------------------------------------
    // INTENT SEARCH & EVENT HANDLERS
    // -------------------------------------------------------------
    window.handleIntentSearch = function (query) {
        if (!query || !query.trim()) return;
        const q = query.toLowerCase().trim();

        if (q.includes("path") || q.includes("roadmap") || q.includes("journey")) {
            store.navigate("learningPath");
        } else if (q.includes("python") || q.includes("r") || q.includes("coding") || q.includes("data")) {
            store.navigate("recommendations");
        } else if (q.includes("assess") || q.includes("test") || q.includes("quiz") || q.includes("mcq")) {
            store.navigate("assessment");
        } else if (q.includes("framework") || q.includes("skill") || q.includes("competency")) {
            store.navigate("framework");
        } else if (q.includes("igot") || q.includes("karmayogi") || q.includes("course")) {
            store.navigate("igot-hub");
        } else if (q.includes("help") || q.includes("query") || q.includes("support")) {
            scrollToSection("raiseQuerySection");
        } else {
            store.navigate("framework");
        }
    };

    window.handleQuickIntent = function (view) {
        store.navigate(view);
    };

    window.openDemoWalkthrough = function () {
        isDemoModalOpen = true;
        renderAppSafe();
    };

    window.closeDemoWalkthrough = function () {
        isDemoModalOpen = false;
        renderAppSafe();
    };

    // FAQ Toggle Accordion
    // Prefill Query Form from Presets (e.g. Can't Log In)
    window.prefillQueryPreset = function (preset) {
        window.switchQueryTab('submit');

        const catSelect = document.getElementById("queryCategorySelect");
        const detailsInput = document.getElementById("queryDetailsInput");
        const emailInput = document.getElementById("queryEmailInput");

        if (preset === 'login') {
            if (catSelect) catSelect.value = "Technical Support & Platform Issues";
            if (detailsInput) {
                detailsInput.value = "Issue: Facing difficulty logging into the portal / OTP authentication error. Please assist with account access.";
                window.updateQueryCharCount(detailsInput);
            }
            if (emailInput) emailInput.focus();
        } else if (preset === 'certificate') {
            if (catSelect) catSelect.value = "Certificate Verification & Status";
            if (detailsInput) {
                detailsInput.value = "Issue: Completed course on iGOT Karmayogi but training certificate PDF is not downloading or hash verification failed.";
                window.updateQueryCharCount(detailsInput);
            }
            if (emailInput) emailInput.focus();
        } else if (preset === 'course') {
            if (catSelect) catSelect.value = "iGOT / NSSTA Course Access Problem";
            if (detailsInput) {
                detailsInput.value = "Issue: Unable to access mandatory State DES statistical survey courses assigned to my role.";
                window.updateQueryCharCount(detailsInput);
            }
            if (emailInput) emailInput.focus();
        } else if (preset === 'department') {
            if (catSelect) catSelect.value = "Cadre & Role Mapping Inquiry";
            if (detailsInput) {
                detailsInput.value = "Issue: My State Directorate of Economics & Statistics / Nodal Office is not listed under Cadre Selection. Please add our department.";
                window.updateQueryCharCount(detailsInput);
            }
            if (emailInput) emailInput.focus();
        } else if (preset === 'nomination') {
            if (catSelect) catSelect.value = "Training Nomination & Sponsorship";
            if (detailsInput) {
                detailsInput.value = "Issue: Requesting official nomination & sponsorship details for upcoming NSSTA residential masterclass in National Accounts.";
                window.updateQueryCharCount(detailsInput);
            }
            if (emailInput) emailInput.focus();
        } else if (preset === 'score') {
            if (catSelect) catSelect.value = "Technical Support & Platform Issues";
            if (detailsInput) {
                detailsInput.value = "Issue: Diagnostic competency gap score does not reflect recent iGOT course completions. Requesting score synchronization.";
                window.updateQueryCharCount(detailsInput);
            }
            if (emailInput) emailInput.focus();
        }
    };

    window.toggleLandingFaq = function (idx) {
        const ans = document.getElementById("faqAns" + idx);
        const icon = document.getElementById("faqIcon" + idx);
        if (ans) {
            if (ans.classList.contains("hidden")) {
                ans.classList.remove("hidden");
                if (icon) icon.classList.add("rotate-180");
            } else {
                ans.classList.add("hidden");
                if (icon) icon.classList.remove("rotate-180");
            }
        }
    };

    // Tab Switcher (Submit Query vs Track Query)
    window.switchQueryTab = function (tab) {
        const tabSubmit = document.getElementById("queryTabSubmit");
        const tabTrack = document.getElementById("queryTabTrack");
        const btnSubmit = document.getElementById("tabBtnSubmit");
        const btnTrack = document.getElementById("tabBtnTrack");

        if (tab === "submit") {
            if (tabSubmit) tabSubmit.classList.remove("hidden");
            if (tabTrack) tabTrack.classList.add("hidden");
            if (btnSubmit) btnSubmit.className = "px-4 py-1.5 rounded-lg text-xs font-bold transition-all bg-orange-500 text-white shadow-sm";
            if (btnTrack) btnTrack.className = "px-4 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-300 hover:text-white";
        } else {
            if (tabSubmit) tabSubmit.classList.add("hidden");
            if (tabTrack) tabTrack.classList.remove("hidden");
            if (btnSubmit) btnSubmit.className = "px-4 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-300 hover:text-white";
            if (btnTrack) btnTrack.className = "px-4 py-1.5 rounded-lg text-xs font-bold transition-all bg-orange-500 text-white shadow-sm";
        }
    };

    // Character Counter for Details Box
    window.updateQueryCharCount = function (el) {
        const counter = document.getElementById("queryCharCounter");
        if (counter && el) {
            counter.textContent = `${el.value.length}/500 characters`;
        }
    };

    // File Selection Preview
    window.handleQueryFileSelect = function (el) {
        const label = document.getElementById("queryAttachmentFileName");
        if (label && el && el.files && el.files[0]) {
            const file = el.files[0];
            label.innerHTML = `<i class="fa-solid fa-file-check text-emerald-600"></i><span class="font-bold text-slate-800">${file.name}</span> <span class="text-slate-400">(${Math.round(file.size / 1024)} KB)</span>`;
        }
    };

    // Custom Validation & Form Submit Handler
    window.handleRaiseQuerySubmit = function () {
        const nameInput = document.getElementById("queryNameInput");
        const emailInput = document.getElementById("queryEmailInput");
        const catInput = document.getElementById("queryCategorySelect");
        const detailsInput = document.getElementById("queryDetailsInput");

        // Clear all previous inline errors
        ['queryNameInput', 'queryEmailInput', 'queryCategorySelect', 'queryDetailsInput'].forEach(id => {
            const errDiv = document.getElementById(`err_${id}`);
            const inputEl = document.getElementById(id);
            if (errDiv) errDiv.classList.add("hidden");
            if (inputEl) inputEl.classList.remove("border-red-500", "ring-2", "ring-red-200");
        });

        let isValid = true;

        // 1. Officer Name Validation
        if (!nameInput || !nameInput.value.trim()) {
            showInlineErr('queryNameInput', 'Please enter your Officer Name / Designation.');
            isValid = false;
        }

        // 2. Official Government Email Validation (.gov.in or .nic.in)
        if (!emailInput || !emailInput.value.trim()) {
            showInlineErr('queryEmailInput', 'Please enter your official email address.');
            isValid = false;
        } else {
            const emailVal = emailInput.value.trim().toLowerCase();
            if (!emailVal.endsWith('.gov.in') && !emailVal.endsWith('.nic.in')) {
                showInlineErr('queryEmailInput', 'Official email must end with .gov.in or .nic.in (e.g. officer@nic.in)');
                isValid = false;
            }
        }

        // 3. Category Validation
        if (!catInput || !catInput.value) {
            showInlineErr('queryCategorySelect', 'Please select a query category.');
            isValid = false;
        }

        // 4. Details Validation
        if (!detailsInput || !detailsInput.value.trim()) {
            showInlineErr('queryDetailsInput', 'Please enter your query details.');
            isValid = false;
        }

        if (!isValid) return;

        // Generate Reference Ticket ID
        const refId = `MOSPI-Q-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const formContainer = document.getElementById("queryFormContainer");

        if (formContainer) {
            formContainer.innerHTML = `
                <div class="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-3.5">
                    <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto shadow-xs">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <div class="space-y-1">
                        <h4 class="text-base font-bold text-slate-900">Query Submitted Successfully!</h4>
                        <p class="text-xs text-slate-600">Your query has been logged with the MoSPI NSSTA Helpdesk CRM.</p>
                    </div>
                    <div class="bg-white border border-emerald-200 rounded-xl p-3.5 inline-block shadow-xs">
                        <span class="text-xs text-slate-500 font-medium">Reference Query ID:</span>
                        <span class="text-sm font-black text-navy-900 ml-1 font-mono tracking-wider" style="color: #0B2545;">${refId}</span>
                    </div>
                    <div class="text-[11px] text-slate-600 space-y-1">
                        <div><i class="fa-solid fa-envelope text-blue-600 mr-1"></i> A confirmation receipt has been sent to <strong>${emailInput.value.trim()}</strong>.</div>
                        <div><i class="fa-solid fa-clock text-orange-500 mr-1"></i> Response SLA: Within 24-48 Working Hours.</div>
                    </div>
                    <div class="pt-2">
                        <button onclick="window.resetQueryForm()" class="btn btn-navy px-5 py-2 text-xs font-bold">
                            <i class="fa-solid fa-rotate-right mr-1.5"></i> Submit Another Query
                        </button>
                    </div>
                </div>
            `;
        }
    };

    function showInlineErr(id, msg) {
        const errDiv = document.getElementById(`err_${id}`);
        const inputEl = document.getElementById(id);
        if (errDiv) {
            errDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>${msg}</span>`;
            errDiv.classList.remove("hidden");
        }
        if (inputEl) {
            inputEl.classList.add("border-red-500", "ring-2", "ring-red-200");
        }
    }

    // Track Query Handler
    window.handleTrackQuerySubmit = function () {
        const trackInput = document.getElementById("trackQueryIdInput");
        const resultDiv = document.getElementById("trackResultContainer");
        if (!trackInput || !resultDiv) return;

        const id = trackInput.value.trim().toUpperCase();
        if (!id) {
            resultDiv.innerHTML = `<div class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">Please enter a valid Reference Query ID (e.g. MOSPI-Q-2026-0472).</div>`;
            return;
        }

        resultDiv.innerHTML = `
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-left">
                <div class="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span class="font-mono text-xs font-bold text-navy-900" style="color: #0B2545;">Query ID: ${id}</span>
                    <span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                        <i class="fa-solid fa-spinner animate-spin text-[9px]"></i> In Progress
                    </span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div><strong>Assigned Nodal:</strong> NSSTA Technical Support Team</div>
                    <div><strong>Last Update:</strong> Today at 02:15 PM</div>
                    <div><strong>Category:</strong> Platform Access & Verification</div>
                    <div><strong>Expected SLA:</strong> Within 24 Hours</div>
                </div>
                <div class="text-[10px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                    💬 <strong>Latest Note:</strong> "Nodal officer has reviewed the query details and initiated cadre verification with State DES."
                </div>
            </div>
        `;
    };

    // Reset Query Form
    window.resetQueryForm = function () {
        window.switchQueryTab('submit');
    };

    function scrollToSection(id) {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    }

    function renderAppSafe() {
        if (window.store) {
            window.store.notify();
        }
    }

    // Attach to window
    window.renderLandingPage = renderLandingPage;

})(window);