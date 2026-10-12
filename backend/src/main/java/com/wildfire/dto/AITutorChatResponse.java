package com.wildfire.dto;

import java.util.List;

public class AITutorChatResponse {
    private String reply;
    private List<String> suggestedPrompts;
    private List<String> evidenceUsed;
    private AIInsightResponse groundPlan;

    public AITutorChatResponse() {}

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public List<String> getSuggestedPrompts() { return suggestedPrompts; }
    public void setSuggestedPrompts(List<String> suggestedPrompts) { this.suggestedPrompts = suggestedPrompts; }

    public List<String> getEvidenceUsed() { return evidenceUsed; }
    public void setEvidenceUsed(List<String> evidenceUsed) { this.evidenceUsed = evidenceUsed; }

    public AIInsightResponse getGroundPlan() { return groundPlan; }
    public void setGroundPlan(AIInsightResponse groundPlan) { this.groundPlan = groundPlan; }
}
