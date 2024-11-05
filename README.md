<h1 align=center>
    Microservices Architecture Project 🚀
</h1>

Welcome to the Microservices Architecture Project, developed as part of the Microservices Architecture course at the University of Quindío. This project demonstrates a robust microservices architecture using a variety of technologies and design patterns for optimal scalability, reliability, and monitoring. All microservices are containerized and orchestrated via Docker Compose, ensuring smooth inter-service communication and easy deployment. 🌐

## Table of Contents

- [Microservices Overview](#microservices-overview)
- [Service Architecture](#service-architecture)
- [Deployment and Monitoring](#deployment-and-monitoring)
- [API Documentation](#api-documentation)
- [Automation and Testing](#automation-and-testing)

## Microservices Overview 📋

1. **Authentication Service** 🔐  
   - Built with Go and Gorilla Mux.
   - Uses JWT for secure authentication.
   - Connects to a PostgreSQL database via GORM.

2. **BDD Testing Service** 🧪  
   - End-to-end tests written with Gherkin in Cucumber.js.
   - Covers all project microservices, generating a detailed HTML report of test results.

3. **Logging Service** 📜  
   - Developed with Express.js and TypeScript.
   - Utilizes MySQL via Sequelize ORM.
   - Listens to logs from a NATS server to track system activity.

4. **Health & Monitoring Service** 🩺  
   - Implemented in Python with Flask.
   - Uses MySQL and SQLAlchemy for data persistence.
   - Monitors the `/health` endpoint of all microservices and sends email alerts to service owners if a service is down.

5. **Account Management Service** 👥  
   - Built with Go and Gin framework.
   - Integrates with MySQL using GORM.
   - Listens for user registration messages from the Authentication Service via NATS to create associated user accounts.

6. **Notification Service** 📧  
   - Developed with Python and Flask.
   - Sends email notifications via Mailgun.
   - Works on demand from the Monitoring Service, with email records saved in MySQL using SQLAlchemy.

7. **Gateway Service** 🚪  
   - Centralizes incoming requests and routes them to the appropriate microservices.
   - Built with Fastify in JavaScript for efficient request handling.

8. **Jenkins Auto-Configuration Package** ⚙️  
   - Automates the execution of BDD tests using Cucumber.js in Jenkins for continuous testing.

## Service Architecture 🛠️

Each microservice is deployed within a Docker container. Using Docker Compose, we orchestrate and manage inter-service dependencies, ensuring each microservice communicates seamlessly. The architecture also supports containerized deployment and scaling, ideal for production environments.

## Deployment and Monitoring 📈

- **Prometheus Integration**: A Prometheus instance is set up to monitor the overall health of the system. However, the core monitoring responsibilities are handled by the Python-based Health & Monitoring Service, which ensures real-time alerts and email notifications.
- **Docker Compose**: The final `docker-compose.yml` file orchestrates all containers, handling their deployment and networking, and ensuring unified communication between services.

## API Documentation 📄

Detailed OpenAPI documentation for each microservice can be found in the `documentation` folder. This documentation outlines each API's available endpoints, request parameters, and response structures, allowing for easy interaction and integration with each service.

## Automation and Testing ✅

The project includes a suite of BDD tests that verify the functionality and reliability of all microservices. Jenkins is configured to run these tests automatically, producing HTML reports to display results.

---

This project showcases a comprehensive microservices architecture with advanced monitoring, logging, testing, and deployment practices. Contributions and feedback are welcome as we continue to enhance and optimize this system!
