package com.wildfire.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class StudentSuccessIndexDto {

    private String studentId;
    private String studentName;
    private Double overallScore; // null if any required factor is missing
    private Double partialScore; // weighted sum of available factors
    private String dataCompleteness; // COMPLETE, PARTIAL, INSUFFICIENT
    private int totalFactorsEvaluated = 4;
    private int factorsWithValidData;
    private SSIWeightsDto weights;
    private List<SSIFactorDto> factors = new ArrayList<>();
    private String strongestFactor;
    private String improvementFactor;
    private List<String> recommendations = new ArrayList<>();
    private LocalDateTime calculatedAt;
    private String calculationMethod;

    public StudentSuccessIndexDto() {}

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Double getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Double overallScore) {
        this.overallScore = overallScore;
    }

    public Double getPartialScore() {
        return partialScore;
    }

    public void setPartialScore(Double partialScore) {
        this.partialScore = partialScore;
    }

    public String getDataCompleteness() {
        return dataCompleteness;
    }

    public void setDataCompleteness(String dataCompleteness) {
        this.dataCompleteness = dataCompleteness;
    }

    public int getTotalFactorsEvaluated() {
        return totalFactorsEvaluated;
    }

    public void setTotalFactorsEvaluated(int totalFactorsEvaluated) {
        this.totalFactorsEvaluated = totalFactorsEvaluated;
    }

    public int getFactorsWithValidData() {
        return factorsWithValidData;
    }

    public void setFactorsWithValidData(int factorsWithValidData) {
        this.factorsWithValidData = factorsWithValidData;
    }

    public SSIWeightsDto getWeights() {
        return weights;
    }

    public void setWeights(SSIWeightsDto weights) {
        this.weights = weights;
    }

    public List<SSIFactorDto> getFactors() {
        return factors;
    }

    public void setFactors(List<SSIFactorDto> factors) {
        this.factors = factors;
    }

    public String getStrongestFactor() {
        return strongestFactor;
    }

    public void setStrongestFactor(String strongestFactor) {
        this.strongestFactor = strongestFactor;
    }

    public String getImprovementFactor() {
        return improvementFactor;
    }

    public void setImprovementFactor(String improvementFactor) {
        this.improvementFactor = improvementFactor;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }

    public LocalDateTime getCalculatedAt() {
        return calculatedAt;
    }

    public void setCalculatedAt(LocalDateTime calculatedAt) {
        this.calculatedAt = calculatedAt;
    }

    public String getCalculationMethod() {
        return calculationMethod;
    }

    public void setCalculationMethod(String calculationMethod) {
        this.calculationMethod = calculationMethod;
    }
}
