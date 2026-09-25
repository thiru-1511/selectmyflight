# Multi-stage Dockerfile for SelectMyFlight Spring Boot Backend
# Stage 1: Build JAR with Maven & OpenJDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run lightweight JRE 21 Container
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/selectmyflight-backend-1.0.0.jar app.jar
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
