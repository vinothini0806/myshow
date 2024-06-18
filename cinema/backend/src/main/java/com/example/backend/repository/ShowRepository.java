package com.example.backend.repository;
import com.example.backend.models.Seat;
import com.example.backend.models.Show;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShowRepository extends JpaRepository<Show,Long> {
    Optional<Show> findById(Long showId);


    List<Show> findByUserId(Long userId);
}
