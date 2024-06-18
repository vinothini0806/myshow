package com.example.backend.controllers;


import com.example.backend.dto.*;
import com.example.backend.models.Seat;
import com.example.backend.service.KafkaService;
import com.example.backend.service.SeatService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
public class SeatController {
    private final SeatService seatService;
    private final KafkaService kafkaService;
    @PostMapping("/createseat")
    public ResponseEntity<String> createseat(
            @RequestHeader("Authorization") String token,
            @RequestBody SeatRequestDTO seatRequestDTO) throws IOException {
        try {
            Seat seat = seatService.createSeat(token, seatRequestDTO);
            if(seat != null) {
                KafkaSeatDTO kafkaSeatDTO = new KafkaSeatDTO();
                kafkaSeatDTO.setSectionId(seat.getSectionId());
                kafkaSeatDTO.setColumns(seat.getColumns());
                kafkaSeatDTO.setNumRows(seat.getNumRows());
                kafkaSeatDTO.setStartColumnNumber(seat.getStartColumnNumber());
                kafkaSeatDTO.setEndColumnNumber(seat.getEndColumnNumber());
                kafkaSeatDTO.setStartRowNumber(seat.getStartRowNumber());
                kafkaSeatDTO.setEndRowNumber(seat.getEndRowNumber());
                kafkaSeatDTO.setId(seat.getUser().getId());
                kafkaService.processSeat(kafkaSeatDTO);
            }
            return ResponseEntity.ok("Seat map created successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/viewseats")
    public ResponseEntity<List<SeatResponseDTO>> viewSeat(
            @RequestHeader("Authorization") String token) throws Exception {

            List<SeatResponseDTO> sectionList = seatService.viewSeat(token);
            return ResponseEntity.ok(sectionList);

    }

    @PutMapping("/updateseat")
    public ResponseEntity<String> updateSeat(
            @RequestHeader("Authorization") String token,
            @RequestParam Long id,
            @RequestBody List<SeatResponseDTO> seatResponseDTOList
    ) throws Exception {

        List<Seat> sectionList = seatService.updateSeat(token,id,seatResponseDTOList);
        if (!sectionList.isEmpty()){
            return ResponseEntity.ok("Seat map updated successfully.");
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seat not found.");
        }

    }
}