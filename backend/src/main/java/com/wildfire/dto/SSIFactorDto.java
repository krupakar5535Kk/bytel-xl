package com.wildfire.dto;

public class SSIFactorDto {

    private String id;
    private String name;
    private double weight;
    private Double score; // 0.0 - 100.0, null if insufficient data
    private Double weightedScore; // score * weight, null if score is null
    private String status; // SUFFICIENT, INSUFFICIENT_DATA, NOT_YET_ASSESSED
    private String explanation;
    private String evidenceSummary;
    private String recommendedAction;
    private String linkModule;

    public SSIFactorDto() {}

    public SSIFactorDto(String id, String name, double weight, Double score, Double weightedScore,
                        String status, String explanation, String evidenceSummary,
                        String recommendedAction, String linkModule) {
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.score = score;
        this.weightedScore = weightedScore;
        this.status = status;
        this.explanation = explanation;
        this.evidenceSummary = evidenceSummary;
        this.recommendedAction = recommendedAction;
        this.linkModule = linkModule;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Double getWeightedScore() {
        return weightedScore;
    }

    public void setWeightedScore(Double weightedScore) {
        this.weightedScore = weightedScore;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getEvidenceSummary() {
        return evidenceSummary;
    }

    public void setEvidenceSummary(String evidenceSummary) {
        this.evidenceSummary = evidenceSummary;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public String getLinkModule() {
        return linkModule;
    }

    public void setLinkModule(String linkModule) {
        this.linkModule = linkModule;
    }
}
