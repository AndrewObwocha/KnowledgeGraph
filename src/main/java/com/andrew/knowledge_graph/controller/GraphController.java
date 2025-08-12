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

@Controller
public class GraphController {

    // --- In-memory DAOs or @Autowired services for your database would go here ---
    // private final NodeService nodeService;
    // private final RelationshipService relationshipService;

    // ==============
    // QUERIES
    // ==============

    @QueryMapping // Maps to the "node" query in the schema
    public Node node(@Argument String id) {
        // return nodeService.findById(id);
        System.out.println("Fetching node with ID: " + id);
        return null; // Replace with actual data access logic
    }

    @QueryMapping // Maps to the "searchNodes" query
    public List<Node> searchNodes(@Argument String titleQuery) {
        // return nodeService.searchByTitle(titleQuery);
        System.out.println("Searching for nodes with title containing: " + titleQuery);
        return List.of(); // Replace with actual data access logic
    }

    // ==============
    // MUTATIONS
    // ==============

    @MutationMapping // Maps to the "addNode" mutation
    public Node addNode(@Argument AddNodeInput input) {
        // return nodeService.createNode(input.title(), input.description());
        System.out.println("Adding node with title: " + input.title());
        return null; // Replace with actual data access logic
    }

    @MutationMapping // Maps to the "linkNodes" mutation
    public Relationship linkNodes(@Argument LinkNodesInput input) {
        // return relationshipService.createLink(input);
        System.out.println("Linking nodes: " + input.fromNodeId() + " -> " + input.toNodeId());
        return null; // Replace with actual data access logic
    }

    @MutationMapping // Maps to the "deleteNode" mutation
    public String deleteNode(@Argument String id) {
        // IMPORTANT: Your service logic here must also delete associated links.
        // relationshipService.deleteLinksForNode(id);
        // nodeService.deleteNode(id);
        System.out.println("Deleting node with ID: " + id);
        return id;
    }

    @MutationMapping // Maps to the "deleteLink" mutation
    public String deleteLink(@Argument String id) {
        // relationshipService.deleteLink(id);
        System.out.println("Deleting link with ID: " + id);
        return id;
    }
    
    // ==============
    // FIELD RESOLVER for Node.connections
    // ==============

    /**
     * This method resolves the 'connections' field for a given Node object.
     * Spring calls this whenever a query asks for the 'connections' field.
     * The `Node` parameter is the parent object from which the field is being requested.
     */
    @SchemaMapping(typeName = "Node", field = "connections")
    public List<Connection> getConnections(Node node) {
        // return relationshipService.getConnectionsForNode(node.getId());
        System.out.println("Fetching connections for node: " + node.getId());
        // This is where you query your database for all relationships
        // connected to this node and build the List<Connection>.
        return List.of(); // Replace with actual data access logic
    }
}

