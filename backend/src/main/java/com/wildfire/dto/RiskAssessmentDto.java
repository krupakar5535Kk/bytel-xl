package com.wildfire.dto;

import java.util.List;

public class RiskAssessmentDto {

    private String studentId;
    private int score; // 0-100
    private String category; // low, moderate, high
    private List<RiskFactorDto> factors;
    private String calculatedAt;
    private int dataCompleteness;
    private List<String> limitations;

    public RiskAssessmentDto() {}

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<RiskFactorDto> getFactors() { return factors; }
    public void setFactors(List<RiskFactorDto> factors) { this.factors = factors; }

    public String getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(String calculatedAt) { this.calculatedAt = calculatedAt; }

    public int getDataCompleteness() { return dataCompleteness; }
    public void setDataCompleteness(int dataCompleteness) { this.dataCompleteness = dataCompleteness; }

    public List<String> getLimitations() { return limitations; }
    public void setLimitations(List<String> limitations) { this.limitations = limitations; }
}
