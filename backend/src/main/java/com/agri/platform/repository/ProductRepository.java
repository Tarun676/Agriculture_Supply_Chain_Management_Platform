package com.agri.platform.repository;

import com.agri.platform.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
    List<Product> findByCategoryIgnoreCaseOrderByCreatedAtDesc(String category);
    List<Product> findByStatusOrderByCreatedAtDesc(String status);
}
