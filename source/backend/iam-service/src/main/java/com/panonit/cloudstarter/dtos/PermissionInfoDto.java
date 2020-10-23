package com.panonit.cloudstarter.dtos;

import lombok.Data;

@Data
public class PermissionInfoDto {
	private String serviceName;
	private Boolean canDelete;
	private Boolean canRead;
	private Boolean canUpdate;
	private Boolean canWrite;
}
