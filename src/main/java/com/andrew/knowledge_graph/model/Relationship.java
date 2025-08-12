package com.andrew.knowledge_graph.model;

// In a file like model/Relationship.java
public record Relationship(
    String id,
    RelationshipType type,
    String notes,
    String fromNodeId, // Storing IDs is more practical than the full object
    String toNodeId
) {}
