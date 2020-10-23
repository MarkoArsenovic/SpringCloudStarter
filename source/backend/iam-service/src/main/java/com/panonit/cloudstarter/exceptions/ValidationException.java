package com.panonit.cloudstarter.exceptions;

import org.springframework.validation.BindingResult;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ValidationException extends RuntimeException {
	private BindingResult bindingResult;
}
