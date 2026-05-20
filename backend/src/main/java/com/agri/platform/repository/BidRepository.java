package com.agri.platform.repository;

import com.agri.platform.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByProductIdOrderByBidAmountDesc(Long productId);
}
