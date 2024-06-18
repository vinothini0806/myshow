package com.example.backend.repository;
import com.example.backend.models.Movie;
import com.example.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie,Long> {

    Optional<Movie> findById(Long id);
    List<Movie> findAllById(Iterable<Long> ids);
    List<Movie> findAll();
}

