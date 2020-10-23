package com.panonit.cloudstarter.dtos;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.panonit.cloudstarter.utils.UserConsts;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterDto{

	@NotBlank(message = "Name is required.")
	@Size(max = UserConsts.NAME_MAX_LENGTH, message = "Maximum length of the user name is " + UserConsts.NAME_MAX_LENGTH + ".")
	private String name;
	
	@NotBlank(message = "Lastname is required.")
	@Size(max = UserConsts.LASTNAME_MAX_LENGTH, message = "Maximum length of the user lastname is " + UserConsts.LASTNAME_MAX_LENGTH + ".")
	private String lastname;
	
	@NotBlank(message = "Username is required.")
	@Size(max = UserConsts.USERNAME_MAX_LENGTH, message = "Maximum length of the username is " + UserConsts.USERNAME_MAX_LENGTH + ".")
	private String username;
	
	@Email(message = "Email is not valid.")
	@NotBlank(message = "Email is required.")
	@Size(max = UserConsts.EMAIL_MAX_LENGTH, message = "Maximum length of the user email is " + UserConsts.EMAIL_MAX_LENGTH + ".")
	private String email;
	
	@NotBlank(message = "Password is required.")
	@Size(min = UserConsts.PASSWORD_MIN_LENGTH, max = UserConsts.PASSWORD_MAX_LENGTH, message = "Password should be between " + UserConsts.PASSWORD_MIN_LENGTH + " and " + UserConsts.PASSWORD_MAX_LENGTH + " characters long.")
	private String password;
	
	@NotBlank(message = "Confirm password is required.")
	@Size(min = UserConsts.PASSWORD_MIN_LENGTH, max = UserConsts.PASSWORD_MAX_LENGTH, message = "Password should be between " + UserConsts.PASSWORD_MIN_LENGTH + " and " + UserConsts.PASSWORD_MAX_LENGTH + " characters long.")
	private String confirmPassword; 
	
}
