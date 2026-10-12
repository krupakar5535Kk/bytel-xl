package com.wildfire.dto;

public class RiskWeightsDto {

    private double attendanceWeight = 0.30;
    private double academicWeight = 0.35;
    private double trendWeight = 0.25;
    private double assignmentWeight = 0.10;
    private int highRiskThreshold = 65;
    private int moderateRiskThreshold = 35;

    public RiskWeightsDto() {}

    public double getAttendanceWeight() { return attendanceWeight; }
    public void setAttendanceWeight(double attendanceWeight) { this.attendanceWeight = attendanceWeight; }

    public double getAcademicWeight() { return academicWeight; }
    public void setAcademicWeight(double academicWeight) { this.academicWeight = academicWeight; }

    public double getTrendWeight() { return trendWeight; }
    public void setTrendWeight(double trendWeight) { this.trendWeight = trendWeight; }

    public double getAssignmentWeight() { return assignmentWeight; }
    public void setAssignmentWeight(double assignmentWeight) { this.assignmentWeight = assignmentWeight; }

    public int getHighRiskThreshold() { return highRiskThreshold; }
    public void setHighRiskThreshold(int highRiskThreshold) { this.highRiskThreshold = highRiskThreshold; }

    public int getModerateRiskThreshold() { return moderateRiskThreshold; }
    public void setModerateRiskThreshold(int moderateRiskThreshold) { this.moderateRiskThreshold = moderateRiskThreshold; }
}
