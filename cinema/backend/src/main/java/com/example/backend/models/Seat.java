package com.example.backend.models;
import jakarta.persistence.*;
import lombok.*;


@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name="section")
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sectionId;
    private Integer columns;
    @Column(name = "num_rows")
    private Integer numRows;
    private Integer startColumnNumber;
    private Integer endColumnNumber;
    private String startRowNumber;
    private String endRowNumber;

    @ManyToOne
    @JoinColumn(name = "id", nullable = false)
    private User user;

}
