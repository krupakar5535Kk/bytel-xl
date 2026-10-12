package com.wildfire.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class InterventionDto {

    private String id;

    @NotBlank
    private String studentId;

    private String studentName;

    @NotBlank
    private String category;

    @NotBlank
    private String title;

    @NotBlank
    private String reason;

    private String evidence;
    private List<String> actionItems;
    private String assignedTo;
    private String status;
    private String targetReviewDate;
    private MetricDto preMetric;
    private MetricDto postMetric;
    private String followUpNotes;
    private String createdAt;
    private String lastUpdated;

    public static class MetricDto {
        private double attendanceRate;
        private double averageScore;

        public MetricDto() {}
        public MetricDto(double attendanceRate, double averageScore) {
            this.attendanceRate = attendanceRate;
            this.averageScore = averageScore;
        }
        public double getAttendanceRate() { return attendanceRate; }
        public void setAttendanceRate(double attendanceRate) { this.attendanceRate = attendanceRate; }
        public double getAverageScore() { return averageScore; }
        public void setAverageScore(double averageScore) { this.averageScore = averageScore; }
    }

    public InterventionDto() {}

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

    public List<String> getActionItems() { return actionItems; }
    public void setActionItems(List<String> actionItems) { this.actionItems = actionItems; }

    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTargetReviewDate() { return targetReviewDate; }
    public void setTargetReviewDate(String targetReviewDate) { this.targetReviewDate = targetReviewDate; }

    public MetricDto getPreMetric() { return preMetric; }
    public void setPreMetric(MetricDto preMetric) { this.preMetric = preMetric; }

    public MetricDto getPostMetric() { return postMetric; }
    public void setPostMetric(MetricDto postMetric) { this.postMetric = postMetric; }

    public String getFollowUpNotes() { return followUpNotes; }
    public void setFollowUpNotes(String followUpNotes) { this.followUpNotes = followUpNotes; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }
}
