package com.agri.platform.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * Custom Stateless JWT Token Service
 * Uses standard HMAC-SHA256 to sign and verify claims without external jjwt libraries,
 * ensuring absolute portability, high performance, and robust compilation.
 */
@Service
public class TokenService {

    private static final String SECRET_KEY = "AgriSupplyChainSecureSuperSecretEncryptionKeyForTarunCapstone2026";
    private static final long EXPIRATION_MS = 86400000; // 24 hours
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateToken(Long id, String name, String email, String role) {
        try {
            // 1. Header
            Map<String, String> header = new HashMap<>();
            header.put("alg", "HS256");
            header.put("typ", "JWT");
            String encodedHeader = base64UrlEncode(objectMapper.writeValueAsString(header).getBytes(StandardCharsets.UTF_8));

            // 2. Payload
            Map<String, Object> payload = new HashMap<>();
            payload.put("id", id);
            payload.put("name", name);
            payload.put("email", email);
            payload.put("role", role);
            payload.put("exp", System.currentTimeMillis() + EXPIRATION_MS);
            String encodedPayload = base64UrlEncode(objectMapper.writeValueAsString(payload).getBytes(StandardCharsets.UTF_8));

            // 3. Signature
            String signatureInput = encodedHeader + "." + encodedPayload;
            String signature = calculateHmacSha256(signatureInput, SECRET_KEY);

            return signatureInput + "." + signature;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate token", e);
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> validateAndDecode(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return null;
            }

            String headerPart = parts[0];
            String payloadPart = parts[1];
            String signaturePart = parts[2];

            // Verify signature integrity
            String signatureInput = headerPart + "." + payloadPart;
            String calculatedSignature = calculateHmacSha256(signatureInput, SECRET_KEY);
            if (!calculatedSignature.equals(signaturePart)) {
                return null;
            }

            // Decode payload claims
            byte[] payloadBytes = Base64.getUrlDecoder().decode(payloadPart);
            Map<String, Object> payload = objectMapper.readValue(payloadBytes, Map.class);

            // Verify expiration
            Object expObj = payload.get("exp");
            if (expObj == null) {
                return null;
            }
            long exp = ((Number) expObj).longValue();
            if (System.currentTimeMillis() > exp) {
                return null;
            }

            return payload;
        } catch (Exception e) {
            return null;
        }
    }

    private String base64UrlEncode(byte[] input) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(input);
    }

    private String calculateHmacSha256(String data, String key) throws Exception {
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256Hmac.init(secretKey);
        byte[] rawHmac = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return base64UrlEncode(rawHmac);
    }
}
