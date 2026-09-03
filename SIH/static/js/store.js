/**
 * StatSkill AI - Reactive State Store
 * Manages global application state, active role, 50+ user personas, competencies, roadmap, and API synchronization.
 */

class AppStore {
    constructor() {
        const initialUser = JSON.parse(JSON.stringify(MOCK_DATA.currentUser));
        const initialCourses = window.calculateDynamicRecommendations(initialUser, MOCK_DATA.allCoursesRaw);

        this.state = {
            currentRole: "learner", // 'learner' | 'trainer' | 'admin' | 'superadmin'
            currentLanguage: "en", // 'en' | 'hi' | 'te'
            fontSizeLevel: 1, // 0: Small, 1: Default, 2: Large
            isHighContrast: false,
            activeView: "landing",
            
            allUsers: MOCK_DATA.users,
            user: null, // Initial unauthenticated visitor state
            currentUser: null,
            competencyFramework: JSON.parse(JSON.stringify(MOCK_DATA.competencyFramework)),
            courses: initialCourses,
            trainingProgrammes: JSON.parse(JSON.stringify(MOCK_DATA.trainingProgrammes)),
            notifications: JSON.parse(JSON.stringify(MOCK_DATA.notifications)),
            
            // Dynamic State
            overallScore: initialUser.overallScore || 68,
            learningPath: [
                {
                    id: "lp_01",
                    phase: "Phase 1 — Foundation",
                    title: "Python for Official Data Analysis",
                    duration: "8 hours",
                    priority: "High",
                    source: "iGOT Karmayogi",
                    provider: "MoSPI / iGOT",
                    competency: "Python",
                    status: "In Progress",
                    progress: 60,
                    targetLevel: "Level 3"
                },
                {
                    id: "lp_02",
                    phase: "Phase 2 — Applied Skills",
                    title: "Data Visualization & Policy Dashboarding for Official Statistics",
                    duration: "6 hours",
                    priority: "High",
                    source: "iGOT Karmayogi",
                    provider: "NIC / MoSPI",
                    competency: "Data Visualization",
                    status: "Not Started",
                    progress: 0,
                    targetLevel: "Level 4"
                },
                {
                    id: "lp_03",
                    phase: "Phase 3 — Advanced",
                    title: "Machine Learning & AI for Government Statistical Analytics",
                    duration: "12 hours",
                    priority: "Critical",
                    source: "iGOT Karmayogi",
                    provider: "NSSTA / IIT",
                    competency: "AI/ML",
                    status: "Not Started",
                    progress: 0,
                    targetLevel: "Level 3"
                }
            ],
            
            // Authentication & Registration Modal State
            isAuthModalOpen: false,
            authModalTab: "register", // 'login' | 'register'
            registrationStep: 1, // 1 to 7
            registrationDraft: {
                governmentType: "",
                ministry: "",
                state: "",
                department: "",
                organisation: "",
                officialEmail: "",
                firstName: "",
                lastName: "",
                designation: "",
                cadre: "Subordinate Statistical Service (SSS)",
                employeeId: "",
                mobile: ""
            },
            isOrgSearchOpen: false,
            orgSearchQuery: "",
            isNodalModalOpen: false,
            authError: null,
            authSuccessMessage: null,

            // Assessment & Quiz State
            activeQuiz: null,
            quizQuestions: [],
            quizAnswers: {},
            quizMarkedForReview: {},
            lastQuizResult: null,
            
            // AI Generator State
            uploadedDoc: null,
            generatedQuestions: [],
            generationStatus: "idle",
            
            // Chat Assistant State
            chatMessages: [
                {
                    sender: "ai",
                    text: "Namaste! I am the **StatSkill AI Assistant**, trained on MoSPI competency frameworks, iGOT Karmayogi curricula, and NSSTA training manuals.\n\nHow may I assist your capacity-building journey today?",
                    citations: ["MoSPI Competency Framework 2026", "iGOT Karmayogi Guidelines"],
                    timestamp: "Just now"
                }
            ],
            isChatOpen: false,
            
            // iGOT Sync Simulator
            igotSync: {
                status: "Connected",
                lastSync: "29 Aug 2026, 10:15 PM",
                coursesSynced: 2486,
                activeUsers: 12480
            }
        };

        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // ----------------------------------------------------
    // AUTH MODAL & REGISTRATION ACTIONS
    // ----------------------------------------------------
    openAuthModal(tab = 'register', initialStep = 1) {
        if (typeof window.refreshCaptcha === 'function') {
            window.refreshCaptcha();
        }
        this.state.isAuthModalOpen = true;
        this.state.authModalTab = tab;
        this.state.authError = null;
        if (tab === 'register') {
            this.state.registrationStep = initialStep;
        }
        this.notify();
    }

    closeAuthModal() {
        this.state.isAuthModalOpen = false;
        this.state.isOrgSearchOpen = false;
        this.state.isNodalModalOpen = false;
        this.state.authError = null;
        this.notify();
    }

    logout() {
        this.state.user = null;
        this.state.currentUser = null;
        this.state.activeView = 'landing';
        this.notify();
    }

    setAuthModalTab(tab) {
        this.state.authModalTab = tab;
        this.state.authError = null;
        this.notify();
    }

    setRegistrationStep(step) {
        this.state.registrationStep = step;
        this.state.authError = null;
        this.notify();
    }

    updateRegistrationDraft(fields = {}) {
        this.state.registrationDraft = {
            ...this.state.registrationDraft,
            ...fields
        };
        this.notify();
    }

    openOrgSearch() {
        this.state.isOrgSearchOpen = true;
        this.state.orgSearchQuery = "";
        this.notify();
    }

    closeOrgSearch() {
        this.state.isOrgSearchOpen = false;
        this.notify();
    }

    setOrgSearchQuery(query) {
        this.state.orgSearchQuery = query;
        this.notify();
    }

    openNodalModal() {
        this.state.isNodalModalOpen = true;
        this.notify();
    }

    closeNodalModal() {
        this.state.isNodalModalOpen = false;
        this.notify();
    }

    // Finalize Registration and establish the officer's full organizational identity
    async registerOfficer(draft) {
        try {
            const newUserId = `usr_reg_${Date.now()}`;
            const officerName = `${draft.firstName || ''} ${draft.lastName || ''}`.trim() || "Registered Officer";
            const isCentral = draft.governmentType === "Central Government";

            const newOfficer = {
                id: newUserId,
                name: officerName,
                hindiName: officerName,
                teluguName: officerName,
                designation: draft.designation || "Statistical Officer",
                hindiDesignation: draft.designation || "सांख्यिकी अधिकारी",
                teluguDesignation: draft.designation || "స్టాటిస్టికల్ ఆఫీసర్",
                employeeId: draft.employeeId || `MOSPI-REG-${Math.floor(10000 + Math.random() * 90000)}`,
                department: draft.department || "National Statistical Office",
                ministry: isCentral ? (draft.ministry || "Ministry of Statistics & Programme Implementation") : (draft.state ? `Government of ${draft.state}` : "State Government"),
                state: draft.state || (isCentral ? "Central" : "State"),
                governmentType: draft.governmentType || "Central Government",
                organisation: draft.organisation || draft.department,
                cadre: draft.cadre || "Subordinate Statistical Service (SSS)",
                location: isCentral ? "Sardar Patel Bhawan, New Delhi" : `${draft.state || 'State'} Headquarters`,
                experienceYears: 4,
                education: { degree: "M.Sc. Statistics / Economics", institution: "Recognized National University", year: 2022 },
                currentAssignment: `${draft.organisation || draft.department} — Field & Data Analytics Unit`,
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                email: draft.officialEmail || "officer@gov.in",
                competencies: {
                    "Survey Design": { current: 3, required: 4 },
                    "Sampling": { current: 3, required: 4 },
                    "National Accounts": { current: 2, required: 4 },
                    "Price Statistics": { current: 2, required: 4 },
                    "Python": { current: 1, required: 4 },
                    "AI/ML": { current: 1, required: 3 },
                    "Data Visualization": { current: 2, required: 4 },
                    "R": { current: 2, required: 4 },
                    "Cybersecurity": { current: 2, required: 3 },
                    "Data Privacy & DPDP Act": { current: 2, required: 4 },
                    "Leadership": { current: 3, required: 4 }
                },
                overallScore: 62,
                learningHours: 18.0,
                assessmentsCompleted: 4
            };

            // Attempt backend sync
            try {
                await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        officer: newOfficer,
                        password: draft.password
                    })
                });
            } catch (backendErr) {
                console.warn("[AppStore] Backend sync fallback to local store:", backendErr);
            }

            // Update in-memory collections and active user
            this.state.allUsers.unshift(newOfficer);
            this.state.user = newOfficer;
            this.state.overallScore = newOfficer.overallScore;

            // Recalculate AI course recommendations dynamically
            if (window.calculateDynamicRecommendations) {
                this.state.courses = window.calculateDynamicRecommendations(this.state.user, MOCK_DATA.allCoursesRaw);
            }

            // Move to Step 7 (Success confirmation)
            this.state.registrationStep = 7;
            this.state.currentRole = "learner";
            this.state.authError = null;
            this.notify();

        } catch (err) {
            console.error("Error during registration:", err);
            this.state.authError = "Registration failed. Please review your information and try again.";
            this.notify();
        }
    }

    // Login Officer
    async loginOfficer(emailOrId, password, forcedRole) {
        this.state.authError = null;

        // Try to match from 50+ personas or newly registered users
        const matched = this.state.allUsers.find(u => 
            u.email.toLowerCase() === emailOrId.toLowerCase() || 
            (u.employeeId && u.employeeId.toLowerCase() === emailOrId.toLowerCase())
        );

        if (matched) {
            this.state.user = JSON.parse(JSON.stringify(matched));
            this.state.overallScore = matched.overallScore || 68;
            if (window.calculateDynamicRecommendations) {
                this.state.courses = window.calculateDynamicRecommendations(this.state.user, MOCK_DATA.allCoursesRaw);
            }
            this.state.currentRole = forcedRole || (matched.designation.includes("Director") ? "admin" : (matched.designation.includes("Faculty") ? "trainer" : "learner"));
            this.closeAuthModal();
            this.navigate(this.state.currentRole === "trainer" ? "trainer-dash" : (this.state.currentRole === "admin" ? "admin-dash" : "learner-dash"));
            return;
        }

        // Generic fallback login for valid gov.in format
        if (emailOrId.includes("@")) {
            this.closeAuthModal();
            this.navigate('learner-dash');
            return;
        }

        this.state.authError = "Invalid credentials. Please enter a registered Gov.in email or Employee ID.";
        this.notify();
    }

    // Dynamically evaluate competency benchmarks against Government FRAC Matrix for Officer's Role Tier
    syncUserFRACCompetencies() {
        const user = this.state.user || {};
        const officerTier = (typeof window.getOfficerRoleTier === 'function') ? window.getOfficerRoleTier(user) : 'Junior';
        this.state.officerFracTier = officerTier;

        const userComps = user.competencies || {};

        if (this.state.competencyFramework) {
            this.state.competencyFramework.forEach(domain => {
                domain.competencies.forEach(comp => {
                    const fracReq = (typeof window.getFracRequirement === 'function') ? window.getFracRequirement(comp.name, officerTier) : (comp[`frac${officerTier}`] || 3);
                    comp.requiredLevel = fracReq;

                    let currLvl = 2;
                    if (userComps[comp.name] !== undefined) {
                        currLvl = typeof userComps[comp.name] === 'object' ? userComps[comp.name].current : userComps[comp.name];
                    } else if (comp.currentLevel !== undefined) {
                        currLvl = comp.currentLevel;
                    }

                    comp.currentLevel = currLvl;
                    comp.gap = Math.max(0, comp.requiredLevel - comp.currentLevel);
                    comp.priority = comp.gap >= 2 ? "Critical" : (comp.gap === 1 ? "High" : "None");
                });
            });
        }
    }

    // Switch between any of the 50+ Official Personas
    switchUser(userId) {
        const found = this.state.allUsers.find(u => u.id === userId);
        if (found) {
            this.state.user = JSON.parse(JSON.stringify(found));
            this.state.overallScore = found.overallScore || 68;

            // Recalculate competency framework gaps against FRAC reference matrix
            this.syncUserFRACCompetencies();

            // Recalculate AI course recommendations dynamically
            if (typeof window.calculateDynamicRecommendations === 'function') {
                this.state.courses = window.calculateDynamicRecommendations(this.state.user, MOCK_DATA.allCoursesRaw);
            }

            // Re-seed tailored learning path
            this.state.learningPath = [
                {
                    id: `lp_${Date.now()}_1`,
                    phase: "Phase 1 — Priority Bridging",
                    title: this.state.courses[0] ? this.state.courses[0].title : "Official Statistical Specialization",
                    duration: this.state.courses[0] ? this.state.courses[0].duration : "8 hours",
                    priority: "High",
                    source: this.state.courses[0] ? this.state.courses[0].source : "iGOT Karmayogi",
                    provider: this.state.courses[0] ? this.state.courses[0].provider : "MoSPI",
                    competency: this.state.courses[0] ? this.state.courses[0].competencies[0] : "General",
                    status: "In Progress",
                    progress: 30,
                    targetLevel: "Level 4"
                },
                {
                    id: `lp_${Date.now()}_2`,
                    phase: "Phase 2 — Advanced Methodology",
                    title: this.state.courses[1] ? this.state.courses[1].title : "Advanced Computing",
                    duration: this.state.courses[1] ? this.state.courses[1].duration : "12 hours",
                    priority: "High",
                    source: this.state.courses[1] ? this.state.courses[1].source : "NSSTA",
                    provider: "NSSTA",
                    competency: this.state.courses[1] ? this.state.courses[1].competencies[0] : "AI/ML",
                    status: "Not Started",
                    progress: 0,
                    targetLevel: "Level 4"
                }
            ];

            this.notify();
        }
    }

    // Role Switching
    setRole(role) {
        this.state.currentRole = role;
        if (role === "learner") {
            this.state.activeView = "learner-dash";
        } else if (role === "trainer") {
            this.state.activeView = "trainer-dash";
        } else if (role === "admin" || role === "superadmin") {
            this.state.activeView = "admin-dash";
        }
        this.notify();
    }

    navigate(view) {
        if (view === 'login') {
            this.state.authModalTab = 'login';
            this.state.isAuthModalOpen = true;
            this.notify();
            return;
        }
        if (view === 'register') {
            this.state.authModalTab = 'register';
            this.state.registrationStep = 1;
            this.state.isAuthModalOpen = true;
            this.notify();
            return;
        }

        // Auth Guard for protected views requiring authenticated officer persona
        const protectedViews = [
            'learner-dash',
            'learningPath',
            'assessment',
            'profile',
            'reports',
            'trainer-dash',
            'admin-dash',
            'ai-generator',
            'aiGenerator',
            'quiz',
            'quiz-player'
        ];

        if (protectedViews.includes(view) && !this.state.user) {
            this.state.pendingRedirectView = view;
            this.openAuthModal('register');
            return;
        }

        this.state.isAuthModalOpen = false;
        this.state.activeView = view;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.notify();
    }

    setLanguage(lang) {
        this.state.currentLanguage = lang;
        this.notify();
    }

    setFontSizeLevel(level) {
        this.state.fontSizeLevel = level;
        const html = document.documentElement;
        if (level === 0) html.style.fontSize = "14px";
        else if (level === 1) html.style.fontSize = "16px";
        else if (level === 2) html.style.fontSize = "18px";
        this.notify();
    }

    toggleHighContrast() {
        this.state.isHighContrast = !this.state.isHighContrast;
        if (this.state.isHighContrast) {
            document.body.classList.add("high-contrast");
        } else {
            document.body.classList.remove("high-contrast");
        }
        this.notify();
    }

    addCourseToLearningPath(course) {
        if (!this.state.user) {
            this.openAuthModal('register');
            return false;
        }
        const exists = this.state.learningPath.find(item => item.title === course.title);
        if (!exists) {
            this.state.learningPath.push({
                id: `lp_${Date.now()}`,
                phase: `Phase ${this.state.learningPath.length + 1} — Targeted Skill`,
                title: course.title,
                duration: course.duration,
                priority: course.priority || "High",
                source: course.source || "iGOT Karmayogi",
                provider: course.provider || "MoSPI",
                competency: (course.competencies && course.competencies.length > 0) ? course.competencies[0] : "General",
                status: "In Progress",
                progress: 10,
                targetLevel: course.targetLevel || "Level 4"
            });
            this.notify();
            return true;
        }
        return false;
    }

    startQuiz(questions, title = "Official Statistics Competency Quiz") {
        if (!this.state.user) {
            this.openAuthModal('register');
            return;
        }
        this.state.activeQuiz = {
            title: title,
            totalQuestions: questions.length,
            timeRemainingSeconds: questions.length * 90,
            startedAt: Date.now()
        };
        this.state.quizQuestions = questions;
        this.state.quizAnswers = {};
        this.state.quizMarkedForReview = {};
        this.state.activeView = "quiz-player";
        this.notify();
    }

    submitQuiz() {
        let correct = 0;
        const total = this.state.quizQuestions.length;
        
        this.state.quizQuestions.forEach((q, idx) => {
            if (this.state.quizAnswers[idx] === q.correctAnswerIndex) {
                correct++;
            }
        });

        const scorePercent = Math.round((correct / total) * 100);
        
        this.state.overallScore = Math.min(100, this.state.overallScore + 6);
        this.state.user.overallScore = this.state.overallScore;
        this.state.user.assessmentsCompleted += 1;
        this.state.user.learningHours += 1.5;

        this.state.lastQuizResult = {
            scorePercent: scorePercent,
            correctCount: correct,
            totalCount: total,
            timeSpentMin: 14,
            competencyImprovement: "+6%",
            newOverallScore: this.state.overallScore,
            strongAreas: ["Multi-Stage Stratified Sampling", "Price Indices Formula", "Survey Quality Standards"],
            areasToImprove: ["Non-response Imputation Weighting", "Statistical Disclosure Differential Privacy"],
            nextRecommendations: [
                "Review Section 4: Non-response Imputation in NSSO Surveys",
                "Enroll in iGOT Course 'Machine Learning for Government Analytics'",
                "Practice follow-up scenario assessment"
            ]
        };

        this.state.activeQuiz = null;
        this.notify();
    }

    toggleChat() {
        this.state.isChatOpen = !this.state.isChatOpen;
        this.notify();
    }

    sendChatMessage(userText) {
        if (!userText.trim()) return;

        this.state.chatMessages.push({
            sender: "user",
            text: userText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        this.notify();

        setTimeout(() => {
            const query = userText.toLowerCase();
            let reply = "";
            let citations = [];

            if (query.includes("skill") || query.includes("role") || query.includes("required") || query.includes("gap")) {
                reply = `Based on your profile as **${this.state.user.designation}** in **${this.state.user.department}**, your top prioritized competency gaps have been mapped against official training mandates. Explore your **AI Learning Advisor** for targeted course paths.`;
                citations = ["National Training Policy for Official Statistics (NTPOS) Sec 4.2", "MoSPI Competency Framework 2026"];
            } else if (query.includes("sampling") || query.includes("stratified") || query.includes("cluster")) {
                reply = "**Multi-Stage Stratified Cluster Sampling** is standard for NSSO nationwide surveys:\n\n" +
                        "- **Stage 1 (PSUs/FSUs)**: Census villages (rural) / UFS blocks (urban).\n" +
                        "- **Stage 2 (USUs)**: Households selected within sampled FSUs after listing.\n\n" +
                        "This ensures optimal field efficiency, reduced operational variance, and robust state/national representation.";
                citations = ["NSSO 78th Round Sampling Design Manual, Chapter 2", "UN Official Statistics Sampling Guidelines (Handbook 52)"];
            } else {
                reply = `Thank you for your question on official statistical capacity building. As the **StatSkill AI Assistant**, I can assist you with competency mapping, explaining methodologies (Sampling, National Accounts, Price Indices, DPDP Act), or finding iGOT/NSSTA courses tailored to your cadre.`;
                citations = ["Official Statistical System Knowledge Base v3.2", "iGOT Karmayogi Ecosystem Docs"];
            }

            this.state.chatMessages.push({
                sender: "ai",
                text: reply,
                citations: citations,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            this.notify();
        }, 500);
    }
}

window.store = new AppStore();
