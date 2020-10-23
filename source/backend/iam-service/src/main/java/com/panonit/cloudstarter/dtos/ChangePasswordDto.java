package com.panonit.cloudstarter.dtos;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.panonit.cloudstarter.utils.UserConsts;

import lombok.Data;

@Data
public class ChangePasswordDto {
	
	@NotBlank(message = "Old Password is required.")
	@Size(min = UserConsts.PASSWORD_MIN_LENGTH, max = UserConsts.PASSWORD_MAX_LENGTH, message = "Password should be between " + UserConsts.PASSWORD_MIN_LENGTH + " and " + UserConsts.PASSWORD_MAX_LENGTH + " characters long.")
	private String oldPassword;
	
	@NotBlank(message = "new Password is required.")
	@Size(min = UserConsts.PASSWORD_MIN_LENGTH, max = UserConsts.PASSWORD_MAX_LENGTH, message = "Password should be between " + UserConsts.PASSWORD_MIN_LENGTH + " and " + UserConsts.PASSWORD_MAX_LENGTH + " characters long.")
	private String newPassword;
	
	@NotBlank(message = "Confirm password is required.")
	@Size(min = UserConsts.PASSWORD_MIN_LENGTH, max = UserConsts.PASSWORD_MAX_LENGTH, message = "Password should be between " + UserConsts.PASSWORD_MIN_LENGTH + " and " + UserConsts.PASSWORD_MAX_LENGTH + " characters long.")
	private String confirmNewPassword;
}
