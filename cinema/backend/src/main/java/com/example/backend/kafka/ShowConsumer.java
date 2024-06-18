package com.example.backend.kafka;

import com.example.backend.proto.ShowProtos;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ShowConsumer {

    @KafkaListener(topics = "shows", groupId = "show-group")
    public void consume(ConsumerRecord<Long, ShowProtos.Show> record) {
        System.out.println("**********************************");
        System.out.println(record.value());
        System.out.println("====================================");
        log.info("Consumed message: {}", record.value());
    }
}
