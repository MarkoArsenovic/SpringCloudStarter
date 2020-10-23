package com.panonit.cloudstarter.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties("email")
public class IamServiceEmailConfigurationProperties {
	
	private String host;
	private String port;
	private String subject;
	private String passwordExpiration;
	private String submit;
	private IamServiceEmailSenderConfigurationProperties sender;
	
	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getPasswordExpiration() {
		return passwordExpiration;
	}

	public void setPasswordExpiration(String passwordExpiration) {
		this.passwordExpiration = passwordExpiration;
	}

	public String getSubmit() {
		return submit;
	}

	public void setSubmit(String submit) {
		this.submit = submit;
	}

	public IamServiceEmailSenderConfigurationProperties getSender() {
		return sender;
	}

	public void setSender(IamServiceEmailSenderConfigurationProperties sender) {
		this.sender = sender;
	}

}
