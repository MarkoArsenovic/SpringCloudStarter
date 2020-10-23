package com.panonit.cloudstarter.dtos;

import java.util.List;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.panonit.cloudstarter.utils.UserConsts;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRolesDto {
	
	private Long id;
	
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
	
	@NotNull(message = "Roles are required")
	private List<RoleDto> userRoles;
}
