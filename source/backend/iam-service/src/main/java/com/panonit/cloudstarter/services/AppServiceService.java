package com.panonit.cloudstarter.services;

import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.panonit.cloudstarter.dtos.AppServiceCreateDto;
import com.panonit.cloudstarter.dtos.AppServiceDto;
import com.panonit.cloudstarter.models.AppService;
import com.panonit.cloudstarter.repositories.AppServiceRepository;

@Service
public class AppServiceService implements IAppServiceService{
	
	@Autowired
	AppServiceRepository appServiceRepository;
	
	@Autowired
	IPermissionService permissionService;
	
	@Autowired
	ModelMapper modelMapper;

	@Override
	public List<AppService> getAllServicesForPermissions() {
		return appServiceRepository.findAll();
	}

	@Override
	public AppServiceDto createAppService(AppServiceCreateDto appServiceDto) {
		if(checkNameExists(appServiceDto.getName()))
			throw new EntityExistsException(String.format("Service with name %s already exists.", appServiceDto.getName()));
		
		AppService appService = modelMapper.map(appServiceDto, AppService.class);
		
		//prevent display name to be blank, if it is blank, copy service name
		if(appService.getDisplayName() == null || appService.getDisplayName().length() == 0)
			appService.setDisplayName(appService.getName());
		
		appServiceRepository.save(appService);
		
		permissionService.createDefaultPermissionsForCreatedService(appService);
		
		AppServiceDto appServiceResponseDto = modelMapper.map(appService, AppServiceDto.class);
		
		return appServiceResponseDto;
	}
	
	@Override
	public List<AppServiceDto> findAll() {
		List<AppService> services = appServiceRepository.findAll();
		
		List<AppServiceDto> appServices = services.stream().map(appService -> modelMapper.map(appService, AppServiceDto.class))
				.collect(Collectors.toList());
		return appServices;
	}

	@Override
	public AppServiceDto findById(Long serviceId){
		AppServiceDto appServiceDto = modelMapper.map(findAppServiceById(serviceId), AppServiceDto.class);
		
		return appServiceDto;
	}

	@Override
	public AppServiceDto updateAppService(AppServiceDto appServiceDto){
		AppService appService = findAppServiceById(appServiceDto.getId());
		
		// prevent changing name of the service, this name is linked for method level security
		if(!appService.getName().equals(appServiceDto.getName()))
			return null;
			
		appService.setDisplayName(appServiceDto.getDisplayName());
		appService.setDescription(appServiceDto.getDescription());
		
		appServiceRepository.save(appService);
		
		AppServiceDto appServiceResponseDto = modelMapper.map(appService, AppServiceDto.class);
		
		return appServiceResponseDto;
	}
	
	@Override
	public void deleteAppService(Long serviceId){
		AppService appServiceToDelete = findAppServiceById(serviceId);
		
		appServiceRepository.delete(appServiceToDelete);
	}

	
	private boolean checkNameExists(String name) {
		return appServiceRepository.findByName(name).isPresent();
	}
	
	private AppService findAppServiceById(Long serviceId) {
		AppService appService = appServiceRepository.findById(serviceId).orElseThrow(() -> new EntityNotFoundException(String.format("App Service with ID %s does not exists.", serviceId)));
		
		return appService;
	}

}
