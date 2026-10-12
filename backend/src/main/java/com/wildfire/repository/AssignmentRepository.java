package com.wildfire.repository;

import com.wildfire.entity.AssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<AssignmentEntity, String> {

    List<AssignmentEntity> findByStudentId(String studentId);
}
