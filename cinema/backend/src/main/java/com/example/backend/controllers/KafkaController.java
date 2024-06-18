package com.example.backend.controllers;

import com.example.backend.dto.KafkaMovieDTO;
import com.example.backend.service.KafkaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class KafkaController {

    private final KafkaService kafkaService;

    @PostMapping("/kafka")
    public ResponseEntity<String> createUser(@RequestBody KafkaMovieDTO kafkaMovieDTO) {
        System.out.println(kafkaMovieDTO);
        kafkaService.processMovie(kafkaMovieDTO);
        return new ResponseEntity<>("User published successfully", HttpStatus.OK);
    }
}