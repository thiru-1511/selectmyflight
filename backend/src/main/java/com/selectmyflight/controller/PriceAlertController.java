package com.selectmyflight.controller;

import com.selectmyflight.model.PriceAlert;
import com.selectmyflight.service.PriceAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
public class PriceAlertController {

    @Autowired
    private PriceAlertService priceAlertService;

    public static class AlertRequest {
        private String origin;
        private String destination;
        private BigDecimal targetPrice;
        private String email;

        public AlertRequest() {}
        public String getOrigin() { return origin; }
        public void setOrigin(String origin) { this.origin = origin; }
        public String getDestination() { return destination; }
        public void setDestination(String destination) { this.destination = destination; }
        public BigDecimal getTargetPrice() { return targetPrice; }
        public void setTargetPrice(BigDecimal targetPrice) { this.targetPrice = targetPrice; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    // Feature 6: Set Flight Price Alert
    @PostMapping
    public ResponseEntity<PriceAlert> createPriceAlert(@RequestBody AlertRequest request) {
        PriceAlert alert = priceAlertService.createAlert(
                request.getOrigin(),
                request.getDestination(),
                request.getTargetPrice() != null ? request.getTargetPrice() : new BigDecimal("9999.00"),
                request.getEmail() != null ? request.getEmail() : "user@selectmyflight.com"
        );
        return ResponseEntity.ok(alert);
    }

    // Get active alerts
    @GetMapping
    public ResponseEntity<List<PriceAlert>> getAlerts(@RequestParam(required = false) String email) {
        if (email != null && !email.isBlank()) {
            return ResponseEntity.ok(priceAlertService.getAlertsByEmail(email));
        }
        return ResponseEntity.ok(priceAlertService.getAllAlerts());
    }
}
