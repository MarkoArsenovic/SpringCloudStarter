package com.panonit.cloudstarter.models;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tblUsers")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "UserID")
	private Long id;
	
	@Column(name = "Name", nullable = false)
	private String name;
	
	@Column(name = "LastName", nullable = false)
	private String lastname;
	
	@Column(name = "Username", nullable = false, unique = true)
	private String username;
	
	@Column(name = "Email", nullable = false, unique = true)
	private String email;
	
	@Column(name = "Password", nullable = false)
	private String password;
	
	@Column(name = "Enabled", nullable = false)
	private Boolean enabled = true;  // By default, user is enabled
	
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name="tbluserroles", joinColumns = @JoinColumn(name = "UserID"), inverseJoinColumns = @JoinColumn(name = "RoleID"))
	private List<Role> userRoles;
}
