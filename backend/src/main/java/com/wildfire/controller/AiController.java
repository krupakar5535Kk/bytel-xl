package com.wildfire.controller;

import com.wildfire.ai.OpenAiClientService;
import com.wildfire.dto.AIInsightRequest;
import com.wildfire.dto.AIInsightResponse;
import com.wildfire.entity.AssessmentEntity;
import com.wildfire.entity.StudentEntity;
import com.wildfire.exception.ResourceNotFoundException;
import com.wildfire.repository.AssessmentRepository;
import com.wildfire.repository.StudentRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private final StudentRepository studentRepo;
    private final AssessmentRepository assessmentRepo;
    private final OpenAiClientService openAiService;

    public AiController(
            StudentRepository studentRepo,
            AssessmentRepository assessmentRepo,
            OpenAiClientService openAiService
    ) {
        this.studentRepo = studentRepo;
        this.assessmentRepo = assessmentRepo;
        this.openAiService = openAiService;
    }

    @PostMapping("/student-insights")
    public ResponseEntity<AIInsightResponse> getStudentInsights(@Valid @RequestBody AIInsightRequest req) {
        StudentEntity s = studentRepo.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + req.getStudentId()));

        List<AssessmentEntity> assessments = assessmentRepo.findByStudentId(req.getStudentId());
        AIInsightResponse response = openAiService.generateStudentInsights(s, assessments);
        return ResponseEntity.ok(response);
    }
}
