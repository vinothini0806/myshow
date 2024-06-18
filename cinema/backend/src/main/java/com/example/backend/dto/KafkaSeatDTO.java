package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KafkaSeatDTO {
    private Long sectionId;
    private Integer columns;
    private Integer numRows;
    private Integer startColumnNumber;
    private Integer endColumnNumber;
    private String startRowNumber;
    private String endRowNumber;
    private Long id;
}
