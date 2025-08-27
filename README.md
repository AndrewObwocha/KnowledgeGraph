# Knowledge Graph Web Application

## Welcome!
KnowledgeGraph is a web application designed to make tracking information across domains. Leveraging a GraphQL API, this backend service provides flexible data manipulation and uses a local SQLite database to persist data. I aim to externalize information swirling in my mind to focus on analyzing their relationships.

## KnowledgeGraph's Vision
My vision is to make information consumption a compounding activity where knowledge is predominantly interconnected in a network. Trying to internalize everything is a key limitation to scaling our knowledge, and this app is my solution to that.

## Features
- **Graph Exploration** — Navigate a graph structure for seamless dynamic thought
- **Searchability** — Search breadth of nodes for a specific piece of information
- **CRUD node operations** — Create, Read, Update, Delete a particular node of information
- **Node-relationship management** — Manage relationships between any 2 particular nodes, including support for multiple simultaneous relationships


## Technologies Used
- **React** - Handles the user presentation and experience in the frontend
- **GraphQL API** — Serves as a query and mutation handler between frontend and backend
- **SpringBoot (Java)** — Implements the backend operations, including server logic, resolvers, ORMs, etc.
- **SQLite Database** — Manages local data storage, including nodes and relationships
 
## Setup & Running

**Pre-Requisites**
- Download and install Node.js from the official website — nodejs.org/en/download/
- Download and install Java 24 from the official website — java.com/en/download/manual.jsp
- Download and install the Java Virtual Machine from Oracle — oracle.com/java/technologies/downloads/

**Setup**
1. **Clone the repository**
   ```sh
   git clone https://github.com/{yourUsername}/KnowledgeGraph.git
   cd KnowledgeGraph
   ```
4. **Build the project**
	 ```sh
	 ./gradlew build
	 ```
5. **Run the application**
	 ```sh
	 ./gradlew bootRun
	 ```
6. **Access GraphiQL**
	 - Visit `http://localhost:8080/graphiql` for the interactive GraphQL IDE.

## Contributing

Contribution is not only welcome, but encouraged! Here are some ways you can contribute:

- **Feature requests** — You can send feature ideas by opening an issue with the tag feature-request.
- **Bug reports** — You can report a bug by opening an issue with the tag bug
- **Pull requests** — You can contribute directly by forking, coding, and submitting PRs!

## License

This project is licensed under the MIT License.

For further information, feel free to initiate contact:

- **Email** — obwochandrew@gmail.com 
- **Project Link** — https://github.com/AndrewObwocha/KnowledgeGraph
