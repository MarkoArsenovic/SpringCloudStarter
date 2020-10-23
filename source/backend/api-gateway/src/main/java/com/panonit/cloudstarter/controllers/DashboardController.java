package com.panonit.cloudstarter.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecwid.consul.v1.ConsulClient;
import com.ecwid.consul.v1.Response;
import com.ecwid.consul.v1.agent.model.Member;
import com.ecwid.consul.v1.agent.model.Service;
import com.panonit.cloudstarter.models.RegisteredService;

@RestController
@RequestMapping("dashboard")
@CrossOrigin("*")
public class DashboardController {
	
	@Autowired
	ConsulClient consulClient;
	
	@GetMapping
	public ResponseEntity<?> getAllServices() {
		Map<String, Service> serviceDiscoveryServices = consulClient.getAgentServices().getValue();
		RegisteredService centralService = null;
		RegisteredService configServer = null;
		
		Response<List<Member>> consulAgent = consulClient.getAgentMembers();
		RegisteredService consul = new RegisteredService(consulAgent.getValue().get(0).getName(), "consul-service-registry", 
				consulAgent.getValue().get(0).getAddress(), consulAgent.getValue().get(0).getPort(), "Service Registry", new ArrayList<>());
		
		for(Map.Entry<String, Service> serviceDiscoveryService : serviceDiscoveryServices.entrySet()) {
			if(serviceDiscoveryService.getValue().getPort() == 8765) {
				List<RegisteredService> connected = new ArrayList<>();
				connected.add(consul);
				centralService = new RegisteredService(serviceDiscoveryService.getValue().getId(), serviceDiscoveryService.getValue().getService(), 
						serviceDiscoveryService.getValue().getAddress(), serviceDiscoveryService.getValue().getPort(), "Gateway", connected);
			} 
			else if(serviceDiscoveryService.getValue().getPort() == 8888){
				configServer = new RegisteredService(serviceDiscoveryService.getValue().getId(), serviceDiscoveryService.getValue().getService(), 
						serviceDiscoveryService.getValue().getAddress(), serviceDiscoveryService.getValue().getPort(), "Config Server", new ArrayList<>());
				
				centralService.getConnectedServices().add(configServer);
			} 
			else {
				List<RegisteredService> connected = new ArrayList<>();
				connected.add(configServer);
				connected.add(consul);
				RegisteredService service = new RegisteredService(serviceDiscoveryService.getValue().getId(), serviceDiscoveryService.getValue().getService(), 
						serviceDiscoveryService.getValue().getAddress(), serviceDiscoveryService.getValue().getPort(), "Microservice", 
						connected);
				
				centralService.getConnectedServices().add(service);
			}
		}
		
		return new ResponseEntity<>(centralService, HttpStatus.OK);
	}
}
