package com.panonit.cloudstarter.dtos;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class LoginDto {
	@NotBlank(message = "Please enter your username")
	private String username;
	
	@NotBlank(message = "Please enter your password")
	private String password;
}
