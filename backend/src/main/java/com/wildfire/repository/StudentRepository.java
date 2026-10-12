package com.wildfire.repository;

import com.wildfire.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, String> {

    List<StudentEntity> findByRiskLevel(String riskLevel);

    List<StudentEntity> findByCourse(String course);

    @Query("SELECT AVG(s.averageScore) FROM StudentEntity s")
    Double calculateOverallAverageScore();

    @Query("SELECT AVG(s.attendanceRate) FROM StudentEntity s")
    Double calculateOverallAttendanceRate();

    long countByRiskLevel(String riskLevel);
}
