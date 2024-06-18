package com.example.backend.controllers;

import com.example.backend.dto.*;
import com.example.backend.models.Movie;
import com.example.backend.service.KafkaService;
import com.example.backend.service.MovieService;
import com.example.backend.utils.ImageUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
public class MovieController {
    private final MovieService movieService;
    private final KafkaService kafkaService;
    @PostMapping("/createmovie")
    public ResponseEntity<String> createmovie(

            @RequestHeader("Authorization") String token,
            @RequestPart("image") MultipartFile file,
            @RequestPart("metadata") String metadataJson ) throws IOException {


        ObjectMapper objectMapper = new ObjectMapper();
        MovieCreateRequestDTO metadata = objectMapper.readValue(metadataJson, MovieCreateRequestDTO.class);
        Movie savedMovie = movieService.uploadMovie(token,file, metadata);
        if(savedMovie != null) {
            KafkaMovieDTO kafkaMovieDTO = new KafkaMovieDTO();
            kafkaMovieDTO.setMovieId(savedMovie.getMovieId());
            kafkaMovieDTO.setName(savedMovie.getName());
            kafkaMovieDTO.setDescription(savedMovie.getDescription());
            kafkaMovieDTO.setHours(savedMovie.getHours());
            kafkaMovieDTO.setMinutes(savedMovie.getMinutes());
            kafkaMovieDTO.setReleaseDate(savedMovie.getReleaseDate());
            kafkaMovieDTO.setLanguage(savedMovie.getLanguage());
            kafkaMovieDTO.setImageData(ImageUtils.decompressImage(savedMovie.getImageData()));
            kafkaService.processMovie(kafkaMovieDTO);
        }
        return ResponseEntity.ok("Movie created successfully.");
    }

    @GetMapping("/getmovie/{id}")
    public ResponseEntity<MovieResponseDTO> getMovie(
            @PathVariable Long id) {
        MovieResponseDTO movieResponseDTO = movieService.getMovie(id);
        return ResponseEntity.ok(movieResponseDTO);
    }

    @GetMapping("/getAllmovies")
    public ResponseEntity<List<MovieResponseDTO>> getAllMovies(
            @RequestHeader("Authorization") String token ) throws Exception {

        List<MovieResponseDTO> movieResponseDTO = movieService.getAllMovies(token);
        return ResponseEntity.ok(movieResponseDTO);
    }

    @PutMapping("/updatemovie")
    public ResponseEntity<String> updateUser(
            @RequestHeader("Authorization") String token,
            @RequestPart("image") MultipartFile file,
            @RequestPart("metadata") String metadataJson
    ) throws IOException {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        ObjectMapper objectMapper = new ObjectMapper();
        UpdateMovieRequestDTO metadata = objectMapper.readValue(metadataJson, UpdateMovieRequestDTO.class);
        Movie savedMovie = movieService.updateMovie(token,file,metadata);
        return ResponseEntity.ok("Movie updated successfully.");
    }
//localhost:8080/deletemovie/14
    @DeleteMapping("/deletemovie/{id}")
    public ResponseEntity<String> deleteMovie(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            movieService.deleteMovie(id, token);
            return ResponseEntity.ok("Movie deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
