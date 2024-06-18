

package com.example.backend.kafka;

import com.example.backend.proto.SeatProtos;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class SeatConsumer {

    @KafkaListener(topics = "seat", groupId = "seat-group")
    public void consume(ConsumerRecord<Long, SeatProtos.Seat> record) {
        System.out.println("**********************************");
        System.out.println(record.value());
        System.out.println("====================================");
        log.info("Consumed message: {}", record.value());
    }
}
