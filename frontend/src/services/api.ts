import { Student, Assessment, AttendanceRecord, AssignmentRecord, Intervention, AIRecommendation, RiskAssessment, DashboardSummary, StudentSuccessIndex, SSIWeights } from '../types';
import { DEMO_STUDENTS, DEMO_ASSESSMENTS, DEMO_ASSIGNMENTS, DEMO_INTERVENTIONS, DEMO_AI_RECOMMENDATIONS } from '../data/demoData';
import { calculateStudentRisk } from '../utils/riskEngine';
import { calculateClientSSI } from '../utils/ssiEngine';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// In-memory demo store for mutable interactions during Demo Mode
let localDemoStudents = [...DEMO_STUDENTS];
let localDemoAssessments = [...DEMO_ASSESSMENTS];
let localDemoAssignments = [...DEMO_ASSIGNMENTS];
let localDemoInterventions = [...DEMO_INTERVENTIONS];

export const wildfireApi = {
  // Backend Health check
  async checkBackendHealth(): Promise<{ status: string; version?: string; database?: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      throw new ApiError(err.message || 'Backend connection failed', 503);
    }
  },

  // Students API
  async getStudents(isLiveMode: boolean): Promise<Student[]> {
    if (!isLiveMode) {
      return [...localDemoStudents];
    }
    const res = await fetch(`${API_BASE_URL}/students`);
    if (!res.ok) throw new ApiError(`Failed to fetch students (${res.status})`, res.status);
    return await res.json();
  },

  async getStudentById(id: string, isLiveMode: boolean): Promise<Student> {
    if (!isLiveMode) {
      const found = localDemoStudents.find((s) => s.id === id);
      if (!found) throw new ApiError(`Student ${id} not found in demonstration dataset`, 404);
      return { ...found };
    }
    const res = await fetch(`${API_BASE_URL}/students/${id}`);
    if (!res.ok) throw new ApiError(`Student ${id} not found on server`, res.status);
    return await res.json();
  },

  async createStudent(student: Omit<Student, 'riskScore' | 'riskLevel' | 'lastUpdated'>, isLiveMode: boolean): Promise<Student> {
    const risk = calculateStudentRisk(student as any);
    const newStudent: Student = {
      ...student,
      riskScore: risk.score,
      riskLevel: risk.category,
      lastUpdated: new Date().toISOString(),
    };

    if (!isLiveMode) {
      if (localDemoStudents.some((s) => s.id === student.id)) {
        throw new ApiError(`Student with ID ${student.id} already exists`, 400);
      }
      localDemoStudents.unshift(newStudent);
      return newStudent;
    }

    const res = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new ApiError(errData.message || 'Failed to persist student record on server', res.status);
    }
    return await res.json();
  },

  async updateStudent(id: string, updates: Partial<Student>, isLiveMode: boolean): Promise<Student> {
    if (!isLiveMode) {
      const idx = localDemoStudents.findIndex((s) => s.id === id);
      if (idx === -1) throw new ApiError(`Student ${id} not found`, 404);
      const updated = {
        ...localDemoStudents[idx],
        ...updates,
        lastUpdated: new Date().toISOString(),
      };
      // Recalculate risk on changes to marks or attendance
      const risk = calculateStudentRisk(updated as any);
      updated.riskScore = risk.score;
      updated.riskLevel = risk.category;
      localDemoStudents[idx] = updated;
      return updated;
    }

    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new ApiError(`Failed to update student on server`, res.status);
    return await res.json();
  },

  async deleteStudent(id: string, isLiveMode: boolean): Promise<void> {
    if (!isLiveMode) {
      localDemoStudents = localDemoStudents.filter((s) => s.id !== id);
      localDemoAssessments = localDemoAssessments.filter((a) => a.studentId !== id);
      localDemoAssignments = localDemoAssignments.filter((a) => a.studentId !== id);
      localDemoInterventions = localDemoInterventions.filter((i) => i.studentId !== id);
      return;
    }

    const res = await fetch(`${API_BASE_URL}/students/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new ApiError(`Failed to delete student from server`, res.status);
  },

  // Assessments
  async getStudentAssessments(studentId: string, isLiveMode: boolean): Promise<Assessment[]> {
    if (!isLiveMode) {
      return localDemoAssessments.filter((a) => a.studentId === studentId);
    }
    const res = await fetch(`${API_BASE_URL}/students/${studentId}/assessments`);
    if (!res.ok) throw new ApiError(`Failed to fetch assessments`, res.status);
    return await res.json();
  },

  async addAssessment(assessment: Omit<Assessment, 'id' | 'percentage'>, isLiveMode: boolean): Promise<Assessment> {
    const percentage = Math.round((assessment.score / assessment.maxScore) * 100);
    const newRecord: Assessment = {
      ...assessment,
      id: `AS-${Date.now()}`,
      percentage,
    };

    if (!isLiveMode) {
      localDemoAssessments.unshift(newRecord);
      // Update student average score
      const studentAssessments = localDemoAssessments.filter((a) => a.studentId === assessment.studentId);
      const avg = Math.round(studentAssessments.reduce((acc, cur) => acc + cur.percentage, 0) / studentAssessments.length);
      await this.updateStudent(assessment.studentId, { averageScore: avg }, false);
      return newRecord;
    }

    const res = await fetch(`${API_BASE_URL}/students/${assessment.studentId}/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord),
    });
    if (!res.ok) throw new ApiError(`Failed to save assessment`, res.status);
    return await res.json();
  },

  // Assignments
  async getStudentAssignments(studentId: string, isLiveMode: boolean): Promise<AssignmentRecord[]> {
    if (!isLiveMode) {
      return localDemoAssignments.filter((a) => a.studentId === studentId);
    }
    const res = await fetch(`${API_BASE_URL}/students/${studentId}/assignments`);
    if (!res.ok) throw new ApiError(`Failed to fetch assignments`, res.status);
    return await res.json();
  },

  // Interventions
  async getInterventions(isLiveMode: boolean): Promise<Intervention[]> {
    if (!isLiveMode) {
      return [...localDemoInterventions];
    }
    const res = await fetch(`${API_BASE_URL}/interventions`);
    if (!res.ok) throw new ApiError(`Failed to fetch interventions`, res.status);
    return await res.json();
  },

  async createIntervention(intervention: Omit<Intervention, 'id' | 'createdAt' | 'lastUpdated'>, isLiveMode: boolean): Promise<Intervention> {
    const newInt: Intervention = {
      ...intervention,
      id: `INT-${new Date().getFullYear()}-${String(localDemoInterventions.length + 1).padStart(2, '0')}`,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    if (!isLiveMode) {
      localDemoInterventions.unshift(newInt);
      return newInt;
    }

    const res = await fetch(`${API_BASE_URL}/interventions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInt),
    });
    if (!res.ok) throw new ApiError(`Failed to create intervention`, res.status);
    return await res.json();
  },

  async updateIntervention(id: string, updates: Partial<Intervention>, isLiveMode: boolean): Promise<Intervention> {
    if (!isLiveMode) {
      const idx = localDemoInterventions.findIndex((i) => i.id === id);
      if (idx === -1) throw new ApiError(`Intervention ${id} not found`, 404);
      const updated = {
        ...localDemoInterventions[idx],
        ...updates,
        lastUpdated: new Date().toISOString(),
      };
      localDemoInterventions[idx] = updated;
      return updated;
    }

    const res = await fetch(`${API_BASE_URL}/interventions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new ApiError(`Failed to update intervention`, res.status);
    return await res.json();
  },

  // AI Insights
  async getAIRecommendation(studentId: string, isLiveMode: boolean): Promise<AIRecommendation> {
    if (!isLiveMode) {
      const demoRec = DEMO_AI_RECOMMENDATIONS[studentId];
      if (demoRec) return demoRec;

      // Generate dynamic grounded demo insight for newly created students
      const student = localDemoStudents.find((s) => s.id === studentId);
      return {
        summary: `${student?.name || 'The student'} currently holds an average score of ${student?.averageScore.toFixed(1)}% with ${student?.attendanceRate.toFixed(1)}% attendance. Academic trend is currently categorized as ${student?.trend}.`,
        evidence: [
          `Attendance is logged at ${student?.attendanceRate.toFixed(1)}%.`,
          `Cumulative course average stands at ${student?.averageScore.toFixed(1)}%.`,
          `Trajectory evaluation indicates a ${student?.trend} performance path.`,
        ],
        possibleContributingFactors: [
          'Variable study schedules between lecture and practical work.',
          'Pacing in core coursework requires additional tutorial reinforcement.',
        ],
        studyRecommendations: [
          'Schedule regular 45-minute revision blocks following each core module lecture.',
          'Attend open peer-tutoring sessions for clarification on ambiguous concepts.',
        ],
        teacherActions: [
          'Conduct a check-in meeting to assess comprehension of foundational modules.',
          'Monitor upcoming assessment submissions for early warning indicators.',
        ],
        priority: student && student.riskScore >= 65 ? 'high' : student && student.riskScore >= 35 ? 'medium' : 'low',
        suggestedReviewDays: 14,
        uncertainties: ['Detailed historical prerequisite grades from previous terms are pending synchronization.'],
        safetyNotice: 'This advisory serves as an educational support indicator for authorized instructors only.',
      };
    }

    const res = await fetch(`${API_BASE_URL}/ai/student-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err.message || 'AI service unavailable. Preserving rule-based calculations.', res.status);
    }
    return await res.json();
  },

  // AI Tutor Interactive Chat
  async askAITutor(
    studentId: string,
    message: string,
    student: Student,
    history?: { sender: 'student' | 'tutor'; text: string }[],
    isLiveMode?: boolean
  ): Promise<{
    reply: string;
    suggestedPrompts: string[];
    evidenceUsed: string[];
    groundPlan?: AIRecommendation;
  }> {
    if (isLiveMode) {
      try {
        const res = await fetch(`${API_BASE_URL}/ai/tutor-chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId,
            message,
            history: history?.map((h) => ({ sender: h.sender, text: h.text })),
          }),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('[AI Tutor] Live endpoint unreachable, using client-side grounded reasoning.', err);
      }
    }

    // Client-side grounded reasoning engine using real student records
    const qLower = message.toLowerCase();
    const evidenceUsed: string[] = [
      `Average Score: ${student.averageScore.toFixed(1)}%`,
      `Attendance Rate: ${student.attendanceRate.toFixed(1)}%`,
      `Semester: ${student.semester} (${student.course})`,
      `Performance Velocity: ${student.trend.toUpperCase()}`,
      `Risk Index: ${student.riskScore}/100 (${student.riskLevel.toUpperCase()})`,
    ];

    let reply = '';
    const suggestedPrompts: string[] = [];
    let groundPlan: AIRecommendation | undefined;

    if (qLower.includes('frontend') && qLower.includes('backend') || qLower.includes('what is frontend') || qLower.includes('what is backend')) {
      reply = `### 🌐 Frontend vs Backend: Full-Stack Engineering Guide

In modern software development, applications are split into two complementary environments:

#### 1. Frontend (The Client-Side Experience)
- **What It Is**: Everything the user sees, touches, and interacts with directly in the browser or mobile app.
- **Core Technologies**: HTML5 (Structure), CSS3/Tailwind (Styling), JavaScript/TypeScript (Logic), React/Vue/Next.js (Component Frameworks).
- **Primary Responsibilities**:
  - Rendering responsive UI cards, forms, buttons, and animations.
  - Managing user client state and input validation.
  - Making asynchronous HTTP requests (\`fetch\` or \`axios\`) to the backend.

#### 2. Backend (The Server-Side Engine)
- **What It Is**: The behind-the-scenes server infrastructure that handles business logic, security, and persistence.
- **Core Technologies**: Java (Spring Boot), Python (FastAPI/Django), Node.js (Express), Go, PostgreSQL, Redis.
- **Primary Responsibilities**:
  - Secure authentication (JWT, OAuth) and role authorization.
  - Business rules (e.g., calculating risk scores, charging credit cards).
  - Interacting with databases to store and retrieve records reliably.

#### 3. Real-World Metaphor (The Restaurant):
\`\`\`text
Customer at Table (User)  ───>  Views Menu & Orders (Frontend UI)
                                         │
                                   Waiter (REST API)
                                         ▼
Kitchen & Chef (Backend Server) ───> Refrigerator / Pantry (Database)
\`\`\`

#### 4. How They Communicate:
The Frontend sends an **HTTP Request** (e.g. \`POST /api/v1/auth/login\`) with a JSON payload. The Backend validates it, queries the database, and returns an **HTTP Response** (e.g. \`200 OK\` with user token).`;

      suggestedPrompts.push('Explain an API with a real example.');
      suggestedPrompts.push('Teach me Python from the beginning.');
      suggestedPrompts.push('How do I build my own AI application?');
    } else if (qLower.includes('api') && (qLower.includes('explain') || qLower.includes('real example') || qLower.includes('what is')) || qLower === 'what is an api') {
      reply = `### 🔌 What is an API? Explained with Real-World Examples

An **API (Application Programming Interface)** is a formalized digital contract that allows two distinct software systems to exchange data securely without knowing each other's internal code.

#### 1. The Classic Real-World Metaphor: The Restaurant Waiter
1. **You (The Client/Frontend)**: Sit at a table and look at the menu. You want food, but you are not allowed in the kitchen.
2. **The Waiter (The API)**: Takes your order, brings it to the kitchen, and returns to your table with your meal.
3. **The Kitchen (The Server/Database)**: Prepares the food and gives it to the waiter.

#### 2. Technical Example: Weather Forecast API
When your weather app displays today's temperature:
\`\`\`http
GET https://api.weather.com/v1/current?city=Hyderabad HTTP/1.1
Authorization: Bearer <API_KEY>
\`\`\`

The weather server responds with structured **JSON**:
\`\`\`json
{
  "city": "Hyderabad",
  "temperatureC": 28.5,
  "condition": "Clear Sky",
  "humidity": 45
}
\`\`\`

#### 3. The 4 Essential HTTP Methods:
- **\`GET\`**: Retrieve data (e.g. \`GET /students\`)
- **\`POST\`**: Create new data (e.g. \`POST /students\`)
- **\`PUT / PATCH\`**: Update existing records (e.g. \`PUT /students/1\`)
- **\`DELETE\`**: Remove a record (e.g. \`DELETE /students/1\`)

#### 4. Key Status Codes to Memorize:
- **\`200 OK\`**: Success.
- **\`201 Created\`**: Successfully saved new record.
- **\`400 Bad Request\`**: Invalid client parameters.
- **\`401 Unauthorized\`**: Missing or invalid token.
- **\`404 Not Found\`**: Resource does not exist.
- **\`500 Internal Server Error\`**: Backend crashed.`;

      suggestedPrompts.push('What is frontend and backend?');
      suggestedPrompts.push('Teach me Python from the beginning.');
      suggestedPrompts.push('Help me debug this code error.');
    } else if (qLower.includes('python') && (qLower.includes('beginning') || qLower.includes('teach') || qLower.includes('start') || qLower.includes('scratch') || qLower.includes('learn'))) {
      reply = `### 🐍 Python from the Beginning: Step-by-Step Mastery

Python is known for its human-readable syntax and massive ecosystem in Web Development (FastAPI, Django), Data Science (Pandas), and AI/Machine Learning (PyTorch).

#### 1. Variables & Primitive Data Types:
\`\`\`python
# Python dynamically infers data types:
name = "Alex"          # string (str)
age = 20               # integer (int)
gpa = 3.85             # floating point (float)
is_enrolled = True     # boolean (bool)

print(f"Student {name} is {age} years old with GPA {gpa}.")
\`\`\`

#### 2. Core Collections (Lists & Dictionaries):
\`\`\`python
# List: Ordered, mutable sequence
skills = ["Python", "Java", "SQL"]
skills.append("Docker")

# Dictionary: Key-value mapping
student_profile = {
    "name": "Alex",
    "course": "CSE",
    "semester": 6,
    "skills": skills
}

print(student_profile["skills"][0])  # Output: Python
\`\`\`

#### 3. Functions & Reusability:
\`\`\`python
def calculate_risk(attendance: float, average_score: float) -> str:
    """Calculates academic risk index based on institutional thresholds."""
    if attendance < 75.0 or average_score < 60.0:
        return "HIGH RISK"
    elif average_score < 75.0:
        return "MODERATE RISK"
    return "LOW RISK"

status = calculate_risk(82.0, 78.5)
print(f"Evaluated status: {status}")  # Output: LOW RISK
\`\`\`

#### 4. Loops & Iteration:
\`\`\`python
# Iterating through a list with enumerate:
for index, skill in enumerate(skills, start=1):
    print(f"Skill #{index}: {skill}")
\`\`\`

#### 🚀 Next Steps to Practice:
1. Practice writing small scripts that take user input.
2. Build a CLI to manage student marks and calculate letter grades.`;

      suggestedPrompts.push('Explain machine learning in simple language.');
      suggestedPrompts.push('Explain an API with a real example.');
      suggestedPrompts.push('What is frontend and backend?');
    } else if (qLower.includes('machine learning') || qLower.includes('ml') || qLower.includes('ai') && (qLower.includes('simple') || qLower.includes('explain') || qLower.includes('what is'))) {
      reply = `### 🤖 Machine Learning Explained in Simple Language

#### 1. Traditional Programming vs. Machine Learning
- **Traditional Programming**: \`Data + Rules = Answers\`  
  *(A programmer explicitly codes: "If email contains 'lottery', mark as spam".)*
- **Machine Learning**: \`Data + Answers = Rules (Model)\`  
  *(The computer inspects 100,000 emails labeled "spam" or "not spam", learns mathematical patterns, and invents the rules itself.)*

#### 2. The 3 Primary Paradigms of ML:
1. **Supervised Learning (Learning with a Teacher)**:
   - Data has inputs ($X$) and labeled targets ($Y$).
   - *Example*: Predicting student final GPA from midterms, or detecting fraud.
2. **Unsupervised Learning (Finding Hidden Patterns)**:
   - Data has inputs ($X$) with **no labels**. The algorithm groups similar items.
   - *Example*: Clustering students by technical skills or recommendation engines.
3. **Reinforcement Learning (Trial & Error with Rewards)**:
   - An agent takes actions in an environment to maximize a score.
   - *Example*: Self-driving cars navigating obstacles, AlphaGo.

#### 3. How a Neural Network Learns:
\`\`\`text
Input Features  ───>  [ Weights & Biases ]  ───>  Prediction
(Hours Studied,          (Adjusted via             (Exam Score: 88%)
 Attendance %)          Backpropagation)                 │
                                                         ▼
                                                Calculate Loss & Error
\`\`\`

#### 4. How to Build Your First ML Application:
1. **Language**: Python 3.10+
2. **Libraries**: \`scikit-learn\` (for regression/trees) or \`PyTorch\` (for deep learning).
3. **Pipeline**: Clean data ➔ Split Train/Test (80/20) ➔ Train Model ➔ Evaluate Precision/Recall.`;

      suggestedPrompts.push('Teach me Python from the beginning.');
      suggestedPrompts.push('Explain an API with a real example.');
      suggestedPrompts.push('Which subjects should I focus on?');
    } else if (qLower.includes('debug') || qLower.includes('error') || qLower.includes('bug') || qLower.includes('exception') || qLower.includes('trace')) {
      reply = `### 🐞 Professional Code Debugging: The 4-Step Diagnostic System

When your program crashes or throws an exception, follow this systematic engineering strategy:

#### Step 1: Read the Stack Trace from Bottom to Top
- Look for the **Exception Name** (e.g. \`NullPointerException\`, \`IndexOutOfBoundsException\`, \`TypeError\`).
- Look for **Your Code's File & Line Number** (ignore external framework internal lines).

#### Step 2: Classify the Root Cause
- **Null / Undefined Pointer**: You attempted to access \`obj.property\` when \`obj\` was null or not yet initialized.
  - *Fix*: Check \`if (obj != null)\` or use optional chaining \`obj?.property\`.
- **Off-By-One Index**: Array size is 5, but you accessed index \`5\` (indices are \`0\` to \`4\`).
  - *Fix*: Ensure loop condition is \`i < array.length\`, not \`i <= array.length\`.
- **Type Mismatch**: Trying to concatenate an Integer with a String without casting.
- **Asynchronous Race Condition**: Accessing state before an API \`fetch\` Promise resolved.
  - *Fix*: Use \`await\` or verify loading states before rendering.

#### Step 3: Minimal Reproducible Isolation
\`\`\`python
# Add disciplined print statements or debugger breakpoints:
print(f"DEBUG: Variable state before call: {my_var}, Type: {type(my_var)}")
\`\`\`

#### Step 4: Write a Regression Test
Once fixed, write a unit test with that exact edge case input so the bug never reappears in production!`;

      suggestedPrompts.push('Teach me Python from the beginning.');
      suggestedPrompts.push('Explain an API with a real example.');
      suggestedPrompts.push('What is frontend and backend?');
    } else if (qLower.includes('telugu') || qLower.includes('tanglish') || qLower.includes('naku') || qLower.includes('nerpandi') || qLower.includes('namaskaram')) {
      reply = `### 🇮🇳 నమస్కారం! (Welcome to AI Academic Tutor in Telugu/Tanglish)

నమస్కారం! నేను మీ **Student Analytics AI Academic & Technical Tutor** ని.

నేను మీకు ఈ క్రింది అంశాలలో సులభంగా సహాయం చేయగలను:

#### 1. కంప్యూటర్ సైన్స్ & ప్రోగ్రామింగ్ (Programming):
- **Python, Java, C++, JavaScript** basics నుండి advanced concepts వరకు.
- **Frontend & Backend**: Web applications ఎలా తయారు చేయాలి.
- **APIs & Databases**: Data ని ఎలా store చేయాలి మరియు fetch చేయాలి.

#### 2. ఎకడమిక్ మార్కులు & ఎగ్జామ్ స్టడీ ప్లాన్ (Academic Success):
- మీ **Average Score (${student.averageScore.toFixed(1)}%)** మరియు **Attendance (${student.attendanceRate.toFixed(1)}%)** కి సరిపోయే పర్సనలైజ్డ్ స్టడీ ప్లాన్.
- తక్కువ మార్కులు వచ్చిన సబ్జెక్టులపై ఎలా దృష్టి పెట్టాలి.

#### 3. కెరీర్ & ప్లేస్‌మెంట్స్ (Placement Preparation):
- GitHub లో ప్రాజెక్ట్స్ ఎలా పెట్టాలి, Resume లో technical skills ఎలా add చేయాలి.

> 💬 **మీరు తెలుగు లేదా Tanglish లో కూడా ప్రశ్నలు అడగవచ్చు!**  
> ఉదాహరణకు: *"Python lo functions ante enti?"* లేదా *"Exam revision schedule cheppandi."*`;

      suggestedPrompts.push('What is frontend and backend?');
      suggestedPrompts.push('Teach me Python from the beginning.');
      suggestedPrompts.push('Create a study plan for my upcoming exams.');
    } else if (qLower.includes('subject') || qLower.includes('focus') || qLower.includes('struggl')) {
      reply = `### 🎯 Evidence-Based Subject Focus Plan for ${student.name}

Based on your verified academic profile in **${student.course} (Semester ${student.semester})**:

1. **Core Problem-Solving & Architecture (Primary Focus)**:
   - Your current average sits at **${student.averageScore.toFixed(1)}%**.
   - Dedicate **60 minutes** daily to fundamental practice sets and laboratory assignments before tackling complex theoretical proofs.
2. **Prerequisite Review**:
   - Revisit previous term lecture notes on Data Structures & Discrete Logic to eliminate conceptual bottlenecks.
3. **Faculty Mentorship**:
   - Schedule a 15-minute check-in with your advisor, **${student.advisor}**, during weekly consultation hours.

> 💡 *Study Rule: Study your most difficult subject first in each study block when your cognitive energy is highest.*`;

      suggestedPrompts.push('Create a study plan for my upcoming exams.');
      suggestedPrompts.push('How can I improve my attendance?');
      suggestedPrompts.push('Explain recursion and dynamic programming in simple language.');
    } else if (qLower.includes('why') && (qLower.includes('mark') || qLower.includes('decreas') || qLower.includes('drop') || qLower.includes('low'))) {
      const isAttLow = student.attendanceRate < 75;
      reply = `### 📊 Analytical Diagnosis: Academic Trajectory Analysis

Your performance trajectory is currently classified as **${student.trend.toUpperCase()}** with an empirical risk score of **${student.riskScore}/100**.

**Root-Cause Observations Derived from Real Telemetry:**
${
  isAttLow
    ? `- ⚠️ **Attendance Correlation**: Your attendance is at **${student.attendanceRate.toFixed(1)}%** (below the 75% institutional threshold). Missing lectures directly interrupts cumulative technical progression.`
    : `- ✅ **Attendance Stability**: Your attendance is strong at **${student.attendanceRate.toFixed(1)}%**, meaning learning gaps stem from exam pacing or assignment depth rather than class absence.`
}
- 📈 **Semester Complexity Delta**: As Semester ${student.semester} advances, module difficulty compounds. Cramming before deadlines produces steep performance drops compared to steady weekly revision.
- ⏱️ **Assessment Milestones**: Review feedback on your latest midterms to catch common algebraic or syntax pitfalls.

### 🚀 Recommended Recovery Steps:
1. Shift to active recall (flashcards & mock tests) instead of passive textbook reading.
2. Form a study pair with a classmate for code reviews before submission dates.`;

      suggestedPrompts.push('What should I study this week?');
      suggestedPrompts.push('Generate my full Ground Plan');
      suggestedPrompts.push('Which subjects should I focus on?');
    } else if (qLower.includes('attendance') || qLower.includes('improve attendance')) {
      const currentAtt = student.attendanceRate;
      const isEligible = currentAtt >= 75;
      reply = `### 📅 Attendance Optimization & Eligibility Telemetry

Your verified lecture attendance is currently **${currentAtt.toFixed(1)}%**.

${
  isEligible
    ? `✅ **Eligibility Confirmed**: You meet the institutional 75% exam criterion. Aim for **85%+** to secure distinction and campus placement prerequisites.`
    : `⚠️ **Policy Breach Warning**: You are currently **below the mandatory 75% examination eligibility threshold**.`
}

**Practical Adherence Roadmap:**
1. **Zero-Absence Sprint**: Attend all scheduled laboratory and lecture hours over the next 21 calendar days.
2. **Authorized Documentation**: If past absences resulted from medical reasons or campus representation, submit approved concession slips immediately.
3. **Automated Reminders**: Sync your official course timetable with your phone calendar with 15-minute lead notifications.`;

      suggestedPrompts.push('Which subjects should I focus on?');
      suggestedPrompts.push('What should I study this week?');
      suggestedPrompts.push('Create a study plan for my upcoming exams.');
    } else if (qLower.includes('plan') || qLower.includes('study plan') || qLower.includes('ground plan') || qLower.includes('timetable') || qLower.includes('week')) {
      // Synthesize full ground plan
      groundPlan = await wildfireApi.getAIRecommendation(student.id, false);
      reply = `### 📋 Personalized Academic Success Plan for ${student.name}

${groundPlan.summary}

#### 📅 Weekly Time-Blocked Study Schedule:
- **Monday (Foundation Review)**: 60 mins review of core lecture slide summaries & flashcards.
- **Tuesday (Algorithmic Practice)**: 3-5 targeted practice problems & lab code tracing.
- **Wednesday (Practical Debugging)**: Hands-on implementation of weekly coursework milestones.
- **Thursday (Peer & Mentor Hours)**: Consultation with **${student.advisor}** on difficult topics.
- **Friday (Self Assessment)**: 45-minute timed mock test to benchmark weekly retention.

#### 🎯 Measurable Checkpoints:
- Complete all weekly problem sets with 80%+ self-evaluation before Sunday midnight.
- Maintain continuous lecture presence to keep attendance at or above **${student.attendanceRate.toFixed(1)}%**.
- Target review date scheduled in **${groundPlan.suggestedReviewDays || 14} days**.

> 💡 *You can click **"Approve & Save Ground Plan"** in the panel above to record this directly to your active intervention cases!*`;

      suggestedPrompts.push('Can you explain Tuesday’s practice problems?');
      suggestedPrompts.push('How can I improve my attendance?');
      suggestedPrompts.push('Why are my marks decreasing?');
    } else if (qLower.includes('explain') || qLower.includes('concept') || qLower.includes('programming') || qLower.includes('code') || qLower.includes('python') || qLower.includes('java')) {
      reply = `### 💡 Conceptual Mastery Walkthrough

Let's break down fundamental computer science and programming concepts step-by-step:

#### 1. Core Principle:
In computer systems, reliable solutions combine **clean modular architecture**, **efficient algorithmic complexity**, and **disciplined testing**.

#### 2. Key Mental Model:
- **Time Complexity ($O$)**: How computation scales as input data size grows.
- **Space Complexity**: Memory overhead allocated during runtime execution.
- **State Management**: Ensuring data consistency across asynchronous operations.

#### 3. Step-by-Step Practice Strategy:
\`\`\`text
Step 1: Write out the problem in plain English (Pseudocode).
Step 2: Trace a small example by hand with pencil and paper.
Step 3: Implement the simplest working brute-force solution.
Step 4: Refactor for performance (eliminate redundant loops/queries).
\`\`\`

Would you like me to walk through a specific topic like **Recursion**, **Binary Trees**, **REST APIs**, or **Database Indexing**?`;

      suggestedPrompts.push('Explain Recursion vs Iteration with a code example.');
      suggestedPrompts.push('Explain SQL Joins with an example.');
      suggestedPrompts.push('Which subjects should I focus on?');
    } else {
      reply = `### 🎓 Hello ${student.name}! I am your AI Academic Success Tutor.

I am connected to your verified academic records in **${student.course}** (Semester ${student.semester}).

Here is your live telemetry summary:
- **Academic Score Average**: **${student.averageScore.toFixed(1)}%**
- **Session Attendance Rate**: **${student.attendanceRate.toFixed(1)}%**
- **Performance Velocity**: **${student.trend.toUpperCase()}**
- **Assigned Faculty Advisor**: **${student.advisor}**

Ask me anything about your studies, exam preparation, or technical subjects:
- *“Which subjects should I focus on?”*
- *“Why are my marks decreasing?”*
- *“Create a study plan for my upcoming exams.”*
- *“How can I improve my attendance?”*`;

      suggestedPrompts.push('Which subjects should I focus on?');
      suggestedPrompts.push('Create a study plan for my upcoming exams.');
      suggestedPrompts.push('Why are my marks decreasing?');
      suggestedPrompts.push('How can I improve my attendance?');
    }

    return {
      reply,
      suggestedPrompts,
      evidenceUsed,
      groundPlan,
    };
  },

  // Student Success Index (SSI) API
  async getStudentSSI(
    studentId: string,
    isLiveMode: boolean,
    weights?: SSIWeights,
    studentFallback?: Student,
    assessmentsFallback?: Assessment[]
  ): Promise<StudentSuccessIndex> {
    if (isLiveMode) {
      try {
        let url = `${API_BASE_URL}/students/${encodeURIComponent(studentId)}/ssi`;
        if (weights) {
          const params = new URLSearchParams({
            academicsWeight: weights.academicsWeight.toString(),
            attendanceWeight: weights.attendanceWeight.toString(),
            placementWeight: weights.placementWeight.toString(),
            skillsWeight: weights.skillsWeight.toString(),
          });
          url += `?${params.toString()}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('[wildfireApi] Backend SSI endpoint unreachable, using client engine fallback:', err);
      }
    }

    const student = studentFallback || localDemoStudents.find((s) => s.id === studentId);
    if (!student) {
      throw new ApiError(`Student record not found for ID: ${studentId}`, 404);
    }
    const assessments = assessmentsFallback || localDemoAssessments.filter((a) => a.studentId === studentId);
    return calculateClientSSI(student, assessments, null, null, weights);
  },

  async getAllStudentsSSI(isLiveMode: boolean): Promise<StudentSuccessIndex[]> {
    if (isLiveMode) {
      try {
        const res = await fetch(`${API_BASE_URL}/ssi`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('[wildfireApi] Live /api/v1/ssi unreachable, using demo calculation fallback:', err);
      }
    }

    return localDemoStudents.map((s) => {
      const studentAssessments = localDemoAssessments.filter((a) => a.studentId === s.id);
      return calculateClientSSI(s, studentAssessments);
    });
  },
};

