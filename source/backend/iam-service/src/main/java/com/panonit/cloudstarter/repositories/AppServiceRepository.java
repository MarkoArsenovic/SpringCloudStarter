package com.panonit.cloudstarter.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.panonit.cloudstarter.models.AppService;

public interface AppServiceRepository extends JpaRepository<AppService, Long> {
	Optional<AppService> findByName(String name);
}
