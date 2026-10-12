package com.wildfire.controller;

import com.wildfire.analytics.RiskEngine;
import com.wildfire.dto.RiskAssessmentDto;
import com.wildfire.entity.AssignmentEntity;
import com.wildfire.entity.StudentEntity;
import com.wildfire.exception.ResourceNotFoundException;
import com.wildfire.repository.AssignmentRepository;
import com.wildfire.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class RiskController {

    private final StudentRepository studentRepo;
    private final AssignmentRepository assignmentRepo;
    private final RiskEngine riskEngine;

    public RiskController(
            StudentRepository studentRepo,
            AssignmentRepository assignmentRepo,
            RiskEngine riskEngine
    ) {
        this.studentRepo = studentRepo;
        this.assignmentRepo = assignmentRepo;
        this.riskEngine = riskEngine;
    }

    @GetMapping("/students/{id}/risk")
    public ResponseEntity<RiskAssessmentDto> getStudentRisk(@PathVariable String id) {
        StudentEntity s = studentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + id));

        List<AssignmentEntity> asgs = assignmentRepo.findByStudentId(id);
        RiskAssessmentDto risk = riskEngine.calculateRisk(s, asgs, null);
        return ResponseEntity.ok(risk);
    }

    @PostMapping("/students/{id}/risk/recalculate")
    public ResponseEntity<RiskAssessmentDto> recalculateStudentRisk(@PathVariable String id) {
        StudentEntity s = studentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + id));

        List<AssignmentEntity> asgs = assignmentRepo.findByStudentId(id);
        RiskAssessmentDto risk = riskEngine.calculateRisk(s, asgs, null);

        s.setRiskScore(risk.getScore());
        s.setRiskLevel(risk.getCategory());
        studentRepo.save(s);

        return ResponseEntity.ok(risk);
    }
}
