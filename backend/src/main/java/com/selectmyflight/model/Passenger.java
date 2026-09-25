package com.selectmyflight.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "passengers")
public class Passenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    @JsonIgnore
    private Booking booking;

    private String title = "Mr";

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    private String gender = "Male";
    private String seatNumber;
    private String mealPreference = "Regular";
    private Integer extraBaggageKg = 0;

    public Passenger() {}

    public Passenger(String title, String firstName, String lastName, String gender, String seatNumber, String mealPreference, Integer extraBaggageKg) {
        this.title = title;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.seatNumber = seatNumber;
        this.mealPreference = mealPreference;
        this.extraBaggageKg = extraBaggageKg;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public String getMealPreference() { return mealPreference; }
    public void setMealPreference(String mealPreference) { this.mealPreference = mealPreference; }

    public Integer getExtraBaggageKg() { return extraBaggageKg; }
    public void setExtraBaggageKg(Integer extraBaggageKg) { this.extraBaggageKg = extraBaggageKg; }
}
