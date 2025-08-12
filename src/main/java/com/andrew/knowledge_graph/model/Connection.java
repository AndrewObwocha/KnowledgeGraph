package com.andrew.knowledge_graph.model;

// In a file like model/Connection.java
public record Connection(
    Relationship relationship,
    Node node
) {}
