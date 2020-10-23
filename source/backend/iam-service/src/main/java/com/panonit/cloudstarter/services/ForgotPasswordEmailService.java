package com.panonit.cloudstarter.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import com.panonit.cloudstarter.config.IamServiceEmailConfigurationProperties;
import com.panonit.cloudstarter.models.User;

@Component
public class ForgotPasswordEmailService implements IForgotPasswordEmailService {
	
	@Autowired
	JavaMailSender emailSender;
	
	@Autowired
	SimpleMailMessage forgotPasswordMessage;
	
	@Autowired
	IamServiceEmailConfigurationProperties iamServiceEmailConf;

	@Override
	public void sendMessage(String to, String subject, String text) {
		forgotPasswordMessage.setTo(to);
		forgotPasswordMessage.setSubject(subject);
		forgotPasswordMessage.setText(text);
		forgotPasswordMessage.setFrom(iamServiceEmailConf.getSender().getAddress());
		
		emailSender.send(forgotPasswordMessage);
	}

	@Override
	public void sendForgotPasswordMessage(String token, User user) {
		String submitEndpoint = String.format("%s/%s/%s", iamServiceEmailConf.getSubmit(), user.getId(), token);
		
		String text = String.format("Dear %s, \nYou can reset your password on following link:\n%s", user.getName(), submitEndpoint);
		
		this.sendMessage(user.getEmail(), iamServiceEmailConf.getSubject(), text);
		
	}
	


}
