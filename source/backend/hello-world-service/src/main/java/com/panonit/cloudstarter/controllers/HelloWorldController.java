package com.panonit.cloudstarter.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.panonit.cloudstarter.clients.IamServiceClient;

@RestController
@RequestMapping("hello-world")
public class HelloWorldController {
	
	@Autowired
	IamServiceClient iamServiceClient;
	
	@GetMapping("get-roles")
	public ResponseEntity<?> getToles(@RequestHeader("Authorization") String token) {
		ResponseEntity<?> roles = iamServiceClient.getRoles(token);
		
		return new ResponseEntity<>(roles.getBody(), HttpStatus.OK);
	}
}
