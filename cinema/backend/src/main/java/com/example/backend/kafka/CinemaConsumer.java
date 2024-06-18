package com.example.backend.kafka;

import com.example.backend.proto.MovieProtos;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class CinemaConsumer {

    @KafkaListener(topics = "cinema", groupId = "cinema-group")
    public void consume(ConsumerRecord<Long, MovieProtos.Movie> record) {
        System.out.println("**********************************");
        System.out.println(record.value());
        System.out.println("====================================");
        log.info("Consumed message: {}", record.value());
    }
}
