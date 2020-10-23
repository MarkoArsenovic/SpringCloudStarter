package com.panonit.cloudstarter.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import com.panonit.cloudstarter.utils.ConfigKeyConsts;

@Component
@ConfigurationProperties("iam")
public class IamServiceConfigurationProperties {
	
	private String jwtSecret;
	private String jwtExpirationInMs;
	private String expirationRefreshThresholdInS;
	
	public String getJwtSecret() {
		return jwtSecret;
	}
	public void setJwtSecret(String jwtSecret) {
		this.jwtSecret = jwtSecret;
		System.setProperty(ConfigKeyConsts.IAM_JWT_SECRET, this.jwtSecret);
	}
	public String getJwtExpirationInMs() {
		return jwtExpirationInMs;
	}
	public void setJwtExpirationInMs(String jwtExpirationInMs) {
		this.jwtExpirationInMs = jwtExpirationInMs;
		System.setProperty(ConfigKeyConsts.IAM_JWT_EXPIRATION_IN_Ms, this.jwtExpirationInMs);
	}
	public String getExpirationRefreshThresholdInS() {
		return expirationRefreshThresholdInS;
	}
	public void setExpirationRefreshThresholdInS(String expirationRefreshThresholdInS) {
		this.expirationRefreshThresholdInS = expirationRefreshThresholdInS;
		System.setProperty(ConfigKeyConsts.IAM_EXPIRATION_REFRESH_THRESHOLD_IN_S, this.expirationRefreshThresholdInS);
	}	

}
