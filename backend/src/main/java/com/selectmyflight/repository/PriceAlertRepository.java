package com.selectmyflight.repository;

import com.selectmyflight.model.PriceAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceAlertRepository extends JpaRepository<PriceAlert, Long> {
    List<PriceAlert> findByOriginCodeAndDestinationCode(String originCode, String destinationCode);
    List<PriceAlert> findByEmail(String email);
}
