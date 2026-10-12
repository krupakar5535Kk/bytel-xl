# Student Analytics — AI Student Success, Academic Intelligence & Talent Discovery Platform

[![Live Application](https://img.shields.io/badge/Live_App-student--analytics--website.vercel.app-00e5ff?style=for-the-badge&logo=vercel)](https://student-analytics-website.vercel.app)
[![API Status](https://img.shields.io/badge/Backend_API-Render_Live_UP-8b5cf6?style=for-the-badge&logo=render)](https://student-analytics-t77k.onrender.com/api/v1/health)
[![Database](https://img.shields.io/badge/Database-Supabase_PostgreSQL-38bdf8?style=for-the-badge&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

> 🚀 **Public Live Showcase Links**:
> - **Live Web Platform**: [https://student-analytics-website.vercel.app](https://student-analytics-website.vercel.app)
> - **Production Backend API**: [https://student-analytics-t77k.onrender.com/api/v1/health](https://student-analytics-t77k.onrender.com/api/v1/health)
> - **Source Code Repository**: [https://github.com/krupakar5535Kk/bytel-xl](https://github.com/krupakar5535Kk/bytel-xl)

---

## 1. Product Vision & Mission

**WILD FIRE** is a student academic analytics and early-intervention success platform designed to identify students experiencing academic difficulty before problems become irreversible.

The core operational workflow follows four stages:
1. **DETECT** — Identify students at academic risk via explainable multi-factor telemetry.
2. **EXPLAIN** — Unpack measurable indicators (attendance, trajectory, exam scores, coursework) with clear weights and limitations.
3. **RECOMMEND** — Provide AI-synthesized, grounded study roadmaps and faculty advisory steps.
4. **TRACK** — Log human-in-the-loop interventions and measure longitudinal pre- and post-intervention progress.

---

## 2. Brand Identity & Visual Language

- **Backgrounds**: Deep black (`#030712`) and midnight navy (`#050b18`).
- **Primary Accent**: Neon Electric Blue (`#00e5ff`).
- **Secondary Accent**: Cyan (`#06b6d4`) highlights for interactive controls.
- **AI Accent**: Soft violet (`#8b5cf6`) reserved strictly for AI insights.
- **Risk Indicators**: High (`#ef4444`), Moderate (`#f59e0b`), Low (`#10b981`).
- **Immersive Animated Background**: 60fps Canvas/CSS central academic intelligence core with orbital nodes, traveling data particles, and flowing signal connection lines.

---

## 3. Architecture & Repository Structure

```
bytel xl/
├── frontend/                     # React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/           # AmbientBackground, Sidebar, TopNavigation, WildfireLogo, AppLayout
│   │   │   ├── dashboard/        # PerformanceTrendChart, AttendanceTrendChart, SubjectPerformanceChart,
│   │   │   │                     # RiskDistributionChart, AttendanceVsMarksChart, InterventionOutcomesChart,
│   │   │   │                     # AttentionTable, ActivityFeed, DashboardOverview
│   │   │   ├── students/         # StudentDirectory, StudentModal (Add/Edit), CsvImportModal
│   │   │   ├── profile/          # StudentProfileHeader, RiskExplanationPanel, AIImprovementPlanCard,
│   │   │   │                     # AcademicSection, AttendanceSection, StudentProfile
│   │   │   ├── risk/             # RiskAnalyticsView, RiskRulesConfigModal
│   │   │   ├── ai/               # AIInsightsHub
│   │   │   ├── interventions/    # InterventionCenter
│   │   │   ├── progress/         # ProgressTrackingView
│   │   │   ├── reports/          # ReportsView
│   │   │   ├── settings/         # SettingsView
│   │   │   └── common/           # GlassCard, RiskBadge, TrendIndicator, MetricKpi, Modal, ToastContainer
│   │   ├── context/              # AppContext (Dual-Mode Demo/Live, state management)
│   │   ├── data/                 # Demo cohort with mathematically consistent metrics
│   │   ├── services/             # Centralized API service layer (Dual-Mode Spring Boot / Demo)
│   │   ├── types/                # Strict TypeScript contracts
│   │   └── utils/                # Risk engine, formatters, CSV import/export
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                      # Java 21 + Spring Boot 3.3.4 REST API
│   ├── src/main/java/com/wildfire/
│   │   ├── WildfireApplication.java
│   │   ├── ai/                   # OpenAiClientService (data minimization, fallback)
│   │   ├── analytics/            # RiskEngine (0-100 weighted calculation)
│   │   ├── config/               # CorsConfig, DataInitializer (seeds demo dataset)
│   │   ├── controller/           # HealthController, StudentController, DashboardController,
│   │   │                         # InterventionController, RiskController, AiController, SettingsController
│   │   ├── dto/                  # StudentDto, AssessmentDto, InterventionDto, RiskAssessmentDto, AIInsightResponse
│   │   ├── entity/               # StudentEntity, AssessmentEntity, AttendanceEntity, AssignmentEntity, InterventionEntity, AuditLogEntity
│   │   ├── exception/            # GlobalExceptionHandler, ResourceNotFoundException, BadRequestException
│   │   ├── repository/           # Spring Data JPA repositories
│   │   └── service/              # StudentService, DashboardService, InterventionService
│   ├── src/main/resources/
│   │   ├── application.yml       # Local H2 + env var bindings
│   │   └── application-prod.yml  # PostgreSQL production config for Render
│   ├── src/test/java/com/wildfire/
│   │   ├── RiskEngineTest.java   # Unit tests for risk math and normalization
│   │   └── WildfireApplicationTests.java # Context loading verification
│   ├── pom.xml
│   └── Dockerfile                # Multi-stage production container
└── README.md
```

---

## 4. Student Risk Detection Engine Specification

The platform utilizes a transparent, explainable 0–100 scoring mechanism based on configurable weighted indicators:

$$\text{Risk Score} = \frac{\sum_{i} W_i \times S_i}{\sum_i W_i}$$

### Default Indicator Allocations:
1. **Attendance Concern (30%)**:
   - $\ge 85\%$: Low risk ($< 20$)
   - $75\% - 84\%$: Moderate concern ($35 - 70$)
   - $< 75\%$: High concern ($70 - 100$)
2. **Academic Performance Concern (35%)**:
   - Average score $\ge 80\%$: Low ($0 - 15$)
   - $65\% - 79\%$: Moderate ($20 - 50$)
   - $50\% - 64\%$: Elevated ($55 - 80$)
   - $< 50\%$: Critical ($85 - 100$)
3. **Trajectory Velocity Concern (25%)**:
   - Improving: $5$
   - Stable: $25$
   - Declining: $85$
4. **Coursework Assignment Delinquency (10%)**:
   - Evaluates overdue and missing assignments against syllabus deadlines.
   - Automatically **renormalizes** if assignment telemetry is unlogged, outputting explicit completeness notices.

### Classification Thresholds:
- **Low Risk**: $< 35$
- **Moderate Risk**: $35 - 64$
- **High Risk**: $\ge 65$

---

## 5. Dual Mode: Demo Mode vs Live Mode

To ensure full transparency and avoid fake functionality:
- **Demo Mode**: Loads a coherent cohort of 8 fictional engineering students (Aarav Sharma, Maya Patel, Liam Chen, Elena Rostova, Marcus Vance, Ananya Iyer, David Kim, Zainab Al-Mansoor). Every student's marks, attendance, overdue assignments, risk score, and interventions match mathematically.
- **Live Mode**: Directly queries the Spring Boot REST API (`/api/v1/students`, `/api/v1/dashboard/summary`). Displays real loading states, honest empty states when zero records exist, and actionable error toasts on connection failure.
- A toggle switch in the top header switches between modes instantly.

---

## 6. How to Run Locally

### Prerequisites:
- **Node.js** (v18+)
- **Java** (v21 OpenJDK)
- **Apache Maven** (v3.9+)

### 1. Run Backend (Spring Boot):
```powershell
cd backend
mvn clean spring-boot:run
```
*Backend starts on `http://localhost:8080`. H2 database console is available at `http://localhost:8080/h2-console`.*

### 2. Run Frontend (React + Vite):
```powershell
cd frontend
npm install
npm run dev
```
*Frontend starts on `http://localhost:3000` (or `5173`).*

---

## 7. REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Service uptime and database connection status |
| `GET` | `/api/v1/dashboard/summary` | Institutional metrics (KPIs, risk counts, averages) |
| `GET` | `/api/v1/students` | List all students with search and filters |
| `GET` | `/api/v1/students/{id}` | Individual student detailed profile |
| `POST` | `/api/v1/students` | Register new student with validated telemetry |
| `PUT` | `/api/v1/students/{id}` | Update student marks, attendance, or details |
| `DELETE` | `/api/v1/students/{id}` | Remove student and associated logs |
| `GET` | `/api/v1/students/{id}/assessments` | Subject-wise assessment history |
| `POST` | `/api/v1/students/{id}/assessments` | Record new assessment marks |
| `GET` | `/api/v1/students/{id}/risk` | Explainable risk breakdown and factors |
| `POST` | `/api/v1/students/{id}/risk/recalculate`| Force re-evaluation of risk score |
| `POST` | `/api/v1/ai/student-insights` | Synthesize grounded pedagogical recommendations |
| `GET` | `/api/v1/interventions` | List all faculty success interventions |
| `POST` | `/api/v1/interventions` | Log new intervention plan |
| `PUT` | `/api/v1/interventions/{id}` | Update follow-up status and observed metrics |
| `GET` | `/api/v1/settings/risk-rules` | Fetch configurable algorithm weights |
| `PUT` | `/api/v1/settings/risk-rules` | Update algorithm weights & cutoffs |

---

## 8. Deployment Guide

### Frontend Deployment (Vercel):
1. Connect Git repository to [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Build Command: `npm run build`, Output Directory: `dist`.
4. Configure Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-backend-service.onrender.com/api/v1`

### Backend Deployment (Render):
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect Git repository and choose Docker runtime or Java Native runtime.
3. If using Docker, select `backend/Dockerfile`.
4. Create a **PostgreSQL Database** on Render.
5. Configure Environment Variables:
   - `SPRING_DATASOURCE_URL` = `jdbc:postgresql://<render-db-host>:5432/<db_name>`
   - `SPRING_DATASOURCE_USERNAME` = `<db_user>`
   - `SPRING_DATASOURCE_PASSWORD` = `<db_password>`
   - `APP_CORS_ALLOWED_ORIGINS` = `https://your-frontend.vercel.app`
   - `OPENAI_API_KEY` = `sk-proj-...`
   - `PORT` = `8080`

---

## 9. Ethical & Responsible AI Principles

1. **Human-In-The-Loop**: AI outputs are strictly advisory. No student is penalized, tracked, or rescheduled automatically without human faculty confirmation.
2. **Data Minimization**: Prompts exclude unnecessary PII (student names, addresses). Only standardized academic metrics (attendance %, subject marks, trajectory) are processed.
3. **Transparent Rules**: Algorithmic risk scores are computed deterministically through rule-based mathematical weights before any AI synthesis occurs.
4. **No Hallucinations**: When historical data is insufficient, the system explicitly returns data limitation notices rather than manufacturing fictional grades.
