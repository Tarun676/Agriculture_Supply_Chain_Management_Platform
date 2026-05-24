package com.agri.platform.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * Main WebSockets Configuration.
 * Maps the BiddingWebSocketHandler to the "/ws/bids" endpoint, allowing cross-origin socket traffic.
 */
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final BiddingWebSocketHandler biddingWebSocketHandler;

    @Autowired
    public WebSocketConfig(BiddingWebSocketHandler biddingWebSocketHandler) {
        this.biddingWebSocketHandler = biddingWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(biddingWebSocketHandler, "/ws/bids")
                .setAllowedOrigins("*");
    }
}
