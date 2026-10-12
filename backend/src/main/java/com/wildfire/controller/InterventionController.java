package com.wildfire.controller;

import com.wildfire.dto.InterventionDto;
import com.wildfire.service.InterventionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/interventions")
public class InterventionController {

    private final InterventionService interventionService;

    public InterventionController(InterventionService interventionService) {
        this.interventionService = interventionService;
    }

    @GetMapping
    public ResponseEntity<List<InterventionDto>> getAll() {
        return ResponseEntity.ok(interventionService.getAllInterventions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterventionDto> getById(@PathVariable String id) {
        return ResponseEntity.ok(interventionService.getInterventionById(id));
    }

    @PostMapping
    public ResponseEntity<InterventionDto> create(@Valid @RequestBody InterventionDto dto) {
        InterventionDto created = interventionService.createIntervention(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InterventionDto> update(@PathVariable String id, @RequestBody InterventionDto dto) {
        return ResponseEntity.ok(interventionService.updateIntervention(id, dto));
    }
}
