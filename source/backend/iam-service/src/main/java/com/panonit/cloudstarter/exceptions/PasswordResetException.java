package com.panonit.cloudstarter.exceptions;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PasswordResetException extends RuntimeException {

	private String message;
	
}
