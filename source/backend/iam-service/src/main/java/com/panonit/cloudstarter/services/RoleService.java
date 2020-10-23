package com.panonit.cloudstarter.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.panonit.cloudstarter.dtos.RoleCreateDto;
import com.panonit.cloudstarter.dtos.RoleDto;
import com.panonit.cloudstarter.models.Role;
import com.panonit.cloudstarter.repositories.RoleRepository;

@Service
public class RoleService implements IRoleService {
	
	@Autowired
	RoleRepository roleRepository;
	
	@Autowired
	IPermissionService permissionService;
	
	@Autowired
	ModelMapper modelMapper;

	@Override
	public RoleDto createRole(RoleCreateDto role) {
		if(checkRoleNameExists(role.getName()))
			throw new EntityExistsException(String.format("Role with name %s already exists.", role.getName()));
		
		Role roleToSave = modelMapper.map(role, Role.class);
		
		roleRepository.save(roleToSave);
		
		permissionService.createDefaultPermissionsForCreatedRole(roleToSave);
		
		RoleDto createdRole = modelMapper.map(roleToSave, RoleDto.class);
		
		return createdRole;
	}
	
	@Override
	public RoleDto updateRole(RoleDto roleDto){
		Role role = findRoleById(roleDto.getId());
		
		role.setName(roleDto.getName());
		role.setDescription(roleDto.getDescription());
		
		roleRepository.save(role);
		
		RoleDto roleDtoResponse = modelMapper.map(role, RoleDto.class);
		
		return roleDtoResponse;
	}

	@Override
	public List<RoleDto> findAll() {
		List<Role> roles = roleRepository.findAll();
		
		List<RoleDto> rolesToReturn = roles.stream().map(role -> modelMapper.map(role, RoleDto.class)).collect(Collectors.toList());
		
		return rolesToReturn;
	}
	
	@Override
	public Role getUserInitialRole() {
		Optional<Role> userRole = roleRepository.findByName("User");
		
		if(!userRole.isPresent()) {
			List<Role> roles = roleRepository.findAll();
			if(roles.isEmpty())
				return null;
			else
				return roles.get(0);
		}
		
		return userRole.get();
	}

	@Override
	public RoleDto findById(Long roleId){
		RoleDto roleDto = modelMapper.map(findRoleById(roleId), RoleDto.class);
		
		return roleDto;
	}

	@Override
	public void deleteRoleById(Long roleId) {
		Role role = findRoleById(roleId);
		
		roleRepository.delete(role);
	}
	
	@Override
	public List<Role> getAllRolesForPermissions() {
		return roleRepository.findAll();
	}
	
	@Override
	public boolean checkRoleNameExists(String name) {
		return roleRepository.findByName(name).isPresent();
	}
	
	@Override
	public boolean compareRoles(List<Role> tokenRoles, List<Role> userRoles) {
		if(tokenRoles.size() != userRoles.size())
			return false;
		
		for(Role role : userRoles) {
			if(!tokenRoles.contains(role))
				return false;
		}
		
		return true;
	}
	
	private Role findRoleById(Long roleId) {
		Role role = roleRepository.findById(roleId).orElseThrow(() -> new EntityNotFoundException(String.format("Role with ID %s does not exists", roleId)));

		return role;
	}
}
