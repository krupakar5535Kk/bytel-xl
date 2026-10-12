package com.wildfire;

import com.wildfire.analytics.StudentSuccessIndexEngine;
import com.wildfire.dto.SSIWeightsDto;
import com.wildfire.dto.StudentSuccessIndexDto;
import com.wildfire.entity.StudentEntity;
import com.wildfire.exception.BadRequestException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

public class StudentSuccessIndexEngineTest {

    private StudentSuccessIndexEngine engine;

    @BeforeEach
    void setUp() {
        engine = new StudentSuccessIndexEngine();
    }

    @Test
    void testPromptExampleCalculation_60_70_60_50_Equals_60() {
        // Academics = 60%, Attendance = 70%, Placement = 60%, Skills = 50%
        // SSI = (60 * 0.25) + (70 * 0.25) + (60 * 0.25) + (50 * 0.25) = 15 + 17.5 + 15 + 12.5 = 60.0%
        StudentEntity student = new StudentEntity();
        student.setId("STU-TEST-01");
        student.setName("Test Student");
        student.setAverageScore(60.0);
        student.setAttendanceRate(70.0);

        SSIWeightsDto weights = new SSIWeightsDto(0.25, 0.25, 0.25, 0.25);

        StudentSuccessIndexDto ssi = engine.calculateSSI(
                student,
                Collections.emptyList(),
                60.0, // placement
                50.0, // skills
                weights
        );

        assertNotNull(ssi);
        assertEquals("COMPLETE", ssi.getDataCompleteness());
        assertEquals(4, ssi.getFactorsWithValidData());
        assertNotNull(ssi.getOverallScore());
        assertEquals(60.0, ssi.getOverallScore(), 0.001);
    }

    @Test
    void testAllFactors100Percent() {
        StudentEntity student = new StudentEntity();
        student.setId("STU-100");
        student.setName("Top Student");
        student.setAverageScore(100.0);
        student.setAttendanceRate(100.0);

        SSIWeightsDto weights = new SSIWeightsDto(0.25, 0.25, 0.25, 0.25);

        StudentSuccessIndexDto ssi = engine.calculateSSI(
                student,
                Collections.emptyList(),
                100.0,
                100.0,
                weights
        );

        assertEquals("COMPLETE", ssi.getDataCompleteness());
        assertEquals(100.0, ssi.getOverallScore(), 0.001);
    }

    @Test
    void testAllFactorsZeroPercent() {
        StudentEntity student = new StudentEntity();
        student.setId("STU-0");
        student.setName("Zero Student");
        student.setAverageScore(0.0);
        student.setAttendanceRate(0.0);

        SSIWeightsDto weights = new SSIWeightsDto(0.25, 0.25, 0.25, 0.25);

        StudentSuccessIndexDto ssi = engine.calculateSSI(
                student,
                Collections.emptyList(),
                0.0,
                0.0,
                weights
        );

        assertEquals("COMPLETE", ssi.getDataCompleteness());
        assertEquals(0.0, ssi.getOverallScore(), 0.001);
    }

    @Test
    void testInvalidWeights_RejectNon100Percent() {
        StudentEntity student = new StudentEntity();
        student.setId("STU-INV");
        student.setName("Invalid Weights");
        student.setAverageScore(75.0);
        student.setAttendanceRate(80.0);

        // Sum = 0.50 + 0.30 + 0.10 + 0.05 = 0.95 (not 1.0)
        SSIWeightsDto badWeights = new SSIWeightsDto(0.50, 0.30, 0.10, 0.05);

        assertThrows(BadRequestException.class, () -> {
            engine.calculateSSI(student, Collections.emptyList(), 70.0, 75.0, badWeights);
        });
    }

    @Test
    void testMissingDataPolicy_NoSilentZero() {
        StudentEntity student = new StudentEntity();
        student.setId("STU-MISSING");
        student.setName("Missing Data");
        student.setAverageScore(80.0);
        student.setAttendanceRate(85.0);

        SSIWeightsDto weights = new SSIWeightsDto(0.25, 0.25, 0.25, 0.25);

        // Pass invalid negative values for placement and skills to simulate missing/unrecorded assessments
        StudentSuccessIndexDto ssi = engine.calculateSSI(
                student,
                Collections.emptyList(),
                -1.0, // invalid placement
                -1.0, // invalid skills
                weights
        );

        // Crucial policy check: overall score must NOT be generated when required factors are missing!
        assertEquals("PARTIAL", ssi.getDataCompleteness());
        assertNull(ssi.getOverallScore(), "Overall score must be null when factors are missing");
        assertEquals(2, ssi.getFactorsWithValidData());
        assertNotNull(ssi.getPartialScore(), "Partial score preview should be available and labeled");
    }
}
