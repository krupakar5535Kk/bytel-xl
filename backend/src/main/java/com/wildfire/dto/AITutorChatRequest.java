package com.wildfire.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;

public class AITutorChatRequest {
    private String studentId;

    @NotBlank
    private String message;

    private List<Map<String, String>> history;

    public AITutorChatRequest() {}
    public AITutorChatRequest(String studentId, String message) {
        this.studentId = studentId;
        this.message = message;
    }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<Map<String, String>> getHistory() { return history; }
    public void setHistory(List<Map<String, String>> history) { this.history = history; }
}
