package com.wildfire.repository;

import com.wildfire.entity.AttendanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceEntity, String> {

    List<AttendanceEntity> findByStudentId(String studentId);
}
