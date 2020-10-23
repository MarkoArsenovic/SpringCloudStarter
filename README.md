# PanonIT Spring Cloud Starter Project
  

![Home UI](https://drive.google.com/uc?export=view&id=1Spf4Esx6c6awCxgrYZREDJbgKTBOQLXV)
  
![Microservices UI](https://drive.google.com/uc?export=view&id=1VdLs9iKf3aysaqkLn5jo8CWqoChg33Ai)
  
![Users UI](https://drive.google.com/uc?export=view&id=1YKWIHK3iHmK3htINzkeSaC_GSa7ULY2q)
  
  
A simple Spring Cloud Starter Project created with basic functionalities ready to use in every microservices based project.  
It provides ready to use Config Server, Service Discovery service, Central API Gateway, IAM Service and Client Application. 
  
## Components

#### Client Application

* Angular 10 single-page web application provides a single interface to the whole backend with modules mentioned below. Client application provides
user-friendly UI which helps users to easier usage of the backend functionalities.

#### IAM Microservice (Identity and Access Management)

* IAM microservice provides functionalities for users to register, authenticate, and see content based on permissions. Admin user has full permissions and he can execute every operation in the system, he can change permissions for other users.

* IAM microservice connects to the Postgres database where all user credentials, services, roles, and permissions are stored. Each microservice communicates
with this service due to the need to evaluate the user's permission for each endpoint.

#### Core Microservices:

* Config Server - Microservice responsible for the centralized configuration of the whole system based on the git configuration repository.
* Consul Service Discovery - Service Discovery Server which is used as a name server for all microservices, responsible for service registry and discovery.
* API Gateway : Spring Cloud Gateway hides the complexity of the whole system and serves as a proxy for communication with individual microservices. Also provides request filtering, performs checks if the user is authenticated. The rest of the security is handled in the targeted microservice.  
  
  
| Services | Container Port | Host Port |
| --- | --- | --- |
| Consul Service Registry | 8500 | 8500 |
| Config Server | 8888 | 8888 |
| Web API Gateway | 8765 | 8765 |
| IAM Service | 8010 | 8010 |
| Hello World Service | 8020 | 8020 |
| Hello World Service-1 | 8035 | 8035 |
| Example Service | 8030 | 8030 |
  
  
  
| Databases | Container Port | Host Port |
| --- | --- | --- |
| Postgres | 5432 | 5000 |
| Rabbit (Spring Bus) | 5672 | 5672 |
  
  
  
| Databases | Credentials | UI Access |
| --- | --- | --- |
| Postgres | postgres / postgres | / |
| Rabbit (Spring Bus) | rabbitmq / rabbitmq | localhost:15672 |
  
* Spring Bus - provides functionality to refresh configuration for services without restarting, to refresh you need to send POST request to  
{API-Gateway}/{MicroserviceRoute}/actuator/bus-refresh
  

## Technology

Technology Stack used for development:
* [Spring Boot](https://spring.io/projects/spring-boot) - Spring Boot is a project built on the top of the Spring Framework. It provides a simpler and faster
way to set up, configure, and run simple or web-based applications.
* [Spring Cloud](https://spring.io/projects/spring-cloud) - Spring Cloud (Hoxton.SR8 version) provides tools for developers to quickly build some of the common patters in distributed systems (e.g. configuration management, service discovery, routing,..). Using Spring Cloud developers can quickly stand up services and applications that implement those patterns.
* [RabbitMQ](https://www.rabbitmq.com/) - RabbitMQ is lightweight and easy to deploy on premises and in the cloud. It supports multiple messaging protocols.
RabbitMQ can be deployed in distributed and federated configurations to meet high-scale, high-availability requirements.
* [PostgreSQL-11](https://www.postgresql.org/download/) - PostgreSQL is a powerful, open source object-relational database system.
* [Angular 10](https://angular.io/) - Angular is a platform and framework for building single-page client applications using HTML and TypeScript. It implements core and optional functionality as a set of TypeScript libraries that you import into your apps.


## Installation

In order to run this starter application locally you need to have [Docker](https://www.docker.com/) and [Docker-Compose](https://docs.docker.com/compose/install/) installed on your machine.
  
In order to run the Cloud Starter development application, you need to provide in host environment variables your GitHub repo credentials for config server to pull configuration for microservices.
* GITHUB_EMAIL
* GITHUB_PASSWORD  
Also, you can replace env placeholders with credentials in docker-compose file.
  
After docker is installed and you configured credentials for Config Server, you can start everything up by executing the following commands:

```bash
git clone https://github.com/MarkoArsenovic/SpringCloudStarter.git
cd SpringCloudStarter/source
docker-compose up --build
```
  
In order to stop development application and all related containers, press Ctrl + C command and after that execute following command in cmd:

```bash
docker-compose down
```
  

For the development IDEs we use [Spring Tools 4](https://spring.io/tools) and [Visual Studio Code](https://code.visualstudio.com/).

* [Spring Tools 4](https://spring.io/tools)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Spring Boot](https://spring.io/projects/spring-boot)
* [Spring Cloud](https://spring.io/projects/spring-cloud)
* [RabbitMQ](https://www.rabbitmq.com/)
* [PostgreSQL-11](https://www.postgresql.org/download/)
* [Angular 10](https://angular.io/)
* [Docker](https://www.docker.com/)
* [Docker-Compose](https://docs.docker.com/compose/install/)
* [OpenJDK](https://openjdk.java.net/projects/jdk/11/)
* [NodeJS](https://nodejs.org/en/)
* [Lombok](https://projectlombok.org/)
* [npm](https://www.npmjs.com/)

  
## Contributors

* [Ziko Petrovic](https://github.com/petrovicziko96) (Software Developer)
* [Aleksandar Foltin](https://github.com/aleksandar8821-2) (Software Developer)
