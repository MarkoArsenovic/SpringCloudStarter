package com.panonit.cloudstarter.services;

import com.panonit.cloudstarter.models.PasswordResetToken;
import com.panonit.cloudstarter.models.User;

public interface IPasswordResetTokenService {
	void createPasswordResetTokenForUser(String token, User user);
	
	PasswordResetToken findLatestResetTokenForUser(Long userId);
}
