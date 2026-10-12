package com.wildfire;

import com.wildfire.analytics.RiskEngine;
import com.wildfire.dto.RiskAssessmentDto;
import com.wildfire.dto.RiskWeightsDto;
import com.wildfire.entity.StudentEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class RiskEngineTest {

    private RiskEngine riskEngine;
    private RiskWeightsDto defaultWeights;

    @BeforeEach
    public void setup() {
        riskEngine = new RiskEngine();
        defaultWeights = new RiskWeightsDto();
    }

    @Test
    public void testHighRiskStudentClassification() {
        StudentEntity student = new StudentEntity();
        student.setId("TEST-001");
        student.setName("Test High Risk Student");
        student.setAttendanceRate(60.0); // severe deficit
        student.setAverageScore(45.0);    // failing average
        student.setTrend("declining");

        RiskAssessmentDto result = riskEngine.calculateRisk(student, null, defaultWeights);

        assertNotNull(result);
        assertTrue(result.getScore() >= 65, "Score should be in high risk band: " + result.getScore());
        assertEquals("high", result.getCategory());
        assertFalse(result.getFactors().isEmpty());
    }

    @Test
    public void testLowRiskStudentClassification() {
        StudentEntity student = new StudentEntity();
        student.setId("TEST-002");
        student.setName("Test Low Risk Student");
        student.setAttendanceRate(98.0);
        student.setAverageScore(92.0);
        student.setTrend("improving");

        RiskAssessmentDto result = riskEngine.calculateRisk(student, null, defaultWeights);

        assertNotNull(result);
        assertTrue(result.getScore() < 35, "Score should be in low risk band: " + result.getScore());
        assertEquals("low", result.getCategory());
    }

    @Test
    public void testWeightNormalizationOnMissingAssignments() {
        StudentEntity student = new StudentEntity();
        student.setId("TEST-003");
        student.setName("Partial Data Student");
        student.setAttendanceRate(80.0);
        student.setAverageScore(70.0);
        student.setTrend("stable");

        RiskAssessmentDto result = riskEngine.calculateRisk(student, null, defaultWeights);

        assertNotNull(result);
        assertTrue(result.getScore() >= 0 && result.getScore() <= 100);
        assertTrue(result.getLimitations().size() > 0, "Should document assignment data limitation");
    }
}
