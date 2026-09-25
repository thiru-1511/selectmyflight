package com.selectmyflight.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "flights")
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String flightNumber;

    @Column(nullable = false, length = 100)
    private String airlineName;

    @Column(nullable = false, length = 10)
    private String airlineCode;

    private String airlineLogo;

    @Column(nullable = false, length = 3)
    private String originCode;

    @Column(nullable = false, length = 3)
    private String destinationCode;

    @Column(nullable = false, length = 10)
    private String departureTime;

    @Column(nullable = false, length = 10)
    private String arrivalTime;

    @Column(nullable = false)
    private Integer durationMinutes;

    private Integer stops = 0;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    private String cabinClass = "Economy";
    private Integer cabinBaggageKg = 7;
    private Integer checkedBaggageKg = 15;
    private Boolean refundable = true;
    private BigDecimal cancellationFee = new BigDecimal("1500.00");
    private BigDecimal changeFee = new BigDecimal("1000.00");
    private String aircraftModel = "Airbus A321neo";

    public Flight() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }

    public String getAirlineName() { return airlineName; }
    public void setAirlineName(String airlineName) { this.airlineName = airlineName; }

    public String getAirlineCode() { return airlineCode; }
    public void setAirlineCode(String airlineCode) { this.airlineCode = airlineCode; }

    public String getAirlineLogo() { return airlineLogo; }
    public void setAirlineLogo(String airlineLogo) { this.airlineLogo = airlineLogo; }

    public String getOriginCode() { return originCode; }
    public void setOriginCode(String originCode) { this.originCode = originCode; }

    public String getDestinationCode() { return destinationCode; }
    public void setDestinationCode(String destinationCode) { this.destinationCode = destinationCode; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Integer getStops() { return stops; }
    public void setStops(Integer stops) { this.stops = stops; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public String getCabinClass() { return cabinClass; }
    public void setCabinClass(String cabinClass) { this.cabinClass = cabinClass; }

    public Integer getCabinBaggageKg() { return cabinBaggageKg; }
    public void setCabinBaggageKg(Integer cabinBaggageKg) { this.cabinBaggageKg = cabinBaggageKg; }

    public Integer getCheckedBaggageKg() { return checkedBaggageKg; }
    public void setCheckedBaggageKg(Integer checkedBaggageKg) { this.checkedBaggageKg = checkedBaggageKg; }

    public Boolean getRefundable() { return refundable; }
    public void setRefundable(Boolean refundable) { this.refundable = refundable; }

    public BigDecimal getCancellationFee() { return cancellationFee; }
    public void setCancellationFee(BigDecimal cancellationFee) { this.cancellationFee = cancellationFee; }

    public BigDecimal getChangeFee() { return changeFee; }
    public void setChangeFee(BigDecimal changeFee) { this.changeFee = changeFee; }

    public String getAircraftModel() { return aircraftModel; }
    public void setAircraftModel(String aircraftModel) { this.aircraftModel = aircraftModel; }
}
