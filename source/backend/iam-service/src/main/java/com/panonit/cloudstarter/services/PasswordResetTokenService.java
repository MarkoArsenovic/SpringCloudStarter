package com.panonit.cloudstarter.services;

import java.util.Date;

import javax.persistence.EntityNotFoundException;

import org.apache.commons.lang.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.panonit.cloudstarter.models.PasswordResetToken;
import com.panonit.cloudstarter.models.User;
import com.panonit.cloudstarter.repositories.PasswordResetTokenRepository;
import com.panonit.cloudstarter.utils.ConfigKeyConsts;

@Service
public class PasswordResetTokenService implements IPasswordResetTokenService {
	
	@Autowired
	PasswordResetTokenRepository passwordResetTokenRepository;
	
	@Autowired
	Environment env;

	@Override
	public void createPasswordResetTokenForUser(String token, User user) {
		PasswordResetToken passwordResetToken = new PasswordResetToken();
		passwordResetToken.setExpiryDate(DateUtils.addDays(new Date(), Integer.parseInt(env.getProperty(ConfigKeyConsts.PASSWORD_RESET_EXPIRATION_TIME))));
		passwordResetToken.setUser(user);
		passwordResetToken.setToken(token);
		
		passwordResetTokenRepository.save(passwordResetToken);
	}

	@Override
	public PasswordResetToken findLatestResetTokenForUser(Long userId) {
		return passwordResetTokenRepository.findLatestResetTokenForUser(userId).orElseThrow(() -> new EntityNotFoundException(String.format("User with ID %s does not exists", userId)));
	}

}
