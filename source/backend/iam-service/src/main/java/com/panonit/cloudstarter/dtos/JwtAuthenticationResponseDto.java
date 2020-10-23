package com.panonit.cloudstarter.dtos;

import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class JwtAuthenticationResponseDto {
	@NonNull
	private String accessToken;
	
	private String tokenType = "Bearer";
}
