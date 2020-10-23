package com.panonit.cloudstarter.dtos;

import javax.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppServiceDto {
	
	private Long id;
	
	@NotBlank(message = "Service name is required.")
	private String name;
	
	private String displayName;
	
	private String description;

}
