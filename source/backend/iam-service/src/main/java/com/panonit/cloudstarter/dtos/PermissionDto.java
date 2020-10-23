package com.panonit.cloudstarter.dtos;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PermissionDto {
	
	private Long id;
	
	private RoleDto role;

	private AppServiceDto service;

	@NotNull(message = "Propery could not be null")
	private Boolean canUpdate;

	@NotNull(message = "Propery could not be null")
	private Boolean canRead;

	@NotNull(message = "Propery could not be null")
	private Boolean canWrite;

	@NotNull(message = "Propery could not be null")
	private Boolean canDelete;
}
