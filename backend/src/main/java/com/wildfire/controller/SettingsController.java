package com.wildfire.controller;

import com.wildfire.dto.RiskWeightsDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/settings")
public class SettingsController {

    private RiskWeightsDto currentWeights = new RiskWeightsDto();

    @GetMapping("/risk-rules")
    public ResponseEntity<RiskWeightsDto> getRiskWeights() {
        return ResponseEntity.ok(currentWeights);
    }

    @PutMapping("/risk-rules")
    public ResponseEntity<RiskWeightsDto> updateRiskWeights(@RequestBody RiskWeightsDto weights) {
        this.currentWeights = weights;
        return ResponseEntity.ok(this.currentWeights);
    }
}
