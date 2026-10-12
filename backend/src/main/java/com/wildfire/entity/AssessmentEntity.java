package com.wildfire.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessments", indexes = {
    @Index(name = "idx_assessment_student", columnList = "student_id")
})
public class AssessmentEntity {

    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @Column(name = "student_id", nullable = false, length = 32)
    private String studentId;

    @Column(name = "subject", nullable = false, length = 128)
    private String subject;

    @Column(name = "title", nullable = false, length = 128)
    private String title;

    @Column(name = "score", nullable = false)
    private double score;

    @Column(name = "max_score", nullable = false)
    private double maxScore;

    @Column(name = "percentage", nullable = false)
    private int percentage;

    @Column(name = "date", length = 32)
    private String date;

    @Column(name = "term", length = 32)
    private String term;

    @Column(name = "type", length = 32)
    private String type; // quiz, midterm, final, assignment, lab

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.maxScore > 0) {
            this.percentage = (int) Math.round((this.score / this.maxScore) * 100);
        }
    }

    public AssessmentEntity() {}

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
