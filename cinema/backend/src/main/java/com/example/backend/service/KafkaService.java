package com.example.backend.service;

import com.example.backend.dto.KafkaCinemaDTO;
import com.example.backend.dto.KafkaMovieDTO;
import com.example.backend.dto.KafkaSeatDTO;
import com.example.backend.dto.KafkaShowDTO;
import com.example.backend.kafka.CinemaProducer;
import com.example.backend.kafka.MovieProducer;
import com.example.backend.kafka.SeatProducer;
import com.example.backend.kafka.ShowProducer;
import com.example.backend.proto.CinemaProtos;
import com.example.backend.proto.MovieProtos;
import com.example.backend.proto.SeatProtos;
import com.example.backend.proto.ShowProtos;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;


@Service
@RequiredArgsConstructor
public class KafkaService {

    private final MovieProducer movieProducer;
    private final ShowProducer showProducer;
    private final SeatProducer seatProducer;
    private final CinemaProducer cinemaProducer;

    public void processMovie(KafkaMovieDTO kafkaMovieDTO) {

        String releaseDateStr = formatReleaseDate(kafkaMovieDTO.getReleaseDate());

        MovieProtos.Movie movie = MovieProtos.Movie.newBuilder()
                .setId(kafkaMovieDTO.getMovieId())
                .setName(kafkaMovieDTO.getName())
                .setReleaseDate(releaseDateStr)
                .setDescription(kafkaMovieDTO.getDescription())
                .setHours(kafkaMovieDTO.getHours())
                .setMinutes(kafkaMovieDTO.getMinutes())
                .setLanguage(kafkaMovieDTO.getLanguage())
                .setImageData(com.google.protobuf.ByteString.copyFrom(kafkaMovieDTO.getImageData()))
                .build();
        System.out.println(movie);
        movieProducer.sendMessage(movie);
    }
    private String formatReleaseDate(Date releaseDate) {
        if (releaseDate != null) {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
            return formatter.format(releaseDate);
        } else {
            return "";
        }
    }

    public void processSeat(KafkaSeatDTO kafkaSeatDTO) {

        SeatProtos.Seat seat = SeatProtos.Seat.newBuilder()
                .setSectionId(kafkaSeatDTO.getSectionId())
                .setColumns(kafkaSeatDTO.getColumns())
                .setNumRows(kafkaSeatDTO.getNumRows())
                .setStartColumnNumber(kafkaSeatDTO.getStartColumnNumber())
                .setEndColumnNumber(kafkaSeatDTO.getEndColumnNumber())
                .setStartRowNumber(kafkaSeatDTO.getStartRowNumber())
                .setEndRowNumber(kafkaSeatDTO.getEndRowNumber())
                .setId(kafkaSeatDTO.getId())
                .build();
        System.out.println(seat);
        seatProducer.sendMessage(seat);
    }
    public void processShow(KafkaShowDTO kafkaShowDTO) {
        String showDateStr = formatReleaseDate(kafkaShowDTO.getShowDate());
        ShowProtos.Show show = ShowProtos.Show.newBuilder()
                .setShowId(kafkaShowDTO.getShowId())
                .setMovieId(kafkaShowDTO.getMovieId())
                .setShowDate(showDateStr)
                .setShowTime(kafkaShowDTO.getShowTime().toString())
                .setSeatPrice(kafkaShowDTO.getPrice())
                .setCinemaUserId(kafkaShowDTO.getUserId())
                .build();
        System.out.println(show);
        showProducer.sendMessage(show);
    }

    public void processCinema(KafkaCinemaDTO kafkaCinemaDTO) {

        CinemaProtos.Cinema cinema = CinemaProtos.Cinema.newBuilder()
                .setCinemaId(kafkaCinemaDTO.getId())
                .setCinemaUserName(kafkaCinemaDTO.getName())
                .build();
        System.out.println(cinema);
        cinemaProducer.sendMessage(cinema);
    }

}
