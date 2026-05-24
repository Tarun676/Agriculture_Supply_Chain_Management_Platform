package com.agri.platform.repository;

import com.agri.platform.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
    List<Order> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
    Optional<Order> findByBidId(Long bidId);
    List<Order> findAllByOrderByCreatedAtDesc();
}
