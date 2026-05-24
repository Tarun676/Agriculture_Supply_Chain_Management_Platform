package com.agri.platform.service;

import com.agri.platform.entity.Product;
import com.agri.platform.entity.User;
import com.agri.platform.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final UserService userService;

    @Autowired
    public ProductService(ProductRepository productRepository, UserService userService) {
        this.productRepository = productRepository;
        this.userService = userService;
    }

    /** Farmer creates a new crop listing */
    public Product createProduct(Product product) {
        User farmer = userService.getUserById(product.getFarmerId());
        if (!"FARMER".equalsIgnoreCase(farmer.getRole())) {
            throw new IllegalArgumentException("Only FARMER users can list products!");
        }
        if (product.getPrice() == null || product.getPrice().doubleValue() <= 0) {
            throw new IllegalArgumentException("Base price must be greater than zero!");
        }
        if (product.getQuantity() == null || product.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero!");
        }
        product.setStatus("ACTIVE");
        return productRepository.save(product);
    }

    /** Farmer updates their own listing */
    public Product updateProduct(Long id, Product updated, Long farmerId) {
        Product existing = getProductById(id);
        if (!existing.getFarmerId().equals(farmerId)) {
            throw new IllegalArgumentException("You can only edit your own listings!");
        }
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getPrice() != null && updated.getPrice().doubleValue() > 0) existing.setPrice(updated.getPrice());
        if (updated.getQuantity() != null && updated.getQuantity() > 0) existing.setQuantity(updated.getQuantity());
        if (updated.getLocation() != null) existing.setLocation(updated.getLocation());
        if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
        if (updated.getImageUrl() != null) existing.setImageUrl(updated.getImageUrl());
        if (updated.getAuctionEndTime() != null) existing.setAuctionEndTime(updated.getAuctionEndTime());
        return productRepository.save(existing);
    }

    /** Farmer deletes their own listing */
    public void deleteProduct(Long id, Long farmerId) {
        Product existing = getProductById(id);
        if (!existing.getFarmerId().equals(farmerId)) {
            throw new IllegalArgumentException("You can only delete your own listings!");
        }
        productRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found!"));
    }

    @Transactional(readOnly = true)
    public List<Product> getProductsByFarmer(Long farmerId) {
        return productRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId);
    }

    @Transactional(readOnly = true)
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCaseOrderByCreatedAtDesc(category);
    }

    /** Mark auction as closed when timer expires */
    public Product closeAuction(Long productId, Long farmerId) {
        Product product = getProductById(productId);
        if (!product.getFarmerId().equals(farmerId)) {
            throw new IllegalArgumentException("You can only close your own auctions!");
        }
        product.setStatus("CLOSED");
        return productRepository.save(product);
    }

    /** Mark product as SOLD after bid acceptance */
    public void markAsSold(Long productId) {
        Product product = getProductById(productId);
        product.setStatus("SOLD");
        productRepository.save(product);
    }
}
