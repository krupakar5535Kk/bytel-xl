package com.wildfire.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "students", indexes = {
    @Index(name = "idx_student_risk", columnList = "risk_level"),
    @Index(name = "idx_student_course", columnList = "course")
})
public class StudentEntity {

    @Id
    @Column(name = "id", nullable = false, unique = true, length = 32)
    private String id;

    @Column(name = "name", nullable = false, length = 128)
    private String name;

    @Column(name = "course", nullable = false, length = 128)
    private String course;

    @Column(name = "semester", nullable = false)
    private int semester;

    @Column(name = "attendance_rate", nullable = false)
    private double attendanceRate;

    @Column(name = "average_score", nullable = false)
    private double averageScore;

    @Column(name = "trend", nullable = false, length = 16)
    private String trend; // improving, stable, declining

    @Column(name = "risk_level", nullable = false, length = 16)
    private String riskLevel; // low, moderate, high

    @Column(name = "risk_score", nullable = false)
    private int riskScore; // 0-100

    @Column(name = "advisor", length = 128)
    private String advisor;

    @Column(name = "email", length = 128)
    private String email;

    @Column(name = "enrollment_date")
    private String enrollmentDate;

    @Column(name = "status", length = 32)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Default constructor
    public StudentEntity() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public double getAttendanceRate() { return attendanceRate; }
    public void setAttendanceRate(double attendanceRate) { this.attendanceRate = attendanceRate; }

    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }

    public String getTrend() { return trend; }
    public void setTrend(String trend) { this.trend = trend; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }

    public String getAdvisor() { return advisor; }
    public void setAdvisor(String advisor) { this.advisor = advisor; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getEnrollmentDate() { return enrollmentDate; }
    public void setEnrollmentDate(String enrollmentDate) { this.enrollmentDate = enrollmentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
