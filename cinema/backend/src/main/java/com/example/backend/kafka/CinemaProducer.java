package com.example.backend.kafka;

import com.example.backend.proto.CinemaProtos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;


@Component
public class CinemaProducer {
    @Autowired
    private KafkaTemplate<Long, CinemaProtos.Cinema> cinemaKafkaTemplate;

    public void sendMessage(CinemaProtos.Cinema cinema) {

        cinemaKafkaTemplate.send("cinema", cinema);
    }

}
