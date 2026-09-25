package com.selectmyflight.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_alerts")
public class PriceAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 3)
    private String originCode;

    @Column(nullable = false, length = 3)
    private String destinationCode;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal targetPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal currentLowestPrice;

    @Column(nullable = false, length = 150)
    private String email;

    private String alertStatus = "ACTIVE"; // ACTIVE, TRIGGERED, DISABLED
    private LocalDateTime createdAt = LocalDateTime.now();

    public PriceAlert() {}

    public PriceAlert(String originCode, String destinationCode, BigDecimal targetPrice, BigDecimal currentLowestPrice, String email) {
        this.originCode = originCode;
        this.destinationCode = destinationCode;
        this.targetPrice = targetPrice;
        this.currentLowestPrice = currentLowestPrice;
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOriginCode() { return originCode; }
    public void setOriginCode(String originCode) { this.originCode = originCode; }

    public String getDestinationCode() { return destinationCode; }
    public void setDestinationCode(String destinationCode) { this.destinationCode = destinationCode; }

    public BigDecimal getTargetPrice() { return targetPrice; }
    public void setTargetPrice(BigDecimal targetPrice) { this.targetPrice = targetPrice; }

    public BigDecimal getCurrentLowestPrice() { return currentLowestPrice; }
    public void setCurrentLowestPrice(BigDecimal currentLowestPrice) { this.currentLowestPrice = currentLowestPrice; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAlertStatus() { return alertStatus; }
    public void setAlertStatus(String alertStatus) { this.alertStatus = alertStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
