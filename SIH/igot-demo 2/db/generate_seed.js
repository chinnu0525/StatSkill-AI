// Generates seed.sql with central ministries (+ sub-departments) and
// state/UT departments (generic starter set per state — customize per
// state's official gazette/notification later).
const fs = require('fs');

// --- CENTRAL MINISTRIES (Union Government) -----------------------------
// Format: [ministryName, [subDepartments...]]
const centralMinistries = [
  ["Agriculture and Farmers' Welfare", []],
  ["Ayush", []],
  ["Chemicals and Fertilizers", ["Department of Chemicals and Petrochemicals", "Department of Fertilizers"]],
  ["Civil Aviation", []],
  ["Coal", []],
  ["Commerce and Industry", ["Department of Commerce", "Department for Promotion of Industry and Internal Trade"]],
  ["Communications", ["Department of Telecommunications", "Department of Posts"]],
  ["Consumer Affairs, Food and Public Distribution", ["Department of Consumer Affairs", "Department of Food and Public Distribution"]],
  ["Co-operation", []],
  ["Corporate Affairs", []],
  ["Culture", []],
  ["Defence", ["Department of Defence", "Department of Defence Production", "Department of Defence Research and Development", "Department of Ex-Servicemen Welfare", "Department of Military Affairs"]],
  ["Development of North Eastern Region", []],
  ["Earth Sciences", []],
  ["Education", ["Department of School Education and Literacy", "Department of Higher Education"]],
  ["Electronics and Information Technology", []],
  ["Environment, Forest and Climate Change", []],
  ["External Affairs", []],
  ["Finance", ["Department of Economic Affairs", "Department of Expenditure", "Department of Revenue", "Department of Investment and Public Asset Management", "Department of Financial Services", "Department of Public Enterprises"]],
  ["Fisheries, Animal Husbandry and Dairying", []],
  ["Food Processing Industries", []],
  ["Health and Family Welfare", ["Department of Health and Family Welfare", "Department of Health Research"]],
  ["Heavy Industries", []],
  ["Home Affairs", ["Department of Border Management", "Department of Internal Security", "Department of Official Language", "Department of States"]],
  ["Housing and Urban Affairs", []],
  ["Information and Broadcasting", []],
  ["Jal Shakti", ["Department of Water Resources, River Development and Ganga Rejuvenation", "Department of Drinking Water and Sanitation"]],
  ["Labour and Employment", []],
  ["Law and Justice", ["Department of Legal Affairs", "Legislative Department", "Department of Justice"]],
  ["Micro, Small and Medium Enterprises", []],
  ["Mines", []],
  ["Minority Affairs", []],
  ["New and Renewable Energy", []],
  ["Panchayati Raj", []],
  ["Parliamentary Affairs", []],
  ["Personnel, Public Grievances and Pensions", []],
  ["Petroleum and Natural Gas", []],
  ["Ports, Shipping and Waterways", []],
  ["Power", []],
  ["Railways", []],
  ["Road Transport and Highways", []],
  ["Rural Development", []],
  ["Science and Technology", ["Department of Science and Technology", "Department of Biotechnology", "Department of Scientific and Industrial Research"]],
  ["Skill Development and Entrepreneurship", []],
  ["Social Justice and Empowerment", []],
  ["Space", []],
  ["Statistics and Programme Implementation", []],
  ["Steel", []],
  ["Textiles", []],
  ["Tourism", []],
  ["Tribal Affairs", []],
  ["Women and Child Development", []],
  ["Youth Affairs and Sports", []],
  ["Atomic Energy", []],
  ["Cabinet Secretariat", []],
];

// --- STATES / UNION TERRITORIES ------------------------------------------
const statesAndUTs = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry"
];

// Generic starter department set applied per state.
// NOTE: exact names/count vary by state — replace with each state's
// official notification list when you have time (this unblocks you now).
const genericDepartments = [
  "Agriculture", "Health and Family Welfare", "School Education",
  "Higher Education", "Finance", "Home", "Revenue", "Public Works",
  "Industries", "Labour and Employment", "Rural Development",
  "Urban Development and Local Government", "Transport", "Tourism",
  "Social Welfare", "Women and Child Development", "Panchayati Raj",
  "Excise and Taxation", "Food and Civil Supplies", "Forest and Environment"
];

let sql = "BEGIN TRANSACTION;\n\n-- Central ministries + sub-departments\n";

centralMinistries.forEach(([name, subs]) => {
  sql += `INSERT INTO ministries (name, type, state, parent_ministry) VALUES ('${name.replace(/'/g, "''")}', 'central', NULL, NULL);\n`;
  if (subs.length) {
    sql += `INSERT INTO ministries (name, type, state, parent_ministry)\n  SELECT '${subs[0].replace(/'/g, "''")}', 'central', NULL, id FROM ministries WHERE name = '${name.replace(/'/g, "''")}';\n`;
    subs.slice(1).forEach(sub => {
      sql += `INSERT INTO ministries (name, type, state, parent_ministry)\n  SELECT '${sub.replace(/'/g, "''")}', 'central', NULL, id FROM ministries WHERE name = '${name.replace(/'/g, "''")}';\n`;
    });
  }
});

sql += "\n-- State / UT departments (generic starter set — customize per state later)\n";
statesAndUTs.forEach(state => {
  genericDepartments.forEach(dept => {
    sql += `INSERT INTO state_departments (name, type, state, parent_ministry) VALUES ('${dept.replace(/'/g, "''")}', 'state', '${state.replace(/'/g, "''")}', NULL);\n`;
  });
});

sql += "\nCOMMIT;\n";

fs.writeFileSync(__dirname + '/seed.sql', sql);
console.log('seed.sql generated:', centralMinistries.length, 'ministries,', statesAndUTs.length, 'states/UTs x', genericDepartments.length, 'depts each');
