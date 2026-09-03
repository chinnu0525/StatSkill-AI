#!/usr/bin/env python3
"""
StatSkill AI - Backend Server
Provides REST API endpoints and serves the frontend Single Page Application.
Built for the Ministry of Statistics and Programme Implementation (MoSPI) & National Statistical System.
"""

import http.server
import socketserver
import json
import urllib.parse
import os
import sys
import time
import random
import hashlib
import secrets
import sqlite3
import re
from groq_client import groq_quiz_client

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(DIRECTORY, "static")

# Attached iGOT Database (from igot-demo 2)
DB_PATH = os.path.join(DIRECTORY, "igot_demo.db")
SCHEMA_PATH = os.path.join(DIRECTORY, "igot-demo 2", "db", "schema.sql")
SEED_PATH = os.path.join(DIRECTORY, "igot-demo 2", "db", "seed.sql")

# In-Memory & Persistent Storage
USERS_FILE = os.path.join(DIRECTORY, "users.json")
USERS = {} # email -> user record
OTP_STORE = {} # email -> {"otp": "123456", "expires": timestamp, "ministry": ministry}
VERIFIED_EMAILS = set()

def load_users():
    global USERS
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, 'r', encoding='utf-8') as f:
                USERS = json.load(f)
            print(f"[Users Store] Loaded {len(USERS)} registered users from users.json")
        except Exception as e:
            print(f"[Users Store Warning] Could not read users.json: {e}")
            USERS = {}
    else:
        USERS = {}

def save_users():
    try:
        with open(USERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(USERS, f, indent=2)
        print(f"[Users Store] Persisted {len(USERS)} users to users.json")
    except Exception as e:
        print(f"[Users Store Warning] Could not write users.json: {e}")

load_users()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password, salt=None):
    if not salt:
        salt = secrets.token_hex(16)
    hashed = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    return hashed, salt

