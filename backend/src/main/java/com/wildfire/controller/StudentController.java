package com.wildfire.controller;

import com.wildfire.dto.AssessmentDto;
import com.wildfire.dto.StudentDto;
import com.wildfire.entity.AssignmentEntity;
import com.wildfire.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable String id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PostMapping
    public ResponseEntity<StudentDto> createStudent(@Valid @RequestBody StudentDto dto) {
        StudentDto created = studentService.createStudent(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDto> updateStudent(@PathVariable String id, @RequestBody StudentDto dto) {
        return ResponseEntity.ok(studentService.updateStudent(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/assessments")
    public ResponseEntity<List<AssessmentDto>> getStudentAssessments(@PathVariable String id) {
        return ResponseEntity.ok(studentService.getStudentAssessments(id));
    }

    @PostMapping("/{id}/assessments")
    public ResponseEntity<AssessmentDto> addAssessment(@PathVariable String id, @RequestBody AssessmentDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.addAssessment(id, dto));
    }

    @GetMapping("/{id}/assignments")
    public ResponseEntity<List<AssignmentEntity>> getStudentAssignments(@PathVariable String id) {
        return ResponseEntity.ok(studentService.getStudentAssignments(id));
    }
}
