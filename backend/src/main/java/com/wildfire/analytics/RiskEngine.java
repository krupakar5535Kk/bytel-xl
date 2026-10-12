package com.wildfire.analytics;

import com.wildfire.dto.RiskAssessmentDto;
import com.wildfire.dto.RiskFactorDto;
import com.wildfire.dto.RiskWeightsDto;
import com.wildfire.entity.AssignmentEntity;
import com.wildfire.entity.StudentEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class RiskEngine {

    public RiskAssessmentDto calculateRisk(
            StudentEntity student,
            List<AssignmentEntity> assignments,
            RiskWeightsDto weights
    ) {
        if (weights == null) weights = new RiskWeightsDto();

        List<RiskFactorDto> factors = new ArrayList<>();
        List<String> limitations = new ArrayList<>();

        double totalAvailableWeight = 0.0;
        double rawWeightedScore = 0.0;

        // 1. Attendance concern (default 30%)
        double att = student.getAttendanceRate();
        int attRisk;
        String attSeverity;
        String attExplanation;

        if (att >= 85.0) {
            attRisk = (int) Math.max(0, Math.round((100.0 - att) * 1.3));
            attSeverity = "low";
            attExplanation = String.format("Consistent attendance at %.1f%%. Meets institutional threshold.", att);
        } else if (att >= 75.0) {
            attRisk = (int) Math.round(35 + (85.0 - att) * 3.5);
            attSeverity = "moderate";
            attExplanation = String.format("Attendance at %.1f%% is below target 85%%. Early risk of instructional gaps.", att);
        } else {
            attRisk = (int) Math.min(100, Math.round(70 + (75.0 - att) * 2.0));
            attSeverity = "high";
            attExplanation = String.format("Critical attendance deficit at %.1f%% (< 75%% minimum). Strongly correlated with academic difficulty.", att);
        }

        factors.add(new RiskFactorDto(
                "attendance",
                "Attendance Adherence",
                weights.getAttendanceWeight(),
                (int) Math.round(attRisk * weights.getAttendanceWeight()),
                attSeverity,
                String.format("%.1f%%", att),
                attExplanation
        ));
        totalAvailableWeight += weights.getAttendanceWeight();
        rawWeightedScore += attRisk * weights.getAttendanceWeight();

        // 2. Academic Mastery (default 35%)
        double avg = student.getAverageScore();
        int acadRisk;
        String acadSeverity;
        String acadExplanation;

        if (avg >= 80.0) {
            acadRisk = (int) Math.max(0, Math.round((100.0 - avg) * 0.75));
            acadSeverity = "low";
            acadExplanation = String.format("Strong academic achievement average (%.1f%%).", avg);
        } else if (avg >= 65.0) {
            acadRisk = (int) Math.round(20 + (80.0 - avg) * 2.0);
            acadSeverity = "moderate";
            acadExplanation = String.format("Satisfactory performance average (%.1f%%), with selective subject vulnerabilities.", avg);
        } else if (avg >= 50.0) {
            acadRisk = (int) Math.round(55 + (65.0 - avg) * 2.0);
            acadSeverity = "moderate";
            acadExplanation = String.format("Vulnerable academic standing (%.1f%%). Multiple assessments approaching failing thresholds.", avg);
        } else {
            acadRisk = (int) Math.min(100, Math.round(85 + (50.0 - avg) * 1.2));
            acadSeverity = "high";
            acadExplanation = String.format("Severe academic deficit (%.1f%%). Urgent instructional support required.", avg);
        }

        factors.add(new RiskFactorDto(
                "academic",
                "Academic Mastery",
                weights.getAcademicWeight(),
                (int) Math.round(acadRisk * weights.getAcademicWeight()),
                acadSeverity,
                String.format("%.1f%%", avg),
                acadExplanation
        ));
        totalAvailableWeight += weights.getAcademicWeight();
        rawWeightedScore += acadRisk * weights.getAcademicWeight();

        // 3. Trajectory Trend (default 25%)
        String trend = student.getTrend() != null ? student.getTrend().toLowerCase() : "stable";
        int trendRisk;
        String trendSeverity;
        String trendExplanation;

        if ("improving".equals(trend)) {
            trendRisk = 5;
            trendSeverity = "low";
            trendExplanation = "Positive upward progress observed over recent assessment periods.";
        } else if ("stable".equals(trend)) {
            trendRisk = 25;
            trendSeverity = "low";
            trendExplanation = "Stable assessment results maintained across current window.";
        } else {
            trendRisk = 85;
            trendSeverity = "high";
            trendExplanation = "Declining trajectory: Notable downward variance between earlier and latest assessments.";
        }

        factors.add(new RiskFactorDto(
                "trend",
                "Trajectory Trend",
                weights.getTrendWeight(),
                (int) Math.round(trendRisk * weights.getTrendWeight()),
                trendSeverity,
                trend.toUpperCase(),
                trendExplanation
        ));
        totalAvailableWeight += weights.getTrendWeight();
        rawWeightedScore += trendRisk * weights.getTrendWeight();

        // 4. Assignment Completion (default 10%)
        if (assignments != null && !assignments.isEmpty()) {
            long overdue = assignments.stream().filter(a -> "overdue".equalsIgnoreCase(a.getStatus())).count();
            int totalAsg = assignments.size();
            double missingRatio = (double) overdue / totalAsg;

            int asgRisk;
            String asgSeverity;
            String asgExplanation;

            if (overdue == 0) {
                asgRisk = 0;
                asgSeverity = "low";
                asgExplanation = String.format("All %d coursework assignments completed on time.", totalAsg);
            } else if (overdue <= 2 && missingRatio < 0.25) {
                asgRisk = (int) Math.round(missingRatio * 150);
                asgSeverity = "moderate";
                asgExplanation = String.format("%d of %d coursework assignments overdue.", overdue, totalAsg);
            } else {
                asgRisk = (int) Math.min(100, Math.round(50 + missingRatio * 60));
                asgSeverity = "high";
                asgExplanation = String.format("Persistent non-submission pattern: %d overdue assignments (%.0f%%).", overdue, missingRatio * 100);
            }

            factors.add(new RiskFactorDto(
                "assignments",
                "Coursework Completion",
                weights.getAssignmentWeight(),
                (int) Math.round(asgRisk * weights.getAssignmentWeight()),
                asgSeverity,
                String.format("%d/%d Done (%d Overdue)", totalAsg - overdue, totalAsg, overdue),
                asgExplanation
            ));
            totalAvailableWeight += weights.getAssignmentWeight();
            rawWeightedScore += asgRisk * weights.getAssignmentWeight();
        } else {
            limitations.add("Coursework assignments not fully logged; assignment weight redistributed.");
        }

        // Renormalize based on available weights
        int normalizedScore = totalAvailableWeight > 0
                ? (int) Math.min(100, Math.max(0, Math.round(rawWeightedScore / totalAvailableWeight)))
                : 0;

        String category = "low";
        if (normalizedScore >= weights.getHighRiskThreshold()) {
            category = "high";
        } else if (normalizedScore >= weights.getModerateRiskThreshold()) {
            category = "moderate";
        }

        RiskAssessmentDto dto = new RiskAssessmentDto();
        dto.setStudentId(student.getId());
        dto.setScore(normalizedScore);
        dto.setCategory(category);
        dto.setFactors(factors);
        dto.setCalculatedAt(LocalDateTime.now().toString());
        dto.setDataCompleteness((int) Math.round((totalAvailableWeight / 1.0) * 100));
        dto.setLimitations(limitations);

        return dto;
    }
}
