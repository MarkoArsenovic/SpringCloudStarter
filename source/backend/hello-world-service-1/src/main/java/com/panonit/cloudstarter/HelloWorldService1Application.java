package com.panonit.cloudstarter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class HelloWorldService1Application {

	public static void main(String[] args) {
		SpringApplication.run(HelloWorldService1Application.class, args);
	}

}
