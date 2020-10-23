FROM maven:3-openjdk-11 as builder

RUN mkdir -p /build
WORKDIR /build

COPY pom.xml .

COPY src ./src

RUN mvn clean package -DskipTests

EXPOSE 8888

FROM openjdk:11.0-slim as runtime

ENV JAVA_OPTS="-Dspring.profiles.active=production -Dspring.cloud.config.server.git.username=$GITLAB_EMAIL -Dspring.cloud.config.server.git.password=$GITLAB_PASSWORD"

COPY --from=builder /build/target/*.jar app.jar

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
