package com.panonit.cloudstarter.services;

import java.util.List;

import com.panonit.cloudstarter.dtos.AppServiceCreateDto;
import com.panonit.cloudstarter.dtos.AppServiceDto;
import com.panonit.cloudstarter.models.AppService;

public interface IAppServiceService {
	
	List<AppService> getAllServicesForPermissions();
	
	List<AppServiceDto> findAll();
	
	AppServiceDto findById(Long serviceId);
	
	AppServiceDto createAppService(AppServiceCreateDto appServiceDto);
	
	AppServiceDto updateAppService(AppServiceDto appServiceDto);

	void deleteAppService(Long serviceId);
}
