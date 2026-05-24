package com.agri.platform.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Double quantity;

    @Column(name = "farmer_id", nullable = false)
    private Long farmerId;

    // --- Phase 2 additions ---

    // Geographic location (e.g. "Punjab", "Uttar Pradesh")
    @Column
    private String location;

    // Crop category: GRAINS, VEGETABLES, FRUITS, SPICES, PULSES, DAIRY, OTHER
    @Column
    private String category;

    // URL to an image of the crop
    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    // When the auction closes — buyers cannot bid after this time
    @Column(name = "auction_end_time")
    private LocalDateTime auctionEndTime;

    // ACTIVE (open for bids), CLOSED (timer expired), SOLD (bid accepted)
    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "ACTIVE";
    }

    // Default Constructor
    public Product() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }
    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public LocalDateTime getAuctionEndTime() { return auctionEndTime; }
    public void setAuctionEndTime(LocalDateTime auctionEndTime) { this.auctionEndTime = auctionEndTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder Pattern
    public static ProductBuilder builder() { return new ProductBuilder(); }

    public static class ProductBuilder {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private Double quantity;
        private Long farmerId;
        private String location;
        private String category;
        private String imageUrl;
        private LocalDateTime auctionEndTime;
        private String status = "ACTIVE";

        public ProductBuilder id(Long id) { this.id = id; return this; }
        public ProductBuilder name(String name) { this.name = name; return this; }
        public ProductBuilder description(String description) { this.description = description; return this; }
        public ProductBuilder price(BigDecimal price) { this.price = price; return this; }
        public ProductBuilder quantity(Double quantity) { this.quantity = quantity; return this; }
        public ProductBuilder farmerId(Long farmerId) { this.farmerId = farmerId; return this; }
        public ProductBuilder location(String location) { this.location = location; return this; }
        public ProductBuilder category(String category) { this.category = category; return this; }
        public ProductBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public ProductBuilder auctionEndTime(LocalDateTime auctionEndTime) { this.auctionEndTime = auctionEndTime; return this; }
        public ProductBuilder status(String status) { this.status = status; return this; }

        public Product build() {
            Product p = new Product();
            p.id = this.id; p.name = this.name; p.description = this.description;
            p.price = this.price; p.quantity = this.quantity; p.farmerId = this.farmerId;
            p.location = this.location; p.category = this.category; p.imageUrl = this.imageUrl;
            p.auctionEndTime = this.auctionEndTime; p.status = this.status;
            return p;
        }
    }
}
