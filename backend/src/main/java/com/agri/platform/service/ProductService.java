package com.agri.platform.service;

import com.agri.platform.entity.Product;
import com.agri.platform.entity.User;
import com.agri.platform.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    public Product createProduct(Product product) {
        // Validate farmer exists and is indeed a FARMER
        User farmer = userService.getUserById(product.getFarmerId());
        if (!"FARMER".equalsIgnoreCase(farmer.getRole())) {
            throw new IllegalArgumentException("Only users with the role 'FARMER' can list products!");
        }

        if (product.getPrice() == null || product.getPrice().doubleValue() <= 0) {
            throw new IllegalArgumentException("Product starting price must be greater than zero!");
        }

        if (product.getQuantity() == null || product.getQuantity() <= 0) {
            throw new IllegalArgumentException("Product quantity must be greater than zero!");
        }

        return productRepository.save(product);
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
}
