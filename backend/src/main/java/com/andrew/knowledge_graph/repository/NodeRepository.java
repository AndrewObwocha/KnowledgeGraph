package com.andrew.knowledge_graph.repository;

import com.andrew.knowledge_graph.model.Node;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NodeRepository extends JpaRepository<Node, Long> {
    // You can add custom query methods here if needed
}
