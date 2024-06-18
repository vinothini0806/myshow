package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowCreateRequestDTO {
    private Date showDate;
    private Time showTime;
    private Long price;
    private Long movieId;
}
