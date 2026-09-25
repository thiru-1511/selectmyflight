package com.selectmyflight.service;

import com.selectmyflight.model.PriceAlert;
import com.selectmyflight.repository.FlightRepository;
import com.selectmyflight.repository.PriceAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class PriceAlertService {

    @Autowired
    private PriceAlertRepository priceAlertRepository;

    @Autowired
    private FlightRepository flightRepository;

    public PriceAlert createAlert(String origin, String destination, BigDecimal targetPrice, String email) {
        BigDecimal lowestPrice = flightRepository.findLowestPriceForRoute(origin.toUpperCase(), destination.toUpperCase());
        if (lowestPrice == null) {
            lowestPrice = new BigDecimal("4999.00");
        }

        PriceAlert alert = new PriceAlert(
                origin.toUpperCase(),
                destination.toUpperCase(),
                targetPrice,
                lowestPrice,
                email
        );

        if (lowestPrice.compareTo(targetPrice) <= 0) {
            alert.setAlertStatus("TRIGGERED");
        } else {
            alert.setAlertStatus("ACTIVE");
        }

        return priceAlertRepository.save(alert);
    }

    public List<PriceAlert> getAlertsByEmail(String email) {
        return priceAlertRepository.findByEmail(email);
    }

    public List<PriceAlert> getAllAlerts() {
        return priceAlertRepository.findAll();
    }
}
