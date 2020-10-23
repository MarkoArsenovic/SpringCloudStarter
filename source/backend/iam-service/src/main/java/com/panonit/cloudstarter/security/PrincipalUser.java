package com.panonit.cloudstarter.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.panonit.cloudstarter.models.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PrincipalUser implements UserDetails {
	
	private User user;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return null;
	}

	@Override
	public String getPassword() {
		return user.getPassword();
	}

	@Override
	public String getUsername() {
		return user.getUsername();
	}

	@Override
	public boolean isAccountNonExpired() {
		return user.getEnabled();
	}

	@Override
	public boolean isAccountNonLocked() {
		return user.getEnabled();
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return user.getEnabled();
	}

	@Override
	public boolean isEnabled() {
		return user.getEnabled();
	}

}
