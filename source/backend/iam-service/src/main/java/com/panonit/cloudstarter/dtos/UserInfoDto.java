package com.panonit.cloudstarter.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoDto {
	private UserDto user;
	
	private List<PermissionInfoDto> permissions;
}
