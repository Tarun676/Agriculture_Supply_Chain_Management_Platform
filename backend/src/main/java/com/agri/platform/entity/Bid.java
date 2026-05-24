package com.agri.platform.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bids")
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bid_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal bidAmount;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "buyer_id", nullable = false)
    private Long buyerId;

    @Column(name = "buyer_name")
    private String buyerName;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }

    public Bid() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BigDecimal getBidAmount() { return bidAmount; }
    public void setBidAmount(BigDecimal bidAmount) { this.bidAmount = bidAmount; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }
    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    // Builder Pattern
    public static BidBuilder builder() { return new BidBuilder(); }

    public static class BidBuilder {
        private Long id;
        private BigDecimal bidAmount;
        private Long productId;
        private Long buyerId;
        private String buyerName;
        private LocalDateTime timestamp;

        public BidBuilder id(Long id) { this.id = id; return this; }
        public BidBuilder bidAmount(BigDecimal bidAmount) { this.bidAmount = bidAmount; return this; }
        public BidBuilder productId(Long productId) { this.productId = productId; return this; }
        public BidBuilder buyerId(Long buyerId) { this.buyerId = buyerId; return this; }
        public BidBuilder buyerName(String buyerName) { this.buyerName = buyerName; return this; }
        public BidBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public Bid build() {
            Bid b = new Bid();
            b.id = this.id;
            b.bidAmount = this.bidAmount;
            b.productId = this.productId;
            b.buyerId = this.buyerId;
            b.buyerName = this.buyerName;
            b.timestamp = this.timestamp;
            return b;
        }
    }
}

