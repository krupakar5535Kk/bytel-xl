package com.wildfire.dto;

public class DashboardSummaryDto {

    private long totalStudents;
    private long attentionCount;
    private double averageScore;
    private double averageAttendance;
    private long highRiskCount;
    private long moderateRiskCount;
    private long lowRiskCount;
    private long activeInterventions;
    private int improvementRate;

    public DashboardSummaryDto() {}

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getAttentionCount() { return attentionCount; }
    public void setAttentionCount(long attentionCount) { this.attentionCount = attentionCount; }

    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }

    public double getAverageAttendance() { return averageAttendance; }
    public void setAverageAttendance(double averageAttendance) { this.averageAttendance = averageAttendance; }

    public long getHighRiskCount() { return highRiskCount; }
    public void setHighRiskCount(long highRiskCount) { this.highRiskCount = highRiskCount; }

    public long getModerateRiskCount() { return moderateRiskCount; }
    public void setModerateRiskCount(long moderateRiskCount) { this.moderateRiskCount = moderateRiskCount; }

    public long getLowRiskCount() { return lowRiskCount; }
    public void setLowRiskCount(long lowRiskCount) { this.lowRiskCount = lowRiskCount; }

    public long getActiveInterventions() { return activeInterventions; }
    public void setActiveInterventions(long activeInterventions) { this.activeInterventions = activeInterventions; }

    public int getImprovementRate() { return improvementRate; }
    public void setImprovementRate(int improvementRate) { this.improvementRate = improvementRate; }
}
