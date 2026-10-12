package com.wildfire.service;

import com.wildfire.dto.InterventionDto;
import com.wildfire.entity.AuditLogEntity;
import com.wildfire.entity.InterventionEntity;
import com.wildfire.exception.ResourceNotFoundException;
import com.wildfire.repository.AuditLogRepository;
import com.wildfire.repository.InterventionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InterventionService {

    private final InterventionRepository interventionRepo;
    private final AuditLogRepository auditRepo;

    public InterventionService(InterventionRepository interventionRepo, AuditLogRepository auditRepo) {
        this.interventionRepo = interventionRepo;
        this.auditRepo = auditRepo;
    }

    public List<InterventionDto> getAllInterventions() {
        return interventionRepo.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public InterventionDto getInterventionById(String id) {
        InterventionEntity entity = interventionRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Intervention not found with ID: " + id));
        return toDto(entity);
    }

    @Transactional
    public InterventionDto createIntervention(InterventionDto dto) {
        InterventionEntity entity = new InterventionEntity();
        entity.setId(dto.getId() != null ? dto.getId() : "INT-" + UUID.randomUUID().toString().substring(0, 8));
        entity.setStudentId(dto.getStudentId());
        entity.setStudentName(dto.getStudentName());
        entity.setCategory(dto.getCategory());
        entity.setTitle(dto.getTitle());
        entity.setReason(dto.getReason());
        entity.setEvidence(dto.getEvidence());
        entity.setActionItems(dto.getActionItems() != null ? String.join("\n", dto.getActionItems()) : "");
        entity.setAssignedTo(dto.getAssignedTo());
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : "active");
        entity.setTargetReviewDate(dto.getTargetReviewDate());

        if (dto.getPreMetric() != null) {
            entity.setPreAttendanceRate(dto.getPreMetric().getAttendanceRate());
            entity.setPreAverageScore(dto.getPreMetric().getAverageScore());
        }

        InterventionEntity saved = interventionRepo.save(entity);
        auditRepo.save(new AuditLogEntity("INTERVENTION_LOGGED", "Created intervention " + saved.getTitle() + " for " + saved.getStudentName(), saved.getAssignedTo(), saved.getStudentId()));
        return toDto(saved);
    }

    @Transactional
    public InterventionDto updateIntervention(String id, InterventionDto dto) {
        InterventionEntity entity = interventionRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Intervention not found with ID: " + id));

        if (dto.getStatus() != null) entity.setStatus(dto.getStatus());
        if (dto.getFollowUpNotes() != null) entity.setFollowUpNotes(dto.getFollowUpNotes());
        if (dto.getPostMetric() != null) {
            entity.setPostAttendanceRate(dto.getPostMetric().getAttendanceRate());
            entity.setPostAverageScore(dto.getPostMetric().getAverageScore());
        }

        InterventionEntity updated = interventionRepo.save(entity);
        auditRepo.save(new AuditLogEntity("INTERVENTION_UPDATED", "Updated status to " + updated.getStatus() + " for case " + updated.getId(), updated.getAssignedTo(), updated.getStudentId()));
        return toDto(updated);
    }

    private InterventionDto toDto(InterventionEntity e) {
        InterventionDto d = new InterventionDto();
        d.setId(e.getId());
        d.setStudentId(e.getStudentId());
        d.setStudentName(e.getStudentName());
        d.setCategory(e.getCategory());
        d.setTitle(e.getTitle());
        d.setReason(e.getReason());
        d.setEvidence(e.getEvidence());
        d.setActionItems(e.getActionItems() != null ? Arrays.asList(e.getActionItems().split("\n")) : List.of());
        d.setAssignedTo(e.getAssignedTo());
        d.setStatus(e.getStatus());
        d.setTargetReviewDate(e.getTargetReviewDate());
        d.setPreMetric(new InterventionDto.MetricDto(e.getPreAttendanceRate(), e.getPreAverageScore()));
        if (e.getPostAttendanceRate() != null && e.getPostAverageScore() != null) {
            d.setPostMetric(new InterventionDto.MetricDto(e.getPostAttendanceRate(), e.getPostAverageScore()));
        }
        d.setFollowUpNotes(e.getFollowUpNotes());
        d.setCreatedAt(e.getCreatedAt() != null ? e.getCreatedAt().toString() : "");
        d.setLastUpdated(e.getUpdatedAt() != null ? e.getUpdatedAt().toString() : "");
        return d;
    }
}
