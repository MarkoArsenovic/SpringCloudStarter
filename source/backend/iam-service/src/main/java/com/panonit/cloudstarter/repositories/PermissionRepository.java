package com.panonit.cloudstarter.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.panonit.cloudstarter.models.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
	
	@Query("SELECT p FROM Permission p WHERE p.role.name = :roleName")
	List<Permission> findByRoleName(@Param("roleName") String roleName);
	
	@Query("SELECT p FROM Permission p WHERE p.role.id = :roleId")
	List<Permission> findByRoleId(@Param("roleId") Long roleId);
	
}
