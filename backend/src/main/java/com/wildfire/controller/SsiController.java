package com.wildfire.controller;

import com.wildfire.analytics.StudentSuccessIndexEngine;
import com.wildfire.dto.SSIWeightsDto;
import com.wildfire.dto.StudentSuccessIndexDto;
import com.wildfire.entity.AssessmentEntity;
import com.wildfire.entity.StudentEntity;
import com.wildfire.exception.ResourceNotFoundException;
import com.wildfire.repository.AssessmentRepository;
import com.wildfire.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class SsiController {

    private final StudentRepository studentRepo;
    private final AssessmentRepository assessmentRepo;
    private final StudentSuccessIndexEngine ssiEngine;

    public SsiController(
            StudentRepository studentRepo,
            AssessmentRepository assessmentRepo,
            StudentSuccessIndexEngine ssiEngine
    ) {
        this.studentRepo = studentRepo;
        this.assessmentRepo = assessmentRepo;
        this.ssiEngine = ssiEngine;
    }

    @GetMapping("/students/{id}/ssi")
    public ResponseEntity<StudentSuccessIndexDto> getStudentSSI(
            @PathVariable String id,
            @RequestParam(required = false) Double academicsWeight,
            @RequestParam(required = false) Double attendanceWeight,
            @RequestParam(required = false) Double placementWeight,
            @RequestParam(required = false) Double skillsWeight
    ) {
        StudentEntity student = studentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        List<AssessmentEntity> assessments = assessmentRepo.findByStudentId(id);

        SSIWeightsDto weights = new SSIWeightsDto();
        if (academicsWeight != null && attendanceWeight != null && placementWeight != null && skillsWeight != null) {
            weights = new SSIWeightsDto(academicsWeight, attendanceWeight, placementWeight, skillsWeight);
        }

        StudentSuccessIndexDto ssi = ssiEngine.calculateSSI(student, assessments, null, null, weights);
        return ResponseEntity.ok(ssi);
    }

    @PostMapping("/students/{id}/ssi/calculate")
    public ResponseEntity<StudentSuccessIndexDto> calculateCustomSSI(
            @PathVariable String id,
            @RequestBody(required = false) SSIWeightsDto weights
    ) {
        StudentEntity student = studentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        List<AssessmentEntity> assessments = assessmentRepo.findByStudentId(id);
        StudentSuccessIndexDto ssi = ssiEngine.calculateSSI(student, assessments, null, null, weights);
        return ResponseEntity.ok(ssi);
    }

    @GetMapping("/ssi")
    public ResponseEntity<List<StudentSuccessIndexDto>> getAllStudentsSSI() {
        List<StudentEntity> allStudents = studentRepo.findAll();
        List<StudentSuccessIndexDto> ssiList = new ArrayList<>();
        SSIWeightsDto defaultWeights = new SSIWeightsDto();

        for (StudentEntity student : allStudents) {
            List<AssessmentEntity> assessments = assessmentRepo.findByStudentId(student.getId());
            ssiList.add(ssiEngine.calculateSSI(student, assessments, null, null, defaultWeights));
        }

        return ResponseEntity.ok(ssiList);
    }
}
