package com.example.backend.controllers;

import com.example.backend.dto.*;
import com.example.backend.models.Show;
import com.example.backend.service.KafkaService;
import com.example.backend.service.ShowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
public class ShowController {
    private final ShowService showService;
    private final KafkaService kafkaService;
    @PostMapping("/createshow")
    public ResponseEntity<String> createshow(
            @RequestHeader("Authorization") String token,
            @RequestBody ShowCreateRequestDTO showCreateRequestDTO) throws IOException {
        try {
            Show show = showService.createShow(token, showCreateRequestDTO);
            if(show != null) {
                KafkaShowDTO kafkaShowDTO = new KafkaShowDTO();
                kafkaShowDTO.setShowId(show.getShowId());
                kafkaShowDTO.setShowDate(show.getShowDate());
                kafkaShowDTO.setShowTime(show.getShowTime());
                kafkaShowDTO.setPrice(show.getPrice());
                kafkaShowDTO.setMovieId(show.getMovie().getMovieId());
                kafkaShowDTO.setUserId(show.getUser().getId());
                kafkaService.processShow(kafkaShowDTO);
            }
            return ResponseEntity.ok("show created successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/viewshows")
    public ResponseEntity<List<ShowResponseDTO>> viewShow(
            @RequestHeader("Authorization") String token) throws Exception {

        List<ShowResponseDTO> showList = showService.viewShow(token);
        return ResponseEntity.ok(showList);

    }
}
