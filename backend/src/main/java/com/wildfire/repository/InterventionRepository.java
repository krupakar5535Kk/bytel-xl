package com.wildfire.repository;

import com.wildfire.entity.InterventionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterventionRepository extends JpaRepository<InterventionEntity, String> {

    List<InterventionEntity> findByStudentId(String studentId);

    List<InterventionEntity> findByStatus(String status);
}
