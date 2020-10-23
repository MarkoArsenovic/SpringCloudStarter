package com.panonit.cloudstarter.dtos;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.panonit.cloudstarter.utils.RoleConsts;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleCreateDto {
	
	@NotBlank(message = "Role name is required.")
	@Size(max = RoleConsts.ROLE_NAME_LENGTH, message = "Maximum length of the role name is " + RoleConsts.ROLE_NAME_LENGTH + ".")
	private String name;
	
	private String description;
	
}
