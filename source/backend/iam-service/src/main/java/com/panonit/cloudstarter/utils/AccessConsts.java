package com.panonit.cloudstarter.utils;

public class AccessConsts {

	public static final String READ_ACCESS = "canRead";
	public static final String WRITE_ACCESS = "canWrite";
	public static final String UPDATE_ACCESS = "canUpdate";
	public static final String DELETE_ACCESS = "canDelete";
	
	public static final String IAM_CAN_READ = "hasPermission(#token, 'IAM.canRead')";
	public static final String IAM_CAN_WRITE = "hasPermission(#token, 'IAM.canWrite')";
	public static final String IAM_CAN_UPDATE = "hasPermission(#token, 'IAM.canUpdate')";
	public static final String IAM_CAN_DELETE = "hasPermission(#token, 'IAM.canDelete')";
	
}
