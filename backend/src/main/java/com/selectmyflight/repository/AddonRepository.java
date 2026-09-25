package com.selectmyflight.repository;

import com.selectmyflight.model.Addon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddonRepository extends JpaRepository<Addon, Long> {
    List<Addon> findByAddonType(String addonType);
}
