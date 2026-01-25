package com.pw.essask8.repository;

import com.pw.essask8.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    boolean existsByEmailAddress(String emailAddress);
    boolean existsByUsername(String username);
}