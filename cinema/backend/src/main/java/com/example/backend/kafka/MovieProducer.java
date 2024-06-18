package com.example.backend.kafka;



import com.example.backend.proto.MovieProtos;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class MovieProducer {
    @Autowired
    private KafkaTemplate<Long, MovieProtos.Movie> movieKafkaTemplate;

    public void sendMessage(MovieProtos.Movie movie) {

        movieKafkaTemplate.send("movie", movie);
    }

}
