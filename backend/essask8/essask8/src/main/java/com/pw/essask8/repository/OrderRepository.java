package com.pw.essask8.repository;

import com.pw.essask8.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findAllByUser_Id(Integer userId);
    Optional<Order> findByUserUsernameAndOrderStatus(String username, String status);
    List<Order> findTop2ByOrderByOrderDateDesc();
    List<Order> findByUserUsername(String username);
}