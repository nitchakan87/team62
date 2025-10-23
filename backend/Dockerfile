# Stage 1: Build
FROM gradle:8.6-jdk21 AS build
WORKDIR /app
COPY --chown=gradle:gradle . .
RUN gradle build -x test

# Stage 2: Run
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 30090
ENTRYPOINT ["java", "-jar", "app.jar"]
