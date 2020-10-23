package com.panonit.cloudstarter.services;

import java.util.List;
import java.util.Optional;

import javax.naming.AuthenticationException;

import com.panonit.cloudstarter.dtos.ChangePasswordDto;
import com.panonit.cloudstarter.dtos.PasswordResetDto;
import com.panonit.cloudstarter.dtos.PasswordResetRequestDto;
import com.panonit.cloudstarter.dtos.UserDto;
import com.panonit.cloudstarter.dtos.UserInfoDto;
import com.panonit.cloudstarter.dtos.UserRegisterDto;
import com.panonit.cloudstarter.dtos.UserRolesDto;
import com.panonit.cloudstarter.dtos.UserUpdateRolesDto;
import com.panonit.cloudstarter.models.User;

public interface IUserService {
	
	UserDto createUser(UserRegisterDto userRegisterDto);
	
	UserDto updateUser(UserDto userDto);
	
	UserDto findById(Long userId);
	
	List<UserRolesDto> findAllWithRoles();
	
	List<UserRolesDto> findAllByRoleName(String roleName);
	
	UserRolesDto findUserWithRolesById(Long userId);
	
	UserRolesDto updateUserRoles(UserUpdateRolesDto userRolesDto);
	
	void changePassword(ChangePasswordDto changePasswordDto, Long userId);
	
	boolean deactivateAccount(Long userId);
	
	void deleteUser(Long userId);
	
	Optional<User> findByUsername(String username);
	
	Optional<User> findOne(Long userId);
	
	UserInfoDto getUserInfo(String token) throws AuthenticationException;
	
	boolean createPasswordResetTokenForUser(PasswordResetRequestDto passwordResetRequest);
	
	void resetPasswordForUser(Long userId, String token, PasswordResetDto passwordResetDto);

}
