package com.panonit.cloudstarter.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.panonit.cloudstarter.models.PasswordResetToken;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
	
	@Query(nativeQuery = true, value = "SELECT * FROM tbltokenreset t WHERE t.userid=:userId ORDER BY t.expirydate DESC LIMIT 1")
	Optional<PasswordResetToken> findLatestResetTokenForUser(Long userId); 

}
