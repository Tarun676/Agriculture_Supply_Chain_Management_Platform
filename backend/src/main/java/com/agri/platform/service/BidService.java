package com.agri.platform.service;

import com.agri.platform.config.BiddingWebSocketHandler;
import com.agri.platform.entity.Bid;
import com.agri.platform.entity.Product;
import com.agri.platform.entity.User;
import com.agri.platform.repository.BidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class BidService {

    private final BidRepository bidRepository;
    private final ProductService productService;
    private final UserService userService;
    private final BiddingWebSocketHandler biddingWebSocketHandler;

    @Autowired
    public BidService(BidRepository bidRepository, ProductService productService, 
                      UserService userService, BiddingWebSocketHandler biddingWebSocketHandler) {
        this.bidRepository = bidRepository;
        this.productService = productService;
        this.userService = userService;
        this.biddingWebSocketHandler = biddingWebSocketHandler;
    }

    public Bid placeBid(Bid bid) {
        // 1. Validate buyer exists and is indeed a BUYER
        User buyer = userService.getUserById(bid.getBuyerId());
        if (!"BUYER".equalsIgnoreCase(buyer.getRole())) {
            throw new IllegalArgumentException("Only users with the role 'BUYER' can place bids!");
        }

        // 2. Validate product exists and check auction status & countdown
        Product product = productService.getProductById(bid.getProductId());
        if (!"ACTIVE".equalsIgnoreCase(product.getStatus())) {
            throw new IllegalArgumentException("Bidding is closed for this crop listing (Status: " + product.getStatus() + ")!");
        }
        if (product.getAuctionEndTime() != null && LocalDateTime.now().isAfter(product.getAuctionEndTime())) {
            throw new IllegalArgumentException("This auction has expired! No further bids are accepted.");
        }

        // 3. Ensure bid is greater than the base starting price
        if (bid.getBidAmount() == null || bid.getBidAmount().compareTo(product.getPrice()) <= 0) {
            throw new IllegalArgumentException("Bid amount must be greater than the product starting price of ₹" + product.getPrice() + "!");
        }

        // 4. Ensure bid is higher than the current highest bid
        List<Bid> existingBids = bidRepository.findByProductIdOrderByBidAmountDesc(bid.getProductId());
        if (!existingBids.isEmpty()) {
            BigDecimal highestBid = existingBids.get(0).getBidAmount();
            if (bid.getBidAmount().compareTo(highestBid) <= 0) {
                throw new IllegalArgumentException("Bid amount must be higher than the current highest bid of ₹" + highestBid + "!");
            }
        }

        // Bind buyer's name to the bid record for immediate client presentation
        bid.setBuyerName(buyer.getName());

        Bid savedBid = bidRepository.save(bid);

        // Push real-time bid notification to all connected browser desktops!
        biddingWebSocketHandler.broadcastBid(savedBid);

        return savedBid;
    }

    @Transactional(readOnly = true)
    public List<Bid> getBidsForProduct(Long productId) {
        // Verify product existence first to fail fast
        productService.getProductById(productId);
        return bidRepository.findByProductIdOrderByBidAmountDesc(productId);
    }
}
