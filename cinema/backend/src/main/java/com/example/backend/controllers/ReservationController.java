package com.example.backend.controllers;

import com.example.backend.dto.*;
import com.example.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
public class ReservationController {
    private final BookingService bookingService;

    @GetMapping("/viewbooking/{id}")
    public ResponseEntity<List<BookingResponseDTO>> viewBookings(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) throws Exception {

        List<BookingResponseDTO> bookingList = bookingService.getBookingForShow(token,id);
        return ResponseEntity.ok(bookingList);

    }
}
