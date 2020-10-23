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

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tblServices")
public class AppService {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ServiceID")
	private Long id;
	
	@Column(name = "Name", nullable = false, unique = true, updatable = false)
	private String name;
	
	@Column(name = "DisplayName", nullable = false)
	private String displayName;
	
	@Column(name = "Description")
	private String description;
	
	@OneToMany(mappedBy = "service", orphanRemoval = true, fetch = FetchType.LAZY)
	private List<Permission> permissions = new ArrayList<>();
}
