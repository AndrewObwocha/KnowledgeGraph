# Knowledge Graph Spring Boot Application

## Overview
This project is a Spring Boot application for managing a knowledge graph. It provides a GraphQL API for creating, linking, searching, and deleting nodes and relationships, with data persisted in a SQLite database. JWT authentication is supported for secure access.

## Features
- GraphQL API for flexible queries and mutations
- Node and Relationship management
- Connection field resolver for rich graph traversal
- SQLite database integration
- JWT authentication (Spring Security)

## Technologies Used
- Java 24
- Spring Boot 3.5.x
- Spring Data JPA
- Spring GraphQL
- Spring Security
- SQLite (via JDBC)
- JWT (via jjwt)

## Project Structure

```
src/main/java/com/andrew/knowledge_graph/
	├── model/           # Domain models (Node, Relationship, Connection, RelationshipType, inputs)
	├── repository/      # Spring Data JPA repositories
	├── controller/      # GraphQL resolvers and mutations
	└── config/          # Security and other configuration
src/main/resources/
	├── application.properties # Database and app config
	└── graphql/schema.graphqls # GraphQL schema
src/test/java/com/andrew/knowledge_graph/ # Unit tests
build.gradle           # Project dependencies and build config
```

## Setup & Running

1. **Clone the repository**
2. **Install Java 24**
3. **Build the project**
	 ```sh
	 ./gradlew build
	 ```
4. **Run the application**
	 ```sh
	 ./gradlew bootRun
	 ```
5. **Access GraphiQL**
	 - Visit `http://localhost:8080/graphiql` for the interactive GraphQL IDE.

## GraphQL API Usage

### Example Queries
```graphql
query {
	node(id: "1") {
		id
		title
		description
		connections {
			relationship { type notes }
			node { id title }
		}
	}
}
```

### Example Mutations
```graphql
mutation {
	addNode(input: {title: "AI", description: "Artificial Intelligence"}) {
		id
		title
	}
	linkNodes(input: {fromNodeId: "1", toNodeId: "2", type: INSPIRED_BY, notes: "Reference"}) {
		id
		type
	}
	deleteNode(id: "1")
	deleteLink(id: "5")
}
```

## Authentication

- JWT authentication is enabled via Spring Security.
- Endpoints under `/auth/**` are public; all others require a valid JWT.
- To obtain a token, use the login endpoint (to be implemented).

## Database

- Uses SQLite (`knowledge-graph.db` in project root).
- Schema is auto-generated via JPA entities.

## Customization

- Add custom queries to repository interfaces as needed.
- Extend GraphQL schema for new features.

## Contributing

Pull requests and issues are welcome!

## License

MIT License
