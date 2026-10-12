package com.wildfire.dto;

import jakarta.validation.constraints.*;

public class AssessmentDto {

    private String id;

    @NotBlank
    private String studentId;

    @NotBlank
    private String subject;

    @NotBlank
    private String title;

    @Min(0)
    private double score;

    @Min(1)
    private double maxScore;

    private int percentage;
    private String date;
    private String term;
    private String type;

    public AssessmentDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public double getMaxScore() { return maxScore; }
    public void setMaxScore(double maxScore) { this.maxScore = maxScore; }

    public int getPercentage() { return percentage; }
    public void setPercentage(int percentage) { this.percentage = percentage; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTerm() { return term; }
    public void setTerm(String term) { this.term = term; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
