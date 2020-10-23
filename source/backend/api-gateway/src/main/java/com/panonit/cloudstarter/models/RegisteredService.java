package com.panonit.cloudstarter.models;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisteredService {
	private String serviceId;
	
	private String serviceName;
	
	private String serviceAddress;
	
	private Integer servicePort;
	
	private String serviceType;
	
	private List<RegisteredService> connectedServices; 
}
