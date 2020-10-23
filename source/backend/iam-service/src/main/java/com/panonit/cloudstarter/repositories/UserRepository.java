package com.panonit.cloudstarter.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.panonit.cloudstarter.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	
	Optional<User> findByEmail(String email);
	
	Optional<User> findByUsername(String username);
	
	@Query(value = "SELECT * FROM tblusers u LEFT JOIN tbluserroles ur ON u.userid=ur.userid LEFT JOIN tblroles r ON ur.roleid=r.roleid WHERE r.name= :roleName",
			nativeQuery = true)
	List<User> findByRoleName(@Param("roleName") String roleName);

}
