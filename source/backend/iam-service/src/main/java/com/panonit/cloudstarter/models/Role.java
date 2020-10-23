package com.panonit.cloudstarter.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tblRoles")
public class Role {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "RoleID")
	private Long id;
	
	@Column(name = "Name", nullable = false, unique = true)
	private String name;
	
	@Column(name = "Description")
	private String description;
	
	@OneToMany(mappedBy = "role", orphanRemoval = true, fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Permission> permissions = new ArrayList<>();
}
