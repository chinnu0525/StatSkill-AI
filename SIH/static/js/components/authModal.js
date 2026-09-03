/**
 * StatSkill AI — Official Authentication & Registration System
 * 
 * Modeled 1:1 after official Government of India iGOT Karmayogi / MoSPI portal design:
 *  - Split Screen: Left Side = Royal Blue Informational Visual Graphic ("How To Login" / "How To Register")
 *  - Right Side = Clean White Auth Card with Cascading Hierarchy & Email, OTP, and Password Wizard.
 * 
 * Mixed-Case Alphanumeric Security CAPTCHA Engine:
 *  - Generates combined Upper Case + Lower Case + Numeric codes (e.g. 3eK8wT).
 *  - Interactive Refresh button dynamically regenerates new codes with live visual pulse.
 *  - Speech Engine clearly announces case distinctions ("Capital A", "Small b", "Number 7").
 *  - Dual Verification: User can either TYPE the code OR 1-click "I'm not a robot" to instantly verify.
 *  - Instant real-time green checkmark verification and form unlocking.
 */

(function(window) {
    'use strict';

    // Internal Form & Validation State
    let authState = {
        tab: 'register', // 'login' | 'register'
        step: 1, // 1: Info + Mobile/Email, 2: OTP, 3: Create Password
        name: '',
        govType: 'central', // 'central' | 'state'
        ministry: '',
        department: '',
        designation: '',
        roleGrade: 'R3',
        sectorTag: 'Official Statistics',
        d6Competencies: '',
        mobile: '',
        email: '',
        otp: '',
        demoOtp: '',
        password: '',
        confirmPassword: '',
        resendTimer: 0,
        timerInterval: null,
        isSendingOtp: false,
        isVerifyingOtp: false,
        isRegistering: false,
        isLoggingIn: false,
        step1Error: null,
        step2Error: null,
        step3Error: null,
        
        // Login State & 2-Factor OTP
        loginStep: 1, // 1: Credentials + CAPTCHA, 2: 6-Digit OTP Verification
        loginMode: 'otp', // 'otp' | 'password'
        loginEmail: '',
        loginPassword: '',
        loginOtp: '',
        loginDemoOtp: '',
        loginMobile: '',
        loginError: null,
        loginStep2Error: null,
        isVerifyingLoginOtp: false,
        loginResendTimer: 0,
        loginTimerInterval: null
    };

    // CAPTCHA Generator & State Engine
    let isRobotChecked = false;
    let currentCaptchaCode = generateCaptchaCode();

    function getRandomInt(max) {
        if (window.crypto && window.crypto.getRandomValues) {
            const arr = new Uint32Array(1);
            window.crypto.getRandomValues(arr);
            return arr[0] % max;
        }
        return Math.floor(Math.random() * max);
    }

    function generateCaptchaCode() {
        const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const lowercase = 'abcdefghijkmnpqrstuvwxyz';
        const numbers = '23456789';
        
        // Ensure guaranteed mix of capital letters, small letters, and numbers
        let chars = [
            uppercase.charAt(getRandomInt(uppercase.length)),
            uppercase.charAt(getRandomInt(uppercase.length)),
            lowercase.charAt(getRandomInt(lowercase.length)),
            lowercase.charAt(getRandomInt(lowercase.length)),
            numbers.charAt(getRandomInt(numbers.length)),
            numbers.charAt(getRandomInt(numbers.length))
        ];
        
        // Fisher-Yates random shuffle with cryptographic randomness
        for (let i = chars.length - 1; i > 0; i--) {
            const j = getRandomInt(i + 1);
            [chars[i], chars[j]] = [chars[j], chars[i]];
        }
        return chars.join('');
    }

    window.refreshCaptcha = function() {
        currentCaptchaCode = generateCaptchaCode();
        isRobotChecked = false;

        const codeEls = document.querySelectorAll('.captchaCodeDisplay');
        codeEls.forEach(el => {
            el.textContent = currentCaptchaCode;
            el.classList.add('animate-pulse');
            setTimeout(() => el.classList.remove('animate-pulse'), 350);
        });

        // Reset input fields
        const loginInp = document.getElementById('loginCaptchaInput');
        const regInp = document.getElementById('registerCaptchaInput');
        if (loginInp) loginInp.value = '';
        if (regInp) regInp.value = '';

        syncCaptchaUI();
        if (typeof window.updateStep3State === 'function') window.updateStep3State();
        if (typeof window.updateLoginState === 'function') window.updateLoginState();
    };

    window.playAudioCaptcha = function() {
        if (!('speechSynthesis' in window)) {
            alert("Audio CAPTCHA code is: " + currentCaptchaCode.split('').join(' - '));
            return;
        }
        window.speechSynthesis.cancel();
        const spokenList = currentCaptchaCode.split('').map(c => {
            if (/[A-Z]/.test(c)) return "Capital " + c;
            if (/[a-z]/.test(c)) return "Small " + c;
            return "Number " + c;
        });
        const spoken = "Security code is: " + spokenList.join(', ');
        const utterance = new SpeechSynthesisUtterance(spoken);
        utterance.rate = 0.75;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    // User types CAPTCHA code
    window.handleCaptchaInputChange = function(val, formType) {
        const inputVal = (val || '').trim();
        const matches = inputVal.toLowerCase() === currentCaptchaCode.toLowerCase();

        isRobotChecked = matches;
        syncCaptchaUI();

        if (formType === 'login') {
            if (typeof window.updateLoginState === 'function') window.updateLoginState();
        } else {
            if (typeof window.updateStep3State === 'function') window.updateStep3State();
        }
    };

    function syncCaptchaUI() {
        const loginBadge = document.getElementById('loginCaptchaBadge');
        const regBadge = document.getElementById('registerCaptchaBadge');
        const loginErr = document.getElementById('loginCaptchaError');
        const regErr = document.getElementById('registerCaptchaError');

        if (loginBadge) loginBadge.className = isRobotChecked ? 'absolute right-2 top-2 text-emerald-700 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300' : 'hidden';
        if (regBadge) regBadge.className = isRobotChecked ? 'absolute right-2 top-2 text-emerald-700 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300' : 'hidden';

        if (isRobotChecked) {
            if (loginErr) loginErr.classList.add('hidden');
            if (regErr) regErr.classList.add('hidden');
        }
    }

    // Helper: Render Standard Intuitive Security CAPTCHA Box
    function renderCaptchaComponent(formType) {
        return `
        <div class="space-y-1.5 pt-0.5">
            <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-slate-700">Security Verification <span class="text-red-500">*</span></label>
                <span class="text-[10px] text-slate-500 font-medium">Type the code shown below</span>
            </div>
            <div class="p-2.5 bg-slate-50 border border-slate-300 rounded-xl space-y-2">
                
                <!-- CAPTCHA Display Card with Dark Background + Amber Letters -->
                <div class="flex items-center justify-between bg-slate-950 px-3.5 py-2 rounded-lg border border-slate-700 shadow-inner">
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] text-slate-400 font-mono uppercase tracking-wider">CAPTCHA:</span>
                        <span class="captchaCodeDisplay text-amber-400 font-mono font-black text-base tracking-[0.25em] select-none">${currentCaptchaCode}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <button type="button" onclick="playAudioCaptcha()" class="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-md text-xs cursor-pointer transition-colors" title="Listen to CAPTCHA Code">
                            <i class="fa-solid fa-volume-high"></i>
                        </button>
                        <button type="button" onclick="refreshCaptcha()" class="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-md text-xs cursor-pointer transition-colors" title="Generate New CAPTCHA">
                            <i class="fa-solid fa-rotate-right"></i>
                        </button>
                    </div>
                </div>

                <!-- Single Clean Input Field with live match feedback -->
                <div class="relative">
                    <input type="text" id="${formType}CaptchaInput" placeholder="Enter CAPTCHA characters shown above" oninput="handleCaptchaInputChange(this.value, '${formType}')" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-600 pr-24">
                    <div id="${formType}CaptchaBadge" class="${isRobotChecked ? '' : 'hidden'} absolute right-2 top-2 text-emerald-700 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                        <i class="fa-solid fa-circle-check text-emerald-600 text-xs"></i> <span>Verified</span>
                    </div>
                </div>

                <div id="${formType}CaptchaError" class="text-[11px] text-red-600 font-semibold hidden">
                    <i class="fa-solid fa-circle-exclamation"></i> Incorrect CAPTCHA code. Please type the characters shown above.
                </div>
            </div>
        </div>
        `;
    }

    // Reset Auth State helper
    function resetAuthState(tab = 'register') {
        if (authState.timerInterval) {
            clearInterval(authState.timerInterval);
            authState.timerInterval = null;
        }
        if (authState.loginTimerInterval) {
            clearInterval(authState.loginTimerInterval);
            authState.loginTimerInterval = null;
        }
        currentCaptchaCode = generateCaptchaCode();
        isRobotChecked = false;
        authState = {
            tab: tab,
            step: 1,
            name: '',
            govType: 'central',
            ministry: '',
            department: '',
            designation: '',
            roleGrade: 'R3',
            sectorTag: 'Official Statistics',
            d6Competencies: '',
            mobile: '',
            email: '',
            otp: '',
            demoOtp: '',
            password: '',
            confirmPassword: '',
            resendTimer: 0,
            timerInterval: null,
            isSendingOtp: false,
            isVerifyingOtp: false,
            isRegistering: false,
            isLoggingIn: false,
            step1Error: null,
            step2Error: null,
            step3Error: null,
            
            // Login State
            loginStep: 1,
            loginMode: 'otp',
            loginEmail: '',
            loginPassword: '',
            loginOtp: '',
            loginDemoOtp: '',
            loginMobile: '',
            loginError: null,
            loginStep2Error: null,
            isVerifyingLoginOtp: false,
            loginResendTimer: 0,
            loginTimerInterval: null
        };
    }

    // Validation Helpers
    function isValidMobile(mobile) {
        const clean = (mobile || '').replace(/\D/g, '');
        return clean.length === 10 && /^[6-9]\d{9}$/.test(clean);
    }

    function isValidEmail(email) {
        if (!email) return true; // Optional if mobile is provided
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim());
    }

    function isMinistrySelected() {
        const m = (authState.ministry || '').trim();
        return m !== '' && !m.startsWith('--');
    }

    function isDepartmentSelected() {
        const d = (authState.department || '').trim();
        return isMinistrySelected() && d !== '' && !d.startsWith('--');
    }

    function isDesignationSelected() {
        const des = (authState.designation || '').trim();
        return isDepartmentSelected() && des !== '' && !des.startsWith('--');
    }

    function isNameFilled() {
        return Boolean((authState.name || '').trim().length >= 2);
    }

    function isAllPriorFilled() {
        return isNameFilled() && isMinistrySelected() && isDepartmentSelected() && isDesignationSelected();
    }

    function isStep1Valid() {
        return isAllPriorFilled() && isValidMobile(authState.mobile) && isValidEmail(authState.email);
    }

    function isPasswordLengthValid(pwd) { return (pwd || '').length >= 8; }
    function hasPasswordLetter(pwd) { return /[a-zA-Z]/.test(pwd || ''); }
    function hasPasswordNumber(pwd) { return /\d/.test(pwd || ''); }

    function isStep3Valid() {
        const p = authState.password;
        const cp = authState.confirmPassword;
        return isPasswordLengthValid(p) && hasPasswordLetter(p) && hasPasswordNumber(p) && cp.length > 0 && p === cp && isRobotChecked;
    }

    // Dynamic Hierarchy Helpers
    function getDepartmentList(govType, ministryName) {
        if (!ministryName || ministryName.startsWith('--')) return [];
        if (window.OrgDataService) {
            const depts = window.OrgDataService.getDepartments(govType, ministryName);
            let list = [];
            if (depts && depts.length > 0) {
                depts.forEach(d => {
                    list.push(d.name);
                    const orgs = window.OrgDataService.getOrganisations(govType, ministryName, d.id || d.name);
                    if (orgs && orgs.length > 0) {
                        orgs.forEach(o => {
                            if (!list.includes(o.name)) list.push(o.name);
                        });
                    }
                });
            }
            if (list.length > 0) return Array.from(new Set(list));
        }
        return [
            "National Statistical Office (NSO) - Field Operations Division (FOD)",
            "National Statistical Office (NSO) - Survey Design & Research Division (SDRD)",
            "National Statistical Office (NSO) - Data Quality & Coordination",
            "Economic Statistics Division (ESD)",
            "Social Statistics Division (SSD)"
        ];
    }

    function getDesignationList(govType, ministryName, departmentName) {
        if (!departmentName || departmentName.startsWith('--')) return [];
        if (typeof window.getDesignationsForDepartment === 'function') {
            const frameworkRoles = window.getDesignationsForDepartment(departmentName);
            if (frameworkRoles && frameworkRoles.length > 0) {
                return frameworkRoles;
            }
        }
        if (window.OrgDataService && typeof window.OrgDataService.getDesignations === 'function') {
            const roles = window.OrgDataService.getDesignations(govType, ministryName, departmentName);
            if (roles && roles.length > 0) {
                return roles.map(r => {
                    if (typeof r === 'object' && r) return r.title || r.name || r.id || 'Senior Statistical Officer (SSO)';
                    return String(r);
                }).filter(s => s && s !== '[object Object]');
            }
        }
        return [
            { grade: "R1", title: "Field Enumerator / Data Collector", fullTitle: "R1 — Field Enumerator / Data Collector", tier: "Entry", exp: "0–2 Years", sectorTag: "Official Statistics", d6Competencies: [] },
            { grade: "R2", title: "Statistical Supervisor", fullTitle: "R2 — Statistical Supervisor", tier: "Entry / Junior", exp: "2–4 Years", sectorTag: "Official Statistics", d6Competencies: [] },
            { grade: "R3", title: "Assistant Director (Statistics)", fullTitle: "R3 — Assistant Director (Statistics)", tier: "Junior", exp: "3–7 Years", sectorTag: "Official Statistics", d6Competencies: [] },
            { grade: "R4", title: "Deputy Director (Statistics)", fullTitle: "R4 — Deputy Director (Statistics)", tier: "Senior", exp: "7–10 Years", sectorTag: "Official Statistics", d6Competencies: [] },
            { grade: "R5", title: "Director (Statistics)", fullTitle: "R5 — Director (Statistics)", tier: "Senior", exp: "10–15 Years", sectorTag: "Official Statistics", d6Competencies: [] },
            { grade: "R6", title: "Additional DG / Statistical Adviser", fullTitle: "R6 — Additional DG / Statistical Adviser", tier: "Leadership", exp: "15+ Years", sectorTag: "Official Statistics", d6Competencies: [] }
        ];
    }

    // Resend Timers
    function startResendTimer() {
        if (authState.timerInterval) clearInterval(authState.timerInterval);
        authState.resendTimer = 30;
        authState.timerInterval = setInterval(() => {
            authState.resendTimer--;
            const timerEl = document.getElementById('resendTimerContainer');
            if (timerEl) {
                if (authState.resendTimer > 0) {
                    timerEl.innerHTML = `<span id="resendTimerDisplay" class="text-slate-500 font-medium"><i class="fa-regular fa-clock"></i> Resend OTP in ${authState.resendTimer}s</span>`;
                } else {
                    timerEl.innerHTML = `<button type="button" onclick="handleResendOtp()" class="text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"><i class="fa-solid fa-rotate-right"></i> Resend OTP via SMS</button>`;
                }
            }
            if (authState.resendTimer <= 0) {
                clearInterval(authState.timerInterval);
                authState.timerInterval = null;
            }
        }, 1000);
    }

    function startLoginResendTimer() {
        if (authState.loginTimerInterval) clearInterval(authState.loginTimerInterval);
        authState.loginResendTimer = 30;
        authState.loginTimerInterval = setInterval(() => {
            authState.loginResendTimer--;
            const timerEl = document.getElementById('loginResendTimerContainer');
            if (timerEl) {
                if (authState.loginResendTimer > 0) {
                    timerEl.innerHTML = `<span id="loginResendTimerDisplay" class="text-slate-500 font-medium"><i class="fa-regular fa-clock"></i> Resend OTP in ${authState.loginResendTimer}s</span>`;
                } else {
                    timerEl.innerHTML = `<button type="button" onclick="handleResendLoginOtp()" class="text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"><i class="fa-solid fa-rotate-right"></i> Resend Login OTP via SMS</button>`;
                }
            }
            if (authState.loginResendTimer <= 0) {
                clearInterval(authState.loginTimerInterval);
                authState.loginTimerInterval = null;
            }
        }, 1000);
    }

    // Modal Controller
    function renderAuthModal() {
        const isOpen = window.store && window.store.state && window.store.state.isAuthModalOpen;
        const currentTab = (window.store && window.store.state && window.store.state.authModalTab) || authState.tab || 'register';
        authState.tab = currentTab;

        if (!isOpen) return '';

        return `
        <div id="authModalOverlay" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm transition-opacity duration-300">
            <div class="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200 animate-fadeIn" style="max-height: 94vh;">
                
                <!-- Close Button -->
                <button onclick="closeAuthModal()" class="absolute top-3.5 right-3.5 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-sm transition-all cursor-pointer shadow-xs">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <!-- LEFT SIDE: Royal Blue Informational Hero (40%) -->
                <div class="hidden md:flex md:w-5/12 bg-gradient-to-br from-[#0B2545] via-[#134074] to-[#00509d] text-white p-7 flex-col justify-between relative overflow-hidden">
                    <div class="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-blue-400/10 blur-2xl pointer-events-none"></div>
                    <div class="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-orange-400/10 blur-2xl pointer-events-none"></div>

                    ${authState.tab === 'login' ? renderLeftLoginHero() : renderLeftRegisterHero()}
                </div>

                <!-- RIGHT SIDE: Clean Auth Forms (60%) -->
                <div class="w-full md:w-7/12 bg-white p-5 sm:p-7 flex flex-col justify-between overflow-y-auto" style="max-height: 94vh;">
                    
                    ${authState.tab === 'login' ? renderLoginForm(authState) : renderRegistrationWizard(authState, authState.step)}

                </div>

            </div>
        </div>
        `;
    }

    window.closeAuthModal = function() {
        if (window.store) {
            window.store.state.isAuthModalOpen = false;
            window.store.notify();
        }
        resetAuthState();
    };

    window.switchTab = function(newTab) {
        if (window.store) {
            window.store.state.authModalTab = newTab;
            window.store.notify();
        }
        resetAuthState(newTab);
    };

    function renderLeftLoginHero() {
        return `
        <div class="relative z-10 space-y-4 my-auto">
            <div class="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 text-2xl font-black shadow-inner">
                <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div class="space-y-1.5">
                <p class="text-xs font-bold uppercase tracking-widest text-blue-200">National Statistical Portal</p>
                <h2 class="text-2xl sm:text-3xl font-black text-white font-sans">Secure 2-Factor Officer Login</h2>
                <p class="text-xs text-blue-100/90 leading-relaxed pt-1">
                    MoSPI Capacity Building & Competency Management Platform. Sign in securely using <strong>Mobile SMS OTP</strong> or your official credentials.
                </p>
            </div>
            <div class="space-y-2 pt-2 text-xs">
                <div class="flex items-center gap-2 text-blue-100">
                    <i class="fa-solid fa-circle-check text-amber-400"></i>
                    <span>Real-time SMS OTP verification</span>
                </div>
                <div class="flex items-center gap-2 text-blue-100">
                    <i class="fa-solid fa-circle-check text-amber-400"></i>
                    <span>AI-curated learning pathways & gap analysis</span>
                </div>
                <div class="flex items-center gap-2 text-blue-100">
                    <i class="fa-solid fa-circle-check text-amber-400"></i>
                    <span>Single Sign-On (Parichay & JanParichay) support</span>
                </div>
            </div>
        </div>
        <div class="relative z-10 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-300 font-semibold">
            <span>StatSkill AI • MoSPI Capacity Building</span>
            <button onclick="store.openNodalModal()" class="text-amber-300 font-bold underline cursor-pointer">Need Help?</button>
        </div>
        `;
    }

    function renderLeftRegisterHero() {
        return `
        <div class="relative z-10 space-y-6 my-auto">
            <div class="text-center space-y-1">
                <p class="text-xs font-bold uppercase tracking-widest text-blue-200">Welcome to StatSkill AI</p>
                <h2 class="text-2xl sm:text-3xl font-black text-white font-sans">How To Register</h2>
            </div>
            <div class="grid grid-cols-2 gap-3 pt-2">
                <div class="p-3.5 bg-white/10 border border-white/15 rounded-2xl text-center space-y-1.5 backdrop-blur-xs">
                    <div class="w-8 h-8 rounded-full bg-amber-400 text-slate-950 mx-auto flex items-center justify-center text-sm font-bold shadow">1</div>
                    <p class="text-[11px] text-slate-200 leading-snug">Select Ministry → Department → Designation in order</p>
                </div>
                <div class="p-3.5 bg-white/10 border border-white/15 rounded-2xl text-center space-y-1.5 backdrop-blur-xs">
                    <div class="w-8 h-8 rounded-full bg-orange-400 text-white mx-auto flex items-center justify-center text-sm font-bold shadow">2</div>
                    <p class="text-[11px] text-slate-200 leading-snug">Enter official mobile number for OTP verification</p>
                </div>
                <div class="p-3.5 bg-white/10 border border-white/15 rounded-2xl text-center space-y-1.5 backdrop-blur-xs">
                    <div class="w-8 h-8 rounded-full bg-orange-500 text-white mx-auto flex items-center justify-center text-sm font-bold shadow">3</div>
                    <p class="text-[11px] text-slate-200 leading-snug">Verify 6-digit OTP & create a secure password</p>
                </div>
                <div class="p-3.5 bg-white/10 border border-white/15 rounded-2xl text-center space-y-1.5 backdrop-blur-xs">
                    <div class="w-8 h-8 rounded-full bg-blue-400 text-slate-950 mx-auto flex items-center justify-center text-sm font-bold shadow">4</div>
                    <p class="text-[11px] text-slate-200 leading-snug">Access your personalized competency dashboard</p>
                </div>
            </div>
        </div>
        `;
    }

    // -------------------------------------------------------------
    // RIGHT FORM A: RETURNING USER LOGIN TAB (WITH 2-STEP OTP)
    // -------------------------------------------------------------
    function renderLoginForm(state) {
        if (state.loginStep === 2) {
            return renderLoginStep2(state);
        }
        return renderLoginStep1(state);
    }

    function renderLoginStep1(state) {
        const isOtpMode = state.loginMode === 'otp';
        const isMobileValid = isValidMobile(state.loginEmail);
        const canSendLoginOtp = (isOtpMode ? isMobileValid : (state.loginEmail && state.loginPassword)) && isRobotChecked && !state.isSendingLoginOtp;

        return `
        <div class="space-y-4 my-auto max-w-md mx-auto w-full">
            
            <!-- Logo Header -->
            <div class="text-center space-y-1">
                <div class="inline-flex items-center gap-2">
                    <div class="w-10 h-10 rounded-xl bg-navy-900 text-orange-400 flex items-center justify-center text-xl font-black shadow" style="background:#0B2545;">
                        <i class="fa-solid fa-chart-network"></i>
                    </div>
                    <div class="text-left">
                        <span class="text-2xl font-black tracking-tight text-slate-900 font-sans" style="color:#0B2545;">StatSkill <span class="text-blue-600">AI</span></span>
                        <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">MoSPI National Portal</div>
                    </div>
                </div>
            </div>

            <div class="text-center text-xs font-bold text-slate-600 border-b border-slate-200 pb-2">
                <span class="text-blue-700 font-extrabold text-sm">Official Account Login</span>
            </div>

            <!-- Login Mode Switcher (Mobile OTP vs Password) -->
            <div class="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                <button type="button" onclick="setLoginMode('otp')" class="py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${isOtpMode ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200 font-black' : 'text-slate-600 hover:text-slate-900'}">
                    <i class="fa-solid fa-mobile-screen-button text-xs"></i>
                    <span>Mobile SMS OTP</span>
                </button>
                <button type="button" onclick="setLoginMode('password')" class="py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${!isOtpMode ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200 font-black' : 'text-slate-600 hover:text-slate-900'}">
                    <i class="fa-solid fa-key text-xs"></i>
                    <span>Password + OTP</span>
                </button>
            </div>

            <!-- Login Form Error Notice -->
            <div id="loginErrorNotice" class="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-shake ${state.loginError ? '' : 'hidden'}">
                <i class="fa-solid fa-circle-exclamation text-sm text-red-600 flex-shrink-0"></i>
                <span id="loginErrorText" class="font-semibold">${state.loginError || ''}</span>
            </div>

            <form onsubmit="event.preventDefault(); handleLoginSubmit();" class="space-y-3">
                
                <!-- Identifier Field -->
                <div class="space-y-1">
                    <div class="flex items-center justify-between">
                        <label class="block text-xs font-bold text-slate-700">
                            ${isOtpMode ? 'Official Mobile Number' : 'Official Mobile Number or Email'} <span class="text-red-500">*</span>
                        </label>
                        ${isOtpMode ? `<span id="loginMobileCountBadge" class="text-[10px] font-semibold ${isMobileValid ? 'text-emerald-600 font-bold' : 'text-slate-400'}">${(state.loginEmail || '').length}/10 digits</span>` : ''}
                    </div>
                    ${isOtpMode ? `
                    <div class="flex items-center">
                        <span class="inline-flex items-center px-3 py-2.5 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-700 font-bold text-xs">
                            🇮🇳 +91
                        </span>
                        <input id="loginEmail" type="tel" maxLength="10" required value="${state.loginEmail}" oninput="handleLoginMobileChange(this.value)" placeholder="Enter 10-digit mobile (e.g. 9876543210)" class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-r-lg text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600">
                    </div>
                    ` : `
                    <input id="loginEmail" type="text" required value="${state.loginEmail}" oninput="updateLoginState()" placeholder="e.g. 9876543210 or officer@nic.in" class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600">
                    `}
                </div>

                <!-- Password Field (Only in password mode) -->
                ${!isOtpMode ? `
                <div class="space-y-1">
                    <div class="flex justify-between items-center">
                        <label class="block text-xs font-bold text-slate-700">Password <span class="text-red-500">*</span></label>
                    </div>
                    <div class="relative">
                        <input id="loginPassword" type="password" required value="${state.loginPassword}" oninput="updateLoginState()" placeholder="••••••••••••" class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10">
                        <button type="button" onclick="togglePasswordVisibility('loginPassword', this)" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </div>
                ` : ''}

                <!-- INTUITIVE SECURITY CAPTCHA COMPONENT -->
                ${renderCaptchaComponent('login')}

                <!-- Main Login / Send OTP Button -->
                <button type="submit" id="loginSubmitBtn" class="w-full py-2.5 ${canSendLoginOtp ? 'bg-[#0077d6] hover:bg-[#0066cc] cursor-pointer shadow-md' : 'bg-slate-300 cursor-pointer'} text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2">
                    <span id="loginBtnText">${state.isSendingLoginOtp ? '<i class="fa-solid fa-circle-notch fa-spin"></i> Dispatching Login OTP...' : (isOtpMode ? 'Send Login OTP via SMS →' : 'Continue with OTP Verification →')}</span>
                </button>
            </form>

            <!-- Provider SSO Selector -->
            <div class="space-y-2 pt-1">
                <div class="relative flex py-1 items-center">
                    <div class="flex-grow border-t border-slate-200"></div>
                    <span class="flex-shrink mx-3 text-slate-400 text-[11px] font-bold">or</span>
                    <div class="flex-grow border-t border-slate-200"></div>
                </div>
                <div class="space-y-1">
                    <select onchange="if(this.value) alert('Redirecting to official Single Sign-On provider: ' + this.value)" class="w-full px-3.5 py-2 bg-white border border-[#0077d6] text-[#0077d6] rounded-lg text-xs font-bold text-center focus:outline-none cursor-pointer">
                        <option value="">Login with Provider SSO ∨</option>
                        <option value="Parichay Single Sign-On">Parichay (Govt Officer SSO)</option>
                        <option value="JanParichay">JanParichay National Portal</option>
                        <option value="iGOT Karmayogi SSO">iGOT Karmayogi Single Sign-On</option>
                    </select>
                </div>
            </div>
        </div>
        `;
    }

    // LOGIN STEP 2: ENTER LOGIN OTP
    function renderLoginStep2(state) {
        const isOtpFilled = (state.loginOtp || '').trim().length === 6;
        const canVerify = isOtpFilled && !state.isVerifyingLoginOtp;
        const targetDisplay = state.loginMobile ? `+91 ${state.loginMobile}` : (state.loginEmail || 'your phone');

        return `
        <div class="space-y-4 my-auto max-w-md mx-auto w-full">
            
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
                <div class="flex items-center gap-2">
                    <button type="button" onclick="goToLoginStep(1)" class="text-slate-600 hover:text-slate-900 text-base cursor-pointer">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <h2 class="text-xl sm:text-2xl font-black text-slate-900 font-sans">Login Verification</h2>
                </div>
                <span class="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">2-Factor Auth</span>
            </div>

            <!-- Real-time SMS OTP Dispatch Card -->
            <div class="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl space-y-2 shadow-2xs">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                        <i class="fa-solid fa-mobile-screen-button text-blue-600"></i>
                        <span>Login OTP Dispatched</span>
                    </div>
                    ${state.loginDemoOtp ? `<span class="bg-blue-600 text-white font-mono text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs tracking-wider">CODE: ${state.loginDemoOtp}</span>` : ''}
                </div>
                <div class="text-[11px] text-slate-700 leading-relaxed">
                    Official 6-digit Login OTP sent via SMS to <strong>${targetDisplay}</strong>.
                </div>
                
                ${state.loginDemoOtp ? `
                <div class="pt-0.5 flex items-center gap-2">
                    <button type="button" onclick="quickFillLoginOtp('${state.loginDemoOtp}')" class="text-[11px] font-bold text-blue-700 bg-white hover:bg-blue-100 border border-blue-300 px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all">
                        <i class="fa-solid fa-wand-magic-sparkles text-amber-500"></i> Auto-Fill Code (${state.loginDemoOtp})
                    </button>
                    <span class="text-[10px] text-slate-500 font-medium">(or enter manually below)</span>
                </div>
                ` : ''}
            </div>

            <!-- Error Notice with Clear & Retry -->
            <div id="loginStep2ErrorNotice" class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex flex-col gap-2 animate-shake ${state.loginStep2Error ? '' : 'hidden'}">
                <div class="flex items-center gap-2 font-bold text-red-800">
                    <i class="fa-solid fa-circle-exclamation text-base text-red-600 flex-shrink-0"></i>
                    <span id="loginStep2ErrorText">${state.loginStep2Error || 'Invalid OTP code entered. Please try again.'}</span>
                </div>
                <div class="flex items-center gap-2 pt-1 border-t border-red-100">
                    <button type="button" onclick="clearAndRetryLoginOtp()" class="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-xs">
                        <i class="fa-solid fa-rotate-left text-xs"></i> Clear & Re-enter OTP
                    </button>
                    <span class="text-[11px] text-slate-600">Please re-enter the code and try again.</span>
                </div>
            </div>

            <form onsubmit="event.preventDefault(); handleLoginVerifyOtp();" class="space-y-4">
                
                <!-- 6-Digit Monospace OTP Input Box -->
                <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                        <label class="block text-xs font-bold text-slate-700">Enter 6-Digit Login OTP <span class="text-red-500">*</span></label>
                        <span id="loginOtpCharCount" class="text-[10px] font-bold ${(state.loginOtp || '').length === 6 ? 'text-emerald-600' : 'text-slate-400'}">${(state.loginOtp || '').length}/6 digits</span>
                    </div>
                    <input id="loginOtpInput" type="text" maxLength="6" required value="${state.loginOtp}" oninput="handleLoginOtpInputChange(this.value)" placeholder="• • • • • •" class="w-full px-3.5 py-3 bg-white border ${state.loginStep2Error ? 'border-red-500 ring-2 ring-red-200' : 'border-blue-400'} rounded-xl text-center font-mono font-black text-2xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner">
                </div>

                <!-- Resend Timer & Actions -->
                <div class="flex items-center justify-between text-xs pt-1">
                    <div id="loginResendTimerContainer">
                        ${state.loginResendTimer > 0 ? `
                            <span id="loginResendTimerDisplay" class="text-slate-500 font-medium"><i class="fa-regular fa-clock"></i> Resend OTP in ${state.loginResendTimer}s</span>
                        ` : `
                            <button type="button" onclick="handleResendLoginOtp()" class="text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"><i class="fa-solid fa-rotate-right"></i> Resend Login OTP</button>
                        `}
                    </div>
                    <button type="button" onclick="goToLoginStep(1)" class="text-slate-500 hover:text-slate-800 text-[11px] font-semibold underline cursor-pointer">Change Number / Email</button>
                </div>

                <!-- Submit & Back Buttons -->
                <div class="flex items-center justify-between pt-2">
                    <button type="button" onclick="goToLoginStep(1)" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1.5">
                        <i class="fa-solid fa-arrow-left text-xs"></i> Back
                    </button>
                    <button type="submit" id="loginVerifyBtn" ${!canVerify ? 'disabled' : ''} class="px-6 py-2.5 ${canVerify ? 'bg-[#0077d6] hover:bg-[#0066cc] cursor-pointer shadow-md' : 'bg-slate-300 cursor-not-allowed'} text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-2">
                        <span id="loginVerifyBtnText">${state.isVerifyingLoginOtp ? '<i class="fa-solid fa-circle-notch fa-spin"></i> Logging in...' : 'Verify & Log In →'}</span>
                    </button>
                </div>

            </form>
        </div>
        `;
    }

    // -------------------------------------------------------------
    // RIGHT FORM B: REGISTRATION WIZARD (STEP 1, 2, 3)
    // -------------------------------------------------------------
    function renderRegistrationWizard(state, step) {
        return `
        <div class="space-y-3 my-auto max-w-lg mx-auto w-full">
            
            <!-- Header Back to Login + Title -->
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
                <div class="flex items-center gap-2">
                    <button type="button" onclick="switchTab('login')" class="text-slate-600 hover:text-slate-900 text-base cursor-pointer">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <h2 class="text-xl sm:text-2xl font-black text-slate-900 font-sans">Official Registration</h2>
                </div>
                <button type="button" onclick="switchTab('login')" class="text-xs text-blue-600 font-bold hover:underline cursor-pointer">
                    Already registered? Log in
                </button>
            </div>

            <!-- Step Progress Bar -->
            <div class="flex items-center justify-between text-xs py-1">
                <div class="flex items-center gap-1.5">
                    <div class="w-5 h-5 rounded-full ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'} font-bold flex items-center justify-center text-[11px]">1</div>
                    <span class="font-bold ${step >= 1 ? 'text-blue-600' : 'text-slate-400'} text-[11px]">Hierarchy & Contact</span>
                </div>
                <div class="flex-1 h-1 ${step >= 2 ? 'bg-orange-500' : 'bg-slate-200'} mx-2 rounded-full"></div>
                <div class="flex items-center gap-1.5">
                    <div class="w-5 h-5 rounded-full ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'} font-bold flex items-center justify-center text-[11px]">2</div>
                    <span class="font-bold ${step >= 2 ? 'text-blue-600' : 'text-slate-400'} text-[11px]">OTP Verification</span>
                </div>
                <div class="flex-1 h-1 ${step >= 3 ? 'bg-orange-500' : 'bg-slate-200'} mx-2 rounded-full"></div>
                <div class="flex items-center gap-1.5">
                    <div class="w-5 h-5 rounded-full ${step >= 3 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'} font-bold flex items-center justify-center text-[11px]">3</div>
                    <span class="font-bold ${step >= 3 ? 'text-blue-600' : 'text-slate-400'} text-[11px]">Security Password</span>
                </div>
            </div>

            ${step === 1 ? renderStep1() : (step === 2 ? renderStep2() : renderStep3())}

        </div>
        `;
    }

    // -------------------------------------------------------------
    // STEP 1: CASCADING HIERARCHY DETAILS & 10-DIGIT MOBILE NUMBER UNLOCK
    // -------------------------------------------------------------
    function renderStep1() {
        const govType = authState.govType || 'central';
        const minSelected = isMinistrySelected();
        const deptSelected = isDepartmentSelected();
        const contactUnlocked = isAllPriorFilled();
        const canSendOtp = isStep1Valid();

        // 1. Fetch Ministries / States
        let ministryOptions = [];
        if (window.OrgDataService) {
            if (govType === 'central') {
                ministryOptions = window.OrgDataService.getMinistries().map(m => m.name);
            } else {
                ministryOptions = window.OrgDataService.getStatesAndUTs().map(s => s.name);
            }
        }
        if (!ministryOptions.length) {
            ministryOptions = [
                "Ministry of Statistics & Programme Implementation (MoSPI)",
                "Ministry of Finance",
                "Ministry of Agriculture & Farmers Welfare",
                "Ministry of Health & Family Welfare",
                "Ministry of Commerce & Industry",
                "Ministry of Labour & Employment",
                "Ministry of Consumer Affairs, Food & Public Distribution",
                "Ministry of Rural Development",
                "Ministry of Jal Shakti",
                "Ministry of Education"
            ];
        }

        // 2. Fetch Cascaded Departments for current selected Ministry
        const departmentOptions = minSelected ? getDepartmentList(govType, authState.ministry) : [];

        // 3. Fetch Cascaded Designations for current selected Department
        const designationOptions = deptSelected ? getDesignationList(govType, authState.ministry, authState.department) : [];

        return `
        <form id="regStep1Form" onsubmit="event.preventDefault(); handleStep1Submit();" class="space-y-2.5">
            
            <div id="step1ErrorNotice" class="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-shake ${authState.step1Error ? '' : 'hidden'}">
                <i class="fa-solid fa-circle-exclamation text-sm text-red-600 flex-shrink-0"></i>
                <span id="step1ErrorText" class="font-semibold">${authState.step1Error || ''}</span>
            </div>

            <!-- 1. Full Name -->
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700">1. Full Name <span class="text-red-500">*</span></label>
                <input id="regFullName" type="text" required value="${authState.name}" oninput="handleNameChange(this.value)" placeholder="Enter your full official name" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600">
            </div>

            <!-- 2. Administration Type (Center vs State) -->
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700">2. Administration Type <span class="text-red-500">*</span></label>
                <div class="grid grid-cols-2 gap-2">
                    <button type="button" onclick="setGovType('central')" id="btnGovCentral" class="py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${govType === 'central' ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600 shadow-xs' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}">
                        <i class="fa-solid fa-building-columns text-xs"></i>
                        <span>Central Government</span>
                    </button>
                    <button type="button" onclick="setGovType('state')" id="btnGovState" class="py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${govType === 'state' ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600 shadow-xs' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}">
                        <i class="fa-solid fa-landmark-flag text-xs"></i>
                        <span>State / UT Government</span>
                    </button>
                </div>
            </div>

            <!-- 3. Ministry / State (Select FIRST) -->
            <div class="space-y-1">
                <label id="ministryLabel" class="block text-xs font-bold text-slate-700">
                    3. ${govType === 'central' ? 'Ministry / Central Entity' : 'State / UT Administration'} <span class="text-red-500">*</span>
                </label>
                <select id="regMinistrySelect" required onchange="handleMinistryChange(this.value)" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer">
                    <option value="">${govType === 'central' ? '-- Select Ministry or Department --' : '-- Select State / UT --'}</option>
                    ${ministryOptions.map(m => `
                        <option value="${m}" ${authState.ministry === m ? 'selected' : ''}>${m}</option>
                    `).join('')}
                </select>
            </div>

            <!-- 4. Department / Division (LOCKED until Ministry is selected) -->
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700">4. Department / Division <span class="text-red-500">*</span></label>
                <select id="regDepartmentSelect" required ${!minSelected ? 'disabled' : ''} onchange="handleDepartmentChange(this.value)" class="w-full px-3 py-2 ${minSelected ? 'bg-white border-slate-300 text-slate-800 cursor-pointer' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'} rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <option value="">${minSelected ? '-- Select Department / Division --' : '-- Select Ministry first --'}</option>
                    ${departmentOptions.map(d => `
                        <option value="${d}" ${authState.department === d ? 'selected' : ''}>${d}</option>
                    `).join('')}
                </select>
            </div>

            <!-- 5. Framework Cadre Role Grade & Official Designation -->
            <div class="space-y-1">
                <div class="flex items-center justify-between">
                    <label class="block text-xs font-bold text-slate-700">5. Cadre Role Grade & Designation <span class="text-red-500">*</span></label>
                    ${deptSelected ? `<span class="text-[10px] text-blue-700 font-extrabold bg-blue-50 px-2 py-0.5 rounded border border-blue-200"><i class="fa-solid fa-layer-group text-blue-600"></i> Framework R1–R6 Ladder</span>` : ''}
                </div>
                <select id="regDesignationSelect" required ${!deptSelected ? 'disabled' : ''} onchange="handleDesignationChange(this.value, this)" class="w-full px-3 py-2 ${deptSelected ? 'bg-white border-slate-300 text-slate-800 cursor-pointer' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'} rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <option value="">${deptSelected ? '-- Select Official Role Grade (R1–R6) --' : '-- Select Department first --'}</option>
                    ${designationOptions.map(des => {
                        const val = typeof des === 'object' ? (des.title || des.name) : des;
                        const grade = typeof des === 'object' ? (des.grade || 'R3') : 'R3';
                        const tier = typeof des === 'object' ? (des.tier || 'Junior') : 'Junior';
                        const exp = typeof des === 'object' ? (des.exp || '3–7 Yrs') : '';
                        const sector = typeof des === 'object' ? (des.sectorTag || 'Official Statistics') : 'Official Statistics';
                        const d6 = typeof des === 'object' ? (des.d6Competencies || []).join(', ') : '';
                        const isSelected = authState.designation === val || (typeof des === 'object' && des.fullTitle === authState.designation);
                        const display = typeof des === 'object' ? `${des.grade} — ${des.title} [${des.tier} Cadre: ${exp}]` : des;
                        return `<option value="${val}" data-grade="${grade}" data-tier="${tier}" data-sector="${sector}" data-d6="${d6}" ${isSelected ? 'selected' : ''}>${display}</option>`;
                    }).join('')}
                </select>
            </div>

            <!-- Framework Role & Competencies Preview Card -->
            ${(deptSelected && authState.designation) ? `
                <div id="frameworkCadrePreview" class="p-2.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200 rounded-xl text-xs space-y-1.5 animate-fadeIn shadow-xs">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-blue-900 flex items-center gap-1.5">
                            <i class="fa-solid fa-layer-group text-blue-600"></i>
                            Role Grade: <span class="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-extrabold uppercase">${authState.roleGrade || 'R3'}</span>
                        </span>
                        <span class="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                            Sector: <b class="text-blue-700">${authState.sectorTag || 'Official Statistics'}</b>
                        </span>
                    </div>
                    <div class="text-[11px] text-slate-600">
                        <span class="font-semibold text-slate-700">D6 Sectoral Competencies:</span>
                        <div class="flex flex-wrap gap-1 mt-1">
                            ${(authState.d6Competencies ? authState.d6Competencies.split(', ') : ['General Statistical Methodology', 'Data Quality Validation']).map(c => `
                                <span class="px-2 py-0.5 bg-white border border-blue-200 text-blue-800 rounded-md text-[10px] font-semibold">${c}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            ` : ''}

            <!-- 6. Official 10-Digit Mobile Number -->
            <div class="space-y-1 pt-0.5">
                <div class="flex items-center justify-between">
                    <label class="block text-xs font-bold text-slate-700">
                        6. Official Mobile Number <span class="text-red-500">*</span>
                    </label>
                    <span id="mobileCountBadge" class="text-[10px] font-semibold ${(authState.mobile || '').length === 10 ? 'text-emerald-600 font-bold' : 'text-slate-400'}">${(authState.mobile || '').length}/10 digits</span>
                </div>
                <div class="flex items-center">
                    <span class="inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-700 font-bold text-xs">
                        🇮🇳 +91
                    </span>
                    <input id="regOfficialMobile" type="tel" maxLength="10" required ${!contactUnlocked ? 'disabled' : ''} value="${authState.mobile}" oninput="handleMobileChange(this.value)" placeholder="${contactUnlocked ? 'Enter 10-digit mobile number (e.g. 9876543210)' : 'Fill all fields above to enter mobile'}" class="w-full px-3 py-2 ${contactUnlocked ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'} border rounded-r-lg text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600">
                </div>
                <div id="step1MobileError" class="text-[11px] text-red-600 font-semibold flex items-center gap-1 mt-1 hidden">
                    <i class="fa-solid fa-circle-exclamation text-xs"></i> Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)
                </div>
            </div>

            <!-- 7. Official Email Address (Optional Secondary Identifier) -->
            <div class="space-y-1 pt-0.5">
                <label class="block text-xs font-bold text-slate-700">
                    7. Official Email Address (Optional)
                </label>
                <input id="regOfficialEmail" type="email" ${!contactUnlocked ? 'disabled' : ''} value="${authState.email}" oninput="handleEmailChange(this.value)" placeholder="${contactUnlocked ? 'e.g. officer@nic.in or yourname@gmail.com' : 'Fill all fields above to enter email'}" class="w-full px-3 py-2 ${contactUnlocked ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'} border rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600">
                <div id="step1EmailError" class="text-[11px] text-red-600 font-semibold flex items-center gap-1 mt-1 hidden">
                    <i class="fa-solid fa-circle-exclamation text-xs"></i> Please enter a valid email format
                </div>
            </div>

            <!-- 8. Send OTP Button (LOCKED until 10-digit mobile is valid) -->
            <div class="pt-1.5">
                <button type="button" onclick="handleStep1Submit()" id="sendOtpBtn" ${!canSendOtp ? 'disabled' : ''} class="w-full py-2.5 ${canSendOtp ? 'bg-[#0077d6] hover:bg-[#0066cc] cursor-pointer shadow-sm' : 'bg-slate-300 cursor-not-allowed'} text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-2">
                    <span id="sendOtpBtnText">${authState.isSendingOtp ? '<i class="fa-solid fa-circle-notch fa-spin"></i> Dispatching SMS OTP...' : 'Send OTP Code via SMS →'}</span>
                </button>
            </div>

        </form>
        `;
    }

    // -------------------------------------------------------------
    // STEP 2: OTP VERIFICATION & RETRY MECHANISM
    // -------------------------------------------------------------
    function renderStep2() {
        const isOtpFilled = (authState.otp || '').trim().length === 6;
        const canVerify = isOtpFilled && !authState.isVerifyingOtp;
        const contactTarget = authState.mobile ? `+91 ${authState.mobile}` : authState.email;

        return `
        <form id="regStep2Form" onsubmit="event.preventDefault(); handleStep2Verify();" class="space-y-4">
            
            <!-- Real-time SMS Dispatch Card -->
            <div class="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl space-y-2 shadow-2xs">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                        <i class="fa-solid fa-mobile-screen-button text-blue-600"></i>
                        <span>SMS OTP Dispatched</span>
                    </div>
                    ${authState.demoOtp ? `<span class="bg-blue-600 text-white font-mono text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs tracking-wider">CODE: ${authState.demoOtp}</span>` : ''}
                </div>
                <div class="text-[11px] text-slate-700 leading-relaxed">
                    Official 6-digit OTP code sent via SMS to <strong>${contactTarget}</strong>.
                </div>
                
                ${authState.demoOtp ? `
                <div class="pt-0.5 flex items-center gap-2">
                    <button type="button" onclick="quickFillOtp('${authState.demoOtp}')" class="text-[11px] font-bold text-blue-700 bg-white hover:bg-blue-100 border border-blue-300 px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all">
                        <i class="fa-solid fa-wand-magic-sparkles text-amber-500"></i> Auto-Fill Code (${authState.demoOtp})
                    </button>
                    <span class="text-[10px] text-slate-500 font-medium">(or enter code manually below)</span>
                </div>
                ` : ''}
            </div>

            <!-- Error Notice with Try Again Button -->
            <div id="step2ErrorNotice" class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex flex-col gap-2 animate-shake ${authState.step2Error ? '' : 'hidden'}">
                <div class="flex items-center gap-2 font-bold text-red-800">
                    <i class="fa-solid fa-circle-exclamation text-base text-red-600 flex-shrink-0"></i>
                    <span id="step2ErrorText">${authState.step2Error || 'Invalid OTP code entered. Please try again.'}</span>
                </div>
                <div class="flex items-center gap-2 pt-1 border-t border-red-100">
                    <button type="button" onclick="clearAndRetryOtp()" class="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-xs">
                        <i class="fa-solid fa-rotate-left text-xs"></i> Clear & Re-enter OTP
                    </button>
                    <span class="text-[11px] text-slate-600">Please re-enter the code and try again.</span>
                </div>
            </div>

            <!-- 6-Digit Monospace OTP Input Box -->
            <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                    <label class="block text-xs font-bold text-slate-700">Enter 6-Digit OTP Code <span class="text-red-500">*</span></label>
                    <span id="otpCharCount" class="text-[10px] font-bold ${(authState.otp || '').length === 6 ? 'text-emerald-600' : 'text-slate-400'}">${(authState.otp || '').length}/6 digits</span>
                </div>
                <input id="regEmailOtp" type="text" maxLength="6" required value="${authState.otp}" oninput="handleOtpInputChange(this.value)" placeholder="• • • • • •" class="w-full px-3.5 py-3 bg-white border ${authState.step2Error ? 'border-red-500 ring-2 ring-red-200' : 'border-blue-400'} rounded-xl text-center font-mono font-black text-2xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner">
            </div>

            <!-- Resend Timer & Actions -->
            <div class="flex items-center justify-between text-xs pt-1">
                <div id="resendTimerContainer">
                    ${authState.resendTimer > 0 ? `
                        <span id="resendTimerDisplay" class="text-slate-500 font-medium"><i class="fa-regular fa-clock"></i> Resend OTP in ${authState.resendTimer}s</span>
                    ` : `
                        <button type="button" onclick="handleResendOtp()" class="text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"><i class="fa-solid fa-rotate-right"></i> Resend OTP via SMS</button>
                    `}
                </div>
                <button type="button" onclick="goToStep(1)" class="text-slate-500 hover:text-slate-800 text-[11px] font-semibold underline cursor-pointer">Change Mobile Number</button>
            </div>

            <!-- Verify Button -->
            <div class="flex items-center justify-between pt-3">
                <button type="button" onclick="goToStep(1)" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1.5">
                    <i class="fa-solid fa-arrow-left text-xs"></i> Back
                </button>
                <button type="button" onclick="handleStep2Verify()" id="verifyOtpBtn" ${!canVerify ? 'disabled' : ''} class="px-6 py-2.5 ${canVerify ? 'bg-[#0077d6] hover:bg-[#0066cc] cursor-pointer shadow-md' : 'bg-slate-300 cursor-not-allowed'} text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-2">
                    <span id="verifyOtpBtnText">${authState.isVerifyingOtp ? '<i class="fa-solid fa-circle-notch fa-spin"></i> Verifying...' : 'Verify OTP →'}</span>
                </button>
            </div>

        </form>
        `;
    }

    // -------------------------------------------------------------
    // STEP 3: CREATE PASSWORD & CAPTCHA
    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // STEP 3: CREATE PASSWORD & CAPTCHA
    // -------------------------------------------------------------
    function renderStep3() {
        const pwd = authState.password || '';
        const cpwd = authState.confirmPassword || '';

        const lenOk = isPasswordLengthValid(pwd);
        const letterOk = hasPasswordLetter(pwd);
        const numOk = hasPasswordNumber(pwd);
        const matchOk = cpwd.length > 0 && pwd === cpwd;

        const canRegister = isStep3Valid() && !authState.isRegistering;
        const verifiedDisplay = authState.mobile ? `+91 ${authState.mobile}` : authState.email;

        return `
        <form id="regStep3Form" onsubmit="event.preventDefault(); handleStep3Register();" class="space-y-3.5">
            
            <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <i class="fa-solid fa-circle-check text-emerald-600 text-base flex-shrink-0"></i>
                <span>Mobile <strong>${verifiedDisplay}</strong> verified! Create your official account password.</span>
            </div>

            <div id="step3ErrorNotice" class="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-shake ${authState.step3Error ? '' : 'hidden'}">
                <i class="fa-solid fa-circle-exclamation text-base text-red-600 flex-shrink-0"></i>
                <span id="step3ErrorText" class="font-semibold">${authState.step3Error || ''}</span>
            </div>

            <!-- Password Field -->
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700">Create Password <span class="text-red-500">*</span></label>
                <div class="relative">
                    <input id="regPassword" type="password" required value="${pwd}" oninput="updateStep3State()" placeholder="Minimum 8 characters" class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10">
                    <button type="button" onclick="togglePasswordVisibility('regPassword', this)" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
            </div>

            <!-- Confirm Password Field -->
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700">Confirm Password <span class="text-red-500">*</span></label>
                <div class="relative">
                    <input id="regConfirmPassword" type="password" required value="${cpwd}" oninput="updateStep3State()" placeholder="Re-enter password" class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10">
                    <button type="button" onclick="togglePasswordVisibility('regConfirmPassword', this)" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
                <div id="passwordMatchError" class="text-[11px] text-red-600 font-semibold mt-1 ${cpwd && !matchOk ? '' : 'hidden'}">Passwords do not match</div>
            </div>

            <!-- Live Validation Feedback Checklist -->
            <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                <div class="font-bold text-slate-700 text-[11px]">Password Security Checklist:</div>
                <div class="grid grid-cols-1 gap-1 text-[11px]">
                    <div id="chkLen" class="flex items-center gap-2 ${lenOk ? 'text-emerald-700 font-bold' : 'text-slate-500'}">
                        <i class="fa-solid ${lenOk ? 'fa-circle-check text-emerald-600' : 'fa-circle-dot text-slate-300'}"></i>
                        <span>At least 8 characters</span>
                    </div>
                    <div id="chkLetter" class="flex items-center gap-2 ${letterOk ? 'text-emerald-700 font-bold' : 'text-slate-500'}">
                        <i class="fa-solid ${letterOk ? 'fa-circle-check text-emerald-600' : 'fa-circle-dot text-slate-300'}"></i>
                        <span>Contains at least one letter</span>
                    </div>
                    <div id="chkNum" class="flex items-center gap-2 ${numOk ? 'text-emerald-700 font-bold' : 'text-slate-500'}">
                        <i class="fa-solid ${numOk ? 'fa-circle-check text-emerald-600' : 'fa-circle-dot text-slate-300'}"></i>
                        <span>Contains at least one number</span>
                    </div>
                </div>
            </div>

            <!-- SECURITY CAPTCHA COMPONENT -->
            ${renderCaptchaComponent('register')}

            <!-- Complete Registration Button -->
            <div class="flex items-center justify-between pt-2">
                <button type="button" onclick="goToStep(2)" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer">
                    ← Back
                </button>
                <button type="submit" id="registerBtn" class="px-6 py-2.5 ${canRegister ? 'bg-[#0077d6] hover:bg-[#0066cc] cursor-pointer shadow-md' : 'bg-slate-300 cursor-pointer'} text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-2">
                    <span id="registerBtnText">${authState.isRegistering ? '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating Account...' : 'Complete Registration'}</span>
                </button>
            </div>

        </form>
        `;
    }

    // -------------------------------------------------------------
    // LIVE CASCADING STEP 1 HANDLERS
    // -------------------------------------------------------------

    window.handleNameChange = function(val) {
        authState.name = (val || '').trim();
        checkAndUnlockContact();
    };

    window.setGovType = function(type) {
        authState.govType = type;
        authState.ministry = '';
        authState.department = '';
        authState.designation = '';
        authState.mobile = '';
        authState.email = '';

        const btnCentral = document.getElementById('btnGovCentral');
        const btnState = document.getElementById('btnGovState');
        const ministryLabel = document.getElementById('ministryLabel');
        const minSelect = document.getElementById('regMinistrySelect');
        const deptSelect = document.getElementById('regDepartmentSelect');
        const desSelect = document.getElementById('regDesignationSelect');

        if (btnCentral && btnState) {
            if (type === 'central') {
                btnCentral.className = "py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600 shadow-xs";
                btnState.className = "py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer bg-white border-slate-300 text-slate-600 hover:bg-slate-50";
            } else {
                btnState.className = "py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600 shadow-xs";
                btnCentral.className = "py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer bg-white border-slate-300 text-slate-600 hover:bg-slate-50";
            }
        }

        if (ministryLabel) {
            ministryLabel.innerHTML = `3. ${type === 'central' ? 'Ministry / Central Entity' : 'State / UT Administration'} <span class="text-red-500">*</span>`;
        }

        if (minSelect) {
            let options = [];
            if (window.OrgDataService) {
                if (type === 'central') {
                    options = window.OrgDataService.getMinistries().map(m => m.name);
                } else {
                    options = window.OrgDataService.getStatesAndUTs().map(s => s.name);
                }
            }
            if (!options.length) {
                options = [
                    "Ministry of Statistics & Programme Implementation (MoSPI)",
                    "Ministry of Finance",
                    "State Directorate of Economics & Statistics (DES)"
                ];
            }
            minSelect.innerHTML = `
                <option value="">${type === 'central' ? '-- Select Ministry or Department --' : '-- Select State / UT --'}</option>
                ${options.map(o => `<option value="${o}">${o}</option>`).join('')}
            `;
        }

        // Lock Department & Designation
        if (deptSelect) {
            deptSelect.setAttribute('disabled', 'true');
            deptSelect.className = "w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed rounded-lg text-xs font-medium focus:outline-none";
            deptSelect.innerHTML = `<option value="">-- Select Ministry first --</option>`;
        }

        if (desSelect) {
            desSelect.setAttribute('disabled', 'true');
            desSelect.className = "w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed rounded-lg text-xs font-medium focus:outline-none";
            desSelect.innerHTML = `<option value="">-- Select Department first --</option>`;
        }

        checkAndUnlockContact();
    };

    // When Ministry is selected -> Unlock & Populate Department
    window.handleMinistryChange = function(val) {
        authState.ministry = (val || '').trim();
        authState.department = '';
        authState.designation = '';
        authState.mobile = '';
        authState.email = '';

        const deptSelect = document.getElementById('regDepartmentSelect');
        const desSelect = document.getElementById('regDesignationSelect');
        const minSelected = isMinistrySelected();

        if (deptSelect) {
            if (minSelected) {
                const depts = getDepartmentList(authState.govType, authState.ministry);
                deptSelect.removeAttribute('disabled');
                deptSelect.className = "w-full px-3 py-2 bg-white border border-slate-300 text-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer";
                deptSelect.innerHTML = `
                    <option value="">-- Select Department / Division --</option>
                    ${depts.map(d => `<option value="${d}">${d}</option>`).join('')}
                `;
                deptSelect.focus();
            } else {
                deptSelect.setAttribute('disabled', 'true');
                deptSelect.className = "w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed rounded-lg text-xs font-medium focus:outline-none";
                deptSelect.innerHTML = `<option value="">-- Select Ministry first --</option>`;
            }
        }

        if (desSelect) {
            desSelect.setAttribute('disabled', 'true');
            desSelect.className = "w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed rounded-lg text-xs font-medium focus:outline-none";
            desSelect.innerHTML = `<option value="">-- Select Department first --</option>`;
        }

        checkAndUnlockContact();
    };

    // When Department is selected -> Unlock & Populate Designation
    window.handleDepartmentChange = function(val) {
        authState.department = (val || '').trim();
        authState.designation = '';
        authState.mobile = '';
        authState.email = '';

        if (typeof window.getDepartmentFrameworkConfig === 'function') {
            const cfg = window.getDepartmentFrameworkConfig(authState.department);
            if (cfg) {
                authState.sectorTag = cfg.sectorTag || 'Official Statistics';
                authState.d6Competencies = (cfg.d6Competencies || []).join(', ');
            }
        }

        const previewEl = document.getElementById('frameworkCadrePreview');
        if (previewEl) previewEl.remove();

        const desSelect = document.getElementById('regDesignationSelect');
        const deptSelected = isDepartmentSelected();

        if (desSelect) {
            if (deptSelected) {
                const desigs = getDesignationList(authState.govType, authState.ministry, authState.department);
                desSelect.removeAttribute('disabled');
                desSelect.className = "w-full px-3 py-2 bg-white border border-slate-300 text-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer";
                desSelect.innerHTML = `
                    <option value="">-- Select Official Role Grade (R1–R6) --</option>
                    ${desigs.map(des => {
                        const val = typeof des === 'object' ? (des.title || des.name) : des;
                        const grade = typeof des === 'object' ? (des.grade || 'R3') : 'R3';
                        const tier = typeof des === 'object' ? (des.tier || 'Junior') : 'Junior';
                        const exp = typeof des === 'object' ? (des.exp || '3–7 Yrs') : '';
                        const sector = typeof des === 'object' ? (des.sectorTag || 'Official Statistics') : 'Official Statistics';
                        const d6 = typeof des === 'object' ? (des.d6Competencies || []).join(', ') : '';
                        const display = typeof des === 'object' ? `${des.grade} — ${des.title} [${des.tier} Cadre: ${exp}]` : des;
                        return `<option value="${val}" data-grade="${grade}" data-tier="${tier}" data-sector="${sector}" data-d6="${d6}">${display}</option>`;
                    }).join('')}
                `;
                desSelect.focus();
            } else {
                desSelect.setAttribute('disabled', 'true');
                desSelect.className = "w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed rounded-lg text-xs font-medium focus:outline-none";
                desSelect.innerHTML = `<option value="">-- Select Department first --</option>`;
            }
        }

        checkAndUnlockContact();
    };

    // When Designation is selected -> Check & Unlock Mobile & Email, and Render Framework Preview
    window.handleDesignationChange = function(val, selectEl) {
        authState.designation = (val || '').trim();

        const sel = selectEl || document.getElementById('regDesignationSelect');
        if (sel && sel.selectedIndex >= 0) {
            const opt = sel.options[sel.selectedIndex];
            if (opt) {
                authState.roleGrade = opt.getAttribute('data-grade') || 'R3';
                authState.sectorTag = opt.getAttribute('data-sector') || 'Official Statistics';
                authState.d6Competencies = opt.getAttribute('data-d6') || '';
            }
        }

        if (!authState.sectorTag || authState.sectorTag === 'Official Statistics') {
            if (typeof window.getDepartmentFrameworkConfig === 'function') {
                const cfg = window.getDepartmentFrameworkConfig(authState.department);
                if (cfg) {
                    authState.sectorTag = cfg.sectorTag || 'Official Statistics';
                    authState.d6Competencies = (cfg.d6Competencies || []).join(', ');
                }
            }
        }

        // Dynamically update or mount framework preview card below designation
        let previewEl = document.getElementById('frameworkCadrePreview');
        if (previewEl) previewEl.remove();

        if (authState.designation && authState.department && sel) {
            const desigContainer = sel.closest('.space-y-1');
            if (desigContainer) {
                const d6List = authState.d6Competencies ? authState.d6Competencies.split(', ') : ['General Statistical Methodology', 'Data Quality Validation'];
                const card = document.createElement('div');
                card.id = 'frameworkCadrePreview';
                card.className = 'p-2.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200 rounded-xl text-xs space-y-1.5 animate-fadeIn shadow-xs mt-1.5';
                card.innerHTML = `
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-blue-900 flex items-center gap-1.5">
                            <i class="fa-solid fa-layer-group text-blue-600"></i>
                            Role Grade: <span class="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-extrabold uppercase">${authState.roleGrade || 'R3'}</span>
                        </span>
                        <span class="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                            Sector: <b class="text-blue-700">${authState.sectorTag || 'Official Statistics'}</b>
                        </span>
                    </div>
                    <div class="text-[11px] text-slate-600">
                        <span class="font-semibold text-slate-700">D6 Sectoral Competencies:</span>
                        <div class="flex flex-wrap gap-1 mt-1">
                            ${d6List.map(c => `
                                <span class="px-2 py-0.5 bg-white border border-blue-200 text-blue-800 rounded-md text-[10px] font-semibold">${c}</span>
                            `).join('')}
                        </div>
                    </div>
                `;
                desigContainer.after(card);
            }
        }

        checkAndUnlockContact();
    };

    window.checkAndUnlockContact = function() {
        const contactUnlocked = isAllPriorFilled();
        const mobileInput = document.getElementById('regOfficialMobile');
        const emailInput = document.getElementById('regOfficialEmail');
        const sendOtpBtn = document.getElementById('sendOtpBtn');
        const errNotice = document.getElementById('step1ErrorNotice');

        if (errNotice) errNotice.classList.add('hidden');

        if (mobileInput) {
            if (contactUnlocked) {
                mobileInput.removeAttribute('disabled');
                mobileInput.className = "w-full px-3 py-2 bg-white border border-slate-300 text-slate-800 rounded-r-lg text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600";
            } else {
                mobileInput.value = '';
                authState.mobile = '';
                mobileInput.setAttribute('disabled', 'true');
                mobileInput.className = "w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed rounded-r-lg text-xs font-mono font-bold focus:outline-none";
            }
        }

        if (emailInput) {
            if (contactUnlocked) {
                emailInput.removeAttribute('disabled');
                emailInput.className = "w-full px-3 py-2 bg-white border border-slate-300 text-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600";
            } else {
                emailInput.value = '';
                authState.email = '';
                emailInput.setAttribute('disabled', 'true');
                emailInput.className = "w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed rounded-lg text-xs font-medium focus:outline-none";
            }
        }

        const canSend = isStep1Valid() && !authState.isSendingOtp;
        if (sendOtpBtn) {
            if (canSend) {
                sendOtpBtn.removeAttribute('disabled');
                sendOtpBtn.className = "w-full py-2.5 bg-[#0077d6] hover:bg-[#0066cc] text-white font-bold rounded-lg text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2";
            } else {
                sendOtpBtn.setAttribute('disabled', 'true');
                sendOtpBtn.className = "w-full py-2.5 bg-slate-300 text-white font-bold rounded-lg text-xs shadow-none transition-all cursor-not-allowed flex items-center justify-center gap-2";
            }
        }
    };

    window.handleMobileChange = function(val) {
        const clean = (val || '').replace(/\D/g, '').slice(0, 10);
        authState.mobile = clean;
        const mobileInput = document.getElementById('regOfficialMobile');
        if (mobileInput && mobileInput.value !== clean) {
            mobileInput.value = clean;
        }

        const badge = document.getElementById('mobileCountBadge');
        if (badge) {
            badge.textContent = `${clean.length}/10 digits`;
            badge.className = clean.length === 10 ? "text-[10px] font-bold text-emerald-600" : "text-[10px] font-semibold text-slate-400";
        }

        const mobileErr = document.getElementById('step1MobileError');
        if (mobileErr) {
            if (clean.length > 0 && (clean.length < 10 || !/^[6-9]/.test(clean))) {
                mobileErr.classList.remove('hidden');
                if (!/^[6-9]/.test(clean)) {
                    mobileErr.innerHTML = '<i class="fa-solid fa-circle-exclamation text-xs"></i> Mobile number must start with 6, 7, 8, or 9';
                } else {
                    mobileErr.innerHTML = '<i class="fa-solid fa-circle-exclamation text-xs"></i> Please enter all 10 digits';
                }
            } else {
                mobileErr.classList.add('hidden');
            }
        }

        checkAndUnlockContact();
    };

    window.handleEmailChange = function(val) {
        authState.email = (val || '').trim();
        const emailErrEl = document.getElementById('step1EmailError');

        if (emailErrEl) {
            if (authState.email.length > 0 && !isValidEmail(authState.email)) {
                emailErrEl.classList.remove('hidden');
            } else {
                emailErrEl.classList.add('hidden');
            }
        }

        checkAndUnlockContact();
    };

    window.quickFillOtp = function(code) {
        const otpEl = document.getElementById('regEmailOtp');
        if (otpEl) {
            otpEl.value = code;
            authState.otp = code;
            authState.step2Error = null;
            const errNotice = document.getElementById('step2ErrorNotice');
            if (errNotice) errNotice.classList.add('hidden');
            otpEl.className = "w-full px-3.5 py-3 bg-white border border-blue-400 rounded-xl text-center font-mono font-black text-2xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner";
            updateStep2State();
        }
    };

    window.clearAndRetryOtp = function() {
        authState.otp = '';
        authState.step2Error = null;
        const otpEl = document.getElementById('regEmailOtp');
        if (otpEl) {
            otpEl.value = '';
            otpEl.className = "w-full px-3.5 py-3 bg-white border border-blue-400 rounded-xl text-center font-mono font-black text-2xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner";
            otpEl.focus();
        }
        const errNotice = document.getElementById('step2ErrorNotice');
        if (errNotice) errNotice.classList.add('hidden');
        updateStep2State();
    };

    window.handleOtpInputChange = function(val) {
        const clean = (val || '').replace(/\D/g, '').slice(0, 6);
        authState.otp = clean;
        const otpEl = document.getElementById('regEmailOtp');
        if (otpEl && otpEl.value !== clean) {
            otpEl.value = clean;
        }

        const countEl = document.getElementById('otpCharCount');
        if (countEl) {
            countEl.textContent = `${clean.length}/6 digits`;
            countEl.className = clean.length === 6 ? "text-[10px] font-bold text-emerald-600" : "text-[10px] font-bold text-slate-400";
        }

        if (authState.step2Error) {
            authState.step2Error = null;
            const errNotice = document.getElementById('step2ErrorNotice');
            if (errNotice) errNotice.classList.add('hidden');
            if (otpEl) {
                otpEl.className = "w-full px-3.5 py-3 bg-white border border-blue-400 rounded-xl text-center font-mono font-black text-2xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner";
            }
        }

        updateStep2State();
    };

    window.updateStep2State = function() {
        const otpEl = document.getElementById('regEmailOtp');
        const btn = document.getElementById('verifyOtpBtn');
        if (!otpEl || !btn) return;

        let otp = (authState.otp || '').replace(/\D/g, '').slice(0, 6);

        if (otp.length === 6 && !authState.isVerifyingOtp) {
            btn.removeAttribute('disabled');
            btn.className = "px-6 py-2.5 bg-[#0077d6] hover:bg-[#0066cc] text-white font-bold rounded-lg text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2";
        } else {
            btn.setAttribute('disabled', 'true');
            btn.className = "px-6 py-2.5 bg-slate-300 text-white font-bold rounded-lg text-xs shadow-md transition-all cursor-not-allowed flex items-center justify-center gap-2";
        }
    };

    window.updateStep3State = function() {
        const pwdEl = document.getElementById('regPassword');
        const cpwdEl = document.getElementById('regConfirmPassword');
        const btn = document.getElementById('registerBtn');
        const matchErr = document.getElementById('passwordMatchError');

        const pwd = pwdEl ? pwdEl.value : '';
        const cpwd = cpwdEl ? cpwdEl.value : '';

        authState.password = pwd;
        authState.confirmPassword = cpwd;

        const lenOk = isPasswordLengthValid(pwd);
        const letterOk = hasPasswordLetter(pwd);
        const numOk = hasPasswordNumber(pwd);
        const matchOk = cpwd.length > 0 && pwd === cpwd;

        const chkLen = document.getElementById('chkLen');
        const chkLetter = document.getElementById('chkLetter');
        const chkNum = document.getElementById('chkNum');

        if (chkLen) {
            chkLen.className = lenOk ? 'flex items-center gap-2 text-emerald-700 font-bold' : 'flex items-center gap-2 text-slate-500';
            chkLen.querySelector('i').className = lenOk ? 'fa-solid fa-circle-check text-emerald-600' : 'fa-solid fa-circle-dot text-slate-300';
        }
        if (chkLetter) {
            chkLetter.className = letterOk ? 'flex items-center gap-2 text-emerald-700 font-bold' : 'flex items-center gap-2 text-slate-500';
            chkLetter.querySelector('i').className = letterOk ? 'fa-solid fa-circle-check text-emerald-600' : 'fa-solid fa-circle-dot text-slate-300';
        }
        if (chkNum) {
            chkNum.className = numOk ? 'flex items-center gap-2 text-emerald-700 font-bold' : 'flex items-center gap-2 text-slate-500';
            chkNum.querySelector('i').className = numOk ? 'fa-solid fa-circle-check text-emerald-600' : 'fa-solid fa-circle-dot text-slate-300';
        }

        if (matchErr) {
            if (cpwd.length > 0 && !matchOk) matchErr.classList.remove('hidden');
            else matchErr.classList.add('hidden');
        }

        if (btn) {
            if (lenOk && letterOk && numOk && matchOk && isRobotChecked && !authState.isRegistering) {
                btn.removeAttribute('disabled');
                btn.className = "px-6 py-2.5 bg-[#0077d6] hover:bg-[#0066cc] text-white font-bold rounded-lg text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2";
            } else {
                btn.className = "px-6 py-2.5 bg-[#0077d6] hover:bg-[#0066cc] text-white font-bold rounded-lg text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2";
            }
        }
    };

    // -------------------------------------------------------------
    // LOGIN FORM HANDLERS (OTP + 2FA)
    // -------------------------------------------------------------

    window.setLoginMode = function(mode) {
        authState.loginMode = mode;
        authState.loginError = null;
        authState.loginStep2Error = null;
        authState.loginEmail = '';
        authState.loginPassword = '';
        authState.loginOtp = '';
        currentCaptchaCode = generateCaptchaCode();
        isRobotChecked = false;
        if (window.store) window.store.notify();
    };

    window.handleLoginMobileChange = function(val) {
        const clean = (val || '').replace(/\D/g, '').slice(0, 10);
        authState.loginEmail = clean;
        const input = document.getElementById('loginEmail');
        if (input && input.value !== clean) input.value = clean;

        const badge = document.getElementById('loginMobileCountBadge');
        if (badge) {
            badge.textContent = `${clean.length}/10 digits`;
            badge.className = clean.length === 10 ? "text-[10px] font-bold text-emerald-600" : "text-[10px] font-semibold text-slate-400";
        }
        updateLoginState();
    };

    window.goToLoginStep = function(step) {
        authState.loginStep = step;
        authState.loginError = null;
        authState.loginStep2Error = null;
        if (step === 1) {
            currentCaptchaCode = generateCaptchaCode();
            isRobotChecked = false;
        }
        if (window.store) window.store.notify();
    };

    window.quickFillLoginOtp = function(code) {
        const otpEl = document.getElementById('loginOtpInput');
        if (otpEl) {
            otpEl.value = code;
            authState.loginOtp = code;
            authState.loginStep2Error = null;
            const errNotice = document.getElementById('loginStep2ErrorNotice');
            if (errNotice) errNotice.classList.add('hidden');
            otpEl.className = "w-full px-3.5 py-3 bg-white border border-blue-400 rounded-xl text-center font-mono font-black text-2xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner";
            updateLoginStep2State();
        }
    };

    window.clearAndRetryLoginOtp = function() {
        authState.loginOtp = '';
        authState.loginStep2Error = null;
        const otpEl = document.getElementById('loginOtpInput');
        if (otpEl) {
            otpEl.value = '';
            otpEl.className = "w-full px-3.5 py-3 bg-white border border-blue-400 rounded-xl text-center font-mono font-black text-2xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner";
            otpEl.focus();
        }
        const errNotice = document.getElementById('loginStep2ErrorNotice');
        if (errNotice) errNotice.classList.add('hidden');
        updateLoginStep2State();
    };

    window.handleLoginOtpInputChange = function(val) {
        const clean = (val || '').replace(/\D/g, '').slice(0, 6);
        authState.loginOtp = clean;
        const otpEl = document.getElementById('loginOtpInput');
        if (otpEl && otpEl.value !== clean) otpEl.value = clean;

        const countEl = document.getElementById('loginOtpCharCount');
        if (countEl) {
            countEl.textContent = `${clean.length}/6 digits`;
            countEl.className = clean.length === 6 ? "text-[10px] font-bold text-emerald-600" : "text-[10px] font-bold text-slate-400";
        }

        if (authState.loginStep2Error) {
            authState.loginStep2Error = null;
            const errNotice = document.getElementById('loginStep2ErrorNotice');
            if (errNotice) errNotice.classList.add('hidden');
            if (otpEl) {
                otpEl.className = "w-full px-3.5 py-3 bg-white border border-blue-400 rounded-xl text-center font-mono font-black text-2xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner";
            }
        }

        updateLoginStep2State();
    };

    function updateLoginStep2State() {
        const otpEl = document.getElementById('loginOtpInput');
        const btn = document.getElementById('loginVerifyBtn');
        if (!otpEl || !btn) return;

        let otp = (authState.loginOtp || '').replace(/\D/g, '').slice(0, 6);
        if (otp.length === 6 && !authState.isVerifyingLoginOtp) {
            btn.removeAttribute('disabled');
            btn.className = "px-6 py-2.5 bg-[#0077d6] hover:bg-[#0066cc] text-white font-bold rounded-lg text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2";
        } else {
            btn.setAttribute('disabled', 'true');
            btn.className = "px-6 py-2.5 bg-slate-300 text-white font-bold rounded-lg text-xs shadow-md transition-all cursor-not-allowed flex items-center justify-center gap-2";
        }
    }

    window.updateLoginState = function() {
        const emailEl = document.getElementById('loginEmail');
        const pwdEl = document.getElementById('loginPassword');
        const btn = document.getElementById('loginSubmitBtn');

        const email = emailEl ? emailEl.value.trim() : '';
        const pwd = pwdEl ? pwdEl.value : '';

        authState.loginEmail = email;
        authState.loginPassword = pwd;

        const isOtpMode = authState.loginMode === 'otp';
        const isMobileValid = isValidMobile(email);
        const canSubmit = (isOtpMode ? isMobileValid : (email !== '' && pwd !== '')) && isRobotChecked && !authState.isSendingLoginOtp;

        if (btn) {
            if (canSubmit) {
                btn.className = "w-full py-2.5 bg-[#0077d6] hover:bg-[#0066cc] text-white font-bold rounded-lg text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2";
            } else {
                btn.className = "w-full py-2.5 bg-slate-300 text-white font-bold rounded-lg text-sm shadow transition-all cursor-pointer flex items-center justify-center gap-2";
            }
        }
    };

    window.goToStep = function(targetStep) {
        if (targetStep === 3) {
            currentCaptchaCode = generateCaptchaCode();
            isRobotChecked = false;
        }
        authState.step = targetStep;
        if (window.store) window.store.notify();
    };

    // -------------------------------------------------------------
    // API ACTIONS & SUBMISSIONS
    // -------------------------------------------------------------

    // Step 1: Send Registration OTP Submit Handler
    window.handleStep1Submit = function() {
        const nameInput = document.getElementById('regFullName');
        const minSelect = document.getElementById('regMinistrySelect');
        const deptSelect = document.getElementById('regDepartmentSelect');
        const desSelect = document.getElementById('regDesignationSelect');
        const mobileInput = document.getElementById('regOfficialMobile');
        const emailInput = document.getElementById('regOfficialEmail');

        authState.name = nameInput ? nameInput.value.trim() : authState.name;
        authState.ministry = minSelect ? minSelect.value.trim() : authState.ministry;
        authState.department = deptSelect ? deptSelect.value.trim() : authState.department;
        authState.designation = desSelect ? desSelect.value.trim() : authState.designation;
        authState.mobile = mobileInput ? mobileInput.value.replace(/\D/g, '').slice(0, 10) : authState.mobile;
        authState.email = emailInput ? emailInput.value.trim() : authState.email;

        const isPriorValid = isAllPriorFilled();
        const isMobileValid = isValidMobile(authState.mobile);

        if (!isPriorValid || !isMobileValid) {
            const errNotice = document.getElementById('step1ErrorNotice');
            const errText = document.getElementById('step1ErrorText');

            let msg = "";
            if (!isNameFilled()) {
                msg = "Please enter your Full Name.";
            } else if (!isMinistrySelected()) {
                msg = "Please select your Ministry or State/UT Administration.";
            } else if (!isDepartmentSelected()) {
                msg = "Please select your Department / Division.";
            } else if (!isDesignationSelected()) {
                msg = "Please select your Official Designation.";
            } else if (!isMobileValid) {
                msg = "Please enter a valid 10-digit Indian Mobile Number (e.g. 9876543210).";
            }

            if (errText) errText.textContent = msg;
            if (errNotice) errNotice.classList.remove('hidden');
            return;
        }

        authState.isSendingOtp = true;
        const btnText = document.getElementById('sendOtpBtnText');
        if (btnText) btnText.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Dispatching SMS OTP...';
        checkAndUnlockContact();

        fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mobile: authState.mobile,
                email: authState.email,
                ministry: authState.ministry
            })
        })
        .then(res => res.json())
        .then(data => {
            authState.isSendingOtp = false;
            if (data.success) {
                authState.demoOtp = data.otp || '';
                authState.step = 2;
                authState.step2Error = null;
                authState.otp = '';
                if (window.store) window.store.notify();
                startResendTimer();
            } else {
                const errNotice = document.getElementById('step1ErrorNotice');
                const errText = document.getElementById('step1ErrorText');
                if (errText) {
                    if (data.alreadyRegistered || (data.error && data.error.toLowerCase().includes('already registered'))) {
                        errText.innerHTML = `
                            <div class="space-y-1.5 py-0.5">
                                <div class="font-bold text-red-700">${data.error}</div>
                                <button type="button" onclick="switchToLoginWithIdentifier('${authState.mobile || authState.email}')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-sm">
                                    <i class="fa-solid fa-arrow-right-to-bracket"></i> Switch to Login with this Number →
                                </button>
                            </div>
                        `;
                    } else {
                        errText.textContent = data.error || "Failed to send OTP. Please try again.";
                    }
                }
                if (errNotice) errNotice.classList.remove('hidden');
                checkAndUnlockContact();
            }
        })
        .catch(err => {
            authState.isSendingOtp = false;
            const errNotice = document.getElementById('step1ErrorNotice');
            const errText = document.getElementById('step1ErrorText');
            if (errText) errText.textContent = "Network error connecting to backend server.";
            if (errNotice) errNotice.classList.remove('hidden');
            checkAndUnlockContact();
        });
    };

    window.switchToLoginWithIdentifier = function(val) {
        if (window.store) {
            window.store.state.authModalTab = 'login';
            window.store.notify();
        }
        setTimeout(() => {
            const loginEmailInput = document.getElementById('loginEmail');
            if (loginEmailInput) {
                loginEmailInput.value = val;
                authState.loginEmail = val;
            }
            const loginPwd = document.getElementById('loginPassword');
            if (loginPwd) loginPwd.focus();
            if (typeof window.refreshCaptcha === 'function') window.refreshCaptcha();
        }, 50);
    };

    window.handleResendOtp = function() {
        if (authState.resendTimer > 0) return;
        const otpInput = document.getElementById('regEmailOtp');
        if (otpInput) otpInput.value = '';
        authState.otp = '';
        authState.step2Error = null;
        handleStep1Submit();
    };

    // Step 2: Verify Registration OTP
    window.handleStep2Verify = function() {
        if (authState.otp.length !== 6) {
            const errNotice = document.getElementById('step2ErrorNotice');
            const errText = document.getElementById('step2ErrorText');
            if (errText) errText.textContent = "Please enter all 6 digits of the OTP code.";
            if (errNotice) errNotice.classList.remove('hidden');
            return;
        }

        authState.isVerifyingOtp = true;
        const btnText = document.getElementById('verifyOtpBtnText');
        if (btnText) btnText.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Verifying...';
        updateStep2State();

        const identifier = authState.mobile || authState.email;

        fetch('/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: identifier, mobile: authState.mobile, email: authState.email, otp: authState.otp })
        })
        .then(res => res.json())
        .then(data => {
            authState.isVerifyingOtp = false;
            if (data.success) {
                authState.step2Error = null;
                currentCaptchaCode = generateCaptchaCode();
                isRobotChecked = false;
                authState.step = 3;
                if (window.store) window.store.notify();
            } else {
                authState.step2Error = data.error || "Invalid OTP code entered. Please try again.";
                const errNotice = document.getElementById('step2ErrorNotice');
                const errText = document.getElementById('step2ErrorText');
                if (errText) errText.textContent = authState.step2Error;
                if (errNotice) errNotice.classList.remove('hidden');

                const otpInput = document.getElementById('regEmailOtp');
                if (otpInput) {
                    otpInput.className = "w-full px-3.5 py-3 bg-red-50 border-2 border-red-500 rounded-xl text-center font-mono font-black text-2xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-red-600 shadow-inner animate-shake";
                    otpInput.focus();
                }
                updateStep2State();
            }
        })
        .catch(err => {
            authState.isVerifyingOtp = false;
            authState.step2Error = "Network error verifying OTP code.";
            const errNotice = document.getElementById('step2ErrorNotice');
            const errText = document.getElementById('step2ErrorText');
            if (errText) errText.textContent = authState.step2Error;
            if (errNotice) errNotice.classList.remove('hidden');
            updateStep2State();
        });
    };

    // Step 3: Complete Registration
    window.handleStep3Register = function() {
        const pwdEl = document.getElementById('regPassword');
        const cpwdEl = document.getElementById('regConfirmPassword');
        const regErr = document.getElementById('registerCaptchaError');

        authState.password = pwdEl ? pwdEl.value : authState.password;
        authState.confirmPassword = cpwdEl ? cpwdEl.value : authState.confirmPassword;

        if (!isRobotChecked) {
            if (regErr) regErr.classList.remove('hidden');
            const errNotice = document.getElementById('step3ErrorNotice');
            const errText = document.getElementById('step3ErrorText');
            if (errText) errText.textContent = "Please enter the characters shown in the CAPTCHA box.";
            if (errNotice) errNotice.classList.remove('hidden');
            return;
        }

        if (!isStep3Valid()) {
            const errNotice = document.getElementById('step3ErrorNotice');
            const errText = document.getElementById('step3ErrorText');
            if (errText) errText.textContent = "Please satisfy all password security rules.";
            if (errNotice) errNotice.classList.remove('hidden');
            return;
        }

        authState.isRegistering = true;
        const btnText = document.getElementById('registerBtnText');
        if (btnText) btnText.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating Account...';
        updateStep3State();

        const officialEmail = authState.email || `${authState.mobile}@nic.gov.in`;

        const cleanDesig = (typeof authState.designation === 'object' && authState.designation)
            ? (authState.designation.title || authState.designation.name || 'Senior Statistical Officer (SSO)')
            : (String(authState.designation || '').trim() === '[object Object]' || !authState.designation ? 'Senior Statistical Officer (SSO)' : String(authState.designation).trim());

        fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: authState.name,
                mobile: authState.mobile,
                email: officialEmail,
                gov_type: authState.govType === 'central' ? 'Central Government' : 'State / UT Government',
                ministry: authState.ministry,
                department: authState.department,
                designation: cleanDesig,
                role_grade: authState.roleGrade || 'R3',
                sector_tag: authState.sectorTag || 'Official Statistics',
                d6_competencies: authState.d6Competencies || '',
                password: authState.password
            })
        })
        .then(res => res.json())
        .then(data => {
            authState.isRegistering = false;
            if (data.success && data.user) {
                if (window.store) {
                    const target = window.store.state.pendingRedirectView || 'learner-dash';
                    window.store.state.pendingRedirectView = null;
                    window.store.state.user = data.user;
                    window.store.state.currentUser = data.user;
                    window.store.state.isAuthModalOpen = false;
                    resetAuthState();
                    window.store.navigate(target);
                }
            } else {
                const errNotice = document.getElementById('step3ErrorNotice');
                const errText = document.getElementById('step3ErrorText');
                if (errText) {
                    if (data.error && data.error.toLowerCase().includes('already registered')) {
                        errText.innerHTML = `
                            <div class="space-y-1.5 py-0.5">
                                <div class="font-bold text-red-700">${data.error}</div>
                                <button type="button" onclick="switchToLoginWithIdentifier('${authState.mobile || authState.email}')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-sm">
                                    <i class="fa-solid fa-arrow-right-to-bracket"></i> Log In Now →
                                </button>
                            </div>
                        `;
                    } else {
                        errText.textContent = data.error || "Registration failed. Please try again.";
                    }
                }
                if (errNotice) errNotice.classList.remove('hidden');
                refreshCaptcha();
                updateStep3State();
            }
        })
        .catch(err => {
            authState.isRegistering = false;
            const errNotice = document.getElementById('step3ErrorNotice');
            const errText = document.getElementById('step3ErrorText');
            if (errText) errText.textContent = "Network error registering user.";
            if (errNotice) errNotice.classList.remove('hidden');
            refreshCaptcha();
            updateStep3State();
        });
    };

    // -------------------------------------------------------------
    // LOGIN STEP 1: DISPATCH LOGIN OTP VIA SMS
    // -------------------------------------------------------------
    window.handleLoginSubmit = function() {
        const emailEl = document.getElementById('loginEmail');
        const pwdEl = document.getElementById('loginPassword');
        const loginErr = document.getElementById('loginCaptchaError');

        authState.loginEmail = emailEl ? emailEl.value.trim() : '';
        authState.loginPassword = pwdEl ? pwdEl.value : '';

        const isOtpMode = authState.loginMode === 'otp';

        if (isOtpMode) {
            if (!isValidMobile(authState.loginEmail)) {
                const errNotice = document.getElementById('loginErrorNotice');
                const errText = document.getElementById('loginErrorText');
                if (errText) errText.textContent = "Please enter a valid 10-digit Indian mobile number.";
                if (errNotice) errNotice.classList.remove('hidden');
                return;
            }
        } else {
            if (!authState.loginEmail || !authState.loginPassword) {
                const errNotice = document.getElementById('loginErrorNotice');
                const errText = document.getElementById('loginErrorText');
                if (errText) errText.textContent = "Please enter your mobile/email and password.";
                if (errNotice) errNotice.classList.remove('hidden');
                return;
            }
        }

        if (!isRobotChecked) {
            if (loginErr) loginErr.classList.remove('hidden');
            const errNotice = document.getElementById('loginErrorNotice');
            const errText = document.getElementById('loginErrorText');
            if (errText) errText.textContent = "Please enter the characters shown in the CAPTCHA box.";
            if (errNotice) errNotice.classList.remove('hidden');
            return;
        }

        authState.isSendingLoginOtp = true;
        const btnText = document.getElementById('loginBtnText');
        if (btnText) btnText.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Dispatching Login OTP...';
        updateLoginState();

        fetch('/api/auth/login-send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identifier: authState.loginEmail,
                password: authState.loginPassword,
                passwordless: isOtpMode
            })
        })
        .then(res => res.json())
        .then(data => {
            authState.isSendingLoginOtp = false;
            if (data.success) {
                authState.loginDemoOtp = data.otp || '';
                authState.loginMobile = data.mobile || authState.loginEmail;
                authState.loginStep = 2;
                authState.loginOtp = '';
                authState.loginStep2Error = null;
                if (window.store) window.store.notify();
                startLoginResendTimer();
            } else {
                const errNotice = document.getElementById('loginErrorNotice');
                const errText = document.getElementById('loginErrorText');
                if (errText) errText.textContent = data.error || "Login verification failed. Please try again.";
                if (errNotice) errNotice.classList.remove('hidden');
                refreshCaptcha();
                updateLoginState();
            }
        })
        .catch(err => {
            authState.isSendingLoginOtp = false;
            const errNotice = document.getElementById('loginErrorNotice');
            const errText = document.getElementById('loginErrorText');
            if (errText) errText.textContent = "Network error connecting to authentication server.";
            if (errNotice) errNotice.classList.remove('hidden');
            refreshCaptcha();
            updateLoginState();
        });
    };

    window.handleResendLoginOtp = function() {
        if (authState.loginResendTimer > 0) return;
        const otpInput = document.getElementById('loginOtpInput');
        if (otpInput) otpInput.value = '';
        authState.loginOtp = '';
        authState.loginStep2Error = null;
        handleLoginSubmit();
    };

    // -------------------------------------------------------------
    // LOGIN STEP 2: VERIFY LOGIN OTP & AUTHENTICATE
    // -------------------------------------------------------------
    window.handleLoginVerifyOtp = function() {
        if (authState.loginOtp.length !== 6) {
            const errNotice = document.getElementById('loginStep2ErrorNotice');
            const errText = document.getElementById('loginStep2ErrorText');
            if (errText) errText.textContent = "Please enter all 6 digits of the Login OTP.";
            if (errNotice) errNotice.classList.remove('hidden');
            return;
        }

        authState.isVerifyingLoginOtp = true;
        const btnText = document.getElementById('loginVerifyBtnText');
        if (btnText) btnText.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Authenticating...';
        updateLoginStep2State();

        fetch('/api/auth/login-verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identifier: authState.loginEmail,
                otp: authState.loginOtp
            })
        })
        .then(res => res.json())
        .then(data => {
            authState.isVerifyingLoginOtp = false;
            if (data.success && data.user) {
                if (window.store) {
                    const target = window.store.state.pendingRedirectView || 'learner-dash';
                    window.store.state.pendingRedirectView = null;
                    window.store.state.user = data.user;
                    window.store.state.currentUser = data.user;
                    window.store.state.isAuthModalOpen = false;
                    resetAuthState();
                    window.store.navigate(target);
                }
            } else {
                authState.loginStep2Error = data.error || "Invalid Login OTP code entered. Please try again.";
                const errNotice = document.getElementById('loginStep2ErrorNotice');
                const errText = document.getElementById('loginStep2ErrorText');
                if (errText) errText.textContent = authState.loginStep2Error;
                if (errNotice) errNotice.classList.remove('hidden');

                const otpInput = document.getElementById('loginOtpInput');
                if (otpInput) {
                    otpInput.className = "w-full px-3.5 py-3 bg-red-50 border-2 border-red-500 rounded-xl text-center font-mono font-black text-2xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-red-600 shadow-inner animate-shake";
                    otpInput.focus();
                }
                updateLoginStep2State();
            }
        })
        .catch(err => {
            authState.isVerifyingLoginOtp = false;
            authState.loginStep2Error = "Network error verifying Login OTP.";
            const errNotice = document.getElementById('loginStep2ErrorNotice');
            const errText = document.getElementById('loginStep2ErrorText');
            if (errText) errText.textContent = authState.loginStep2Error;
            if (errNotice) errNotice.classList.remove('hidden');
            updateLoginStep2State();
        });
    };

    window.togglePasswordVisibility = function(inputId, btn) {
        const input = document.getElementById(inputId);
        if (input) {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            const icon = btn.querySelector('i');
            if (icon) icon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        }
    };

    window.renderAuthModal = renderAuthModal;

})(window);
