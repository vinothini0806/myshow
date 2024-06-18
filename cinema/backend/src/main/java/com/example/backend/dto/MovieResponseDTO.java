package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Long hours;
    private Long minutes;
    private Date releaseDate;
    private String language;
    private String fileName;
    private byte[] imageData;

}
