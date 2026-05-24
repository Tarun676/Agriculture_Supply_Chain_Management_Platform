package com.agri.platform.config;

import com.agri.platform.entity.Bid;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * High-performance WebSocket handler for real-time bidding updates.
 * Maintains thread-safe active sessions and broadcasts newly placed bids instantly to all browsers.
 */
@Component
public class BiddingWebSocketHandler extends TextWebSocketHandler {

    private static final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final ObjectMapper objectMapper;

    public BiddingWebSocketHandler() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        System.out.println("🔌 [WebSocket Registry] Connection established: session_id=" + session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        System.out.println("🔌 [WebSocket Registry] Connection terminated: session_id=" + session.getId());
    }

    /**
     * Serializes a Bid entity to JSON and broadcasts it to all connected client sessions.
     */
    public void broadcastBid(Bid bid) {
        try {
            String jsonPayload = objectMapper.writeValueAsString(bid);
            TextMessage message = new TextMessage(jsonPayload);

            int activeSends = 0;
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(message);
                        activeSends++;
                    } catch (IOException e) {
                        System.err.println("Failed to push socket frame to session_id=" + session.getId() + ": " + e.getMessage());
                    }
                }
            }
            System.out.println("📢 [WebSocket Broadcaster] Pushed live bid_id=" + bid.getId() 
                    + " for product_id=" + bid.getProductId() + " to " + activeSends + " connected desktops.");
        } catch (Exception e) {
            System.err.println("Failed to parse/broadcast WebSocket payload: " + e.getMessage());
        }
    }
}
