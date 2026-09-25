package com.selectmyflight.model;

import jakarta.persistence.*;

@Entity
@Table(name = "airports")
public class Airport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 3)
    private String iataCode;

    @Column(nullable = false, length = 100)
    private String cityName;

    @Column(nullable = false, length = 150)
    private String airportName;

    @Column(nullable = false, length = 100)
    private String country;

    public Airport() {}

    public Airport(String iataCode, String cityName, String airportName, String country) {
        this.iataCode = iataCode;
        this.cityName = cityName;
        this.airportName = airportName;
        this.country = country;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIataCode() { return iataCode; }
    public void setIataCode(String iataCode) { this.iataCode = iataCode; }

    public String getCityName() { return cityName; }
    public void setCityName(String cityName) { this.cityName = cityName; }

    public String getAirportName() { return airportName; }
    public void setAirportName(String airportName) { this.airportName = airportName; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
}
