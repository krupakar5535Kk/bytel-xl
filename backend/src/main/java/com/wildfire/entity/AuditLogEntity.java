package com.wildfire.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_timestamp", columnList = "timestamp")
})
public class AuditLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_type", nullable = false, length = 64)
    private String eventType;

    @Column(name = "description", nullable = false, length = 512)
    private String description;

    @Column(name = "performed_by", length = 128)
    private String performedBy;

    @Column(name = "target_id", length = 64)
    private String targetId;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    public void onPrePersist() {
        this.timestamp = LocalDateTime.now();
    }

    public AuditLogEntity() {}

    public AuditLogEntity(String eventType, String description, String performedBy, String targetId) {
        this.eventType = eventType;
        this.description = description;
        this.performedBy = performedBy;
        this.targetId = targetId;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getEventType() { return eventType; }
    public String getDescription() { return description; }
    public String getPerformedBy() { return performedBy; }
    public String getTargetId() { return targetId; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
