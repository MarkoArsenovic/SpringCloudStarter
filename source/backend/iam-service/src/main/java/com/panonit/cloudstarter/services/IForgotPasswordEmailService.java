package com.panonit.cloudstarter.services;

import com.panonit.cloudstarter.models.User;

public interface IForgotPasswordEmailService {
	void sendMessage(String to, String subject, String text);
	void sendForgotPasswordMessage(String token, User user);
}
