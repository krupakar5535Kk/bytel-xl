package com.wildfire.service;

import com.wildfire.dto.DashboardSummaryDto;
import com.wildfire.entity.StudentEntity;
import com.wildfire.repository.InterventionRepository;
import com.wildfire.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final StudentRepository studentRepo;
    private final InterventionRepository interventionRepo;

    public DashboardService(StudentRepository studentRepo, InterventionRepository interventionRepo) {
        this.studentRepo = studentRepo;
        this.interventionRepo = interventionRepo;
    }

    public DashboardSummaryDto getSummary() {
        List<StudentEntity> all = studentRepo.findAll();
        long total = all.size();

        long high = all.stream().filter(s -> "high".equalsIgnoreCase(s.getRiskLevel())).count();
        long mod = all.stream().filter(s -> "moderate".equalsIgnoreCase(s.getRiskLevel())).count();
        long low = all.stream().filter(s -> "low".equalsIgnoreCase(s.getRiskLevel())).count();

        double avgScore = total > 0
                ? Math.round((all.stream().mapToDouble(StudentEntity::getAverageScore).average().orElse(0.0)) * 10.0) / 10.0
                : 0.0;

        double avgAtt = total > 0
                ? Math.round((all.stream().mapToDouble(StudentEntity::getAttendanceRate).average().orElse(0.0)) * 10.0) / 10.0
                : 0.0;

        long activeInts = interventionRepo.findAll().stream()
                .filter(i -> "active".equalsIgnoreCase(i.getStatus()) || "under_review".equalsIgnoreCase(i.getStatus()))
                .count();

        long improved = all.stream().filter(s -> "improving".equalsIgnoreCase(s.getTrend())).count();
        int rate = total > 0 ? (int) Math.round(((double) improved / total) * 100) : 0;

        DashboardSummaryDto dto = new DashboardSummaryDto();
        dto.setTotalStudents(total);
        dto.setAttentionCount(high + mod);
        dto.setHighRiskCount(high);
        dto.setModerateRiskCount(mod);
        dto.setLowRiskCount(low);
        dto.setAverageScore(avgScore);
        dto.setAverageAttendance(avgAtt);
        dto.setActiveInterventions(activeInts);
        dto.setImprovementRate(rate);

        return dto;
    }
}
