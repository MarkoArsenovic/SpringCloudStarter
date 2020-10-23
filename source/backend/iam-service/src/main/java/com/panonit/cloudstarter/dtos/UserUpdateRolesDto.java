package com.panonit.cloudstarter.dtos;

import java.util.List;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateRolesDto {
	
	private Long id;
	
	@NotNull(message = "Roles are required")
	private List<RoleDto> userRoles;
}
