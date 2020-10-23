package com.panonit.cloudstarter.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.naming.AuthenticationException;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.panonit.cloudstarter.dtos.ChangePasswordDto;
import com.panonit.cloudstarter.dtos.PasswordResetDto;
import com.panonit.cloudstarter.dtos.PasswordResetRequestDto;
import com.panonit.cloudstarter.dtos.PermissionInfoDto;
import com.panonit.cloudstarter.dtos.UserDto;
import com.panonit.cloudstarter.dtos.UserInfoDto;
import com.panonit.cloudstarter.dtos.UserRegisterDto;
import com.panonit.cloudstarter.dtos.UserRolesDto;
import com.panonit.cloudstarter.dtos.UserUpdateRolesDto;
import com.panonit.cloudstarter.exceptions.PasswordMatchException;
import com.panonit.cloudstarter.exceptions.PasswordResetException;
import com.panonit.cloudstarter.models.PasswordResetToken;
import com.panonit.cloudstarter.models.Role;
import com.panonit.cloudstarter.models.User;
import com.panonit.cloudstarter.repositories.UserRepository;

@Service
public class UserService implements IUserService {
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	IRoleService roleService;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	@Autowired
	ITokenService tokenService;
	
	@Autowired
	IPermissionService permissionService;
	
	@Autowired
	IPasswordResetTokenService passwordResetTokenService;
	
	@Autowired
	IForgotPasswordEmailService forgotPasswordEmailService;
	
	@Autowired
	ModelMapper modelMapper;

	@Override
	public UserDto createUser(UserRegisterDto userRegisterDto) {
		
		if(!userRegisterDto.getPassword().equals(userRegisterDto.getConfirmPassword()))
			throw new PasswordMatchException("Password and confirm password does not match");
		
		if(checkUsernameExists(userRegisterDto.getUsername()))
			throw new EntityExistsException(String.format("User with the username '%s' already exists", userRegisterDto.getUsername()));
		
		if(checkEmailExists(userRegisterDto.getEmail()))
			throw new EntityExistsException(String.format("User with the email '%s' already exists", userRegisterDto.getEmail()));
		
		User userToSave = modelMapper.map(userRegisterDto, User.class);
		userToSave.setPassword(passwordEncoder.encode(userRegisterDto.getPassword()));
		userToSave.setUserRoles(getUserInitialRoles());
		
		userRepository.save(userToSave);
		
		UserDto userToReturn = modelMapper.map(userToSave, UserDto.class);

		return userToReturn;
	}
	
	@Override
	public UserDto updateUser(UserDto userDto){
		User user = findUserById(userDto.getId());
		
		user.setEmail(userDto.getEmail());
		user.setUsername(userDto.getUsername());
		user.setName(userDto.getName());
		user.setLastname(userDto.getLastname());
		
		userRepository.save(user);
		
		UserDto userDtoResponse = modelMapper.map(user, UserDto.class);
		
		return userDtoResponse;
	}
	
	@Override
	public UserRolesDto updateUserRoles(UserUpdateRolesDto userUpdateRolesDto){
		User user = findUserById(userUpdateRolesDto.getId());
		
		List<Role> newRoles = userUpdateRolesDto.getUserRoles().stream().map(role -> modelMapper.map(role, Role.class)).collect(Collectors.toList());
		
		user.setUserRoles(newRoles);
		
		userRepository.save(user);
		
		UserRolesDto userRolesDto = modelMapper.map(user, UserRolesDto.class);
		
		return userRolesDto;
	}
	
	@Override
	public UserDto findById(Long userId){
		UserDto userDto = modelMapper.map(findUserById(userId), UserDto.class);
		
		return userDto;
	}

	@Override
	public List<UserRolesDto> findAllWithRoles() {
		List<User> users = userRepository.findAll();
		
		List<UserRolesDto> usersToReturn = users.stream().map(user -> modelMapper.map(user, UserRolesDto.class)).collect(Collectors.toList());
		
		return usersToReturn;
	}
	
	@Override
	public List<UserRolesDto> findAllByRoleName(String roleName) {
		List<User> users = userRepository.findByRoleName(roleName);
		
		List<UserRolesDto> usersToReturn = null;
		
		if(users != null)
			usersToReturn = users.stream().map(user -> modelMapper.map(user, UserRolesDto.class)).collect(Collectors.toList());
		
		return usersToReturn;
	}

