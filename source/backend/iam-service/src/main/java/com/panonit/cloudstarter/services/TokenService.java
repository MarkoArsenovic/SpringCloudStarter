package com.panonit.cloudstarter.services;

import java.util.ArrayList;
import java.util.Date;

import javax.naming.AuthenticationException;
import javax.servlet.http.HttpServletRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.panonit.cloudstarter.dtos.JwtAuthenticationResponseDto;
import com.panonit.cloudstarter.models.Role;
import com.panonit.cloudstarter.security.JwtTokenProvider;
import com.panonit.cloudstarter.utils.ConfigKeyConsts;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;

@Service
public class TokenService implements ITokenService {
	
	@Autowired
	JwtTokenProvider tokenProvider;
	
	@Autowired
	Environment env;
	
	private static final Logger logger = LogManager.getLogger(TokenService.class);

	@Override
	public String extractTokenFromAuthorizationHeader(String authorizationHeader) throws AuthenticationException {
		String[] authorizationHeaderArray = authorizationHeader.split(" ");
		if(authorizationHeaderArray.length != 2) {
			logger.error("Invalid authorization header has been sent: {}", authorizationHeader);
			throw new BadCredentialsException("Invalid authorization header");
		}
		
		return authorizationHeaderArray[1];
	}

	@Override
	public String extractUserIdFromAuthorizationHeader(String authorizationHeader) throws AuthenticationException {
		String token = extractTokenFromAuthorizationHeader(authorizationHeader);
		
		return tokenProvider.getUserIdFromJWT(token);
	}

	@Override
	public String extractUserIdFromToken(String token) {
		return tokenProvider.getUserIdFromJWT(token);
	}

	@Override
	public ArrayList<Role> extractRolesFromToken(String token) {
		ArrayList<Role> roles = (ArrayList<Role>) tokenProvider.getRolesFromJWT(token);
		return roles;
	}

	@Override
	public boolean isTokenExpired(String token) {
		Date expirationDate = tokenProvider.getExpirationDateFromJWT(token);
		return expirationDate.before(new Date());
	}

	@Override
	public JwtAuthenticationResponseDto refreshToken(String authorizationHeader) throws AuthenticationException {
		String token = extractTokenFromAuthorizationHeader(authorizationHeader);
		String refreshedToken = Strings.EMPTY;
		
		try {
			boolean isTokenValid = tokenProvider.validateToken(token);
			
			if(isTokenValid) {
				refreshedToken = tokenProvider.generateToken(SecurityContextHolder.getContext().getAuthentication());
				
				logger.info("Refresh attempt of unexpired token successful.");
			} else
				throw new JwtException("Invalid token");
		} catch(ExpiredJwtException ex) {
			/* Token is valid but expired */
			Date expirationDate = ex.getClaims().getExpiration();
			Date currentDate = new Date();
			Long expirationTimeInSeconds = Math.abs(expirationDate.getTime() - currentDate.getTime()) / 1000;
			
			if(expirationDate.after(currentDate))
				refreshedToken = tokenProvider.generateToken(SecurityContextHolder.getContext().getAuthentication());
			else if (expirationDate.before(currentDate) && expirationTimeInSeconds < Integer.parseInt(env.getProperty(ConfigKeyConsts.IAM_EXPIRATION_REFRESH_THRESHOLD_IN_S)))
				refreshedToken = tokenProvider.generateToken(SecurityContextHolder.getContext().getAuthentication());
			else
				throw new SessionAuthenticationException("Session threshold exceeded, refresh not allowed.");
		}
		JwtAuthenticationResponseDto tokenResponse = new JwtAuthenticationResponseDto(refreshedToken);
		
		return tokenResponse;
	}

	@Override
	public String getJwtFromRequest(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");
		
		try {
			if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer "))
				return bearerToken.substring(7, bearerToken.length());
		} catch(IllegalArgumentException ex) {
			logger.error("Something went wrong with parsing token from 'Authorization' header. \n" + ex.getMessage());
		}
		
		return null;
	}

}
