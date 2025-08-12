package com.andrew.knowledge_graph.model.inputs;

import com.andrew.knowledge_graph.model.RelationshipType;

// In a file like model/inputs/LinkNodesInput.java
public record LinkNodesInput(
    String fromNodeId,
    String toNodeId,
    RelationshipType type,
    String notes
) {}

