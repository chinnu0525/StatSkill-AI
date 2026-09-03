/**
 * StatSkill AI — Master Official Statistics Administrative Hierarchy Dataset
 * 
 * Filtered specifically for the National Statistical System (NSS) of India:
 * - Top 10 High-Relevance Central Ministries producing & utilizing Official Statistics
 * - State Directorates of Economics & Statistics (DES) and District Statistical Offices across all 36 States & UTs
 * - Pure Official Statistical Cadre Designations (ISS, SSS, and State DES Statistical Officers)
 */

(function(window) {
    'use strict';

    // 1. APPROVED OFFICIAL GOVERNMENT EMAIL DOMAINS
    const APPROVED_GOVERNMENT_DOMAINS = [
        "gov.in", "nic.in", "mospi.gov.in", "niti.gov.in", "meity.gov.in",
        "finmin.nic.in", "icmr.org.in", "des.gov.in", "sansad.in",
        "ias.nic.in", "cag.gov.in", "upsc.gov.in",
        "ap.gov.in", "assam.gov.in", "bihar.gov.in", "cg.gov.in",
        "goa.gov.in", "gujarat.gov.in", "haryana.gov.in", "hp.gov.in", "jharkhand.gov.in",
        "karnataka.gov.in", "kerala.gov.in", "mp.gov.in", "maharashtra.gov.in", "manipur.gov.in",
        "meghalaya.gov.in", "mizoram.gov.in", "nagaland.gov.in", "odisha.gov.in", "pb.gov.in",
        "rajasthan.gov.in", "sikkim.gov.in", "tn.gov.in", "telangana.gov.in", "tripura.gov.in",
        "up.gov.in", "uk.gov.in", "wb.gov.in", "delhi.gov.in", "puducherry.gov.in",
        "jk.gov.in", "ladakh.gov.in", "chandigarh.gov.in", "andaman.gov.in"
    ];

    // 2. PURE OFFICIAL STATISTICAL CADRE DESIGNATIONS (ISS / SSS / State DES)
    const OFFICIAL_STATISTICAL_DESIGNATIONS = [
        { id: "desig_jso", title: "Junior Statistical Officer (JSO) — SSS Cadre", name: "Junior Statistical Officer (JSO) — SSS Cadre" },
        { id: "desig_sso", title: "Senior Statistical Officer (SSO) — SSS Cadre", name: "Senior Statistical Officer (SSO) — SSS Cadre" },
        { id: "desig_ad", title: "Assistant Director (Statistics / Data Analytics) — ISS Cadre", name: "Assistant Director (Statistics / Data Analytics) — ISS Cadre" },
        { id: "desig_dd", title: "Deputy Director (Survey Operations / National Accounts) — ISS Cadre", name: "Deputy Director (Survey Operations / National Accounts) — ISS Cadre" },
        { id: "desig_jd", title: "Joint Director (Economic Statistics / Macroeconomics) — ISS Cadre", name: "Joint Director (Economic Statistics / Macroeconomics) — ISS Cadre" },
        { id: "desig_dir", title: "Director (Survey Design / Official Statistics) — ISS Cadre", name: "Director (Survey Design / Official Statistics) — ISS Cadre" },
        { id: "desig_ddg", title: "Deputy Director General (DDG - Statistical Cadre)", name: "Deputy Director General (DDG - Statistical Cadre)" },
        { id: "desig_adg", title: "Additional Director General (ADG - Official Statistics)", name: "Additional Director General (ADG - Official Statistics)" },
        { id: "desig_dg", title: "Director General (NSO / Central Statistical System)", name: "Director General (NSO / Central Statistical System)" },
        { id: "desig_dso", title: "District Statistical Officer (DSO) — State DES", name: "District Statistical Officer (DSO) — State DES" },
        { id: "desig_aso", title: "Assistant Statistical Officer (ASO) — State Statistical Cadre", name: "Assistant Statistical Officer (ASO) — State Statistical Cadre" },
        { id: "desig_inv", title: "Statistical Investigator / Survey Field Officer (FOD)", name: "Statistical Investigator / Survey Field Officer (FOD)" }
    ];

    function makeDivisions(prefix, nameList) {
        return nameList.map((item, idx) => ({
            id: `org_${prefix}_${idx + 1}`,
            name: item.name,
            code: item.code || `${prefix.toUpperCase()}-${idx + 1}`,
            designations: OFFICIAL_STATISTICAL_DESIGNATIONS
        }));
    }

    // 3. TOP 10 HIGH-RELEVANCE STATISTICAL MINISTRIES OF INDIA
    const CENTRAL_HIERARCHY = [
        {
            id: "min_mospi",
            name: "Ministry of Statistics & Programme Implementation (MoSPI)",
            code: "MOSPI",
            departments: [
                {
                    id: "dept_mospi_nso",
                    name: "National Statistical Office (NSO)",
                    organisations: makeDivisions("nso", [
                        { name: "Survey Design and Research Division (SDRD), Kolkata", code: "SDRD-KOL" },
                        { name: "Field Operations Division (FOD), New Delhi & Regional Directorates", code: "FOD-HQ" },
                        { name: "Data Processing Division (DPD), Kolkata & Data Centres", code: "DPD-KOL" },
                        { name: "National Accounts Division (NAD) — GDP & Macroeconomic Statistics", code: "NAD-DEL" },
                        { name: "Economic Statistics Division (ESD) — ASI, IIP & Business Register", code: "ESD-DEL" },
                        { name: "Price Statistics Division (PSD) — Consumer Price Index (CPI)", code: "PSD-DEL" },
                        { name: "Social Statistics Division (SSD) — SDG National Indicator Framework", code: "SSD-DEL" }
                    ])
                },
                {
                    id: "dept_mospi_nssta",
                    name: "National Statistical Systems Training Academy (NSSTA)",
                    organisations: makeDivisions("nssta", [
                        { name: "NSSTA Greater Noida (Official Statistics & Capacity Building Campus)", code: "NSSTA-GN" },
                        { name: "NSSTA E-Learning, AI Analytics & iGOT Karmayogi Wing", code: "NSSTA-E" }
                    ])
                },
                {
                    id: "dept_mospi_pi",
                    name: "Programme Implementation Wing (PI Wing)",
                    organisations: makeDivisions("pi", [
                        { name: "Twenty Point Programme (TPP) Monitoring Cell", code: "PI-TPP" },
                        { name: "Infrastructure & Project Monitoring Division (IPMD)", code: "PI-IPMD" }
                    ])
                }
            ]
        },
        {
            id: "min_finance",
            name: "Ministry of Finance",
            code: "FINMIN",
            departments: [
                {
                    id: "dept_fin_dea",
                    name: "Department of Economic Affairs",
                    organisations: makeDivisions("dea", [
                        { name: "Economic Division (Economic Survey, Macro Forecasting & Modeling)", code: "DEA-ECON" },
                        { name: "Budget Division — Fiscal & Revenue Statistics Unit", code: "DEA-BUD" }
                    ])
                },
                {
                    id: "dept_fin_rev",
                    name: "Department of Revenue (CBDT / CBIC)",
                    organisations: makeDivisions("rev", [
                        { name: "Direct Taxes Data Analytics & Tax Statistics Cell (CBDT)", code: "CBDT-STAT" },
                        { name: "GST Analytics, Trade & Indirect Tax Intelligence Wing (CBIC)", code: "CBIC-STAT" }
                    ])
                },
                {
                    id: "dept_fin_dfs",
                    name: "Department of Financial Services",
                    organisations: makeDivisions("dfs", [
                        { name: "Banking, Credit Flow & Financial Inclusion Statistics Cell", code: "DFS-STAT" }
                    ])
                }
            ]
        },
        {
            id: "min_agri",
            name: "Ministry of Agriculture & Farmers Welfare",
            code: "AGRI",
            departments: [
                {
                    id: "dept_agri_des",
                    name: "Directorate of Economics and Statistics (DES - Agriculture)",
                    organisations: makeDivisions("agrides", [
                        { name: "Crop Estimation, Advance Estimates & Agricultural Statistics Wing", code: "AGRI-CROP" },
                        { name: "Agricultural Census & Land Use Input Survey Division", code: "AGRI-CENSUS" },
                        { name: "Integrated Scheme on Agriculture Statistics (ISAS) Directorate", code: "AGRI-ISAS" },
                        { name: "Mahalanobis National Crop Forecast Centre (MNCFC) — GIS & Remote Sensing", code: "MNCFC-GIS" }
                    ])
                }
            ]
        },
        {
            id: "min_health",
            name: "Ministry of Health & Family Welfare",
            code: "MOHFW",
            departments: [
                {
                    id: "dept_health_stat",
                    name: "Statistics & Data Analytics Division",
                    organisations: makeDivisions("hstat", [
                        { name: "National Family Health Survey (NFHS) & Demographic Statistics Cell", code: "NFHS-CELL" },
                        { name: "Central Bureau of Health Intelligence (CBHI) — Vital & Health Records", code: "CBHI-STAT" },
                        { name: "Health Management Information System (HMIS) & Digital Health Analytics", code: "HMIS-STAT" }
                    ])
                }
            ]
        },
        {
            id: "min_commerce",
            name: "Ministry of Commerce & Industry",
            code: "MOCI",
            departments: [
                {
                    id: "dept_comm_dgcis",
                    name: "Directorate General of Commercial Intelligence and Statistics (DGCI&S), Kolkata",
                    organisations: makeDivisions("dgcis", [
                        { name: "Foreign Trade & Export-Import Merchandise Statistics Directorate", code: "DGCIS-FT" },
                        { name: "Inland Trade, Shipping & Commercial Data Processing Division", code: "DGCIS-INL" }
                    ])
                },
                {
                    id: "dept_comm_dpiit",
                    name: "Department for Promotion of Industry and Internal Trade (DPIIT)",
                    organisations: makeDivisions("dpiit", [
                        { name: "Wholesale Price Index (WPI) & Industrial Production Monitoring Cell", code: "DPIIT-WPI" }
                    ])
                }
            ]
        },
        {
            id: "min_labour",
            name: "Ministry of Labour & Employment",
            code: "MOLE",
            departments: [
                {
                    id: "dept_lab_bureau",
                    name: "Labour Bureau (Chandigarh / Shimla)",
                    organisations: makeDivisions("labbur", [
                        { name: "Consumer Price Index for Industrial Workers (CPI-IW) Division", code: "BUR-CPIIW" },
                        { name: "Consumer Price Index for Agricultural & Rural Labourers (CPI-AL/RL)", code: "BUR-CPIAL" },
                        { name: "Annual Employment-Unemployment Survey & Wage Statistics Cell", code: "BUR-WAGE" }
                    ])
                },
                {
                    id: "dept_lab_dge",
                    name: "Directorate General of Employment (DGE)",
                    organisations: makeDivisions("dge", [
                        { name: "National Career Service (NCS) Data & Employment Market Analytics", code: "DGE-NCS" }
                    ])
                }
            ]
        },
        {
            id: "min_consumer",
            name: "Ministry of Consumer Affairs, Food & Public Distribution",
            code: "DOCA",
            departments: [
                {
                    id: "dept_ca_pmc",
                    name: "Department of Consumer Affairs — Price Monitoring Cell (PMC)",
                    organisations: makeDivisions("pmc", [
                        { name: "Essential Commodities Daily Retail & Wholesale Price Tracking Division", code: "PMC-PRICE" },
                        { name: "Market Intelligence & Commodity Buffer Stock Analytics Directorate", code: "PMC-INTEL" }
                    ])
                },
                {
                    id: "dept_ca_dfpd",
                    name: "Department of Food & Public Distribution",
                    organisations: makeDivisions("dfpd", [
                        { name: "National Food Security Act (NFSA) & PDS Data Analytics Unit", code: "DFPD-PDS" }
                    ])
                }
            ]
        },
        {
            id: "min_rural",
            name: "Ministry of Rural Development",
            code: "MORD",
            departments: [
                {
                    id: "dept_rd_stat",
                    name: "Statistics, Monitoring & Evaluation Division",
                    organisations: makeDivisions("rdstat", [
                        { name: "DISHA Monitoring & Socio-Economic Caste Census (SECC) Analytics", code: "RD-DISHA" },
                        { name: "Mahatma Gandhi NREGA Real-time MIS & Performance Analytics Wing", code: "RD-MGNREGA" },
                        { name: "PMGSY Geo-Spatial GIS & Rural Connectivity Analytics Directorate", code: "RD-PMGSY" }
                    ])
                }
            ]
        },
        {
            id: "min_jal",
            name: "Ministry of Jal Shakti",
            code: "MOJS",
            departments: [
                {
                    id: "dept_jal_census",
                    name: "Minor Irrigation Census & Water Bodies Directorate",
                    organisations: makeDivisions("jalcen", [
                        { name: "National Minor Irrigation Census & Groundwater Data Division", code: "JAL-MICEN" },
                        { name: "Census of Water Bodies & Geo-Tagging Survey Unit", code: "JAL-WBCEN" },
                        { name: "Central Water Commission (CWC) — Hydrological & Water Statistics Directorate", code: "CWC-HYDRO" }
                    ])
                }
            ]
        },
        {
            id: "min_edu",
            name: "Ministry of Education",
            code: "MOE",
            departments: [
                {
                    id: "dept_edu_stats",
                    name: "Statistics & Educational Survey Division",
                    organisations: makeDivisions("edustat", [
                        { name: "All India Survey on Higher Education (AISHE) Data Analytics Cell", code: "EDU-AISHE" },
                        { name: "Unified District Information System for Education (UDISE+) Data Directorate", code: "EDU-UDISE" },
                        { name: "Performance Grading Index (PGI) & National Achievement Survey (NAS) Unit", code: "EDU-PGI" }
                    ])
                }
            ]
        }
    ];

    // 4. ALL 36 STATES & UNION TERRITORIES (STATE DES & DISTRICT STATISTICAL OFFICES)
    const STATE_NAMES = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
        "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
        "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
        "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];

    const UT_NAMES = [
        "Andaman and Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu",
        "Delhi (NCT)", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];

    function makeStateDESHierarchy(stateName, isUT = false) {
        const code = stateName.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
        return {
            id: `state_${code.toLowerCase()}`,
            name: stateName + (isUT ? " (UT Administration)" : " Government"),
            code: code,
            isUT: isUT,
            departments: [
                {
                    id: `dept_${code.toLowerCase()}_des`,
                    name: `Directorate of Economics & Statistics (DES), ${stateName}`,
                    organisations: [
                        {
                            id: `org_${code.toLowerCase()}_sdp`,
                            name: `State Domestic Product (GSDP/DDP) & State Accounts Division`,
                            code: `${code}-GSDP`,
                            designations: OFFICIAL_STATISTICAL_DESIGNATIONS
                        },
                        {
                            id: `org_${code.toLowerCase()}_survey`,
                            name: `Socio-Economic Sample Survey & NSS State Sample Division`,
                            code: `${code}-NSS`,
                            designations: OFFICIAL_STATISTICAL_DESIGNATIONS
                        },
                        {
                            id: `org_${code.toLowerCase()}_dso`,
                            name: `District Statistical Offices (DSO Network across all Districts)`,
                            code: `${code}-DSO`,
                            designations: OFFICIAL_STATISTICAL_DESIGNATIONS
                        },
                        {
                            id: `org_${code.toLowerCase()}_sdg`,
                            name: `State SDG Indicator Framework & Evaluation Monitoring Cell`,
                            code: `${code}-SDG`,
                            designations: OFFICIAL_STATISTICAL_DESIGNATIONS
                        }
                    ]
                }
            ]
        };
    }

    const STATE_HIERARCHY = [
        ...STATE_NAMES.map(s => makeStateDESHierarchy(s, false)),
        ...UT_NAMES.map(u => makeStateDESHierarchy(u, true))
    ];

    // 5. PUBLIC MASTER SERVICE API
    const OrgDataService = {
        getMinistries() {
            return CENTRAL_HIERARCHY.map(m => ({ id: m.id, name: m.name, code: m.code }));
        },

        getStatesAndUTs() {
            return STATE_HIERARCHY.map(s => ({ id: s.id, name: s.name, code: s.code, isUT: s.isUT }));
        },

        getDepartments(govType, parentId) {
            if (!parentId) return [];
            const isCentral = (govType === "central" || govType === "Central Government");
            if (isCentral) {
                const ministry = CENTRAL_HIERARCHY.find(m => m.id === parentId || m.name === parentId);
                return ministry ? ministry.departments.map(d => ({ id: d.id, name: d.name })) : [];
            } else {
                const state = STATE_HIERARCHY.find(s => s.id === parentId || s.name === parentId);
                return state ? state.departments.map(d => ({ id: d.id, name: d.name })) : [];
            }
        },

        getOrganisations(govType, parentId, deptId) {
            if (!parentId || !deptId) return [];
            const isCentral = (govType === "central" || govType === "Central Government");
            if (isCentral) {
                const ministry = CENTRAL_HIERARCHY.find(m => m.id === parentId || m.name === parentId);
                if (!ministry) return [];
                const dept = ministry.departments.find(d => d.id === deptId || d.name === deptId);
                return dept ? dept.organisations.map(o => ({ id: o.id, name: o.name, code: o.code })) : [];
            } else {
                const state = STATE_HIERARCHY.find(s => s.id === parentId || s.name === parentId);
                if (!state) return [];
                const dept = state.departments.find(d => d.id === deptId || d.name === deptId);
                return dept ? dept.organisations.map(o => ({ id: o.id, name: o.name, code: o.code })) : [];
            }
        },

        getDesignations(govType, parentId, deptId, orgId) {
            return OFFICIAL_STATISTICAL_DESIGNATIONS.map(des => ({ id: des.id, title: des.title }));
        },

        validateFullHierarchy(payload = {}) {
            const govType = payload.governmentType;
            const parentId = payload.ministry || payload.state;
            const deptId = payload.department;

            if (!govType) return { valid: false, error: "Please select Administration Type (Central or State/UT)." };
            if (!parentId) return { valid: false, error: "Please select a valid Ministry or State/UT." };

            const isCentral = (govType === "central" || govType === "Central Government");
            const parentList = isCentral ? CENTRAL_HIERARCHY : STATE_HIERARCHY;

            const parentObj = parentList.find(p => p.id === parentId || p.name === parentId);
            if (!parentObj) {
                return { valid: false, error: isCentral ? "Selected Ministry is invalid." : "Selected State/UT is invalid." };
            }

            if (deptId) {
                const deptObj = parentObj.departments.find(d => d.id === deptId || d.name === deptId);
                if (!deptObj) {
                    return { valid: false, error: "Please select a valid department belonging to " + parentObj.name + "." };
                }
            }

            return { valid: true };
        },

        isOfficialGovernmentEmail(email) {
            if (!email || typeof email !== "string") return false;
            const trimmed = email.trim().toLowerCase();

            const genericProviders = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "rediffmail.com", "icloud.com", "protonmail.com"];
            const domain = trimmed.split('@')[1];
            if (domain && genericProviders.includes(domain)) {
                return false;
            }

            const matchesApproved = APPROVED_GOVERNMENT_DOMAINS.some(d => trimmed.endsWith('@' + d) || trimmed.endsWith('.' + d));
            const matchesGovPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(gov\.in|nic\.in|org\.in|sansad\.in)$/.test(trimmed);

            return matchesApproved || matchesGovPattern;
        }
    };

    window.OrgDataService = OrgDataService;

    window.getAllMinistriesList = function() {
        let list = [];
        if (window.OrgDataService) {
            const mins = window.OrgDataService.getMinistries();
            if (mins) list.push(...mins.map(m => m.name));
            const states = window.OrgDataService.getStatesAndUTs();
            if (states) list.push(...states.map(s => s.name));
        }
        if (list.length === 0) {
            list = [
                "Ministry of Statistics & Programme Implementation (MoSPI)",
                "Ministry of Finance",
                "Ministry of Agriculture & Farmers Welfare",
                "Ministry of Commerce & Industry",
                "Ministry of Health & Family Welfare",
                "Ministry of Jal Shakti",
                "Ministry of Labour & Employment",
                "Ministry of Rural Development",
                "Ministry of Education",
                "Ministry of Electronics & Information Technology (MeitY)",
                "NITI Aayog (National Institution for Transforming India)"
            ];
        }
        return Array.from(new Set(list));
    };

    window.getDepartmentsForMinistry = function(ministryName) {
        if (!ministryName || ministryName.startsWith('--')) return [];
        let list = [];
        if (window.OrgDataService) {
            let depts = window.OrgDataService.getDepartments("central", ministryName);
            if (!depts || depts.length === 0) {
                depts = window.OrgDataService.getDepartments("state", ministryName);
            }
            if (depts && depts.length > 0) {
                depts.forEach(d => {
                    list.push(d.name);
                    const orgs = window.OrgDataService.getOrganisations("central", ministryName, d.id || d.name) ||
                                 window.OrgDataService.getOrganisations("state", ministryName, d.id || d.name);
                    if (orgs && orgs.length > 0) {
                        orgs.forEach(o => {
                            if (!list.includes(o.name)) list.push(o.name);
                        });
                    }
                });
            }
        }
        if (list.length === 0) {
            list = [
                "National Statistical Office (NSO - SDRD)",
                "National Statistical Office (NSO - FOD)",
                "National Statistical Office (NSO - NAD)",
                "National Statistical Office (NSO - ESD)",
                "National Statistical Office (NSO - PSD)",
                "National Statistical Office (NSO - SSD)",
                "National Statistical Systems Training Academy (NSSTA)",
                "Directorate of Economics & Statistics (DES)",
                "Economic & Statistics Division",
                "Data Analytics & Monitoring Directorate"
            ];
        }
        return Array.from(new Set(list));
    };

    // 4. DEPARTMENT FRAMEWORK CONFIGURATION (From Framework PDF & Markdown)
    const DEPARTMENT_FRAMEWORK_MAP = {
        // Ministry of Jal Shakti
        "Minor Irrigation Census & Water Bodies Directorate": {
            sectorTag: "Water Resources",
            d6Competencies: ["Minor Irrigation Census Methodology", "Water Body Enumeration Standards"],
            ministry: "Ministry of Jal Shakti"
        },
        "National Minor Irrigation Census & Groundwater Data Division": {
            sectorTag: "Groundwater Data",
            d6Competencies: ["Groundwater Level Monitoring", "Aquifer Data Classification"],
            ministry: "Ministry of Jal Shakti"
        },
        "Census of Water Bodies & Geo-Tagging Survey Unit": {
            sectorTag: "Geo-Water Survey",
            d6Competencies: ["GPS/Geo-tagging Protocols", "Water Body Inventory Standards"],
            ministry: "Ministry of Jal Shakti"
        },
        "Central Water Commission (CWC) — Hydrological & Water Statistics": {
            sectorTag: "Hydrology",
            d6Competencies: ["Hydrological Data Analysis", "River/Reservoir Flow Statistics"],
            ministry: "Ministry of Jal Shakti"
        },

        // Ministry of Education
        "Statistics & Educational Survey Division": {
            sectorTag: "Education",
            d6Competencies: ["School Survey Methodology", "Enrollment/Dropout Indicators"],
            ministry: "Ministry of Education"
        },
        "AISHE Data Analytics Cell": {
            sectorTag: "Higher Education",
            d6Competencies: ["Higher-Ed Survey Standards (AISHE)", "Institution-level Data Validation"],
            ministry: "Ministry of Education"
        },
        "UDISE+ Data Directorate": {
            sectorTag: "School Data Systems",
            d6Competencies: ["UDISE+ Schema & Codes", "School Infrastructure Indicators"],
            ministry: "Ministry of Education"
        },
        "PGI & NAS Unit": {
            sectorTag: "Learning Outcomes",
            d6Competencies: ["Performance Grading Index Methodology", "Learning Assessment Statistics"],
            ministry: "Ministry of Education"
        },

        // Ministry of Rural Development
        "Statistics, Monitoring & Evaluation Division": {
            sectorTag: "Rural Dev",
            d6Competencies: ["Scheme M&E Indicators", "Rural Development Survey Design"],
            ministry: "Ministry of Rural Development"
        },
        "DISHA/SECC Analytics": {
            sectorTag: "Socio-Economic Census",
            d6Competencies: ["SECC Data Structure", "Deprivation Indicator Computation"],
            ministry: "Ministry of Rural Development"
        },
        "MGNREGA Real-time MIS": {
            sectorTag: "Employment Guarantee",
            d6Competencies: ["MIS Wage/Workday Metrics", "Real-time Scheme Dashboards"],
            ministry: "Ministry of Rural Development"
        },
        "PMGSY GIS Directorate": {
            sectorTag: "Rural Connectivity",
            d6Competencies: ["Road Connectivity GIS Mapping", "Infrastructure Progress Metrics"],
            ministry: "Ministry of Rural Development"
        },

        // Ministry of Labour & Employment
        "Labour Bureau": {
            sectorTag: "Labour Statistics",
            d6Competencies: ["Labour Force Survey Concepts", "Employment Classification Standards"],
            ministry: "Ministry of Labour & Employment"
        },
        "CPI-IW Division": {
            sectorTag: "Industrial Price Index",
            d6Competencies: ["CPI-IW Basket & Weight Methodology"],
            ministry: "Ministry of Labour & Employment"
        },
        "CPI-AL/RL": {
            sectorTag: "Agri-Labour Price Index",
            d6Competencies: ["Rural Wage Index Construction"],
            ministry: "Ministry of Labour & Employment"
        },
        "Employment-Unemployment/Wage Cell": {
            sectorTag: "Employment Survey",
            d6Competencies: ["Wage Rate Survey Design", "Unemployment Rate Estimation"],
            ministry: "Ministry of Labour & Employment"
        },
        "DGE": {
            sectorTag: "Employment Services",
            d6Competencies: ["Employment Exchange Data Standards"],
            ministry: "Ministry of Labour & Employment"
        },
        "NCS Analytics": {
            sectorTag: "Labour Market Info",
            d6Competencies: ["Labour Market Information Systems (LMIS)"],
            ministry: "Ministry of Labour & Employment"
        },

        // Ministry of Health & Family Welfare
        "Statistics & Data Analytics Division": {
            sectorTag: "Health Statistics",
            d6Competencies: ["Vital Statistics Methodology", "Health Indicator Frameworks"],
            ministry: "Ministry of Health & Family Welfare"
        },
        "NFHS & Demographic Cell": {
            sectorTag: "Demography",
            d6Competencies: ["Demographic Survey Design (NFHS)", "Fertility/Mortality Indicators"],
            ministry: "Ministry of Health & Family Welfare"
        },
        "CBHI": {
            sectorTag: "Health Records",
            d6Competencies: ["Health Records Compilation Standards"],
            ministry: "Ministry of Health & Family Welfare"
        },
        "HMIS": {
            sectorTag: "Digital Health",
            d6Competencies: ["HMIS Data Schema", "Facility-level Health Reporting"],
            ministry: "Ministry of Health & Family Welfare"
        },

        // Ministry of Agriculture & Farmers Welfare
        "DES-Agriculture": {
            sectorTag: "Agri Statistics",
            d6Competencies: ["Crop Estimation Survey Methodology", "Agri-Economic Indicators"],
            ministry: "Ministry of Agriculture & Farmers Welfare"
        },
        "Crop Estimation/Advance Estimates Wing": {
            sectorTag: "Crop Statistics",
            d6Competencies: ["Crop Cutting Experiments", "Advance Estimate Methodology"],
            ministry: "Ministry of Agriculture & Farmers Welfare"
        },
        "Agricultural Census & Land Use Division": {
            sectorTag: "Land Use Survey",
            d6Competencies: ["Agricultural Census Concepts", "Land Use Classification"],
            ministry: "Ministry of Agriculture & Farmers Welfare"
        },
        "ISAS Directorate": {
            sectorTag: "Integrated Agri Stats",
            d6Competencies: ["ISAS Scheme Data Standards"],
            ministry: "Ministry of Agriculture & Farmers Welfare"
        },
        "MNCFC": {
            sectorTag: "Remote Sensing/GIS",
            d6Competencies: ["Satellite-based Crop Forecasting", "GIS for Agriculture"],
            ministry: "Ministry of Agriculture & Farmers Welfare"
        },

        // Ministry of Finance
        "Economic Division": {
            sectorTag: "Macro-Economics",
            d6Competencies: ["Macroeconomic Forecasting Models", "Economic Survey Compilation"],
            ministry: "Ministry of Finance"
        },
        "Budget Division — Fiscal Statistics": {
            sectorTag: "Fiscal Statistics",
            d6Competencies: ["Fiscal/Revenue Data Classification"],
            ministry: "Ministry of Finance"
        },
        "CBDT Tax Analytics Cell": {
            sectorTag: "Direct Tax Statistics",
            d6Competencies: ["Direct Tax Data Analysis"],
            ministry: "Ministry of Finance"
        },
        "CBIC GST Analytics": {
            sectorTag: "Indirect Tax Statistics",
            d6Competencies: ["GST/Trade Data Intelligence"],
            ministry: "Ministry of Finance"
        },
        "Financial Services — Banking Stats": {
            sectorTag: "Financial Inclusion",
            d6Competencies: ["Banking/Credit Flow Indicators"],
            ministry: "Ministry of Finance"
        },

        // Ministry of Statistics & Programme Implementation (MoSPI)
        "SDRD (Survey Design)": {
            sectorTag: "Survey Methodology",
            d6Competencies: ["Advanced Sample Design", "Survey Instrument Development"],
            ministry: "Ministry of Statistics & Programme Implementation (MoSPI)"
        },
        "FOD": {
            sectorTag: "Field Operations",
            d6Competencies: ["Field Data Collection Management", "CAPI Systems"],
            ministry: "Ministry of Statistics & Programme Implementation (MoSPI)"
        },
        "DPD": {
            sectorTag: "Data Processing",
            d6Competencies: ["Large-scale Data Processing Pipelines"],
            ministry: "Ministry of Statistics & Programme Implementation (MoSPI)"
        },
        "NAD": {
            sectorTag: "National Accounts",
            d6Competencies: ["GDP/GVA Compilation", "Base-year Revision Methods"],
            ministry: "Ministry of Statistics & Programme Implementation (MoSPI)"
        },
        "ESD": {
            sectorTag: "Industrial/Economic Stats",
            d6Competencies: ["ASI/IIP Concepts", "Business Register Maintenance"],
            ministry: "Ministry of Statistics & Programme Implementation (MoSPI)"
        },
        "PSD": {
            sectorTag: "Price Statistics",
            d6Competencies: ["CPI Construction Methodology"],
            ministry: "Ministry of Statistics & Programme Implementation (MoSPI)"
        },
        "SSD": {
            sectorTag: "Social Statistics",
            d6Competencies: ["SDG Indicator Compilation", "Social Survey Concepts"],
            ministry: "Ministry of Statistics & Programme Implementation (MoSPI)"
        },
        "NSSTA": {
            sectorTag: "Training & Capacity Building",
            d6Competencies: ["Training Design", "Andragogy for Statistical Officers"],
            ministry: "Ministry of Statistics & Programme Implementation (MoSPI)"
        },
        "PI Wing / TPP / IPMD": {
            sectorTag: "Programme Implementation",
            d6Competencies: ["Scheme Progress Monitoring Indicators"],
            ministry: "Ministry of Statistics & Programme Implementation (MoSPI)"
        },

        // Ministry of Commerce & Industry
        "DGCI&S": {
            sectorTag: "Trade Statistics",
            d6Competencies: ["Foreign Trade Data Compilation"],
            ministry: "Ministry of Commerce & Industry"
        },
        "Foreign Trade Directorate": {
            sectorTag: "Export-Import Stats",
            d6Competencies: ["Merchandise Trade Classification (HS Codes)"],
            ministry: "Ministry of Commerce & Industry"
        },
        "Inland Trade/DPIIT": {
            sectorTag: "Industrial Trade",
            d6Competencies: ["Internal Trade Data Systems"],
            ministry: "Ministry of Commerce & Industry"
        },
        "WPI/IIP Monitoring Cell": {
            sectorTag: "Wholesale Price/Industrial Production",
            d6Competencies: ["WPI Basket Construction"],
            ministry: "Ministry of Commerce & Industry"
        },

        // Ministry of Consumer Affairs, Food & Public Distribution
        "Price Monitoring Cell": {
            sectorTag: "Consumer Prices",
            d6Competencies: ["Daily Price Monitoring Methodology"],
            ministry: "Ministry of Consumer Affairs, Food & Public Distribution"
        },
        "Retail/Wholesale Price Tracking": {
            sectorTag: "Commodity Prices",
            d6Competencies: ["Essential Commodity Price Indices"],
            ministry: "Ministry of Consumer Affairs, Food & Public Distribution"
        },
        "Market Intelligence Directorate": {
            sectorTag: "Buffer Stock Analytics",
            d6Competencies: ["Buffer Stock & Market Intelligence Indicators"],
            ministry: "Ministry of Consumer Affairs, Food & Public Distribution"
        },
        "NFSA/PDS Analytics Unit": {
            sectorTag: "Food Security",
            d6Competencies: ["PDS Coverage Statistics", "NFSA Beneficiary Data"],
            ministry: "Ministry of Consumer Affairs, Food & Public Distribution"
        }
    };

    // 5. OFFICIAL ROLE GRADES (R1 to R6) BASED ON FRAMEWORK SECTION 2
    const ROLE_GRADES = [
        { grade: "R1", baseTitle: "[Sector] Field Enumerator / Data Collector", pattern: "{sector} Field Enumerator / Data Collector", tier: "Entry", exp: "0–2 Years", desc: "Household/enterprise field visits; CAPI administration; first-level scrutiny" },
        { grade: "R2", baseTitle: "[Sector] Statistical Supervisor", pattern: "{sector} Statistical Supervisor", tier: "Entry / Junior", exp: "2–4 Years", desc: "Supervising field teams; verifying sample selection; second-level data scrutiny" },
        { grade: "R3", baseTitle: "Assistant Director ([Sector] Statistics)", pattern: "Assistant Director ({sector} Statistics)", tier: "Junior", exp: "3–7 Years", desc: "Data cleaning, tabulation, estimation scripts, technical notes (ISS JTS)" },
        { grade: "R4", baseTitle: "Deputy Director ([Sector] Statistics)", pattern: "Deputy Director ({sector} Statistics)", tier: "Senior", exp: "7–10 Years", desc: "Designing/revising sampling frames & index methods; quality audits (ISS STS)" },
        { grade: "R5", baseTitle: "Director ([Sector] Statistics)", pattern: "Director ({sector} Statistics)", tier: "Senior", exp: "10–15 Years", desc: "Approving methodology; presenting data; coordinating base revisions (Division Head)" },
        { grade: "R6", baseTitle: "Additional DG / Statistical Adviser ([Sector])", pattern: "Additional DG / Statistical Adviser ({sector})", tier: "Leadership", exp: "15+ Years", desc: "National policy doctrine, cadre leadership, international representation" }
    ];

    window.DEPARTMENT_FRAMEWORK_MAP = DEPARTMENT_FRAMEWORK_MAP;
    window.ROLE_GRADES = ROLE_GRADES;

    window.getDepartmentFrameworkConfig = function(deptName) {
        if (!deptName) return { sectorTag: "Official Statistics", d6Competencies: ["Statistical Methodology", "Data Validation"], ministry: "Central/State Government" };
        
        // Exact match
        if (DEPARTMENT_FRAMEWORK_MAP[deptName]) {
            return DEPARTMENT_FRAMEWORK_MAP[deptName];
        }

        // Substring / fuzzy match
        const lower = deptName.toLowerCase();
        for (const [key, cfg] of Object.entries(DEPARTMENT_FRAMEWORK_MAP)) {
            if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
                return cfg;
            }
        }

        // Keywords detection
        if (lower.includes("sdrd") || lower.includes("survey design")) {
            return DEPARTMENT_FRAMEWORK_MAP["SDRD (Survey Design)"];
        }
        if (lower.includes("fod") || lower.includes("field operation")) {
            return DEPARTMENT_FRAMEWORK_MAP["FOD"];
        }
        if (lower.includes("nad") || lower.includes("national account") || lower.includes("gdp")) {
            return DEPARTMENT_FRAMEWORK_MAP["NAD"];
        }
        if (lower.includes("esd") || lower.includes("economic statistics") || lower.includes("asi") || lower.includes("iip")) {
            return DEPARTMENT_FRAMEWORK_MAP["ESD"];
        }
        if (lower.includes("psd") || lower.includes("price") || lower.includes("cpi")) {
            return DEPARTMENT_FRAMEWORK_MAP["PSD"];
        }
        if (lower.includes("ssd") || lower.includes("social") || lower.includes("sdg")) {
            return DEPARTMENT_FRAMEWORK_MAP["SSD"];
        }
        if (lower.includes("water") || lower.includes("irrigation") || lower.includes("jal")) {
            return DEPARTMENT_FRAMEWORK_MAP["Minor Irrigation Census & Water Bodies Directorate"];
        }
        if (lower.includes("education") || lower.includes("school") || lower.includes("aishe") || lower.includes("udise")) {
            return DEPARTMENT_FRAMEWORK_MAP["Statistics & Educational Survey Division"];
        }
        if (lower.includes("labour") || lower.includes("employment")) {
            return DEPARTMENT_FRAMEWORK_MAP["Labour Bureau"];
        }
        if (lower.includes("health") || lower.includes("family welfare") || lower.includes("nhm") || lower.includes("nfhs")) {
            return DEPARTMENT_FRAMEWORK_MAP["Statistics & Data Analytics Division"];
        }
        if (lower.includes("agri") || lower.includes("crop") || lower.includes("farmer")) {
            return DEPARTMENT_FRAMEWORK_MAP["DES-Agriculture"];
        }
        if (lower.includes("finance") || lower.includes("budget") || lower.includes("economic division") || lower.includes("tax")) {
            return DEPARTMENT_FRAMEWORK_MAP["Economic Division"];
        }
        if (lower.includes("rural") || lower.includes("mgnrega") || lower.includes("disha")) {
            return DEPARTMENT_FRAMEWORK_MAP["Statistics, Monitoring & Evaluation Division"];
        }
        if (lower.includes("commerce") || lower.includes("trade")) {
            return DEPARTMENT_FRAMEWORK_MAP["DGCI&S"];
        }

        return {
            sectorTag: "Official Statistics",
            d6Competencies: ["Public Data Standards", "Official Statistical Validation"],
            ministry: "National Statistical System"
        };
    };

    window.getDesignationsForDepartment = function(deptName) {
        const config = window.getDepartmentFrameworkConfig(deptName);
        const sector = config.sectorTag || "Official Statistics";
        return ROLE_GRADES.map(rg => {
            const title = rg.pattern.replace("{sector}", sector);
            return {
                grade: rg.grade,
                title: title,
                fullTitle: `${rg.grade} — ${title}`,
                tier: rg.tier,
                exp: rg.exp,
                desc: rg.desc,
                sectorTag: sector,
                d6Competencies: config.d6Competencies || []
            };
        });
    };

    window.getAllDesignationsList = function() {
        const defaultDept = "National Statistical Office (NSO - NAD)";
        const generated = window.getDesignationsForDepartment(defaultDept);
        return generated.map(g => g.fullTitle);
    };

    // Official Cadre Competency Benchmark Matrix based on Ministry Framework PDF & v2 Standard
    const CADRE_COMPETENCY_REQUIREMENTS = {
        // Domain A — Statistical Competencies
        "Survey Design": { R1: 1, R2: 2, R3: 3, R4: 4, R5: 3, R6: 2 },
        "Sampling": { R1: 1, R2: 2, R3: 3, R4: 4, R5: 3, R6: 2 },
        "National Accounts": { R1: 1, R2: 1, R3: 3, R4: 4, R5: 4, R6: 3 },
        "Price Statistics": { R1: 1, R2: 1, R3: 3, R4: 4, R5: 4, R6: 2 },
        "Labour Statistics": { R1: 1, R2: 1, R3: 3, R4: 4, R5: 4, R6: 2 },
        "Agricultural Statistics": { R1: 1, R2: 1, R3: 3, R4: 4, R5: 4, R6: 2 },
        "Industrial Statistics": { R1: 1, R2: 1, R3: 3, R4: 4, R5: 4, R6: 2 },
        "SDG Indicators": { R1: 1, R2: 1, R3: 2, R4: 3, R5: 4, R6: 4 },
        "Metadata Standards": { R1: 1, R2: 2, R3: 3, R4: 4, R5: 3, R6: 2 },
        "Data Quality Frameworks": { R1: 1, R2: 3, R3: 3, R4: 4, R5: 4, R6: 3 },

        // Domain B — Technical Competencies
        "Python": { R1: 1, R2: 1, R3: 3, R4: 3, R5: 2, R6: 1 },
        "R": { R1: 1, R2: 1, R3: 3, R4: 3, R5: 2, R6: 1 },
        "SQL": { R1: 1, R2: 1, R3: 3, R4: 3, R5: 2, R6: 1 },
        "Stata": { R1: 1, R2: 1, R3: 2, R4: 3, R5: 2, R6: 1 },
        "SPSS": { R1: 1, R2: 1, R3: 2, R4: 2, R5: 1, R6: 1 },
        "SAS": { R1: 1, R2: 1, R3: 1, R4: 2, R5: 2, R6: 1 },
        "GIS": { R1: 1, R2: 2, R3: 2, R4: 2, R5: 1, R6: 1 },
        "Data Visualization": { R1: 1, R2: 1, R3: 3, R4: 3, R5: 3, R6: 2 },
        "AI/ML": { R1: 1, R2: 1, R3: 2, R4: 3, R5: 2, R6: 2 },
        "Cloud Computing": { R1: 1, R2: 1, R3: 1, R4: 2, R5: 3, R6: 3 },
        "APIs": { R1: 1, R2: 1, R3: 2, R4: 2, R5: 2, R6: 1 },
        "Open Data": { R1: 1, R2: 1, R3: 2, R4: 3, R5: 3, R6: 3 },

        // Domain C — Digital Governance
        "Cybersecurity": { R1: 1, R2: 2, R3: 2, R4: 3, R5: 4, R6: 4 },
        "Data Privacy": { R1: 2, R2: 2, R3: 3, R4: 3, R5: 4, R6: 4 },
        "Digital Signatures": { R1: 1, R2: 1, R3: 2, R4: 2, R5: 3, R6: 2 },
        "Government Cloud": { R1: 1, R2: 1, R3: 1, R4: 2, R5: 3, R6: 3 },
        "Digital Public Infrastructure": { R1: 1, R2: 1, R3: 1, R4: 2, R5: 3, R6: 4 },

        // Domain D & E — Behavioural & Managerial
        "Leadership": { R1: 1, R2: 2, R3: 2, R4: 3, R5: 4, R6: 5 },
        "Communication": { R1: 2, R2: 3, R3: 3, R4: 3, R5: 4, R6: 4 },
        "Project Management": { R1: 1, R2: 2, R3: 2, R4: 3, R5: 4, R6: 4 },
        "Ethics": { R1: 3, R2: 3, R3: 3, R4: 3, R5: 4, R6: 4 },
        "Decision Making": { R1: 1, R2: 2, R3: 2, R4: 3, R5: 4, R6: 5 },
        "Change Management": { R1: 1, R2: 1, R3: 1, R4: 2, R5: 3, R6: 4 },

        // Domain F — Sectoral
        "Sectoral": { R1: 1, R2: 2, R3: 3, R4: 4, R5: 4, R6: 3 }
    };

    window.FRAMEWORK_LEVEL_NAMES = {
        1: "Awareness",
        2: "Working (Routine)",
        3: "Practitioner",
        4: "Advanced",
        5: "Expert / Strategic"
    };

    window.FRAMEWORK_LEVEL_SUBTITLES = {
        1: "Basic awareness of official statistical concepts and terminology",
        2: "Independent execution of routine departmental statistical workflows",
        3: "Adapts to complex microdata, applies methodology & guides peer teams",
        4: "Designs national statistical standards, methods & quality frameworks",
        5: "Sets national policy, statistical doctrine & strategic vision"
    };

    window.getOfficerRoleGrade = function(user) {
        if (!user) return 'R3';
        if (user.roleGrade && /^R[1-6]$/i.test(user.roleGrade)) return user.roleGrade.toUpperCase();
        if (user.role_grade && /^R[1-6]$/i.test(user.role_grade)) return user.role_grade.toUpperCase();
        
        const desig = String(user.designation || user.role || '').toLowerCase();
        const exp = parseFloat(user.experienceYears || user.experience_years || 0);

        // Check for explicit R1-R6 markers
        const match = desig.match(/\b(r[1-6])\b/i);
        if (match) return match[1].toUpperCase();

        if (desig.includes('director general') || desig.includes('additional director general') || desig.includes('adg') || desig.includes('dg')) {
            return 'R6';
        }
        if (desig.includes('director') || desig.includes('ddg') || exp >= 10) {
            return 'R5';
        }
        if (desig.includes('deputy director') || exp >= 7) {
            return 'R4';
        }
        if (desig.includes('assistant director') || desig.includes('statistical officer') || (exp >= 3 && exp < 7)) {
            return 'R3';
        }
        if (desig.includes('senior statistical officer') || desig.includes('sso') || (exp >= 2 && exp < 4)) {
            return 'R2';
        }
        if (desig.includes('junior') || desig.includes('jso') || desig.includes('probationer') || desig.includes('enumerator') || desig.includes('investigator') || exp < 2) {
            return 'R1';
        }

        return 'R3';
    };

    window.getCompetencyFrameworkBenchmark = function(compKey, userOrGrade) {
        let grade = 'R3';
        if (typeof userOrGrade === 'string' && /^R[1-6]$/i.test(userOrGrade)) {
            grade = userOrGrade.toUpperCase();
        } else if (typeof userOrGrade === 'object') {
            grade = window.getOfficerRoleGrade(userOrGrade);
        }

        const cleanKey = String(compKey || '').trim();

        // 1. Exact match in framework
        if (CADRE_COMPETENCY_REQUIREMENTS[cleanKey] && CADRE_COMPETENCY_REQUIREMENTS[cleanKey][grade] !== undefined) {
            return CADRE_COMPETENCY_REQUIREMENTS[cleanKey][grade];
        }

        // 2. Fuzzy substring match
        for (const [k, v] of Object.entries(CADRE_COMPETENCY_REQUIREMENTS)) {
            if (cleanKey.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(cleanKey.toLowerCase())) {
                if (v[grade] !== undefined) return v[grade];
            }
        }

        // 3. Fallback based on Role Grade
        const gradeDefaults = { R1: 1, R2: 2, R3: 3, R4: 4, R5: 4, R6: 5 };
        return gradeDefaults[grade] || 3;
    };
})(window);

