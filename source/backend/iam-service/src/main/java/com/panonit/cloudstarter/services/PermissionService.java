package com.panonit.cloudstarter.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.panonit.cloudstarter.dtos.PermissionDto;
import com.panonit.cloudstarter.dtos.PermissionInfoDto;
import com.panonit.cloudstarter.models.AppService;
import com.panonit.cloudstarter.models.Permission;
import com.panonit.cloudstarter.models.Role;
import com.panonit.cloudstarter.models.User;
import com.panonit.cloudstarter.repositories.PermissionRepository;

@Service
public class PermissionService implements IPermissionService {
	
	@Autowired
	PermissionRepository permissionRepository;
	
	@Autowired
	IAppServiceService appServiceService;
	
	@Autowired
	IRoleService roleService;
	
	@Autowired
	ModelMapper modelMapper;
	
	@Override
	public PermissionDto updatePermission(PermissionDto permissionDto){
		Permission permission = findPermissionById(permissionDto.getId());
		
		permission.setCanWrite(permissionDto.getCanWrite());
		permission.setCanRead(permissionDto.getCanRead());
		permission.setCanUpdate(permissionDto.getCanUpdate());
		permission.setCanDelete(permissionDto.getCanDelete());
		
		permissionRepository.save(permission);
		
		PermissionDto permissionDtoToReturn = modelMapper.map(permission, PermissionDto.class);
		
		return permissionDtoToReturn;
	}
	
	@Override
	public List<PermissionDto> findPermissionsByRole(String roleName){
		if(!roleService.checkRoleNameExists(roleName))
			throw new EntityNotFoundException(String.format("Role with name %s does not exists", roleName));
		
		List<Permission> permissions = permissionRepository.findByRoleName(roleName);
		
		List<PermissionDto> permissionsDto = permissions.stream().map(permission -> modelMapper.map(permission, PermissionDto.class)).collect(Collectors.toList()); 
		
		return permissionsDto;
	}

	@Override
	public PermissionDto findById(Long permissionId){
		PermissionDto permissionDto = modelMapper.map(findPermissionById(permissionId), PermissionDto.class);
		
		return permissionDto;
	}

	@Override
	public void createDefaultPermissionsForCreatedRole(Role createdRole) {
		List<AppService> appServices = appServiceService.getAllServicesForPermissions();
		
		for(AppService appService : appServices) {
			Permission permission = defaultPermission();
			permission.setService(appService);
			permission.setRole(createdRole);
			
			permissionRepository.save(permission);
		}
	}

	@Override
	public void createDefaultPermissionsForCreatedService(AppService createdAppService) {
		List<Role> roles = roleService.getAllRolesForPermissions();
		
		for(Role role : roles) {
			Permission permission = defaultPermission();
			permission.setService(createdAppService);
			permission.setRole(role);
			
			permissionRepository.save(permission);
		}
	}

	@Override
	public HashMap<String, Permission> findPermissionsForUser(User user) {
		HashMap<String, Permission> permissions = new HashMap<String, Permission>();
		
		for(Role role : user.getUserRoles()) {
			List<Permission> permissionsForRole = findByRole(role.getId());
			
			for(Permission permission : permissionsForRole) {
				
				/*
				 * If the key with the service name does not exist in the hash map initialize it
				 * with current permission
				 */
				
				String serviceName = permission.getService().getName();
				if(!permissions.containsKey(serviceName))
					
					/* Adding new element to the HashMap with service name as the key */
					permissions.put(serviceName, permission);
				else {
					
					/*
					 * If service name exists as a key (it means it's added by a previous role), it
					 * just needs to be updated with values of current permission actions. HashMap
					 * element is updated by logical OR function so that if user doesn't have
					 * permission for something with one role, he might have it with another role.
					 */
					
					Permission existingPermission = permissions.get(serviceName);

					/* Updating read access with logic explained above. */
					existingPermission.setCanRead(existingPermission.getCanRead() != null
							? existingPermission.getCanRead() || permission.getCanRead()
							: permission.getCanRead());

					/* Updating write access with logic explained above. */
					existingPermission.setCanWrite(existingPermission.getCanWrite() != null
							? existingPermission.getCanWrite() || permission.getCanWrite()
							: permission.getCanWrite());

					/* Updating update access with logic explained above. */
					existingPermission.setCanUpdate(existingPermission.getCanUpdate() != null
							? existingPermission.getCanUpdate() || permission.getCanUpdate()
							: permission.getCanUpdate());

					/* Updating delete access with logic explained above. */
					existingPermission.setCanDelete(existingPermission.getCanDelete() != null
							? existingPermission.getCanDelete() || permission.getCanDelete()
							: permission.getCanDelete());
				}
			}
		}
		return permissions;
	}
	
	private List<Permission> findByRole(Long roleId) {
		return permissionRepository.findByRoleId(roleId);
	}
	
	private Permission findPermissionById(Long id){
		Permission permission = permissionRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(String.format("Permission with ID %s does not exists", id)));

		return permission;
	}
	
	private Permission defaultPermission() {
		Permission permission = new Permission();
		permission.setCanDelete(false);
		permission.setCanRead(false);
		permission.setCanUpdate(false);
		permission.setCanWrite(false);
		
		return permission;
	}

	@Override
	public List<PermissionInfoDto> getPermissionsForUserInfo(User user) {
		List<PermissionInfoDto> permissionDtos = new ArrayList<PermissionInfoDto>();

		HashMap<String, Permission> permissionsHashMap = findPermissionsForUser(user);
		for (String serviceName : permissionsHashMap.keySet()) {
			PermissionInfoDto permissionDto = new PermissionInfoDto();
			
			permissionDto.setServiceName(serviceName);

			/* Getting permission from the hash map */
			Permission permissionForService = permissionsHashMap.get(serviceName);
			permissionDto.setCanDelete(permissionForService.getCanDelete());
			permissionDto.setCanWrite(permissionForService.getCanWrite());
			permissionDto.setCanRead(permissionForService.getCanRead());
			permissionDto.setCanUpdate(permissionForService.getCanUpdate());

			permissionDtos.add(permissionDto);
		}

		return permissionDtos;
	}


}
