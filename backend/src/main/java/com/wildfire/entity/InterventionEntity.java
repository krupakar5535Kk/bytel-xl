package com.wildfire.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interventions", indexes = {
    @Index(name = "idx_intervention_student", columnList = "student_id"),
    @Index(name = "idx_intervention_status", columnList = "status")
})
public class InterventionEntity {

    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @Column(name = "student_id", nullable = false, length = 32)
    private String studentId;

    @Column(name = "student_name", nullable = false, length = 128)
    private String studentName;

    @Column(name = "category", nullable = false, length = 64)
    private String category;

    @Column(name = "title", nullable = false, length = 256)
    private String title;

    @Column(name = "reason", nullable = false, length = 1024)
    private String reason;

    @Column(name = "evidence", length = 1024)
    private String evidence;

    @Column(name = "action_items", length = 2048)
    private String actionItems; // JSON array or newline-separated

    @Column(name = "assigned_to", length = 128)
    private String assignedTo;

    @Column(name = "status", nullable = false, length = 32)
    private String status; // active, under_review, completed, escalated

    @Column(name = "target_review_date", length = 32)
    private String targetReviewDate;

    @Column(name = "pre_attendance_rate")
    private double preAttendanceRate;

    @Column(name = "pre_average_score")
    private double preAverageScore;

    @Column(name = "post_attendance_rate")
    private Double postAttendanceRate;

    @Column(name = "post_average_score")
    private Double postAverageScore;

    @Column(name = "follow_up_notes", length = 2048)
    private String followUpNotes;

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

    public InterventionEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getEvidence() { return evidence; }
    public void setEvidence(String evidence) { this.evidence = evidence; }

    public String getActionItems() { return actionItems; }
    public void setActionItems(String actionItems) { this.actionItems = actionItems; }

    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTargetReviewDate() { return targetReviewDate; }
    public void setTargetReviewDate(String targetReviewDate) { this.targetReviewDate = targetReviewDate; }

    public double getPreAttendanceRate() { return preAttendanceRate; }
    public void setPreAttendanceRate(double preAttendanceRate) { this.preAttendanceRate = preAttendanceRate; }

    public double getPreAverageScore() { return preAverageScore; }
    public void setPreAverageScore(double preAverageScore) { this.preAverageScore = preAverageScore; }

    public Double getPostAttendanceRate() { return postAttendanceRate; }
    public void setPostAttendanceRate(Double postAttendanceRate) { this.postAttendanceRate = postAttendanceRate; }

    public Double getPostAverageScore() { return postAverageScore; }
    public void setPostAverageScore(Double postAverageScore) { this.postAverageScore = postAverageScore; }

    public String getFollowUpNotes() { return followUpNotes; }
    public void setFollowUpNotes(String followUpNotes) { this.followUpNotes = followUpNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
