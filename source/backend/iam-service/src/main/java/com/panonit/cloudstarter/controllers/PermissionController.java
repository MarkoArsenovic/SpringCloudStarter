package com.panonit.cloudstarter.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.panonit.cloudstarter.dtos.PermissionDto;
import com.panonit.cloudstarter.exceptions.ValidationException;
import com.panonit.cloudstarter.services.IPermissionService;
import com.panonit.cloudstarter.utils.AccessConsts;
import com.panonit.cloudstarter.utils.IamServiceConsts;

@RestController
@RequestMapping("permission")
public class PermissionController {
	
	@Autowired
	IPermissionService permissionService;
	
	@PreAuthorize(AccessConsts.IAM_CAN_UPDATE)
	@PutMapping
	public ResponseEntity<?> updatePermission(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @Valid @RequestBody PermissionDto permissionDto, BindingResult bindingResult) {
		if(bindingResult.hasErrors())
			throw new ValidationException(bindingResult);
		
		PermissionDto permission = permissionService.updatePermission(permissionDto);
		
		if(permission == null)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		return new ResponseEntity<PermissionDto>(permission, HttpStatus.OK);
	}
	
	@PreAuthorize(AccessConsts.IAM_CAN_READ)
	@GetMapping("role/{roleName}/permissions")
	public ResponseEntity<List<PermissionDto>> getPermissionForRole(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @PathVariable("roleName") String roleName) {
		List<PermissionDto> permissions = permissionService.findPermissionsByRole(roleName);
		
		return new ResponseEntity<List<PermissionDto>>(permissions, HttpStatus.OK);
	}
	
	@PreAuthorize(AccessConsts.IAM_CAN_READ)
	@GetMapping("{permissionId}")
	public ResponseEntity<?> getPermissionById(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @PathVariable("permissionId") Long id) {
		PermissionDto permission = permissionService.findById(id);
		
		if(permission == null)
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		
		return new ResponseEntity<PermissionDto>(permission, HttpStatus.OK);
	}

}