def load_env_file():
    """Loads environment variables from .env file if it exists."""
    env_path = os.path.join(DIRECTORY, ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k not in os.environ:
                            os.environ[k] = v
            print(f"[Config] Loaded environment variables from .env file.")
        except Exception as e:
            print(f"[Config Warning] Could not parse .env: {e}")

load_env_file()

def send_real_sms_otp(mobile, otp):
    """
    Sends real SMS OTP to Indian mobile numbers (+91) using configured SMS gateway.
    Supports Fast2SMS, 2Factor.in, Twilio, Msg91, and Textlocal.
    """
    import urllib.request
    import urllib.parse
    import base64

    clean_mobile = re.sub(r'\D', '', str(mobile))
    if len(clean_mobile) == 12 and clean_mobile.startswith('91'):
        clean_mobile = clean_mobile[2:]

    fast2sms_key = os.environ.get("FAST2SMS_API_KEY")
    twofactor_key = os.environ.get("TWO_FACTOR_API_KEY") or os.environ.get("TWOFACTOR_API_KEY")
    twilio_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    twilio_token = os.environ.get("TWILIO_AUTH_TOKEN")
    twilio_from = os.environ.get("TWILIO_FROM_NUMBER")
    msg91_key = os.environ.get("MSG91_AUTH_KEY")
    textlocal_key = os.environ.get("TEXTLOCAL_API_KEY")

    # 1. Fast2SMS (India Quick OTP Gateway)
    if fast2sms_key:
        try:
            url = "https://www.fast2sms.com/dev/bulkV2"
            headers = {
                "authorization": fast2sms_key,
                "Content-Type": "application/x-www-form-urlencoded"
            }
            data = urllib.parse.urlencode({
                "variables_values": otp,
                "route": "otp",
                "numbers": clean_mobile
            }).encode('utf-8')
            req = urllib.request.Request(url, data=data, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=10) as resp:
                result = json.loads(resp.read().decode('utf-8'))
                print(f"[Fast2SMS Gateway] Real SMS dispatched to +91-{clean_mobile}: {result}")
                return True, "SMS dispatched via Fast2SMS"
        except Exception as e:
            print(f"[Fast2SMS Error] Failed to send SMS: {e}")

    # 2. 2Factor.in (India OTP Gateway)
    if twofactor_key:
        try:
            url = f"https://2factor.in/v1/API/V1/{twofactor_key}/SMS/{clean_mobile}/{otp}/AUTOGEN"
            req = urllib.request.Request(url, headers={"User-Agent": "StatSkill-AI/1.0"})
            with urllib.request.urlopen(req, timeout=10) as resp:
                result = json.loads(resp.read().decode('utf-8'))
                print(f"[2Factor.in Gateway] Real SMS dispatched to +91-{clean_mobile}: {result}")
                return True, "SMS dispatched via 2Factor"
        except Exception as e:
            print(f"[2Factor Error] Failed to send SMS: {e}")

    # 3. Twilio SMS
    if twilio_sid and twilio_token and twilio_from:
        try:
            url = f"https://api.twilio.com/2010-04-01/Accounts/{twilio_sid}/Messages.json"
            auth_str = f"{twilio_sid}:{twilio_token}"
            b64_auth = base64.b64encode(auth_str.encode()).decode()
            headers = {
                "Authorization": f"Basic {b64_auth}",
                "Content-Type": "application/x-www-form-urlencoded"
            }
            data = urllib.parse.urlencode({
                "To": f"+91{clean_mobile}",
                "From": twilio_from,
                "Body": f"Your StatSkill AI (MoSPI) verification OTP code is: {otp}. Valid for 5 minutes."
            }).encode('utf-8')
            req = urllib.request.Request(url, data=data, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=10) as resp:
                result = json.loads(resp.read().decode('utf-8'))
                print(f"[Twilio Gateway] Real SMS dispatched to +91-{clean_mobile}: SID {result.get('sid')}")
                return True, "SMS dispatched via Twilio"
        except Exception as e:
            print(f"[Twilio Error] Failed to send SMS: {e}")

    # Fallback / Dev info when no SMS Gateway API Key is provided
    print("\n" + "="*70)
    print(f"📡 [SMS GATEWAY DISPATCH NOTICE]")
    print(f"👉 Target Indian Mobile: +91 {clean_mobile}")
    print(f"👉 6-Digit OTP Code: [{otp}]")
    print(f"ℹ️  To deliver real SMS directly to mobile handsets over telecom networks,")
    print(f"   add your FAST2SMS_API_KEY or TWO_FACTOR_API_KEY or TWILIO credentials in .env")
    print("="*70 + "\n")
    return False, "SMS Gateway credentials not yet configured in .env"

def send_smtp_otp(to_email, otp):
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", 587))
    smtp_user = os.environ.get("SMTP_USER")
    smtp_password = os.environ.get("SMTP_PASSWORD")

    if not smtp_user or not smtp_password:
        print(f"\n=======================================================")
        print(f"[DEV MODE] SMTP not configured. OTP for {to_email}: {otp}")
        print(f"=======================================================\n")
        return True

    try:
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart

        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = to_email
        msg['Subject'] = "StatSkill AI — Email Verification OTP"

        body = f"Your StatSkill AI verification code is: {otp}\nThis OTP is valid for 5 minutes."
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        print(f"[SMTP] Successfully sent OTP to {to_email}")
        return True
    except Exception as e:
        print(f"[SMTP Error] Failed to send email via SMTP: {e}")
        print(f"[DEV MODE FALLBACK] OTP for {to_email}: {otp}")
        return True

def init_db_if_needed():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='ministries'")
    row = cursor.fetchone()
    if not row:
        print("[Attached DB] Initializing igot_demo.db from schema.sql and seed.sql...")
        if os.path.exists(SCHEMA_PATH) and os.path.exists(SEED_PATH):
            with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
                cursor.executescript(f.read())
            with open(SEED_PATH, 'r', encoding='utf-8') as f:
                cursor.executescript(f.read())
            print("[Attached DB] igot_demo.db successfully seeded with Ministries & State Departments!")
    
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
    if cursor.fetchone():
        cursor.execute("PRAGMA table_info(users)")
        cols = [r["name"] for r in cursor.fetchall()]
        if "role" not in cols:
            print("[Attached DB] Updating users table schema...")
            cursor.execute("DROP TABLE users")

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT,
            salt TEXT,
            role TEXT DEFAULT 'learner',
            employee_id TEXT,
            org_type TEXT,
            ministry_id TEXT,
            state TEXT,
            department TEXT,
            organisation TEXT,
            designation TEXT,
            overall_score INTEGER DEFAULT 68,
            learning_hours REAL DEFAULT 42.5,
            assessments_completed INTEGER DEFAULT 12,
            registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login_at TIMESTAMP
        );
    """)

    # Ensure all Block 1 Learner Profile columns exist in users table
    cursor.execute("PRAGMA table_info(users)")
    cols = [r["name"] for r in cursor.fetchall()]
    profile_cols = {
        "mobile": "TEXT",
        "last_login_at": "TIMESTAMP",
        "experience_years": "REAL DEFAULT 4.0",
        "degree": "TEXT DEFAULT 'M.Sc. Statistics'",
        "specialization": "TEXT DEFAULT 'Mathematical Statistics & Survey Methodology'",
        "statistical_domains": "TEXT DEFAULT 'Survey Design, Sampling, National Accounts, Price Statistics'",
        "previous_roles": "TEXT DEFAULT 'Statistical Investigator, Junior Statistical Officer'",
        "projects_handled": "TEXT DEFAULT 'Periodic Labour Force Survey (PLFS), Consumer Expenditure Survey (CES)'",
        "technical_qualifications": "TEXT DEFAULT 'Python, R, SPSS, Stata, SQL, PowerBI, Advanced Excel'",
        "training_programmes": "TEXT DEFAULT 'NSSTA Greater Noida (Survey Methodology), iGOT Karmayogi (Data Analytics)'",
        "current_assignment": "TEXT DEFAULT 'Survey Design & Research Division (SDRD), PLFS & Price Indices'",
        "location": "TEXT DEFAULT 'Sankhyiki Bhawan, New Delhi'",
        "profile_completed": "INTEGER DEFAULT 1"
    }
    for col_name, col_type in profile_cols.items():
        if col_name not in cols:
            try:
                cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
                conn.commit()
            except Exception as e:
                pass

    # Login audit logs table for full compliance and tracking
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS login_audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            email TEXT,
            name TEXT,
            ip_address TEXT,
            login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'SUCCESS'
        );
    """)
    conn.commit()

    # Seed Default Mock Users into SQLite if users table is empty
    cursor.execute("SELECT count(*) as count FROM users")
    cnt = cursor.fetchone()["count"]
    if cnt <= 0:
        print("[Attached DB] Seeding initial mock user personas into SQLite users table...")
        default_users = [
            ("Ananya Sharma", "ananya.sharma@nic.in", "password123", "learner", "ISS/2026/84920", "Central Government", "min_mospi", None, "National Statistical Office (NSO - SDRD)", "org_sdrd", "Senior Statistical Officer (SSO)", 68, 42.5, 12),
            ("Dr. Rajesh Verma", "rajesh.verma@gov.in", "password123", "trainer", "ISS/2026/10294", "Central Government", "min_mospi", None, "National Accounts Division (NAD)", "org_nad", "Joint Director (Macroeconomic Statistics)", 82, 36.0, 15),
            ("Sunita Rao", "sunita.rao@nic.in", "password123", "learner", "SSS/2026/65410", "Central Government", "min_mospi", None, "Price Statistics Division (PSD - CPI)", "org_psd", "Senior Statistical Officer (Price)", 74, 28.0, 9),
            ("Smt. Priya Menon", "priya.menon@gov.in", "password123", "admin", "ISS/2026/00192", "Central Government", "min_mospi", None, "Capacity Building Unit", "org_cbu", "Director (Capacity Building)", 90, 58.0, 22)
        ]
        for name, email, raw_pwd, role, emp_id, org_type, min_id, st, dept, org, desig, score, hrs, count in default_users:
            h, s = hash_password(raw_pwd)
            cursor.execute("""
                INSERT OR IGNORE INTO users 
                (name, email, password_hash, salt, role, employee_id, org_type, ministry_id, state, department, organisation, designation, overall_score, learning_hours, assessments_completed)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (name, email, h, s, role, emp_id, org_type, min_id, st, dept, org, desig, score, hrs, count))
            
            # Sync to in-memory USERS
            if email not in USERS:
                USERS[email] = {
                    "id": emp_id,
                    "email": email,
                    "name": name,
                    "ministry": min_id,
                    "department": dept,
                    "role": desig,
                    "employeeId": emp_id,
                    "password_hash": h,
                    "salt": s,
                    "registered_at": time.strftime("%Y-%m-%d %H:%M:%S")
                }
        save_users()
        print("[Attached DB] Mock users seeded into SQLite and users.json.")

    conn.commit()
    conn.close()

try:
    init_db_if_needed()
except Exception as err:
    print(f"[Attached DB Warning] Error initializing DB: {err}")

def row_to_user_dict(u):
    if not u:
        return None
    desig = u.get("designation") or "Senior Statistical Officer (SSO)"
    if "[object Object]" in str(desig):
        desig = "Senior Statistical Officer (SSO)"
    return {
        "id": str(u.get("id")),
        "email": u.get("email"),
        "mobile": u.get("mobile") or "",
        "name": u.get("name"),
        "ministry": u.get("ministry_id") or "Ministry of Statistics & Programme Implementation",
        "department": u.get("department") or "National Statistical Office (NSO - SDRD)",
        "designation": desig,
        "role": desig,
        "employeeId": u.get("employee_id") or "ISS/2026/84920",
        "employee_id": u.get("employee_id") or "ISS/2026/84920",
        "org_type": u.get("org_type") or "Central Government",
        "experienceYears": float(u.get("experience_years")) if u.get("experience_years") is not None else None,
        "experience_years": float(u.get("experience_years")) if u.get("experience_years") is not None else None,
        "degree": u.get("degree") or "",
        "specialization": u.get("specialization") or "",
        "statisticalDomains": u.get("statistical_domains") or "",
        "statistical_domains": u.get("statistical_domains") or "",
        "previousRoles": u.get("previous_roles") or "",
        "previous_roles": u.get("previous_roles") or "",
        "projectsHandled": u.get("projects_handled") or "",
        "projects_handled": u.get("projects_handled") or "",
        "technicalQualifications": u.get("technical_qualifications") or "",
        "technical_qualifications": u.get("technical_qualifications") or "",
        "trainingProgrammes": u.get("training_programmes") or "",
        "training_programmes": u.get("training_programmes") or "",
        "currentAssignment": u.get("current_assignment") or "",
        "current_assignment": u.get("current_assignment") or "",
        "location": u.get("location") or "",
        "profileCompleted": bool(u.get("profile_completed", 0)),
        "profile_completed": u.get("profile_completed", 0),
        "roleGrade": u.get("role_grade") or "R3",
        "role_grade": u.get("role_grade") or "R3",
        "sectorTag": u.get("sector_tag") or "Official Statistics",
        "sector_tag": u.get("sector_tag") or "Official Statistics",
        "d6Competencies": u.get("d6_competencies") or "",
        "d6_competencies": u.get("d6_competencies") or "",
        "overallScore": u.get("overall_score") or 68,
        "learningHours": float(u.get("learning_hours") or 42.5),
        "assessmentsCompleted": u.get("assessments_completed") or 12,
        "password_hash": u.get("password_hash"),
        "salt": u.get("salt")
    }

# In-Memory Dynamic State & Store for Demo
STATE = {
    "current_user": "user_001",
    "user_competencies": {
        "AI/ML": {"current": 1, "required": 3, "gap": 2, "priority": "Critical"},
        "Python": {"current": 2, "required": 4, "gap": 2, "priority": "High"},
        "Data Visualization": {"current": 2, "required": 4, "gap": 2, "priority": "High"},
        "R": {"current": 3, "required": 4, "gap": 1, "priority": "Moderate"},
        "SQL": {"current": 3, "required": 4, "gap": 1, "priority": "Moderate"},
        "Survey Design": {"current": 4, "required": 4, "gap": 0, "priority": "None"},
        "Sampling": {"current": 4, "required": 4, "gap": 0, "priority": "None"},
        "National Accounts": {"current": 3, "required": 4, "gap": 1, "priority": "Moderate"},
        "Leadership": {"current": 3, "required": 4, "gap": 1, "priority": "Moderate"},
        "Cybersecurity": {"current": 2, "required": 3, "gap": 1, "priority": "Moderate"},
    },
    "learning_path": [
        {
            "id": "lp_01",
            "phase": "Phase 1 — Foundation",
            "title": "Python for Official Data Analysis",
            "duration": "8 hours",
            "priority": "High",
            "source": "iGOT Karmayogi",
            "provider": "MoSPI / iGOT",
            "competency": "Python",
            "status": "In Progress",
            "progress": 60,
            "targetLevel": "Level 3"
        },
        {
            "id": "lp_02",
            "phase": "Phase 2 — Applied Skills",
            "title": "Data Visualization & Dashboarding for Official Statistics",
            "duration": "6 hours",
            "priority": "High",
            "source": "iGOT Karmayogi",
            "provider": "NIC / MoSPI",
            "competency": "Data Visualization",
            "status": "Not Started",
            "progress": 0,
            "targetLevel": "Level 4"
        },
        {
            "id": "lp_03",
            "phase": "Phase 3 — Advanced",
            "title": "Machine Learning & AI for Government Statistical Analytics",
            "duration": "12 hours",
            "priority": "Critical",
            "source": "iGOT Karmayogi",
            "provider": "NSSTA / IIT",
            "competency": "AI/ML",
            "status": "Not Started",
            "progress": 0,
            "targetLevel": "Level 3"
        }
    ],
    "overall_competency_score": 68,
    "assessments_completed": 12,
    "learning_hours": 42.5,
    "last_assessment_result": None,
    "igot_sync_status": {
        "status": "Connected",
        "last_sync": "29 Aug 2026, 10:15 PM",
        "courses_synced": 2486,
        "active_users": 12480
    }
}

class StatSkillHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        # REST API Router
        if path.startswith("/api/"):
            self.handle_api_get(path, query)
            return

        # Serve static files or fallback to index.html for SPA
        if not os.path.exists(os.path.join(STATIC_DIR, path.lstrip('/'))) or path == '/':
            self.path = '/index.html'
        return super().do_GET()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else "{}"
        try:
            body = json.loads(post_data)
        except Exception:
            body = {}

        if path.startswith("/api/"):
            self.handle_api_post(path, body)
            return

        self.send_error(404, "Endpoint not found")

    def send_json(self, data, status_code=200):
        response_bytes = json.dumps(data).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(response_bytes)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def handle_api_get(self, path, query):
        if path == "/api/state":
            self.send_json({"success": True, "state": STATE})
        elif path == "/api/competencies":
            self.send_json({"success": True, "competencies": STATE["user_competencies"]})
        elif path == "/api/learning-path":
            self.send_json({"success": True, "learning_path": STATE["learning_path"]})
        elif path == "/api/igot/status":
            self.send_json({"success": True, "igot_sync": STATE["igot_sync_status"]})
        elif path == "/api/health":
            self.send_json({"status": "healthy", "platform": "StatSkill AI - MoSPI", "timestamp": time.time()})
        elif path == "/api/ai/groq-status":
            self.send_json({"success": True, "status": groq_quiz_client.get_status()})
        elif path == "/api/states":
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT DISTINCT state FROM state_departments ORDER BY state")
            rows = cursor.fetchall()
            conn.close()
            self.send_json([r["state"] for r in rows])
        elif path == "/api/ministries/central":
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT id, name FROM ministries WHERE parent_ministry IS NULL ORDER BY name")
            rows = cursor.fetchall()
            conn.close()
            self.send_json([{"id": r["id"], "name": r["name"]} for r in rows])
        elif path.startswith("/api/ministries/central/") and path.endswith("/departments"):
            parts = [p for p in path.split('/') if p]
            if len(parts) >= 5 and parts[4] == 'departments':
                ministry_id = parts[3]
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("SELECT id, name FROM ministries WHERE parent_ministry = ? ORDER BY name", (ministry_id,))
                rows = cursor.fetchall()
                conn.close()
                self.send_json([{"id": r["id"], "name": r["name"]} for r in rows])
            else:
                self.send_json({"error": "Invalid URL format"}, status_code=400)
        elif path.startswith("/api/departments/state/"):
            state_encoded = path[len("/api/departments/state/"):]
            state_name = urllib.parse.unquote(state_encoded)
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT id, name FROM state_departments WHERE state = ? AND parent_ministry IS NULL ORDER BY name", (state_name,))
            rows = cursor.fetchall()
            conn.close()
            self.send_json([{"id": r["id"], "name": r["name"]} for r in rows])
        elif path == "/api/profile":
            identifier = (query.get("email", [""])[0] or query.get("identifier", [""])[0] or query.get("id", [""])[0]).lower().strip()
            identifier_clean = re.sub(r"\D", "", identifier)
            conn = get_db_connection()
            cursor = conn.cursor()
            if identifier:
                cursor.execute("SELECT * FROM users WHERE LOWER(email) = ? OR mobile = ? OR id = ? OR employee_id = ?", (identifier, identifier_clean, identifier, identifier))
            else:
                cursor.execute("SELECT * FROM users ORDER BY id ASC LIMIT 1")
            row = cursor.fetchone()
            conn.close()
            if row:
                u = dict(row)
                safe_u = {k: v for k, v in u.items() if k not in ["password_hash", "salt"]}
                self.send_json({"success": True, "profile": safe_u, "user": safe_u})
            else:
                self.send_json({"success": False, "error": "Profile not found"}, status_code=404)
        elif path == "/api/users":
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, email, mobile, role, employee_id, org_type, ministry_id, state, department, organisation, designation, experience_years, degree, specialization, statistical_domains, current_assignment, location, overall_score, learning_hours, registered_at FROM users ORDER BY id DESC")
            rows = cursor.fetchall()
            conn.close()
            users_list = [dict(r) for r in rows]
            self.send_json({"success": True, "count": len(users_list), "users": users_list})
        else:
            self.send_json({"error": "Unknown API GET endpoint", "path": path}, status_code=404)

    def handle_api_post(self, path, body):

        # -------------------------------------------------------------
        # ROUTE 1: POST /api/auth/send-otp
        # -------------------------------------------------------------
        if path == "/api/auth/send-otp":
            mobile = (body.get("mobile") or "").strip()
            mobile_clean = re.sub(r"\D", "", mobile)
            email = (body.get("email") or "").lower().strip()
            ministry = (body.get("ministry") or "").strip()

            identifier = None
            channel = "email"

            if mobile_clean and len(mobile_clean) == 10 and re.match(r"^[6-9]\d{9}$", mobile_clean):
                identifier = mobile_clean
                channel = "sms"
            elif email and re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
                identifier = email
                channel = "email"
            else:
                self.send_json({"success": False, "error": "Please enter a valid 10-digit mobile number (e.g. 9876543210) or official email"}, status_code=400)
                return

            if not ministry or ministry == "-- Select Ministry or Department --":
                self.send_json({"success": False, "error": "Please select a Ministry or Department"}, status_code=400)
                return

            # Check if mobile or email is already registered in USERS cache or SQLite
            is_already_registered = False
            if identifier in USERS:
                is_already_registered = True
            else:
                for u in USERS.values():
                    if u.get("mobile") == mobile_clean or (email and u.get("email") == email):
                        is_already_registered = True
                        break

            if not is_already_registered:
                try:
                    conn = get_db_connection()
                    cursor = conn.cursor()
                    cursor.execute("SELECT id FROM users WHERE LOWER(email) = ? OR mobile = ?", (email if email else identifier, mobile_clean if mobile_clean else identifier))
                    if cursor.fetchone():
                        is_already_registered = True
                    conn.close()
                except Exception:
                    pass

            if is_already_registered:
                self.send_json({
                    "success": False,
                    "alreadyRegistered": True,
                    "error": f"The {'mobile number +91 ' + mobile_clean if channel == 'sms' else 'email ' + email} is already registered. Please log in with your credentials."
                }, status_code=400)
                return

            # Generate brand new 6-digit OTP code
            otp = f"{random.randint(100000, 999999)}"
            OTP_STORE[identifier] = {
                "otp": otp,
                "expires": time.time() + 300,
                "ministry": ministry,
                "mobile": mobile_clean,
                "email": email,
                "channel": channel
            }

            if channel == "email" and email:
                send_smtp_otp(email, otp)
            else:
                sent_real, msg = send_real_sms_otp(mobile_clean, otp)
                if not sent_real:
                    print(f"[SMS DEV NOTICE] >>> Real SMS delivery requires SMS gateway API key. Demo OTP [{otp}] generated for +91-{mobile_clean} <<<")

            self.send_json({
                "success": True,
                "message": f"Verification OTP code sent successfully to +91 {mobile_clean}" if channel == "sms" else "Verification OTP sent to your email address",
                "otp": otp,
                "identifier": identifier,
                "mobile": mobile_clean,
                "email": email,
                "channel": channel
            })
            return

        # -------------------------------------------------------------
        # ROUTE 2: POST /api/auth/verify-otp
        # -------------------------------------------------------------
        elif path == "/api/auth/verify-otp":
            identifier = (body.get("identifier") or body.get("mobile") or body.get("email") or "").lower().strip()
            if not identifier:
                identifier = (body.get("email") or "").lower().strip()
            identifier_clean = re.sub(r"\D", "", identifier) if re.match(r"^\d{10}$", identifier) else identifier

            otp = str(body.get("otp") or "").strip()

            if not identifier or not otp:
                self.send_json({"success": False, "error": "Mobile/Email identifier and 6-digit OTP are required"}, status_code=400)
                return

            record = OTP_STORE.get(identifier) or OTP_STORE.get(identifier_clean)
            if not record:
                # Also search values
                for k, v in OTP_STORE.items():
                    if v.get("mobile") == identifier_clean or v.get("email") == identifier:
                        record = v
                        identifier = k
                        break

            if not record or record["otp"] != otp or time.time() > record["expires"]:
                self.send_json({"success": False, "error": "Invalid OTP code entered. Please re-enter the code or request a new OTP."}, status_code=400)
                return

            VERIFIED_EMAILS.add(identifier)
            if record.get("mobile"):
                VERIFIED_EMAILS.add(record["mobile"])
            if record.get("email"):
                VERIFIED_EMAILS.add(record["email"])

            if identifier in OTP_STORE:
                del OTP_STORE[identifier]

            self.send_json({"success": True, "message": "OTP verification successful"})
            return

        # -------------------------------------------------------------
        # ROUTE 3: POST /api/auth/register
        # -------------------------------------------------------------
        elif path in ["/api/auth/register", "/api/register"]:
            email = (body.get("email") or "").lower().strip()
            mobile = re.sub(r"\D", "", str(body.get("mobile") or ""))
            name = (body.get("name") or "").strip()
            ministry = (body.get("ministry") or "Ministry of Statistics & Programme Implementation (MoSPI)").strip()
            department = (body.get("department") or ministry).strip()
            org_type = (body.get("gov_type") or body.get("org_type") or "Central Government").strip()
            designation_raw = body.get("designation") or "Senior Statistical Officer (SSO)"
            if isinstance(designation_raw, dict):
                designation = designation_raw.get("title") or designation_raw.get("name") or "Senior Statistical Officer (SSO)"
            else:
                designation = str(designation_raw).strip()
            if "[object Object]" in designation or not designation:
                designation = "Senior Statistical Officer (SSO)"
            
            role_grade = (body.get("role_grade") or body.get("roleGrade") or body.get("grade") or "R3").strip()
            sector_tag = (body.get("sector_tag") or body.get("sectorTag") or "Official Statistics").strip()
            d6_competencies = (body.get("d6_competencies") or body.get("d6Competencies") or "").strip()
            password = body.get("password") or ""

            if not email and mobile:
                email = f"{mobile}@nic.gov.in"

            if not email:
                self.send_json({"success": False, "error": "Email address or 10-digit mobile number is required"}, status_code=400)
                return

            if email not in VERIFIED_EMAILS and mobile not in VERIFIED_EMAILS:
                self.send_json({"success": False, "error": "Mobile or Email verification via OTP is required before registration"}, status_code=400)
                return

            if email in USERS:
                self.send_json({"success": False, "error": "An account with this email/mobile is already registered. Please log in."}, status_code=400)
                return

            # Password Strength Validation: min 8 chars, 1 letter, 1 number
            if len(password) < 8 or not any(c.isdigit() for c in password) or not any(c.isalpha() for c in password):
                self.send_json({"success": False, "error": "Password must be at least 8 characters long and contain both letters and numbers"}, status_code=400)
                return

            # Auto-generate Official ID format {CADRE}/{YEAR}/{5-digit-number}
            year = time.strftime("%Y")
            num_hash = (int(hashlib.sha256(email.encode('utf-8')).hexdigest()[:8], 16) % 90000) + 10000
            cadre = "ISS" if ("mospi" in ministry.lower() or "central" in ministry.lower() or "statistical" in ministry.lower()) else "SSS"
            official_id = f"{cadre}/{year}/{num_hash}"

            hashed, salt = hash_password(password)
            user_name = name if name else email.split('@')[0].replace('.', ' ').replace('_', ' ').title()

            user_record = {
                "id": f"usr_{secrets.token_hex(6)}",
                "email": email,
                "mobile": mobile,
                "name": user_name,
                "ministry": ministry,
                "department": department,
                "designation": designation,
                "role": designation,
                "roleGrade": role_grade,
                "role_grade": role_grade,
                "sectorTag": sector_tag,
                "sector_tag": sector_tag,
                "d6Competencies": d6_competencies,
                "d6_competencies": d6_competencies,
                "employeeId": official_id,
                "employee_id": official_id,
                "org_type": org_type,
                "experienceYears": None,
                "experience_years": None,
                "degree": "",
                "specialization": "",
                "statisticalDomains": "",
                "statistical_domains": "",
                "previousRoles": "",
                "previous_roles": "",
                "projectsHandled": "",
                "projects_handled": "",
                "technicalQualifications": "",
                "technical_qualifications": "",
                "trainingProgrammes": "",
                "training_programmes": "",
                "currentAssignment": "",
                "current_assignment": "",
                "location": "",
                "profileCompleted": False,
                "profile_completed": 0,
                "password_hash": hashed,
                "salt": salt,
                "overallScore": 0,
                "learningHours": 0.0,
                "registered_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }

            USERS[email] = user_record
            save_users()

            # Also persist into SQLite users table for system compatibility
            try:
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT OR REPLACE INTO users 
                    (name, email, mobile, password_hash, salt, role, employee_id, org_type, ministry_id, department, organisation, designation,
                     experience_years, degree, specialization, statistical_domains, previous_roles, projects_handled, technical_qualifications, training_programmes, current_assignment, location, profile_completed,
                     role_grade, sector_tag, d6_competencies)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (user_name, email, mobile, hashed, salt, "learner", official_id, org_type, ministry, department, "org_sdrd", designation,
                      None, "", "", "", "", "", "", "", "", "", 0,
                      role_grade, sector_tag, d6_competencies))
                conn.commit()
                conn.close()
                print(f"[DB Success] Registered new user '{user_name}' ({email}, mobile: {mobile}, grade: {role_grade}, sector: {sector_tag}) into SQLite.")
            except Exception as e:
                print(f"[DB Warning] Could not persist registration to SQLite: {e}")

            safe_user = {k: v for k, v in user_record.items() if k not in ["password_hash", "salt"]}
            token = f"token_registered_{secrets.token_hex(8)}"
            self.send_json({"success": True, "token": token, "user": safe_user, "officer": safe_user})
            return

        # -------------------------------------------------------------
        # ROUTE 4: POST /api/auth/login-send-otp (Login Step 1: Send OTP)
        # -------------------------------------------------------------
        elif path == "/api/auth/login-send-otp":
            identifier = (body.get("email") or body.get("identifier") or body.get("mobile") or "").lower().strip()
            identifier_clean = re.sub(r"\D", "", identifier)
            password = body.get("password") or ""
            is_passwordless = body.get("passwordless", False)

            user = USERS.get(identifier)
            if not user and identifier_clean and len(identifier_clean) == 10:
                for u in USERS.values():
                    if u.get("mobile") == identifier_clean:
                        user = u
                        break

            # Fallback check against SQLite users table
            if not user:
                try:
                    conn = get_db_connection()
                    cursor = conn.cursor()
                    cursor.execute("SELECT * FROM users WHERE LOWER(email) = ? OR mobile = ?", (identifier, identifier_clean if len(identifier_clean) == 10 else identifier))
                    row = cursor.fetchone()
                    conn.close()
                    if row:
                        u = dict(row)
                        user = {
                            "id": str(u["id"]),
                            "email": u["email"],
                            "mobile": u.get("mobile") or "",
                            "name": u["name"],
                            "ministry": u.get("ministry_id") or "Ministry of Statistics & Programme Implementation",
                            "department": u.get("department") or "National Statistical Office (NSO)",
                            "designation": u.get("designation") or "Senior Statistical Officer (SSO)",
                            "role": u.get("designation") or "Senior Statistical Officer (SSO)",
                            "employeeId": u.get("employee_id") or "ISS/2026/84920",
                            "password_hash": u.get("password_hash"),
                            "salt": u.get("salt"),
                            "overallScore": u.get("overall_score") or 68,
                            "learningHours": u.get("learning_hours") or 42.5
                        }
                except Exception:
                    pass

            if not user:
                self.send_json({"success": False, "error": "Account not found with this mobile number or email. Please register first."}, status_code=404)
                return

            if not is_passwordless and password:
                if not user.get("password_hash") or not user.get("salt"):
                    self.send_json({"success": False, "error": "Invalid login credentials. Please try again."}, status_code=401)
                    return
                expected_hash = hashlib.sha256((password + user["salt"]).encode('utf-8')).hexdigest()
                if expected_hash != user["password_hash"]:
                    self.send_json({"success": False, "error": "Invalid password entered. Please try again."}, status_code=401)
                    return

            # Generate 6-digit Login OTP
            otp = f"{random.randint(100000, 999999)}"
            login_key = f"login_{identifier}"
            OTP_STORE[login_key] = {
                "otp": otp,
                "expires": time.time() + 300,
                "user": user,
                "identifier": identifier
            }

            mobile_target = user.get("mobile") or identifier_clean
            email_target = user.get("email") or identifier

            if mobile_target and len(mobile_target) == 10:
                sent_real, msg = send_real_sms_otp(mobile_target, otp)
                if not sent_real:
                    print(f"[LOGIN SMS DEV NOTICE] >>> Real SMS delivery requires SMS gateway API key. Demo Login OTP [{otp}] generated for +91-{mobile_target} <<<")
            elif email_target and "@" in email_target:
                send_smtp_otp(email_target, otp)

            self.send_json({
                "success": True,
                "message": f"Login OTP dispatched to registered mobile number +91 {mobile_target}" if mobile_target else "Login OTP sent to your email",
                "otp": otp,
                "identifier": identifier,
                "mobile": mobile_target,
                "email": email_target
            })
            return

        # -------------------------------------------------------------
        # ROUTE 5: POST /api/auth/login-verify-otp (Login Step 2: Verify OTP)
        # -------------------------------------------------------------
        elif path == "/api/auth/login-verify-otp":
            identifier = (body.get("identifier") or body.get("mobile") or body.get("email") or "").lower().strip()
            otp_entered = str(body.get("otp", "")).strip()

            login_key = f"login_{identifier}"
            record = OTP_STORE.get(login_key)

            if not record:
                # Try finding by mobile clean
                clean_id = re.sub(r"\D", "", identifier)
                for k, v in list(OTP_STORE.items()):
                    if k.startswith("login_") and (v.get("identifier") == clean_id or v.get("user", {}).get("mobile") == clean_id):
                        record = v
                        login_key = k
                        break

            if not record:
                self.send_json({"success": False, "error": "No active login session found. Please request a new OTP code."}, status_code=400)
                return

            if time.time() > record["expires"]:
                del OTP_STORE[login_key]
                self.send_json({"success": False, "error": "Login OTP has expired. Please request a new code."}, status_code=400)
                return

            if record["otp"] != otp_entered:
                self.send_json({"success": False, "error": "Invalid OTP code entered. Please re-enter the code or request a new OTP."}, status_code=400)
                return

            # Success -> Issue Token
            user = record["user"]
            del OTP_STORE[login_key]

            safe_user = {k: v for k, v in user.items() if k not in ["password_hash", "salt"]}
            token = f"token_login_{secrets.token_hex(8)}"

            # Audit log to SQLite
            try:
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ? OR LOWER(email) = ?", (safe_user.get("id"), safe_user.get("email")))
                ip_addr = self.client_address[0] if hasattr(self, 'client_address') and self.client_address else '127.0.0.1'
                cursor.execute("""
                    INSERT INTO login_audit_logs (user_id, email, name, ip_address, login_time, status)
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, 'SUCCESS')
                """, (safe_user.get("id") or safe_user.get("employeeId"), safe_user.get("email"), safe_user.get("name"), ip_addr))
                conn.commit()
                conn.close()
                print(f"[DB Audit] Recorded successful OTP login for '{safe_user.get('name')}' into SQLite database.")
            except Exception as e:
                print(f"[DB Warning] Could not log login event to SQLite: {e}")

            self.send_json({"success": True, "token": token, "user": safe_user, "role": safe_user.get("role", "learner")})
            return

        # -------------------------------------------------------------
        # ROUTE 6: POST /api/auth/login (Direct Credential Auth)
        # -------------------------------------------------------------
        elif path == "/api/auth/login":
            identifier = (body.get("email") or body.get("identifier") or body.get("mobile") or "").lower().strip()
            identifier_clean = re.sub(r"\D", "", identifier)
            password = body.get("password") or ""

            user = USERS.get(identifier)

            if not user and identifier_clean and len(identifier_clean) == 10:
                for u in USERS.values():
                    if u.get("mobile") == identifier_clean:
                        user = u
                        break

            # Fallback check against SQLite users table
            if not user:
                try:
                    conn = get_db_connection()
                    cursor = conn.cursor()
                    cursor.execute("SELECT * FROM users WHERE LOWER(email) = ? OR mobile = ?", (identifier, identifier_clean if len(identifier_clean) == 10 else identifier))
                    row = cursor.fetchone()
                    conn.close()
                    if row:
                        u = dict(row)
                        user = {
                            "id": str(u["id"]),
                            "email": u["email"],
                            "mobile": u.get("mobile") or "",
                            "name": u["name"],
                            "ministry": u.get("ministry_id") or "Ministry of Statistics & Programme Implementation",
                            "department": u.get("department") or "National Statistical Office (NSO)",
                            "designation": u.get("designation") or "Senior Statistical Officer (SSO)",
                            "role": u.get("designation") or "Senior Statistical Officer (SSO)",
                            "employeeId": u.get("employee_id") or "ISS/2026/84920",
                            "password_hash": u.get("password_hash"),
                            "salt": u.get("salt"),
                            "overallScore": u.get("overall_score") or 68,
                            "learningHours": u.get("learning_hours") or 42.5
                        }
                except Exception:
                    pass

            if not user or not user.get("password_hash") or not user.get("salt"):
                self.send_json({"success": False, "error": "Invalid mobile/email or password"}, status_code=401)
                return

            expected_hash = hashlib.sha256((password + user["salt"]).encode('utf-8')).hexdigest()
            if expected_hash != user["password_hash"]:
                self.send_json({"success": False, "error": "Invalid mobile/email or password"}, status_code=401)
                return

            safe_user = {k: v for k, v in user.items() if k not in ["password_hash", "salt"]}
            token = f"token_login_{secrets.token_hex(8)}"

            # Persist login timestamp & audit entry into SQLite database
            try:
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ? OR LOWER(email) = ?", (safe_user.get("id"), safe_user.get("email")))
                ip_addr = self.client_address[0] if hasattr(self, 'client_address') and self.client_address else '127.0.0.1'
                cursor.execute("""
                    INSERT INTO login_audit_logs (user_id, email, name, ip_address, login_time, status)
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, 'SUCCESS')
                """, (safe_user.get("id") or safe_user.get("employeeId"), safe_user.get("email"), safe_user.get("name"), ip_addr))
                conn.commit()
                conn.close()
                print(f"[DB Audit] Recorded direct login for '{safe_user.get('name')}' into SQLite database.")
            except Exception as e:
                print(f"[DB Warning] Could not log login event to SQLite: {e}")

            self.send_json({"success": True, "token": token, "user": safe_user, "role": safe_user.get("role", "learner")})
            return

        elif path == "/api/auth/nodal-request":
            ticket_id = f"NODAL-REQ-{random.randint(100000, 999999)}"
            request_record = {
                "ticket_id": ticket_id,
                "org_name": body.get("orgName", ""),
                "contact": body.get("contact", ""),
                "remarks": body.get("remarks", ""),
                "draft_info": body.get("draftInfo", {}),
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            self.send_json({
                "success": True,
                "ticketId": ticket_id,
                "message": "Assistance request logged and routed to the designated Nodal Officer.",
                "record": request_record
            })
            return

        elif path == "/api/profile/update":
            identifier = (body.get("email") or body.get("identifier") or body.get("mobile") or "").lower().strip()
            clean_id = re.sub(r"\D", "", identifier)
            
            # Extract Block 1 profile data
            name = body.get("name")
            designation_raw = body.get("designation")
            if isinstance(designation_raw, dict):
                designation = designation_raw.get("title") or designation_raw.get("name") or "Senior Statistical Officer (SSO)"
            else:
                designation = str(designation_raw).strip() if designation_raw else None
            if designation and ("[object Object]" in designation or designation == ""):
                designation = "Senior Statistical Officer (SSO)"

            department = body.get("department")
            ministry = body.get("ministry")
            experience_years = float(body.get("experienceYears") or body.get("experience_years") or 4.0)
            degree = body.get("degree") or "M.Sc. Statistics"
            specialization = body.get("specialization") or "Mathematical Statistics & Survey Methodology"
            statistical_domains = body.get("statisticalDomains") or body.get("statistical_domains") or "Survey Design, Sampling, National Accounts, Price Statistics"
            if isinstance(statistical_domains, list):
                statistical_domains = ", ".join(statistical_domains)
            previous_roles = body.get("previousRoles") or body.get("previous_roles") or "Junior Statistical Officer, Statistical Investigator"
            if isinstance(previous_roles, list):
                previous_roles = ", ".join(previous_roles)
            projects_handled = body.get("projectsHandled") or body.get("projects_handled") or "Periodic Labour Force Survey (PLFS), Consumer Expenditure Survey (CES)"
            if isinstance(projects_handled, list):
                projects_handled = ", ".join(projects_handled)
            technical_qualifications = body.get("technicalQualifications") or body.get("technical_qualifications") or "Python, R, SPSS, Stata, SQL, PowerBI, Advanced Excel"
            if isinstance(technical_qualifications, list):
                technical_qualifications = ", ".join(technical_qualifications)
            training_programmes = body.get("trainingProgrammes") or body.get("training_programmes") or "NSSTA Greater Noida, iGOT Karmayogi"
            if isinstance(training_programmes, list):
                training_programmes = ", ".join(training_programmes)
            current_assignment = body.get("currentAssignment") or body.get("current_assignment") or "Survey Design & Research Division (SDRD), PLFS & Price Indices"
            location = body.get("location") or "Sankhyiki Bhawan, New Delhi"
            role_grade = body.get("role_grade") or body.get("roleGrade") or body.get("grade")
            sector_tag = body.get("sector_tag") or body.get("sectorTag")
            d6_competencies = body.get("d6_competencies") or body.get("d6Competencies")

            # Update SQLite database
            try:
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("""
                    UPDATE users SET 
                        name = COALESCE(?, name),
                        ministry_id = COALESCE(?, ministry_id),
                        department = COALESCE(?, department),
                        designation = COALESCE(?, designation),
                        role_grade = COALESCE(?, role_grade),
                        sector_tag = COALESCE(?, sector_tag),
                        d6_competencies = COALESCE(?, d6_competencies),
                        experience_years = ?, 
                        degree = ?, 
                        specialization = ?, 
                        statistical_domains = ?, 
                        previous_roles = ?, 
                        projects_handled = ?, 
                        technical_qualifications = ?, 
                        training_programmes = ?, 
                        current_assignment = ?, 
                        location = ?,
                        profile_completed = 1
                    WHERE LOWER(email) = ? OR mobile = ? OR id = ? OR employee_id = ?
                """, (
                    name if (name and name.strip()) else None,
                    ministry if (ministry and ministry.strip()) else None,
                    department if (department and department.strip()) else None,
                    designation if (designation and designation.strip()) else None,
                    role_grade if (role_grade and role_grade.strip()) else None,
                    sector_tag if (sector_tag and sector_tag.strip()) else None,
                    d6_competencies if (d6_competencies and d6_competencies.strip()) else None,
                    experience_years, degree, specialization, statistical_domains,
                    previous_roles, projects_handled, technical_qualifications,
                    training_programmes, current_assignment, location,
                    identifier, clean_id, identifier, identifier
                ))
                conn.commit()

                # Fetch updated record
                cursor.execute("SELECT * FROM users WHERE LOWER(email) = ? OR mobile = ? OR id = ? OR employee_id = ?", (identifier, clean_id, identifier, identifier))
                row = cursor.fetchone()
                conn.close()

                if row:
                    u = row_to_user_dict(dict(row))
                    safe_u = {k: v for k, v in u.items() if k not in ["password_hash", "salt"]}
                    # Sync to in-memory USERS
                    if identifier in USERS:
                        USERS[identifier].update(safe_u)
                        save_users()
                    self.send_json({
                        "success": True, 
                        "message": "Block 1 — Digital Competency Profile updated successfully!",
                        "user": safe_u,
                        "profile": safe_u
                    })
                    return
            except Exception as e:
                print(f"[DB Error] Profile update failed: {e}")

            # In-memory fallback
            if identifier in USERS:
                USERS[identifier].update({
                    "experienceYears": experience_years,
                    "degree": degree,
                    "specialization": specialization,
                    "statisticalDomains": statistical_domains,
                    "previousRoles": previous_roles,
                    "projectsHandled": projects_handled,
                    "technicalQualifications": technical_qualifications,
                    "trainingProgrammes": training_programmes,
                    "currentAssignment": current_assignment,
                    "location": location,
                    "profileCompleted": True
                })
                save_users()
                self.send_json({"success": True, "message": "Profile updated in memory", "user": USERS[identifier]})
            else:
                self.send_json({"success": True, "message": "Profile saved", "user": body})
            return

        # -------------------------------------------------------------
        # ROUTE: POST /api/ai/groq-config (Configure Groq API Key & Model)
        # -------------------------------------------------------------
        elif path == "/api/ai/groq-config":
            key = body.get("apiKey") or body.get("api_key")
            model = body.get("model")
            if key is not None:
                groq_quiz_client.set_api_key(key)
            if model:
                groq_quiz_client.model = model
            self.send_json({
                "success": True,
                "message": "Groq configuration updated successfully",
                "status": groq_quiz_client.get_status()
            })
            return

        # -------------------------------------------------------------
        # ROUTE: POST /api/ai/generate-ministry-quiz (Groq LPU Quiz Generator)
        # -------------------------------------------------------------
        elif path == "/api/ai/generate-ministry-quiz":
            ministry = body.get("ministry") or "Ministry of Statistics & Programme Implementation"
            department = body.get("department") or "National Statistical Office (NSO - NAD)"
            sector_tag = body.get("sectorTag") or body.get("sector_tag") or "Official Statistics"
            d6_competencies = body.get("d6Competencies") or body.get("d6_competencies") or []
            role_grade = body.get("roleGrade") or body.get("role_grade") or "R3"
            num_questions = body.get("numQuestions") or body.get("num_questions") or 5
            difficulty = body.get("difficulty") or "Medium"
            bloom_level = body.get("bloomLevel") or body.get("bloom_level") or "Apply"
            topic = body.get("topic") or None
            language = body.get("language") or "English"

            quiz_res = groq_quiz_client.generate_quiz(
                ministry=ministry,
                department=department,
                sector_tag=sector_tag,
                d6_competencies=d6_competencies,
                role_grade=role_grade,
                num_questions=num_questions,
                difficulty=difficulty,
                bloom_level=bloom_level,
                topic=topic,
                language=language
            )
            self.send_json(quiz_res)
            return

        # -------------------------------------------------------------
        # ROUTE: POST /api/ai/generate-questions (Adaptive AI Questions)
        # -------------------------------------------------------------
        elif path == "/api/ai/generate-questions":
            domains = body.get("domains") or ["Survey Design", "Sampling", "National Accounts", "Python & Analytics", "DPDP Act"]
            experience = float(body.get("experienceYears") or body.get("experience") or 4.0)
            role = body.get("role") or "Statistical Officer"
            degree = body.get("degree") or "Statistics"
            doc_name = body.get("document_name") or "Official Statistical Manual"
            num_q = int(body.get("num_questions") or 5)

            # Delegate to Groq wrapper if configured or requested
            quiz_res = groq_quiz_client.generate_quiz(
                ministry=body.get("ministry", "Ministry of Statistics & Programme Implementation"),
                department=body.get("department", "National Statistical Office (NSO)"),
                sector_tag=body.get("sectorTag", "Survey Methodology & Official Statistics"),
                d6_competencies=domains,
                role_grade=body.get("roleGrade", "R3"),
                num_questions=num_q,
                difficulty=body.get("difficulty", "Medium"),
                bloom_level=body.get("bloom_level", "Apply"),
                topic=f"Knowledge extraction from {doc_name}",
                language=body.get("language", "English")
            )
            self.send_json(quiz_res)
            return

        elif path == "/api/assessments/submit":
            score = body.get("score", 82)
            STATE["assessments_completed"] += 1
            STATE["overall_competency_score"] = min(100, STATE["overall_competency_score"] + 6)
            STATE["learning_hours"] += 1.5
            self.send_json({
                "success": True,
                "message": "Assessment submitted successfully",
                "new_overall_score": STATE["overall_competency_score"],
                "total_assessments": STATE["assessments_completed"]
            })
            return

        else:
            self.send_json({"error": "Unknown API POST endpoint", "path": path}, status_code=404)

def run_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), StatSkillHandler) as httpd:
        print(f"=======================================================")
        print(f"StatSkill AI Server running at http://localhost:{PORT}")
        print(f"=======================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.server_close()

if __name__ == "__main__":
    run_server()
