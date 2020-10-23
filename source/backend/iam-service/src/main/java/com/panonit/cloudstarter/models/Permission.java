package com.panonit.cloudstarter.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tblpermissions")
public class Permission {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "PermissionID")
	private Long id;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "RoleID", referencedColumnName = "RoleID")
	private Role role;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "ServiceID", referencedColumnName = "ServiceID")
	private AppService service;
	
	@Column(name = "CanUpdate")
	private Boolean canUpdate;
	
	@Column(name = "CanRead")
	private Boolean canRead;
	
	@Column(name = "CanWrite")
	private Boolean canWrite;
	
	@Column(name = "CanDelete")
	private Boolean canDelete;
}
