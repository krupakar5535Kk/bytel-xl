package com.wildfire.dto;

import jakarta.validation.constraints.*;

public class StudentDto {

    @NotBlank(message = "Student ID is required")
    private String id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 128)
    private String name;

    @NotBlank(message = "Course is required")
    private String course;

    @Min(1) @Max(12)
    private int semester;

    @DecimalMin("0.0") @DecimalMax("100.0")
    private double attendanceRate;

    @DecimalMin("0.0") @DecimalMax("100.0")
    private double averageScore;

    @NotBlank
    private String trend; // improving, stable, declining

    private String riskLevel; // low, moderate, high
    private int riskScore; // 0-100

    private String advisor;
    private String email;
    private String enrollmentDate;
    private String status;
    private String lastUpdated;

    public StudentDto() {}

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

    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }
}
