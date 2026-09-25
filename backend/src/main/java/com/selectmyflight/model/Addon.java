package com.selectmyflight.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "addons")
public class Addon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String addonType; // MEAL, BAGGAGE, PRIORITY

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 50)
    private String code;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    private String description;

    public Addon() {}

    public Addon(String addonType, String name, String code, BigDecimal price, String description) {
        this.addonType = addonType;
        this.name = name;
        this.code = code;
        this.price = price;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAddonType() { return addonType; }
    public void setAddonType(String addonType) { this.addonType = addonType; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
