package com.andrew.knowledge_graph.controller;

import com.andrew.knowledge_graph.model.Node;
import com.andrew.knowledge_graph.model.Connection;
import com.andrew.knowledge_graph.model.Relationship;
import com.andrew.knowledge_graph.model.inputs.AddNodeInput;
import com.andrew.knowledge_graph.model.inputs.LinkNodesInput;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.ArrayList;


@Controller
public class GraphController {

    private final com.andrew.knowledge_graph.repository.NodeRepository nodeRepository;
    private final com.andrew.knowledge_graph.repository.RelationshipRepository relationshipRepository;

    public GraphController(com.andrew.knowledge_graph.repository.NodeRepository nodeRepository,
                          com.andrew.knowledge_graph.repository.RelationshipRepository relationshipRepository) {
        this.nodeRepository = nodeRepository;
        this.relationshipRepository = relationshipRepository;
    }

    // Query methods

    @QueryMapping // Maps to the "node" query in the schema
    public Node node(@Argument String id) {
        try {
            Long nodeId = Long.parseLong(id);
            return nodeRepository.findById(nodeId).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    @QueryMapping // Maps to the "searchNodes" query
    public List<Node> searchNodes(@Argument String titleQuery) {
        // Example: find all nodes containing the titleQuery in their title
        return nodeRepository.findAll().stream()
                .filter(node -> node.getTitle() != null && node.getTitle().toLowerCase().contains(titleQuery.toLowerCase()))
                .toList();
    }

    // Mutation methods

    @MutationMapping // Maps to the "addNode" mutation
    public Node addNode(@Argument AddNodeInput input) {
        Node node = new Node(input.title(), input.description());
        return nodeRepository.save(node);
    }

    @MutationMapping // Maps to the "linkNodes" mutation
    public Relationship linkNodes(@Argument LinkNodesInput input) {
        Relationship relationship = new Relationship(
                input.type(),
                input.notes(),
                Long.parseLong(input.fromNodeId()),
                Long.parseLong(input.toNodeId())
        );
        return relationshipRepository.save(relationship);
    }

    @MutationMapping // Maps to the "deleteNode" mutation
    public String deleteNode(@Argument String id) {
        System.out.println("Deleting node with ID: " + id);
        try {
            Long nodeId = Long.parseLong(id);
            // Delete all relationships where this node is source or target
            relationshipRepository.findByFromNodeId(nodeId).forEach(rel -> relationshipRepository.deleteById(rel.getId()));
            relationshipRepository.findByToNodeId(nodeId).forEach(rel -> relationshipRepository.deleteById(rel.getId()));
            // Delete the node itself
            nodeRepository.deleteById(nodeId);
            return id;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    @MutationMapping // Maps to the "deleteLink" mutation
    public String deleteLink(@Argument String id) {
        System.out.println("Deleting link with ID: " + id);
        try {
            Long relId = Long.parseLong(id);
            relationshipRepository.deleteById(relId);
            return id;
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    // Field resolvers for Nodes.connections

    @SchemaMapping(typeName = "Relationship", field = "from")
    public Node getFromNode(Relationship relationship) {
        return nodeRepository.findById(relationship.getFromNodeId()).orElse(null);
    }

    @SchemaMapping(typeName = "Relationship", field = "to")
    public Node getToNode(Relationship relationship) {
        return nodeRepository.findById(relationship.getToNodeId()).orElse(null);
    }

    @SchemaMapping(typeName = "Node", field = "connections")
    public List<Connection> getConnections(Node node) {
        System.out.println("Fetching connections for node: " + node.getId());
        Long nodeId = node.getId();
        // Find all relationships where this node is either the source or target
        List<Relationship> outgoing = relationshipRepository.findByFromNodeId(nodeId);
        List<Relationship> incoming = relationshipRepository.findByToNodeId(nodeId);

        // Build Connection objects for outgoing relationships
        List<Connection> connections = new ArrayList<>();
        for (Relationship rel : outgoing) {
            Node target = nodeRepository.findById(rel.getToNodeId()).orElse(null);
            if (target != null) {
                connections.add(new Connection(rel, target));
            }
        }
        // Build Connection objects for incoming relationships
        for (Relationship rel : incoming) {
            Node source = nodeRepository.findById(rel.getFromNodeId()).orElse(null);
            if (source != null) {
                connections.add(new Connection(rel, source));
            }
        }
        return connections;
    }
}

