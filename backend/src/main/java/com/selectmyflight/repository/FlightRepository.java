package com.selectmyflight.repository;

import com.selectmyflight.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    List<Flight> findByOriginCodeAndDestinationCode(String originCode, String destinationCode);

    List<Flight> findByDestinationCode(String destinationCode);

    @Query("SELECT f FROM Flight f WHERE f.basePrice <= :maxPrice")
    List<Flight> findFlightsUnderBudget(@Param("maxPrice") BigDecimal maxPrice);

    @Query("SELECT MIN(f.basePrice) FROM Flight f WHERE f.originCode = :origin AND f.destinationCode = :dest")
    BigDecimal findLowestPriceForRoute(@Param("origin") String origin, @Param("dest") String dest);
}