	@Override
	public UserRolesDto findUserWithRolesById(Long userId) {
		UserRolesDto userRolesDto = modelMapper.map(findUserById(userId), UserRolesDto.class);
		
		return userRolesDto;
	}

	@Override
	public void changePassword(ChangePasswordDto changePasswordDto, Long userId) {
		User user = findUserById(userId);
		
		if(passwordEncoder.matches(changePasswordDto.getOldPassword(), user.getPassword())) {
			
			if(!changePasswordDto.getNewPassword().equals(changePasswordDto.getConfirmNewPassword()))
				throw new PasswordMatchException("Password and confirm password does not match");
			
			user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
			
			User updatedUser = userRepository.save(user);
			
			if(updatedUser == null)
				throw new PasswordMatchException("Password could not be changed");
		} else
			throw new PasswordMatchException("Old password is not correct");
		
	}

	@Override
	public boolean deactivateAccount(Long userId) {
		User user = findUserById(userId);
		
		user.setEnabled(false);
		
		User updated = userRepository.save(user);
		
		if(updated == null)
			return false;
		
		return true;
	}

	@Override
	public void deleteUser(Long userId) {
		User userToDelete = findUserById(userId);
		
		userRepository.delete(userToDelete);
	}
	
	@Override
	public Optional<User> findByUsername(String username) {
		return userRepository.findByUsername(username);
	}

	@Override
	public Optional<User> findOne(Long userId) {
		return userRepository.findById(userId);
	}

	@Override
	public UserInfoDto getUserInfo(String token) throws AuthenticationException {
		String userId = tokenService.extractUserIdFromAuthorizationHeader(token);
		
		Optional<User> user = findOne(Long.parseLong(userId));
		
		if(user.isPresent()) {
			List<PermissionInfoDto> permissions = permissionService.getPermissionsForUserInfo(user.get());
			UserDto userDto = modelMapper.map(user.get(), UserDto.class);
			
			UserInfoDto userInfo = new UserInfoDto(userDto, permissions);
			
			return userInfo;
		}
		
		return null;
	}

	@Override
	public boolean createPasswordResetTokenForUser(PasswordResetRequestDto passwordResetRequest) {
		Optional<User> user = userRepository.findByEmail(passwordResetRequest.getEmail());
		
		if(user.isPresent()) {
			String token = UUID.randomUUID().toString();
			
			passwordResetTokenService.createPasswordResetTokenForUser(token, user.get());
			forgotPasswordEmailService.sendForgotPasswordMessage(token, user.get());
			
			return true;
		} else {
			throw new EntityNotFoundException(String.format("User with email %s does not exists", passwordResetRequest.getEmail()));
		}
	}

	@Override
	public void resetPasswordForUser(Long userId, String token, PasswordResetDto passwordResetDto) {
		
		if(!passwordResetDto.getPassword().matches(passwordResetDto.getConfirmPassword()))
			throw new PasswordMatchException("Password and confirm password does not match");
		
		User user = findUserById(userId);
		PasswordResetToken passwordReset = passwordResetTokenService.findLatestResetTokenForUser(userId);
		
		if(!passwordReset.getToken().equals(token))
			throw new PasswordResetException("Password reset token is not a valid token, or is not a newest one.");
		
		if(passwordReset.getExpiryDate().before(new Date()))
			throw new PasswordResetException(String.format("Password reset attempt for user %s with token that that has expired",user.getUsername()));
		
		user.setPassword(passwordEncoder.encode(passwordResetDto.getPassword()));
		userRepository.save(user);
	}
	
	private List<Role> getUserInitialRoles() {
		List<Role> roles = new ArrayList<>();
		roles.add(roleService.getUserInitialRole());
		
		return roles;
	}
	
	private boolean checkEmailExists(String email) {
		return userRepository.findByEmail(email).isPresent();
	}

	private boolean checkUsernameExists(String username) {
		return userRepository.findByUsername(username).isPresent();
	}
	
	private User findUserById(Long userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException(String.format("User with ID %s does not exists", userId)));
		
		return user;
	}
	
}






