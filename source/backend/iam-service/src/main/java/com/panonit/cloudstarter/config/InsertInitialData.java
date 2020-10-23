package com.panonit.cloudstarter.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.panonit.cloudstarter.dtos.AppServiceCreateDto;
import com.panonit.cloudstarter.dtos.PermissionDto;
import com.panonit.cloudstarter.dtos.RoleCreateDto;
import com.panonit.cloudstarter.dtos.RoleDto;
import com.panonit.cloudstarter.dtos.UserDto;
import com.panonit.cloudstarter.dtos.UserRegisterDto;
import com.panonit.cloudstarter.dtos.UserRolesDto;
import com.panonit.cloudstarter.dtos.UserUpdateRolesDto;
import com.panonit.cloudstarter.models.User;
import com.panonit.cloudstarter.services.IAppServiceService;
import com.panonit.cloudstarter.services.IPermissionService;
import com.panonit.cloudstarter.services.IRoleService;
import com.panonit.cloudstarter.services.IUserService;

import javassist.NotFoundException;

@Component
public class InsertInitialData implements ApplicationRunner {
	
	@Autowired
	IPermissionService permissionService;
	
	@Autowired
	IAppServiceService appService;
	
	@Autowired
	IRoleService roleService;
	
	@Autowired
	IUserService userService;
	

	@Override
	public void run(ApplicationArguments args) throws Exception {
		if(appService.findAll().size() == 0)
			createInitialServices();
		
		if(roleService.findAll().size() == 0)
			createInitialRoles();
		
		if(!userService.findByUsername("admin").isPresent())
			createInitialAdminUser();
		
		createInitialPermissions();
	}
	
	
	private void createInitialRoles() throws NotFoundException {
		RoleCreateDto roleAdmin = new RoleCreateDto("Admin", "Admin role has all permissions, super admin");
		RoleCreateDto roleUser = new RoleCreateDto("User", "User role, an initial role for every new user, limited permissions");
		
		roleService.createRole(roleAdmin);
		
		roleService.createRole(roleUser);
	}
	
	private void createInitialPermissions() throws NotFoundException {
		List<PermissionDto> permissions = permissionService.findPermissionsByRole("Admin");
		
		for(PermissionDto permission : permissions) {
			if(permission.getService().getName().equals("IAM")) {
				permission.setCanDelete(true);
				permission.setCanUpdate(true);
				permission.setCanWrite(true);
				permission.setCanRead(true);
				
				permissionService.updatePermission(permission);
			}
		}
	}
	
	private void createInitialServices() {
		AppServiceCreateDto service = new AppServiceCreateDto("IAM", "IAM Service", "IAM Service responsible for users");
		
		appService.createAppService(service);
	}
	
	private void createInitialAdminUser() throws NotFoundException {
		UserRegisterDto user = new UserRegisterDto("Admin", "Admin", "admin", "admin@admin.com", "admin", "admin");
		
		UserDto saved = userService.createUser(user);
		
		User admin = userService.findOne(saved.getId()).get();
		
		List<RoleDto> roles = roleService.findAll();
		
		UserUpdateRolesDto userUpdateRoles = new UserUpdateRolesDto(saved.getId(), roles);
		
		UserRolesDto userRoles = userService.updateUserRoles(userUpdateRoles);
	}
	

}
