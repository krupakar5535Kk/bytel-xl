package com.wildfire.repository;

import com.wildfire.entity.AssessmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<AssessmentEntity, String> {

    List<AssessmentEntity> findByStudentId(String studentId);

    List<AssessmentEntity> findBySubject(String subject);
}
