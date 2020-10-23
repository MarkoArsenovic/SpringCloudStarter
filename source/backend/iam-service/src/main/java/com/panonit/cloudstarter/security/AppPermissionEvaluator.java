package com.panonit.cloudstarter.security;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.panonit.cloudstarter.models.Permission;
import com.panonit.cloudstarter.models.Role;
import com.panonit.cloudstarter.models.User;
import com.panonit.cloudstarter.services.IPermissionService;
import com.panonit.cloudstarter.services.IRoleService;
import com.panonit.cloudstarter.services.IUserService;
import com.panonit.cloudstarter.utils.AccessConsts;

@Component
public class AppPermissionEvaluator implements PermissionEvaluator {
	
	@Autowired
	IUserService userService;
	
	@Autowired
	IPermissionService permissionService;
	
	@Autowired
	IRoleService roleService;
	
	@Autowired
	JwtTokenProvider jwtTokenProvider;

	@Override
	public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
		String authorizationHeader = (String) targetDomainObject;
		
		String token = authorizationHeader.split(" ")[1];
		
		if(!additionalAuthenticationChecks(authentication, token))
			return false;
		
		String serviceName = getServiceName((String) permission);
		String actionSpec = getActionSpec((String) permission);
		
		Optional<User> userOptional = userService.findOne(Long.parseLong(jwtTokenProvider.getUserIdFromJWT(token)));
		
		if(!userOptional.isPresent())
			return false;
		
		User user = userOptional.get();
		
		HashMap<String, Permission> permissions = permissionService.findPermissionsForUser(user);
		
		if(permissions.containsKey(serviceName))
			return checkPermission(permissions.get(serviceName), actionSpec);
		
		return false;
	}

	@Override
	public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType,
			Object permission) {
		return false;
	}
	
	private boolean additionalAuthenticationChecks(Authentication authentication, String token) {
		if(authentication == null || authentication.getPrincipal() == null)
			return false;
		else {
			PrincipalUser loggedInUser = (PrincipalUser) authentication.getPrincipal();
			Optional<User> userByUsername = userService.findByUsername(loggedInUser.getUsername()); 
			
			if(!userByUsername.isPresent())
				return false;
			else {
				User user = userByUsername.get();
				if(Long.parseLong(jwtTokenProvider.getUserIdFromJWT(token)) != user.getId())
					return false;
				else {
					List<Role> tokenRoles = jwtTokenProvider.getRolesFromJWT(token);
					List<Role> userRoles = user.getUserRoles();
					
					if(roleService.compareRoles(tokenRoles, userRoles))
						return false;
				}
			}
		}
		
		return true;
	}
	
	private String getServiceName(String permission) {
		return permission.split("\\.")[0];
	}
	
	private String getActionSpec(String permission) {
		return permission.split("\\.")[1];
	}

	private boolean checkPermission(Permission permission, String actionSpec) {
		switch (actionSpec) {
		
			case AccessConsts.READ_ACCESS:
				return permission.getCanRead();
				
			case AccessConsts.WRITE_ACCESS:
				return permission.getCanWrite();
				
			case AccessConsts.UPDATE_ACCESS:
				return permission.getCanUpdate();
				
			case AccessConsts.DELETE_ACCESS:
				return permission.getCanDelete();
			
			default: 
				return false;
		}
	}

}
