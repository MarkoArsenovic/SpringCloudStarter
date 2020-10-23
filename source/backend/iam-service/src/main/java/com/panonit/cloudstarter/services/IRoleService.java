package com.panonit.cloudstarter.services;

import java.util.List;

import com.panonit.cloudstarter.dtos.RoleCreateDto;
import com.panonit.cloudstarter.dtos.RoleDto;
import com.panonit.cloudstarter.models.Role;

public interface IRoleService {
	RoleDto createRole(RoleCreateDto role);
	
	RoleDto updateRole(RoleDto role);
	
	List<RoleDto> findAll();
	
	List<Role> getAllRolesForPermissions();
	
	RoleDto findById(Long roleId);
	
	Role getUserInitialRole();
	
	void deleteRoleById(Long roleId);
	
	boolean checkRoleNameExists(String name);
	
	boolean compareRoles(List<Role> tokenRoles, List<Role> userRoles);
}
