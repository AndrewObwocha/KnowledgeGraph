package com.andrew.knowledge_graph.repository;

import com.andrew.knowledge_graph.model.Relationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelationshipRepository extends JpaRepository<Relationship, Long> {
    List<Relationship> findByFromNodeId(Long fromNodeId);
    List<Relationship> findByToNodeId(Long toNodeId);
    // Add more custom queries as needed
}
