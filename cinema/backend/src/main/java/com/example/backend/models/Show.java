package com.example.backend.models;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.util.Date;


@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name="shows")
public class Show {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long showId;
    private Date showDate;
    private Time showTime;
    private Long price;

    @ManyToOne
    @JoinColumn(name = "movie_id",nullable = false)
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "id",nullable = false)
    private User user;

}
