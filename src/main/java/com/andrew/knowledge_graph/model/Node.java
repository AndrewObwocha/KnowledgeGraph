package com.andrew.knowledge_graph.model;

import java.util.Objects;

/**
 * Represents a single entity or concept in the graph.
 * This class is a simple Plain Old Java Object (POJO) used for data transfer.
 * Note that the 'connections' field from the GraphQL schema is not a direct property here;
 * it is resolved separately in the GraphController using a @SchemaMapping.
 */
public class Node {

    private String id;
    private String title;
    private String description;

    /**
     * Default no-argument constructor.
     * Required by many frameworks for reflection-based instantiation (e.g., Jackson JSON deserialization).
     */
    public Node() {
    }

    /**
     * All-arguments constructor for easily creating new Node instances.
     * @param id The unique identifier for the node.
     * @param title The main title or name of the node.
     * @param description An optional description of the node.
     */
    public Node(String id, String title, String description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }

    // --- Getters and Setters ---

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
    // --- Standard Object Methods (equals, hashCode, toString) ---
    // These are highly recommended for any data class.

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Node node = (Node) o;
        return Objects.equals(id, node.id); // Equality is based on the unique ID
    }

    @Override
    public int hashCode() {
        return Objects.hash(id); // Hashing is based on the unique ID
    }


    @Override
    public String toString() {
        return "Node{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}