package com.wildfire.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class AIInsightRequest {

    @NotBlank
    private String studentId;

    public AIInsightRequest() {}
    public AIInsightRequest(String studentId) { this.studentId = studentId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
}
