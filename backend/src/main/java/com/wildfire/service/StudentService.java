package com.wildfire.service;

import com.wildfire.analytics.RiskEngine;
import com.wildfire.dto.*;
import com.wildfire.entity.*;
import com.wildfire.exception.BadRequestException;
import com.wildfire.exception.ResourceNotFoundException;
import com.wildfire.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepo;
    private final AssessmentRepository assessmentRepo;
    private final AssignmentRepository assignmentRepo;
    private final AuditLogRepository auditRepo;
    private final RiskEngine riskEngine;

    public StudentService(
            StudentRepository studentRepo,
            AssessmentRepository assessmentRepo,
            AssignmentRepository assignmentRepo,
            AuditLogRepository auditRepo,
            RiskEngine riskEngine
    ) {
        this.studentRepo = studentRepo;
        this.assessmentRepo = assessmentRepo;
        this.assignmentRepo = assignmentRepo;
        this.auditRepo = auditRepo;
        this.riskEngine = riskEngine;
    }

    public List<StudentDto> getAllStudents() {
        return studentRepo.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public StudentDto getStudentById(String id) {
        StudentEntity s = studentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return toDto(s);
    }

    @Transactional
    public StudentDto createStudent(StudentDto dto) {
        if (studentRepo.existsById(dto.getId())) {
            throw new BadRequestException("Student with ID " + dto.getId() + " already exists.");
        }

        StudentEntity entity = toEntity(dto);
        // Calculate initial risk
        RiskAssessmentDto risk = riskEngine.calculateRisk(entity, null, null);
        entity.setRiskScore(risk.getScore());
        entity.setRiskLevel(risk.getCategory());

        StudentEntity saved = studentRepo.save(entity);
        auditRepo.save(new AuditLogEntity("STUDENT_CREATED", "Registered student " + saved.getName() + " (" + saved.getId() + ")", "ADVISOR", saved.getId()));
        return toDto(saved);
    }

    @Transactional
    public StudentDto updateStudent(String id, StudentDto dto) {
        StudentEntity entity = studentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        if (dto.getName() != null) entity.setName(dto.getName());
        if (dto.getCourse() != null) entity.setCourse(dto.getCourse());
        if (dto.getSemester() > 0) entity.setSemester(dto.getSemester());
        entity.setAttendanceRate(dto.getAttendanceRate());
        entity.setAverageScore(dto.getAverageScore());
        if (dto.getTrend() != null) entity.setTrend(dto.getTrend());
        if (dto.getAdvisor() != null) entity.setAdvisor(dto.getAdvisor());
        if (dto.getEmail() != null) entity.setEmail(dto.getEmail());

        // Recalculate risk
        List<AssignmentEntity> asgs = assignmentRepo.findByStudentId(id);
        RiskAssessmentDto risk = riskEngine.calculateRisk(entity, asgs, null);
        entity.setRiskScore(risk.getScore());
        entity.setRiskLevel(risk.getCategory());

        StudentEntity updated = studentRepo.save(entity);
        auditRepo.save(new AuditLogEntity("STUDENT_UPDATED", "Updated academic telemetry for " + updated.getId(), "ADVISOR", updated.getId()));
        return toDto(updated);
    }

    @Transactional
    public void deleteStudent(String id) {
        if (!studentRepo.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with ID: " + id);
        }
        studentRepo.deleteById(id);
        auditRepo.save(new AuditLogEntity("STUDENT_DELETED", "Removed student record " + id, "ADMIN", id));
    }

    public List<AssessmentDto> getStudentAssessments(String studentId) {
        return assessmentRepo.findByStudentId(studentId).stream()
                .map(this::toAssessmentDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AssessmentDto addAssessment(String studentId, AssessmentDto dto) {
        AssessmentEntity entity = new AssessmentEntity();
        entity.setId(dto.getId() != null ? dto.getId() : "AS-" + UUID.randomUUID().toString().substring(0, 8));
        entity.setStudentId(studentId);
        entity.setSubject(dto.getSubject());
        entity.setTitle(dto.getTitle());
        entity.setScore(dto.getScore());
        entity.setMaxScore(dto.getMaxScore());
        entity.setDate(dto.getDate());
        entity.setTerm(dto.getTerm());
        entity.setType(dto.getType());

        AssessmentEntity saved = assessmentRepo.save(entity);

        // Update student average
        List<AssessmentEntity> all = assessmentRepo.findByStudentId(studentId);
        double avg = all.stream().mapToInt(AssessmentEntity::getPercentage).average().orElse(0.0);
        studentRepo.findById(studentId).ifPresent(s -> {
            s.setAverageScore(Math.round(avg * 10.0) / 10.0);
            studentRepo.save(s);
        });

        return toAssessmentDto(saved);
    }

    public List<AssignmentEntity> getStudentAssignments(String studentId) {
        return assignmentRepo.findByStudentId(studentId);
    }

    private StudentDto toDto(StudentEntity s) {
        StudentDto d = new StudentDto();
        d.setId(s.getId());
        d.setName(s.getName());
        d.setCourse(s.getCourse());
        d.setSemester(s.getSemester());
        d.setAttendanceRate(s.getAttendanceRate());
        d.setAverageScore(s.getAverageScore());
        d.setTrend(s.getTrend());
        d.setRiskLevel(s.getRiskLevel());
        d.setRiskScore(s.getRiskScore());
        d.setAdvisor(s.getAdvisor());
        d.setEmail(s.getEmail());
        d.setEnrollmentDate(s.getEnrollmentDate());
        d.setStatus(s.getStatus());
        d.setLastUpdated(s.getUpdatedAt() != null ? s.getUpdatedAt().toString() : "");
        return d;
    }

    private StudentEntity toEntity(StudentDto d) {
        StudentEntity s = new StudentEntity();
        s.setId(d.getId());
        s.setName(d.getName());
        s.setCourse(d.getCourse());
        s.setSemester(d.getSemester());
        s.setAttendanceRate(d.getAttendanceRate());
        s.setAverageScore(d.getAverageScore());
        s.setTrend(d.getTrend());
        s.setRiskLevel(d.getRiskLevel() != null ? d.getRiskLevel() : "low");
        s.setRiskScore(d.getRiskScore());
        s.setAdvisor(d.getAdvisor());
        s.setEmail(d.getEmail());
        s.setEnrollmentDate(d.getEnrollmentDate());
        s.setStatus(d.getStatus());
        return s;
    }

    private AssessmentDto toAssessmentDto(AssessmentEntity a) {
        AssessmentDto d = new AssessmentDto();
        d.setId(a.getId());
        d.setStudentId(a.getStudentId());
        d.setSubject(a.getSubject());
        d.setTitle(a.getTitle());
        d.setScore(a.getScore());
        d.setMaxScore(a.getMaxScore());
        d.setPercentage(a.getPercentage());
        d.setDate(a.getDate());
        d.setTerm(a.getTerm());
        d.setType(a.getType());
        return d;
    }
}
