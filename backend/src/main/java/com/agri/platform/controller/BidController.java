package com.agri.platform.controller;

import com.agri.platform.entity.Bid;
import com.agri.platform.service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bids")
public class BidController {

    private final BidService bidService;

    @Autowired
    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    @PostMapping
    public ResponseEntity<?> placeBid(@RequestBody Bid bid) {
        return ResponseEntity.ok(bidService.placeBid(bid));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getBidsForProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(bidService.getBidsForProduct(productId));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
