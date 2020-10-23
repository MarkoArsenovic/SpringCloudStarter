package com.panonit.cloudstarter.services;

import java.util.ArrayList;

import javax.naming.AuthenticationException;
import javax.servlet.http.HttpServletRequest;

import com.panonit.cloudstarter.dtos.JwtAuthenticationResponseDto;
import com.panonit.cloudstarter.models.Role;

public interface ITokenService {
	String extractTokenFromAuthorizationHeader(String authorizationHeader) throws AuthenticationException;
	String extractUserIdFromAuthorizationHeader(String authorizationHeader) throws AuthenticationException;
	String extractUserIdFromToken(String token);
	ArrayList<Role> extractRolesFromToken(String token);
	boolean isTokenExpired(String token);
	JwtAuthenticationResponseDto refreshToken(String authorizationHeader) throws AuthenticationException;
	String getJwtFromRequest(HttpServletRequest request);
}
