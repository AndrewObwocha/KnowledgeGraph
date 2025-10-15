package com.andrew.knowledge_graph.repository;

import com.andrew.knowledge_graph.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    /**
     * Finds a Role by its name. Spring Data JPA automatically creates the query
     * for this method based on its name.
     *
     * @param name The name of the role to find (e.g., "ROLE_USER")
     * @return An Optional containing the Role if found, otherwise an empty Optional.
     */
    Optional<Role> findByName(String name);
}