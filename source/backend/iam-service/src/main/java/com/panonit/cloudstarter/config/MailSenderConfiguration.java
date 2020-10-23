package com.panonit.cloudstarter.config;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

@Component
public class MailSenderConfiguration {
	
	@Autowired
	IamServiceEmailConfigurationProperties emailConf;
	
	@Autowired
	Environment env;

	@Bean
	public JavaMailSender getJavaMailSender() {
	    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
	    
	    mailSender.setHost(emailConf.getHost());
	    mailSender.setPort(Integer.parseInt(emailConf.getPort()));
	    
	    mailSender.setUsername(emailConf.getSender().getAddress());
	    mailSender.setPassword(emailConf.getSender().getPassword());
	    
	    Properties props = mailSender.getJavaMailProperties();
	    props.put("mail.transport.protocol", "smtp");
	    props.put("mail.smtp.auth", "true");
	    props.put("mail.smtp.starttls.enable", "true");
	    props.put("mail.debug", "true");
	    
	    return mailSender;
	}
	
	@Bean
	public SimpleMailMessage forgotPasswordMessage() {
		SimpleMailMessage message = new SimpleMailMessage();

		return message;
	}
}
