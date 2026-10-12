package com.wildfire.config;

import com.wildfire.entity.*;
import com.wildfire.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final StudentRepository studentRepo;
    private final AssessmentRepository assessmentRepo;
    private final AssignmentRepository assignmentRepo;
    private final InterventionRepository interventionRepo;
    private final AuditLogRepository auditRepo;

    public DataInitializer(
            StudentRepository studentRepo,
            AssessmentRepository assessmentRepo,
            AssignmentRepository assignmentRepo,
            InterventionRepository interventionRepo,
            AuditLogRepository auditRepo
    ) {
        this.studentRepo = studentRepo;
        this.assessmentRepo = assessmentRepo;
        this.assignmentRepo = assignmentRepo;
        this.interventionRepo = interventionRepo;
        this.auditRepo = auditRepo;
    }

    @Override
    public void run(String... args) {
        if (studentRepo.count() > 0) {
            return; // Data already exists
        }

        // 1. Seed Students
        StudentEntity s1 = createStudent("WF-2026-101", "Aarav Sharma", "B.Tech Computer Science", 4, 64.2, 48.5, "declining", "high", 82, "Dr. Sarah Jenkins", "aarav.sharma@wildfire.edu");
        StudentEntity s2 = createStudent("WF-2026-102", "Maya Patel", "B.Tech Computer Science", 4, 78.5, 68.0, "declining", "moderate", 54, "Dr. Sarah Jenkins", "maya.patel@wildfire.edu");
        StudentEntity s3 = createStudent("WF-2026-103", "Liam Chen", "B.Tech Artificial Intelligence", 4, 96.0, 91.5, "improving", "low", 12, "Prof. Alan Vance", "liam.chen@wildfire.edu");
        StudentEntity s4 = createStudent("WF-2026-104", "Elena Rostova", "B.Tech Data Science", 4, 71.0, 52.0, "declining", "high", 78, "Dr. Robert Miller", "elena.rostova@wildfire.edu");
        StudentEntity s5 = createStudent("WF-2026-105", "Marcus Vance", "B.Tech Computer Science", 4, 82.0, 63.5, "stable", "moderate", 46, "Dr. Sarah Jenkins", "marcus.vance@wildfire.edu");
        StudentEntity s6 = createStudent("WF-2026-106", "Ananya Iyer", "B.Tech Artificial Intelligence", 4, 94.5, 87.2, "improving", "low", 16, "Prof. Alan Vance", "ananya.iyer@wildfire.edu");
        StudentEntity s7 = createStudent("WF-2026-107", "David Kim", "B.Tech Data Science", 4, 74.0, 71.2, "declining", "moderate", 52, "Dr. Robert Miller", "david.kim@wildfire.edu");
        StudentEntity s8 = createStudent("WF-2026-108", "Zainab Al-Mansoor", "B.Tech Computer Science", 4, 92.0, 84.0, "stable", "low", 22, "Dr. Sarah Jenkins", "zainab.mansoor@wildfire.edu");

        studentRepo.saveAll(Arrays.asList(s1, s2, s3, s4, s5, s6, s7, s8));

        // 2. Seed Assessments
        assessmentRepo.save(createAssessment("AS-101", "WF-2026-101", "Data Structures & Algorithms", "Quiz 1", 14, 20, "2026-08-25", "quiz"));
        assessmentRepo.save(createAssessment("AS-102", "WF-2026-101", "Operating Systems", "Lab Assignment 1", 12, 20, "2026-09-05", "lab"));
        assessmentRepo.save(createAssessment("AS-103", "WF-2026-101", "Data Structures & Algorithms", "Midterm Exam", 42, 100, "2026-09-20", "midterm"));
        assessmentRepo.save(createAssessment("AS-104", "WF-2026-101", "Operating Systems", "Midterm Exam", 38, 100, "2026-09-22", "midterm"));
        assessmentRepo.save(createAssessment("AS-105", "WF-2026-101", "Database Management Systems", "Midterm Exam", 48, 100, "2026-09-25", "midterm"));

        assessmentRepo.save(createAssessment("AS-201", "WF-2026-102", "Data Structures & Algorithms", "Midterm Exam", 72, 100, "2026-09-20", "midterm"));
        assessmentRepo.save(createAssessment("AS-202", "WF-2026-102", "Operating Systems", "Midterm Exam", 68, 100, "2026-09-22", "midterm"));
        assessmentRepo.save(createAssessment("AS-203", "WF-2026-102", "Database Management Systems", "Midterm Exam", 54, 100, "2026-09-25", "midterm"));

        assessmentRepo.save(createAssessment("AS-301", "WF-2026-103", "Machine Learning Fundamentals", "Midterm Exam", 94, 100, "2026-09-21", "midterm"));
        assessmentRepo.save(createAssessment("AS-302", "WF-2026-103", "Deep Neural Networks", "Lab Project", 48, 50, "2026-09-28", "lab"));

        // 3. Seed Assignments
        assignmentRepo.save(createAssignment("AG-101", "WF-2026-101", "Operating Systems", "Process Scheduler Simulation", "2026-09-18", "overdue"));
        assignmentRepo.save(createAssignment("AG-102", "WF-2026-101", "Data Structures & Algorithms", "Binary Search Tree Implementation", "2026-09-28", "overdue"));
        assignmentRepo.save(createAssignment("AG-103", "WF-2026-101", "Database Management Systems", "SQL Schema Normalization", "2026-10-05", "overdue"));

        // 4. Seed Interventions
        InterventionEntity i1 = new InterventionEntity();
        i1.setId("INT-2026-01");
        i1.setStudentId("WF-2026-101");
        i1.setStudentName("Aarav Sharma");
        i1.setCategory("attendance_support");
        i1.setTitle("Attendance Recovery & Remedial Schedule");
        i1.setReason("Critical attendance collapse to 64.2% and failing scores in Operating Systems (38%).");
        i1.setEvidence("Missed 18 lecture hours; 3 overdue lab assignments since September.");
        i1.setActionItems("Bi-weekly advisor check-in\nSupervised department study hall\nTA peer tutoring");
        i1.setAssignedTo("Dr. Sarah Jenkins");
        i1.setStatus("active");
        i1.setTargetReviewDate("2026-10-25");
        i1.setPreAttendanceRate(64.2);
        i1.setPreAverageScore(48.5);
        interventionRepo.save(i1);

        InterventionEntity i2 = new InterventionEntity();
        i2.setId("INT-2026-02");
        i2.setStudentId("WF-2026-102");
        i2.setStudentName("Maya Patel");
        i2.setCategory("subject_tutoring");
        i2.setTitle("Database Systems Query Optimization Tutoring");
        i2.setReason("Selective score dip in DBMS (54%) despite solid performance in programming (72%).");
        i2.setEvidence("Midterm test identified difficulties in multi-table relational algebra.");
        i2.setActionItems("3 one-on-one sessions with DBMS lab instructor\nInteractive SQL drills");
        i2.setAssignedTo("Prof. Alan Vance");
        i2.setStatus("under_review");
        i2.setTargetReviewDate("2026-10-20");
        i2.setPreAttendanceRate(78.5);
        i2.setPreAverageScore(68.0);
        i2.setPostAttendanceRate(81.0);
        i2.setPostAverageScore(73.5);
        i2.setFollowUpNotes("Quiz 2 showed measurable improvement (+18%) in relational queries.");
        interventionRepo.save(i2);

        // 5. Seed Initial Audit Log
        auditRepo.save(new AuditLogEntity("SYSTEM_STARTUP", "Platform database successfully initialized with verified academic cohort.", "SYSTEM", "N/A"));
    }

    private StudentEntity createStudent(String id, String name, String course, int sem, double att, double score, String trend, String risk, int riskScore, String advisor, String email) {
        StudentEntity s = new StudentEntity();
        s.setId(id);
        s.setName(name);
        s.setCourse(course);
        s.setSemester(sem);
        s.setAttendanceRate(att);
        s.setAverageScore(score);
        s.setTrend(trend);
        s.setRiskLevel(risk);
        s.setRiskScore(riskScore);
        s.setAdvisor(advisor);
        s.setEmail(email);
        s.setEnrollmentDate("2024-08-01");
        s.setStatus("active");
        return s;
    }

    private AssessmentEntity createAssessment(String id, String stuId, String subj, String title, double score, double max, String date, String type) {
        AssessmentEntity a = new AssessmentEntity();
        a.setId(id);
        a.setStudentId(stuId);
        a.setSubject(subj);
        a.setTitle(title);
        a.setScore(score);
        a.setMaxScore(max);
        a.setPercentage((int) Math.round((score / max) * 100));
        a.setDate(date);
        a.setTerm("Term 1");
        a.setType(type);
        return a;
    }

    private AssignmentEntity createAssignment(String id, String stuId, String subj, String title, String due, String status) {
        AssignmentEntity ag = new AssignmentEntity();
        ag.setId(id);
        ag.setStudentId(stuId);
        ag.setSubject(subj);
        ag.setTitle(title);
        ag.setDueDate(due);
        ag.setStatus(status);
        return ag;
    }
}
