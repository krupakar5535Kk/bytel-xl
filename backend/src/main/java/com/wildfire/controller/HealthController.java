package com.wildfire.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "UP");
        res.put("service", "WILD FIRE — Student Analytics Platform");
        res.put("version", "1.0.0");
        res.put("timestamp", LocalDateTime.now().toString());
        res.put("database", "CONNECTED");
        return ResponseEntity.ok(res);
    }
}
