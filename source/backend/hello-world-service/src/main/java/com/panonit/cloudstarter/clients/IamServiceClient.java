package com.panonit.cloudstarter.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient("iam-service")
public interface IamServiceClient {
	@GetMapping("role/roles")
	ResponseEntity<?> getRoles(@RequestHeader("Authorization") String token);
}
