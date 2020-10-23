package com.panonit.cloudstarter.exceptions;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PasswordMatchException extends RuntimeException {
	/**
	 * 
	 */
	private static final long serialVersionUID = -1569131432885225400L;
	
	private String message;
}
