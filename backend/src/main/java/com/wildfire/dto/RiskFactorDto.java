package com.wildfire.dto;

public class RiskFactorDto {

    private String category;
    private String name;
    private double weight;
    private int scoreImpact;
    private String severity; // low, moderate, high
    private String metricValue;
    private String explanation;

    public RiskFactorDto() {}

    public RiskFactorDto(String category, String name, double weight, int scoreImpact, String severity, String metricValue, String explanation) {
        this.category = category;
        this.name = name;
        this.weight = weight;
        this.scoreImpact = scoreImpact;
        this.severity = severity;
        this.metricValue = metricValue;
        this.explanation = explanation;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }

    public int getScoreImpact() { return scoreImpact; }
    public void setScoreImpact(int scoreImpact) { this.scoreImpact = scoreImpact; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getMetricValue() { return metricValue; }
    public void setMetricValue(String metricValue) { this.metricValue = metricValue; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
