package com.panonit.cloudstarter.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.panonit.cloudstarter.dtos.RoleCreateDto;
import com.panonit.cloudstarter.dtos.RoleDto;
import com.panonit.cloudstarter.exceptions.ValidationException;
import com.panonit.cloudstarter.services.IRoleService;
import com.panonit.cloudstarter.utils.AccessConsts;
import com.panonit.cloudstarter.utils.IamServiceConsts;

@RestController
@RequestMapping("role")
public class RoleController {

	@Autowired
	IRoleService roleService;
	
	@PreAuthorize(AccessConsts.IAM_CAN_WRITE)
	@PostMapping
	public ResponseEntity<RoleDto> addNewRole(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @Valid @RequestBody RoleCreateDto role, BindingResult bindingResult) {
		if(bindingResult.hasErrors())
			throw new ValidationException(bindingResult);
		
		RoleDto createdRole = roleService.createRole(role);
		
		if(createdRole == null)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		return new ResponseEntity<RoleDto>(createdRole, HttpStatus.CREATED);
	}
	
	@PreAuthorize(AccessConsts.IAM_CAN_UPDATE)
	@PutMapping
	public ResponseEntity<RoleDto> updateRole(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @Valid @RequestBody RoleDto roleDto, BindingResult bindingResult) {
		if(bindingResult.hasErrors())
			throw new ValidationException(bindingResult);
		
		RoleDto updatedRole = roleService.updateRole(roleDto);
		
		if(updatedRole == null)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		return new ResponseEntity<RoleDto>(updatedRole, HttpStatus.OK);
	}
	
	@PreAuthorize(AccessConsts.IAM_CAN_DELETE)
	@DeleteMapping("roles/{roleId}")
	public ResponseEntity<?> deleteRoleById(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @PathVariable("roleId") Long roleId) {
		roleService.deleteRoleById(roleId);
		
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
	
	@PreAuthorize(AccessConsts.IAM_CAN_READ)
	@GetMapping("roles")
	public ResponseEntity<List<RoleDto>> getAllRoles(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token) {
		return new ResponseEntity<List<RoleDto>>(roleService.findAll(), HttpStatus.OK);
	}
	
	@PreAuthorize(AccessConsts.IAM_CAN_READ)
	@GetMapping("roles/{roleId}")
	public ResponseEntity<RoleDto> getRoleById(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @PathVariable("roleId") Long roleId) {
		RoleDto roleDto = roleService.findById(roleId);
		
		if(roleDto == null)
			return new ResponseEntity<RoleDto>(HttpStatus.NOT_FOUND);
		
		return new ResponseEntity<RoleDto>(roleDto, HttpStatus.OK);
	}
	
}
