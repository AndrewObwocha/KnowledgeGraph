# GraphMind Web Application

## Welcome!
GraphMind is a full-stack web application for visually organizing and exploring information as a network of interconnected nodes and relationships. Designed to help users externalize and analyze complex knowledge, it features a modern React frontend, a robust Spring Boot backend, and a flexible GraphQL API powered by a local SQLite database.


## GraphMind's Vision
Information is most powerful when connected. GraphMind aims to make learning and research a compounding activity by mapping ideas, facts, and concepts as a graph—helping you see relationships, discover patterns, and grow your knowledge network over time.


## Features
- **Interactive Graph Exploration** — Explore and manipulate nodes and relationships in a dynamic, visually engaging graph.

- **Search & Discovery** — Find nodes by title or keyword for quick navigation.

- **CRUD operations** — Create, read, update, and delete nodes and relationships with ease.

- **User Authentication** — Secure login, registration, and JWT-based session management.

- **Personalized Knowledge Graphs** — Each user can build and manage their own private graph.

- **GraphQL API** — Flexible queries and mutations for frontend and external integrations.


## Technologies

- **React** - Handles the user presentation and experience in the frontend
- **SpringBoot (Java)** — Implements the backend operations, including server logic, resolvers, ORMs, etc.
- **GraphQL API** — Serves as a query and mutation handler between frontend and backend
- **JWT** — Serves as primary authentication handler
- **SQLite Database** — Manages local data storage, including nodes and relationships
 
## Setup & Running

**Pre-Requisites**
- Download and install Node.js from the official website - [Node.js](https://nodejs.org/en/download/)
- Download and install Java 24 from the official website - [Java 24](https://www.oracle.com/java/technologies/downloads/)
- Download and install the Java Virtual Machine from Oracle - [Java Virtual Machine](https://www.oracle.com/java/technologies/downloads/)

**Setup**
1. **Clone the repository**
   ```sh
   git clone https://github.com/{yourUsername}/KnowledgeGraph.git
   cd KnowledgeGraph
   ```
2. **Install frontend dependencies**
   ```sh
   cd frontend
   npm install
   ```

3. **Build and run the backend**
   ```sh
   cd ../backend
   ./gradlew build
   ./gradlew bootRun
   ```

4. **Run the frontend**
   ```sh
   cd ../frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - GraphiQL IDE: [http://localhost:8080/graphiql](http://localhost:8080/graphiql)

## Contributing

Contribution is not only welcome, but encouraged! Here are some ways you can contribute:

- **Feature requests** — You can send feature ideas by opening an issue with the `feature-request` label.
- **Bug reports** — You can report a bug by opening an issue with the `bug` label.
- **Pull requests** — You can contribute directly by forking, coding, and submitting PRs!

## License

This project is licensed under the MIT License.

For further information, feel free to initiate contact:

- **Email** — obwochandrew@gmail.com 
- **GitHub:** [AndrewObwocha/KnowledgeGraph](https://github.com/AndrewObwocha/KnowledgeGraph)

---

*Happy mapping!*
