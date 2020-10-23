package com.panonit.cloudstarter.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.panonit.cloudstarter.models.User;
import com.panonit.cloudstarter.repositories.UserRepository;
import com.panonit.cloudstarter.services.AppUserDetailsService;
import com.panonit.cloudstarter.services.ITokenService;
import com.panonit.cloudstarter.utils.EndpointConsts;

import io.jsonwebtoken.ExpiredJwtException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
	
	@Autowired
	JwtTokenProvider tokenProvider;
	
	@Autowired
	AppUserDetailsService userDetailsService;
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	ITokenService tokenService;
	
	private static final Logger logger = LogManager.getLogger(JwtAuthenticationFilter.class);

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		String path = request.getRequestURI();
		String jwt = tokenService.getJwtFromRequest(request);
		
		try {
			if(StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
				setSecurityContextHolderAuthentication(jwt, request);
			} else { 
				if(!path.equals(EndpointConsts.LOGIN_PATH) && !path.equals(EndpointConsts.REGISTER_PATH) 
						&& !path.equals(EndpointConsts.FORGOT_PASSWORD_PATH) && !path.startsWith(EndpointConsts.RESET_PASSWORD_PATH) 
						&& !path.equals(EndpointConsts.REFRESH_PATH)
						&& !path.equals("/actuator/health") && !path.equals("/actuator/bus-refresh") 
						&& !path.startsWith("/swagger-resources") && !path.equals("/swagger-ui.html") 
						&& !path.startsWith("/v2") && !path.startsWith("/webjars")) {
					response.setStatus(HttpStatus.UNAUTHORIZED.value());
					return;
				}
			}
		} catch(ExpiredJwtException ex) {
			
			if(!path.equals(EndpointConsts.REFRESH_PATH)) {
				logger.info("Request with expired token has been attempted");
				response.setStatus(HttpStatus.GONE.value());
				return;
			} else {
				setSecurityContextHolderAuthentication(Long.parseLong(ex.getClaims().getSubject()), request);
			}
			
		} catch(Exception ex) {
			response.setStatus(HttpStatus.BAD_REQUEST.value());
			ex.printStackTrace();
		}
		
		filterChain.doFilter(request, response);
		
	}
	
	private void setSecurityContextHolderAuthentication(String jwt, HttpServletRequest request) {
		String userId = tokenProvider.getUserIdFromJWT(jwt);
		
		UsernamePasswordAuthenticationToken authentication = getTokenBasedAuthentication(Long.parseLong(userId));
		authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		SecurityContextHolder.getContext().setAuthentication(authentication);
	}
	
	private void setSecurityContextHolderAuthentication(Long userId, HttpServletRequest request) {
		UsernamePasswordAuthenticationToken authentication = getTokenBasedAuthentication(userId);
		authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		SecurityContextHolder.getContext().setAuthentication(authentication);
	}
	
	private UsernamePasswordAuthenticationToken getTokenBasedAuthentication(Long userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException(String.format("Username with ID %s does not exists", userId)));
		
		PrincipalUser principal = (PrincipalUser) userDetailsService.loadUserByUsername(user.getUsername());
		return new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
	}

}
