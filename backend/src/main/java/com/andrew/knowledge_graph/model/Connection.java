package com.andrew.knowledge_graph.model;

public record Connection(
    Relationship relationship, 
    Node node
) {}
