package com.wildfire.dto;

import java.util.List;

public class AIInsightResponse {

    private String summary;
    private List<String> evidence;
    private List<String> possibleContributingFactors;
    private List<String> studyRecommendations;
    private List<String> teacherActions;
    private String priority; // low, medium, high, critical
    private int suggestedReviewDays;
    private List<String> uncertainties;
    private String safetyNotice;

    public AIInsightResponse() {}

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<String> getEvidence() { return evidence; }
    public void setEvidence(List<String> evidence) { this.evidence = evidence; }

    public List<String> getPossibleContributingFactors() { return possibleContributingFactors; }
    public void setPossibleContributingFactors(List<String> possibleContributingFactors) { this.possibleContributingFactors = possibleContributingFactors; }

    public List<String> getStudyRecommendations() { return studyRecommendations; }
    public void setStudyRecommendations(List<String> studyRecommendations) { this.studyRecommendations = studyRecommendations; }

    public List<String> getTeacherActions() { return teacherActions; }
    public void setTeacherActions(List<String> teacherActions) { this.teacherActions = teacherActions; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public int getSuggestedReviewDays() { return suggestedReviewDays; }
    public void setSuggestedReviewDays(int suggestedReviewDays) { this.suggestedReviewDays = suggestedReviewDays; }

    public List<String> getUncertainties() { return uncertainties; }
    public void setUncertainties(List<String> uncertainties) { this.uncertainties = uncertainties; }

    public String getSafetyNotice() { return safetyNotice; }
    public void setSafetyNotice(String safetyNotice) { this.safetyNotice = safetyNotice; }
}
