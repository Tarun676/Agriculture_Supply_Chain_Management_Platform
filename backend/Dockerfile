# ==========================================
# STAGE 1: Build & Package the Application
# ==========================================
FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml to download dependencies first (caching optimization)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source files and build the production jar package
COPY src ./src
RUN mvn package -DskipTests -B

# ==========================================
# STAGE 2: Lightweight Runtime Container
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create a non-root system user for security best practices
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy jar from build stage
COPY --from=build --chown=spring:spring /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
