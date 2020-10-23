package com.panonit.cloudstarter.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.panonit.cloudstarter.models.User;
import com.panonit.cloudstarter.repositories.UserRepository;
import com.panonit.cloudstarter.security.PrincipalUser;

@Service
public class AppUserDetailsService implements UserDetailsService {
	
	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(String.format("User with username %s could not be found", username)));
		
		return new PrincipalUser(user);
	}

}
