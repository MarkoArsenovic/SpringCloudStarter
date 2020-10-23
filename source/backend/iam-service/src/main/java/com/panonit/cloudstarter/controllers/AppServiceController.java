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

import com.panonit.cloudstarter.dtos.AppServiceCreateDto;
import com.panonit.cloudstarter.dtos.AppServiceDto;
import com.panonit.cloudstarter.exceptions.ValidationException;
import com.panonit.cloudstarter.services.IAppServiceService;
import com.panonit.cloudstarter.utils.AccessConsts;
import com.panonit.cloudstarter.utils.IamServiceConsts;

@RestController
@RequestMapping("app-service")
public class AppServiceController {
	
	@Autowired
	IAppServiceService appServiceService;
	
	@PreAuthorize(AccessConsts.IAM_CAN_WRITE)
	@PostMapping
	public ResponseEntity<AppServiceDto> addNewService(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @Valid @RequestBody AppServiceCreateDto appServiceCreateDto, BindingResult bindingResult) {
		if(bindingResult.hasErrors())
			throw new ValidationException(bindingResult);
		
		AppServiceDto createdAppService = appServiceService.createAppService(appServiceCreateDto);
		
		if(createdAppService == null)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		return new ResponseEntity<AppServiceDto>(createdAppService, HttpStatus.CREATED);
	}
	
	@PreAuthorize(AccessConsts.IAM_CAN_UPDATE)
	@PutMapping
	public ResponseEntity<AppServiceDto> updateService(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @Valid @RequestBody AppServiceDto appServiceDto, BindingResult bindingResult) {
		if(bindingResult.hasErrors())
			throw new ValidationException(bindingResult);
		
		AppServiceDto updateAppService = appServiceService.updateAppService(appServiceDto);
		
		if(updateAppService == null)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		return new ResponseEntity<AppServiceDto>(updateAppService, HttpStatus.OK);
	}
	
	@PreAuthorize(AccessConsts.IAM_CAN_DELETE)
	@DeleteMapping("{serviceId}")
	public ResponseEntity<?> deleteService(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @PathVariable("serviceId") Long serviceId) {
		appServiceService.deleteAppService(serviceId);
		
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
	
	@PreAuthorize(AccessConsts.IAM_CAN_READ)
	@GetMapping("services")
	public ResponseEntity<List<AppServiceDto>> getAllServices(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token) {
		return new ResponseEntity<List<AppServiceDto>>(appServiceService.findAll(), HttpStatus.OK);
	}
	
	@PreAuthorize(AccessConsts.IAM_CAN_READ)
	@GetMapping("services/{serviceId}")
	public ResponseEntity<AppServiceDto> getServiceById(@RequestHeader(value = IamServiceConsts.AUTHORIZATION_HEADER) String token, @PathVariable("serviceId") Long serviceId) {
		AppServiceDto appService = appServiceService.findById(serviceId);
		
		if(appService == null)
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		
		return new ResponseEntity<AppServiceDto>(appService, HttpStatus.OK);
	}

}
