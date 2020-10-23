package com.panonit.cloudstarter.dtos;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class PasswordResetRequestDto {
	
	@Email(message = "Email is not valid.")
	@NotBlank(message = "Email is required.")
	private String email;
}
