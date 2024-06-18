package com.example.backend.service;

import com.example.backend.dto.SeatRequestDTO;
import com.example.backend.dto.SeatResponseDTO;

import com.example.backend.models.Seat;
import com.example.backend.models.User;
import com.example.backend.repository.SeatRepository;
import com.example.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatService {
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public Seat createSeat(String token, SeatRequestDTO seatRequestDTO) throws IOException {
        try {
            if (token.startsWith("Bearer")) {
                token = token.substring(7);
            }
            String username = jwtService.extractClaim(token, Claims::getSubject);
            Optional<User> users = userRepository.findByUsername(username);
            if (users.isEmpty()) {
                throw new Exception("User not found");
            }
            User user = userRepository.findById(users.get().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Seat seat = new Seat();
            seat.setUser(user);
            seat.setColumns(seatRequestDTO.getColumns());
            seat.setNumRows(seatRequestDTO.getNumRows());
            seat.setStartColumnNumber(seatRequestDTO.getStartColumnNumber());
            seat.setEndColumnNumber(seatRequestDTO.getEndColumnNumber());
            seat.setStartRowNumber(seatRequestDTO.getStartRowNumber());
            seat.setEndRowNumber(seatRequestDTO.getEndRowNumber());

            // Save the Movie object to the database
            return seatRepository.save(seat);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<SeatResponseDTO> viewSeat(String token) throws Exception {
        if (token.startsWith("Bearer")) {
            token = token.substring(7);
        }
        String username = jwtService.extractClaim(token, Claims::getSubject);
        Optional<User> users = userRepository.findByUsername(username);
        if (users.isEmpty()) {
            throw new Exception("User not found");
        }
        List<Seat> sections = seatRepository.findByUserId(users.get().getId());

        if (!sections.isEmpty()) {
            return sections.stream()
                    .map(section -> new SeatResponseDTO(section.getSectionId(),section.getColumns(), section.getNumRows(), section.getStartColumnNumber(),section.getEndColumnNumber(),section.getStartRowNumber(),
                            section.getEndRowNumber()))
                    .collect(Collectors.toList());

        } else {
            throw new IllegalArgumentException("sections  not found");
        }
    }

    public List<Seat> updateSeat(String token, long id, List<SeatResponseDTO>  seatResponseDTO) throws Exception {
        if (token.startsWith("Bearer")) {
            token = token.substring(7);
        }
        String username = jwtService.extractClaim(token, Claims::getSubject);
        Optional<User> users = userRepository.findByUsername(username);
        if (users.isEmpty()) {
            throw new Exception("User not found");
        }
        List<Seat> sections = seatRepository.findByUserId(id);

        if (sections.isEmpty()){
            throw new Exception("Sections not found");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Seat> sectionList = sections;
        for (var i = 0;i<sectionList.size();i++) {
            Seat seat = sectionList.get(i);
            SeatResponseDTO seatResponseDTO1 = seatResponseDTO.get(i);
            if (seat.getColumns() != null){
                seat.setColumns(seatResponseDTO1.getColumns());
            }

            if (seat.getNumRows() != null){
                seat.setNumRows(seatResponseDTO1.getNumRows());
            }

            if (seat.getStartRowNumber() != null){
                seat.setStartRowNumber(seatResponseDTO1.getStartRowNumber() );
            }

            if (seat.getEndColumnNumber()  != null){
                seat.setEndColumnNumber(seatResponseDTO1.getEndColumnNumber() );
            }
            if (seat.getStartRowNumber()  != null){
                seat.setStartRowNumber(seatResponseDTO1.getStartRowNumber() );
            }
            if (seat.getEndRowNumber()  != null){
                seat.setEndRowNumber(seatResponseDTO1.getEndRowNumber() );
            }
            seat.setUser(user);
            seatRepository.save(seat);

        }
        return sectionList;
    }



}
