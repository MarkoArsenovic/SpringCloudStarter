package com.panonit.cloudstarter.controllers;

import java.util.ArrayList;
import java.util.List;

import javax.naming.AuthenticationException;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.panonit.cloudstarter.dtos.ChangePasswordDto;
import com.panonit.cloudstarter.dtos.JwtAuthenticationResponseDto;
import com.panonit.cloudstarter.dtos.LoginDto;
import com.panonit.cloudstarter.dtos.PasswordResetDto;
import com.panonit.cloudstarter.dtos.PasswordResetRequestDto;
import com.panonit.cloudstarter.dtos.UserDto;
import com.panonit.cloudstarter.dtos.UserRegisterDto;
import com.panonit.cloudstarter.dtos.UserRolesDto;
import com.panonit.cloudstarter.dtos.UserUpdateRolesDto;
import com.panonit.cloudstarter.exceptions.ValidationException;
import com.panonit.cloudstarter.security.JwtTokenProvider;
import com.panonit.cloudstarter.services.ITokenService;
import com.panonit.cloudstarter.services.IUserService;
import com.panonit.cloudstarter.utils.AccessConsts;
import com.panonit.cloudstarter.utils.IamServiceConsts;

@RestController
@RequestMapping("user")
public class UserController {
	
	@Autowired
	AuthenticationManager authManager;
	
	@Autowired
	JwtTokenProvider tokenProvider;
	
	@Autowired
	ITokenService tokenService;
	
	@Autowired
	IUserService userService;
	
	@PostMapping("login")
	public ResponseEntity<?> login(@Valid @RequestBody LoginDto loginDto, BindingResult bindingResult) {
		if(bindingResult.hasErrors())
			throw new ValidationException(bindingResult);
		
		Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));
		
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		String jwt = tokenProvider.generateToken(authentication);
		
		return new ResponseEntity<JwtAuthenticationResponseDto>(new JwtAuthenticationResponseDto(jwt), HttpStatus.OK);
	}
	
	@PostMapping("register")
	public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegisterDto userRegisterDto, BindingResult bindingResult) {
		if(bindingResult.hasErrors())
			throw new ValidationException(bindingResult);
		
		UserDto createdUser = userService.createUser(userRegisterDto);
		
		if(createdUser == null)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	@PreAuthorize(AccessConsts.IAM_CAN_UPDATE)
	@PutMapping("update")
	public ResponseEntity<?> updateUserWithRoles(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @Valid @RequestBody UserUpdateRolesDto userRolesDto, BindingResult bindingResult) {
		if(bindingResult.hasErrors())
			throw new ValidationException(bindingResult);
		
		UserRolesDto updatedUser = userService.updateUserRoles(userRolesDto);
		
		if(updatedUser == null)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		return new ResponseEntity<UserRolesDto>(updatedUser, HttpStatus.OK);
	}
	
	@PreAuthorize(AccessConsts.IAM_CAN_DELETE)
	@DeleteMapping("{userId}")
	public ResponseEntity<?> deleteUser(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @PathVariable("userId") Long userId) {
		userService.deleteUser(userId);
		
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@PreAuthorize(AccessConsts.IAM_CAN_READ)
	@GetMapping("users")
	public ResponseEntity<?> getAllUsers(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @RequestParam(name = "roleName", required = false) String roleName) {
		List<UserRolesDto> users = new ArrayList<>();
		
		if(roleName == null)
			users = userService.findAllWithRoles();
		else
			users = userService.findAllByRoleName(roleName);
		
		return new ResponseEntity<List<UserRolesDto>>(users, HttpStatus.OK);
	}
	
	@PreAuthorize(AccessConsts.IAM_CAN_READ)
	@GetMapping("users/{userId}")
	public ResponseEntity<UserRolesDto> getUserById(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @PathVariable("userId") Long userId) {
		UserRolesDto userRolesDto = userService.findUserWithRolesById(userId);
		
		if(userRolesDto == null)
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		
		return new ResponseEntity<UserRolesDto>(userRolesDto, HttpStatus.OK);
	}
	
	@PutMapping("account/edit")
	public ResponseEntity<?> updateAccount(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @Valid @RequestBody UserDto userDto, BindingResult bindingResult) {
		if(bindingResult.hasErrors())
			throw new ValidationException(bindingResult);
		
		UserDto updatedUser = userService.updateUser(userDto);
		
		if(updatedUser == null)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		return new ResponseEntity<UserDto>(updatedUser, HttpStatus.OK);
	}
	
	@PutMapping("account/change-password")
	public ResponseEntity<?> changePassword(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @Valid @RequestBody ChangePasswordDto changePasswordDto, BindingResult bindingResult) throws NumberFormatException, AuthenticationException {
		if(bindingResult.hasErrors())
			throw new ValidationException(bindingResult);
		
		Long userId = Long.parseLong(tokenService.extractUserIdFromAuthorizationHeader(token));
		
		userService.changePassword(changePasswordDto, userId);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@PutMapping("account/deactivate")
	public ResponseEntity<?> deactivateAccount(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token) throws NumberFormatException, AuthenticationException {
		Long userId = Long.parseLong(tokenService.extractUserIdFromAuthorizationHeader(token));
		
		boolean deactivated = userService.deactivateAccount(userId);
		
		if(!deactivated)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@GetMapping("account/details")
	public ResponseEntity<?> getAccountDetails(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token) throws NumberFormatException, AuthenticationException {
		Long userId = Long.parseLong(tokenService.extractUserIdFromAuthorizationHeader(token));
		
		UserDto userDto = userService.findById(userId);
		
		if(userDto == null)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		return new ResponseEntity<UserDto>(userDto, HttpStatus.OK);
	}
	
	@PostMapping("refresh-token")
	public ResponseEntity<?> refreshToken(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token) throws AuthenticationException {
		JwtAuthenticationResponseDto tokenDto = tokenService.refreshToken(token);
		
		return new ResponseEntity<JwtAuthenticationResponseDto>(tokenDto, HttpStatus.OK);
	}
	
	@GetMapping("info")
	public ResponseEntity<?> getUserInfo(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token) throws AuthenticationException {
		return new ResponseEntity<>(userService.getUserInfo(token), HttpStatus.OK);
	}
	
	@PostMapping("forgot-password")
	public ResponseEntity<?> forgotPassword(@Valid @RequestBody PasswordResetRequestDto passwordResetRequest, BindingResult bindingResult) {
		if(bindingResult.hasErrors())
			throw new ValidationException(bindingResult);
		
		boolean success = userService.createPasswordResetTokenForUser(passwordResetRequest);
		
		if(!success)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@PostMapping("reset-password")
	public ResponseEntity<?> allowResetPassword(@RequestParam("id") Long id, @RequestParam("token") String token, 
			@Valid @RequestBody PasswordResetDto passwordResetDto, BindingResult bindingResult) {
		if(bindingResult.hasErrors())
			throw new ValidationException(bindingResult);
		
		userService.resetPasswordForUser(id, token, passwordResetDto);
		
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@GetMapping("identify")
	public String identify(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token) {
		return "OK";
	}
}
