FROM maven:3-openjdk-11 as builder

RUN mkdir -p /build
WORKDIR /build

COPY pom.xml .

COPY src ./src

RUN mvn clean package -DskipTests

EXPOSE 8010

FROM openjdk:11.0-slim as runtime

ENV JAVA_OPTS="-Dspring.profiles.active=production"

COPY --from=builder /build/target/*.jar app.jar

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
