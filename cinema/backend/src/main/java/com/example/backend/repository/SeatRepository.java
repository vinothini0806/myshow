package com.example.backend.repository;

import com.example.backend.models.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat,Long> {
    Optional<Seat> findById(Long id);

    List<Seat> findByUserId(Long userId);
}
