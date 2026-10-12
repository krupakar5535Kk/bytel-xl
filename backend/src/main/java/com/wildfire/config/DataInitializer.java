package com.wildfire.config;

import com.wildfire.entity.AuditLogEntity;
import com.wildfire.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final AuditLogRepository auditRepo;

    public DataInitializer(AuditLogRepository auditRepo) {
        this.auditRepo = auditRepo;
    }

    @Override
    public void run(String... args) {
        log.info("[WILD FIRE] System initialized. Ready for authenticated student management.");
        if (auditRepo.count() == 0) {
            auditRepo.save(new AuditLogEntity("SYSTEM_STARTUP", "Platform services initialized cleanly. Zero demo records present.", "SYSTEM", "N/A"));
        }
    }
}
