
package com.andrew.knowledge_graph.model;

import jakarta.persistence.*;

@Entity
public class Relationship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private RelationshipType type;

    private String notes;

    private Long fromNodeId;
    private Long toNodeId;

    public Relationship() {}

    public Relationship(RelationshipType type, String notes, Long fromNodeId, Long toNodeId) {
        this.type = type;
        this.notes = notes;
        this.fromNodeId = fromNodeId;
        this.toNodeId = toNodeId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RelationshipType getType() {
        return type;
    }

    public void setType(RelationshipType type) {
        this.type = type;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getFromNodeId() {
        return fromNodeId;
    }

    public void setFromNodeId(Long fromNodeId) {
        this.fromNodeId = fromNodeId;
    }

    public Long getToNodeId() {
        return toNodeId;
    }

    public void setToNodeId(Long toNodeId) {
        this.toNodeId = toNodeId;
    }
}
