package com.panonit.cloudstarter.security;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

import org.checkerframework.checker.units.qual.K;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.panonit.cloudstarter.config.IamServiceConfigurationProperties;
import com.panonit.cloudstarter.models.Role;
import com.panonit.cloudstarter.services.IRoleService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;

@Component
public class JwtTokenProvider {
	
	private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);
	
	public static final String CLAIM_ROLES = "ROLES";
	private static final String ROLE_ID_KEY = "id";
	private static final String ROLE_NAME_KEY = "name";

	@Autowired
	IRoleService roleService;
	
	@Autowired
	IamServiceConfigurationProperties iamServiceConf;
	
	public String generateToken(Authentication authentication) {
		PrincipalUser principal = (PrincipalUser)authentication.getPrincipal();

		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + Integer.parseInt(iamServiceConf.getJwtExpirationInMs()));
		
		return Jwts.builder().setSubject(Long.toString(principal.getUser().getId()))
				.claim(CLAIM_ROLES, principal.getUser().getUserRoles())
				.setIssuedAt(now).setExpiration(expiryDate)
				.signWith(SignatureAlgorithm.HS512, iamServiceConf.getJwtSecret()).compact();
	}
	
	public String getUserIdFromJWT(String token) {
		Claims claims = getClaimsFromJWT(token);
		
		return claims.getSubject();
	}
	
	public List<Role> getRolesFromJWT(String token) {
		Claims claims = getClaimsFromJWT(token);
		
		ArrayList<LinkedHashMap<K, Object>> rolesHashMap = (ArrayList<LinkedHashMap<K, Object>>) claims.get(CLAIM_ROLES);
		
		ArrayList<Role> roles = new ArrayList<Role>();
		
		for(LinkedHashMap<K, Object> roleMap : rolesHashMap) {
			if(!roleMap.containsKey(ROLE_ID_KEY) || !roleMap.containsKey(ROLE_NAME_KEY))
				throw new JwtException("Roles could not be parsed properly from JWT.");

			Long roleId = ((Integer)roleMap.get(ROLE_ID_KEY)).longValue();
			String roleName = (String)roleMap.get(ROLE_NAME_KEY);
    		
    		Role role = new Role(roleId, roleName, null, null);
    		
    		roles.add(role);
		}
		
		return roles;
	}
	
	public Date getExpirationDateFromJWT(String token) {
		Claims claims = getClaimsFromJWT(token);
		
		return claims.getExpiration();
	}
	
	public boolean validateToken(String token) {
		try {
			Jwts.parser().setSigningKey(iamServiceConf.getJwtSecret()).parseClaimsJws(token);
			return true;
		} catch(MalformedJwtException ex) {
			logger.error("Invalid JWT token");
		} catch(UnsupportedJwtException ex) {
			logger.error("Unsupported JWT token");
		} catch(IllegalArgumentException ex) {
			logger.error("JWT claims string is empty.");
		} 
		
		return false;
	}
	
	private Claims getClaimsFromJWT(String token) {
		return Jwts.parser().setSigningKey(iamServiceConf.getJwtSecret())
				.parseClaimsJws(token).getBody();
	}
}
