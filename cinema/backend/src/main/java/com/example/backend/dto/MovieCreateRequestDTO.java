package com.example.backend.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieCreateRequestDTO {
    private String name;
    private String description;
    private Long hours;
    private Long minutes;
    private Date releaseDate;
    private String language;
}
