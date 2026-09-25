package com.selectmyflight.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "seats")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long flightId;

    @Column(nullable = false, length = 10)
    private String seatNumber;

    @Column(nullable = false, length = 50)
    private String seatClass; // Economy, Extra Legroom, Business

    @Column(nullable = false, length = 20)
    private String seatType;  // Window, Aisle, Middle

    private Boolean extraLegroom = false;
    private BigDecimal priceAddon = BigDecimal.ZERO;
    private Boolean isBooked = false;

    public Seat() {}

    public Seat(Long flightId, String seatNumber, String seatClass, String seatType, Boolean extraLegroom, BigDecimal priceAddon, Boolean isBooked) {
        this.flightId = flightId;
        this.seatNumber = seatNumber;
        this.seatClass = seatClass;
        this.seatType = seatType;
        this.extraLegroom = extraLegroom;
        this.priceAddon = priceAddon;
        this.isBooked = isBooked;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFlightId() { return flightId; }
    public void setFlightId(Long flightId) { this.flightId = flightId; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public String getSeatClass() { return seatClass; }
    public void setSeatClass(String seatClass) { this.seatClass = seatClass; }

    public String getSeatType() { return seatType; }
    public void setSeatType(String seatType) { this.seatType = seatType; }

    public Boolean getExtraLegroom() { return extraLegroom; }
    public void setExtraLegroom(Boolean extraLegroom) { this.extraLegroom = extraLegroom; }

    public BigDecimal getPriceAddon() { return priceAddon; }
    public void setPriceAddon(BigDecimal priceAddon) { this.priceAddon = priceAddon; }

    public Boolean getIsBooked() { return isBooked; }
    public void setIsBooked(Boolean booked) { isBooked = booked; }
}
