package com.panonit.cloudstarter.exceptionhandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;

import org.bouncycastle.openssl.PasswordException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.panonit.cloudstarter.exceptions.PasswordMatchException;
import com.panonit.cloudstarter.exceptions.PasswordResetException;
import com.panonit.cloudstarter.exceptions.ValidationException;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@ControllerAdvice
public class IamServiceExceptionHandler extends ResponseEntityExceptionHandler{
	
	@ExceptionHandler(value = AuthenticationException.class)
	protected ResponseEntity<?> handleAuthException(RuntimeException ex, WebRequest request) {
		String errorMessageBody = "Bad Credentials. Username or password are not valid.";
		String errorMessageType = "Authentication Failure";
		String friendlyMessage = "Invalid username and password are provided, please try again!";
		LocalDateTime timestamp = LocalDateTime.now();

		ErrorMessage errorMessage = new ErrorMessage(errorMessageType, errorMessageBody, friendlyMessage, timestamp);

		return handleExceptionInternal(ex, errorMessage, new HttpHeaders(), HttpStatus.UNAUTHORIZED, request);
	}
	
	@ExceptionHandler(value = PasswordResetException.class)
	protected ResponseEntity<?> handlePasswordResetException(RuntimeException ex, WebRequest request) {
		String errorMessageBody = ex.getMessage();
		String errorMessageType = "Password Reset Error";
		String friendlyMessage = ex.getMessage();
		LocalDateTime timestamp = LocalDateTime.now();

		ErrorMessage errorMessage = new ErrorMessage(errorMessageType, errorMessageBody, friendlyMessage, timestamp);

		return handleExceptionInternal(ex, errorMessage, new HttpHeaders(), HttpStatus.UNAUTHORIZED, request);
	}
	
	@ExceptionHandler(value = JwtException.class)
	protected ResponseEntity<?> handleJwtException(RuntimeException ex, WebRequest request) {
		String errorMessageBody = ex.getMessage();
		String errorMessageType = "Jwt Exception";
		String friendlyMessage = ex.getMessage();
		LocalDateTime timestamp = LocalDateTime.now();
		
		ErrorMessage errorMessage = new ErrorMessage(errorMessageType, errorMessageBody, friendlyMessage, timestamp);
		return handleExceptionInternal(ex, errorMessage, new HttpHeaders(), HttpStatus.UNAUTHORIZED, request);
	}
	
	@ExceptionHandler(value = ExpiredJwtException.class)
	protected ResponseEntity<?> handleExpiredJwtException(RuntimeException ex, WebRequest request) {
		String errorMessageBody = ex.getMessage();
		String errorMessageType = "Token has expired";
		String friendlyMessage = "Your session token has expired, please renew your session to continue.";
		LocalDateTime timestamp = LocalDateTime.now();

		ErrorMessage errorMessage = new ErrorMessage(errorMessageType, errorMessageBody, friendlyMessage, timestamp);

		return handleExceptionInternal(ex, errorMessage, new HttpHeaders(), HttpStatus.GONE, request);
	}
	
	@ExceptionHandler(value = SessionAuthenticationException.class)
	protected ResponseEntity<?> handleSessionAuthenticationException(RuntimeException ex, WebRequest request) {
		String errorMessageBody = ex.getMessage();
		String errorMessageType = "Couldn't refresh session";
		String friendlyMessage = ex.getMessage();
		LocalDateTime timestamp = LocalDateTime.now();
		
		ErrorMessage errorMessage = new ErrorMessage(errorMessageType, errorMessageBody, friendlyMessage, timestamp);
		return handleExceptionInternal(ex, errorMessage, new HttpHeaders(), HttpStatus.UNAUTHORIZED, request);
	}
	
	@ExceptionHandler(value = EntityExistsException.class)
	protected ResponseEntity<?> handleEntityExistsException(RuntimeException ex, WebRequest request) {
		String errorMessageBody = ex.getMessage();
		String errorMessageType = "Entity exists";
		String friendlyMessage = ex.getMessage();
		LocalDateTime timestamp = LocalDateTime.now();
		
		ErrorMessage errorMessage = new ErrorMessage(errorMessageType, errorMessageBody, friendlyMessage, timestamp);
		return handleExceptionInternal(ex, errorMessage, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
	}
	
	@ExceptionHandler(value = EntityNotFoundException.class)
	protected ResponseEntity<?> handleEntityNotFoundException(RuntimeException ex, WebRequest request) {
		String errorMessageBody = ex.getMessage();
		String errorMessageType = "Entity not found";
		String friendlyMessage = ex.getMessage();
		LocalDateTime timestamp = LocalDateTime.now();
		
		ErrorMessage errorMessage = new ErrorMessage(errorMessageType, errorMessageBody, friendlyMessage, timestamp);
		return handleExceptionInternal(ex, errorMessage, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
	}
	
	@ExceptionHandler(value = PasswordMatchException.class)
	protected ResponseEntity<?> handlePasswordMatchException(RuntimeException ex, WebRequest request) {
		String errorMessageBody = ex.getMessage();
		String errorMessageType = "Password match.";
		String friendlyMessage = ex.getMessage();
		LocalDateTime timestamp = LocalDateTime.now();
		
		ErrorMessage errorMessage = new ErrorMessage(errorMessageType, errorMessageBody, friendlyMessage, timestamp);
		return handleExceptionInternal(ex, errorMessage, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
	}
	
	@ExceptionHandler(value = ValidationException.class)
	protected ResponseEntity<?> handleMethodArgumentNotValidException(ValidationException ex) {
		Map<String, String> errors = new HashMap<>();
		
		ex.getBindingResult().getAllErrors().forEach((error) -> {
			String fieldName = ((FieldError) error).getField();
			String errorMessage = error.getDefaultMessage();
			errors.put(fieldName, errorMessage);
		});
		
		return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(value = NullPointerException.class)
	protected ResponseEntity<?> handleNullPointerException(RuntimeException ex, WebRequest request) {
		String errorMessageBody = "Null pointer exception has occured at runtime.";
		String errorMessageType = "NullPointerException";
		String friendlyMessage = "Sorry, some references in the background were not assigned correctly. Please try again later";
		LocalDateTime timestamp = LocalDateTime.now();

		ErrorMessage errorMessage = new ErrorMessage(errorMessageType, errorMessageBody, friendlyMessage, timestamp);

		return handleExceptionInternal(ex, errorMessage, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
	}
	
	@ExceptionHandler(value = LockedException.class)
	protected ResponseEntity<?> handleLockedException(RuntimeException ex, WebRequest request) {
		String errorMessageBody = "The user account you are trying to log in with is disabled.";
		String errorMessageType = "Disabled account exception";
		LocalDateTime timestamp = LocalDateTime.now();

		ErrorMessage errorMessage = new ErrorMessage(errorMessageType, errorMessageBody, errorMessageBody, timestamp);

		return handleExceptionInternal(ex, errorMessage, new HttpHeaders(), HttpStatus.UNAUTHORIZED, request);
	}
	
	@Data
	@AllArgsConstructor
	@NoArgsConstructor
	private class ErrorMessage {
		private String errorType; 
		private String errorMessage;
		private String friendlyMessage;
		private LocalDateTime timeStamp;
	}
}

