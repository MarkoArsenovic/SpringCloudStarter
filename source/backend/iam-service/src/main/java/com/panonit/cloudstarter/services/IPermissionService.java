package com.panonit.cloudstarter.services;

import java.util.HashMap;
import java.util.List;

import com.panonit.cloudstarter.dtos.PermissionDto;
import com.panonit.cloudstarter.dtos.PermissionInfoDto;
import com.panonit.cloudstarter.models.AppService;
import com.panonit.cloudstarter.models.Permission;
import com.panonit.cloudstarter.models.Role;
import com.panonit.cloudstarter.models.User;

public interface IPermissionService {
	List<PermissionDto> findPermissionsByRole(String roleName);
	
	PermissionDto findById(Long permissionId);
	
	PermissionDto updatePermission(PermissionDto permissionDto);
	
	HashMap<String, Permission> findPermissionsForUser(User user);
	
	List<PermissionInfoDto> getPermissionsForUserInfo(User user);
	
	void createDefaultPermissionsForCreatedRole(Role createdRole);
	void createDefaultPermissionsForCreatedService(AppService createdAppService);
}
